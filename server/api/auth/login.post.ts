import { readBody, setCookie, createError } from "h3";
import prisma from "~/server/db/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import { hashToken } from "~/utils/hash";

const JWT_SECRET = process.env.JWT_SECRET || "";
const ACCESS_TTL_SECONDS = 60 * 60;
const REFRESH_TTL_SECONDS = 7 * 24 * 3600;
const REFRESH_TTL_MS = REFRESH_TTL_SECONDS * 1000;

export default defineEventHandler(async (event) => {
  try {
    if (!JWT_SECRET) {
      throw createError({
        statusCode: 500,
        statusMessage: "JWT secret is not configured",
      });
    }

    const body = await readBody(event);
    const { email, password } = body;
    const normalizedEmail = String(email ?? "").trim().toLowerCase();
    const normalizedPassword = String(password ?? "");

    if (!normalizedEmail || !normalizedPassword) {
      throw createError({
        statusCode: 400,
        statusMessage: "Email and password are required",
      });
    }

    const user = await prisma.authUser.findUnique({
      where: { email: normalizedEmail },
    });
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid credentials",
      });
    }

    if (!user.active) {
      throw createError({
        statusCode: 403,
        statusMessage: "User is inactive",
      });
    }

    const ok = await bcrypt.compare(normalizedPassword, user.passwordHash);
    if (!ok) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid credentials",
      });
    }

    const accessToken = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "60m",
    });

    const refresh = randomBytes(48).toString("hex");

    await prisma.refreshToken.create({
      data: {
        tokenHash: hashToken(refresh),
        userId: user.id,
        expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
      },
    });

    setCookie(event, "auth_token", accessToken, {
      httpOnly: true,
      maxAge: ACCESS_TTL_SECONDS,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    setCookie(event, "refresh_token", refresh, {
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
        active: user.active,
      },
    };
  } catch (err) {
    console.error("Login error:", err);

    if (err && typeof err === "object" && "statusCode" in err) {
      throw err;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
    });
  }
});
