import { readBody } from "h3";
import prisma from "~/server/db/prisma";
import { requireAuth } from "~/server/utils/requireAuth";

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const id = event.context.params?.id;
  const body = await readBody(event);
  const update = await prisma.user.update({
    where: { id },
    data: {
      ...body,
    },
  });
  return { success: true, user: { ...update, id } };
});
