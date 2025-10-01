<!-- layers/base/app/layouts/default.vue -->
<script setup lang="ts">
import PrivateHeader from "../components/navigation/PrivateHeader.vue";
import Sidebar from "../components/navigation/Sidebar.vue";
</script>

<template>
  <div class="flex flex-col h-screen bg-base-200">
    <div class="bg-base-100 border-b shadow flex flex-col">
      <div class="flex flex-col ml-10 lg:ml-0">
        <PrivateHeader />
      </div>
    </div>

    <div class="flex flex-1 overflow-y-hidden">
      <Sidebar />
      <main class="overflow-y-auto m-4 gap-4 w-full">
        <slot />
      </main>
    </div>
  </div>
</template>