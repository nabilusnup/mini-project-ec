<script setup>
import { useHomePage } from './home/script'

const { token, activities, cachedProfile, isLoadingActivities, activityError, menus, formatActivityDate, formatRupiah, loadActivities, preloadProfile } = useHomePage()
</script>

<template>
  <div class="page">
    <main class="content">
      <section class="menu-section">
       <nav class="menu-slider" aria-label="Main menu">
          <NuxtLink
            v-for="menu in menus"
            :key="menu.to"
            :to="menu.to"
            class="menu-item"
          >
            <span class="menu-visual">

              <img
                v-if="menu.image"
                :src="menu.image"
                :alt="menu.title"
                class="menu-image"
              >

              <i
                v-else
                class="menu-icon"
                :class="menu.icon"
                aria-hidden="true"
              ></i>

            </span>

            <strong>{{ menu.title }}</strong>
            <small>{{ menu.description }}</small>
          </NuxtLink>
        </nav>
      </section>

      <section class="activity-section">
        <div class="section-heading activity-heading">
          <div>
            <p class="section-title text-display">Recent Activities</p>
          </div>
          <CommonIconButton
            v-if="token"
            icon="fa-rotate-right"
            label="Refresh activities"
            :loading="isLoadingActivities"
            @click="loadActivities"
          />
          <NuxtLink v-else to="/profile" class="activity-login">Login</NuxtLink>
        </div>

        <p v-if="activityError" class="activity-state error">{{ activityError }}</p>
        <p v-else-if="isLoadingActivities && !activities.length" class="activity-state">Loading activities...</p>
        <p v-else-if="!token" class="activity-state">Login melalui Profile untuk melihat aktivitas.</p>
        <p v-else-if="!activities.length" class="activity-state">No activities yet.</p>

        <div v-else class="activity-list">
          <article v-for="activity in activities" :key="activity.id" class="activity-card">
            <span class="activity-icon">
              <img
                :src="activity.type === 'Stars' ? '/assets/stars.png' : '/assets/rupiah.png'"
                :alt="`${activity.type} icon`"
              >
            </span>
            <div class="activity-copy">
              <strong>{{ activity.title }}</strong>
              <p>{{ activity.description }}</p>
              <small>{{ activity.type }} · {{ formatActivityDate(activity.createdAt) }}</small>
            </div>
            <span class="activity-clock" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6.8v5.6l3.8 2.2"></path>
              </svg>
            </span>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped src="./home/style.css"></style>
