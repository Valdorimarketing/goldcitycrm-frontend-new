<template>
  <div>
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Müşteriler</h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
          Tüm müşterilerinizi buradan yönetebilirsiniz.
        </p>
      </div>
      <div class="relative flex gap-2">
          
        <div class="relative">
          <button @click="showExportModal = true"
            class="inline-flex items-center px-3 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition">
            <ArrowDownTrayIcon class="h-5 w-5 mr-2" />
            Dışa Aktar
          </button>
        </div>

        <!-- Export Modal -->
        <CustomerExportModal
          ref="exportModalRef"
          :isopen="showExportModal"
          :filters="currentExportFilters"
          :total-filtered="pagination.total"
          :current-page-count="customers.length"
          @close="showExportModal = false"
          @export="handleExport"
        />
        
        <div class="relative">
          <button @click="loadCustomers(pagination.page)"
            class="inline-flex items-center px-3 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition">
            <ArrowPathIcon class="h-5 w-5 mr-2" />
            Yenile
          </button>
        </div>
        <div v-if="authStore.user?.role == 'admin'" class="mt-4 sm:mt-0">
          <button @click="showCreateModal = true"
            class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
            <PlusIcon class="-ml-0.5 mr-1.5 h-5 w-5" /> Yeni Müşteri
          </button>
        </div>
      </div>
    </div>

    <!-- Search & Filters -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ara</label>
          <input v-model="searchTerm" type="text" class="form-input" placeholder="ID, İsim, email veya telefon..." />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Durum</label>
          <select v-model="statusFilter" class="form-input">
            <option :value="undefined">Tüm Durumlar</option>
            <option v-for="status in statusOptions" :key="status.value" :value="status.value">{{ status.label }}
            </option>
          </select>
        </div>

        <div v-if="authStore.user?.role === 'admin'">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Atanan Kullanıcı</label>
          <Combobox v-model="relevantUserFilter" nullable>
            <div class="relative">
              <ComboboxInput class="form-input w-full" :displayValue="user => user ? user.name : ''"
                @change="userQuery = $event.target.value" placeholder="Kullanıcı seçin..." />
              <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon class="h-5 w-5 text-gray-400" />
              </ComboboxButton>
              <ComboboxOptions
                class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                <ComboboxOption v-if="relevantUserFilter" :value="null" v-slot="{ active }"
                  class="relative cursor-pointer select-none py-2 pl-3 pr-9"
                  :class="active ? 'bg-indigo-600 text-white' : 'text-gray-900 dark:text-gray-100'">
                  Tüm Kullanıcılar
                </ComboboxOption>
                <ComboboxOption v-for="user in filteredUsers" :key="user.id" :value="user" v-slot="{ active, selected }"
                  class="relative cursor-pointer select-none py-2 pl-3 pr-9"
                  :class="active ? 'bg-indigo-600 text-white' : 'text-gray-900 dark:text-gray-100'">
                  <span class="block truncate" :class="selected ? 'font-semibold' : 'font-normal'">{{ user.name
                  }}</span>
                  <span v-if="selected" class="absolute inset-y-0 right-0 flex items-center pr-4"
                    :class="active ? 'text-white' : 'text-indigo-600'">
                    <CheckIcon class="h-5 w-5" />
                  </span>
                </ComboboxOption>
                <div v-if="filteredUsers.length === 0"
                  class="relative cursor-default select-none py-2 px-3 text-gray-500 dark:text-gray-400">
                  Kullanıcı bulunamadı
                </div>
              </ComboboxOptions>
            </div>
          </Combobox>
        </div>

        <div class="flex items-end">
          <button @click="resetFilters" class="btn-secondary w-full">Filtreleri Temizle</button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>

    <!-- Customers Table -->
    <div v-else class="card">

      <CustomerTable :isAdmin="isAdmin" :isUser="isUser" :data="customers" :users-map="usersMap" :status-map="statusMap" @sort="handleSort"
        :is-editable="isEditable" :is-deleteable="isDeleteable" @confirm-delete="confirmDelete"
        @show-history="showHistory" @show-notes="showNotes" @show-doctor="showDoctorAssignment"
        @show-services="showServices" @show-files="showFiles"></CustomerTable>


      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1"
        class="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 sm:px-6">
        <div class="flex flex-1 justify-between sm:hidden">
          <button :disabled="pagination.page === 1" @click="changePage(pagination.page - 1)"
            class="btn-pagination">Önceki</button>
          <button :disabled="pagination.page === pagination.totalPages" @click="changePage(pagination.page + 1)"
            class="btn-pagination ml-3">Sonraki</button>
        </div>

        <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <p class="text-sm text-gray-700 dark:text-gray-300">
            <span class="font-medium">{{ ((pagination.page - 1) * pagination.limit) + 1 }}</span> -
            <span class="font-medium">{{ Math.min(pagination.page * pagination.limit, pagination.total) }}</span>
            arası, toplam <span class="font-medium">{{ pagination.total }}</span> sonuç
          </p>
          <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm">
            <button :disabled="pagination.page === 1" @click="changePage(pagination.page - 1)" class="btn-page">
              <ChevronLeftIcon class="h-5 w-5" />
            </button>
            <button v-for="page in visiblePages" :key="page" @click="changePage(page)"
              :class="[page === pagination.page ? 'bg-indigo-600 text-white' : 'text-gray-900 dark:text-gray-300 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700', 'relative inline-flex items-center px-4 py-2 text-sm font-semibold']">
              {{ page }}
            </button>
            <button :disabled="pagination.page === pagination.totalPages" @click="changePage(pagination.page + 1)"
              class="btn-page rounded-r-md">
              <ChevronRightIcon class="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>

    </div>


    <CustomerCreateModal :show="showCreateModal" @close="showCreateModal = false" @created="handleCustomerCreated" />
    <CustomerHistoryModal :show="showHistoryModal" :customer="selectedCustomer" @close="showHistoryModal = false" />
    <CustomerNotesModal :show="showNotesModal" :customer="selectedCustomer" @close="showNotesModal = false"
      @customer-updated="() => loadCustomers(pagination.page)" />
    <DoctorAssignmentModal :show="showDoctorModal" :customer="selectedCustomer" @close="showDoctorModal = false"
      @assigned="handleDoctorAssigned" />
    <CustomerServicesModal :show="showServicesModal" :customer="selectedCustomer" @close="showServicesModal = false"
      @saved="handleServicesSaved" />
    <CustomerFilesModal :show="showFilesModal" :customer="selectedCustomer" @close="showFilesModal = false" />

    <!-- Delete Confirmation -->
    <div v-if="showDeleteModal"
      class="fixed inset-0 z-50 flex items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-80"></div>
      <div
        class="inline-block transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
        <div class="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div
              class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
              <ExclamationTriangleIcon class="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Müşteriyi Sil</h3>
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                <strong class="text-gray-700 dark:text-gray-300">{{ customerToDelete?.name }}</strong> adlı müşteriyi
                silmek
                istediğinizden emin misiniz? Bu işlem geri alınamaz.
              </p>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button @click="handleDelete" class="btn-delete sm:ml-3 sm:w-auto">Sil</button>
          <button @click="showDeleteModal = false" class="btn-cancel sm:mt-0 sm:w-auto">İptal</button>
        </div>
      </div>
    </div>
  </div>
</template>



<script setup>
import {
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  CheckIcon,
  ChevronUpDownIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon
} from '@heroicons/vue/24/outline'
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption
} from '@headlessui/vue'
import { watchDebounced } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import CustomerTable from '~/components/CustomerTable.vue'
import CustomerExportModal from '~/components/CustomerExportModal.vue'

definePageMeta({
  // middleware: 'auth' // Temporarily disabled
})

const isEditable = ref(true);
const isDeleteable = ref(true);
const authStore = useAuthStore() 
const api = useApi()

// Permissions
const { isAdmin, isUser, getCustomerFilters } = usePermissions()

// Store
const customersStore = useCustomersStore()
const { customers: allCustomers, loading, pagination } = storeToRefs(customersStore)

// Add statusInfo and relevantUser to each customer
const customers = computed(() => {
  return allCustomers.value.map(customer => {
    // Parse relevantUser ID from various possible field names
    const relevantUserId = customer.relevantUserId || customer.relevant_user_id || customer.relevent_user || customer.relevantUser

    // Get the user object from usersMap
    let relevantUserObj = null
    if (relevantUserId !== null && relevantUserId !== undefined) {
      if (typeof relevantUserId === 'object') {
        // Already an object
        relevantUserObj = relevantUserId
      } else {
        // It's an ID, look it up in usersMap
        relevantUserObj = usersMap.value[relevantUserId]
      }
    }

    return {
      ...customer,
      statusInfo: statusMap.value[customer.status],
      relevantUser: relevantUserObj
    }
  })
})

// Search and filters
const users = ref([])
const searchTerm = ref('')
const statusFilter = ref(undefined)
const relevantUserFilter = ref(null)
const statusOptions = ref([])
const statusMap = ref({}) // Status ID to status object mapping
const usersMap = ref({}) // User ID to user object mapping
const userQuery = ref('')
const showExportModal = ref(false)
const exportModalRef = ref(null)
let isInitialLoad = true

// Export için aktif filtreleri hesapla
const currentExportFilters = computed(() => {
  const filters = {}
  
  if (searchTerm.value) {
    filters.search = searchTerm.value
  }
  
  if (statusFilter.value) {
    filters.status = statusFilter.value
    // Status adını da ekle (modal'da göstermek için)
    const statusInfo = statusOptions.value.find(s => s.value === statusFilter.value)
    if (statusInfo) {
      filters.statusName = statusInfo.label
    }
  }
  
  if (relevantUserFilter.value) {
    filters.relevantUser = relevantUserFilter.value.id
    filters.userName = relevantUserFilter.value.name
  }
  
  return filters
})

// Computed list of users for the filter
const usersList = computed(() => {
  return Object.values(usersMap.value).map(user => ({
    id: user.id,
    name: `${user.name || ''} ${user.surname || ''}`.trim(),
    email: user.email
  }))
})

// Filtered users based on search query
const filteredUsers = computed(() => {
  if (userQuery.value === '') {
    return usersList.value
  }
  return usersList.value.filter((user) => {
    return user.name.toLowerCase().includes(userQuery.value.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(userQuery.value.toLowerCase()))
  })
})


// --- Storage Key ---
const STORAGE_KEY = 'customerFilters'

// --- Storage'dan filtreleri yükle ---
const loadFiltersFromStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) {
      // Storage'da veri yoksa default değerler
      pagination.value.page = 1
      return
    }

    const parsed = JSON.parse(saved)
    
    if (parsed.searchTerm) searchTerm.value = parsed.searchTerm
    if (parsed.statusFilter) statusFilter.value = parsed.statusFilter
    if (parsed.relevantUserFilter) {
      relevantUserFilter.value = parsed.relevantUserFilter
    }
    // Page değerini oku, yoksa 1 yap
    pagination.value.page = parsed.page && parsed.page > 0 ? parsed.page : 1
  } catch (err) {
    console.warn('Filtreler yüklenemedi:', err)
    pagination.value.page = 1
  }
}

// Modals
const showDeleteModal = ref(false)
const customerToDelete = ref(null)
const showCreateModal = ref(false)
const showHistoryModal = ref(false)
const showNotesModal = ref(false)
const showDoctorModal = ref(false)
const showServicesModal = ref(false)
const showFilesModal = ref(false)
const selectedCustomer = ref(null)

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

const handleExport = async ({ format, columns, scope }) => {
  // Temel filtreleri al (kullanıcı bazlı kısıtlamalar dahil)
  const baseFilters = getCustomerFilters()

  const exportFilters = { 
    ...baseFilters,
    format,
    columns: columns.join(','),
  }

  // Arama filtresi
  if (searchTerm.value) {
    exportFilters.search = searchTerm.value
  }

  // Durum filtresi
  if (statusFilter.value) {
    exportFilters.status = statusFilter.value
  }

  // Admin ise ve kullanıcı filtresi seçilmişse
  if (authStore.user?.role === 'admin' && relevantUserFilter.value) {
    exportFilters.relevantUser = relevantUserFilter.value.id
  }

  // Scope'a göre pagination ayarla
  if (scope === 'currentPage') {
    // Sadece mevcut sayfa
    exportFilters.page = pagination.value.page
    exportFilters.limit = pagination.value.limit
  } else {
    // Filtrelenmiş tüm kayıtlar (pagination yok)
    exportFilters.exportAll = true
  }

  try {
    const response = await customersStore.exportCustomers(exportFilters)

    // Determine the correct MIME type
    const mimeType = format === 'excel' 
      ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      : 'text/csv; charset=utf-8'

    // Create a blob from the response data
    const blob = new Blob([response], { type: mimeType })
    const url = window.URL.createObjectURL(blob)

    // Create a link to download the file
    const link = document.createElement('a')
    link.href = url
    
    // Dosya adına scope bilgisi ekle
    const scopeText = scope === 'currentPage' ? `page${pagination.value.page}` : 'all'
    link.setAttribute('download', `customers_${scopeText}_${new Date().getTime()}.${format === 'excel' ? 'xlsx' : 'csv'}`)
    
    document.body.appendChild(link)
    link.click()
    
    // Cleanup
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    // Modal'daki loading'i kapat
    if (exportModalRef.value) {
      exportModalRef.value.resetExporting()
    }
    
    showExportModal.value = false
    useToast().showSuccess('Müşteriler başarıyla dışa aktarıldı')
  } catch (error) {
    console.error('Error exporting customers:', error)
    
    // Modal'daki loading'i kapat
    if (exportModalRef.value) {
      exportModalRef.value.resetExporting()
    }
    
    useToast().showError('Müşteriler dışa aktarılırken bir hata oluştu')
  }
}

// --- Storage'a filtreleri kaydet ---
const saveFiltersToStorage = () => {
  const data = {
    searchTerm: searchTerm.value,
    statusFilter: statusFilter.value,
    relevantUserFilter: relevantUserFilter.value,
    page: pagination.value.page // Güncel pagination değerini kaydet
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

// --- Müşteri yükleme fonksiyonu ---
const loadCustomers = async (page = 1) => {
  const filters = getCustomerFilters()

  const customFilters = { ...filters }
  if (authStore.user?.role === 'admin' && relevantUserFilter.value) {
    customFilters.relevantUser = relevantUserFilter.value.id
  }

  await customersStore.fetchCustomers({
    page,
    search: searchTerm.value || undefined,
    status: statusFilter.value,
    ...customFilters,
  })
}


const resetFilters = () => {
  searchTerm.value = ''
  statusFilter.value = undefined
  relevantUserFilter.value = null
  userQuery.value = ''
  // Filtreleri sıfırlarken pagination'ı da 1'e çek
  pagination.value.page = 1
  // İlk sayfayı yükle
  loadCustomers(1)
}

const changePage = async (page) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    pagination.value.page = page
    await loadCustomers(page)
    saveFiltersToStorage()
  }
}

// --- Filtre değişimlerini izle (search, status, user) ---
watchDebounced(
  [searchTerm, statusFilter, relevantUserFilter],
  () => {
    if (isInitialLoad) return
    loadCustomers(pagination.value.page ?? 1)
    saveFiltersToStorage()
  },
  { debounce: 500 }
)

onMounted(async () => {
  // Filtreleri yükle (page dahil)
  loadFiltersFromStorage()
  
  // Kullanıcıları ve durumları yükle
  try {
    const usersResponse = await api('/users')
    if (Array.isArray(usersResponse)) {
      users.value = usersResponse
      usersResponse.forEach(user => {
        usersMap.value[user.id] = user
      })
    }
  } catch (usersError) {
    console.error('Failed to load users:', usersError)
  }

  try {
    const statusResponse = await api('/statuses')
    if (Array.isArray(statusResponse)) {
      statusResponse.forEach(status => {
        statusMap.value[status.id] = {
          ...status,
          isDoctor: status.isDoctor ?? status.is_doctor ?? false,
          isPricing: status.isPricing ?? status.is_pricing ?? false,
          isRemindable: status.isRemindable ?? status.is_remindable ?? false,
          isFirst: status.isFirst ?? status.is_first ?? false,
          isClosed: status.isClosed ?? status.is_closed ?? false,
          isSale: status.isSale ?? status.is_sale ?? false
        }
      })

      statusOptions.value = statusResponse
        .filter(status => status.isActive !== false)
        .map(status => ({
          value: status.id,
          label: status.name
        }))
    }
  } catch (statusError) {
    console.error('Failed to load statuses:', statusError)
  }

  isEditable.value = authStore.user?.role != 'doctor' ? true : false
  isDeleteable.value = authStore.user?.role != 'doctor' ? true : false

  // Müşterileri yükle (pagination.value.page zaten loadFiltersFromStorage ile set edildi)
  await loadCustomers(pagination.value.page)
  
  // İlk yükleme tamamlandı
  isInitialLoad = false
})

const confirmDelete = (customer) => {
  customerToDelete.value = customer
  showDeleteModal.value = true
}

const showHistory = (customer) => {
  selectedCustomer.value = customer
  showHistoryModal.value = true
}

const showNotes = (customer) => {
  selectedCustomer.value = customer
  showNotesModal.value = true
}

const showDoctorAssignment = (customer) => {
  selectedCustomer.value = customer
  showDoctorModal.value = true
}

const handleDoctorAssigned = (assignment) => {
  // Optionally refresh customer data or show success message
}

const showServices = (customer) => {
  selectedCustomer.value = customer
  showServicesModal.value = true
}

const handleServicesSaved = () => {
  showServicesModal.value = false
}

const showFiles = (customer) => {
  selectedCustomer.value = customer
  showFilesModal.value = true
}

const handleDelete = async () => {
  if (customerToDelete.value) {
    try {
      await customersStore.deleteCustomer(customerToDelete.value.id)
      await loadCustomers(pagination.value.page)
      useToast().showSuccess('Müşteri başarıyla silindi')
    } catch (error) {
      console.error('Error deleting customer:', error)
      useToast().showError('Müşteri silinirken bir hata oluştu')
    }
  }
  showDeleteModal.value = false
  customerToDelete.value = null
}

// Handle customer creation
const handleCustomerCreated = async (customer) => {
  await loadCustomers(pagination.value.page)
  useToast().showSuccess('Müşteri başarıyla oluşturuldu')
}


// Page head
useHead({
  title: 'Müşteriler - Valdori CRM'
})
</script>