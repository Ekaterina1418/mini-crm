import { nanoid } from "nanoid";
import { readBody } from "h3";
import prisma from "~/server/db/prisma";
import { requireAuth } from "~/server/utils/requireAuth";

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const body = await readBody(event);

  const created = await prisma.user.create({
    data: {
      id: nanoid(),
      name: body.name,
      email: body.email,
      role: body.role ?? null,
      phone: body.phone ?? null,
      department: body.department ?? null,
      active: body.active ?? true,
      avatarUrl: body.avatarUrl ?? null,
    },
  });

  event.node.res.statusCode = 201;
  return { success: true, user: created };
});
