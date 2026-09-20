import { computed, onMounted, ref } from 'vue'
import Swal from 'sweetalert2'

export const useStarsPage = () => {
  const { $apiFetch } = useNuxtApp()
  const numberOfStars = ref(0)
  const selectedType = ref('')
  const numberError = ref('')
  const typeError = ref('')
  const showConfirmation = ref(false)
  const showResult = ref(false)
  const isSaving = ref(false)
  const history = ref([])
  const isLoadingHistory = ref(false)
  const selectedHistory = ref(null)
  const isDeleting = ref(false)
  const authToken = useCookie('auth_token')
  
  const authHeaders = computed(() => ({
    Authorization: `Bearer ${authToken.value}`
  }))
  
  const rows = computed(() => {
    return Array.from({ length: numberOfStars.value }, (_, index) => index + 1)
  })
  
  const increment = () => {
    if (numberOfStars.value < 30) {
      numberOfStars.value++
    }
  }
  
  const decrement = () => {
    if (numberOfStars.value > 0) {
      numberOfStars.value--
    }
  }
  
  const validateNumber = () => {
    numberOfStars.value = Math.max(0, Math.min(30, Number(numberOfStars.value) || 0))
  }
  
  const openConfirmation = () => {
    numberError.value = numberOfStars.value < 1 ? 'Number of stars must be at least 1.' : ''
    typeError.value = !selectedType.value ? 'Please select one star type.' : ''
  
    if (numberError.value || typeError.value) {
      return
    }
  
    showConfirmation.value = true
  }
  
  const generateStars = () => {
    showConfirmation.value = false
    showResult.value = true
  }
  
  const loadHistory = async () => {
    isLoadingHistory.value = true
    try {
      const response = await $apiFetch('/api/stars', {
        headers: authHeaders.value
      })
      history.value = response.data ?? []
    } catch (error) {
      await Swal.fire({ icon: 'error', title: 'Failed', text: error.data?.message ?? 'Failed to load stars history.' })
    } finally {
      isLoadingHistory.value = false
    }
  }
  
  const saveStars = async () => {
    isSaving.value = true
    try {
      const response = await $apiFetch('/api/stars', {
        method: 'POST',
        headers: authHeaders.value,
        body: {
          number: numberOfStars.value,
          type: selectedType.value
        }
      })
  
      await loadHistory()
      await Swal.fire({ icon: 'success', title: 'Success', text: response.message })
    } catch (error) {
      await Swal.fire({ icon: 'error', title: 'Failed', text: error.data?.message ?? 'Failed to save stars result.' })
    } finally {
      isSaving.value = false
    }
  }
  
  const deleteHistory = async () => {
    if (!selectedHistory.value) return
  
    isDeleting.value = true
    try {
      await $apiFetch(`/api/stars/${selectedHistory.value.id}`, {
        method: 'DELETE',
        headers: authHeaders.value
      })
  
      selectedHistory.value = null
      await loadHistory()
      await Swal.fire({ icon: 'success', title: 'Success', text: 'Stars history deleted successfully' })
    } catch (error) {
      await Swal.fire({ icon: 'error', title: 'Failed', text: error.data?.message ?? 'Failed to delete stars history.' })
    } finally {
      isDeleting.value = false
    }
  }
  
  onMounted(loadHistory)

  return { numberOfStars, selectedType, numberError, typeError, showConfirmation, showResult, isSaving, history, isLoadingHistory, selectedHistory, isDeleting, authToken, authHeaders, rows, increment, decrement, validateNumber, openConfirmation, generateStars, loadHistory, saveStars, deleteHistory }
}
