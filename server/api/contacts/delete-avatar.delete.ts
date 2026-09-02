import { createError, readBody } from "h3";
import { rm } from "node:fs/promises";
import path from "node:path";
import prisma from "~/server/db/prisma";
import { requireAuth } from "~/server/utils/requireAuth";

export default defineEventHandler(async (event) => {
  await requireAuth(event);

  const body = await readBody<{ avatarUrl?: unknown }>(event);

  if (typeof body.avatarUrl !== "string") {
    throw createError({
      statusCode: 400,
      statusMessage: "Avatar URL is required",
    });
  }
  const fileName = path.posix.basename(body.avatarUrl);
  if (body.avatarUrl !== `/uploads/${fileName}`) {
    throw createError({ statusCode: 400, statusMessage: "Invalid avatar URL" });
  }

  const contactUsingAvatar = await prisma.contact.findFirst({
    where: { avatarUrl: body.avatarUrl },
  });
  if (contactUsingAvatar) {
    throw createError({
      statusCode: 409,
      statusMessage: "Avatar is still in use",
    });
  }
  const filePath = path.join(process.cwd(), "public", "uploads", fileName);
  await rm(filePath, { force: true });
  return { success: true };
});
