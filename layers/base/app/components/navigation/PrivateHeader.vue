<template>
  <div class="flex justify-between items-center pt-1 pb-1 content-container-primary">

    <!-- Left side - Logo/Search area (hidden on mobile to make room for menu button) -->
    <div class="hidden lg:flex w-full max-w-[400px]">

    </div>

    <!-- Right side - User info and actions (full width on mobile) -->
    <div class="flex items-center gap-4 lg:flex-none w-full lg:w-auto justify-end">
      <!-- User Welcome Message -->
      <ClientOnly>
        <div class="text-sm text-white">
          Welcome back, <span class="font-medium text-white">{{ user?.email?.split('@')[0] || 'User' }}</span>
        </div>
        <template #fallback>
          <div class="text-sm text-white">Welcome back, <span class="font-medium text-white">User</span></div>
        </template>
      </ClientOnly>

      <!-- Sign Out Button -->
      <UButton  @click="handleSignOut" :loading="signOutLoading" class="button-secondary">
        Sign Out
      </UButton>

<!--      <SocialHeaderMenu />-->
<!--      <SupportHeaderMenu />-->
<!--      <UserHeaderMenu />-->
      <DarkModeToggle />
    </div>

  </div>
</template>

<script setup lang="ts">
import { APP_ROUTES } from '~~/layers/base/shared/routes'

const { user, signOut, getFirebaseErrorMessage } = useFirebaseAuth()
const { error: toastError } = useAppToast()

const signOutLoading = ref(false)

const handleSignOut = async () => {
  try {
    signOutLoading.value = true

    await signOut()

    // Navigation will be handled by the auth watcher in app.vue
  } catch (error: any) {
    console.error('Sign out error:', error)

    const errorMessage = getFirebaseErrorMessage(error)
    toastError(errorMessage, 'Sign Out Failed')
  } finally {
    signOutLoading.value = false
  }
}
</script>