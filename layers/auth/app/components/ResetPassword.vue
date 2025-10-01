<!-- layers/auth/app/components/ResetPassword.vue -->
<template>
  <UModal v-model="isOpen">
    <UCard >
      <template #header>
        <div class="flex items-center gap-2">
          <h3 class="text-lg font-semibold">Reset Password</h3>
        </div>
      </template>

      <form @submit.prevent="handleResetPassword" class="space-y-4">
        <UFormField label="Email Address" required>
          <UInput
            v-model="resetEmail"
            type="email"
            placeholder="Enter your email address"
            :disabled="loading"
            size="lg"
            required
          />
        </UFormField>

        <p class="text-gray-600 text-sm">
          We'll send you a link to reset your password.
        </p>

        <div class="flex gap-3 pt-2">
          <UButton
            type="button"
            @click="closeModal()"
            class="flex-1 button-primary"
            :disabled="loading"
          >
            Cancel
          </UButton>

          <UButton
            type="submit"
            :loading="loading"
            :disabled="!resetEmail?.trim() || loading"
            class="flex-1 button-secondary"
          >
            Send Reset Link
          </UButton>
        </div>
      </form>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
interface ResetPassword {
  closeModal: []
}

const emit = defineEmits<ResetPassword>()

const { resetPassword, getFirebaseErrorMessage } = useFirebaseAuth()
const { error: toastError, success: toastSuccess } = useAppToast()

const resetEmail = ref('')
const loading = ref(false)
const isOpen = ref(true)

const closeModal = () => {
  isOpen.value = false
  emit('closeModal')
}

// Watch for modal close
watch(isOpen, (newValue) => {
  if (!newValue) {
    emit('closeModal')
  }
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

    // Auto-close modal after successful reset
    setTimeout(() => {
      closeModal()
    }, 1500)
  } catch (err: any) {
    console.error('Reset password error:', err)

    const errorMessage = getFirebaseErrorMessage(err)
    toastError(errorMessage, 'Reset Failed')
  } finally {
    loading.value = false
  }
}
</script>
