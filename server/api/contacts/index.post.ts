import { nanoid } from "nanoid";
import { createError, readBody } from "h3";
import { Prisma } from "@prisma/client";
import prisma from "~/server/db/prisma";
import { requireAdmin } from "~/server/utils/requireAdmin";
import {
  contactInputSchema,
  formatContactValidationError,
} from "~/shared/validation/contacts";

export default defineEventHandler(async (event) => {
  const user = await requireAdmin(event);
  const result = contactInputSchema.safeParse(await readBody(event));

  if (!result.success) {
    throw createError({
      statusCode: 422,
      statusMessage: "Invalid contact data",
      data: { errors: formatContactValidationError(result.error) },
    });
  }

  const body = result.data;

  let created;
  try {
    created = await prisma.contact.create({
      data: {
        id: nanoid(),
        name: body.name,
        email: body.email,
        role: body.role ?? null,
        phone: body.phone ?? null,
        department: body.department ?? null,
        active: body.active,
        avatarUrl: body.avatarUrl ?? null,
        ownerId: user.id,
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
  event.node.res.statusCode = 201;
  return { success: true, contact: created };
});
