<script setup>
defineProps({ message: { type: String, default: '' } })
</script>

<template>
  <small v-if="message" class="field-error">{{ message }}</small>
</template>

<style scoped>
.field-error { margin: 0; color: #ff8e88; font-size: 12px; font-weight: 400; }
</style>
