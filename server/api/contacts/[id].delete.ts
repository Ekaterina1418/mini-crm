import { createError } from "h3";
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

  const existing = await prisma.contact.findFirst({
    where: { id, ownerId: user.id },
  });

  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: "Contact not found",
    });
  }

  await prisma.contact.delete({
    where: { id },
  });

  return { success: true, deletedId: id };
});
