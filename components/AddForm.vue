<template>
  <button class="add-button" type="button" @click="$emit('click')">
    <Icon name="tabler:plus" size="20" />
    <span>Добавить контакт</span>
  </button>
</template>

<script setup lang="ts">
defineEmits<{
  (e: "click"): void;
}>();
</script>

<style scoped>
.add-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 40px;
  border-radius: var(--radius-md);
  padding: 10px 16px;
  background: var(--color-primary);
  color: #fff;
  font-weight: 700;
  transition:
    background-color 0.15s ease,
    box-shadow 0.15s ease;
}

.add-button:hover {
  background: var(--color-primary-hover);
  box-shadow: 0 10px 22px rgba(37, 99, 235, 0.22);
}
</style>
