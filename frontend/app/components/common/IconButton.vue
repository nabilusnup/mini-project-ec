<script setup>
defineProps({
  icon: { type: String, required: true },
  label: { type: String, required: true },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
})

defineEmits(['click'])
</script>

<template>
  <button type="button" class="icon-button" :disabled="disabled || loading" :aria-label="label" @click="$emit('click')">
    <i class="fa-solid" :class="[icon, { 'fa-spin': loading }]" aria-hidden="true"></i>
  </button>
</template>

<style scoped>
.icon-button { width: 42px; height: 42px; padding: 0; display: inline-grid; place-items: center; border: 1px solid #414145; border-radius: 11px; background: #29292b; color: #f3a66f; cursor: pointer; }
.icon-button:disabled { opacity: .55; cursor: not-allowed; }
</style>
