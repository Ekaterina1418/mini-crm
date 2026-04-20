<template>
  <div class="list">
    <section class="list-users">
      <h3 class="title">Активные пользователи</h3>
      <div v-if="activeUsers.length" class="group">
        <UserItem
          v-for="item in activeUsers"
          :key="item.id"
          :user="item"
          @select="onSelectUser"
        />
      </div>
      <div v-else class="empty"><h3>Нет неактивных пользователей</h3></div>
    </section>
    <section class="list-users">
      <h3 class="title">Неактивные пользователи</h3>
      <div v-if="inactiveUsers.length" class="group">
        <UserItem
          v-for="item in inactiveUsers"
          :key="item.id"
          :user="item"
          @select="onSelectUser"
        />
      </div>
      <div v-else class="empty"><h3>Нет неактивных пользователей</h3></div>
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
  gap: 20px;
  height: 100%;
}
.group {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.list-users {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 30px;
}
.title {
  font-size: 22px;
  font-weight: 500;
}
.empty {
  display: flex;
  min-height: 500px;
  justify-content: center;
  align-items: center;
}
</style>
