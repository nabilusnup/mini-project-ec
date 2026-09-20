export default defineNuxtPlugin(() => {
  const router = useRouter()
  const config = useRuntimeConfig()
  const activeRequests = new Set()

  const apiFetch = (url, options = {}) => {
    const controller = new AbortController()
    const requestUrl = url.startsWith('/api')
      ? `${config.public.apiBaseUrl}${url}`
      : url

    activeRequests.add(controller)

    return $fetch(requestUrl, {
      ...options,
      signal: controller.signal
    }).then(response => {
      activeRequests.delete(controller)
      return response
    }).catch(error => {
      activeRequests.delete(controller)

      if (controller.signal.aborted) {
        return new Promise(() => {})
      }

      throw error
    })
  }

  router.beforeEach(() => {
    activeRequests.forEach(controller => controller.abort())
    activeRequests.clear()
  })

  return {
    provide: { apiFetch }
  }
})
