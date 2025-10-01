<!-- components/ClientOnly.vue -->
<template>
  <div v-if="isMounted">
    <slot />
  </div>
  <div v-else>
    <slot name="fallback">
      <!-- Default loading state for SSR -->
      <div class="flex items-center justify-center p-4">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
})
</script>