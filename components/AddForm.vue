<template>
  <button @click="$emit('click')">
    <Icon name="tabler:plus" size="28" color="#333" />
  </button>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: "click"): void;
}>();
</script>

<style scoped></style>
