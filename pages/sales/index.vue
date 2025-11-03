<template>
  <div>
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Satışlar</h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
          Tüm satış işlemlerinizi buradan yönetebilirsiniz.
        </p>
      </div>

      <div class="relative">
        <button @click="loadSalesData"
          class="inline-flex items-center px-3 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition">
          <ArrowPathIcon class="h-5 w-5 mr-2" />
          Yenile
        </button>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ara
          </label>
          <input id="search" v-model="searchTerm" type="text" class="form-input"
            placeholder="Müşteri adı veya açıklama..." />
        </div>
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Durum
          </label>
          <select id="status" v-model="statusFilter" class="form-input">
            <option value="">Tüm Durumlar</option>
            <option value="pending">Bekliyor</option>
            <option value="completed">Tamamlandı</option>
            <option value="cancelled">İptal</option>
          </select>
        </div>
        <div>
          <label for="startDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Başlangıç Tarihi
          </label>
          <input id="startDate" v-model="startDate" type="date" class="form-input" />
        </div>
        <div>
          <label for="endDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bitiş Tarihi
          </label>
          <input id="endDate" v-model="endDate" type="date" class="form-input" />
        </div>
        <div class="flex items-end">
          <button @click="resetFilters" class="btn-secondary w-full">
            Filtreleri Temizle
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <CurrencyDollarIcon class="h-8 w-8 text-green-600" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Toplam Satış
              </dt>
              <dd class="text-lg font-medium text-gray-900 dark:text-white">
                ₺{{ formatCurrency(totalSales) }}
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <ShoppingBagIcon class="h-8 w-8 text-blue-600" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Bu Ay
              </dt>
              <dd class="text-lg font-medium text-gray-900 dark:text-white">
                ₺{{ formatCurrency(monthSales) }}
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <ArrowTrendingUpIcon class="h-8 w-8 text-indigo-600" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Ortalama Satış
              </dt>
              <dd class="text-lg font-medium text-gray-900 dark:text-white">
                ₺{{ formatCurrency(averageSale) }}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>

    <!-- Sales Table -->
    <div v-else class="card">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="table-header">Müşteri</th>
              <th class="table-header">Açıklama</th>
              <th class="table-header">Miktar</th>
              <th class="table-header">Tarih</th>
              <th class="table-header">Durum</th>
              <th class="table-header">İşlemler</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="sale in filteredSales" :key="sale.id">
              <td class="table-cell">
                <div class="flex items-center">
                  <div class="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {{ sale.customer?.name?.charAt(0)?.toUpperCase() || '?' }}
                    </span>
                  </div>
                  <div class="ml-4">
                    <div @click="navigateToCustomer(sale.customerId)"
                      class="text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline">
                      {{ sale.customer?.name || 'Bilinmeyen Müşteri' }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ sale.customer?.company || '-' }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="table-cell">
                <div class="text-sm text-gray-900 dark:text-gray-100">{{ sale.description || '-' }}</div>
              </td>
              <td class="table-cell">
                <div class="text-sm font-medium text-green-600">
                  {{ sale.currency }} {{ formatCurrency(sale.amount) }}
                </div>
              </td>
              <td class="table-cell">
                <div class="text-sm text-gray-900 dark:text-gray-100">
                  {{ formatDate(sale.date) }}
                </div>
              </td>
              <td class="table-cell">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getStatusClass(sale.status)">
                  {{ getStatusText(sale.status) }}
                </span>
              </td>
              <td class="table-cell">
                <button @click="viewSaleDetails(sale)"
                  class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                  title="Görüntüle">
                  <EyeIcon class="h-5 w-5" />
                </button>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="filteredSales.length === 0">
              <td colspan="6" class="text-center py-12">
                <ShoppingBagIcon class="mx-auto h-12 w-12 text-gray-400" />
                <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Satış bulunamadı</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {{ searchTerm ? 'Arama kriterlerinize uygun satış bulunamadı.' : 'Henüz satış kaydı eklenmemiş.' }}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1"
        class="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 sm:px-6">
        <div class="flex flex-1 justify-between sm:hidden">
          <button :disabled="pagination.page === 1" @click="changePage(pagination.page - 1)"
            class="relative inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50">
            Önceki
          </button>
          <button :disabled="pagination.page === pagination.totalPages" @click="changePage(pagination.page + 1)"
            class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50">
            Sonraki
          </button>
        </div>
        <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700 dark:text-gray-300">
              <span class="font-medium">{{ ((pagination.page - 1) * pagination.limit) + 1 }}</span>
              -
              <span class="font-medium">{{ Math.min(pagination.page * pagination.limit, pagination.total) }}</span>
              arası, toplam
              <span class="font-medium">{{ pagination.total }}</span>
              sonuç
            </p>
          </div>
          <div>
            <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm">
              <button :disabled="pagination.page === 1" @click="changePage(pagination.page - 1)"
                class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 dark:text-gray-500 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50">
                <ChevronLeftIcon class="h-5 w-5" />
              </button>

              <button v-for="page in visiblePages" :key="page" @click="changePage(page)" :class="[
                page === pagination.page
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-900 dark:text-gray-300 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700',
                'relative inline-flex items-center px-4 py-2 text-sm font-semibold'
              ]">
                {{ page }}
              </button>

              <button :disabled="pagination.page === pagination.totalPages" @click="changePage(pagination.page + 1)"
                class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 dark:text-gray-500 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50">
                <ChevronRightIcon class="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Sale Detail Modal -->
    <SaleViewModal :show="showDetailModal" :sale="selectedSale" @close="closeDetailModal" />
  </div>
</template>

<script setup>
import {
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/outline'
import { useApi } from '~/composables/useApi'

// definePageMeta({
//   middleware: 'auth'
// })

const api = useApi()
const router = useRouter()
const { userId, isAdmin } = usePermissions()

// Search and filters
const searchTerm = ref('')
const statusFilter = ref('')
const startDate = ref('')
const endDate = ref('')

const loading = ref(true)

// Sales data from API
const salesData = ref([])

// Modal state
const showDetailModal = ref(false)
const selectedSale = ref(null)

// Pagination
const pagination = ref({
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0
})

// Load data on mount
onMounted(async () => {
  await loadSalesData()
})

// Fetch sales data using optimized endpoint
const loadSalesData = async () => {
  loading.value = true
  try {
    const query = {
      page: pagination.value.page,
      limit: pagination.value.limit
    }

    // If not admin, add user filter
    if (!isAdmin.value && userId.value) {
      query.user = userId.value
    }

    // Fetch sales from optimized endpoint
    const response = await api('/sales/user/details', { query })

    if (response?.data) {
      // Map response to expected format

      
      

      salesData.value = response.data.map(sale => ({
        id: sale.id,
        customerId: sale.customer,
        customer: {
          name: [sale.customerDetails?.name, sale.customerDetails?.surname]
            .filter(Boolean)
            .join(' ') || 'Bilinmeyen Müşteri',
          company: sale.customerDetails?.company || sale.customerDetails?.companyName || ''
        },
        amount: calculateSaleAmount(sale.salesProducts),
        currency: sale.salesProducts?.[0]?.productDetails?.currency?.code || 'TRY',
        description: sale.title || '-',
        date: sale.createdAt || new Date().toISOString(),
        status: 'completed', // Default status since these are sales
        user: sale.userDetails,
        responsibleUser: sale.responsibleUserDetails,
        followerUser: sale.followerUserDetails,
        products: sale.salesProducts || []
      }))

      // Update pagination
      if (response.meta) {
        pagination.value = {
          total: response.meta.total || 0,
          page: response.meta.page || 1,
          limit: response.meta.limit || 10,
          totalPages: Math.ceil((response.meta.total || 0) / (response.meta.limit || 10))
        }
      }
    } else {
      salesData.value = []
    }
  } catch (error) {
    console.error('Error loading sales data:', error)
    salesData.value = []
  } finally {
    loading.value = false
  }
}

// Calculate total sale amount from products
const calculateSaleAmount = (products) => {
  if (!products || !Array.isArray(products)) return 0
  return products.reduce((sum, item) => {
    return sum + (item.offer || item.price || 0)
  }, 0)
}

// Computed properties
const filteredSales = computed(() => {
  let filtered = salesData.value

  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(sale =>
      sale.customer?.name?.toLowerCase().includes(search) ||
      sale.description?.toLowerCase().includes(search) ||
      sale.customer?.company?.toLowerCase().includes(search) ||
      sale.productName?.toLowerCase().includes(search)
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(sale => sale.status === statusFilter.value)
  }

  // Date range filter
  if (startDate.value || endDate.value) {
    filtered = filtered.filter(sale => {
      const saleDate = new Date(sale.date)
      const start = startDate.value ? new Date(startDate.value) : null
      const end = endDate.value ? new Date(endDate.value) : null

      // Set time to start of day for start date
      if (start) {
        start.setHours(0, 0, 0, 0)
      }

      // Set time to end of day for end date
      if (end) {
        end.setHours(23, 59, 59, 999)
      }

      // Check if sale date is within range
      if (start && end) {
        return saleDate >= start && saleDate <= end
      } else if (start) {
        return saleDate >= start
      } else if (end) {
        return saleDate <= end
      }

      return true
    })
  }

  return filtered
})

const totalSales = computed(() => {
  return salesData.value.reduce((sum, sale) => sum + sale.amount, 0)
})

const monthSales = computed(() => {
  const now = new Date()
  return salesData.value
    .filter(sale => {
      const saleDate = new Date(sale.date)
      return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear()
    })
    .reduce((sum, sale) => sum + sale.amount, 0)
})

const averageSale = computed(() => {
  return salesData.value.length > 0 ? totalSales.value / salesData.value.length : 0
})

const visiblePages = computed(() => {
  const pages = []
  const total = pagination.value.totalPages
  const current = pagination.value.page

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      pages.push(1, 2, 3, 4, 5, '...', total)
    } else if (current >= total - 3) {
      pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total)
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', total)
    }
  }

  return pages.filter(page => page !== '...')
})

// Methods
const resetFilters = () => {
  searchTerm.value = ''
  statusFilter.value = ''
  startDate.value = ''
  endDate.value = ''
}

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    pagination.value.page = page
    loadSalesData()
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('tr-TR')
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('tr-TR').format(amount)
}

const getStatusClass = (status) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'completed':
      return 'Tamamlandı'
    case 'pending':
      return 'Bekliyor'
    case 'cancelled':
      return 'İptal'
    default:
      return 'Bilinmiyor'
  }
}

const navigateToCustomer = (customerId) => {
  if (customerId) {
    router.push(`/customers/show/${customerId}`)
  }
}

const viewSaleDetails = (sale) => {
  selectedSale.value = sale
  showDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedSale.value = null
}

// Page head
useHead({
  title: 'Satışlar - Valdori CRM'
})
</script>