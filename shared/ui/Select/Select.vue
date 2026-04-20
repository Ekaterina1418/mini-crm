<template>
	<div class="field">
      <label>{{ label }}</label>
      <div
        class="select"
        :class="{ active: isSelectOpen }"
        @click="toggleSelect"
      >
        <div class="select__default">
          {{ modelValue || "Выберите роль" }}
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
const isSelectOpen = ref(false);
defineProps<{
	label: string
    values : string[]
}>()
const modelValue = defineModel<string | null>()
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
  gap: 8px;
  margin-bottom: 10px;
}
.select {
  position: relative;
  width: 100%;
  cursor: pointer;
}
.select__default {
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #fff;
  position: relative;
}
.select__default::after {
  content: "";
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%) rotate(45deg);
  border: solid #555;
  border-width: 0 2px 2px 0;
  padding: 3px;
  pointer-events: none;
  transition: transform 0.3s ease;
}
.select.active .select__default::after {
  transform: translateY(-50%) rotate(-135deg);
}
.select__content {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #fff;
  max-height: 150px;
  overflow-y: auto;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease;
  z-index: 10;
}
.select.active .select__content {
  opacity: 1;
  visibility: visible;
}

.select__content input {
  display: none;
}

.select__content label {
  display: block;
  padding: 6px 10px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.select__content label:hover {
  background-color: #f0f0f0;
}
</style>