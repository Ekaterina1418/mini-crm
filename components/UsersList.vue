<template>
  <div class="list">
    <section class="list-users">
      <div class="section-heading">
        <h3 class="title">Активные контакты</h3>
        <span>{{ activeUsers.length }}</span>
      </div>
      <div v-if="activeUsers.length" class="group">
        <UserItem
          v-for="item in activeUsers"
          :key="item.id"
          :user="item"
          @select="onSelectUser"
        />
      </div>
      <div v-else class="empty"><h3>Активных контактов пока нет</h3></div>
    </section>
    <section class="list-users">
      <div class="section-heading">
        <h3 class="title">Неактивные контакты</h3>
        <span>{{ inactiveUsers.length }}</span>
      </div>
      <div v-if="inactiveUsers.length" class="group">
        <UserItem
          v-for="item in inactiveUsers"
          :key="item.id"
          :user="item"
          @select="onSelectUser"
        />
      </div>
      <div v-else class="empty"><h3>Неактивных контактов пока нет</h3></div>
    </section>
  </div>
</template>
<script setup lang="ts">
import type { Card } from "~/types/cardsTypes";
const props = defineProps<{
  users: Card[];
}>();
const emit = defineEmits<{
  (e: "select", id: string): void;
}>();
const onSelectUser = (id: string) => {
  emit("select", id);
};
const activeUsers = computed(() => props.users?.filter(u => u.active) || []);
const inactiveUsers = computed(() => props.users?.filter(u => !u.active) || []);

</script>

<style scoped>
.list {
  display: flex;
  flex-direction: column;
  gap: 28px;
  height: 100%;
}
.group {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}
.list-users {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 10px;
}
.title {
  color: var(--color-text);
  font-size: 20px;
  font-weight: 700;
}
.section-heading span {
  border-radius: 999px;
  padding: 3px 9px;
  background: var(--color-surface);
  color: var(--color-text-muted);
  font-size: 13px;
  font-weight: 700;
}
.empty {
  display: flex;
  min-height: 140px;
  justify-content: center;
  align-items: center;
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text-muted);
  text-align: center;
}
.empty h3 {
  font-size: 15px;
  font-weight: 600;
}
</style>
