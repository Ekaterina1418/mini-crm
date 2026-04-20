<template>
  <div class="item" :class="{ inactive: !user.active }" @click="select">
    <img v-if="user.avatarUrl" :src="user.avatarUrl" :alt="user.name" />
    <img v-else src="../assets//image/avatar.png" alt="Фото отсутствует"/>
    <h2><span class="label">Имя:</span>{{ user.name }}</h2>
    <h3><span class="label">Почта:</span>{{ user.email }}</h3>
    <p><span class="label">Номер телефона:</span>{{ user.phone }}</p>
    <p><span class="label">Роль:</span>{{ user.role }}</p>
  </div>
</template>
<script setup lang="ts">
import type { Card } from "~/types/cardsTypes";

const props = defineProps<{
  user: Card;
}>();
const emit = defineEmits<{
  (e: "select", id: string): void;
}>();

const select = () => {
  emit("select", props.user.id);
};
</script>

<style scoped>
.item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 0 0 calc(25% - 15px);
   min-width: 200px;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 12px;
  cursor: pointer;
}
.item img {
  height: auto;
  border-radius: 10px;
}
.item.inactive {
  opacity: 0.5;
}
.label {
  font-weight: 600;
  margin-right: 6px;
}
</style>
