<template>
  <div class="field">
    <input id="activeCheckbox" v-model="modelValue" type="checkbox" >
    <label for="activeCheckbox">
      {{ modelValue ? "Активный" : "Неактивный" }}
    </label>
  </div>
</template>

<script setup lang="ts">
const modelValue = defineModel<boolean>();
</script>

<style scoped>
.field {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--color-text-muted);
  font-size: 14px;
  font-weight: 600;
}

.field input {
  width: 18px;
  height: 18px;
  accent-color: var(--color-primary);
}
</style>
