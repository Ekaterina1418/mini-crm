<template>
  <div class="field">
    <input type="checkbox" v-model="modelValue" id="activeCheckbox" />
    <label for="activeCheckbox">{{
      modelValue ? "Активный" : "Неактивный"
    }}</label>
  </div>
</template>

<script setup lang="ts">
const modelValue = defineModel<boolean>();
</script>

<style scoped>
.field {
  display: flex;
  gap: 5px;
}
</style>
