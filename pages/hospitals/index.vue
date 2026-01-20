<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-gradient-to-br to-rose-500 to-rose-500 rounded-2xl shadow-lg shadow-rose-500/25">
            <BuildingOffice2Icon class="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ t('hospitals.title', 'Hastaneler') }}
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {{ t('hospitals.subtitle', 'Tüm hastaneleri buradan yönetebilirsiniz.') }}
            </p>
          </div>
        </div>

        <button
          @click="showCreateModal = true"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-400 to-rose-500 text-white rounded-xl hover:from-rose-700 hover:to-rose-700 transition-all text-sm font-medium shadow-lg shadow-rose-500/25"
        >
          <PlusIcon class="h-5 w-5" />
          {{ t('hospitals.actions.new_hospital', 'Yeni Hastane') }}
        </button>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label for="search" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {{ t('hospitals.filters.search', 'Ara') }}
          </label>
          <div class="relative">
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="search"
              v-model="searchTerm"
              type="text"
              :placeholder="t('hospitals.filters.search_placeholder', 'İsim veya kod ile ara...')"
              class="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
        <div class="flex items-end">
          <button
            @click="resetFilters"
            class="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all text-sm"
          >
            {{ t('hospitals.filters.clear', 'Filtreleri Temizle') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-16">
      <div class="relative">
        <div class="w-14 h-14 rounded-full border-4 border-rose-100 dark:border-rose-900"></div>
        <div class="absolute top-0 left-0 w-14 h-14 rounded-full border-4 border-transparent border-t-rose-600 animate-spin"></div>
      </div>
      <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">Yükleniyor...</p>
    </div>

    <!-- Hospitals Table -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ t('hospitals.table.name', 'Hastane Adı') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ t('hospitals.table.code', 'Kod') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ t('hospitals.table.address', 'Adres') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ t('hospitals.table.description', 'Açıklama') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ t('hospitals.table.created_at', 'Eklenme Tarihi') }}
              </th>
              <th class="px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ t('hospitals.table.actions', 'İşlemler') }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="hospital in hospitals" :key="hospital.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="h-10 w-10 rounded-xl bg-gradient-to-br to-rose-500 to-rose-500 flex items-center justify-center shadow-sm">
                    <BuildingOffice2Icon class="h-5 w-5 text-white" />
                  </div>
                  <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {{ hospital.name || '-' }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  {{ hospital.code || '-' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">
                  {{ hospital.address || '-' }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">
                  {{ hospital.description || '-' }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-600 dark:text-gray-300">
                  {{ formatDate(hospital.createdAt) }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-center gap-2">
                  <button
                    @click="editHospital(hospital)"
                    class="p-1.5 rounded-lg text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
                    :title="t('hospitals.actions.edit', 'Düzenle')"
                  >
                    <PencilIcon class="h-4 w-4" />
                  </button>
                  <button
                    @click="confirmDelete(hospital)"
                    class="p-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    :title="t('hospitals.actions.delete', 'Sil')"
                  >
                    <TrashIcon class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="hospitals.length === 0">
              <td colspan="6" class="px-6 py-16 text-center">
                <div class="flex flex-col items-center">
                  <div class="h-16 w-16 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                    <BuildingOffice2Icon class="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {{ t('hospitals.empty.title', 'Hastane bulunamadı') }}
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                    {{ searchTerm ? t('hospitals.empty.message_search', 'Arama kriterlerinize uygun hastane bulunamadı.') : t('hospitals.empty.message_empty', 'Henüz hastane eklenmemiş.') }}
                  </p>
                  <button
                    v-if="!searchTerm"
                    @click="showCreateModal = true"
                    class="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-all text-sm font-medium"
                  >
                    <PlusIcon class="h-4 w-4" />
                    {{ t('hospitals.empty.add_first', 'İlk hastaneyi ekle') }}
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
            {{ tp('hospitals.pagination.results', { 
              start: ((pagination.page - 1) * pagination.limit) + 1,
              end: Math.min(pagination.page * pagination.limit, pagination.total),
              total: pagination.total
            }, '{start} - {end} arası, toplam {total} sonuç') }}
          </p>

          <div class="flex items-center gap-2">
            <button
              :disabled="pagination.page === 1"
              @click="changePage(pagination.page - 1)"
              class="p-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeftIcon class="h-5 w-5" />
            </button>

            <div class="flex items-center gap-1">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="changePage(page)"
                :class="[
                  'min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-all',
                  pagination.page === page
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                ]"
              >
                {{ page }}
              </button>
            </div>

            <button
              :disabled="pagination.page >= pagination.totalPages"
              @click="changePage(pagination.page + 1)"
              class="p-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRightIcon class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showDeleteModal" class="fixed inset-0 z-50 overflow-y-auto">
          <div class="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="showDeleteModal = false"></div>
            
            <Transition
              enter-active-class="transition-all duration-300"
              enter-from-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100"
              leave-active-class="transition-all duration-200"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-95"
            >
              <div v-if="showDeleteModal" class="inline-block transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 text-left align-bottom shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                <div class="p-6 text-center">
                  <div class="mx-auto w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                    <ExclamationTriangleIcon class="h-7 w-7 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {{ t('hospitals.delete_modal.title', 'Hastaneyi Sil') }}
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ tp('hospitals.delete_modal.message', { name: hospitalToDelete?.name }, '{name} adlı hastaneyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve ilişkili tüm branşlar da silinecektir.') }}
                  </p>
                </div>
                <div class="flex gap-3 px-6 pb-6">
                  <button
                    @click="showDeleteModal = false"
                    class="flex-1 py-2.5 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                  >
                    {{ t('hospitals.delete_modal.cancel', 'İptal') }}
                  </button>
                  <button
                    @click="handleDelete"
                    class="flex-1 py-2.5 px-4 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all"
                  >
                    {{ t('hospitals.delete_modal.confirm', 'Sil') }}
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Create/Edit Modal -->
    <HospitalFormModal
      :show="showFormModal"
      :hospital="selectedHospital"
      @close="closeFormModal"
      @saved="handleSaved"
    />
  </div>
</template>

<script setup>
import {
  PlusIcon,
  BuildingOffice2Icon,
  ExclamationTriangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'
import { watchDebounced } from '@vueuse/core'
import { useLanguage } from '~/composables/useLanguage'

const { t, tp } = useLanguage()

const { hospitals, loading, meta, fetchHospitals, deleteHospital } = useHospitals()

// Search and filters
const searchTerm = ref('')

// Pagination
const pagination = computed(() => ({
  page: meta.value.page,
  limit: meta.value.limit,
  total: meta.value.total,
  totalPages: Math.ceil(meta.value.total / meta.value.limit)
}))

// Modals
const showDeleteModal = ref(false)
const hospitalToDelete = ref(null)
const showCreateModal = ref(false)
const showFormModal = ref(false)
const selectedHospital = ref(null)

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
const loadHospitals = async (page = 1) => {
  await fetchHospitals({
    page,
    search: searchTerm.value || undefined
  })
}

const resetFilters = () => {
  searchTerm.value = ''
}

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    loadHospitals(page)
  }
}

const confirmDelete = (hospital) => {
  hospitalToDelete.value = hospital
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (hospitalToDelete.value) {
    try {
      await deleteHospital(hospitalToDelete.value.id)
      await loadHospitals(pagination.value.page)
      useToast().showSuccess(t('hospitals.toast.deleted', 'Hastane başarıyla silindi'))
    } catch (error) {
      useToast().showError(t('hospitals.toast.delete_error', 'Hastane silinirken bir hata oluştu'))
    }
  }
  showDeleteModal.value = false
  hospitalToDelete.value = null
}

const editHospital = (hospital) => {
  selectedHospital.value = hospital
  showFormModal.value = true
}

const closeFormModal = () => {
  showFormModal.value = false
  showCreateModal.value = false
  selectedHospital.value = null
}

const handleSaved = async () => {
  await loadHospitals(pagination.value.page)
  closeFormModal()
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('tr-TR')
}

// Watch for search term changes with debounce
watchDebounced(
  searchTerm,
  () => {
    loadHospitals(1) // Reset to page 1 when searching
  },
  { debounce: 500 }
)

// Watch for create modal
watch(showCreateModal, (newVal) => {
  if (newVal) {
    selectedHospital.value = null
    showFormModal.value = true
  }
})

// Initialize data
onMounted(async () => {
  await loadHospitals()
})

// Page head
useHead({
  title: 'Hastaneler - Valdori CRM'
})
</script>