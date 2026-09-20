<script setup>
defineProps({
  items: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
})

defineEmits(['refresh', 'delete'])

const formatDate = value => {
  if (!value) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value))
}
</script>

<template>
  <section class="history-section">
    <div class="history-heading">
      <strong>Stars History</strong>
      <CommonIconButton
        icon="fa-rotate-right"
        label="Refresh history"
        :loading="loading"
        @click="$emit('refresh')"
      />
    </div>

    <p v-if="loading && !items.length" class="message">Loading history...</p>
    <p v-else-if="!items.length" class="message">No saved results yet.</p>

    <div v-else class="history-list">
      <article v-for="item in items" :key="item.id" class="history-item">
        <div>
          <strong>{{ item.number }} Stars — {{ item.type }}</strong>
          <small>{{ formatDate(item.created_at) }}</small>
        </div>
        <CommonIconButton icon="fa-trash" label="Delete history" @click="$emit('delete', item)" />
      </article>
    </div>
  </section>
</template>

<style scoped>
.history-section { max-width: 520px; margin: 42px auto 0; padding-top: 28px; border-top: 1px solid #39393c; text-align: left; }
.history-heading { display: flex; align-items: center; justify-content: space-between; gap: 14px; }
.history-heading strong { color: #fff; font-size: 16px; }
.message { padding: 20px 0; color: #9c989f; font-size: 12px; text-align: center; }
.history-list { display: grid; gap: 12px; margin-top: 18px; }
.history-item { padding: 13px; display: flex; align-items: center; justify-content: space-between; gap: 12px; border: 1px solid #39393c; border-radius: 10px; background: #252527; }
.history-item > div { min-width: 0; display: grid; gap: 6px; }
.history-item strong { font-size: 13px; }
.history-item small { color: #9c989f; font-size: 10px; }
</style>
