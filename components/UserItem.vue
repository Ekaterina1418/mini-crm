<template>
  <article class="item" :class="{ inactive: !user.active }" @click="select">
    <div class="item__header">
      <img v-if="user.avatarUrl" :src="user.avatarUrl" :alt="user.name" />
      <img v-else src="../assets//image/avatar.png" alt="Фото отсутствует" />
      <span class="status" :class="{ 'status--inactive': !user.active }">
        {{ user.active ? "Активен" : "Неактивен" }}
      </span>
    </div>
    <div class="item__body">
      <h2>{{ user.name }}</h2>
      <p class="email">{{ user.email }}</p>
      <dl>
        <div>
          <dt>Телефон</dt>
          <dd>{{ user.phone || "Не указан" }}</dd>
        </div>
        <div>
          <dt>Роль</dt>
          <dd>{{ user.role || "Не указана" }}</dd>
        </div>
        <div>
          <dt>Отдел</dt>
          <dd>{{ user.department || "Не указан" }}</dd>
        </div>
      </dl>
    </div>
  </article>
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
  gap: 14px;
  min-width: 240px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 14px;
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.15s ease;
}

.item:hover {
  border-color: var(--color-primary);
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.1);
  transform: translateY(-1px);
}

.item__header {
  position: relative;
}

.item img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: var(--radius-md);
  background: var(--color-surface-muted);
}

.item__body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.item.inactive {
  background: #fbfcfd;
}

.item h2 {
  color: var(--color-text);
  font-size: 18px;
  font-weight: 700;
  line-height: 1.2;
}

.email {
  color: var(--color-text-muted);
  font-size: 14px;
}

dl {
  display: grid;
  gap: 8px;
}

dl div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  border-top: 1px solid var(--color-border);
  padding-top: 8px;
}

dt {
  color: var(--color-text-muted);
  font-size: 13px;
  font-weight: 600;
}

dd {
  color: var(--color-text);
  font-size: 13px;
  text-align: right;
}

.status {
  position: absolute;
  right: 10px;
  top: 10px;
  border-radius: 999px;
  padding: 4px 8px;
  background: rgba(22, 163, 74, 0.12);
  color: var(--color-success);
  font-size: 12px;
  font-weight: 700;
}

.status--inactive {
  background: rgba(105, 117, 134, 0.14);
  color: var(--color-text-muted);
}
</style>
