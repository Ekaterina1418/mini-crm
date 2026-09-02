<template>
  <Teleport to="body">
    <div v-if="isOpen" class="confirm-overlay">
      <div class="confirm-dialog" role="alertdialog" aria-modal="true">
        <h3>{{ title }}</h3>
        <p>{{ message }}</p>
        <p v-if="error" class="confirm-error" role="alert">
          {{ error }}
        </p>
        <div class="confirm-actions">
          <button type="button" :disabled="isLoading" @click="emit('cancel')">
            {{ cancelLabel }}
          </button>
          <button
            type="button"
            class="confirm-button"
            :disabled="isLoading"
            @click="emit('confirm')"
          >
            {{ isLoading ? "Удаление..." : confirmLabel }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  error?: string;
}>();

const emit = defineEmits<{
  (e: "confirm"): void;
  (e: "cancel"): void;
}>();

const onKeydown = (e:KeyboardEvent) => {
 if (e.key !== "Escape" || !props.isOpen) return;

  e.preventDefault();
  e.stopImmediatePropagation();

  if(!props.isLoading) {
    emit("cancel")
  }
}
onMounted(() => {
  window.addEventListener("keydown", onKeydown, true);
});

onUnmounted(() => {
  window.removeEventListener("keydown", onKeydown, true);
});
</script>

<style scoped>
.confirm-overlay {
  position: fixed;
  inset: 0;
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.5);
}

.confirm-dialog {
  width: min(420px, 100%);
  border-radius: var(--radius-lg);
  padding: 24px;
  background: var(--color-surface);
  box-shadow: var(--shadow-md);
}

.confirm-dialog p {
  margin-top: 8px;
  color: var(--color-text-muted);
}

.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
}

.confirm-actions button {
  min-height: 40px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 8px 14px;
  background: var(--color-surface);
  color: var(--color-text);
  cursor: pointer;
}

.confirm-actions .confirm-button {
  border-color: var(--color-danger);
  background: var(--color-danger);
  color: white;
}

.confirm-actions button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
.confirm-error {
  color: var(--color-danger);
  font-size: 14px;
}
</style>
