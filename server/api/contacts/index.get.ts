import prisma from "~/server/db/prisma";
import { requireAuth } from "~/server/utils/requireAuth";

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const contacts = await prisma.contact.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return { contacts };
});
