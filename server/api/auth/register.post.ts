import { readBody, createError } from "h3";
import prisma from "~/server/db/prisma";
import bcrypt from "bcryptjs";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { email, password, name } = body;

    const normalizedEmail = String(email ?? "").trim().toLowerCase();
    const normalizedPassword = String(password ?? "");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!normalizedEmail || !normalizedPassword) {
      throw createError({
        statusCode: 400,
        statusMessage: "Email and password are required",
      });
    }

    if (!emailRegex.test(normalizedEmail)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid email format",
      });
    }

    if (normalizedPassword.length < 8 || normalizedPassword.length > 128) {
      throw createError({
        statusCode: 400,
        statusMessage: "Password must be between 8 and 128 characters",
      });
    }

    const existing = await prisma.authUser.findUnique({
      where: { email: normalizedEmail },
    });
    if (existing) {
      throw createError({
        statusCode: 409,
        statusMessage: "User already exists",
      });
    }

    const passwordHash = await bcrypt.hash(normalizedPassword, 10);

    const user = await prisma.authUser.create({
      data: { email: normalizedEmail, passwordHash, name },
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
    console.error("Register error:", err);

    if (err && typeof err === "object" && "statusCode" in err) {
      throw err;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
    });
  }
});
