<template>
  <div class="field">
    <label>{{ label }}</label>
    <input
      :type="type"
      v-model="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  type: string;
  placeholder?: string;
  disabled?: boolean;
}>();

const modelValue = defineModel<string | null>();
</script>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field label {
  color: var(--color-text-muted);
  font-size: 14px;
  font-weight: 600;
}

.field input {
  min-height: 40px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  outline: none;
  padding: 8px 12px;
  background: var(--color-surface);
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.field input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
}
</style>
