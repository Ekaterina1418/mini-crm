<template>
  <Teleport to="body">
    <div v-if="isOpen" class="confirm-overlay">
      <div
        ref="dialogRef"
        class="confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        :aria-label="title"
      >
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
  (e: "confirm" | "cancel"): void;
}>();

const dialogRef = ref<HTMLElement | null>(null);
let previouslyFocusedElement: HTMLElement | null = null;

const getFocusableElements = () => {
  if (!dialogRef.value) return [];

  return Array.from(
    dialogRef.value.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
    ),
  );
};

const onKeydown = (e: KeyboardEvent) => {
  if (!props.isOpen) return;

  if (e.key === "Escape") {
    e.preventDefault();
    e.stopImmediatePropagation();

    if (!props.isLoading) {
      emit("cancel");
    }
    return;
  }

  if (e.key !== "Tab") return;

  const focusableElements = getFocusableElements();
  const firstElement = focusableElements[0];
  const lastElement = focusableElements.at(-1);

  if (!firstElement || !lastElement) {
    e.preventDefault();
    return;
  }

  e.stopImmediatePropagation();

  if (e.shiftKey && document.activeElement === firstElement) {
    e.preventDefault();
    lastElement.focus();
  } else if (!e.shiftKey && document.activeElement === lastElement) {
    e.preventDefault();
    firstElement.focus();
  } else if (!dialogRef.value?.contains(document.activeElement)) {
    e.preventDefault();
    firstElement.focus();
  }
};

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      previouslyFocusedElement = document.activeElement as HTMLElement | null;
      nextTick(() => getFocusableElements()[0]?.focus());
      return;
    }

    nextTick(() => {
      if (previouslyFocusedElement?.isConnected) {
        previouslyFocusedElement.focus();
      }
    });
  },
);

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
