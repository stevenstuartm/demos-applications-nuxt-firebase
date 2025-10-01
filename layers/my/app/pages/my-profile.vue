<script setup lang="ts">
const { user, resendVerification, resetPassword, getFirebaseErrorMessage } = useFirebaseAuth()
const { error: toastError, success: toastSuccess } = useAppToast()

const verificationLoading = ref(false)
const resetPasswordLoading = ref(false)

definePageMeta( {
  middleware: 'role-based'
} )

const handleResendVerification = async () => {
  if (!user.value) return

  try {
    verificationLoading.value = true

    await resendVerification()

    toastSuccess(
        'Verification email sent successfully! Please check your email for the verification link.',
        'Email Sent'
    )
  } catch (error: any) {
    console.error('Resend verification error:', error)

    const errorMessage = getFirebaseErrorMessage(error)
    toastError(errorMessage, 'Verification Failed')
  } finally {
    verificationLoading.value = false
  }
}

const handleResetPassword = async () => {
  if (!user.value?.email) return

  try {
    resetPasswordLoading.value = true

    await resetPassword(user.value.email)

    toastSuccess(
        'Password reset email sent successfully! Please check your email for the reset link.',
        'Email Sent'
    )
  } catch (error: any) {
    console.error('Reset password error:', error)

    const errorMessage = getFirebaseErrorMessage(error)
    toastError(errorMessage, 'Reset Failed')
  } finally {
    resetPasswordLoading.value = false
  }
}

const formatLastSignIn = (timestamp: string | undefined) => {
  if (!timestamp) return 'Never'
  return new Date(timestamp).toLocaleString()
}
</script>

<!-- layers/base/app/pages/index.vue -->
<template>
  <div class="space-y-6">
    <!-- Header Card -->
    <UCard  class="content-container-secondary">
      <h1 class="text-2xl font-bold text-primary">My Profile</h1>
    </UCard>

    <!-- Stats Grid Card -->
    <UCard  class="content-container-secondary">
      <h2 class="text-lg font-semibold mb-6 text-primary">User Information</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- User Info Card -->
        <UCard  class="content-container-primary">
          <div class="space-y-2">
            <div>
              <p class="text-sm font-medium text-primary">Email</p>
              <ClientOnly>
                <p class="text-blue-900 truncate">{{ user?.email || 'Loading...' }}</p>
                <template #fallback>
                  <p class="text-blue-900 truncate">Loading...</p>
                </template>
              </ClientOnly>
            </div>
            <div>
              <p class="text-sm font-medium text-primary">User ID</p>
              <ClientOnly>
                <p class="text-blue-900 text-xs font-mono truncate">{{ user?.uid || 'Loading...' }}</p>
                <template #fallback>
                  <p class="text-blue-900 text-xs font-mono truncate">Loading...</p>
                </template>
              </ClientOnly>
            </div>
          </div>
        </UCard>

        <!-- Email Verification Card -->
        <UCard  class="content-container-primary">
          <template #header>
            <div class="flex items-center gap-2">
              <h3 class="font-semibold text-primary">Email Status</h3>
            </div>
          </template>

          <div class="space-y-3">
            <ClientOnly>
              <UBadge :color="user?.emailVerified ? 'success' : 'error'"  size="lg">
                {{ user?.emailVerified ? 'Verified' : 'Not Verified' }}
              </UBadge>

              <UButton
                v-if="user && !user.emailVerified"
                @click="handleResendVerification"
                
                :loading="verificationLoading"
                size="sm"
                class="w-full button-primary"
              >
                Resend Verification
              </UButton>

              <template #fallback>
                <UBadge color="neutral"  size="lg">
                  Loading...
                </UBadge>
              </template>
            </ClientOnly>
          </div>
        </UCard>

        <!-- Profile Info Card -->
        <UCard  class="content-container-primary">
          <template #header>
            <div class="flex items-center gap-2">
              <h3 class="font-semibold text-primary">Profile</h3>
            </div>
          </template>

          <div class="space-y-2">
            <div>
              <p class="text-sm text-primary font-medium">Display Name</p>
              <ClientOnly>
                <p class="text-content">{{ user?.displayName || 'Not set' }}</p>
                <template #fallback>
                  <p class="text-content">Loading...</p>
                </template>
              </ClientOnly>
            </div>
            <div>
              <p class="text-sm text-primary font-medium">Last Sign In</p>
              <ClientOnly>
                <p class="text-content text-xs">{{ formatLastSignIn(user?.metadata?.lastSignInTime) }}</p>
                <template #fallback>
                  <p class="text-content text-xs">Loading...</p>
                </template>
              </ClientOnly>
            </div>
          </div>
        </UCard>
      </div>
    </UCard>

    <!-- Security Card -->
    <UCard  class="content-container-secondary">
      <h2 class="text-lg font-semibold mb-6 text-primary">Security</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
        <!-- Password Reset Card -->
        <UCard  class="content-container-primary">
          <div class="space-y-3">
            <p class="text-sm text-white">
              Reset your password by sending a reset link to your email address.
            </p>
            
            <ClientOnly>
              <UButton
                @click="handleResetPassword"
                :loading="resetPasswordLoading"
                size="sm"
                class="button-primary"
              >
                Send Password Reset Email
              </UButton>

              <template #fallback>
                <UButton
                  disabled
                  size="sm"
                  class="w-full button-secondary"
                >
                  Loading...
                </UButton>
              </template>
            </ClientOnly>
          </div>
        </UCard>
      </div>
    </UCard>
  </div>
</template>
