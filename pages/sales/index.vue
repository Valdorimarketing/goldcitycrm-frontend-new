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
    </div>

    <!-- Search and Filters -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div>
          <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ara
          </label>
          <input
            id="search"
            v-model="searchTerm"
            type="text"
            class="form-input"
            placeholder="Müşteri adı veya açıklama..."
          />
        </div>
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Durum
          </label>
          <select
            id="status"
            v-model="statusFilter"
            class="form-input"
          >
            <option value="">Tüm Durumlar</option>
            <option value="pending">Bekliyor</option>
            <option value="completed">Tamamlandı</option>
            <option value="cancelled">İptal</option>
          </select>
        </div>
        <div>
          <label for="dateRange" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tarih Aralığı
          </label>
          <select
            id="dateRange"
            v-model="dateFilter"
            class="form-input"
          >
            <option value="">Tüm Tarihler</option>
            <option value="today">Bugün</option>
            <option value="week">Bu Hafta</option>
            <option value="month">Bu Ay</option>
            <option value="year">Bu Yıl</option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="resetFilters"
            class="btn-secondary"
          >
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
                    <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
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
                  ₺{{ formatCurrency(sale.amount) }}
                </div>
              </td>
              <td class="table-cell">
                <div class="text-sm text-gray-900 dark:text-gray-100">
                  {{ formatDate(sale.date) }}
                </div>
              </td>
              <td class="table-cell">
                <span
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getStatusClass(sale.status)"
                >
                  {{ getStatusText(sale.status) }}
                </span>
              </td>
              <td class="table-cell">
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  -
                </div>
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
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        
        <div class="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <ExclamationTriangleIcon class="h-6 w-6 text-red-600" />
              </div>
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 class="text-lg font-semibold leading-6 text-gray-900">
                  Satışı Sil
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Bu satış kaydını silmek istediğinizden emin misiniz? 
                    Bu işlem geri alınamaz.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              @click="handleDelete"
              class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
            >
              Sil
            </button>
            <button
              @click="showDeleteModal = false"
              class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            >
              İptal
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  PlusIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'
import { useApi } from '~/composables/useApi'

// definePageMeta({
//   middleware: 'auth'
// })

const api = useApi()

// Search and filters
const searchTerm = ref('')
const statusFilter = ref('')
const dateFilter = ref('')

// Delete modal
const showDeleteModal = ref(false)
const saleToDelete = ref(null)
const loading = ref(true)

// Sales data from API
const salesData = ref([])
const statuses = ref([])
const customers = ref([])

// Load data on mount
onMounted(async () => {
  await loadSalesData()
})

// Fetch all required data
const loadSalesData = async () => {
  loading.value = true
  try {
    // Fetch all statuses to find sales statuses
    const statusResponse = await api('/statuses')
    statuses.value = Array.isArray(statusResponse) ? statusResponse : statusResponse.data || []

    // Find statuses with is_sale = true
    const saleStatuses = statuses.value.filter(status =>
      status.is_sale || status.isSale
    )
    const saleStatusIds = saleStatuses.map(s => s.id)

    // Fetch all customers
    const customerResponse = await api('/customers')
    const allCustomers = Array.isArray(customerResponse) ? customerResponse : customerResponse.data || []

    // Filter customers with sale status
    const saleCustomers = allCustomers.filter(customer =>
      saleStatusIds.includes(customer.status) || saleStatusIds.includes(customer.statusId)
    )
    const saleCustomerIds = saleCustomers.map(c => c.id)

    // Store customers for reference
    customers.value = saleCustomers

    // Fetch Customer2Product data
    const c2pResponse = await api('/customer2product')
    const allC2P = Array.isArray(c2pResponse) ? c2pResponse : c2pResponse.data || []

    // Filter Customer2Product entries for sale customers
    const salesC2P = allC2P.filter(item => {
      const customerId = item.customer?.id || item.customerId || item.customer
      return saleCustomerIds.includes(customerId)
    })

    // Map the data to sales format
    salesData.value = await Promise.all(salesC2P.map(async (item) => {
      const customerId = item.customer?.id || item.customerId || item.customer
      const customer = saleCustomers.find(c => c.id === customerId)

      // Get product info if needed
      let productName = 'Ürün'
      if (item.product && typeof item.product === 'object') {
        productName = item.product.name || 'Ürün'
      } else if (item.product || item.productId) {
        try {
          const productResponse = await api(`/products/${item.product || item.productId}`)
          productName = productResponse.name || 'Ürün'
        } catch (error) {
          console.error('Error fetching product:', error)
        }
      }

      return {
        id: item.id,
        customerId: customerId,
        customer: {
          name: customer?.name || 'Bilinmeyen Müşteri',
          company: customer?.company || customer?.companyName || ''
        },
        amount: item.offer || item.price || 0,
        price: item.price || 0,
        discount: item.discount || 0,
        offer: item.offer || 0,
        description: item.note || productName,
        productName: productName,
        date: item.created_at || item.createdAt || new Date().toISOString(),
        status: 'completed' // Default status since these are sales
      }
    }))
  } catch (error) {
    console.error('Error loading sales data:', error)
    salesData.value = []
  } finally {
    loading.value = false
  }
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

  if (dateFilter.value) {
    const now = new Date()
    filtered = filtered.filter(sale => {
      const saleDate = new Date(sale.date)
      switch (dateFilter.value) {
        case 'today':
          return saleDate.toDateString() === now.toDateString()
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return saleDate >= weekAgo
        case 'month':
          return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear()
        case 'year':
          return saleDate.getFullYear() === now.getFullYear()
        default:
          return true
      }
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

// Methods
const resetFilters = () => {
  searchTerm.value = ''
  statusFilter.value = ''
  dateFilter.value = ''
}

const confirmDelete = (sale) => {
  saleToDelete.value = sale
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (saleToDelete.value) {
    try {
      // Delete the Customer2Product entry
      await api(`/customer2product/${saleToDelete.value.id}`, {
        method: 'DELETE'
      })

      // Reload the sales data
      await loadSalesData()
    } catch (error) {
      console.error('Error deleting sale:', error)
      alert('Satış silinirken bir hata oluştu.')
    }
  }
  showDeleteModal.value = false
  saleToDelete.value = null
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

// Page head
useHead({
  title: 'Satışlar - Valdori CRM'
})
</script> 