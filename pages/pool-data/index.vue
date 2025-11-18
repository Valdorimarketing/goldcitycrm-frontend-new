<template>
  <div>
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-6">
      <div>
        <div class="flex items-center space-x-3">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Havuz Verileri</h1>

          <!-- Sinyal animasyonu -->
          <div class="relative w-4 h-4">
            <span
              class="absolute left-0 bottom-0 right-0 top-0 inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </div>
        </div>

        <p class="mt-2 text-sm text-gray-700">
          Havuz verileri canlı olarak listelenmektedir.
        </p>
      </div>
      <div class="mt-4 sm:mt-0 flex gap-3"> 
        <button @click="showCreateModal = true"
          class="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
          <PlusIcon class="-ml-0.5 mr-1.5 h-5 w-5" />
          Yeni Müşteri
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="mb-6">
      <div class="border-b border-gray-200 dark:border-gray-700">
        <nav class="-mb-px flex space-x-8">
          <button @click="activeTab = 'unassigned'" :class="[
            activeTab === 'unassigned'
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
            'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
          ]">
            Henüz Atanmamış
          </button>
          <button @click="activeTab = 'assigned'" :class="[
            activeTab === 'assigned'
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
            'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
          ]">
            Atandı, Beklemede
          </button>
        </nav>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>

    <!-- Customers Table -->
    <div v-else class="card">
      <div class="overflow-x-auto">

        <input v-model="columnFilters.name" type="text"
          class="w-full max-w-xl px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          placeholder="Ad, Soyad, Email, Telefon, Checkup Paket, URL alanlarında filtrele" />
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="table-header text-gray-700 dark:text-gray-300"></th>
              <th class="table-header text-gray-700 dark:text-gray-300">İsim</th>
              <th class="table-header text-gray-700 dark:text-gray-300">E-posta</th>
              <th class="table-header text-gray-700 dark:text-gray-300">Telefon</th>
              <th class="table-header text-gray-700 dark:text-gray-300">Kaynak</th>
              <th class="table-header text-gray-700 dark:text-gray-300">URL</th>
              <th class="table-header text-gray-700 dark:text-gray-300">Checkup Paket</th>
              <th class="table-header text-gray-700 dark:text-gray-300">Hastalık</th>
              <th class="table-header text-gray-700 dark:text-gray-300">Eklenme Tarihi</th>
              <th class="table-header text-gray-700 dark:text-gray-300">Bekleme Süresi</th>
              <th v-if="activeTab === 'unassigned'" class="table-header text-gray-700 dark:text-gray-300">Atama</th>
              <th v-if="activeTab === 'assigned'" class="table-header text-gray-700 dark:text-gray-300">Atanan</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="customer in customersData" :key="customer.id">
              <td class="table-cell">
                <div class="relative inline-block text-left">
                  <!-- Trigger Button -->
                  <button type="button"
                    class="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    @click="toggleShow(customer.id)">
                    <EllipsisHorizontalIcon class="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  </button>

                  <!-- Dropdown -->
                  <div v-show="showStates.activeId === customer.id"
                    class="fixed left-0 top-0 bottom-0 m-auto z-20 bg-white/50 dark:bg-black/50 w-full h-full flex justify-center items-center">
                    <div
                      class="flex flex-col h-96 max-w-lg rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition">
                      <div
                        class="flex flex-wrap gap-2 justify-between items-center px-4 py-1 border-b border-gray-200 dark:border-gray-700">
                        <div class="text-lg font-semibold">İşlemler</div>
                        <button @click="toggleShow(customer.id)" class="p-2 rounded-md">
                          <XCircleIcon class="h-6 w-6 text-gray-400 dark:text-white" />
                        </button>
                      </div>
                      <div class="p-3 grid grid-cols-3 gap-2">
                        <NuxtLink :to="`/customers/show/${customer.id}`"
                          class="flex flex-col items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                          <EyeIcon class="h-8 w-8 text-indigo-500" />
                          Görüntüle
                        </NuxtLink>

                        <button @click="showHistory(customer)"
                          class="flex flex-col items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                          <ClockIcon class="h-8 w-8 text-blue-500" />
                          Geçmiş
                        </button>

                        <button @click="showNotes(customer)"
                          class="flex flex-col items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                          <DocumentTextIcon class="h-8 w-8 text-amber-500" />
                          Notlar
                        </button>

                        <button @click="showDoctorAssignment(customer)"
                          class="flex flex-col items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                          <UsersIcon class="h-8 w-8 text-purple-500" />
                          Doktor Görüşü
                        </button>

                        <button @click="showServices(customer)"
                          class="flex flex-col items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                          <ShoppingBagIcon class="h-8 w-8 text-green-500" />
                          Hizmetler
                        </button>

                        <button @click="showFiles(customer)"
                          class="flex flex-col items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                          <FolderIcon class="h-8 w-8 text-cyan-500" />
                          Müşteri Dosyaları
                        </button>

                        <NuxtLink v-if="isEditable" :to="`/customers/edit/${customer.id}`"
                          class="flex flex-col items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                          <PencilIcon class="h-8 w-8 text-yellow-500" />
                          Düzenle
                        </NuxtLink>

                        <button v-if="isDeleteable" @click="confirmDelete(customer)"
                          class="flex flex-col items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30">
                          <TrashIcon class="h-8 w-8 text-red-500" />
                          Sil
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </td>
              <td class="table-cell">
                <div class="flex items-center">
                  <div class="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                    <span class="text-sm font-medium text-indigo-600 dark:text-indigo-300">
                      {{ customer.name.charAt(0).toUpperCase() }}
                    </span>
                  </div>
                  <div class="ml-4">
                    <NuxtLink :to="`/customers/show/${customer.id}`"
                      class="text-sm flex flex-col gap-1 font-medium text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">
                      <span>{{ customer.name }}</span>
                      <span class="text-xs dark:text-gray-400">ID: {{ customer.id }}</span>
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
                <div class="text-sm text-gray-900 dark:text-gray-100">{{ customer.source || '-' }}</div>
              </td>
              <td class="table-cell">
                <div class="text-sm text-gray-900 dark:text-gray-100">
                  <a v-if="customer.url" :href="getCustomerUrl(customer)" target="_blank" rel="noopener noreferrer"
                    class="text-blue-600 hover:underline">
                    {{ customer.url }}
                  </a>
                  <span v-else>-</span>
                </div>
              </td>
              <td class="table-cell">
                <div class="text-sm text-gray-900 dark:text-gray-100">{{ customer.checkup_package || '-' }}</div>
              </td>
              <td class="table-cell">{{ customer.patient || '-' }}</td>
              <td class="table-cell">
                <div class="text-sm text-gray-900 dark:text-gray-100">
                  {{ formatDate(customer.createdAt) }}
                </div>
              </td>
              <td class="table-cell">
                <div class="text-sm text-gray-900 dark:text-gray-100">
                  {{ getWaitingTime(activeTab === 'assigned' ? (customer.updatesAt || customer.updatedAt) :
                    customer.createdAt) }}
                </div>
              </td>
              <td v-if="activeTab === 'unassigned'" class="table-cell">
                <div class="flex gap-2 items-center">
                  <select v-model="rowAssignments[customer.id].selectedGroupId" @change="onGroupChange(customer.id)"
                    class="form-input text-xs py-1 px-2 min-w-[120px]">
                    <option value="">Grup Seç</option>
                    <option v-for="group in userGroups" :key="group.id" :value="group.id">
                      {{ group.name }}
                    </option>
                  </select>
                  <select v-model="rowAssignments[customer.id].selectedUserId"
                    :disabled="!rowAssignments[customer.id].selectedGroupId"
                    class="form-input text-xs py-1 px-2 min-w-[120px]">
                    <option value="">Kullanıcı Seç</option>
                    <option v-for="user in getGroupUsers(customer.id)" :key="user.id" :value="user.id">
                      {{ user.name }}
                    </option>
                  </select>
                  <button @click="assignCustomerToUser(customer)"
                    :disabled="!rowAssignments[customer.id].selectedUserId"
                    class="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
                    Bu Kullanıcıya Ata
                  </button>
                </div>
              </td>
              <td v-if="activeTab === 'assigned'" class="table-cell">
                <div class="text-sm text-gray-900 dark:text-gray-100">
                  {{ customer?.relevantUserData || '-' }}
                </div>
              </td>


            </tr>

            <!-- Empty State -->
            <tr v-if="customersData.length === 0">
              <td colspan="11" class="text-center py-12">
                <UsersIcon class="mx-auto h-12 w-12 text-gray-400" />
                <h3 class="mt-2 text-sm font-medium text-gray-900">Havuz verisi bulunamadı</h3>
                <p class="mt-1 text-sm text-gray-500">
                  {{ hasActiveFilters ? 'Filtre kriterlerinize uygun havuz verisi bulunamadı.' : 'Henüz havuz verisi bulunmuyor.' }}
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
            class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
            Önceki
          </button>
          <button :disabled="pagination.page === pagination.totalPages" @click="changePage(pagination.page + 1)"
            class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
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
                class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50">
                <ChevronLeftIcon class="h-5 w-5" />
              </button>

              <button v-for="page in visiblePages" :key="page" @click="changePage(page)" :class="[
                page === pagination.page
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
                'relative inline-flex items-center px-4 py-2 text-sm font-semibold'
              ]">
                {{ page }}
              </button>

              <button :disabled="pagination.page === pagination.totalPages" @click="changePage(pagination.page + 1)"
                class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50">
                <ChevronRightIcon class="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-80 transition-opacity">
        </div>

        <div
          class="inline-block transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div class="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div
                class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                <ExclamationTriangleIcon class="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                  Kişiyi Sil
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    <strong class="text-gray-700 dark:text-gray-300">{{ customerToDelete?.name }}</strong> adlı kişiyi
                    silmek istediğinizden emin misiniz?
                    Bu işlem geri alınamaz.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button @click="handleDelete"
              class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 dark:bg-red-600 dark:hover:bg-red-700 sm:ml-3 sm:w-auto">
              Sil
            </button>
            <button @click="showDeleteModal = false"
              class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-600 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 sm:mt-0 sm:w-auto">
              İptal
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Customer Create Modal -->
    <CustomerCreateModal :show="showCreateModal" @close="showCreateModal = false" @created="handleCustomerCreated" />

    <!-- Customer History Modal -->
    <CustomerHistoryModal :show="showHistoryModal" :customer="selectedCustomer" @close="showHistoryModal = false" />

    <!-- Customer Notes Modal -->
    <CustomerNotesModal :show="showNotesModal" :customer="selectedCustomer" @close="showNotesModal = false"
      @customer-updated="() => customersStore.fetchCustomers(pagination.page)" />

    <!-- Doctor Assignment Modal -->
    <DoctorAssignmentModal :show="showDoctorModal" :customer="selectedCustomer" @close="showDoctorModal = false"
      @assigned="handleDoctorAssigned" />

    <!-- Customer Services Modal -->
    <CustomerServicesModal :show="showServicesModal" :customer="selectedCustomer" @close="showServicesModal = false"
      @saved="handleServicesSaved" />

    <!-- Customer Files Modal -->
    <CustomerFilesModal :show="showFilesModal" :customer="selectedCustomer" @close="showFilesModal = false" />
  </div>
</template>

<script setup>
import {
  PlusIcon,
  UsersIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  ClockIcon,
  DocumentTextIcon,
  ShoppingBagIcon,
  PencilIcon,
  TrashIcon,
  FolderIcon,
  XCircleIcon,
  EllipsisHorizontalIcon
} from '@heroicons/vue/24/outline'

import { useAuthStore } from '~/stores/auth'
const { $dayjs } = useNuxtApp()

definePageMeta({
  middleware: ['auth', 'admindoctor'] // Only admin can access pool data
})

const loading = ref(true)
const pagination = ref({
  total: 0,
  page: 1,
  limit: 50,
  totalPages: 0
})

const customersData = ref([])
const authStore = useAuthStore()

// Tab state - read from URL query parameter
const route = useRoute()
const router = useRouter()
const activeTab = ref(route.query.tab || 'unassigned')
const isEditable = ref(true);
const isDeleteable = ref(true);

// Search and filters

const statusOptions = ref([])
const statusMap = ref({})
const usersMap = ref({}) // User ID to user object mapping

const showStates = ref({ activeId: null })



// Column filters
const columnFilters = ref({
  name: '',
  email: '',
  phone: '',
  url: '',
  checkup_package: '',
  source: '',
  createdAt: ''
})

// 🔄 Filtre değiştikçe API çağır
watch(columnFilters, () => {
  fetchCustomers(1)
}, { deep: true })

// User assignment
const users = ref([])

// User groups and row-level assignments
const userGroups = ref([])
const rowAssignments = ref({})
const groupUsersMap = ref({}) // Group ID to users array mapping

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
const isInitialLoad = ref(true)

const toggleShow = (id) => {
  if (showStates.value.activeId === id) {
    // Aynı id'ye tıklandıysa: kapat
    showStates.value.activeId = null
  } else {
    // Farklı id'ye tıklandıysa: mevcut açık olanı kapat, yenisini aç
    showStates.value.activeId = id
  }
}


const hasActiveFilters = computed(() => {
  return Object.values(columnFilters.value).some(v => v !== '')
})


const getCustomerUrl = (customer) => {
  if (!customer?.url) return null;

  const domains = {
    4: 'https://lp.livhospital.com',
    8: 'https://int.livhospital.com',
  };

  const base = domains[customer.sourceId] || '#';

  return base + customer.url;
};



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


// Row-level assignment methods
const initializeRowAssignment = (id) => {
  if (!rowAssignments.value[id]) {
    rowAssignments.value[id] = { selectedGroupId: '', selectedUserId: '' }
  }
}

const onGroupChange = async (customerId) => {
  initializeRowAssignment(customerId)
  const groupId = rowAssignments.value[customerId].selectedGroupId

  // Reset user selection when group changes
  rowAssignments.value[customerId].selectedUserId = ''

  if (!groupId) return

  // Fetch users for this group if not already cached
  if (!groupUsersMap.value[groupId]) {
    try {
      const api = useApi()
      const response = await api(`/user-group/${groupId}/users`)
      groupUsersMap.value[groupId] = Array.isArray(response) ? response : (response?.data || [])
    } catch (error) {
      console.error('Error loading group users:', error)
      groupUsersMap.value[groupId] = []
    }
  }
}

const getGroupUsers = (customerId) => {
  if (!rowAssignments.value[customerId]) return []
  const groupId = rowAssignments.value[customerId].selectedGroupId
  return groupUsersMap.value[groupId] || []
}

const assignCustomerToUser = async (customer) => {
  const userId = rowAssignments.value[customer.id].selectedUserId
  if (!userId) return

  try {
    const api = useApi()

    await api(`/customers/${customer.id}`, {
      method: 'PATCH',
      body: {
        relevantUser: userId
      }
    })

    // Clear row assignment
    delete rowAssignments.value[customer.id]

    // Refetch customers to update the list
    await fetchCustomers(pagination.value.page)

    console.log('Customer assigned successfully')
  } catch (error) {
    console.error('Error assigning customer:', error)
  }
}

// Fetch customers based on active tab

// ✅ Backend query tabanlı filtreleme
const fetchCustomers = async (page = 1) => {
  try {
    if (isInitialLoad.value) loading.value = true
    const api = useApi()

    const queryParams = {
      isFirst: true,
      page: page,
      limit: pagination.value.limit
    }

    // Tab filtresi
    if (activeTab.value === 'unassigned') {
      queryParams.hasRelevantUser = false
    } else if (activeTab.value === 'assigned') {
      queryParams.hasRelevantUser = true
    }

    // 🔍 Dinamik kolon filtreleri
    for (const [key, value] of Object.entries(columnFilters.value)) {
      if (value && value.trim() !== '') {
        queryParams['search'] = value.trim()
      }
    }

    const response = await api('/customers', { query: queryParams })

    const customersArray = Array.isArray(response)
      ? response
      : (response.data || [])
    const meta = response.meta || {}

    customersData.value = customersArray.map(customer => ({
      ...customer,
      name: `${customer.name || ''} ${customer.surname || ''}`.trim() || 'İsimsiz',
      source: customer.source || '-',
      isActive: customer.isActive !== undefined ? customer.isActive : true,
      user: usersMap.value[customer.userId] || customer.user,
      relevantUser: usersMap.value[customer.relevantUserId] || customer.relevantUser
    }))

    pagination.value = {
      total: meta.total || customersArray.length,
      page: meta.page || page,
      limit: meta.limit || pagination.value.limit,
      totalPages: meta.totalPages || Math.ceil((meta.total || customersArray.length) / pagination.value.limit)
    }

    customersData.value.forEach(c => initializeRowAssignment(c.id))
  } catch (error) {
    console.error('Failed to load customers:', error)
  } finally {
    if (isInitialLoad.value) {
      loading.value = false
      isInitialLoad.value = false
    }
  }
}

 

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    fetchCustomers(page)
  }
}

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

const handleDelete = async () => {
  if (customerToDelete.value) {
    try {
      const api = useApi()
      const customerId = customerToDelete.value.id

      await api(`/customers/${customerId}`, {
        method: 'DELETE'
      })

      // Refetch customers after deletion
      await fetchCustomers(pagination.value.page)

      console.log('Customer deleted successfully')
    } catch (error) {
      console.error('Error deleting customer:', error)
    }
  }
  showDeleteModal.value = false
  customerToDelete.value = null
}

// Handle customer creation
const handleCustomerCreated = async (customer) => {
  console.log('New customer created:', customer)

  // Refetch customers to show the new one
  await fetchCustomers(1)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('tr-TR')
}



const getWaitingTime = (dateString) => {
  if (!dateString) return '-'

  return $dayjs(dateString).fromNow()

}


// Initialize data
onMounted(async () => {
  const api = useApi()
  try {
    const [usersResponse, groupsResponse, statusResponse] = await Promise.all([
      api('/users'),
      api('/user-group'),
      api('/statuses')
    ])



    if (usersResponse) {
      users.value = usersResponse
      usersResponse.forEach(u => (usersMap.value[u.id] = u))
    }

    if (groupsResponse) {
      userGroups.value = groupsResponse.data
    }



    if (statusResponse) {
      statusResponse.forEach(s => (statusMap.value[s.id] = s))
      statusOptions.value = statusResponse
        .filter(s => s.isActive !== false && s.isFirst === true)
        .map(s => ({ value: s.id, label: s.name }))
    }

    isEditable.value = authStore.user?.role != 'doctor' ? true : false
    isDeleteable.value = authStore.user?.role != 'doctor' ? true : false

    // İlk yüklemede API'den müşteriler
    await fetchCustomers(1)
  } catch (error) {
    console.error('Initialization failed:', error)
    loading.value = false
  }

})

// Watch tab changes and refetch data
watch(activeTab, async (newTab) => {
  // Update URL query parameter
  router.push({ query: { tab: newTab } })

  // Reset filters and fetch new data
  pagination.value.page = 1
  await fetchCustomers(1)

})

// Page head
useHead({
  title: 'Havuz Verileri - Valdori CRM'
})
</script>
