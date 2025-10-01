<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import navigationItems from "../../meta/navigation.json";
import { APP_ROUTES, type NavigationPermissionKey } from "~~/layers/base/shared/routes";

const { navigationPermissions } = useAuthRoles()

// Filter navigation items based on user permissions
const filteredItems = computed(() => {
  const filterItems = (items: any[]): any[] => {
    return items
      .filter(item => {
        // If item has authConstraint, check if user has permission
        if (item.authConstraint) {
          const permissionKey = item.authConstraint as NavigationPermissionKey
          const permissions = navigationPermissions.value as Record<string, boolean>
          return permissions[permissionKey] === true
        }
        // If no authConstraint, show by default (for public items)
        return true
      })
      .map(item => ({
        ...item,
        // Recursively filter children if they exist
        children: item.children ? filterItems(item.children) : undefined
      }))
      .filter(item => {
        // Remove parent items that have no visible children (if they have children defined)
        if (item.children !== undefined && item.children.length === 0) {
          return false
        }
        return true
      })
  }

  return [filterItems(navigationItems.topics)]
})

const items = ref< NavigationMenuItem[][] >(filteredItems.value);

// Watch for permission changes and update items
watch(filteredItems, (newItems) => {
  items.value = newItems
}, { deep: true })
</script>

<template>
  <div class="flex flex-col h-full">
    <UNavigationMenu orientation="vertical" :items="items" class="data-[orientation=vertical]:w-48"/>
  </div>
</template>