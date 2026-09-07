import { defineStore } from "pinia";
import type { AuthResponse, AuthUser } from "~/types/contactTypes";


export const useAuthStore = defineStore("auth", () => {
  const user = ref<AuthUser | null>(null);

  const isLoggedIn = computed(() => !!user.value);

  const register = async (email: string, password: string, name: string) => {
    return await $fetch<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: { email, password, name },
      credentials: "include",
    });
  };

  const login = async (email: string, password: string) => {
    try {
      const data = await $fetch<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: { email, password },
        credentials: "include",
      });
      if (data?.success && data.user) {
        user.value = data.user;
      }
      return data;
    } catch (error) {
      user.value = null;
      throw error;
    }
  };

  const refreshToken = async () => {
    const res = await $fetch<AuthResponse>("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });
    if (res.success && res.user) {
      user.value = res.user;
    }

    return res;
  };

  const me = async () => {
    const data = await $fetch<AuthResponse>("/api/auth/me", {
      credentials: "include",
    });

    if (data.success && data.user) {
      user.value = data.user;
    }

    return data;
  };
  const logout = async () => {
    const res = await $fetch<AuthResponse>("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    user.value = null;
    return res;
  };
  const deleteUser = async () => {
    const res = await $fetch<{ success: boolean; deletedId?: string }>(
      "/api/auth/me",
      {
        method: "DELETE",
        credentials: "include",
      },
    );
    if (res.success) {
      user.value = null;
    }
    return res;
  };
  return {
    user,
    isLoggedIn,
    register,
    login,
    refreshToken,
    me,
    logout,
    deleteUser,
  };
});
