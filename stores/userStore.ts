import { defineStore } from 'pinia';
import type { AuthResponse, AuthUser } from '~/types/cardsTypes';
import { useFetch } from '#imports';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null);

  const isLoggedIn = computed(() => !!user.value);

 const register = async (
  email: string,
  password: string,
  name: string
) => {
  const { data, error } = await useFetch<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: { email, password, name },
    credentials: "include",
  });

  return { data, error };
};

 const login = async (email: string, password: string) => {
  const { data, error } = await useFetch<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: { email, password },
    credentials: "include",
  });
  return { data, error };
};

 const refreshToken = async () => {
    const res = await useFetch<AuthResponse>("/api/auth/refresh", {
    method: "POST",
    credentials: "include",
  });
  if (res.data.value?.success && res.data.value.user) {
    user.value = res.data.value.user;
  }

  return res;
};

 const me = async () => {
  return await useFetch<AuthResponse>("/api/auth/me", {
    credentials: "include",
  });
};
const logout = async () => {
	user.value = null;
}
 return {
    user,
    isLoggedIn,
    register,
    login,
    refreshToken,
    me,
    logout,
  };

})