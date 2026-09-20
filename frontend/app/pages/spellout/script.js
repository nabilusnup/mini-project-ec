import { ref, computed, onMounted } from 'vue'
import { showAlert } from '../../utils/alert'

export const useSpelloutPage = () => {
  const { $apiFetch } = useNuxtApp()
  const amount = ref('')
  const result = ref('')
  const isSaving = ref(false)
  const history = ref([])
  const isLoadingHistory = ref(false)
  const selectedHistory = ref(null)
  const isDeleting = ref(false)
  const amountError = ref('')
  const authToken = useCookie('auth_token')
  
  const authHeaders = computed(() => ({
    Authorization: `Bearer ${authToken.value}`
  }))
  
  const numericAmount = computed(() => {
    return Number(
      String(amount.value)
        .replace(/\D/g, '')
    )
  })
  
  const formattedAmount = computed(() => {
    if (!numericAmount.value) {
      return ''
    }
  
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(numericAmount.value)
  })
  
  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value ?? 0)
  }
  
  const loadHistory = async () => {
    isLoadingHistory.value = true
    try {
      const response = await $apiFetch('/api/terbilang', {
        headers: authHeaders.value
      })
      history.value = response.data ?? []
    } catch (error) {
      await showAlert({ icon: 'error', title: 'Failed', text: error.data?.message ?? 'Failed to load conversion history.' })
    } finally {
      isLoadingHistory.value = false
    }
  }
  
  const numberToWords = (angka) => {
    const huruf = [
      '',
      'Satu',
      'Dua',
      'Tiga',
      'Empat',
      'Lima',
      'Enam',
      'Tujuh',
      'Delapan',
      'Sembilan',
      'Sepuluh',
      'Sebelas'
    ]
  
    angka = Number(angka)
  
    if (angka < 12) {
      return huruf[angka]
    }
  
    if (angka < 20) {
      return numberToWords(angka - 10) + ' Belas'
    }
  
    if (angka < 100) {
      return (
        numberToWords(Math.floor(angka / 10)) +
        ' Puluh ' +
        numberToWords(angka % 10)
      )
    }
  
    if (angka < 200) {
      return 'Seratus ' + numberToWords(angka - 100)
    }
  
    if (angka < 1000) {
      return (
        numberToWords(Math.floor(angka / 100)) +
        ' Ratus ' +
        numberToWords(angka % 100)
      )
    }
  
    if (angka < 2000) {
      return 'Seribu ' + numberToWords(angka - 1000)
    }
  
    if (angka < 1000000) {
      return (
        numberToWords(Math.floor(angka / 1000)) +
        ' Ribu ' +
        numberToWords(angka % 1000)
      )
    }
  
    if (angka < 1000000000) {
      return (
        numberToWords(Math.floor(angka / 1000000)) +
        ' Juta ' +
        numberToWords(angka % 1000000)
      )
    }
  
    if (angka < 1000000000000) {
      return (
        numberToWords(Math.floor(angka / 1000000000)) +
        ' Miliar ' +
        numberToWords(angka % 1000000000)
      )
    }
  
    if (angka < 1000000000000000) {
      return (
        numberToWords(Math.floor(angka / 1000000000000)) +
        ' Triliun ' +
        numberToWords(angka % 1000000000000)
      )
    }
  
    return 'Amount is too large'
  }
  
  const generateWords = () => {
    amountError.value = ''
    if (!numericAmount.value) {
      result.value = ''
      amountError.value = 'Amount is required and must be greater than 0.'
      return
    }
  
    result.value =
      numberToWords(numericAmount.value)
        .replace(/\s+/g, ' ')
        .trim() +
      ' Rupiah'
  }
  
  const saveResult = async () => {
    if (!result.value || !numericAmount.value) {
      await showAlert({ icon: 'warning', title: 'Result Required', text: 'Click the Spell Out button first.' })
      return
    }
  
    isSaving.value = true
    try {
      const response = await $apiFetch('/api/terbilang', {
        method: 'POST',
        headers: authHeaders.value,
        body: {
          amount: numericAmount.value,
          result: result.value
        }
      })
  
      await loadHistory()
      await showAlert({ icon: 'success', title: 'Success', text: response.message })
    } catch (error) {
      await showAlert({ icon: 'error', title: 'Failed', text: error.data?.message ?? 'Failed to save the result.' })
    } finally {
      isSaving.value = false
    }
  }
  
  const deleteHistory = async () => {
    if (!selectedHistory.value) return
  
    isDeleting.value = true
    try {
      await $apiFetch(`/api/terbilang/${selectedHistory.value.id}`, {
        method: 'DELETE',
        headers: authHeaders.value
      })
  
      selectedHistory.value = null
      await loadHistory()
      await showAlert({ icon: 'success', title: 'Success', text: 'The result was deleted.' })
    } catch (error) {
      await showAlert({ icon: 'error', title: 'Failed', text: error.data?.message ?? 'Failed to delete the history entry.' })
    } finally {
      isDeleting.value = false
    }
  }
  
  const handleInput = (event) => {
    const value = event.target.value.replace(/\D/g, '')
  
    amount.value = value
  }
  
  onMounted(loadHistory)

  return { amount, result, isSaving, history, isLoadingHistory, selectedHistory, isDeleting, amountError, authToken, authHeaders, numericAmount, formattedAmount, formatRupiah, loadHistory, numberToWords, generateWords, saveResult, deleteHistory, handleInput }
}
