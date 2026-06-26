<template>
  <teleport to="body">
    <div v-if="store.isVisible" class="modal-overlay">
      <div class="modal-wrap">
        <button class="modal-close" type="button" @click="store.isVisible = false">
          <Icon name="tabler:x" size="22" />
        </button>
        <slot></slot>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
const store = useCardStore();

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape" || e.key === "Enter") {
    store.isVisible = false;
  }
};
onMounted(() => {
  window.addEventListener("keydown", onKeydown)
})
onUnmounted(() => {
  window.removeEventListener("keydown", onKeydown)
})
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
