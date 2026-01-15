<template>
  <div>
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-6">
      <div>
        <div class="flex items-center space-x-3">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Bugünkü Atamalar</h1>
          <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
            {{ formatDate(new Date()) }}
          </div>
        </div>
        <p class="mt-2 text-sm text-gray-700 dark:text-gray-400">
          Bugün yapılan tüm atamalar ve detayları
        </p>
      </div>
      <div class="mt-4 sm:mt-0 flex gap-3">
        <button @click="refreshData" class="btn-secondary">
          Yenile
        </button>
        <NuxtLink to="/dashboard" class="btn-secondary">
          Dashboard'a Dön
        </NuxtLink>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>

    <!-- Summary Cards -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <!-- Total Assignments -->
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-600 dark:text-gray-400">Toplam Atama</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {{ totalAssignments }}
            </p>
          </div>
          <div class="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
            <UsersIcon class="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>
      </div>

      <!-- New Data -->
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-600 dark:text-gray-400">Yeni Data</p>
            <p class="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
              {{ totalNewData }}
            </p>
          </div>
          <div class="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <PlusCircleIcon class="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>

      <!-- Dynamic Search -->
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-600 dark:text-gray-400">Dinamik Arama</p>
            <p class="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">
              {{ totalDynamicSearch }}
            </p>
          </div>
          <div class="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
            <ArrowPathIcon class="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>
      </div>

      <!-- Old Data -->
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-600 dark:text-gray-400">Eski Data</p>
            <p class="text-2xl font-bold text-gray-600 dark:text-gray-400 mt-1">
              {{ totalOldData }}
            </p>
          </div>
          <div class="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <DocumentIcon class="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </div>
        </div>
      </div>

      <!-- Active Sales Reps -->
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-600 dark:text-gray-400">Aktif Satışçı</p>
            <p class="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
              {{ assignments.length }}
            </p>
          </div>
          <div class="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
            <UserGroupIcon class="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>
    </div>

    <!-- Assignments Table -->
    <div class="card">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Satışçı Bazında Detaylar</h3>
        
        <!-- Sort Options -->
        <select v-model="sortBy" @change="sortAssignments" class="form-input text-sm">
          <option value="count-desc">En Çok Atama</option>
          <option value="count-asc">En Az Atama</option>
          <option value="name-asc">İsme Göre (A-Z)</option>
          <option value="name-desc">İsme Göre (Z-A)</option>
          <option value="new-desc">En Çok Yeni Data</option>
          <option value="dynamic-desc">En Çok Dinamik</option>
        </select>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && assignments.length === 0" class="text-center py-12">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
          <ClipboardDocumentListIcon class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Bugün Atama Yok</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">Bugün henüz hiç atama yapılmamış.</p>
      </div>

      <!-- Assignments List -->
      <div v-else class="space-y-4">
        <div
          v-for="(assignment, index) in sortedAssignments"
          :key="assignment.salesRepId"
          class="p-5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-4 flex-1">
              <!-- Rank Badge -->
              <div
                :class="[
                  'flex items-center justify-center w-10 h-10 rounded-full font-bold text-base',
                  index === 0 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  index === 1 ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' :
                  index === 2 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                  'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                ]"
              >
                {{ index + 1 }}
              </div>

              <!-- User Avatar -->
              <div class="h-14 w-14 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <span class="text-base font-semibold text-purple-600 dark:text-purple-400">
                  {{ assignment.salesRepName?.charAt(0) || '?' }}
                </span>
              </div>

              <!-- User Info -->
              <div class="flex-1 min-w-0">
                <p class="text-base font-semibold text-gray-900 dark:text-white">
                  {{ assignment.salesRepName }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  ID: {{ assignment.salesRepId }} • Toplam {{ assignment.totalCount }} atama
                </p>
              </div>
            </div>

            <!-- Total Count Badge -->
            <div class="flex items-center gap-3">
              <span class="inline-flex items-center px-4 py-2 rounded-full text-lg font-bold bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                {{ assignment.totalCount }}
              </span>
              
              <!-- View Customers Button -->
              <button
                @click="viewCustomers(assignment)"
                class="inline-flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-700 p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title="Müşterileri Görüntüle"
              >
                <EyeIcon class="h-5 w-5" />
              </button>
            </div>
          </div>

          <!-- Detailed Stats Grid -->
          <div class="grid grid-cols-3 gap-3">
            <!-- Yeni Data -->
            <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Yeni Data</span>
                <PlusCircleIcon class="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <p class="text-xl font-bold text-green-600 dark:text-green-400">
                {{ assignment.newDataCount }}
              </p>
              <div class="mt-2 w-full bg-green-200 dark:bg-green-900 rounded-full h-1.5">
                <div
                  class="bg-green-600 dark:bg-green-500 h-1.5 rounded-full transition-all duration-300"
                  :style="{ width: `${getPercentageOf(assignment.newDataCount, assignment.totalCount)}%` }"
                ></div>
              </div>
            </div>

            <!-- Dinamik Arama -->
            <div class="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Dinamik Arama</span>
                <ArrowPathIcon class="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <p class="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                {{ assignment.dynamicSearchCount }}
              </p>
              <div class="mt-2 w-full bg-yellow-200 dark:bg-yellow-900 rounded-full h-1.5">
                <div
                  class="bg-yellow-600 dark:bg-yellow-500 h-1.5 rounded-full transition-all duration-300"
                  :style="{ width: `${getPercentageOf(assignment.dynamicSearchCount, assignment.totalCount)}%` }"
                ></div>
              </div>
            </div>

            <!-- Eski Data -->
            <div class="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Eski Data</span>
                <DocumentIcon class="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </div>
              <p class="text-xl font-bold text-gray-600 dark:text-gray-400">
                {{ assignment.oldDataCount }}
              </p>
              <div class="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                <div
                  class="bg-gray-600 dark:bg-gray-500 h-1.5 rounded-full transition-all duration-300"
                  :style="{ width: `${getPercentageOf(assignment.oldDataCount, assignment.totalCount)}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Customer List Modal -->
    <div v-if="showCustomersModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-80 transition-opacity" @click="showCustomersModal = false"></div>

        <div class="inline-block transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:align-middle">
          <div class="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ selectedSalesRep?.salesRepName }} - Bugünkü Atamalar
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Toplam {{ selectedSalesRep?.totalCount }} müşteri
                </p>
              </div>
              <button @click="showCustomersModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <XMarkIcon class="h-6 w-6" />
              </button>
            </div>

            <!-- Stats Summary in Modal -->
            <div class="grid grid-cols-3 gap-3 mb-4">
              <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-2 text-center">
                <p class="text-xs text-gray-600 dark:text-gray-400">Yeni Data</p>
                <p class="text-lg font-bold text-green-600 dark:text-green-400">
                  {{ selectedSalesRep?.newDataCount }}
                </p>
              </div>
              <div class="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-2 text-center">
                <p class="text-xs text-gray-600 dark:text-gray-400">Dinamik</p>
                <p class="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                  {{ selectedSalesRep?.dynamicSearchCount }}
                </p>
              </div>
              <div class="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-2 text-center">
                <p class="text-xs text-gray-600 dark:text-gray-400">Eski Data</p>
                <p class="text-lg font-bold text-gray-600 dark:text-gray-400">
                  {{ selectedSalesRep?.oldDataCount }}
                </p>
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="loadingCustomers" class="flex justify-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>

            <!-- Customers List -->
            <div v-else class="space-y-2 max-h-96 overflow-y-auto">
              <div
                v-for="customer in selectedCustomers"
                :key="customer.id"
                class="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div class="flex items-center space-x-3 flex-1">
                  <div class="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <span class="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {{ customer.name?.charAt(0) || '?' }}
                    </span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {{ customer.name }} {{ customer.surname }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {{ customer.email || customer.phone || '-' }}
                    </p>
                  </div>
                  <!-- Data Type Badge -->
                  <span
                    v-if="customer.url"
                    class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                  >
                    Yeni
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    Eski
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatTime(customer.assignedAt) }}
                  </span>
                  <NuxtLink
                    :to="`/customers/show/${customer.id}`"
                    class="inline-flex items-center justify-center rounded-md bg-indigo-600 p-2 text-white hover:bg-indigo-500 transition-colors"
                  >
                    <EyeIcon class="h-4 w-4" />
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  UsersIcon,
  UserGroupIcon,
  PlusCircleIcon,
  ArrowPathIcon,
  DocumentIcon,
  EyeIcon,
  ClipboardDocumentListIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  middleware: ['auth', 'admindoctor']
})

const loading = ref(true)
const assignments = ref([])
const sortBy = ref('count-desc')
const showCustomersModal = ref(false)
const selectedSalesRep = ref(null)
const selectedCustomers = ref([])
const loadingCustomers = ref(false)

const totalAssignments = computed(() => {
  return assignments.value.reduce((sum, a) => sum + (a.totalCount || a.count || 0), 0)
})

const totalNewData = computed(() => {
  return assignments.value.reduce((sum, a) => sum + (a.newDataCount || 0), 0)
})

const totalDynamicSearch = computed(() => {
  return assignments.value.reduce((sum, a) => sum + (a.dynamicSearchCount || 0), 0)
})

const totalOldData = computed(() => {
  return assignments.value.reduce((sum, a) => sum + (a.oldDataCount || 0), 0)
})

const sortedAssignments = computed(() => {
  const sorted = [...assignments.value]
  
  switch (sortBy.value) {
    case 'count-desc':
      return sorted.sort((a, b) => (b.totalCount || b.count) - (a.totalCount || a.count))
    case 'count-asc':
      return sorted.sort((a, b) => (a.totalCount || a.count) - (b.totalCount || b.count))
    case 'name-asc':
      return sorted.sort((a, b) => a.salesRepName.localeCompare(b.salesRepName))
    case 'name-desc':
      return sorted.sort((a, b) => b.salesRepName.localeCompare(a.salesRepName))
    case 'new-desc':
      return sorted.sort((a, b) => (b.newDataCount || 0) - (a.newDataCount || 0))
    case 'dynamic-desc':
      return sorted.sort((a, b) => (b.dynamicSearchCount || 0) - (a.dynamicSearchCount || 0))
    default:
      return sorted
  }
})

const fetchAssignments = async () => {
  loading.value = true
  try {
    const api = useApi()
    const data = await api('/customers/assignments/today')
    assignments.value = Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error fetching assignments:', error)
    assignments.value = []
  } finally {
    loading.value = false
  }
}

const viewCustomers = async (assignment) => {
  selectedSalesRep.value = assignment
  showCustomersModal.value = true
  loadingCustomers.value = true
  
  try {
    const api = useApi()
    
    // Bugün atanan müşterileri çek
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)
    
    const response = await api('/customers', {
      query: {
        relevantUser: assignment.salesRepId,
        // Bu filtreyi backend'de desteklemeniz gerekebilir
        assignedBetween: JSON.stringify({
          start: startOfDay.toISOString(),
          end: endOfDay.toISOString()
        })
      }
    })
    
    selectedCustomers.value = Array.isArray(response) ? response : (response.data || [])
  } catch (error) {
    console.error('Error fetching customers:', error)
    selectedCustomers.value = []
  } finally {
    loadingCustomers.value = false
  }
}

const refreshData = async () => {
  await fetchAssignments()
}

const sortAssignments = () => {
  // Sorting is handled by computed property
}

const getPercentageOf = (value, total) => {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const formatTime = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(async () => {
  await fetchAssignments()
})

useHead({
  title: 'Bugünkü Atamalar - Valdori CRM'
})
</script>