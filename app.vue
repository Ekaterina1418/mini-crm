<template>
  <div class="app">
   <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  </div>
</template>
<style scoped>
.app {
  max-width: 1280px;
  min-height: 100vh;
  margin: auto;
  padding: var(--space-page);
}

@media (max-width: 720px) {
  .app {
    padding: 16px;
  }
}
</style>
