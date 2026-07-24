<template>
  <div class="list">
    <section class="list-contacts">
      <div class="section-heading">
        <h3 class="title">Активные контакты</h3>
        <span>{{ activeContacts.length }}</span>
      </div>
      <div v-if="activeContacts.length" class="group">
        <ContactItem
          v-for="item in activeContacts"
          :key="item.id"
          :contact="item"
          @select="onSelectContact"
        />
      </div>
      <div v-else class="empty">
        <h3>Активных контактов пока нет</h3>
      </div>
    </section>
    <section class="list-contacts">
      <div class="section-heading">
        <h3 class="title">Неактивные контакты</h3>
        <span>{{ inactiveContacts.length }}</span>
      </div>
      <div v-if="inactiveContacts.length" class="group">
        <ContactItem
          v-for="item in inactiveContacts"
          :key="item.id"
          :contact="item"
          @select="onSelectContact"
        />
      </div>
      <div v-else class="empty">
        <h3>Неактивных контактов пока нет</h3>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Contact } from "~/types/contactTypes";

const props = defineProps<{
  contacts: Contact[];
}>();

const emit = defineEmits<{
  (e: "select", id: string): void;
}>();

const onSelectContact = (id: string) => {
  emit("select", id);
};

const activeContacts = computed(() =>
  props.contacts?.filter((contact) => contact.active) || [],
);
const inactiveContacts = computed(() =>
  props.contacts?.filter((contact) => !contact.active) || [],
);
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

.list-contacts {
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
