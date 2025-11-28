<template>
  <div>
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Fiyatlandırmalar</h1>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Fiyatlandırma sürecindeki müşterileri yönetin
        </p>
      </div>
      <div class="flex gap-2 mt-4 sm:mt-0">
        <button @click="loadAllData" class="btn-secondary">
          <ArrowPathIcon class="h-5 w-5 mr-2" />
          Yenile
        </button>
      </div>
    </div>

    <!-- Search & Filters -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ara
          </label>
          <input 
            v-model="searchTerm" 
            type="text" 
            class="form-input" 
            placeholder="İsim, email veya telefon..."
          />
        </div>
        <div v-if="isAdmin">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Atanan Kullanıcı
          </label>
          <select v-model="relevantUserFilter" class="form-input">
            <option value="">Tüm Kullanıcılar</option>
            <option v-for="user in usersList" :key="user.id" :value="user.id">
              {{ user.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tarih Aralığı
          </label>
          <select v-model="dateFilter" class="form-input">
            <option value="all">Tümü</option>
            <option value="today">Bugün</option>
            <option value="week">Bu Hafta</option>
            <option value="month">Bu Ay</option>
          </select>
        </div>
        <div class="flex items-end">
          <button @click="resetFilters" class="btn-secondary w-full">
            Filtreleri Temizle
          </button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>

    <!-- Three Column Layout -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      
      <!-- Kolon 1: Fiyatlandırmaya Gönderilenler (status=7) -->
      <div class="flex flex-col">
        <div class="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-t-lg px-4 py-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-purple-500 rounded-full"></div>
              <h2 class="font-semibold text-purple-800 dark:text-purple-200 text-sm">
                Fiyatlandırmaya Gönderilenler
              </h2>
            </div>
            <span class="bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 text-xs font-bold px-2 py-1 rounded-full">
              {{ sentPagination.total }}
            </span>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 border border-t-0 border-gray-200 dark:border-gray-700 rounded-b-lg flex-1 overflow-hidden flex flex-col">
          <div class="divide-y divide-gray-100 dark:divide-gray-700 flex-1 overflow-y-auto max-h-[500px]">
            <!-- Empty State -->
            <div v-if="sentToPricing.length === 0" class="p-6 text-center">
              <CurrencyDollarIcon class="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600" />
              <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Fiyatlandırmaya gönderilen müşteri yok
              </p>
            </div>
            
            <!-- Customer Cards -->
            <div 
              v-for="customer in sentToPricing" 
              :key="customer.id"
              class="p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group"
              @click="goToCustomer(customer.id)"
            >
              <div class="flex items-start gap-3">
                <div class="flex-shrink-0">
                  <div class="w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                    <span class="text-xs font-semibold text-purple-600 dark:text-purple-400">
                      {{ getInitials(customer.name) }}
                    </span>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-2">
                    <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {{ customer.name }} {{ customer.surname }}
                    </p>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {{ customer.email || customer.phone || '-' }}
                  </p>
                  <div class="flex items-center gap-3 mt-1.5 text-[10px] text-gray-400 dark:text-gray-500">
                    <span class="flex items-center gap-1">
                      <CalendarIcon class="w-3 h-3" />
                      {{ formatDate(customer.createdAt) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Pagination -->
          <div v-if="sentPagination.totalPages > 1" class="border-t border-gray-200 dark:border-gray-700 px-3 py-2 flex items-center justify-between">
            <span class="text-xs text-gray-500">{{ sentPagination.page }}/{{ sentPagination.totalPages }}</span>
            <div class="flex gap-1">
              <button @click="loadSentData(sentPagination.page - 1)" :disabled="sentPagination.page <= 1" class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50">
                <ChevronLeftIcon class="w-4 h-4" />
              </button>
              <button @click="loadSentData(sentPagination.page + 1)" :disabled="sentPagination.page >= sentPagination.totalPages" class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50">
                <ChevronRightIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Kolon 2: Fiyatlar Girilenler (status=8) -->
      <div class="flex flex-col">
        <div class="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-t-lg px-4 py-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <h2 class="font-semibold text-emerald-800 dark:text-emerald-200 text-sm">
                Fiyatlar Girilenler
              </h2>
            </div>
            <span class="bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold px-2 py-1 rounded-full">
              {{ enteredPagination.total }}
            </span>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 border border-t-0 border-gray-200 dark:border-gray-700 rounded-b-lg flex-1 overflow-hidden flex flex-col">
          <div class="divide-y divide-gray-100 dark:divide-gray-700 flex-1 overflow-y-auto max-h-[500px]">
            <!-- Empty State -->
            <div v-if="priceEntered.length === 0" class="p-6 text-center">
              <CheckCircleIcon class="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600" />
              <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Fiyatı girilen müşteri yok
              </p>
            </div>
            
            <!-- Customer Cards -->
            <div 
              v-for="customer in priceEntered" 
              :key="customer.id"
              class="p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group"
              @click="goToCustomer(customer.id)"
            >
              <div class="flex items-start gap-3">
                <div class="flex-shrink-0">
                  <div class="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                    <span class="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {{ getInitials(customer.name) }}
                    </span>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-2">
                    <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {{ customer.name }} {{ customer.surname }}
                    </p>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {{ customer.email || customer.phone || '-' }}
                  </p>
                  <div class="flex items-center gap-3 mt-1.5 text-[10px] text-gray-400 dark:text-gray-500">
                    <span class="flex items-center gap-1">
                      <CalendarIcon class="w-3 h-3" />
                      {{ formatDate(customer.createdAt) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Pagination -->
          <div v-if="enteredPagination.totalPages > 1" class="border-t border-gray-200 dark:border-gray-700 px-3 py-2 flex items-center justify-between">
            <span class="text-xs text-gray-500">{{ enteredPagination.page }}/{{ enteredPagination.totalPages }}</span>
            <div class="flex gap-1">
              <button @click="loadEnteredData(enteredPagination.page - 1)" :disabled="enteredPagination.page <= 1" class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50">
                <ChevronLeftIcon class="w-4 h-4" />
              </button>
              <button @click="loadEnteredData(enteredPagination.page + 1)" :disabled="enteredPagination.page >= enteredPagination.totalPages" class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50">
                <ChevronRightIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Kolon 3: Müşteriye Fiyat Teklifi İletilenler (status=9) -->
      <div class="flex flex-col">
        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-t-lg px-4 py-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
              <h2 class="font-semibold text-blue-800 dark:text-blue-200 text-sm">
                Fiyat Teklifi İletilenler
              </h2>
            </div>
            <span class="bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs font-bold px-2 py-1 rounded-full">
              {{ offeredPagination.total }}
            </span>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 border border-t-0 border-gray-200 dark:border-gray-700 rounded-b-lg flex-1 overflow-hidden flex flex-col">
          <div class="divide-y divide-gray-100 dark:divide-gray-700 flex-1 overflow-y-auto max-h-[500px]">
            <!-- Empty State -->
            <div v-if="priceOffered.length === 0" class="p-6 text-center">
              <DocumentTextIcon class="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600" />
              <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Fiyat teklifi iletilen müşteri yok
              </p>
            </div>
            
            <!-- Customer Cards -->
            <div 
              v-for="customer in priceOffered" 
              :key="customer.id"
              class="p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group"
              @click="goToCustomer(customer.id)"
            >
              <div class="flex items-start gap-3">
                <div class="flex-shrink-0">
                  <div class="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                    <span class="text-xs font-semibold text-blue-600 dark:text-blue-400">
                      {{ getInitials(customer.name) }}
                    </span>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-2">
                    <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {{ customer.name }} {{ customer.surname }}
                    </p>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {{ customer.email || customer.phone || '-' }}
                  </p>
                  <div class="flex items-center gap-3 mt-1.5 text-[10px] text-gray-400 dark:text-gray-500">
                    <span class="flex items-center gap-1">
                      <CalendarIcon class="w-3 h-3" />
                      {{ formatDate(customer.createdAt) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Pagination -->
          <div v-if="offeredPagination.totalPages > 1" class="border-t border-gray-200 dark:border-gray-700 px-3 py-2 flex items-center justify-between">
            <span class="text-xs text-gray-500">{{ offeredPagination.page }}/{{ offeredPagination.totalPages }}</span>
            <div class="flex gap-1">
              <button @click="loadOfferedData(offeredPagination.page - 1)" :disabled="offeredPagination.page <= 1" class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50">
                <ChevronLeftIcon class="w-4 h-4" />
              </button>
              <button @click="loadOfferedData(offeredPagination.page + 1)" :disabled="offeredPagination.page >= offeredPagination.totalPages" class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50">
                <ChevronRightIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  CurrencyDollarIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon
} from '@heroicons/vue/24/outline'
import { watchDebounced } from '@vueuse/core'

definePageMeta({
  layout: 'default'
})

const api = useApi()
const router = useRouter()
const authStore = useAuthStore()
const { isAdmin, getCustomerFilters } = usePermissions()

// =====================================================
// 🔧 KONFİGÜRASYON - Status ID'leri buradan değiştirilebilir
// =====================================================
const STATUS_SENT_TO_PRICING = 7     // Fiyatlandırmaya gönderildi
const STATUS_PRICE_ENTERED = 8       // Fiyat girildi
const STATUS_PRICE_OFFERED = 9       // Fiyat teklifi iletildi

// State
const loading = ref(true)
const searchTerm = ref('')
const relevantUserFilter = ref('')
const dateFilter = ref('all')
const usersList = ref([])

// Kolon 1 - Fiyatlandırmaya gönderilenler
const sentToPricing = ref([])
const sentPagination = ref({ page: 1, limit: 20, total: 0, totalPages: 0 })

// Kolon 2 - Fiyatlar girilenler
const priceEntered = ref([])
const enteredPagination = ref({ page: 1, limit: 20, total: 0, totalPages: 0 })

// Kolon 3 - Fiyat teklifi iletilenler
const priceOffered = ref([])
const offeredPagination = ref({ page: 1, limit: 20, total: 0, totalPages: 0 })

// =====================================================
// API Çağrıları - Mevcut /customers endpoint kullanılıyor
// =====================================================

const buildQuery = (statusId, page = 1) => {
  const baseFilters = getCustomerFilters()
  
  const query = {
    ...baseFilters,
    status: statusId,
    page,
    limit: 20
  }

  if (searchTerm.value) {
    query.search = searchTerm.value
  }

  if (relevantUserFilter.value) {
    query.relevantUser = relevantUserFilter.value
  }

  if (dateFilter.value && dateFilter.value !== 'all') {
    query.dateFilter = dateFilter.value
  }

  return query
}

const loadSentData = async (page = 1) => {
  try {
    const query = buildQuery(STATUS_SENT_TO_PRICING, page)
    const response = await api('/customers', { query })
    sentToPricing.value = Array.isArray(response) ? response : response.data || []
    if (response.meta) {
      sentPagination.value = {
        page: response.meta.page || 1,
        limit: response.meta.limit || 20,
        total: response.meta.total || 0,
        totalPages: Math.ceil((response.meta.total || 0) / (response.meta.limit || 20))
      }
    }
  } catch (error) {
    console.error('Sent data yükleme hatası:', error)
  }
}

const loadEnteredData = async (page = 1) => {
  try {
    const query = buildQuery(STATUS_PRICE_ENTERED, page)
    const response = await api('/customers', { query })
    priceEntered.value = Array.isArray(response) ? response : response.data || []
    if (response.meta) {
      enteredPagination.value = {
        page: response.meta.page || 1,
        limit: response.meta.limit || 20,
        total: response.meta.total || 0,
        totalPages: Math.ceil((response.meta.total || 0) / (response.meta.limit || 20))
      }
    }
  } catch (error) {
    console.error('Entered data yükleme hatası:', error)
  }
}

const loadOfferedData = async (page = 1) => {
  try {
    const query = buildQuery(STATUS_PRICE_OFFERED, page)
    const response = await api('/customers', { query })
    priceOffered.value = Array.isArray(response) ? response : response.data || []
    if (response.meta) {
      offeredPagination.value = {
        page: response.meta.page || 1,
        limit: response.meta.limit || 20,
        total: response.meta.total || 0,
        totalPages: Math.ceil((response.meta.total || 0) / (response.meta.limit || 20))
      }
    }
  } catch (error) {
    console.error('Offered data yükleme hatası:', error)
  }
}

const loadAllData = async () => {
  loading.value = true
  try {
    await Promise.all([
      loadSentData(1),
      loadEnteredData(1),
      loadOfferedData(1)
    ])
  } finally {
    loading.value = false
  }
}

const loadUsers = async () => {
  try {
    const response = await api('/users')
    if (Array.isArray(response)) {
      usersList.value = response.map(u => ({
        id: u.id,
        name: `${u.name || ''} ${u.surname || ''}`.trim()
      }))
    }
  } catch (error) {
    console.error('Kullanıcılar yüklenemedi:', error)
  }
}

// =====================================================
// Yardımcı Fonksiyonlar
// =====================================================

const goToCustomer = (customerId) => {
  router.push(`/customers/show/${customerId}`)
}

const resetFilters = () => {
  searchTerm.value = ''
  relevantUserFilter.value = ''
  dateFilter.value = 'all'
  loadAllData()
}

const getInitials = (name) => {
  if (!name) return '?'
  return name.charAt(0).toUpperCase()
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit'
  })
}

// =====================================================
// Watchers & Lifecycle
// =====================================================

watchDebounced(
  [searchTerm, relevantUserFilter, dateFilter],
  () => loadAllData(),
  { debounce: 500 }
)

onMounted(async () => {
  await loadUsers()
  await loadAllData()
})

useHead({ title: 'Fiyatlandırmalar - Valdori CRM' })
</script>