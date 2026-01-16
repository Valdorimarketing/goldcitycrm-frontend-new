<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-2">
        <NuxtLink
          to="/meetings"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon class="h-5 w-5" />
        </NuxtLink>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Yeni Gorusme Olustur</h1>
      </div>
      <p class="text-sm text-gray-700 dark:text-gray-400 ml-7">
        Musteri ile yeni bir gorusme veya randevu olusturun.
      </p>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Musteri (Zorunlu) -->
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Musteri Bilgileri</h2>
        <div class="grid grid-cols-1 gap-6">
          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Musteri <span class="text-red-500">*</span>
            </label>
            <input
              v-model="customerSearch"
              type="text"
              class="form-input"
              :class="{ 'border-red-500': errors.customer }"
              placeholder="En az 3 harf yazarak musteri arayın..."
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

          <!-- Sales Product Selection (shown after customer is selected) -->
          <div v-if="form.customer">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Hangi Urun Icin Gorusme?
            </label>

            <div v-if="loadingCustomerProducts" class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Urunler yukleniyor...
            </div>

            <div v-else-if="customerSalesProducts.length === 0" class="text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 p-3 rounded-md">
              Bu kullaniciya herhangi bir hizmet satilmamis
            </div>

            <select
              v-else
              v-model="form.salesProductId"
              class="form-input"
            >
              <option value="">Urun secin...</option>
              <option v-for="product in customerSalesProducts" :key="product.id" :value="product.id">
                {{ product.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Lokasyon Bilgileri -->
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Lokasyon Bilgileri</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Hastane
            </label>
            <input
              v-model="hospitalSearch"
              type="text"
              class="form-input"
              placeholder="Hastane adi yazin..."
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
              placeholder="Doktor adi yazin..."
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
            <p v-if="form.hospitalId" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {{ filteredDoctors.length }} doktor mevcut
            </p>
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
              Bitis Zamani
            </label>
            <input
              v-model="form.endTime"
              type="datetime-local"
              class="form-input"
              :class="{ 'border-red-500': errors.endTime }"
            />
            <p v-if="errors.endTime" class="mt-1 text-sm text-red-600">{{ errors.endTime }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Hatirlatma Zamani
            </label>
            <input
              v-model="form.remindingAt"
              type="datetime-local"
              class="form-input"
            />
          </div>

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
              <option value="">Durum secin...</option>
              <option v-for="status in meetingStatuses" :key="status.id" :value="status.id">
                {{ status.name }}
              </option>
            </select>
            <p v-if="errors.meetingStatus" class="mt-1 text-sm text-red-600">{{ errors.meetingStatus }}</p>
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
            <textarea
              v-model="form.description"
              rows="4"
              maxlength="1000"
              class="form-input"
              placeholder="Gorusme ile ilgili notlarinizi buraya yazin..."
            ></textarea>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {{ form.description?.length || 0 }} / 1000 karakter
            </p>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex justify-end gap-3">
        <NuxtLink
          to="/meetings"
          class="inline-flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-700 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          Iptal
        </NuxtLink>
        <button
          type="submit"
          :disabled="loading"
          class="inline-flex items-center justify-center rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading" class="mr-2">
            <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          {{ loading ? 'Kaydediliyor...' : 'Gorusme Olustur' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ChevronLeftIcon } from '@heroicons/vue/24/outline'

definePageMeta({
  middleware: ['auth']
})

const router = useRouter()
const authStore = useAuthStore()

// Composables
const { createMeeting } = useMeetings()
const { hospitals, fetchHospitals } = useHospitals()
const { fetchDoctors } = useDoctors()
const { statuses: meetingStatuses, fetchMeetingStatuses } = useMeetingStatuses()

// Form state
const form = ref({
  customer: '',
  hospitalId: '',
  doctorId: '',
  startTime: '',
  endTime: '',
  remindingAt: '',
  meetingStatus: '',
  salesProductId: '',
  description: ''
})

const errors = ref({})
const loading = ref(false)
const customers = ref([])
const hospitalDoctors = ref([]) // Doctors from selected hospital
const customerSalesProducts = ref([]) // Sales products for selected customer
const loadingCustomerProducts = ref(false)

// Search states
const customerSearch = ref('')
const hospitalSearch = ref('')
const doctorSearch = ref('')
const showCustomerDropdown = ref(false)
const showHospitalDropdown = ref(false)
const showDoctorDropdown = ref(false)

// Computed - Return customers from API
const filteredCustomers = computed(() => {
  return customers.value
})

// Watch customerSearch and fetch from API with debounce
const searchTimeout = ref(null)
watch(customerSearch, (newValue) => {
  // Clear timeout
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
    searchTimeout.value = null
  }

  // Clear customers and reset form if less than 3 characters
  if (!newValue || newValue.length < 3) {
    customers.value = []
    // Reset customer selection if search is cleared
    if (!newValue) {
      form.value.customer = ''
      form.value.salesProductId = ''
      customerSalesProducts.value = []
    }
    return
  }

  // Debounce API call
  searchTimeout.value = setTimeout(() => {
    fetchCustomers(newValue)
    searchTimeout.value = null
  }, 300) // 300ms debounce
})

// Cleanup on unmount
onBeforeUnmount(() => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
})

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

// Select methods
const selectCustomer = async (customer) => {
  form.value.customer = customer.id
  customerSearch.value = `${customer.name} ${customer.surname}`
  showCustomerDropdown.value = false

  // Reset sales product when customer changes
  form.value.salesProductId = ''

  // Fetch sales products for this customer
  await fetchCustomerSalesProducts(customer.id)
}

const selectHospital = async (hospital) => {
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
    const response = await $api(`/hospitals/${hospital.id}/doctors`)
    hospitalDoctors.value = Array.isArray(response) ? response : (response.data || [])
    console.log(`Loaded ${hospitalDoctors.value.length} doctors for hospital ${hospital.name}`)
  } catch (err) {
    console.error('Failed to fetch hospital doctors:', err)
    hospitalDoctors.value = []
  }
}

const selectDoctor = (doctor) => {
  form.value.doctorId = doctor.id
  doctorSearch.value = doctor.name
  showDoctorDropdown.value = false
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

// Fetch customers with search query
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

// Fetch sales products for selected customer
const fetchCustomerSalesProducts = async (customerId) => {
  if (!customerId) {
    customerSalesProducts.value = []
    return
  }

  loadingCustomerProducts.value = true
  try {
    const api = useApi()
    console.log('Fetching sales products for customer:', customerId)
    const response = await api(`/sales/customer/${customerId}/products`)
    console.log('Raw API response:', response)

    // Parse response - map to include product name from productDetails
    const products = Array.isArray(response) ? response : (response.data || [])

    customerSalesProducts.value = products.map(item => ({
      id: item.id, // sales-product relation ID
      name: item.productDetails?.name || 'Bilinmeyen Ürün',
      price: item.totalPrice || item.price,
      productId: item.product,
      salesId: item.sales
    }))

    console.log(`Loaded ${customerSalesProducts.value.length} sales products for customer ${customerId}`, customerSalesProducts.value)
  } catch (err) {
    console.error('Failed to fetch customer sales products:', err)
    console.error('Error details:', err.response || err)
    customerSalesProducts.value = []
  } finally {
    loadingCustomerProducts.value = false
  }
}

// Validate form
const validateForm = () => {
  errors.value = {}

  if (!form.value.customer) {
    errors.value.customer = 'Musteri secimi zorunludur'
  }

  if (!form.value.meetingStatus) {
    errors.value.meetingStatus = 'Durum secimi zorunludur'
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
    // Prepare data for API
    const data = {
      customer: parseInt(form.value.customer),
      user: authStore.user?.id || 1, // Current logged in user
      meetingStatus: parseInt(form.value.meetingStatus),
      ...(form.value.hospitalId && { hospitalId: parseInt(form.value.hospitalId) }),
      ...(form.value.doctorId && { doctorId: parseInt(form.value.doctorId) }),
      ...(form.value.startTime && { startTime: new Date(form.value.startTime).toISOString() }),
      ...(form.value.endTime && { endTime: new Date(form.value.endTime).toISOString() }),
      ...(form.value.remindingAt && { remindingAt: new Date(form.value.remindingAt).toISOString() }),
      ...(form.value.salesProductId && { salesProductId: parseInt(form.value.salesProductId) }),
      ...(form.value.description && { description: form.value.description })
    }

    console.log('Creating meeting with data:', data)
    await createMeeting(data)

    // Redirect to meetings list
    router.push('/meetings')
  } catch (err) {
    console.error('Failed to create meeting:', err)
    errors.value.submit = 'Gorusme olusturulurken bir hata olustu'
  } finally {
    loading.value = false
  }
}

// Initialize
onMounted(async () => {
  try {
    await Promise.all([
      fetchHospitals({ limit: 1000 }),
      fetchDoctors({ limit: 1000 }),
      fetchMeetingStatuses()
    ])

    console.log('Meeting statuses loaded:', meetingStatuses.value.length)
  } catch (err) {
    console.error('Failed to initialize form:', err)
  }
})

// Page head
useHead({
  title: 'Yeni Gorusme - Valdori CRM'
})
</script>
