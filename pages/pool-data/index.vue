<template>
  <div>
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Havuz Verileri</h1>
        <p class="mt-2 text-sm text-gray-700">
          Havuz verilerini buradan görebilirsiniz.
        </p>
      </div>
      <div class="mt-4 sm:mt-0 flex gap-3">
        <button
          @click="resetFilters"
          class="inline-flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          Filtreleri Temizle
        </button>
        <button
          @click="showCreateModal = true"
          class="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          <PlusIcon class="-ml-0.5 mr-1.5 h-5 w-5" />
          Yeni Müşteri
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="mb-6">
      <div class="border-b border-gray-200 dark:border-gray-700">
        <nav class="-mb-px flex space-x-8">
          <button
            @click="activeTab = 'unassigned'"
            :class="[
              activeTab === 'unassigned'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
              'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
            ]"
          >
            Henüz Atanmamış
          </button>
          <button
            @click="activeTab = 'assigned'"
            :class="[
              activeTab === 'assigned'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
              'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
            ]"
          >
            Atandı, Beklemede
          </button>
        </nav>
      </div>
    </div>

    <!-- User Assignment (only show on unassigned tab) -->
    <div v-if="activeTab === 'unassigned'" class="card mb-6">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div class="sm:col-span-2 relative">
          <label for="user-select" class="block text-sm font-medium text-gray-700 mb-2">
            Kullanıcı Seç
          </label>
          <input
            id="user-select"
            v-model="userSearch"
            type="text"
            class="form-input"
            placeholder="Kullanıcı ara..."
            @focus="showUserDropdown = true"
            @blur="hideUserDropdown"
          />
          <div v-if="showUserDropdown && filteredUsers.length > 0" class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
            <button
              v-for="user in filteredUsers"
              :key="user.id"
              @mousedown.prevent="selectUser(user)"
              class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-900 dark:text-gray-100"
            >
              {{ user.name }} ({{ user.email }})
            </button>
          </div>
        </div>
        <div class="flex items-end">
          <button
            @click="assignSelectedCustomers"
            :disabled="!selectedUser || selectedCustomers.length === 0"
            class="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Seçili Olanları Ata ({{ selectedCustomers.length }})
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
              <th v-if="activeTab === 'unassigned'" class="table-header text-gray-700 dark:text-gray-300 w-12">
                <input
                  type="checkbox"
                  :checked="isAllSelected"
                  @change="toggleSelectAll"
                  class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </th>
              <th class="table-header text-gray-700 dark:text-gray-300">İsim</th>
              <th class="table-header text-gray-700 dark:text-gray-300">E-posta</th>
              <th class="table-header text-gray-700 dark:text-gray-300">Telefon</th>
              <th class="table-header text-gray-700 dark:text-gray-300">Kaynak</th>
              <th class="table-header text-gray-700 dark:text-gray-300">Eklenme Tarihi</th>
              <th class="table-header text-gray-700 dark:text-gray-300">Bekleme Süresi</th>
              <th v-if="activeTab === 'unassigned'" class="table-header text-gray-700 dark:text-gray-300">Atama</th>
              <th v-if="activeTab === 'assigned'" class="table-header text-gray-700 dark:text-gray-300">Atanan</th>
              <th class="table-header text-gray-700 dark:text-gray-300">İşlemler</th>
            </tr>
            <tr>
              <th v-if="activeTab === 'unassigned'" class="px-3 py-2"></th>
              <th class="px-3 py-2">
                <input
                  v-model="columnFilters.name"
                  type="text"
                  class="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Filtre..."
                />
              </th>
              <th class="px-3 py-2">
                <input
                  v-model="columnFilters.email"
                  type="text"
                  class="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Filtre..."
                />
              </th>
              <th class="px-3 py-2">
                <input
                  v-model="columnFilters.phone"
                  type="text"
                  class="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Filtre..."
                />
              </th>
              <th class="px-3 py-2">
                <input
                  v-model="columnFilters.source"
                  type="text"
                  class="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Filtre..."
                />
              </th>
              <th class="px-3 py-2">
                <input
                  v-model="columnFilters.createdAt"
                  type="text"
                  class="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Filtre..."
                />
              </th>
              <th class="px-3 py-2"></th>
              <th v-if="activeTab === 'unassigned'" class="px-3 py-2"></th>
              <th v-if="activeTab === 'assigned'" class="px-3 py-2"></th>
              <th class="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="customer in filteredCustomers" :key="customer.id">
              <td v-if="activeTab === 'unassigned'" class="table-cell w-12">
                <input
                  type="checkbox"
                  :checked="isCustomerSelected(customer.id)"
                  @change="toggleCustomerSelection(customer.id)"
                  class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </td>
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
                <div class="text-sm text-gray-900 dark:text-gray-100">{{ customer.source || '-' }}</div>
              </td>
              <td class="table-cell">
                <div class="text-sm text-gray-900 dark:text-gray-100">
                  {{ formatDate(customer.createdAt) }}
                </div>
              </td>
              <td class="table-cell">
                <div class="text-sm text-gray-900 dark:text-gray-100">
                  {{ getWaitingTime(activeTab === 'assigned' ? (customer.updatesAt || customer.updatedAt) : customer.createdAt) }}
                </div>
              </td>
              <td v-if="activeTab === 'unassigned'" class="table-cell">
                <div class="flex gap-2 items-center">
                  <select
                    v-model="rowAssignments[customer.id].selectedGroupId"
                    @change="onGroupChange(customer.id)"
                    class="form-input text-xs py-1 px-2 min-w-[120px]"
                  >
                    <option value="">Grup Seç</option>
                    <option v-for="group in userGroups" :key="group.id" :value="group.id">
                      {{ group.name }}
                    </option>
                  </select>
                  <select
                    v-model="rowAssignments[customer.id].selectedUserId"
                    :disabled="!rowAssignments[customer.id].selectedGroupId"
                    class="form-input text-xs py-1 px-2 min-w-[120px]"
                  >
                    <option value="">Kullanıcı Seç</option>
                    <option
                      v-for="user in getGroupUsers(customer.id)"
                      :key="user.id"
                      :value="user.id"
                    >
                      {{ user.name }}
                    </option>
                  </select>
                  <button
                    @click="assignCustomerToUser(customer)"
                    :disabled="!rowAssignments[customer.id].selectedUserId"
                    class="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    Bu Kullanıcıya Ata
                  </button>
                </div>
              </td>
              <td v-if="activeTab === 'assigned'" class="table-cell">
                <div class="text-sm text-gray-900 dark:text-gray-100">
                  {{ customer.relevantUser?.name || '-' }}
                </div>
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
                  <button
                    @click="confirmDelete(customer)"
                    class="relative group p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Sil"
                  >
                    <TrashIcon class="h-4 w-4 text-red-600 dark:text-red-400" />
                    <span class="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      Sil
                    </span>
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="filteredCustomers.length === 0">
              <td :colspan="activeTab === 'unassigned' ? 9 : 8" class="text-center py-12">
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
      <div v-if="pagination.totalPages > 1" class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div class="flex flex-1 justify-between sm:hidden">
          <button
            :disabled="pagination.page === 1"
            @click="changePage(pagination.page - 1)"
            class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Önceki
          </button>
          <button
            :disabled="pagination.page === pagination.totalPages"
            @click="changePage(pagination.page + 1)"
            class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Sonraki
          </button>
        </div>
        <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
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
              <button
                :disabled="pagination.page === 1"
                @click="changePage(pagination.page - 1)"
                class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeftIcon class="h-5 w-5" />
              </button>

              <button
                v-for="page in visiblePages"
                :key="page"
                @click="changePage(page)"
                :class="[
                  page === pagination.page
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
                  'relative inline-flex items-center px-4 py-2 text-sm font-semibold'
                ]"
              >
                {{ page }}
              </button>

              <button
                :disabled="pagination.page === pagination.totalPages"
                @click="changePage(pagination.page + 1)"
                class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
              >
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
        <div class="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-80 transition-opacity"></div>

        <div class="inline-block transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div class="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                <ExclamationTriangleIcon class="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                  Kişiyi Sil
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    <strong class="text-gray-700 dark:text-gray-300">{{ customerToDelete?.name }}</strong> adlı kişiyi silmek istediğinizden emin misiniz?
                    Bu işlem geri alınamaz.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              @click="handleDelete"
              class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 dark:bg-red-600 dark:hover:bg-red-700 sm:ml-3 sm:w-auto"
            >
              Sil
            </button>
            <button
              @click="showDeleteModal = false"
              class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-600 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 sm:mt-0 sm:w-auto"
            >
              İptal
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Customer Create Modal -->
    <CustomerCreateModal
      :show="showCreateModal"
      @close="showCreateModal = false"
      @created="handleCustomerCreated"
    />

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
  PlusIcon,
  UsersIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  ClockIcon,
  DocumentTextIcon,
  UserIcon,
  ShoppingBagIcon,
  PencilIcon,
  TrashIcon,
  FolderIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  // middleware: 'auth' // Temporarily disabled
})

const loading = ref(true)
const pagination = ref({
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0
})

const customersData = ref([])

// Tab state - read from URL query parameter
const route = useRoute()
const activeTab = ref(route.query.tab || 'unassigned')

// Search and filters
const searchTerm = ref('')
const statusFilter = ref('')
const statusOptions = ref([])
const statusMap = ref({})
const usersMap = ref({}) // User ID to user object mapping

// Column filters
const columnFilters = ref({
  name: '',
  email: '',
  phone: '',
  source: '',
  createdAt: ''
})

// User assignment
const users = ref([])
const selectedUser = ref(null)
const userSearch = ref('')
const showUserDropdown = ref(false)
const selectedCustomers = ref([])

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

// Computed properties
const filteredCustomers = computed(() => {
  let filtered = customersData.value

  // Tab filter - filter based on active tab
  if (activeTab.value === 'unassigned') {
    // Show customers with is_first status and no relevantUser
    filtered = filtered.filter(customer => {
      const status = statusMap.value[customer.status]
      return status?.isFirst === true && !customer.relevantUser
    })
  } else if (activeTab.value === 'assigned') {
    // Show customers with is_first status and relevantUser exists
    filtered = filtered.filter(customer => {
      const status = statusMap.value[customer.status]
      return status?.isFirst === true && customer.relevantUser
    })
  }

  // Column filters
  if (columnFilters.value.name) {
    const nameFilter = columnFilters.value.name.toLowerCase()
    filtered = filtered.filter(customer =>
      customer.name?.toLowerCase().includes(nameFilter)
    )
  }

  if (columnFilters.value.email) {
    const emailFilter = columnFilters.value.email.toLowerCase()
    filtered = filtered.filter(customer =>
      customer.email?.toLowerCase().includes(emailFilter)
    )
  }

  if (columnFilters.value.phone) {
    const phoneFilter = columnFilters.value.phone.toLowerCase()
    filtered = filtered.filter(customer =>
      customer.phone?.toLowerCase().includes(phoneFilter)
    )
  }

  if (columnFilters.value.source) {
    const sourceFilter = columnFilters.value.source.toLowerCase()
    filtered = filtered.filter(customer =>
      customer.source?.toLowerCase().includes(sourceFilter)
    )
  }

  if (columnFilters.value.createdAt) {
    const dateFilter = columnFilters.value.createdAt.toLowerCase()
    filtered = filtered.filter(customer =>
      formatDate(customer.createdAt)?.toLowerCase().includes(dateFilter)
    )
  }

  return filtered
})

const hasActiveFilters = computed(() => {
  return Object.values(columnFilters.value).some(filter => filter !== '')
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

const filteredUsers = computed(() => {
  if (!userSearch.value) {
    return users.value
  }
  const search = userSearch.value.toLowerCase()
  return users.value.filter(user =>
    user.name?.toLowerCase().includes(search) ||
    user.email?.toLowerCase().includes(search)
  )
})

const isAllSelected = computed(() => {
  return filteredCustomers.value.length > 0 &&
    filteredCustomers.value.every(customer => selectedCustomers.value.includes(customer.id))
})

const isCustomerSelected = (customerId) => {
  return selectedCustomers.value.includes(customerId)
}

// Methods
const selectUser = (user) => {
  selectedUser.value = user
  userSearch.value = `${user.name} (${user.email})`
  showUserDropdown.value = false
}

const hideUserDropdown = () => {
  setTimeout(() => {
    showUserDropdown.value = false
  }, 200)
}

const toggleCustomerSelection = (customerId) => {
  const index = selectedCustomers.value.indexOf(customerId)
  if (index > -1) {
    selectedCustomers.value.splice(index, 1)
  } else {
    selectedCustomers.value.push(customerId)
  }
}

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedCustomers.value = []
  } else {
    selectedCustomers.value = filteredCustomers.value.map(customer => customer.id)
  }
}

const assignSelectedCustomers = async () => {
  if (!selectedUser.value || selectedCustomers.value.length === 0) {
    return
  }

  try {
    const api = useApi()

    // Update each selected customer
    const updatePromises = selectedCustomers.value.map(customerId =>
      api(`/customers/${customerId}`, {
        method: 'PATCH',
        body: {
          relevantUser: selectedUser.value.id
        }
      })
    )

    await Promise.all(updatePromises)

    // Update local state - update relevantUser for assigned customers
    selectedCustomers.value.forEach(customerId => {
      const customerIndex = customersData.value.findIndex(c => c.id === customerId)
      if (customerIndex !== -1) {
        customersData.value[customerIndex].relevantUser = selectedUser.value
      }
    })

    // Reset selections
    selectedCustomers.value = []
    selectedUser.value = null
    userSearch.value = ''

    console.log('Customers assigned successfully')
  } catch (error) {
    console.error('Error assigning customers:', error)
  }
}

// Row-level assignment methods
const initializeRowAssignment = (customerId) => {
  if (!rowAssignments.value[customerId]) {
    rowAssignments.value[customerId] = {
      selectedGroupId: '',
      selectedUserId: ''
    }
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
      console.log('Group users loaded for group', groupId, ':', response)
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

    // Update customer in local state with the new relevantUser
    const customerIndex = customersData.value.findIndex(c => c.id === customer.id)
    if (customerIndex !== -1) {
      const selectedUserObj = users.value.find(u => u.id === userId)
      customersData.value[customerIndex].relevantUser = selectedUserObj
    }

    // Clear row assignment
    delete rowAssignments.value[customer.id]

    console.log('Customer assigned successfully')
  } catch (error) {
    console.error('Error assigning customer:', error)
  }
}

const resetFilters = () => {
  columnFilters.value = {
    name: '',
    email: '',
    phone: '',
    source: '',
    createdAt: ''
  }
}

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    customersStore.fetchCustomers(page)
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

      // First remove from local state for immediate feedback
      const customerId = customerToDelete.value.id
      customersData.value = customersData.value.filter(
        c => c.id !== customerId
      )

      // Then sync with API in background
      await api(`/customers/${customerId}`, {
        method: 'DELETE'
      })

      console.log('Customer deleted successfully')
    } catch (error) {
      console.error('Error deleting customer (using demo mode):', error)
      // Customer is already removed from local state, so no need to revert
    }
  }
  showDeleteModal.value = false
  customerToDelete.value = null
}

// Handle customer creation
const handleCustomerCreated = (customer) => {
  console.log('New customer created:', customer)
  // Add to beginning of customers list for immediate visibility
  const newCustomer = {
    ...customer,
    name: `${customer.name || ''} ${customer.surname || ''}`.trim() || 'İsimsiz',
    status: customer.status || 'new',
    source: customer.source || '-',
    isActive: customer.isActive !== undefined ? customer.isActive : true
  }
  customersData.value.unshift(newCustomer)

  // Initialize row assignment for new customer
  initializeRowAssignment(newCustomer.id)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('tr-TR')
}

const getWaitingTime = (dateString) => {
  if (!dateString) return '-'

  const now = new Date()
  const createdDate = new Date(dateString)
  const diffMs = now - createdDate

  // Convert to different units
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  if (diffYears > 0) {
    return `${diffYears} yıl`
  } else if (diffMonths > 0) {
    return `${diffMonths} ay`
  } else if (diffDays > 0) {
    return `${diffDays} gün`
  } else if (diffHours > 0) {
    return `${diffHours} saat`
  } else if (diffMinutes > 0) {
    return `${diffMinutes} dakika`
  } else {
    return 'Az önce'
  }
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

    // Load users
    try {
      const usersResponse = await api('/users')
      console.log('Users loaded:', usersResponse)
      if (Array.isArray(usersResponse)) {
        users.value = usersResponse
        // Create users map
        usersResponse.forEach(user => {
          usersMap.value[user.id] = user
        })
      }
    } catch (usersError) {
      console.error('Failed to load users:', usersError)
    }

    // Load user groups
    try {
      const groupsResponse = await api('/user-group')
      console.log('User groups loaded:', groupsResponse)
      if (Array.isArray(groupsResponse)) {
        userGroups.value = groupsResponse
      } else if (groupsResponse?.data && Array.isArray(groupsResponse.data)) {
        userGroups.value = groupsResponse.data
      } else if (groupsResponse) {
        // If it's an object with a groups property or similar
        userGroups.value = groupsResponse.groups || groupsResponse.userGroups || []
      }
      console.log('User groups after processing:', userGroups.value)
    } catch (groupsError) {
      console.error('Failed to load user groups:', groupsError)
    }

    // Load statuses first
    try {
      const statusResponse = await api('/statuses')
      console.log('Statuses loaded:', statusResponse)

      if (Array.isArray(statusResponse)) {
        // Create status map for quick lookup
        statusResponse.forEach(status => {
          statusMap.value[status.id] = status
        })

        // Filter to show only statuses with is_first flag
        statusOptions.value = statusResponse
          .filter(status => status.isActive !== false && status.isFirst === true)
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
    console.log('Applying role-based filters:', filters)
    const response = await api('/customers', { query: filters })

    console.log('Customers loaded:', response)
    if (Array.isArray(response)) {
      // Filter customers to only show those with is_new status
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
          user: usersMap.value[userId] || customer.user,
          relevantUser: usersMap.value[relevantUserId] || customer.relevantUser
        }
      })

      // Filter to only include customers with status that has is_first flag and access permission
      // Tab filtering will handle whether relevantUser exists or not
      customersData.value = allCustomers.filter(customer => {
        const status = statusMap.value[customer.status]
        const isFirstStatus = status?.isFirst === true
        const hasAccess = canAccessCustomer(customer)
        return isFirstStatus && hasAccess
      })

      // Initialize row assignments for each customer
      customersData.value.forEach(customer => {
        initializeRowAssignment(customer.id)
      })
    } else {
      customersData.value = response.data || []
      // Initialize row assignments for each customer
      customersData.value.forEach(customer => {
        initializeRowAssignment(customer.id)
      })
    }
  } catch (error) {
    console.error('Failed to load data:', error)
  } finally {
    loading.value = false
  }
})

// Watch tab changes and reset filters
watch(activeTab, () => {
  resetFilters()
})

// Page head
useHead({
  title: 'Havuz Verileri - Valdori CRM'
})
</script>
