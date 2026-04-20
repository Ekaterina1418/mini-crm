import type { Card, FormClient } from "~/types/cardsTypes";

export const useCardStore = defineStore("card", () => {
  const cards = ref<Card[]>([]);
  const isVisible = ref(false);
  const selectedUserId = ref<string | null>(null);

  const fetchCards = async () => {
    try {
      const data = await $fetch<{ users: Card[] }>("/api/users");
      cards.value = data.users;
    } catch (err) {
      console.error("Error fetching cards:", err);
    }
  };

  const selectedUser = computed(() =>
    selectedUserId.value == null
      ? null
      : (cards.value.find((c) => c.id === selectedUserId.value) ?? null),
  );

  const selectUser = (id: string) => {
    selectedUserId.value = id;
    isVisible.value = true;
  };
  const newUser = async (form: FormClient) => {
    try {
      const data = await $fetch<{
        success: boolean;
        user: FormClient;
      }>("/api/users", {
        method: "POST",
        body: form,
      });
      if (data.success) {
        const user = data.user;
        cards.value.push({ ...user, id: user.id! });
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };
  const updateUser = async (form: FormClient) => {
    try {
      const data = await $fetch<{
        success: boolean;
        user: FormClient;
      }>(`/api/users/${form.id}`, {
        method: "PUT",
        body: form,
      });
      if (data.success) {
        const index = cards.value.findIndex((c) => c.id === form.id);
        if (index !== -1) {
          cards.value.splice(index, 1, { ...data.user } as Card);
        }
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
  const deleteUser = async () => {
    try {
      const data = await $fetch<{ success: boolean }>(
        `/api/users/${selectedUserId.value}`,
        { method: "DELETE" },
      );
      if (data.success) {
        cards.value = cards.value.filter((c) => c.id !== selectedUserId.value);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      close();
    }
  };
  const openModal = () => {
    selectedUserId.value = null;
    isVisible.value = true;
  };

  const close = () => {
    selectedUserId.value = null;
    isVisible.value = false;
  };

  return {
    cards,
    fetchCards,
    newUser,
    updateUser,
    deleteUser,
    isVisible,
    openModal,
    close,
    selectedUser,
    selectedUserId,
    selectUser,
  };
});
