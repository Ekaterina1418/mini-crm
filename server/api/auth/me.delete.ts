import { setCookie } from "h3";
import prisma from "~/server/db/prisma";
import { requireAuth } from "~/server/utils/requireAuth";

const clearAuthCookies = (event: Parameters<typeof setCookie>[0]) => {
  setCookie(event, "auth_token", "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  setCookie(event, "refresh_token", "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
};

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);

  await prisma.$transaction([
    prisma.refreshToken.deleteMany({ where: { userId: user.id } }),
    prisma.authUser.delete({ where: { id: user.id } }),
  ]);

  clearAuthCookies(event);

  return { success: true, deletedId: user.id };
});
