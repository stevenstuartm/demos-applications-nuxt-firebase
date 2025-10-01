<template>
  <UApp :toaster="{ position: 'top-right', duration: 4000 }">
    <NuxtRouteAnnouncer/>
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
  </UApp>
</template>

<script setup>
import { APP_ROUTES, PUBLIC_ROUTES } from '../layers/base/shared/routes'

// Global auth redirect handler
const { isAuthenticated, isReady } = useFirebaseAuth();
const router = useRouter();

// Simple watchEffect for logout redirects only
watchEffect(() => {
  if (isReady.value && !isAuthenticated.value) {
    const route = router.currentRoute.value;
    
    if (!PUBLIC_ROUTES.includes(route.path)) {
      router.push({
        path: APP_ROUTES.LOGIN,
        query: { redirect: route.fullPath }
      });
    }
  }
});

// Error handling
onErrorCaptured((error) => {
  console.error("App error captured:", error);
  return false;
});
</script>