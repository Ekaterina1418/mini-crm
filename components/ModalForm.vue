<template>
  <teleport to="body">
    <div
      v-if="store.isVisible"
      class="modal-overlay"
    >
      <div
        ref="modalRef"
        class="modal-wrap"
        role="dialog"
        aria-modal="true"
        aria-label="Форма контакта"
      >
        <button
          class="modal-close"
          type="button"
          :disabled="props.isLocked"
          @click="closeModal"
        >
          <Icon name="tabler:x" size="22" />
        </button>
        <slot/>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  isLocked?: boolean;
}>();

const store = useContactsStore();
const modalRef = ref<HTMLElement | null>(null);
let previouslyFocusedElement: HTMLElement | null = null;
let previousBodyOverflow = "";

const getFocusableElements = () => {
  if (!modalRef.value) return [];

  return Array.from(
    modalRef.value.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
    ),
  );
};

const closeModal = () => {
  if (props.isLocked) return;
  store.close();
};
const onKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    closeModal();
    return;
  }

  if (e.key !== "Tab") return;

  const focusableElements = getFocusableElements();
  if (!focusableElements.length) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements.at(-1);
  const activeElement = document.activeElement;

  if (props.isLocked && !modalRef.value?.contains(activeElement)) return;

  if (e.shiftKey && activeElement === firstElement) {
    e.preventDefault();
    lastElement?.focus();
  } else if (!e.shiftKey && activeElement === lastElement) {
    e.preventDefault();
    firstElement?.focus();
  } else if (!modalRef.value?.contains(activeElement)) {
    e.preventDefault();
    firstElement?.focus();
  }
};

onMounted(() => {
  previouslyFocusedElement = document.activeElement as HTMLElement | null;
  previousBodyOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  window.addEventListener("keydown", onKeydown);

  nextTick(() => {
    getFocusableElements()[0]?.focus();
  });
});

onUnmounted(() => {
  document.body.style.overflow = previousBodyOverflow;
  window.removeEventListener("keydown", onKeydown);

  nextTick(() => {
    if (previouslyFocusedElement?.isConnected) {
      previouslyFocusedElement.focus();
    }
  });
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  padding: 20px;
  z-index: 1000;
}
.modal-wrap {
  position: relative;
  display: flex;
  justify-content: center;
  width: min(620px, 100%);
  max-height: calc(100vh - 40px);
  overflow: auto;
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 28px;
  box-shadow: var(--shadow-md);
}
.modal-close {
  position: absolute;
  right: 16px;
  top: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
}

.modal-close:hover {
  background: var(--color-surface-muted);
  color: var(--color-text);
}
</style>
