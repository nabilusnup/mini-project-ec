<script setup>
import { computed } from 'vue'

const route = useRoute()
const token = useCookie('auth_token')
const showNavigation = computed(() => Boolean(token.value) && route.path !== '/login')
</script>

<template>
  <div :class="{ 'with-bottom-nav': showNavigation }">
    <slot />
    <BottomNav v-if="showNavigation" />
  </div>
</template>

<style scoped>
.with-bottom-nav { padding-bottom: 76px; }
</style>
