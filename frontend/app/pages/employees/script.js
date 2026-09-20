import { ref, computed, onBeforeUnmount, onMounted, watch } from 'vue'
import Swal from 'sweetalert2'

export const useEmployeesPage = () => {
  const { $apiFetch } = useNuxtApp()
  const config = useRuntimeConfig()
  const regionController = new AbortController()
  const API_URL = '/api/employees'
  const authToken = useCookie('auth_token')

  const authUser = useCookie('auth_user')

  const cachedProfile = useState('employee_profile', () => null)
  
  const authHeaders = computed(() => ({
    Authorization: `Bearer ${authToken.value}`
  }))
  
  const search = ref('')
  const debouncedSearch = ref('')
  let searchTimer

  watch(search, value => {
    clearTimeout(searchTimer)
    searchTimer = setTimeout(() => {
      debouncedSearch.value = value.trim()
    }, 350)
  })
  
  const { data, error, pending, refresh } = useLazyFetch(
    API_URL,
    {
      baseURL: config.public.apiBaseUrl,
      query: {
        search: debouncedSearch
      },
      headers: authHeaders
    }
  )
  
  const employees = computed(() => {
    return data.value?.data ?? []
  })

  const isLoadingEmployees = computed(() => {
    return pending.value || (!data.value && !error.value)
  })
  
  const formatSalary = (salary) => {
    return new Intl.NumberFormat('id-ID').format(salary ?? 0)
  }

  const avatarInitial = name => {
    return name?.trim().charAt(0).toUpperCase() || '?'
  }
  
  const salaryRanges = {
    Staff: { min: 5000000, max: 7000000 },
    Supervisor: { min: 7000000, max: 10000000 },
    Manager: { min: 10000000, max: 15000000 }
  }
  
  const selectedSalaryRange = computed(() => {
    return salaryRanges[form.value.position] ?? null
  })

  const formattedSalary = computed({
    get() {
      const digits = String(form.value.salary ?? '').replace(/\D/g, '')

      if (!digits) {
        return ''
      }

      return new Intl.NumberFormat('id-ID').format(Number(digits))
    },
    set(value) {
      form.value.salary = String(value).replace(/\D/g, '')
    }
  })
  
  const showFormModal = ref(false)
  
  const showDetailModal = ref(false)
  
  const showDeleteModal = ref(false)
  
  const modalMode = ref('add')
  
  const editingEmployeeId = ref(null)
  
  const detailEmployee = ref(null)
  
  const selectedDeleteEmployee = ref(null)
  
  const isSubmitting = ref(false)
  
  const isDeleting = ref(false)
  
  const isLoadingDetail = ref(false)
  
  const defaultForm = () => ({
    employee_id: '',
    name: '',
    birth_date: '',
    age: '',
    address: '',
  
    province: '',
    province_id: '',
  
    city: '',
    city_id: '',
  
    district: '',
    district_id: '',
  
    village: '',
    village_id: '',
  
    position: '',
    salary: '',
    email: '',
    password: '',
    password_confirmation: ''
  })
  
  const form = ref(defaultForm())
  
  const fieldErrors = ref({})
  
  const resetForm = () => {
    form.value = defaultForm()
  
    dataKabupaten.value = []
    dataKecamatan.value = []
    dataKelurahan.value = []
  
    fieldErrors.value = {}
  }
  
  const dataProvinsi = ref([])
  const dataKabupaten = ref([])
  const dataKecamatan = ref([])
  const dataKelurahan = ref([])
  
  const getDataProvinsi = async () => {
    try {
      const res = await fetch(
        'https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json',
        { signal: regionController.signal }
      )
  
      if (!res.ok) {
        throw new Error('Failed to load provinces')
      }
  
      dataProvinsi.value = await res.json()
    } catch (err) {
      if (err.name === 'AbortError') return
      await Swal.fire({ icon: 'error', title: 'Failed', text: 'Failed to load provinces. Please try again later.' })
    }
  }
  
  const getDataKabupaten = async (idProv) => {
    dataKabupaten.value = []
    dataKecamatan.value = []
    dataKelurahan.value = []
  
    if (!idProv) {
      return
    }
  
    try {
      const res = await fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${idProv}.json`,
        { signal: regionController.signal }
      )
  
      if (!res.ok) {
        throw new Error('Failed to load cities/regencies')
      }
  
      dataKabupaten.value = await res.json()
    } catch (err) {
      if (err.name === 'AbortError') return
      await Swal.fire({ icon: 'error', title: 'Failed', text: 'Failed to load cities/regencies. Please try again later.' })
    }
  }
  
  const getDataKecamatan = async (idKab) => {
    dataKecamatan.value = []
    dataKelurahan.value = []
  
    if (!idKab) {
      return
    }
  
    try {
      const res = await fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${idKab}.json`,
        { signal: regionController.signal }
      )
  
      if (!res.ok) {
        throw new Error('Failed to load districts')
      }
  
      dataKecamatan.value = await res.json()
    } catch (err) {
      if (err.name === 'AbortError') return
      await Swal.fire({ icon: 'error', title: 'Failed', text: 'Failed to load districts. Please try again later.' })
    }
  }
  
  const getDataKelurahan = async (idKecamatan) => {
    dataKelurahan.value = []
  
    if (!idKecamatan) {
      return
    }
  
    try {
      const res = await fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/villages/${idKecamatan}.json`,
        { signal: regionController.signal }
      )
  
      if (!res.ok) {
        throw new Error('Failed to load villages')
      }
  
      dataKelurahan.value = await res.json()
    } catch (err) {
      if (err.name === 'AbortError') return
      await Swal.fire({ icon: 'error', title: 'Failed', text: 'Failed to load villages. Please try again later.' })
    }
  }
  
  const onProvinceChange = async () => {
    const selected = dataProvinsi.value.find(
      item => String(item.id) === String(form.value.province_id)
    )
  
    form.value.province = selected?.name ?? ''
  
    form.value.city = ''
    form.value.city_id = ''
  
    form.value.district = ''
    form.value.district_id = ''
  
    form.value.village = ''
    form.value.village_id = ''
  
    if (form.value.province_id) {
      await getDataKabupaten(form.value.province_id)
    }
  }
  
  const onCityChange = async () => {
    const selected = dataKabupaten.value.find(
      item => String(item.id) === String(form.value.city_id)
    )
  
    form.value.city = selected?.name ?? ''
  
    form.value.district = ''
    form.value.district_id = ''
  
    form.value.village = ''
    form.value.village_id = ''
  
    if (form.value.city_id) {
      await getDataKecamatan(form.value.city_id)
    }
  }
  
  const onDistrictChange = async () => {
    const selected = dataKecamatan.value.find(
      item => String(item.id) === String(form.value.district_id)
    )
  
    form.value.district = selected?.name ?? ''
  
    form.value.village = ''
    form.value.village_id = ''
  
    if (form.value.district_id) {
      await getDataKelurahan(form.value.district_id)
    }
  }
  
  const onVillageChange = () => {
    const selected = dataKelurahan.value.find(
      item => String(item.id) === String(form.value.village_id)
    )
  
    form.value.village = selected?.name ?? ''
  }
  
  const findLocationByName = (items, name) => {
    if (!name) {
      return null
    }
  
    return items.find(
      item =>
        item.name?.toLowerCase().trim() ===
        name.toLowerCase().trim()
    )
  }
  
  const loadLocationForEdit = async (employee) => {
    if (!dataProvinsi.value.length) {
      await getDataProvinsi()
    }
  
    const province = findLocationByName(
      dataProvinsi.value,
      employee.province
    )
  
    if (!province) {
      return
    }
  
    form.value.province_id = province.id
    form.value.province = province.name
  
    await getDataKabupaten(province.id)
  
    const city = findLocationByName(
      dataKabupaten.value,
      employee.city
    )
  
    if (!city) {
      return
    }
  
    form.value.city_id = city.id
    form.value.city = city.name
  
    await getDataKecamatan(city.id)
  
    const district = findLocationByName(
      dataKecamatan.value,
      employee.district
    )
  
    if (!district) {
      return
    }
  
    form.value.district_id = district.id
    form.value.district = district.name
  
    await getDataKelurahan(district.id)
  
    const village = findLocationByName(
      dataKelurahan.value,
      employee.village
    )
  
    if (!village) {
      return
    }
  
    form.value.village_id = village.id
    form.value.village = village.name
  }
  
  const openAddModal = async () => {
    resetForm()
  
    modalMode.value = 'add'
    editingEmployeeId.value = null
  
    if (!dataProvinsi.value.length) {
      await getDataProvinsi()
    }
  
    showFormModal.value = true
  }
  
  const openEditModal = async (employee) => {
    resetForm()
  
    modalMode.value = 'edit'
    editingEmployeeId.value = employee.employee_id
  
    form.value = {
      ...defaultForm(),
  
      employee_id: employee.employee_id,
      name: employee.name,
      birth_date: employee.birth_date,
      age: employee.age,
      address: employee.address,
  
      province: employee.province,
      city: employee.city,
      district: employee.district,
      village: employee.village,
  
      position: employee.position,
      salary: employee.salary,
      email: employee.email,
  
      password: '',
      password_confirmation: ''
    }
  
    showFormModal.value = true
  
    await loadLocationForEdit(employee)
  }
  
  const closeFormModal = () => {
    showFormModal.value = false
  
    modalMode.value = 'add'
    editingEmployeeId.value = null
  
    resetForm()
  }
  
  const submitEmployee = async () => {
    fieldErrors.value = {}
    const salary = Number(form.value.salary)
    const range = salaryRanges[form.value.position]

    if (modalMode.value === 'add' && !form.value.password) {
      fieldErrors.value.password = 'Password is required.'
    }

    if (form.value.password && form.value.password.length < 6) {
      fieldErrors.value.password = 'Password must contain at least 6 characters.'
    }

    if (modalMode.value === 'add' && !form.value.password_confirmation) {
      fieldErrors.value.password_confirmation = 'Password confirmation is required.'
    } else if (form.value.password && !form.value.password_confirmation) {
      fieldErrors.value.password_confirmation = 'Please retype the password.'
    } else if (form.value.password !== form.value.password_confirmation) {
      fieldErrors.value.password_confirmation = 'Passwords do not match.'
    }

    if (range && (salary < range.min || salary > range.max)) {
      fieldErrors.value.salary =
        `Salary for ${form.value.position} must be between ` +
        `Rp ${formatSalary(range.min)} and Rp ${formatSalary(range.max)}`
    }

    if (Object.keys(fieldErrors.value).length) {
      return
    }
  
    isSubmitting.value = true
  
    try {
      const payload = {
        name: form.value.name,
        birth_date: form.value.birth_date,
        age: Number(form.value.age),
        address: form.value.address,
  
        province: form.value.province,
        city: form.value.city,
        district: form.value.district,
        village: form.value.village,
  
        position: form.value.position,
        salary: Number(form.value.salary),
        email: form.value.email
      }
  
      if (form.value.password) {
        payload.password = form.value.password
      }
  
      if (modalMode.value === 'add') {
        payload.employee_id = form.value.employee_id
  
        await $apiFetch(API_URL, {
          method: 'POST',
          headers: authHeaders.value,
          body: payload
        })
      } else {
        await $apiFetch(
          `${API_URL}/${editingEmployeeId.value}`,
          {
            method: 'PUT',
            headers: authHeaders.value,
            body: payload
          }
        )
      }
  
      await refresh()

      if (
        modalMode.value === 'edit' &&
        editingEmployeeId.value === authUser.value?.employee_id
      ) {
        authUser.value = {
          ...authUser.value,
          name: form.value.name,
          email: form.value.email
        }
        cachedProfile.value = null
      }
  
      const message =
        modalMode.value === 'add'
          ? 'Employee added successfully'
          : 'Employee updated successfully'
  
      closeFormModal()
  
      await Swal.fire({ icon: 'success', title: 'Success', text: message })
    } catch (err) {
      const errors = err?.data?.errors ?? {}
      fieldErrors.value = Object.fromEntries(
        Object.entries(errors).map(([field, messages]) => [
          field,
          Array.isArray(messages) ? messages[0] : messages
        ])
      )
  
      if (!Object.keys(fieldErrors.value).length) {
        await Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: err?.data?.message || 'Something went wrong while saving the employee'
        })
      }
    } finally {
      isSubmitting.value = false
    }
  }
  
  const openShowModal = async (employeeId) => {
    showDetailModal.value = true
  
    isLoadingDetail.value = true
    detailEmployee.value = null
  
    try {
      const response = await $apiFetch(
        `${API_URL}/${employeeId}`,
        { headers: authHeaders.value }
      )
  
      detailEmployee.value = response.data
    } catch (err) {
      await Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: err?.data?.message || 'Failed to load employee detail'
      })
  
      showDetailModal.value = false
    } finally {
      isLoadingDetail.value = false
    }
  }
  
  const closeDetailModal = () => {
    showDetailModal.value = false
    detailEmployee.value = null
  }
  
  const editFromDetail = async () => {
    if (!detailEmployee.value) return
    const employee = { ...detailEmployee.value }
    closeDetailModal()
    await openEditModal(employee)
  }
  
  const deleteFromDetail = () => {
    if (!detailEmployee.value) return
    const employee = { ...detailEmployee.value }
    closeDetailModal()
    openDeleteModal(employee)
  }
  
  const openDeleteModal = (employee) => {
    selectedDeleteEmployee.value = employee
    showDeleteModal.value = true
  }
  
  const closeDeleteModal = () => {
    selectedDeleteEmployee.value = null
    showDeleteModal.value = false
  }
  
  const deleteEmployee = async () => {
    if (!selectedDeleteEmployee.value) {
      return
    }
  
    isDeleting.value = true
  
    try {
      await $apiFetch(
        `${API_URL}/${selectedDeleteEmployee.value.employee_id}`,
        {
          method: 'DELETE',
          headers: authHeaders.value
        }
      )
  
      closeDeleteModal()
  
      await refresh()
  
      await Swal.fire({ icon: 'success', title: 'Success', text: 'Employee deleted successfully' })
    } catch (err) {
      await Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: err?.data?.message || 'Failed to delete employee'
      })
    } finally {
      isDeleting.value = false
    }
  }
  
  onMounted(() => {
    getDataProvinsi()
  })

  onBeforeUnmount(() => {
    clearTimeout(searchTimer)
    regionController.abort()
  })

  return { API_URL, authToken, authHeaders, search, employees, error, isLoadingEmployees, formatSalary, formattedSalary, avatarInitial, salaryRanges, selectedSalaryRange, showFormModal, showDetailModal, showDeleteModal, modalMode, editingEmployeeId, detailEmployee, selectedDeleteEmployee, isSubmitting, isDeleting, isLoadingDetail, defaultForm, form, fieldErrors, resetForm, dataProvinsi, dataKabupaten, dataKecamatan, dataKelurahan, getDataProvinsi, getDataKabupaten, getDataKecamatan, getDataKelurahan, onProvinceChange, onCityChange, onDistrictChange, onVillageChange, findLocationByName, loadLocationForEdit, openAddModal, openEditModal, closeFormModal, submitEmployee, openShowModal, closeDetailModal, editFromDetail, deleteFromDetail, openDeleteModal, closeDeleteModal, deleteEmployee }
}
