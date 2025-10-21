<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-80 transition-opacity" @click="closeModal"></div>

      <div class="inline-block transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:align-middle">
        <div class="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Yeni Randevu Oluştur
            </h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
              <span class="sr-only">Kapat</span>
              <XMarkIcon class="h-6 w-6" />
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Müşteri -->
            <div class="relative">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Müşteri <span class="text-red-500">*</span>
              </label>
              <input
                v-model="customerSearch"
                type="text"
                class="form-input"
                :class="{ 'border-red-500': errors.customer }"
                placeholder="En az 3 harf yazarak müşteri arayın..."
                @focus="showCustomerDropdown = true"
                @blur="hideCustomerDropdown"
              />
              <div v-if="showCustomerDropdown && filteredCustomers.length > 0" class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
                <button
                  v-for="customer in filteredCustomers"
                  :key="customer.id"
                  type="button"
                  @mousedown.prevent="selectCustomer(customer)"
                  class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-900 dark:text-gray-100"
                >
                  {{ customer.name }} {{ customer.surname }}
                </button>
              </div>
              <p v-if="errors.customer" class="mt-1 text-sm text-red-600">{{ errors.customer }}</p>
            </div>

            <!-- Tarih ve Saat -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Başlangıç Zamanı <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.startTime"
                  type="datetime-local"
                  class="form-input"
                  :class="{ 'border-red-500': errors.startTime }"
                />
                <p v-if="errors.startTime" class="mt-1 text-sm text-red-600">{{ errors.startTime }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bitiş Zamanı
                </label>
                <input
                  v-model="form.endTime"
                  type="datetime-local"
                  class="form-input"
                  :class="{ 'border-red-500': errors.endTime }"
                />
                <p v-if="errors.endTime" class="mt-1 text-sm text-red-600">{{ errors.endTime }}</p>
              </div>
            </div>

            <!-- Hastane ve Doktor -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="relative">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Hastane
                </label>
                <input
                  v-model="hospitalSearch"
                  type="text"
                  class="form-input"
                  placeholder="Hastane adı yazın..."
                  @focus="showHospitalDropdown = true"
                  @blur="hideHospitalDropdown"
                />
                <div v-if="showHospitalDropdown && filteredHospitals.length > 0" class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
                  <button
                    v-for="hospital in filteredHospitals"
                    :key="hospital.id"
                    type="button"
                    @mousedown.prevent="selectHospital(hospital)"
                    class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-900 dark:text-gray-100"
                  >
                    {{ hospital.name }}
                  </button>
                </div>
              </div>

              <div class="relative">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Doktor
                </label>
                <input
                  v-model="doctorSearch"
                  type="text"
                  class="form-input"
                  :disabled="!form.hospitalId"
                  placeholder="Doktor adı yazın..."
                  @focus="showDoctorDropdown = true"
                  @blur="hideDoctorDropdown"
                />
                <div v-if="showDoctorDropdown && filteredDoctorsForSearch.length > 0" class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
                  <button
                    v-for="doctor in filteredDoctorsForSearch"
                    :key="doctor.id"
                    type="button"
                    @mousedown.prevent="selectDoctor(doctor)"
                    class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-900 dark:text-gray-100"
                  >
                    {{ doctor.name }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Durum -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Durum <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.meetingStatus"
                required
                class="form-input"
                :class="{ 'border-red-500': errors.meetingStatus }"
              >
                <option value="">Durum seçin...</option>
                <option v-for="status in meetingStatuses" :key="status.id" :value="status.id">
                  {{ status.name }}
                </option>
              </select>
              <p v-if="errors.meetingStatus" class="mt-1 text-sm text-red-600">{{ errors.meetingStatus }}</p>
            </div>

            <!-- Açıklama -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Açıklama
              </label>
              <textarea
                v-model="form.description"
                rows="3"
                maxlength="1000"
                class="form-input"
                placeholder="Randevu ile ilgili notlarınızı buraya yazın..."
              ></textarea>
            </div>

            <!-- Form Actions -->
            <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                @click="closeModal"
                class="inline-flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-700 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                İptal
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="loading" class="mr-2">
                  <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                {{ loading ? 'Kaydediliyor...' : 'Randevu Oluştur' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  modelValue: boolean
  initialStartTime?: Date | string
  initialEndTime?: Date | string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'created': []
}>()

const authStore = useAuthStore()
const { createMeeting } = useMeetings()
const { hospitals, fetchHospitals } = useHospitals()
const { statuses: meetingStatuses, fetchMeetingStatuses } = useMeetingStatuses()

// Form state
const form = ref({
  customer: '',
  hospitalId: '',
  doctorId: '',
  startTime: '',
  endTime: '',
  meetingStatus: '',
  description: ''
})

const errors = ref<Record<string, string>>({})
const loading = ref(false)
const customers = ref<any[]>([])
const hospitalDoctors = ref<any[]>([])

// Search states
const customerSearch = ref('')
const hospitalSearch = ref('')
const doctorSearch = ref('')
const showCustomerDropdown = ref(false)
const showHospitalDropdown = ref(false)
const showDoctorDropdown = ref(false)

// Computed
const filteredCustomers = computed(() => customers.value)

const filteredHospitals = computed(() => {
  if (!hospitalSearch.value) {
    return hospitals.value
  }
  const search = hospitalSearch.value.toLowerCase()
  return hospitals.value.filter(hospital =>
    hospital.name.toLowerCase().includes(search)
  )
})

const filteredDoctors = computed(() => hospitalDoctors.value)

const filteredDoctorsForSearch = computed(() => {
  const baseDoctors = filteredDoctors.value

  if (!doctorSearch.value) {
    return baseDoctors
  }

  const search = doctorSearch.value.toLowerCase()
  return baseDoctors.filter(doctor =>
    doctor.name.toLowerCase().includes(search)
  )
})

// Watch for initial values
watch(() => props.initialStartTime, (newVal) => {
  if (newVal) {
    const date = new Date(newVal)
    form.value.startTime = formatDateTimeLocal(date)
  }
}, { immediate: true })

watch(() => props.initialEndTime, (newVal) => {
  if (newVal) {
    const date = new Date(newVal)
    form.value.endTime = formatDateTimeLocal(date)
  }
}, { immediate: true })

// Watch customerSearch and fetch from API
const searchTimeout = ref<number | null>(null)
watch(customerSearch, (newValue) => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
    searchTimeout.value = null
  }

  if (!newValue || newValue.length < 3) {
    customers.value = []
    if (!newValue) {
      form.value.customer = ''
    }
    return
  }

  searchTimeout.value = window.setTimeout(() => {
    fetchCustomers(newValue)
    searchTimeout.value = null
  }, 300)
})

// Methods
const formatDateTimeLocal = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

const selectCustomer = (customer: any) => {
  form.value.customer = customer.id
  customerSearch.value = `${customer.name} ${customer.surname}`
  showCustomerDropdown.value = false
}

const selectHospital = async (hospital: any) => {
  form.value.hospitalId = hospital.id
  hospitalSearch.value = hospital.name
  showHospitalDropdown.value = false
  form.value.doctorId = ''
  doctorSearch.value = ''
  hospitalDoctors.value = []

  try {
    const $api = useApi()
    const response = await $api(`/hospitals/${hospital.id}/doctors`)
    hospitalDoctors.value = Array.isArray(response) ? response : (response.data || [])
  } catch (err) {
    console.error('Failed to fetch hospital doctors:', err)
    hospitalDoctors.value = []
  }
}

const selectDoctor = (doctor: any) => {
  form.value.doctorId = doctor.id
  doctorSearch.value = doctor.name
  showDoctorDropdown.value = false
}

const hideCustomerDropdown = () => {
  setTimeout(() => {
    showCustomerDropdown.value = false
  }, 200)
}

const hideHospitalDropdown = () => {
  setTimeout(() => {
    showHospitalDropdown.value = false
  }, 200)
}

const hideDoctorDropdown = () => {
  setTimeout(() => {
    showDoctorDropdown.value = false
  }, 200)
}

const fetchCustomers = async (search = '') => {
  try {
    const api = useApi()
    const params = new URLSearchParams({
      search: search,
      page: '1',
      limit: '50'
    })
    const response = await api(`/customers?${params.toString()}`)
    customers.value = Array.isArray(response) ? response : (response.data || [])
  } catch (err) {
    console.error('Failed to fetch customers:', err)
    customers.value = []
  }
}

const validateForm = () => {
  errors.value = {}

  if (!form.value.customer) {
    errors.value.customer = 'Müşteri seçimi zorunludur'
  }

  if (!form.value.startTime) {
    errors.value.startTime = 'Başlangıç zamanı zorunludur'
  }

  if (!form.value.meetingStatus) {
    errors.value.meetingStatus = 'Durum seçimi zorunludur'
  }

  if (form.value.startTime && form.value.endTime) {
    const start = new Date(form.value.startTime)
    const end = new Date(form.value.endTime)

    if (end <= start) {
      errors.value.endTime = 'Bitiş zamanı başlangıç zamanından sonra olmalıdır'
    }
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    const data: any = {
      customer: parseInt(form.value.customer),
      user: authStore.user?.id || 1,
      meetingStatus: parseInt(form.value.meetingStatus),
      startTime: new Date(form.value.startTime).toISOString()
    }

    if (form.value.hospitalId) {
      data.hospitalId = parseInt(form.value.hospitalId)
    }

    if (form.value.doctorId) {
      data.doctorId = parseInt(form.value.doctorId)
    }

    if (form.value.endTime) {
      data.endTime = new Date(form.value.endTime).toISOString()
    }

    if (form.value.description) {
      data.description = form.value.description
    }

    await createMeeting(data)
    emit('created')
    closeModal()
    resetForm()
  } catch (err) {
    console.error('Failed to create meeting:', err)
    errors.value.submit = 'Randevu oluşturulurken bir hata oluştu'
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  emit('update:modelValue', false)
}

const resetForm = () => {
  form.value = {
    customer: '',
    hospitalId: '',
    doctorId: '',
    startTime: '',
    endTime: '',
    meetingStatus: '',
    description: ''
  }
  customerSearch.value = ''
  hospitalSearch.value = ''
  doctorSearch.value = ''
  errors.value = {}
}

// Initialize
onMounted(async () => {
  try {
    await Promise.all([
      fetchHospitals({ limit: 1000 }),
      fetchMeetingStatuses()
    ])
  } catch (err) {
    console.error('Failed to initialize modal:', err)
  }
})

// Cleanup
onBeforeUnmount(() => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
})
</script>
