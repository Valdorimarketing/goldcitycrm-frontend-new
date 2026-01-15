<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-2">
        <NuxtLink to="/meetings" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <ChevronLeftIcon class="h-5 w-5" />
        </NuxtLink>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Gorusmeyi Duzenle</h1>
      </div>
      <p class="text-sm text-gray-700 dark:text-gray-400 ml-7">
        Gorusme bilgilerini guncelleyin.
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="initialLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>

    <!-- Form -->
    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Musteri (Zorunlu) -->
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Genel Bilgiler</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Musteri <span class="text-red-500">*</span>
            </label>
            <input v-model="customerSearch" type="text" placeholder="Musteri ara..." required class="form-input"
              :class="{ 'border-red-500': errors.customer }" @focus="showCustomerDropdown = true"
              @blur="hideCustomerDropdown" />
            <div v-if="showCustomerDropdown && filteredCustomers.length > 0"
              class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
              <button v-for="customer in filteredCustomers" :key="customer.id" type="button"
                class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                @mousedown.prevent="selectCustomer(customer)">
                {{ customer.name }} {{ customer.surname }}
              </button>
            </div>
            <p v-if="errors.customer" class="mt-1 text-sm text-red-600">{{ errors.customer }}</p>
          </div>
          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Hastane
            </label>
            <input v-model="hospitalSearch" type="text" placeholder="Hastane ara..." class="form-input"
              @focus="showHospitalDropdown = true" @blur="hideHospitalDropdown" />
            <div v-if="showHospitalDropdown && filteredHospitals.length > 0"
              class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
              <button v-for="hospital in filteredHospitals" :key="hospital.id" type="button"
                class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                @mousedown.prevent="selectHospital(hospital)">
                {{ hospital.name }}
              </button>
            </div>
          </div>

          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Doktor
            </label>
            <input v-model="doctorSearch" type="text" placeholder="Doktor ara..." class="form-input"
              :disabled="!form.hospitalId" @focus="showDoctorDropdown = true" @blur="hideDoctorDropdown" />
            <div v-if="showDoctorDropdown && filteredDoctorsForSearch.length > 0"
              class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
              <button v-for="doctor in filteredDoctorsForSearch" :key="doctor.id" type="button"
                class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                @mousedown.prevent="selectDoctor(doctor)">
                {{ doctor.name }}
              </button>
            </div>
            <p v-if="form.hospitalId" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {{ filteredDoctors.length }} doktor listeleniyor
            </p>
          </div>

          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Branş
            </label>
            <input v-model="branchSearch" type="text" class="form-input" placeholder="Branş adı yazın..."
              @focus="showBranchDropdownList" @blur="hideBranchDropdown" />

            <div v-if="showBranchDropdown && filteredBranchForSearch.length > 0"
              class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
              <button v-for="branch in filteredBranchForSearch" :key="branch.id" type="button"
                @mousedown.prevent="selectBranch(branch)"
                class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-900 dark:text-gray-100">
                {{ branch.name }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tarih ve Saat Bilgileri -->
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tarih ve Saat</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Baslangic Zamani
            </label>
            <input v-model="form.startTime" type="datetime-local" class="form-input"
              :class="{ 'border-red-500': errors.startTime }" />
            <p v-if="errors.startTime" class="mt-1 text-sm text-red-600">{{ errors.startTime }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bitis Zamani
            </label>
            <input v-model="form.endTime" type="datetime-local" class="form-input"
              :class="{ 'border-red-500': errors.endTime }" />
            <p v-if="errors.endTime" class="mt-1 text-sm text-red-600">{{ errors.endTime }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Hatirlatma Zamani
            </label>
            <input v-model="form.remindingAt" type="datetime-local" class="form-input" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Durum <span class="text-red-500">*</span>
            </label>
            <select v-model="form.meetingStatusId" required class="form-input"
              :class="{ 'border-red-500': errors.meetingStatusId }">
              <option value="">Durum secin...</option>
              <option v-for="status in meetingStatuses" :key="status.id" :value="status.id">
                {{ status.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Satis Urunu (Opsiyonel) -->
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Satis Bilgileri (Opsiyonel)</h2>
        <div class="grid grid-cols-1 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Satis Urunu
            </label>
            <select v-model="form.salesProductId" class="form-input">
              <option value="">Satis urunu secin...</option>
              <option v-for="product in salesProducts" :key="product.id" :value="product.id">
                {{ product.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Aciklama -->
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Aciklama</h2>
        <div class="grid grid-cols-1 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Gorusme Notlari
            </label>
            <textarea v-model="form.description" rows="4" maxlength="1000" class="form-input"
              placeholder="Gorusme ile ilgili notlarinizi buraya yazin..."></textarea>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {{ form.description?.length || 0 }} / 1000 karakter
            </p>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex justify-end gap-3">
        <NuxtLink to="/meetings"
          class="inline-flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-700 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600">
          Iptal
        </NuxtLink>
        <button type="submit" :disabled="loading"
          class="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
          <span v-if="loading" class="mr-2">
            <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
          </span>
          {{ loading ? 'Guncelleniyor...' : 'Gorusmeyi Guncelle' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeftIcon } from '@heroicons/vue/24/outline'

definePageMeta({
  middleware: ['auth']
})

const route = useRoute() as any
const router = useRouter()
const authStore = useAuthStore()

// Composables
const { fetchMeeting, updateMeeting } = useMeetings()
const { hospitals, fetchHospitals } = useHospitals()
const { doctors, fetchDoctors } = useDoctors()
const { statuses: meetingStatuses, fetchMeetingStatuses } = useMeetingStatuses()
const { products: salesProducts, fetchProducts } = useProducts()
const { branches, fetchBranches } = useBranches()
const { currentLanguageInfo } = useLanguage()
const { customers, fetchCustomers } = useCustomers()

// State
const initialLoading = ref(true)
const errors = ref<Record<string, string>>({})
const loading = ref(false)
const hospitalDoctors = ref<any[]>([])
const searchTimeout = ref<number | null>(null)

// Search states
const customerSearch = ref('')
const hospitalSearch = ref('')
const doctorSearch = ref('')
const branchSearch = ref('')
const showCustomerDropdown = ref(false)
const showHospitalDropdown = ref(false)
const showDoctorDropdown = ref(false)
const showBranchDropdown = ref(false)

// State'e cache flag ekle
const branchesLoaded = ref(false)

// Form state
const form = ref({
  customer: '',
  hospitalId: '',
  doctorId: '',
  branchId: '',
  startTime: '',
  endTime: '',
  remindingAt: '',
  meetingStatusId: '',
  salesProductId: '',
  description: ''
})

// Computed - Filter customers by search
const filteredCustomers = computed(() => customers.value) as any

// Computed - Filter hospitals by search
const filteredHospitals = computed(() => {
  if (!hospitalSearch.value) {
    return hospitals.value
  }
  const search = hospitalSearch.value.toLowerCase()
  return hospitals.value.filter(hospital =>
    hospital.name.toLowerCase().includes(search)
  )
})

// Computed - Doctors from selected hospital (fetched from API)
const filteredDoctors = computed(() => {
  return hospitalDoctors.value
})

// Computed - Filter doctors by search term
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

// 🔥 Sadece name'i olanları filtrele
const filteredBranch = computed(() => 
  branches.value.filter(branch => 
    branch?.name && branch.name.trim() !== ''
  )
)

// 🔥 name bazlı arama
const filteredBranchForSearch = computed(() => {
  const baseBranch = filteredBranch.value

  if (!branchSearch.value) {
    return baseBranch
  }

  const search = branchSearch.value.toLowerCase()
  return baseBranch.filter(branch =>
    branch?.name?.toLowerCase().includes(search)
  )
})

// Select methods
const selectCustomer = (customer: any) => {
  form.value.customer = customer.id
  customerSearch.value = `${customer.name} ${customer.surname}`
  showCustomerDropdown.value = false
}

const selectHospital = async (hospital: any) => {
  form.value.hospitalId = hospital.id
  hospitalSearch.value = hospital.name
  showHospitalDropdown.value = false
  // Reset doctor when hospital changes
  form.value.doctorId = ''
  doctorSearch.value = ''
  hospitalDoctors.value = []

  // Fetch doctors for the selected hospital
  try {
    const $api = useApi()
    const response = await $api(`/hospitals/${hospital.id}/doctors`) as any
    hospitalDoctors.value = Array.isArray(response) ? response : (response.data || [])
  } catch (err) {
    console.error('Failed to fetch hospital doctors:', err)
    hospitalDoctors.value = []
  }
}

const selectDoctor = async (doctor: any) => {
  form.value.doctorId = doctor.id
  doctorSearch.value = doctor.name
  showDoctorDropdown.value = false
}

const hideBranchDropdown = () => {
  setTimeout(() => {
    showBranchDropdown.value = false
  }, 200)
}

// 🔥 Sadece name kullan
const selectBranch = (item: any) => {
  form.value.branchId = item.id
  branchSearch.value = item.name || ''
  showBranchDropdown.value = false
}

const showBranchDropdownList = async () => {
  showBranchDropdown.value = true
  
  if (!branchesLoaded.value) {
    await fetchBranches({ 
      limit: 1000,
      languageId: Number(currentLanguageInfo.value?.id)
    })
    branchesLoaded.value = true
  }
}

// Hide dropdown methods
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

// Helper to format date for datetime-local input
const formatDateTimeLocal = (dateString: Date) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}




const loadMeetingData = async () => {
  try {
    const meetingId = parseInt(route.params.id)
    const meeting = await fetchMeeting(meetingId) as any

    form.value = {
      customer: meeting.customer,
      hospitalId: meeting.hospitalId || '',
      doctorId: meeting.doctorId || '',
      branchId: meeting.branchId || '',
      startTime: formatDateTimeLocal(meeting.startTime),
      endTime: formatDateTimeLocal(meeting.endTime),
      remindingAt: formatDateTimeLocal(meeting.remindingAt),
      meetingStatusId: meeting.meetingStatusId || meeting.status?.id || '',
      salesProductId: meeting.salesProductId || '',
      description: meeting.description || ''
    }

    customerSearch.value = `${meeting.customerData?.name} ${meeting.customerData?.surname}`
    
    // 🔥 branches array'inden direkt bul (zaten doğru dilde yüklü)
    if (meeting.branchId) {
      const selectedBranch = branches.value.find(b => b.id === meeting.branchId)
      branchSearch.value = selectedBranch?.name || meeting.branch?.code || ''
    }

    if (meeting.hospital) {
      hospitalSearch.value = meeting.hospital.name
      try {
        const $api = useApi()
        const response = await $api(`/hospitals/${meeting.hospitalId}/doctors`) as any
        hospitalDoctors.value = Array.isArray(response) ? response : (response.data || [])
      } catch (err) {
        console.error('Failed to fetch hospital doctors:', err)
      }
    }

    if (meeting.doctor) {
      doctorSearch.value = meeting.doctor.name
    }
  } catch (err) {
    console.error('Failed to load meeting:', err)
    router.push('/meetings')
  }
}









// Validate form
const validateForm = () => {
  errors.value = {}

  if (!form.value.customer) {
    errors.value.customer = 'Musteri secimi zorunludur'
  }

  if (!form.value.meetingStatusId) {
    errors.value.meetingStatusId = 'Durum secimi zorunludur'
  }

  if (form.value.startTime && form.value.endTime) {
    const start = new Date(form.value.startTime)
    const end = new Date(form.value.endTime)

    if (end <= start) {
      errors.value.endTime = 'Bitis zamani baslangic zamanindan sonra olmalidir'
    }
  }

  return Object.keys(errors.value).length === 0
}

// Handle form submission
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    const meetingId = parseInt(route.params.id)

    const data = {
      customer: parseInt(form.value.customer),
      user: authStore.user?.id || 1,
      meetingStatusId: parseInt(form.value.meetingStatusId),
      ...(form.value.hospitalId && { hospitalId: parseInt(form.value.hospitalId) }),
      ...(form.value.doctorId && { doctorId: parseInt(form.value.doctorId) }),
      ...(form.value.branchId && { branchId: parseInt(form.value.branchId) }),
      ...(form.value.startTime && { startTime: new Date(form.value.startTime).toISOString() }),
      ...(form.value.endTime && { endTime: new Date(form.value.endTime).toISOString() }),
      ...(form.value.remindingAt && { remindingAt: new Date(form.value.remindingAt).toISOString() }),
      ...(form.value.salesProductId && { salesProductId: parseInt(form.value.salesProductId) }),
      description: form.value.description || ''
    }

    await updateMeeting(meetingId, data)
    // router.push('/meetings')
  } catch (err) {
    console.error('Failed to update meeting:', err)
    errors.value.submit = 'Gorusme guncellenirken bir hata olustu'
  } finally {
    loading.value = false
  }
}

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
    fetchCustomers({ search: newValue })
    searchTimeout.value = null
  }, 300)
})

watch(branchSearch, (newValue) => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
    searchTimeout.value = null
  }

  if (!newValue) {
    form.value.branchId = ''
    return
  }

  if (newValue.length < 3) {
    return
  }

  searchTimeout.value = window.setTimeout(async () => {
    await fetchBranches({ 
      search: newValue, 
      limit: 100,
      languageId: Number(currentLanguageInfo.value?.id)
    })
    searchTimeout.value = null
  }, 300)
})

watch(currentLanguageInfo, async (newLanguageId) => {
  if (newLanguageId && branchesLoaded.value) {
    branches.value = []
    branchesLoaded.value = false
    
    if (showBranchDropdown.value) {
      await fetchBranches({ 
        limit: 1000,
        languageId: Number(newLanguageId.id)
      })
      branchesLoaded.value = true
    }
  }
})

// Initialize
// onMounted içine ekle
onMounted(async () => {
  try {
    await Promise.all([
      fetchHospitals({ limit: 1000 }),
      fetchDoctors({ limit: 1000 }),
      fetchMeetingStatuses(),
      fetchProducts({ limit: 1000 }),
      fetchBranches({ limit: 1000, languageId: Number(currentLanguageInfo.value?.id) }) // 🔥 İLK YÜKLE
    ])

    await loadMeetingData() // 🔥 SONRA MEETING YÜK
    branchesLoaded.value = true
  } catch (err) {
    console.error('Failed to initialize form:', err)
  } finally {
    initialLoading.value = false
  }
})

// Cleanup
onBeforeUnmount(() => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
})

useHead({
  title: 'Gorusmeyi Duzenle - Valdori CRM'
})
</script>