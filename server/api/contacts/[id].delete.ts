import { createError } from "h3";
import { rm } from "node:fs/promises";
import path from "node:path";
import prisma from "~/server/db/prisma";
import { requireAdmin } from "~/server/utils/requireAdmin";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const id = event.context.params?.id;

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Contact ID is required",
    });
  }

  const existing = await prisma.contact.findUnique({
    where: { id },
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
  if (existing.avatarUrl) {
    const fileName = path.posix.basename(existing.avatarUrl);
    if (existing.avatarUrl === `/uploads/${fileName}`) {
      try {
        await rm(path.join(process.cwd(), "public", "uploads", fileName), {
          force: true,
        });
      } catch (error) {
        console.error("Не удалось удалить аватар контакта:", error);
      }
    }
  }
  return { success: true, deletedId: id };
});
