<script setup>
import { computed } from 'vue'

const props = defineProps({ profile: { type: Object, default: null } })
const initial = computed(() => props.profile?.name?.charAt(0)?.toUpperCase() ?? 'U')
</script>

<template>
  <header class="profile-header">
    <div class="topbar">
      <CommonBackButton label="" />
      <strong>Profile</strong>
      <span></span>
    </div>

    <div v-if="profile" class="identity">
      <div>
        <span>Hi there</span>
        <h1>{{ profile.name }}</h1>
      </div>
      <div class="avatar">{{ initial }}</div>
    </div>
  </header>
</template>

<style scoped>
.profile-header { padding: 12px 20px 18px; border-radius: 0 0 26px 26px; background: #f3a66f; color: #211f1e; }
.topbar { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; }
.identity { margin-top: 14px; display: flex; align-items: center; justify-content: space-between; gap: 18px; }
.identity span { color: rgb(33 31 30 / 62%); font-size: 13px; }
.identity h1 { margin: 4px 0 0; font-size: 26px; }
.avatar { flex: 0 0 62px; height: 62px; display: grid; place-items: center; border-radius: 16px; background: #28282b; color: #f2a33f; font-size: 23px; font-weight: 700; }
</style>
