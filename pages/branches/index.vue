<template>
  <div>
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ t('branches.title', 'Branşlar') }}
        </h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-gray-400">
          {{ t('branches.subtitle', 'Tüm branşları buradan yönetebilirsiniz.') }}
        </p>
      </div>
      <div class="mt-4 sm:mt-0 flex items-center gap-3">
       
        <button
          @click="initializeData()"
          class="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-700 hover:to-purple-700 transition-all"
        >
          <ArrowPathIcon class="-ml-0.5 mr-1.5 h-5 w-5" />
          {{ t('dashboard.refresh', 'Yenile') }}
        </button>

        <button
          @click="showCreateModal = true"
          class="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-700 hover:to-purple-700 transition-all"
        >
          <PlusIcon class="-ml-0.5 mr-1.5 h-5 w-5" />
          {{ t('branches.new_branch', 'Yeni Branş') }}
        </button>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('branches.search', 'Ara') }}
          </label>
          <div class="relative">
            <input
              id="search"
              v-model="searchTerm"
              type="text"
              class="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              :placeholder="t('branches.search_placeholder', 'İsim veya kod ile ara...')"
            />
            <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>
        <div>
          <label for="hospital" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('branches.hospital', 'Hastane') }}
          </label>
          <select
            id="hospital"
            v-model="hospitalFilter"
            class="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          >
            <option :value="undefined">{{ t('branches.all_hospitals', 'Tüm Hastaneler') }}</option>
            <option v-for="hospital in hospitals" :key="hospital.id" :value="hospital.id">
              {{ hospital.name }}
            </option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="resetFilters"
            class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all text-sm"
          >
            {{ t('branches.clear_filters', 'Filtreleri Temizle') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>

    <!-- Branches Table -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {{ t('branches.branch_name', 'Branş Adı') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {{ t('branches.code', 'Kod') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {{ t('branches.hospitals', 'Hastaneler') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {{ t('branches.created_at', 'Eklenme Tarihi') }}
              </th>
              <th class="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {{ t('branches.actions', 'İşlemler') }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="branch in branches" :key="branch.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <BuildingOfficeIcon class="h-5 w-5 text-white" />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {{ branch.name || '-' }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300">
                  {{ branch.code || '-' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div v-if="branch.branch2Hospitals && branch.branch2Hospitals.length > 0" class="flex flex-wrap gap-1">
                  <span
                    v-for="b2h in branch.branch2Hospitals.slice(0, 2)"
                    :key="b2h.id"
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    {{ b2h.hospital?.name || '-' }}
                  </span>
                  <span
                    v-if="branch.branch2Hospitals.length > 2"
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    +{{ branch.branch2Hospitals.length - 2 }}
                  </span>
                </div>
                <span v-else class="text-sm text-gray-500 dark:text-gray-400">-</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-gray-100">
                  {{ formatDate(branch.createdAt) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end gap-2">
                  <button
                    @click="editBranch(branch)"
                    class="inline-flex items-center px-3 py-1.5 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
                  >
                    <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    {{ t('branches.edit', 'Düzenle') }}
                  </button>
                  <button
                    @click="confirmDelete(branch)"
                    class="inline-flex items-center px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                    {{ t('branches.delete', 'Sil') }}
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="branches.length === 0">
              <td colspan="5" class="text-center py-12">
                <BuildingOfficeIcon class="mx-auto h-12 w-12 text-gray-400" />
                <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  {{ t('branches.no_branches', 'Branş bulunamadı') }}
                </h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {{ searchTerm || hospitalFilter ? t('branches.no_results', 'Arama kriterlerinize uygun branş bulunamadı.') : t('branches.no_branches_yet', 'Henüz branş eklenmemiş.') }}
                </p>
                <div class="mt-6">
                  <button
                    @click="showCreateModal = true"
                    class="inline-flex items-center rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-700 hover:to-purple-700 transition-all"
                  >
                    <PlusIcon class="-ml-0.5 mr-1.5 h-5 w-5" />
                    {{ t('branches.add_first', 'İlk branşı ekle') }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3 sm:px-6">
        <div class="flex flex-1 justify-between sm:hidden">
          <button
            :disabled="pagination.page === 1"
            @click="changePage(pagination.page - 1)"
            class="relative inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            {{ t('branches.previous', 'Önceki') }}
          </button>
          <button
            :disabled="pagination.page === pagination.totalPages"
            @click="changePage(pagination.page + 1)"
            class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            {{ t('branches.next', 'Sonraki') }}
          </button>
        </div>
        <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700 dark:text-gray-300">
              <span class="font-medium">{{ ((pagination.page - 1) * pagination.limit) + 1 }}</span>
              -
              <span class="font-medium">{{ Math.min(pagination.page * pagination.limit, pagination.total) }}</span>
              {{ t('branches.of', 'arası, toplam') }}
              <span class="font-medium">{{ pagination.total }}</span>
              {{ t('branches.results', 'sonuç') }}
            </p>
          </div>
          <div>
            <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm">
              <button
                :disabled="pagination.page === 1"
                @click="changePage(pagination.page - 1)"
                class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
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
                    : 'text-gray-900 dark:text-gray-300 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700',
                  'relative inline-flex items-center px-4 py-2 text-sm font-semibold'
                ]"
              >
                {{ page }}
              </button>

              <button
                :disabled="pagination.page === pagination.totalPages"
                @click="changePage(pagination.page + 1)"
                class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <ChevronRightIcon class="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <TransitionRoot as="template" :show="showDeleteModal">
      <Dialog as="div" class="relative z-50" @close="showDeleteModal = false">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div class="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div class="sm:flex sm:items-start">
                    <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon class="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <DialogTitle as="h3" class="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                        {{ t('branches.delete_branch', 'Branşı Sil') }}
                      </DialogTitle>
                      <div class="mt-2">
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                          <strong class="text-gray-700 dark:text-gray-300">{{ branchToDelete?.name }}</strong> 
                          {{ t('branches.delete_confirm', 'adlı branşı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.') }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-3">
                  <button
                    @click="handleDelete"
                    class="inline-flex w-full justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:w-auto"
                  >
                    {{ t('branches.delete', 'Sil') }}
                  </button>
                  <button
                    @click="showDeleteModal = false"
                    class="inline-flex w-full justify-center rounded-lg bg-white dark:bg-gray-600 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 sm:w-auto"
                  >
                    {{ t('branches.cancel', 'İptal') }}
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Create/Edit Modal -->
    <BranchFormModal
      :show="showFormModal"
      :branch="selectedBranch"
      :hospitals="hospitals"
      @close="closeFormModal"
      @saved="handleSaved"
    />
  </div>
</template>

 <script setup>
import {
  PlusIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/outline'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { watchDebounced } from '@vueuse/core'
import { useLanguage } from '~/composables/useLanguage'

const { t, currentLanguageInfo } = useLanguage()
const { branches, loading, meta, fetchBranches, deleteBranch } = useBranches()
const { hospitals, fetchHospitals } = useHospitals()

// Search and filters
const searchTerm = ref('')
const hospitalFilter = ref(undefined)

// Pagination
const pagination = computed(() => ({
  page: meta.value.page,
  limit: meta.value.limit,
  total: meta.value.total,
  totalPages: Math.ceil(meta.value.total / meta.value.limit)
}))

// Modals
const showDeleteModal = ref(false)
const branchToDelete = ref(null)
const showCreateModal = ref(false)
const showFormModal = ref(false)
const selectedBranch = ref(null)

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

const loadBranches = async (page = 1) => {
  if (!currentLanguageInfo.value?.id) {
    console.warn('Current language not loaded yet')
    return
  }
  
  await fetchBranches({
    page,
    search: searchTerm.value || undefined,
    hospitalId: hospitalFilter.value,
    languageId: currentLanguageInfo.value.id
  })
}

const resetFilters = () => {
  searchTerm.value = ''
  hospitalFilter.value = undefined
}

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    loadBranches(page)
  }
}

const confirmDelete = (branch) => {
  branchToDelete.value = branch
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (branchToDelete.value) {
    try {
      await deleteBranch(branchToDelete.value.id)
      await loadBranches(pagination.value.page)
      useToast().showSuccess(t('branches.delete_success', 'Branş başarıyla silindi'))
    } catch (error) {
      useToast().showError(t('branches.delete_error', 'Branş silinirken bir hata oluştu'))
    }
  }
  showDeleteModal.value = false
  branchToDelete.value = null
}

const editBranch = (branch) => {
  selectedBranch.value = branch
  showFormModal.value = true
}

const closeFormModal = () => {
  showFormModal.value = false
  showCreateModal.value = false
  selectedBranch.value = null
}

const handleSaved = async () => {
  await loadBranches(pagination.value.page)
  closeFormModal()
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('tr-TR')
}

// Watch for search term changes with debounce
watchDebounced(
  [searchTerm, hospitalFilter],
  () => {
    loadBranches(1) // Reset to page 1 when searching
  },
  { debounce: 500 }
)

const initializeData = async () => {
  await fetchHospitals()
  await loadBranches()
}

// Watch for language changes
watch(() => currentLanguageInfo.value?.id, (newLanguageId, oldLanguageId) => {
  // Only reload if language actually changed and is not initial load
  if (newLanguageId && oldLanguageId && newLanguageId !== oldLanguageId) {
    loadBranches(1) // Reset to page 1 when language changes
  }
})

// Watch for create modal
watch(showCreateModal, (newVal) => {
  if (newVal) {
    selectedBranch.value = null
    showFormModal.value = true
  }
})

// Initialize data
onMounted(async () => { 
  await initializeData()
})

// Page head
useHead({
  title: t('branches.page_title', 'Branşlar - Valdori CRM')
})
</script>