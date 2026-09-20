import { computed, onMounted, ref } from 'vue'

export const useProfilePage = () => {
  const { $apiFetch } = useNuxtApp()
  const token = useCookie('auth_token')
  const authUser = useCookie('auth_user')
  const profile = useState('employee_profile', () => null)
  const pending = ref(!profile.value)
  const error = ref('')
  
  const formatSalary = value => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value ?? 0)
  
  const fields = computed(() => {
    if (!profile.value) return []
  
    return [
      { label: 'Employee ID', value: profile.value.employee_id, icon: 'fa-id-card' },
      { label: 'Email', value: profile.value.email, icon: 'fa-envelope' },
      { label: 'Birth Date', value: profile.value.birth_date, icon: 'fa-calendar-days' },
      { label: 'Age', value: `${profile.value.age} years`, icon: 'fa-cake-candles' },
      { label: 'Position', value: profile.value.position, icon: 'fa-briefcase' },
      { label: 'Salary', value: formatSalary(profile.value.salary), icon: 'fa-coins' },
      { label: 'Address', value: profile.value.address, icon: 'fa-location-dot' },
      { label: 'Province', value: profile.value.province, icon: 'fa-map' },
      { label: 'City / Regency', value: profile.value.city, icon: 'fa-city' },
      { label: 'District', value: profile.value.district, icon: 'fa-map-pin' },
      { label: 'Village', value: profile.value.village, icon: 'fa-house' }
    ]
  })
  
  const loadProfile = async () => {
    if (!token.value) {
      pending.value = false
      await navigateTo('/login')
      return
    }
    pending.value = true
    error.value = ''
    try {
      const response = await $apiFetch('/api/profile', {
        headers: { Authorization: `Bearer ${token.value}` }
      })
      profile.value = response.data
    } catch (requestError) {
      error.value = requestError.data?.message ?? 'Profile failed to load.'
  
      if (requestError.statusCode === 401) {
        token.value = null
        authUser.value = null
        await navigateTo('/login')
      }
    } finally {
      pending.value = false
    }
  }
  
  const logout = async () => {
    try {
      await $apiFetch('/api/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token.value}` }
      })
    } finally {
      token.value = null
      authUser.value = null
      profile.value = null
      await navigateTo('/login')
    }
  }
  
  onMounted(() => {
    if (profile.value) {
      pending.value = false
      return
    }
  
    loadProfile()
  })

  return { token, authUser, profile, pending, error, formatSalary, fields, loadProfile, logout }
}
