<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="buttonClass"
    v-bind="attrs"
    @click="onClick"
  >
    <slot>{{ label }}</slot>
  </button>
</template>

<script setup lang="ts">
import { computed, useAttrs } from "vue";

const {
  severity = "primary",
  size = "md",
  disabled = false,
} = defineProps<{
  label: string;
  severity?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  size?: "sm" | "md" | "lg";
}>();

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void;
}>();

const attrs = useAttrs();

const buttonClass = computed(() => {
  return [
    "app-btn",
    `app-btn--${severity}`,
    `app-btn--${size}`,
    { "app-btn--disabled": disabled },
  ];
});

const onClick = (e: MouseEvent) => {
  if (disabled) {
    e.preventDefault();
    e.stopImmediatePropagation();
    return;
  }

  emit("click", e);
};
</script>

<style scoped>
.app-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  padding: 8px 14px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.15s ease;
  user-select: none;
}
</style>
