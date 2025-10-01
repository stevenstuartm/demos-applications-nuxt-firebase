<!-- layers/base/app/layouts/public.vue -->
<template>
  <div class="layout-container">
    <main class="main-content">
      <slot/>
    </main>
  </div>
</template>

<style scoped>
.layout-container {
  min-height: 100vh;
  background-color: var(--ui-bg);
}

.main-content {
  min-height: 100vh;
  width: 100%;
}
</style>