import { createError, type H3Event } from "h3";
import { requireAuth } from "~/server/utils/requireAuth";

export async function requireAdmin(event: H3Event) {
  const user = await requireAuth(event);

  if (user.role !== "admin") {
    throw createError({
      statusCode: 403,
      statusMessage: "Admin access required",
    });
  }
  return user;
}
