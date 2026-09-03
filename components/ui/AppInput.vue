<template>
  <div class="field" :class="{ 'field--invalid': error }">
    <label>{{ label }}</label>
    <input
      :id="inputId"
      v-model="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-invalid="Boolean(error)"
      :aria-describedby="error ? `${inputId}-error` : undefined"
    >
    <p v-if="error" :id="`${inputId}-error`" class="field__error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  type: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}>();

const modelValue = defineModel<string | null>();
const inputId = useId();
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

.field--invalid input {
  border-color: var(--color-danger, #dc2626);
}

.field__error {
  margin: 0;
  color: var(--color-danger, #dc2626);
  font-size: 12px;
}
</style>
