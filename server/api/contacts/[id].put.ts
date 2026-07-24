import { createError, readBody } from "h3";
import prisma from "~/server/db/prisma";
import { requireAuth } from "~/server/utils/requireAuth";

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const id = event.context.params?.id;

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Contact ID is required",
    });
  }

  const body = await readBody(event);

  const existing = await prisma.contact.findFirst({
    where: { id, ownerId: user.id },
  });

  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: "Contact not found",
    });
  }

  const updated = await prisma.contact.update({
    where: { id },
    data: {
      name: body.name,
      email: body.email,
      role: body.role ?? null,
      phone: body.phone ?? null,
      department: body.department ?? null,
      active: body.active ?? true,
      avatarUrl: body.avatarUrl ?? null,
    },
  });

  return { success: true, contact: updated };
});
