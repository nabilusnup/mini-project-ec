<script setup>
const route = useRoute()

const items = [
  { label: 'Home', to: '/', icon: 'home' },
  { label: 'Profile', to: '/profile', icon: 'profile' }
]

const isActive = (path) => route.path === path
</script>

<template>
  <nav class="bottom-nav" aria-label="Main navigation">
    <NuxtLink
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      class="nav-item"
      :class="{ active: isActive(item.to) }"
    >
      <svg v-if="item.icon === 'home'" class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3.5 10.7 12 3.8l8.5 6.9v8.8a1 1 0 0 1-1 1h-5v-6h-5v6h-5a1 1 0 0 1-1-1z" />
      </svg>
      <svg v-else class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5.5 20c.4-4 2.7-6 6.5-6s6.1 2 6.5 6" />
      </svg>
      <span class="nav-label">{{ item.label }}</span>
    </NuxtLink>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  z-index: 100;
  left: 50%;
  bottom: 0;
  width: min(100%, 480px);
  min-height: 70px;
  padding: 8px 18px max(8px, env(safe-area-inset-bottom));
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
  border: 0;
  border-top: 1px solid #343438;
  border-radius: 0;
  background: #1d1d1f;
  box-shadow: none;
  transform: translateX(-50%);
}

.nav-item {
  min-height: 44px;
  padding: 4px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 10px;
  color: #77777f;
  text-decoration: none;
  transition: background .18s ease, color .18s ease, box-shadow .18s ease;
}

.nav-item.active {
  color: #fff;
  background: transparent;
  box-shadow: none;
}

.nav-icon {
  width: 19px;
  height: 19px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.nav-label { font-size: 12px; font-weight: 600; }

@media (min-width: 768px) {
  .bottom-nav { bottom: 0; width: min(100%, 640px); padding-inline: 28px; }
}
</style>
