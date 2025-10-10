<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-6xl mx-auto py-6 px-4">
      
      <!-- Header -->
      <div class="mb-6">
        <div class="flex items-center space-x-4">
          <NuxtLink
            to="/customers"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </NuxtLink>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Yeni Müşteri Ekle</h1>
            <p class="text-gray-600 mt-2">Müşteri bilgilerini doldurun</p>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600">Veri yükleniyor...</span>
      </div>

      <!-- Form -->
      <div v-else class="bg-white shadow rounded-lg p-6">
        <form @submit.prevent="handleSubmit" class="space-y-8">
          
          <!-- Temel Bilgiler -->
          <div class="border-b border-gray-200 pb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Temel Bilgiler</h3>
            
            <!-- Ad Soyad -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Ad *
                </label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="{ 'border-red-300': errors.name }"
                  placeholder="Müşteri adı"
                />
                <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Soyad *
                </label>
                <input
                  v-model="form.surname"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="{ 'border-red-300': errors.surname }"
                  placeholder="Müşteri soyadı"
                />
                <p v-if="errors.surname" class="mt-1 text-sm text-red-600">{{ errors.surname }}</p>
              </div>
            </div>

            <!-- Ünvan ve Cinsiyet -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Ünvan
                </label>
                <input
                  v-model="form.title"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ünvan"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Cinsiyet
                </label>
                <select
                  v-model="form.gender"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seçiniz</option>
                  <option value="male">Erkek</option>
                  <option value="female">Kadın</option>
                  <option value="other">Diğer</option>
                </select>
              </div>
            </div>

            <!-- Doğum Tarihi ve Kimlik No -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Doğum Tarihi
                </label>
                <input
                  v-model="form.birth_date"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Kimlik Numarası
                </label>
                <input
                  v-model="form.identity_number"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="11 haneli kimlik numarası"
                />
              </div>
            </div>
          </div>

          <!-- İletişim Bilgileri -->
          <div class="border-b border-gray-200 pb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">İletişim Bilgileri</h3>
            
            <!-- Email Telefon -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  E-posta *
                </label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="{ 'border-red-300': errors.email }"
                  placeholder="ornek@email.com"
                />
                <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Telefon
                </label>
                <input
                  v-model="form.phone"
                  type="tel"
                  @input="formatPhoneNumber"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="{ 'border-red-300': errors.phone }"
                  placeholder="(5xx) xxx xx xx"
                  maxlength="16"
                />
                <p v-if="errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone }}</p>
              </div>
            </div>

            <!-- Website ve Dil -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  v-model="form.website"
                  type="url"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="{ 'border-red-300': errors.website }"
                  placeholder="https://www.example.com"
                />
                <p v-if="errors.website" class="mt-1 text-sm text-red-600">{{ errors.website }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Dil
                </label>
                <input
                  v-model="form.language"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Türkçe, İngilizce, vb."
                />
              </div>
            </div>
          </div>

          <!-- İş Bilgileri -->
          <div class="border-b border-gray-200 pb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">İş ve Kaynak Bilgileri</h3>
            
            <!-- Meslek ve Kaynak -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Meslek
                </label>
                <input
                  v-model="form.job"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Meslek"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Kaynak
                </label>
                <select
                  v-model="form.sourceId"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Kaynak seçiniz</option>
                  <option v-for="source in sources" :key="source.id" :value="source.id">
                    {{ source.name }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Referans Müşteri ve Sorumlu Kullanıcı -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Referans Müşteri
                </label>
                <select
                  v-model="form.referance_customer"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Referans müşteri seçiniz</option>
                  <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                    {{ customer.name }} {{ customer.surname }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Sorumlu Kullanıcı
                </label>
                <select
                  v-model="form.relevant_user"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Kullanıcı seçiniz</option>
                  <option v-for="user in users" :key="user.id" :value="user.id">
                    {{ user.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Konum Bilgileri -->
          <div class="border-b border-gray-200 pb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Konum Bilgileri</h3>
            
            <!-- Ülke ve İl -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Ülke
                </label>
                <select
                  v-model="form.country"
                  @change="onCountryChange"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Ülke seçiniz</option>
                  <option v-for="country in countries" :key="country.id" :value="country.id">
                    {{ country.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  İl
                </label>
                <select
                  v-model="form.state"
                  @change="onStateChange"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :disabled="!form.country"
                >
                  <option value="">İl seçiniz</option>
                  <option v-for="state in filteredStates" :key="state.id" :value="state.id">
                    {{ state.name }}
                  </option>
                </select>
              </div>
            </div>

            <!-- İlçe ve Mahalle -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  İlçe
                </label>
                <select
                  v-model="form.city"
                  @change="onCityChange"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :disabled="!form.state"
                >
                  <option value="">İlçe seçiniz</option>
                  <option v-for="city in filteredCities" :key="city.id" :value="city.id">
                    {{ city.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Mahalle
                </label>
                <input
                  v-model="form.district"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mahalle adı giriniz"
                />
              </div>
            </div>

            <!-- Posta Kodu ve Adres -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Posta Kodu
                </label>
                <input
                  v-model="form.postalCode"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="12345"
                />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Açık Adres
                </label>
                <textarea
                  v-model="form.address"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Detaylı adres bilgisi..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Durum ve Açıklama -->
          <div class="pb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Durum ve Açıklamalar</h3>
            
            <!-- Durum ve Aktiflik -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Durum
                </label>
                <select
                  v-model="form.status"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Durum seçiniz</option>
                  <option v-for="status in statuses" :key="status.id" :value="status.id">
                    {{ status.name }}
                  </option>
                </select>
              </div>
              <div class="flex items-center">
                <label class="flex items-center">
                  <input
                    v-model="form.isActive"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span class="ml-2 text-sm text-gray-700">Aktif müşteri</span>
                </label>
              </div>
            </div>

            <!-- Açıklama -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Açıklama
              </label>
              <textarea
                v-model="form.description"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Müşteri hakkında notlar..."
              ></textarea>
            </div>
          </div>

          <!-- Error Messages -->
          <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {{ error }}
          </div>

          <!-- Success Message -->
          <div v-if="success" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {{ success }}
          </div>

          <!-- Buttons -->
          <div class="flex justify-end space-x-4">
            <NuxtLink
              to="/customers"
              class="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              İptal
            </NuxtLink>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ isSubmitting ? 'Kaydediliyor...' : 'Kaydet' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
// State
const loading = ref(true)
const isSubmitting = ref(false)
const error = ref('')
const success = ref('')
const errors = ref({})

// Data sources
const countries = ref([])
const states = ref([])
const cities = ref([])
const sources = ref([])
const statuses = ref([])
const users = ref([])
const customers = ref([])

// Form data
const form = reactive({
  name: '',
  surname: '',
  title: '',
  email: '',
  gender: '',
  birth_date: '',
  phone: '',
  sourceId: '',
  job: '',
  identity_number: '',
  referance_customer: '',
  language: '',
  isActive: true,
  status: '',
  website: '',
  country: '',
  state: '',
  city: '',
  district: '',
  postalCode: '',
  address: '',
  relevant_user: '',
  description: ''
})

// Filtered location arrays
const filteredStates = computed(() => {
  return form.country ? states.value.filter(s => s.country === parseInt(form.country)) : []
})

const filteredCities = computed(() => {
  return form.state ? cities.value.filter(c => c.state === parseInt(form.state)) : []
})

// Location change handlers
const onCountryChange = () => {
  form.state = ''
  form.city = ''
  form.district = ''
}

const onStateChange = () => {
  form.city = ''
  form.district = ''
}

const onCityChange = () => {
  form.district = ''
}

// Load dropdown data
const loadDropdownData = async () => {
  try {
    loading.value = true
    const api = useApi()

    // Paralel API çağrıları
    const [
      countriesRes,
      statesRes,
      citiesRes,
      sourcesRes,
      statusesRes,
      usersRes,
      customersRes
    ] = await Promise.all([
      api('/countries').catch(() => []),
      api('/states').catch(() => []),
      api('/cities').catch(() => []),
      api('/sources').catch(() => []),
      api('/statuses').catch(() => []),
      api('/users').catch(() => []),
      api('/customers').catch(() => [])
    ])

    countries.value = countriesRes
    states.value = statesRes
    cities.value = citiesRes
    sources.value = sourcesRes
    statuses.value = statusesRes
    users.value = usersRes.data || usersRes
    customers.value = customersRes.data || customersRes
    
  } catch (err) {
    console.error('Dropdown verileri yükleme hatası:', err)
    error.value = 'Sayfa verileri yüklenemedi.'
  } finally {
    loading.value = false
  }
}

// Format phone number to (5xx) xxx xx xx
const formatPhoneNumber = (event) => {
  let value = event.target.value.replace(/\D/g, '')

  if (value.length > 0) {
    if (value.length <= 3) {
      value = `(${value}`
    } else if (value.length <= 6) {
      value = `(${value.slice(0, 3)}) ${value.slice(3)}`
    } else if (value.length <= 8) {
      value = `(${value.slice(0, 3)}) ${value.slice(3, 6)} ${value.slice(6)}`
    } else {
      value = `(${value.slice(0, 3)}) ${value.slice(3, 6)} ${value.slice(6, 8)} ${value.slice(8, 10)}`
    }
  }

  form.phone = value
}

// Validate form
const validateForm = () => {
  errors.value = {}

  if (!form.name.trim()) {
    errors.value.name = 'Ad alanı zorunludur.'
  }

  if (!form.surname.trim()) {
    errors.value.surname = 'Soyad alanı zorunludur.'
  }

  if (!form.email.trim()) {
    errors.value.email = 'E-posta alanı zorunludur.'
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.value.email = 'Geçerli bir e-posta adresi giriniz.'
  }

  if (form.phone?.trim()) {
    const phoneDigits = form.phone.replace(/\D/g, '')
    if (phoneDigits.length !== 10 || !phoneDigits.startsWith('5')) {
      errors.value.phone = 'Telefon numarası (5xx) xxx xx xx formatında olmalıdır'
    }
  }

  if (form.website?.trim()) {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
    if (!urlPattern.test(form.website.trim())) {
      errors.value.website = 'Geçerli bir web adresi giriniz (örn: https://www.example.com)'
    }
  }

  return Object.keys(errors.value).length === 0
}

// Submit form
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }
  
  try {
    isSubmitting.value = true
    error.value = ''
    success.value = ''
    
    const customerData = {
      name: form.name.trim(),
      surname: form.surname.trim(),
      title: form.title?.trim() || null,
      email: form.email.trim(),
      gender: form.gender || null,
      birth_date: form.birth_date || null,
      phone: form.phone?.trim() || null,
      sourceId: form.sourceId || null,
      job: form.job?.trim() || null,
      identity_number: form.identity_number?.trim() || null,
      referance_customer: form.referance_customer || null,
      language: form.language?.trim() || null,
      isActive: form.isActive,
      status: form.status || null,
      website: form.website?.trim() || null,
      country: form.country || null,
      state: form.state || null,
      city: form.city || null,
      district: form.district || null,
      postalCode: form.postalCode?.trim() || null,
      address: form.address?.trim() || null,
      relevant_user: form.relevant_user || null,
      description: form.description?.trim() || null
    }
    
    const api = useApi()
    const response = await api('/customers', {
      method: 'POST',
      body: customerData
    })
    
    success.value = 'Müşteri başarıyla oluşturuldu!'
    
    // 2 saniye sonra müşteri detay sayfasına yönlendir
    setTimeout(() => {
      navigateTo(`/customers/show/${response.id}`)
    }, 2000)
    
  } catch (err) {
    console.error('Müşteri oluşturma hatası:', err)
    
    if (err.status === 409) {
      error.value = 'Bu e-posta adresi zaten kullanılıyor.'
    } else if (err.status === 422) {
      error.value = 'Form verileri geçersiz. Lütfen kontrol ediniz.'
    } else {
      error.value = 'Müşteri oluşturulurken bir hata oluştu.'
    }
  } finally {
    isSubmitting.value = false
  }
}

// Load data on mount
onMounted(() => {
  loadDropdownData()
})

// Page head
useHead({
  title: 'Yeni Müşteri Ekle - Valdori CRM'
})
</script> 