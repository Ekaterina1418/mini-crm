import prisma from '~/server/db/prisma';

export default defineEventHandler(async (event) => {
  const users = await prisma.user.findMany();
   console.log(users);
  return { users };
});
