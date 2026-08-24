import { createError, readBody } from "h3";
import prisma from "~/server/db/prisma";
import { Prisma } from "@prisma/client";
import { requireAuth } from "~/server/utils/requireAuth";
import {
  contactInputSchema,
  formatContactValidationError,
} from "~/shared/validation/contacts";

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
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

  const existing = await prisma.contact.findFirst({
    where: { id, ownerId: user.id },
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
  return { success: true, contact: updated };
});
