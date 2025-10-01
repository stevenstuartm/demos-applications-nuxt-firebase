<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core';

const isDark = useDark( {
  selector: 'html',
  attribute: 'data-theme',
  valueDark: 'dark',
  valueLight: 'emerald',
} );

const toggleDark = useToggle( isDark );
</script>

<template>
  <div @click="toggleDark()" class="btn btn-sm btn-ghost">
    <template v-if="isDark">
      <i class="text-primary pi pi-moon"></i>
    </template>
    <template v-else>
      <i class="text-primary pi pi-sun"></i>
    </template>
  </div>
</template>
