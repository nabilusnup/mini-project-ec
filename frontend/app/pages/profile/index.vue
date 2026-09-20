<script setup>
import { useProfilePage } from './script'

const { token, authUser, profile, pending, error, formatSalary, fields, loadProfile, logout } = useProfilePage()
</script>

<template>
  <div class="profile-page">
    <PageProfileHeader :profile="profile" />

    <main class="profile-content">
      <p v-if="pending" class="state-message">Loading profile...</p>
      <section v-else-if="error" class="error-card">
        <p>{{ error }}</p>
        <button type="button" @click="loadProfile">Try Again</button>
      </section>

      <template v-else-if="profile">
        <PageProfileDetails :fields="fields" @logout="logout" />
      </template>

      <section v-else class="error-card">
        <p>Profile data is not available.</p>
        <button type="button" @click="loadProfile">Reload</button>
      </section>
    </main>
  </div>
</template>

<style scoped src="./style.css"></style>
