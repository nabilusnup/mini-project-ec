<script setup>
defineProps({
  title: { type: String, required: true },
  loading: { type: Boolean, default: false },
  confirmLabel: { type: String, default: 'Yes, Delete' }
})

defineEmits(['cancel', 'confirm'])
</script>

<template>
  <div class="overlay" @click.self="$emit('cancel')">
    <section class="dialog" role="dialog" aria-modal="true" :aria-label="title">
      <span class="icon" aria-hidden="true"><i class="fa-solid fa-exclamation"></i></span>
      <strong class="title">{{ title }}</strong>
      <div class="content"><slot /></div>
      <div class="actions">
        <button type="button" class="cancel" :disabled="loading" @click="$emit('cancel')">Cancel</button>
        <button type="button" class="confirm" :disabled="loading" @click="$emit('confirm')">
          {{ loading ? 'Deleting...' : confirmLabel }}
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.overlay { position: fixed; inset: 0; z-index: 50; padding: 18px; display: grid; place-items: center; background: rgb(0 0 0 / 72%); }
.dialog { width: min(100%, 420px); padding: 26px; border: 1px solid #414145; border-radius: 12px; background: #252527; color: #fff; text-align: center; }
.icon { width: 48px; height: 48px; margin: 0 auto 16px; display: grid; place-items: center; border-radius: 14px; background: #29292b; color: #f3a66f; font-size: 18px; }
.title { display: block; margin-bottom: 10px; color: #fff; font-size: 20px; }
.content :deep(p) { margin: 0; color: #fff; line-height: 1.5; }
.content :deep(p + p) { margin-top: 8px; }
.content :deep(strong) { color: #fff; }
.actions { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 22px; }
button { min-height: 46px; border: 0; border-radius: 10px; cursor: pointer; }
button:disabled { opacity: .65; cursor: not-allowed; }
.cancel { background: #38383b; color: #fff; }
.confirm { background: #f3a66f; color: #211f1e; }
</style>
