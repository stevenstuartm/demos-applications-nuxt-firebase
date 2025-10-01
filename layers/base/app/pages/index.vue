<script setup lang="ts">
definePageMeta( {
  middleware: 'role-based'
} )
</script>

<!-- layers/base/app/pages/index.vue -->
<template>
  <div class="space-y-6">
    <!-- Header Card -->
    <UCard  class="content-container-secondary">
      <h1 class="text-2xl font-bold text-primary">Dashboard</h1>
    </UCard>

    <!-- Welcome Card -->
    <UCard  class="content-container-secondary">
      <div class="text-center py-12">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          Welcome to DEMO
        </h2>
        <p class="text-gray-600">
          Your central hub for internal operations management.
        </p>
      </div>
    </UCard>
  </div>
</template>