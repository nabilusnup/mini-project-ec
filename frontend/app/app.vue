<template>
  <NuxtLayout>
    <NuxtRouteAnnouncer />
    <Transition name="slide" mode="out-in">
      <NuxtPage :page-key="route => route.fullPath" />
    </Transition>
  </NuxtLayout>
</template>

<style>
:root {
  --app-bg: #1d1d1f;
  --app-surface: #242426;
  --app-text: #f7f4f1;
  --app-muted: #9c9895;
  --app-border: #37373a;
  --app-primary: #f3a66f;
  --app-primary-hover: #df8f58;
  --app-header: #f3a66f;
  --app-header-gradient: none;
  --app-shadow: none;
  --app-radius: 12px;
}

html, body, #__nuxt {
  min-height: 100%;
  margin: 0;
  background: var(--app-bg);
}

html,
body {
  overflow-x: clip;
}

body {
  color: var(--app-text);
  font-family: "DM Sans", sans-serif;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, h5, h6, .text-display { font-family: "DM Sans", sans-serif; font-weight: 700 !important; }

button, input, select, textarea {
  font-family: inherit;
}

button, nav a, .nav-item { font-weight: 600 !important; }

.app-header { background: var(--app-header); color: #211f1e; }

.slide-enter-active,
.slide-leave-active {
  transition: all 400ms ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(50%);
}

.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-50%);
}

@media (max-width: 767px) {
  input, select, textarea {
    font-size: 16px;
  }
}
</style>
