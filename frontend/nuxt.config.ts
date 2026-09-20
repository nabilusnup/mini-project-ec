// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: [
    '@fontsource/dm-sans/400.css',
    '@fontsource/dm-sans/600.css',
    '@fontsource/dm-sans/700.css',
    '@fortawesome/fontawesome-free/css/all.min.css'
  ],
  runtimeConfig: {
    public: {
      recaptchaSiteKey: '',
      apiBaseUrl: ''
    }
  }
})
