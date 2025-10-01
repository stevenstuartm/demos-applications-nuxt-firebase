<script setup lang="ts">
import { ref } from "vue";
import { type Router, useRouter } from "vue-router";

import SidebarMenu from "./SidebarMenu.vue";

const isMenuOpen = ref( false );

function closeMenu() {
  isMenuOpen.value = false;
}
function openMenu() {
  isMenuOpen.value = true;
}

const router: Router = useRouter();
router.beforeEach( () => {
  isMenuOpen.value = false;
} );
</script>

<template>

  <!-- DESKTOP SIDEBAR -->
  <aside class="hidden overflow-y-auto shadow-lg bg-base-100 mt-4 min-w-64 lg:flex lg:flex-none lg:flex-col content-container-primary">
    <SidebarMenu />
  </aside>

  <!-- MOBILE SIDEBAR -->
  <div class="bg-base-100 flex flex-col relative z-50 lg:hidden" role="dialog" aria-modal="true">

    <transition
        enter-active-class="transition-opacity ease-linear"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity ease-linear"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0">
      <div v-if="isMenuOpen" @click="closeMenu()" class="fixed inset-0 bg-zinc-900/80" aria-hidden="true"></div>
    </transition>
    <transition
        enter-active-class="transition-opacity ease-linear"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity ease-linear"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0">
      <div v-if="isMenuOpen" class="fixed inset-0 flex">
        <transition
            enter-active-class="transition ease-in-out transform"
            enter-from-class="-translate-x-full"
            enter-to-class="translate-x-0"
            leave-active-class="transition ease-in-out transform"
            leave-from-class="translate-x-0"
            leave-to-class="-translate-x-full">
          <div v-if="isMenuOpen" class="relative flex w-full max-w-64 flex-1">
            <div class="absolute left-full top-0 flex justify-center">
              <UButton type="button" @click="closeMenu()" class="p-3 bg-white shadow-lg rounded-md button-secondary">
                <span class="sr-only">Close sidebar</span>
                <i class="pi pi-times text-black"></i>
              </UButton>
            </div>
            <aside class="bg-base-100 flex flex-col h-dvh h-screen overflow-y-auto w-64">
              <SidebarMenu />
            </aside>
          </div>
        </transition>
      </div>
    </transition>
  </div>

  <!-- Mobile Menu Toggle Button -->
  <div v-if="!isMenuOpen" class="fixed top-1 left-1 lg:hidden z-[100]">
    <UButton 
      @click="openMenu()"
      class="button-primary shadow-lg border border-gray-300 p-2"
      style="background: white !important;"
    >
      <Icon name="i-lucide-menu" class="h-3 w-3 text-black" />
    </UButton>
  </div>

</template>

<style scoped>
aside {
  scrollbar-width: thin;
}
</style>
