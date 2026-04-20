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
  gap: 8px;
}
.field input {
  outline: none;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 4px 8px;
}
</style>
