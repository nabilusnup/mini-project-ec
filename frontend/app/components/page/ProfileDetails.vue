<script setup>
defineProps({ fields: { type: Array, required: true } })
defineEmits(['logout'])
</script>

<template>
  <div>
    <section class="detail-list">
      <div v-for="field in fields" :key="field.label" class="detail-item">
        <span class="detail-icon" aria-hidden="true"><i class="fa-solid" :class="field.icon"></i></span>
        <div>
          <span>{{ field.label }}</span>
          <strong>{{ field.value || '-' }}</strong>
        </div>
      </div>
    </section>
    <button type="button" class="logout-button" @click="$emit('logout')">Logout</button>
  </div>
</template>

<style scoped>
.detail-list { border-top: 1px solid #303034; }
.detail-item { min-height: 68px; padding: 1px 0; display: grid; grid-template-columns: 46px minmax(0, 1fr); align-items: center; gap: 10px; border-bottom: 1px solid #303034; text-align: left; }
.detail-icon { width: 46px; height: 46px; display: grid; place-items: center; border-radius: 13px; background: #28282b; color: #f2a33f; font-size: 18px; }
.detail-item > div { min-width: 0; display: grid; justify-items: start; gap: 4px; }
.detail-item > div span { color: #918d9c; font-size: 13px; }
.detail-item strong { color: #f7f4f1; overflow-wrap: anywhere; font-size: 16px; }
.logout-button { width: 100%; min-height: 50px; margin-top: 22px; border: 1px solid #444145; border-radius: 14px; background: #29292b; color: #f3a66f; cursor: pointer; }
</style>
