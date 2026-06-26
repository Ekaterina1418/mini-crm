import { getCookie, setCookie } from "h3";
import prisma from "~/server/db/prisma";
import { hashToken } from "~/utils/hash";

export default defineEventHandler(async (event) => {
  const refreshToken = getCookie(event, "refresh_token");
  if (refreshToken) {
    const tokenHash = hashToken(refreshToken);
    await prisma.refreshToken.deleteMany({ where: { tokenHash } });
  }
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
  return { success: true };
});
