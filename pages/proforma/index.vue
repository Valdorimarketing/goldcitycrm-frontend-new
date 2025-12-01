<template>
  <div>
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Proforma Takibi</h1>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Proforma istenen ve proforma gelen müşteriler
        </p>
      </div>
      <div class="flex gap-2 mt-4 sm:mt-0">
        <button @click="loadAllData" class="btn-secondary flex items-center">
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

    <!-- Two Column Layout -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- Sol Kolon: Proforma İstendi (status=28) -->
      <div class="flex flex-col">
        <div class="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-t-lg px-4 py-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-orange-500 rounded-full"></div>
              <h2 class="font-semibold text-orange-800 dark:text-orange-200">
                Proforma İstendi
              </h2>
            </div>
            <span class="bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200 text-xs font-bold px-2 py-1 rounded-full">
              {{ requestedPagination.total }}
            </span>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 border border-t-0 border-gray-200 dark:border-gray-700 rounded-b-lg flex-1 overflow-hidden flex flex-col">
          <div class="divide-y divide-gray-100 dark:divide-gray-700 flex-1 overflow-y-auto max-h-[500px]">
            <!-- Empty State -->
            <div v-if="proformaRequested.length === 0" class="p-8 text-center">
              <DocumentTextIcon class="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600" />
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Proforma istenen müşteri yok
              </p>
            </div>
            
            <!-- Customer Cards -->
            <div 
              v-for="customer in proformaRequested" 
              :key="customer.id"
              class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group"
              @click="goToCustomer(customer.id)"
            >
              <div class="flex items-start gap-3">
                <!-- Avatar -->
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
                    <span class="text-sm font-semibold text-orange-600 dark:text-orange-400">
                      {{ getInitials(customer.name) }}
                    </span>
                  </div>
                </div>
                
                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {{ customer.name }} {{ customer.surname }}
                    </p>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {{ customer.email || customer.phone || '-' }}
                  </p>
                  <div class="flex items-center gap-4 mt-2 text-xs text-gray-400 dark:text-gray-500">
                    <span class="flex items-center gap-1">
                      <CalendarIcon class="w-3 h-3" />
                      {{ formatDate(customer.createdAt) }}
                    </span>
                    <span v-if="customer.relevantUserData" class="flex items-center gap-1">
                      <UserIcon class="w-3 h-3" />
                      {{ customer.relevantUserData.name }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Pagination for Requested -->
          <div v-if="requestedPagination.totalPages > 1" class="border-t border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between">
            <span class="text-xs text-gray-500">
              {{ requestedPagination.page }} / {{ requestedPagination.totalPages }}
            </span>
            <div class="flex gap-1">
              <button 
                @click="loadRequestedData(requestedPagination.page - 1)"
                :disabled="requestedPagination.page <= 1"
                class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <ChevronLeftIcon class="w-4 h-4" />
              </button>
              <button 
                @click="loadRequestedData(requestedPagination.page + 1)"
                :disabled="requestedPagination.page >= requestedPagination.totalPages"
                class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <ChevronRightIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Sağ Kolon: Proforma Geldi (status=29) -->
      <div class="flex flex-col">
        <div class="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-t-lg px-4 py-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <h2 class="font-semibold text-emerald-800 dark:text-emerald-200">
                Proforma Geldi
              </h2>
            </div>
            <span class="bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold px-2 py-1 rounded-full">
              {{ receivedPagination.total }}
            </span>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 border border-t-0 border-gray-200 dark:border-gray-700 rounded-b-lg flex-1 overflow-hidden flex flex-col">
          <div class="divide-y divide-gray-100 dark:divide-gray-700 flex-1 overflow-y-auto max-h-[500px]">
            <!-- Empty State -->
            <div v-if="proformaReceived.length === 0" class="p-8 text-center">
              <DocumentCheckIcon class="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600" />
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Proforma gelen müşteri yok
              </p>
            </div>
            
            <!-- Customer Cards -->
            <div 
              v-for="customer in proformaReceived" 
              :key="customer.id"
              class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group"
              @click="goToCustomer(customer.id)"
            >
              <div class="flex items-start gap-3">
                <!-- Avatar -->
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                    <span class="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      {{ getInitials(customer.name) }}
                    </span>
                  </div>
                </div>
                
                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {{ customer.name }} {{ customer.surname }}
                    </p>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {{ customer.email || customer.phone || '-' }}
                  </p>
                  <div class="flex items-center gap-4 mt-2 text-xs text-gray-400 dark:text-gray-500">
                    <span class="flex items-center gap-1">
                      <CalendarIcon class="w-3 h-3" />
                      {{ formatDate(customer.createdAt) }}
                    </span>
                    <span v-if="customer.relevantUserData" class="flex items-center gap-1">
                      <UserIcon class="w-3 h-3" />
                      {{ customer.relevantUserData.name }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Pagination for Received -->
          <div v-if="receivedPagination.totalPages > 1" class="border-t border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between">
            <span class="text-xs text-gray-500">
              {{ receivedPagination.page }} / {{ receivedPagination.totalPages }}
            </span>
            <div class="flex gap-1">
              <button 
                @click="loadReceivedData(receivedPagination.page - 1)"
                :disabled="receivedPagination.page <= 1"
                class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <ChevronLeftIcon class="w-4 h-4" />
              </button>
              <button 
                @click="loadReceivedData(receivedPagination.page + 1)"
                :disabled="receivedPagination.page >= receivedPagination.totalPages"
                class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
              >
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
  DocumentTextIcon,
  DocumentCheckIcon,
  CalendarIcon,
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserIcon
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
const STATUS_PROFORMA_REQUESTED = 28   // Proforma İstendi
const STATUS_PROFORMA_RECEIVED = 29    // Proforma Geldi

// State
const loading = ref(true)
const searchTerm = ref('')
const relevantUserFilter = ref('')
const dateFilter = ref('all')
const usersList = ref([])

// Sol kolon - Proforma İstendi
const proformaRequested = ref([])
const requestedPagination = ref({
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0
})

// Sağ kolon - Proforma Geldi
const proformaReceived = ref([])
const receivedPagination = ref({
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0
})

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

// Sol kolon verilerini yükle - Proforma İstendi
const loadRequestedData = async (page = 1) => {
  try {
    const query = buildQuery(STATUS_PROFORMA_REQUESTED, page)
    const response = await api('/customers', { query })

    proformaRequested.value = Array.isArray(response) ? response : response.data || []
    
    if (response.meta) {
      requestedPagination.value = {
        page: response.meta.page || 1,
        limit: response.meta.limit || 20,
        total: response.meta.total || 0,
        totalPages: Math.ceil((response.meta.total || 0) / (response.meta.limit || 20))
      }
    }
  } catch (error) {
    console.error('Proforma İstendi verisi yükleme hatası:', error)
  }
}

// Sağ kolon verilerini yükle - Proforma Geldi
const loadReceivedData = async (page = 1) => {
  try {
    const query = buildQuery(STATUS_PROFORMA_RECEIVED, page)
    const response = await api('/customers', { query })

    proformaReceived.value = Array.isArray(response) ? response : response.data || []
    
    if (response.meta) {
      receivedPagination.value = {
        page: response.meta.page || 1,
        limit: response.meta.limit || 20,
        total: response.meta.total || 0,
        totalPages: Math.ceil((response.meta.total || 0) / (response.meta.limit || 20))
      }
    }
  } catch (error) {
    console.error('Proforma Geldi verisi yükleme hatası:', error)
  }
}

// Tüm verileri yükle
const loadAllData = async () => {
  loading.value = true
  try {
    await Promise.all([
      loadRequestedData(1),
      loadReceivedData(1)
    ])
  } finally {
    loading.value = false
  }
}

// Kullanıcı listesini yükle
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
    month: '2-digit',
    year: 'numeric'
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

useHead({ title: 'Proforma Takibi - Valdori CRM' })
</script>