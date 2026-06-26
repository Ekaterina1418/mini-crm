import { requireAuth } from "~/server/utils/requireAuth";

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);

  return { success: true, user };
});
