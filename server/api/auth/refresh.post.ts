import { getCookie, setCookie, createError } from "h3";
import prisma from "~/server/db/prisma";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import { hashToken } from "~/utils/hash";

const JWT_SECRET = process.env.JWT_SECRET || "";
const ACCESS_TTL_SECONDS = 60 * 60;
const REFRESH_TTL_SECONDS = 7 * 24 * 3600;
const REFRESH_TTL_MS = REFRESH_TTL_SECONDS * 1000;

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
  try {
    if (!JWT_SECRET) {
      throw createError({
        statusCode: 500,
        statusMessage: "JWT secret is not configured",
      });
    }

    const refreshToken = getCookie(event, "refresh_token");
    if (!refreshToken) {
      throw createError({
        statusCode: 401,
        statusMessage: "Refresh token is missing",
      });
    }

    const tokenHash = hashToken(refreshToken);
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { tokenHash },
    });

    if (!tokenRecord) {
      clearAuthCookies(event);
      throw createError({
        statusCode: 401,
        statusMessage: "Refresh token is invalid",
      });
    }

    if (tokenRecord.expiresAt < new Date()) {
      await prisma.refreshToken.delete({ where: { id: tokenRecord.id } });
      clearAuthCookies(event);
      throw createError({
        statusCode: 401,
        statusMessage: "Refresh token is expired",
      });
    }

    const user = await prisma.authUser.findUnique({
      where: { id: tokenRecord.userId },
      select: { id: true, email: true, name: true, role: true, active: true },
    });

    if (!user) {
      await prisma.refreshToken.delete({ where: { id: tokenRecord.id } });
      clearAuthCookies(event);
      throw createError({
        statusCode: 401,
        statusMessage: "User not found",
      });
    }

    if (!user.active) {
      await prisma.refreshToken.delete({ where: { id: tokenRecord.id } });
      clearAuthCookies(event);
      throw createError({
        statusCode: 403,
        statusMessage: "User is inactive",
      });
    }

    const newRefresh = randomBytes(48).toString("hex");
    const accessToken = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "60m",
    });

    await prisma.$transaction([
      prisma.refreshToken.delete({ where: { id: tokenRecord.id } }),
      prisma.refreshToken.create({
        data: {
          tokenHash: hashToken(newRefresh),
          userId: user.id,
          expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
        },
      }),
    ]);

    setCookie(event, "auth_token", accessToken, {
      httpOnly: true,
      maxAge: ACCESS_TTL_SECONDS,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    setCookie(event, "refresh_token", newRefresh, {
      httpOnly: true,
      maxAge: REFRESH_TTL_SECONDS,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  } catch (err) {
    console.error("Refresh error:", err);

    if (err && typeof err === "object" && "statusCode" in err) {
      throw err;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
    });
  }
});
