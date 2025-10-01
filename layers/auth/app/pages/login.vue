<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-primary mb-2">Welcome Back</h1>
        <p class="text-primary">Sign in to your account to continue</p>
      </div>
      <LoginForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginForm from "../components/LoginForm.vue";

definePageMeta( {
  layout: 'public'
} );
</script>
