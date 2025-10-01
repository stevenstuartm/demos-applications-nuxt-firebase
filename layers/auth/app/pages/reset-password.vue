<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-primary mb-2">Reset Password</h1>
        <p class="text-primary">Enter your email address and we'll send you a reset link</p>
      </div>
      
      <UCard  class="text-black content-container-primary">
        <template #header>
          <h2 class="text-xl font-semibold text-center">
            Password Reset
          </h2>
        </template>

        <div>
          <form @submit.prevent="handleResetPassword" class="space-y-6">
            <UFormField label="Email Address" required>
              <UInput
                v-model="resetEmail"
                type="email"
                placeholder="Enter your email address"
                :disabled="loading"
                size="lg"
                class="w-full"
                required
              />
            </UFormField>

            <p class="text-gray-600 text-sm">
              We'll send you a link to reset your password.
            </p>

            <UButton
              type="submit"
              block
              :loading="loading"
              :disabled="!resetEmail?.trim() || loading"
              size="lg"
              class="w-full button-primary"
            >
              Send Reset Link
            </UButton>

            <div class="text-center">
              <UButton
                @click="navigateTo(APP_ROUTES.LOGIN)"
                :disabled="loading"
                class="text-sm button-secondary"
              >
                Back to Sign In
              </UButton>
            </div>
          </form>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { APP_ROUTES } from '~~/layers/base/shared/routes'

const { resetPassword, getFirebaseErrorMessage } = useFirebaseAuth()
const { error: toastError, success: toastSuccess } = useAppToast()

const router = useRouter()

const resetEmail = ref('')
const loading = ref(false)

definePageMeta({
  layout: 'public'
})

const handleResetPassword = async () => {
  if (!resetEmail.value?.trim()) {
    toastError('Please enter a valid email address', 'Invalid Email')
    return
  }

  try {
    loading.value = true

    await resetPassword(resetEmail.value.trim())

    toastSuccess(
      'Password reset email sent successfully! Please check your email for the reset link.',
      'Email Sent'
    )

    resetEmail.value = ''

    // Redirect to login after successful reset
    setTimeout(() => {
      navigateTo(APP_ROUTES.LOGIN)
    }, 2000)
  } catch (err: any) {
    console.error('Reset password error:', err)

    const errorMessage = getFirebaseErrorMessage(err)
    toastError(errorMessage, 'Reset Failed')
  } finally {
    loading.value = false
  }
}
</script>