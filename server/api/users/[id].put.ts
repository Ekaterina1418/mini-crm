import prisma from "~/server/db/prisma";

export default defineEventHandler(async (event) => {
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
