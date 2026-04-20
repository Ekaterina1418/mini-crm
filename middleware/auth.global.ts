import { useAuthStore } from "~/stores/userStore";

export default defineNuxtRouteMiddleware(async (to) => {
  const store = useAuthStore();
  const publicRoutes = ["/login", "/register"];
  if (publicRoutes.includes(to.path)) return;

  let { data, error } = await store.me();

  if (error.value?.status === 401) {
    const refreshRes = await store.refreshToken();
    if (refreshRes.data.value?.success) {
      ({ data, error } = await store.me());
    }
  }

  const isUnauthorized =
    error.value?.status === 401 ||
    error.value?.status === 403 ||
    !data.value?.success;

  if (isUnauthorized) {
    await store.logout();
    return navigateTo("/login", { replace: true });
  }
});
