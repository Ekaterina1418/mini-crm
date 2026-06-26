import prisma from '~/server/db/prisma';
import { requireAuth } from "~/server/utils/requireAuth";

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const users = await prisma.user.findMany();
  return { users };
});
