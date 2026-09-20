<script setup>
import { useLoginPage } from './script'

const { config, email, password, fieldErrors, isSubmitting, recaptchaElement, recaptchaToken, recaptchaWidgetId, token, authUser, renderRecaptcha, loadRecaptcha, resetRecaptcha, login } = useLoginPage()

</script>

<template>
  <div class="page">
    <header class="login-hero app-header">
      <p class="text-display title">Welcome Back</p>
      <p class="subtitle">Sign in with your registered employee email and password.</p>
    </header>

    <main class="login-card">
      <form @submit.prevent="login">
        <label>
          <span>Email</span>
          <input v-model.trim="email" type="email" autocomplete="email" placeholder="employee@example.com">
          <small v-if="fieldErrors.email" class="field-error">{{ fieldErrors.email }}</small>
        </label>
        <label>
          <span>Password</span>
          <input v-model="password" type="password" autocomplete="current-password" placeholder="Enter password">
          <small v-if="fieldErrors.password" class="field-error">{{ fieldErrors.password }}</small>
        </label>

        <div class="captcha-container">
          <span>Captcha</span>
          <div ref="recaptchaElement" class="recaptcha-widget"></div>
          <small v-if="fieldErrors.recaptcha_token" class="field-error">{{ fieldErrors.recaptcha_token }}</small>
        </div>


        <button type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Loading...' : 'Login' }}
        </button>
      </form>
    </main>
  </div>
</template>

<style scoped src="./style.css"></style>
