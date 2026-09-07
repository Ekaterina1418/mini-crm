import prisma from "~/server/db/prisma";
import { requireAuth } from "~/server/utils/requireAuth";

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const contacts = await prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
  });

  return { contacts };
});
