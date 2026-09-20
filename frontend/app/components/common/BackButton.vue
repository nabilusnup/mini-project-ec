<script setup>
defineProps({
  to: { type: String, default: '/' },
  label: { type: String, default: '' },
  tone: { type: String, default: 'peach' }
})
</script>

<template>
  <NuxtLink :to="to" class="back-button" :class="`tone-${tone}`" :aria-label="label || 'Back'">
    <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
    <span v-if="label" class="label">{{ label }}</span>
  </NuxtLink>
</template>

<style scoped>
.back-button { width: 42px; min-width: 42px; min-height: 42px; margin-right: auto; padding: 0; display: flex; align-items: center; justify-content: center; justify-self: start; gap: 7px; border-radius: 13px; text-decoration: none; }
.back-button > i { display: block; font-size: 16px; line-height: 1; }
.label { font-size: 13px; }
.tone-peach { background: rgb(33 31 30 / 12%); color: #211f1e; }
.tone-dark { background: #29292b; color: #f3a66f; }
</style>
