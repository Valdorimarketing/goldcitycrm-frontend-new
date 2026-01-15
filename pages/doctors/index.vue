<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg shadow-emerald-500/25">
            <UserGroupIcon class="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ t('doctors.title', 'Doktorlar') }}
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {{ t('doctors.subtitle', 'Tüm doktorları buradan yönetebilirsiniz.') }}
            </p>
          </div>
        </div>

        <div class="flex gap-2">
          <button @click="loadDoctors(pagination.page)"
            class="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-sm font-medium">
            <ArrowPathIcon class="h-5 w-5" :class="{ 'animate-spin': loading }" />
            {{ t('dashboard.refresh', 'Yenile') }}
          </button>
          
          <button @click="showCreateModal = true"
            class="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all text-sm font-medium shadow-lg shadow-emerald-500/25">
            <PlusIcon class="h-5 w-5" />
            {{ t('doctors.actions.new_doctor', 'Yeni Doktor') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <!-- Search -->
        <div>
          <label for="search" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {{ t('doctors.filters.search', 'Ara') }}
          </label>
          <div class="relative">
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input id="search" v-model="searchTerm" type="text"
              :placeholder="t('doctors.filters.search_placeholder', 'Doktor adı...')"
              class="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all" />
          </div>
        </div>

        <!-- Branch Filter -->
        <div>
          <label for="branchFilter" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {{ t('doctors.filters.branch', 'Branş') }}
          </label>
          <select id="branchFilter" v-model="selectedBranchId"
            class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all">
            <option :value="null">{{ t('doctors.filters.all_branches', 'Tüm Branşlar') }}</option>
            <option v-for="branch in branches" :key="branch.id" :value="branch.id">
              {{ getBranchName(branch) }}
            </option>
          </select>
        </div>

        <!-- Sort By -->
        <div>
          <label for="sortBy" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {{ t('doctors.filters.sort_by', 'Sırala') }}
          </label>
          <select id="sortBy" v-model="sortBy"
            class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all">
            <option value="name">{{ t('doctors.filters.sort_name', 'İsim (A-Z)') }}</option>
            <option value="createdAt">{{ t('doctors.filters.sort_newest', 'En Yeni') }}</option>
            <option value="updatedAt">{{ t('doctors.filters.sort_updated', 'Son Güncellenen') }}</option>
          </select>
        </div>

        <!-- Sort Order -->
        <div>
          <label for="sortOrder" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {{ t('doctors.filters.order', 'Sıralama') }}
          </label>
          <select id="sortOrder" v-model="sortOrder"
            class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all">
            <option value="ASC">{{ t('doctors.filters.ascending', 'Artan') }}</option>
            <option value="DESC">{{ t('doctors.filters.descending', 'Azalan') }}</option>
          </select>
        </div>

        <!-- Limit -->
        <div>
          <label for="limit" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {{ t('doctors.filters.per_page', 'Sayfa Başı') }}
          </label>
          <select id="limit" v-model="limit"
            class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all">
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </div>
      </div>

      <!-- Clear Filters Button -->
      <div class="mt-4 flex justify-end">
        <button @click="resetFilters"
          class="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all text-sm">
          <FunnelIcon class="h-4 w-4" />
          {{ t('doctors.filters.clear', 'Filtreleri Temizle') }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-16">
      <div class="relative">
        <div class="w-14 h-14 rounded-full border-4 border-emerald-100 dark:border-emerald-900"></div>
        <div
          class="absolute top-0 left-0 w-14 h-14 rounded-full border-4 border-transparent border-t-emerald-600 animate-spin">
        </div>
      </div>
      <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">Yükleniyor...</p>
    </div>

    <!-- Doctors Table -->
    <div v-else
      class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ t('doctors.table.name', 'Doktor Adı') }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ t('doctors.table.main_branch', 'Ana Branş') }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ t('doctors.table.branches', 'İlişkili Branşlar') }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ t('doctors.table.hospitals', 'İlişkili Hastaneler') }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ t('doctors.table.created_at', 'Eklenme Tarihi') }}
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ t('doctors.table.actions', 'İşlemler') }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="doctor in allDoctors" :key="doctor.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <!-- Doctor Name -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm">
                    <UserIcon class="h-5 w-5 text-white" />
                  </div>
                  <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {{ doctor.name || '-' }}
                  </div>
                </div>
              </td>

              <!-- Main Branch -->
              <td class="px-6 py-4">
                <span v-if="doctor.branch"
                  class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                  {{ getBranchName(doctor.branch) }}
                </span>
                <span v-else class="text-sm text-gray-400">-</span>
              </td>

              <!-- Related Branches -->
              <td class="px-6 py-4">
                <div class="text-sm text-gray-600 dark:text-gray-300 max-w-xs">
                  <span v-if="doctor.doctor2Branches && doctor.doctor2Branches.length > 0" class="line-clamp-2">
                    {{ getRelatedBranchNames(doctor.doctor2Branches) }}
                  </span>
                  <span v-else class="text-gray-400">-</span>
                </div>
              </td>

              <!-- Related Hospitals -->
              <td class="px-6 py-4">
                <div class="text-sm text-gray-600 dark:text-gray-300 max-w-xs">
                  <span v-if="doctor.doctor2Hospitals && doctor.doctor2Hospitals.length > 0" class="line-clamp-2">
                    {{ doctor.doctor2Hospitals.map(d2h => d2h.hospital.name).join(', ') }}
                  </span>
                  <span v-else class="text-gray-400">-</span>
                </div>
              </td>

              <!-- Created At -->
              <td class="px-6 py-4">
                <div class="text-sm text-gray-600 dark:text-gray-300">
                  {{ formatDate(doctor.createdAt) }}
                </div>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4">
                <div class="flex items-center justify-center gap-2">
                  <button @click="editDoctor(doctor)"
                    class="p-1.5 rounded-lg text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
                    :title="t('doctors.actions.edit', 'Düzenle')">
                    <PencilIcon class="h-4 w-4" />
                  </button>
                  <button @click="confirmDelete(doctor)"
                    class="p-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    :title="t('doctors.actions.delete', 'Sil')">
                    <TrashIcon class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="allDoctors.length === 0">
              <td colspan="6" class="px-6 py-16 text-center">
                <div class="flex flex-col items-center">
                  <div class="h-16 w-16 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                    <UserGroupIcon class="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {{ t('doctors.empty.title', 'Doktor bulunamadı') }}
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                    {{ hasActiveFilters ? t('doctors.empty.message_search', 'Arama kriterlerinize uygun doktor bulunamadı.') :
                      t('doctors.empty.message_empty', 'Henüz doktor eklenmemiş.') }}
                  </p>
                  <button v-if="!hasActiveFilters" @click="showCreateModal = true"
                    class="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all text-sm font-medium">
                    <PlusIcon class="h-4 w-4" />
                    {{ t('doctors.empty.add_first', 'İlk doktoru ekle') }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ tp('doctors.pagination.results', {
              start: ((pagination.page - 1) * pagination.limit) + 1,
              end: Math.min(pagination.page * pagination.limit, pagination.total),
              total: pagination.total
            }, '{start} - {end} arası, toplam {total} sonuç') }}
          </p>

          <div class="flex items-center gap-2">
            <button :disabled="pagination.page === 1" @click="changePage(pagination.page - 1)"
              class="p-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              <ChevronLeftIcon class="h-5 w-5" />
            </button>

            <div class="flex items-center gap-1">
              <button v-for="page in visiblePages" :key="page" @click="changePage(page)" :class="[
                'min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-all',
                pagination.page === page
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              ]">
                {{ page }}
              </button>
            </div>

            <button :disabled="pagination.page >= pagination.totalPages" @click="changePage(pagination.page + 1)"
              class="p-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              <ChevronRightIcon class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <Transition enter-active-class="transition-all duration-300" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition-all duration-200" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="showDeleteModal" class="fixed inset-0 z-50 overflow-y-auto">
          <div class="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="showDeleteModal = false"></div>

            <Transition enter-active-class="transition-all duration-300" enter-from-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100" leave-active-class="transition-all duration-200"
              leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
              <div v-if="showDeleteModal"
                class="inline-block transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 text-left align-bottom shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                <div class="p-6 text-center">
                  <div
                    class="mx-auto w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                    <ExclamationTriangleIcon class="h-7 w-7 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {{ t('doctors.delete_modal.title', 'Doktoru Sil') }}
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ tp('doctors.delete_modal.message', { name: doctorToDelete?.name }, '{name} adlı doktoru silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.') }}
                  </p>
                </div>
                <div class="flex gap-3 px-6 pb-6">
                  <button @click="showDeleteModal = false"
                    class="flex-1 py-2.5 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                    {{ t('doctors.delete_modal.cancel', 'İptal') }}
                  </button>
                  <button @click="handleDelete"
                    class="flex-1 py-2.5 px-4 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all">
                    {{ t('doctors.delete_modal.confirm', 'Sil') }}
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </Transition>
    </Teleport>

    <DoctorFormModal :show="showFormModal" :doctor="selectedDoctor" @close="closeFormModal" @saved="handleSaved" />
  </div>
</template>

<script setup>
import {
  PlusIcon,
  UserGroupIcon,
  UserIcon,
  ExclamationTriangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
  FunnelIcon
} from '@heroicons/vue/24/outline'
import { watchDebounced } from '@vueuse/core'
import { useLanguage } from '~/composables/useLanguage'

const { t, tp, currentLanguage } = useLanguage()

const { allDoctors, loading, meta, fetchDoctors, fetchDoctor, deleteDoctor } = useDoctors()
const { branches, fetchBranches } = useBranches()

// Filters
const searchTerm = ref('')
const selectedBranchId = ref(null)
const sortBy = ref('createdAt')
const sortOrder = ref('DESC')
const limit = ref(20)

// Pagination
const pagination = computed(() => ({
  page: meta.value.page,
  limit: meta.value.limit,
  total: meta.value.total,
  totalPages: Math.ceil(meta.value.total / meta.value.limit)
}))

// Modals
const showDeleteModal = ref(false)
const doctorToDelete = ref(null)
const showCreateModal = ref(false)
const showFormModal = ref(false)
const selectedDoctor = ref(null)

// Check if any filters are active
const hasActiveFilters = computed(() => {
  return searchTerm.value || selectedBranchId.value !== null
})

// Helper function - Get branch name by current language
const getBranchName = (branch) => {
  if (!branch) return '-'
  
  if (branch.translations && branch.translations.length > 0) {
    const currentTrans = branch.translations.find(
      t => t.languageId === currentLanguage.value.id
    )
    
    if (currentTrans && currentTrans.name) {
      return currentTrans.name
    }
    
    const firstTrans = branch.translations[0]
    if (firstTrans && firstTrans.name) {
      return firstTrans.name
    }
  }
  
  return branch.code || '-'
}

// Helper function - Get related branch names
const getRelatedBranchNames = (doctor2Branches) => {
  if (!doctor2Branches || doctor2Branches.length === 0) return '-'
  
  const names = doctor2Branches
    .map(d2b => {
      if (!d2b.branch) return null
      
      if (!d2b.branch.translations || d2b.branch.translations.length === 0) {
        return d2b.branch.code
      }
      
      const currentTrans = d2b.branch.translations.find(
        t => t.languageId === currentLanguage.value.id
      )
      
      if (currentTrans && currentTrans.name) {
        return currentTrans.name
      }
      
      const firstTrans = d2b.branch.translations[0]
      if (firstTrans && firstTrans.name) {
        return firstTrans.name
      }
      
      return d2b.branch.code
    })
    .filter(name => name !== null)
  
  return names.length > 0 ? names.join(', ') : '-'
}

// Computed properties
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
const loadDoctors = async (page = 1) => {
  const params = {
    page,
    limit: limit.value,
    search: searchTerm.value || undefined,
    branchId: selectedBranchId.value || undefined,
    sortBy: sortBy.value,
    sortOrder: sortOrder.value
  }
  
  await fetchDoctors(params)
}

const resetFilters = () => {
  searchTerm.value = ''
  selectedBranchId.value = null
  sortBy.value = 'createdAt'
  sortOrder.value = 'DESC'
  limit.value = 20
  loadDoctors(1)
}

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    loadDoctors(page)
  }
}

const confirmDelete = (doctor) => {
  doctorToDelete.value = doctor
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (doctorToDelete.value) {
    try {
      await deleteDoctor(doctorToDelete.value.id)
      await loadDoctors(pagination.value.page)
      useToast().showSuccess(t('doctors.toast.deleted', 'Doktor başarıyla silindi'))
    } catch (error) {
      useToast().showError(t('doctors.toast.delete_error', 'Doktor silinirken bir hata oluştu'))
    }
  }
  showDeleteModal.value = false
  doctorToDelete.value = null
}

const editDoctor = async (doctor) => {
  try {
    const fullDoctorData = await fetchDoctor(doctor.id)
    selectedDoctor.value = fullDoctorData
    showFormModal.value = true
  } catch (error) {
    useToast().showError(t('doctors.toast.load_error', 'Doktor bilgileri yüklenirken hata oluştu'))
  }
}

const closeFormModal = () => {
  showFormModal.value = false
  showCreateModal.value = false
  selectedDoctor.value = null
}

const handleSaved = async () => {
  await loadDoctors(pagination.value.page)
  closeFormModal()
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('tr-TR')
}

// Watch for filter changes with debounce
watchDebounced(
  searchTerm,
  () => {
    loadDoctors(1)
  },
  { debounce: 500 }
)

// Watch for other filters
watch([selectedBranchId, sortBy, sortOrder, limit], () => {
  loadDoctors(1)
})

// Watch for create modal
watch(showCreateModal, (newVal) => {
  if (newVal) {
    selectedDoctor.value = null
    showFormModal.value = true
  }
})

// Initialize data
onMounted(async () => {
  await fetchBranches()
  await loadDoctors()
})

// Page head
useHead({
  title: 'Doktorlar - Valdori CRM'
})
</script>