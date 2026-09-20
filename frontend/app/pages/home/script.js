import { onMounted, ref } from 'vue'

export const useHomePage = () => {
  const { $apiFetch } = useNuxtApp()
  const token = useCookie('auth_token')
  
  const activities = ref([])
  
  const cachedProfile = useState('employee_profile', () => null)
  
  const isLoadingActivities = ref(false)
  
  const activityError = ref('')
  
  const menus = [
    { title: 'Employee', description: 'Manage employee', image: '/assets/employee.png', to: '/employees' },
    { title: 'Spell Out', description: 'Convert amount', image: '/assets/rupiah.png', to: '/spellout' },
    { title: 'Stars', description: 'Generate pattern', image: '/assets/stars.png', to: '/stars' }
  ]
  
  const formatActivityDate = value => {
    if (!value) return '-'
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(value))
  }
  
  const formatRupiah = value => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value ?? 0)
  
  const loadActivities = async () => {
    isLoadingActivities.value = true
    activityError.value = ''
  
    try {
      const headers = { Authorization: `Bearer ${token.value}` }
      const [spelloutResponse, starsResponse] = await Promise.all([
        $apiFetch('/api/terbilang', { headers }),
        $apiFetch('/api/stars', { headers })
      ])
  
      const spelloutActivities = (spelloutResponse.data ?? []).map(item => ({
        id: `spellout-${item.id}`,
        type: 'Spell Out',
        title: formatRupiah(item.amount),
        description: item.result,
        createdAt: item.created_at
      }))
  
      const starActivities = (starsResponse.data ?? []).map(item => ({
        id: `stars-${item.id}`,
        type: 'Stars',
        title: `${item.number} Stars`,
        description: item.type,
        createdAt: item.created_at
      }))
  
      activities.value = [...spelloutActivities, ...starActivities]
        .sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt))
        .slice(0, 6)
    } catch (error) {
      activityError.value = error.data?.message ?? 'Failed to load recent activities.'
    } finally {
      isLoadingActivities.value = false
    }
  }
  
  const preloadProfile = async () => {
    if (cachedProfile.value) return
  
    try {
      const response = await $apiFetch('/api/profile', {
        headers: { Authorization: `Bearer ${token.value}` }
      })
      cachedProfile.value = response.data
    } catch {
      cachedProfile.value = null
    }
  }
  
  onMounted(() => {
    if (!token.value) return
    loadActivities()
    preloadProfile()
  })

  return { token, activities, cachedProfile, isLoadingActivities, activityError, menus, formatActivityDate, formatRupiah, loadActivities, preloadProfile }
}
