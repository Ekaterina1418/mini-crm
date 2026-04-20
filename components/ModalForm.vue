<template>
  <teleport to="body">
    <div v-if="store.isVisible" class="modal-overlay">
      <div class="modal-wrap">
        <button class="modal-close" @click="store.isVisible = false"><Icon name="tabler:x" size="24" color="#333" /></button>
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
  z-index: 1000;
}
.modal-wrap {
  position: relative;
  display: flex;
  justify-content: center;
  width: 50%;
  height: 50vh;
  overflow: auto;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);
}
.modal-close {
  content: "\2715";
  position: absolute;
  right: 30px;
  top: 10px;
  font-size: 35px;
  font-weight: 600;
  color: #000;
  cursor: pointer;
}
</style>
