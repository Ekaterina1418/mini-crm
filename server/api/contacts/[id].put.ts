import { createError, readBody } from "h3";
import prisma from "~/server/db/prisma";
import { rm } from "node:fs/promises";
import path from "node:path";
import { Prisma } from "@prisma/client";
import { requireAdmin } from "~/server/utils/requireAdmin";
import {
  contactInputSchema,
  formatContactValidationError,
} from "~/shared/validation/contacts";

const deleteUploadedAvatar = async (avatarUrl: string | null) => {
  if (!avatarUrl) return;

  const fileName = path.posix.basename(avatarUrl);

  if (avatarUrl !== `/uploads/${fileName}`) {
    return;
  }
  const filePath = path.join(process.cwd(), "public", "uploads", fileName);

  try {
    await rm(filePath, { force: true });
  } catch (error) {
    console.error("Не удалось удалить старый аватар:", error);
  }
};

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const id = event.context.params?.id;

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Contact ID is required",
    });
  }

  const result = contactInputSchema.safeParse(await readBody(event));

  if (!result.success) {
    throw createError({
      statusCode: 422,
      statusMessage: "Invalid contact data",
      data: { errors: formatContactValidationError(result.error) },
    });
  }

  const body = result.data;

  const existing = await prisma.contact.findUnique({
    where: { id },
  });

  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: "Contact not found",
    });
  }
  let updated;
  try {
    updated = await prisma.contact.update({
      where: { id },
      data: {
        name: body.name,
        email: body.email,
        role: body.role ?? null,
        phone: body.phone ?? null,
        department: body.department ?? null,
        active: body.active,
        avatarUrl: body.avatarUrl ?? null,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw createError({
        statusCode: 409,
        statusMessage: "Contact email already exists",
        data: { errors: { email: "Контакт с таким email уже существует" } },
      });
    }
    throw error;
  }
  if (existing.avatarUrl && existing.avatarUrl !== updated.avatarUrl) {
    await deleteUploadedAvatar(existing.avatarUrl);
  }
  return { success: true, contact: updated };
});
