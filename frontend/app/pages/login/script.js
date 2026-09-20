import { onBeforeUnmount, onMounted, ref } from 'vue'
import Swal from 'sweetalert2'

export const useLoginPage = () => {
  const { $apiFetch } = useNuxtApp()
  const config = useRuntimeConfig()
  
  const email = ref('')
  
  const password = ref('')
  
  const fieldErrors = ref({})
  
  const isSubmitting = ref(false)
  
  const recaptchaElement = ref(null)
  
  const recaptchaToken = ref('')
  
  const recaptchaWidgetId = ref(null)
  
  let recaptchaTimer = null
  
  const token = useCookie('auth_token', {
    maxAge: 60 * 60 * 24,
    sameSite: 'lax'
  })
  
  const authUser = useCookie('auth_user', {
    maxAge: 60 * 60 * 24,
    sameSite: 'lax'
  })
  
  const renderRecaptcha = () => {
    if (!window.grecaptcha || !recaptchaElement.value || recaptchaWidgetId.value !== null) {
      return
    }
  
    recaptchaWidgetId.value = window.grecaptcha.render(recaptchaElement.value, {
      sitekey: config.public.recaptchaSiteKey,
      callback: (tokenValue) => {
        recaptchaToken.value = tokenValue
      },
      'expired-callback': () => {
        recaptchaToken.value = ''
      },
      'error-callback': () => {
        recaptchaToken.value = ''
        Swal.fire({ icon: 'error', title: 'Failed', text: 'Google reCAPTCHA failed to load.' })
      }
    })
  }
  
  const loadRecaptcha = () => {
    if (!config.public.recaptchaSiteKey) {
      Swal.fire({ icon: 'error', title: 'Configuration Error', text: 'Google reCAPTCHA site key is not configured.' })
      return
    }
  
    if (window.grecaptcha) {
      renderRecaptcha()
      return
    }
  
    const existingScript = document.querySelector('script[data-recaptcha-script]')
  
    if (!existingScript) {
      const script = document.createElement('script')
      script.src = 'https://www.google.com/recaptcha/api.js?render=explicit'
      script.async = true
      script.defer = true
      script.dataset.recaptchaScript = 'true'
      document.head.appendChild(script)
    }
  
    recaptchaTimer = window.setInterval(() => {
      if (window.grecaptcha) {
        window.clearInterval(recaptchaTimer)
        recaptchaTimer = null
        renderRecaptcha()
      }
    }, 200)
  }
  
  const resetRecaptcha = () => {
    recaptchaToken.value = ''
  
    if (window.grecaptcha && recaptchaWidgetId.value !== null) {
      window.grecaptcha.reset(recaptchaWidgetId.value)
    }
  }
  
  const login = async () => {
    fieldErrors.value = {}
  
    if (!email.value) fieldErrors.value.email = 'Email is required.'
    if (!password.value) fieldErrors.value.password = 'Password is required.'
  
    if (Object.keys(fieldErrors.value).length) {
      return
    }
  
    if (!recaptchaToken.value) {
      fieldErrors.value.recaptcha_token = 'Please check the Google reCAPTCHA box.'
      return
    }
  
    isSubmitting.value = true
  
    try {
      const response = await $apiFetch('/api/login', {
        method: 'POST',
        body: {
          email: email.value,
          password: password.value,
          recaptcha_token: recaptchaToken.value
        }
      })
  
      token.value = response.token
      authUser.value = response.user
      await navigateTo('/')
    } catch (error) {
      const errors = error.data?.errors ?? {}
      fieldErrors.value = Object.fromEntries(
        Object.entries(errors).map(([field, messages]) => [
          field,
          Array.isArray(messages) ? messages[0] : messages
        ])
      )
      if (!Object.keys(fieldErrors.value).length) {
        await Swal.fire({ icon: 'error', title: 'Login Failed', text: error.data?.message ?? 'Login failed. Please try again.' })
      }
      resetRecaptcha()
    } finally {
      isSubmitting.value = false
    }
  }
  
  onMounted(loadRecaptcha)
  
  onBeforeUnmount(() => {
    if (recaptchaTimer) {
      window.clearInterval(recaptchaTimer)
    }
  })

  return { config, email, password, fieldErrors, isSubmitting, recaptchaElement, recaptchaToken, recaptchaWidgetId, recaptchaTimer, token, authUser, renderRecaptcha, loadRecaptcha, resetRecaptcha, login }
}
