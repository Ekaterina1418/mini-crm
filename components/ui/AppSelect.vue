<template>
  <div class="field">
    <label>{{ label }}</label>
    <div class="select" :class="{ active: isSelectOpen }" @click="toggleSelect">
      <div class="select__default">
        {{ modelValue || "Выберите значение" }}
      </div>
      <div class="select__content">
        <label
          v-for="role in values"
          :key="role"
          @click.stop="selectOption(role)"
        >
          {{ role }}
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

defineProps<{
  label: string;
  values: string[];
}>();

const modelValue = defineModel<string | null>();
const isSelectOpen = ref(false);

const toggleSelect = () => {
  isSelectOpen.value = !isSelectOpen.value;
};

const selectOption = (role: string) => {
  modelValue.value = role;
  isSelectOpen.value = false;
};
</script>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field > label {
  color: var(--color-text-muted);
  font-size: 14px;
  font-weight: 600;
}

.select {
  position: relative;
  width: 100%;
  cursor: pointer;
}

.select__default {
  position: relative;
  min-height: 40px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 8px 36px 8px 12px;
  background-color: var(--color-surface);
  color: var(--color-text);
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.select.active .select__default {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
}

.select__default::after {
  content: "";
  position: absolute;
  right: 10px;
  top: 50%;
  border: solid var(--color-text-muted);
  border-width: 0 2px 2px 0;
  padding: 3px;
  pointer-events: none;
  transform: translateY(-50%) rotate(45deg);
  transition: transform 0.3s ease;
}

.select.active .select__default::after {
  transform: translateY(-50%) rotate(-135deg);
}

.select__content {
  position: absolute;
  left: 0;
  top: calc(100% + 5px);
  z-index: 10;
  width: 100%;
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
  box-shadow: var(--shadow-md);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease;
}

.select.active .select__content {
  opacity: 1;
  visibility: visible;
}

.select__content label {
  display: block;
  padding: 6px 10px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.select__content label:hover {
  background-color: var(--color-surface-muted);
}
</style>
