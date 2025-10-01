<!-- layers/auth/app/components/LoginForm.vue -->
<template>
  <UCard  class="content-container-primary">
    <template #header>
      <h2 class="text-xl font-semibold text-center text-primary">
        Sign In
      </h2>
    </template>

    <div>
      <form @submit.prevent="handleSignIn" class="space-y-6">
        <UFormField label="Email" required>
          <UInput
            v-model="form.email"
            type="email"
            placeholder="Enter your email"
            :disabled="loading"
            size="lg"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Password" required>
          <UInput
            v-model="form.password"
            type="password"
            placeholder="Enter your password"
            :disabled="loading"
            size="lg"
            class="w-full"
          />
        </UFormField>

        <UButton
          type="submit"
          block
          :loading="loading"
          :disabled="!form.email || !form.password || loading"
          class="button-primary"
        >
          Sign In
        </UButton>

        <div class="text-center">
          <UButton
            type="button"
            @click="handleResetPasswordClick"
            :disabled="loading"
            class="button-secondary"
          >
            Forgot your password?
          </UButton>
        </div>
      </form>
    </div>
  </UCard>

</template>

<script setup lang="ts">
import { APP_ROUTES } from '~~/layers/base/shared/routes'

const { signIn, getFirebaseErrorMessage } = useFirebaseAuth()
const { error: toastError } = useAppToast()

const router = useRouter()
const route = useRoute()

const loading = ref(false)

const form = reactive({
  email: '',
  password: ''
})

const handleSignIn = async () => {
  try {
    loading.value = true

    // Attempt sign in
    await signIn(form.email, form.password)

    // Direct navigation - no watcher needed
    const redirectTo = typeof route.query.redirect === 'string'
      ? route.query.redirect
      : '/'

    // Use replace to prevent back button issues
    await navigateTo(redirectTo, { replace: true })

  } catch (err: any) {
    console.error('Sign in error:', err)

    const errorMessage = getFirebaseErrorMessage(err)
    toastError(errorMessage, 'Sign In Failed')
  } finally {
    loading.value = false
  }
}

const handleResetPasswordClick = () => {
  navigateTo(APP_ROUTES.RESET_PASSWORD)
}

// No user watcher needed - navigation handled immediately after signIn
</script>
