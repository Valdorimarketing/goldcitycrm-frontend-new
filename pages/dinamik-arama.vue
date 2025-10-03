<template>
  <div>
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dinamik Arama</h1>
        <p class="mt-2 text-sm text-gray-700">
          Hatırlatma gerektiren müşterilerinizi buradan yönetebilirsiniz.
        </p>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label for="search" class="block text-sm font-medium text-gray-700 mb-2">
            Ara
          </label>
          <input
            id="search"
            v-model="searchTerm"
            type="text"
            class="form-input"
            placeholder="İsim, email veya telefon ile ara..."
          />
        </div>
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
            Durum
          </label>
          <select
            id="status"
            v-model="statusFilter"
            class="form-input"
          >
            <option value="">Tüm Durumlar</option>
            <option v-for="status in statusOptions" :key="status.value" :value="status.value">
              {{ status.label }}
            </option>
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

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>

    <!-- Customers Table -->
    <div v-else class="card">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="table-header text-gray-700 dark:text-gray-300">İsim</th>
              <th class="table-header text-gray-700 dark:text-gray-300">E-posta</th>
              <th class="table-header text-gray-700 dark:text-gray-300">Telefon</th>
              <th class="table-header text-gray-700 dark:text-gray-300">Durum</th>
              <th class="table-header text-gray-700 dark:text-gray-300">Hatırlatma Tarihi</th>
              <th class="table-header text-gray-700 dark:text-gray-300">Kaynak</th>
              <th class="table-header text-gray-700 dark:text-gray-300">Oluşturan</th>
              <th class="table-header text-gray-700 dark:text-gray-300">Atanan</th>
              <th class="table-header text-gray-700 dark:text-gray-300">Aktif</th>
              <th class="table-header text-gray-700 dark:text-gray-300">İşlemler</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="customer in filteredCustomers" :key="customer.id">
              <td class="table-cell">
                <div class="flex items-center">
                  <div class="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                    <span class="text-sm font-medium text-indigo-600 dark:text-indigo-300">
                      {{ customer.name.charAt(0).toUpperCase() }}
                    </span>
                  </div>
                  <div class="ml-4">
                    <NuxtLink
                      :to="`/customers/show/${customer.id}`"
                      class="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                    >
                      {{ customer.name }}
                    </NuxtLink>
                  </div>
                </div>
              </td>
              <td class="table-cell">
                <div class="text-sm text-gray-900 dark:text-gray-100">{{ customer.email || '-' }}</div>
              </td>
              <td class="table-cell">
                <div class="text-sm text-gray-900 dark:text-gray-100">{{ customer.phone || '-' }}</div>
              </td>
              <td class="table-cell">
                <span
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getStatusClass(customer.status)"
                >
                  {{ getStatusText(customer.status) }}
                </span>
              </td>
              <td class="table-cell">
                <div class="text-sm text-gray-900 dark:text-gray-100">
                  {{ formatDateTime(customer.remindingDate) }}
                </div>
              </td>
              <td class="table-cell">
                <div class="text-sm text-gray-900 dark:text-gray-100">{{ customer.source || '-' }}</div>
              </td>
              <td class="table-cell">
                <div class="text-sm text-gray-900 dark:text-gray-100">{{ customer.user?.name || '-' }}</div>
              </td>
              <td class="table-cell">
                <div class="text-sm text-gray-900 dark:text-gray-100">{{ customer.relevantUser?.name || '-' }}</div>
              </td>
              <td class="table-cell">
                <span
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="customer.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'"
                >
                  {{ customer.isActive ? 'Aktif' : 'Pasif' }}
                </span>
              </td>
              <td class="table-cell">
                <div class="flex gap-1">
                  <NuxtLink
                    :to="`/customers/show/${customer.id}`"
                    class="relative group p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Görüntüle"
                  >
                    <EyeIcon class="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <span class="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      Görüntüle
                    </span>
                  </NuxtLink>
                  <button
                    @click="showHistory(customer)"
                    class="relative group p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Geçmiş"
                  >
                    <ClockIcon class="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span class="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      Geçmiş
                    </span>
                  </button>
                  <button
                    @click="showNotes(customer)"
                    class="relative group p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Notlar"
                  >
                    <DocumentTextIcon class="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <span class="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      Notlar
                    </span>
                  </button>
                  <button
                    @click="showDoctorAssignment(customer)"
                    class="relative group p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Doktor Görüşüne Gönder"
                  >
                    <UserIcon class="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <span class="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      Doktor Görüşüne Gönder
                    </span>
                  </button>
                  <button
                    @click="showServices(customer)"
                    class="relative group p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Hizmetler"
                  >
                    <ShoppingBagIcon class="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span class="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      Hizmetler
                    </span>
                  </button>
                  <button
                    @click="showFiles(customer)"
                    class="relative group p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Müşteri Dosyaları"
                  >
                    <FolderIcon class="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                    <span class="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      Müşteri Dosyaları
                    </span>
                  </button>
                  <NuxtLink
                    :to="`/customers/edit/${customer.id}`"
                    class="relative group p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Düzenle"
                  >
                    <PencilIcon class="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    <span class="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      Düzenle
                    </span>
                  </NuxtLink>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="filteredCustomers.length === 0">
              <td colspan="10" class="text-center py-12">
                <UsersIcon class="mx-auto h-12 w-12 text-gray-400" />
                <h3 class="mt-2 text-sm font-medium text-gray-900">Hatırlatma gerektiren müşteri bulunamadı</h3>
                <p class="mt-1 text-sm text-gray-500">
                  {{ searchTerm ? 'Arama kriterlerinize uygun müşteri bulunamadı.' : 'Henüz hatırlatma gerektiren müşteri bulunmuyor.' }}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Customer History Modal -->
    <CustomerHistoryModal
      :show="showHistoryModal"
      :customer="selectedCustomer"
      @close="showHistoryModal = false"
    />

    <!-- Customer Notes Modal -->
    <CustomerNotesModal
      :show="showNotesModal"
      :customer="selectedCustomer"
      @close="showNotesModal = false"
      @customer-updated="() => customersStore.fetchCustomers(pagination.page)"
    />

    <!-- Doctor Assignment Modal -->
    <DoctorAssignmentModal
      :show="showDoctorModal"
      :customer="selectedCustomer"
      @close="showDoctorModal = false"
      @assigned="handleDoctorAssigned"
    />

    <!-- Customer Services Modal -->
    <CustomerServicesModal
      :show="showServicesModal"
      :customer="selectedCustomer"
      @close="showServicesModal = false"
      @saved="handleServicesSaved"
    />

    <!-- Customer Files Modal -->
    <CustomerFilesModal
      :show="showFilesModal"
      :customer="selectedCustomer"
      @close="showFilesModal = false"
    />
  </div>
</template>

<script setup>
import {
  UsersIcon,
  EyeIcon,
  ClockIcon,
  DocumentTextIcon,
  UserIcon,
  ShoppingBagIcon,
  PencilIcon,
  FolderIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  // middleware: 'auth' // Temporarily disabled
})

const loading = ref(true)

// Sample customers data for demo - will be replaced by API data
const customersData = ref([])

// Search and filters
const searchTerm = ref('')
const statusFilter = ref('')
const statusOptions = ref([])
const statusMap = ref({}) // Status ID to status object mapping
const remindableStatusIds = ref([]) // Store remindable status IDs
const usersMap = ref({}) // User ID to user object mapping

// Modals
const showHistoryModal = ref(false)
const showNotesModal = ref(false)
const showDoctorModal = ref(false)
const showServicesModal = ref(false)
const showFilesModal = ref(false)
const selectedCustomer = ref(null)

// Computed properties
const filteredCustomers = computed(() => {
  let filtered = customersData.value

  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(customer =>
      customer.name?.toLowerCase().includes(search) ||
      customer.email?.toLowerCase().includes(search) ||
      customer.phone?.toLowerCase().includes(search) ||
      customer.source?.toLowerCase().includes(search)
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(customer => customer.status === statusFilter.value)
  }

  // Sort by reminding date (ascending - earliest first)
  filtered.sort((a, b) => {
    const dateA = a.remindingDate ? new Date(a.remindingDate).getTime() : Infinity
    const dateB = b.remindingDate ? new Date(b.remindingDate).getTime() : Infinity
    return dateA - dateB
  })

  return filtered
})

// Methods
const resetFilters = () => {
  searchTerm.value = ''
  statusFilter.value = ''
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
  console.log('Doctor assigned:', assignment)
  // Optionally refresh customer data or show success message
}

const showServices = (customer) => {
  selectedCustomer.value = customer
  showServicesModal.value = true
}

const handleServicesSaved = () => {
  console.log('Services saved successfully')
  showServicesModal.value = false
}

const showFiles = (customer) => {
  selectedCustomer.value = customer
  showFilesModal.value = true
}

const formatDateTime = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('tr-TR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusClass = (statusId) => {
  const status = statusMap.value[statusId]
  if (!status) {
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }

  // Use color from status if available
  if (status.color) {
    return `bg-[${status.color}20] text-[${status.color}] dark:bg-[${status.color}30] dark:text-[${status.color}]`
  }

  // Default colors based on status flags
  if (status.isSale) {
    return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
  }
  if (status.isClosed) {
    return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
  }
  if (status.isFirst) {
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
  }

  return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

const getStatusText = (statusId) => {
  const status = statusMap.value[statusId]
  return status?.name || statusId || 'Bilinmiyor'
}

// Initialize data
onMounted(async () => {
  try {
    const api = useApi()
    const { getCustomerFilters, canAccessCustomer } = usePermissions()
    console.log('Loading statuses, users and customers...')

    // Load users first
    try {
      const usersResponse = await api('/users')
      console.log('Users loaded:', usersResponse)
      if (Array.isArray(usersResponse)) {
        usersResponse.forEach(user => {
          usersMap.value[user.id] = user
        })
      }
    } catch (usersError) {
      console.error('Failed to load users:', usersError)
    }

    // Load statuses
    try {
      const statusResponse = await api('/statuses')
      console.log('Statuses loaded:', statusResponse)

      if (Array.isArray(statusResponse)) {
        // Create status map for quick lookup
        statusResponse.forEach(status => {
          statusMap.value[status.id] = status

          // Track remindable status IDs
          if (status.is_remindable || status.isRemindable) {
            remindableStatusIds.value.push(status.id)
          }
        })

        // Create status options for filter dropdown (only remindable statuses)
        statusOptions.value = statusResponse
          .filter(status => (status.is_remindable || status.isRemindable) && status.isActive !== false)
          .map(status => ({
            value: status.id,
            label: status.name
          }))
      }
    } catch (statusError) {
      console.error('Failed to load statuses:', statusError)
    }

    // Load customers with role-based filters
    const filters = getCustomerFilters()
    console.log('[Dinamik Arama] Applying role-based filters:', filters)
    const response = await api('/customers', { query: filters })

    console.log('[Dinamik Arama] Customers loaded:', response.length, 'customers')
    if (Array.isArray(response)) {
      // Direct array response from backend
      const allCustomers = response.map(customer => {
        // Map user IDs to user objects
        const userId = customer.userId || customer.user_id || customer.user
        const relevantUserId = customer.relevantUserId || customer.relevant_user_id || customer.relevent_user || customer.relevantUser

        return {
          ...customer,
          name: `${customer.name || ''} ${customer.surname || ''}`.trim() || 'İsimsiz',
          status: customer.statusId || customer.status,
          source: customer.source || '-',
          isActive: customer.isActive !== undefined ? customer.isActive : true,
          remindingDate: customer.remindingDate || customer.reminding_date || null,
          user: usersMap.value[userId] || customer.user,
          relevantUser: usersMap.value[relevantUserId] || customer.relevantUser
        }
      })

      console.log('[Dinamik Arama] Before status filter:', allCustomers.length)
      const afterStatusFilter = allCustomers.filter(customer => {
        const hasRemindableStatus = remindableStatusIds.value.includes(customer.status)
        console.log('[Dinamik Arama] Customer', customer.id, 'status:', customer.status, 'is remindable:', hasRemindableStatus)
        return hasRemindableStatus
      })
      console.log('[Dinamik Arama] After status filter:', afterStatusFilter.length)

      const afterAccessFilter = afterStatusFilter.filter(customer => {
        const hasAccess = canAccessCustomer(customer)
        console.log('[Dinamik Arama] Customer', customer.id, 'relevantUser:', customer.relevantUser, 'hasAccess:', hasAccess)
        return hasAccess
      })
      console.log('[Dinamik Arama] After access filter:', afterAccessFilter.length)

      customersData.value = afterAccessFilter
      console.log('[Dinamik Arama] Final filtered remindable customers:', customersData.value.length)
    } else {
      const allCustomers = (response.data || []).map(customer => {
        // Map user IDs to user objects
        const userId = customer.userId || customer.user_id || customer.user
        const relevantUserId = customer.relevantUserId || customer.relevant_user_id || customer.relevent_user || customer.relevantUser

        return {
          ...customer,
          name: `${customer.name || ''} ${customer.surname || ''}`.trim() || 'İsimsiz',
          status: customer.statusId || customer.status,
          source: customer.source || '-',
          isActive: customer.isActive !== undefined ? customer.isActive : true,
          remindingDate: customer.remindingDate || customer.reminding_date || null,
          user: usersMap.value[userId] || customer.user,
          relevantUser: usersMap.value[relevantUserId] || customer.relevantUser
        }
      })

      console.log('[Dinamik Arama] Before status filter:', allCustomers.length)
      const afterStatusFilter = allCustomers.filter(customer => {
        const hasRemindableStatus = remindableStatusIds.value.includes(customer.status)
        return hasRemindableStatus
      })
      console.log('[Dinamik Arama] After status filter:', afterStatusFilter.length)

      const afterAccessFilter = afterStatusFilter.filter(customer => {
        const hasAccess = canAccessCustomer(customer)
        return hasAccess
      })
      console.log('[Dinamik Arama] After access filter:', afterAccessFilter.length)

      customersData.value = afterAccessFilter
    }
  } catch (error) {
    console.error('Failed to load data:', error)
  } finally {
    loading.value = false
  }
})

// Page head
useHead({
  title: 'Dinamik Arama - Valdori CRM'
})
</script>
