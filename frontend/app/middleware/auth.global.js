export default defineNuxtRouteMiddleware(async (to) => {
  const token = useCookie('auth_token')
  const authUser = useCookie('auth_user')
  const config = useRuntimeConfig()

  if (!token.value) {
    if (to.path !== '/login') return navigateTo('/login')
    return
  }

  if (to.path === '/login' && authUser.value) return navigateTo('/')

  if (authUser.value) {
    return
  }

  try {
    const response = await $fetch(`${config.public.apiBaseUrl}/api/me`, {
      headers: { Authorization: `Bearer ${token.value}` }
    })

    authUser.value = response.data
    if (to.path === '/login') return navigateTo('/')
  } catch {
    token.value = null
    authUser.value = null

    if (to.path !== '/login') return navigateTo('/login')
  }
})
