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
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div>
          <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ara
          </label>
          <input id="search" v-model="searchTerm" type="text" class="form-input"
            placeholder="İsim, email veya telefon ile ara..." />
        </div>
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Durum
          </label>
          <select id="status" v-model="statusFilter" class="form-input">
            <option value="">Tüm Durumlar</option>
            <option v-for="status in statusOptions" :key="status.value" :value="status.value">
              {{ status.label }}
            </option>
          </select>
        </div>
        <div v-if="isAdmin">
          <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Atanan Kullanıcı
          </label>
          <select id="status" v-model="relevantUserFilter" class="form-input">
            <option value="">Seç</option>
            <option v-for="item in relevantUserList" :key="item.value" :value="item.value">
              {{ item.name }}
            </option>
          </select>
        </div>
        <div>
          <label for="dateFilter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tarih Filtresi
          </label>
          <select id="dateFilter" v-model="dateFilter" @change="handleDateFilterChange" class="form-input">
            <option value="today">Bugün ve Öncesi</option>
            <option value="today-only">Sadece Bugün</option>
            <option value="tomorrow">Yarın</option>
            <option value="week">Bu Hafta</option>
            <option value="month">Bu Ay</option>
            <option value="overdue">Gecikmiş</option>
            <option value="all">Tümü</option>
            <option value="custom">Özel Tarih Aralığı</option>
          </select>
        </div>
      </div>
      <!-- Custom Date Range -->
      <template v-if="dateFilter === 'custom'">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-4 mt-4">
          <div>
            <label for="startDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Başlangıç Tarihi
            </label>
            <input id="startDate" v-model="customStartDate" type="date" class="form-input" />
          </div>
          <div>
            <label for="endDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bitiş Tarihi
            </label>
            <input id="endDate" v-model="customEndDate" type="date" class="form-input" />
          </div>
        </div>
      </template>

      <button @click="resetFilters" class="btn-secondary mt-3">
        Filtreleri Temizle
      </button>
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
              <th class="table-header text-gray-700 dark:text-gray-300"></th>
              <th class="table-header text-gray-700 dark:text-gray-300">İsim</th>
              <th class="table-header text-gray-700 dark:text-gray-300">E-posta</th>
              <th class="table-header text-gray-700 dark:text-gray-300"  v-if="isAdmin">Telefon</th>
              <th class="table-header text-gray-700 dark:text-gray-300">Durum</th>
              <th class="table-header text-gray-700 dark:text-gray-300">Hatırlatma Tarihi</th>
              <th class="table-header text-gray-700 dark:text-gray-300"  v-if="isAdmin">Kaynak</th>
              <th class="table-header text-gray-700 dark:text-gray-300" v-if="isAdmin">Atanan</th> 
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
              <td class="table-cell"  v-if="isAdmin">
                <div class="text-sm text-gray-900 dark:text-gray-100">{{ customer.phone || '-' }}</div>
              </td>
              <td class="table-cell">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getStatusClass(customer.status)">
                  {{ getStatusText(customer.status) }}
                </span>
              </td>
              <td class="table-cell">
                <div class="text-sm text-gray-900 dark:text-gray-100">
                  {{ formatDateTime(customer.remindingDate) }}
                </div>
              </td>
              <td class="table-cell">
                <div class="text-sm text-gray-900 dark:text-gray-100" v-if="isAdmin">{{ customer.source || '-' }}</div>
              </td> 
              <td class="table-cell"  v-if="isAdmin">
                <div class="text-sm text-gray-900 dark:text-gray-100">{{ customer.relevantUser?.name || '-' }}</div>
              </td>
         
            </tr>

            <!-- Empty State -->
            <tr v-if="customersData.length === 0">
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
  UsersIcon,
  EyeIcon,
  ClockIcon,
  DocumentTextIcon,
  ShoppingBagIcon,
  PencilIcon,
  FolderIcon,
  EllipsisHorizontalIcon,
  XCircleIcon
} from '@heroicons/vue/24/outline'

definePageMeta({})

const { isAdmin } = usePermissions()

const loading = ref(true)
const customersData = ref([])

// 🔹 Filtreler
const searchTerm = ref('')
const statusFilter = ref('')
const relevantUserFilter = ref('')
const dateFilter = ref('all')
const customStartDate = ref('')
const customEndDate = ref('')

// 🔹 Yardımcı veriler
const statusOptions = ref([])
const statusMap = ref({})
const remindableStatusIds = ref([])
const usersMap = ref({})
const relevantUserList = ref([])

// 🔹 Modallar
const showHistoryModal = ref(false)
const showNotesModal = ref(false)
const showDoctorModal = ref(false)
const showServicesModal = ref(false)
const showFilesModal = ref(false)
const selectedCustomer = ref(null)
const showStates = ref({ activeId: null })

const toggleShow = (id) => {
  if (showStates.value.activeId === id) {
    // Aynı id'ye tıklandıysa: kapat
    showStates.value.activeId = null
  } else {
    // Farklı id'ye tıklandıysa: mevcut açık olanı kapat, yenisini aç
    showStates.value.activeId = id
  }
}

// =====================================================
// 🧩 ANA METOD: Müşteri, kullanıcı, statü ve filtreleri yükle
// =====================================================

 
const loadCustomers = async () => {
  loading.value = true
  try {
    const api = useApi()
    const { getCustomerFilters, canAccessCustomer } = usePermissions()

    // ========================
    // 🧠 Kullanıcıları yükle (sadece ilk seferinde)
    // ========================
    if (Object.keys(usersMap.value).length === 0) {
      const usersResponse = await api('/users')
      if (Array.isArray(usersResponse)) {
        relevantUserList.value = usersResponse.map(u => ({ value: u.id, name: u.name }))
        usersResponse.forEach(u => (usersMap.value[u.id] = u))
      }
    }

    // ========================
    // 🧠 Statüleri yükle (sadece ilk seferinde)
    // ========================
    if (statusOptions.value.length === 0) {
      const statusResponse = await api('/statuses')
      if (Array.isArray(statusResponse)) {
        statusResponse.forEach(status => {
          statusMap.value[status.id] = status
          if (status.is_remindable || status.isRemindable) {
            remindableStatusIds.value.push(status.id)
          }
        })
        statusOptions.value = statusResponse
          .filter(s => (s.is_remindable || s.isRemindable) && s.isActive !== false)
          .map(s => ({ value: s.id, label: s.name }))
      }
    }

    // ========================
    // 🔸 Backend'e gönderilecek filtreler
    // ========================
    const baseFilters = getCustomerFilters()
    
    // ✅ KRİTİK: Eğer status seçilmemişse (Tüm Durumlar), remindable statusları gönder
    const statusToSend = statusFilter.value 
      ? statusFilter.value 
      : remindableStatusIds.value.join(',')
    
    const query = {
      ...baseFilters,
      search: searchTerm.value || undefined,
      status: statusToSend, // ✅ Her zaman remindable statuslar
      relevantUser: relevantUserFilter.value || undefined,
      // ✅ Sadece 'all' değilse tarih parametrelerini gönder
      ...(dateFilter.value !== 'all' && {
        dateFilter: dateFilter.value,
        startDate: customStartDate.value || undefined,
        endDate: customEndDate.value || undefined
      })
    }

    // ========================
    // 🧠 Müşterileri backend'den çek
    // ========================
    const response = await api('/customers', { query })
    let customers = Array.isArray(response) ? response : response.data || []

    // ========================
    // 🔄 Müşteri verilerini normalize et
    // ========================
    customers = customers.map(customer => {
      const relevantUserId = customer.relevantUserId || customer.relevant_user_id || customer.relevantUser

      return {
        ...customer,
        name: `${customer.name || ''} ${customer.surname || ''}`.trim() || 'İsimsiz',
        status: customer.statusId || customer.status,
        source: customer.source || '-',
        isActive: customer.isActive ?? true,
        remindingDate: customer.remindingDate || customer.reminding_date || null,
        relevantUser: usersMap.value[relevantUserId] || customer.relevantUser
      }
    })

    // ✅ Artık frontend'de filtrelemeye gerek yok!
    // Backend zaten sadece remindable statusları döndürüyor

    // ========================
    // 🔹 Erişim kontrolü
    // ========================
    customers = customers.filter(c => canAccessCustomer(c))

    customersData.value = customers

  } catch (error) {
    console.error('loadCustomers error:', error)
    customersData.value = []
  } finally {
    loading.value = false
  }
}

// =====================================================
// 🧠 Debounce ile filtreleri dinle ve API çağrısı yap
// =====================================================
watchDebounced(
  [searchTerm, statusFilter, relevantUserFilter, dateFilter, customStartDate, customEndDate],
  () => {
    loadCustomers()
  },
  { debounce: 600 }
)

// =====================================================
// 🏁 İlk sayfa yüklenirken veriyi çek
// =====================================================
onMounted(() => {
  loadCustomers()
})

// =====================================================
// 🎨 Yardımcı metodlar
// =====================================================
const resetFilters = () => {
  searchTerm.value = ''
  statusFilter.value = ''
  relevantUserFilter.value = ''
  dateFilter.value = 'all'
  customStartDate.value = ''
  customEndDate.value = ''
  loadCustomers()
}

const handleDateFilterChange = () => {
  if (dateFilter.value !== 'custom') {
    customStartDate.value = ''
    customEndDate.value = ''
  }
  loadCustomers()
}

const showHistory = c => { selectedCustomer.value = c; showHistoryModal.value = true }
const showNotes = c => { selectedCustomer.value = c; showNotesModal.value = true }
const showDoctorAssignment = c => { selectedCustomer.value = c; showDoctorModal.value = true }
const showServices = c => { selectedCustomer.value = c; showServicesModal.value = true }
const showFiles = c => { selectedCustomer.value = c; showFilesModal.value = true }

const formatDateTime = dateString => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('tr-TR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

const getStatusClass = statusId => {
  const status = statusMap.value[statusId]
  if (!status) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  if (status.isSale) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
  if (status.isClosed) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
  if (status.isFirst) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
  return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

const getStatusText = statusId => statusMap.value[statusId]?.name || 'Bilinmiyor'

useHead({ title: 'Dinamik Arama - Valdori CRM' })
</script>
