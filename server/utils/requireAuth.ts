import { getCookie, createError, type H3Event } from "h3";
import jwt from "jsonwebtoken";
import prisma from "~/server/db/prisma";

export async function requireAuth(event: H3Event) {
  const JWT_SECRET = process.env.JWT_SECRET || "";
  if (!JWT_SECRET) {
    throw createError({
      statusCode: 500,
      statusMessage: "JWT secret is not configured",
    });
  }
  const token = getCookie(event, "auth_token");
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: "Not authenticated" });
  }
  let payload: jwt.JwtPayload;
  try {
    payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
  } catch {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid or expired token",
    });
  }
  const userId = String(payload.sub ?? "");
  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid token payload",
    });
  }
  const user = await prisma.authUser.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      active: true,
    },
  });
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "User not found" });
  }
  if (!user.active) {
    throw createError({ statusCode: 403, statusMessage: "User is inactive" });
  }
  return user;
}
