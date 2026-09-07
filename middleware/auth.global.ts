import { useAuthStore } from "~/stores/userStore";


export default defineNuxtRouteMiddleware(async (to) => {
  const store = useAuthStore();
  const publicRoutes = ["/login", "/register"];
  if (publicRoutes.includes(to.path)) return;

  try {
    await store.me();
    return;
  } catch (error: unknown) {
    const statusCode =
      error && typeof error === "object" && "statusCode" in error
        ? Number(error.statusCode)
        : undefined;

    if (statusCode === 401) {
      try {
        const refreshResult = await store.refreshToken();
        if (refreshResult.success) {
          await store.me();
          return;
        }
      } catch {
         console.error("Не удалось обновить сессию пользователя");
      }
    }
  }
  await store.logout();
  return navigateTo("/login", { replace: true });
});
