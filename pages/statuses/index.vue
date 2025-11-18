<template>
  <div class="container mx-auto px-4 py-6">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
            Durum Yönetimi
          </h1>
          <button
            @click="openCreateModal"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon class="h-5 w-5 mr-2" />
            Yeni Durum
          </button>
        </div>
      </div>

      <div class="p-6">
        <div class="mb-4">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Durum ara..."
            class="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div v-if="loading && statuses.length === 0" class="text-center py-12">
          <div class="inline-flex items-center">
            <svg class="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="ml-2 text-gray-600 dark:text-gray-400">Yükleniyor...</span>
          </div>
        </div>

        <div v-else-if="error" class="text-center py-12">
          <ExclamationTriangleIcon class="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p class="text-red-600 dark:text-red-400">{{ error }}</p>
          <button
            @click="fetchStatuses()"
            class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Tekrar Dene
          </button>
        </div>

        <div v-else-if="!filteredStatuses.length" class="text-center py-12">
          <div class="text-gray-500 dark:text-gray-400">
            <DocumentTextIcon class="h-12 w-12 mx-auto mb-4" />
            <p>Henüz durum eklenmemiş</p>
          </div>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Sıra
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Durum
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Açıklama
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Özellikler
                </th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">İşlemler</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="status in filteredStatuses"
                :key="status.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {{ status.order }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <StatusBadge :name="status.name" :color="status.color" />
                </td>
                <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                  {{ status.description || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <div class="flex flex-wrap gap-1">
                    <span v-if="status.is_remindable" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Hatırlatılabilir
                    </span>
                    <span v-if="status.is_first" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      İlk
                    </span>
                    <span v-if="status.is_closed" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                      Kapalı
                    </span>
                    <span v-if="status.is_sale" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      Satış
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    @click="openEditModal(status)"
                    class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
                  >
                    <PencilIcon class="h-5 w-5" />
                  </button>
                  <button
                    @click="confirmDelete(status)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <TrashIcon class="h-5 w-5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="totalPages > 1" class="mt-6 flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Önceki
            </button>
            <button
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sonraki
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                Toplam <span class="font-medium">{{ totalItems }}</span> kayıt
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  @click="changePage(currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeftIcon class="h-5 w-5" />
                </button>
                <button
                  v-for="page in displayedPages"
                  :key="page"
                  @click="changePage(page)"
                  :class="[
                    page === currentPage
                      ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                  ]"
                >
                  {{ page }}
                </button>
                <button
                  @click="changePage(currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRightIcon class="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <StatusModal
      :show="showModal"
      :status="selectedStatus"
      @close="closeModal"
      @save="handleSave"
    />

    <TransitionRoot as="template" :show="showDeleteConfirm">
      <Dialog as="div" class="relative z-50" @close="showDeleteConfirm = false">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
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
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div class="sm:flex sm:items-start">
                  <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon class="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                      Durumu Sil
                    </DialogTitle>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        <strong>{{ statusToDelete?.name }}</strong> durumunu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                      </p>
                    </div>
                  </div>
                </div>
                <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    @click="handleDelete"
                    :disabled="deleting"
                    class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {{ deleting ? 'Siliniyor...' : 'Sil' }}
                  </button>
                  <button
                    type="button"
                    @click="showDeleteConfirm = false"
                    class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 sm:mt-0 sm:w-auto"
                  >
                    İptal
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'
import StatusModal from '~/components/StatusModal.vue'
import StatusBadge from '~/components/StatusBadge.vue'
import { useStatuses, type Status } from '~/composables/useStatuses'
import { useToast } from '~/composables/useToast'

const { showSuccess, showError } = useToast()
const {
  statuses,
  loading,
  error,
  currentPage,
  totalPages,
  totalItems,
  fetchStatuses,
  createStatus,
  updateStatus,
  deleteStatus
} = useStatuses()

// Ensure statuses is reactive and has a default value
if (!statuses.value) {
  statuses.value = []
}

const searchQuery = ref('')
const showModal = ref(false)
const selectedStatus = ref<Status | null>(null)
const showDeleteConfirm = ref(false)
const statusToDelete = ref<Status | null>(null)
const deleting = ref(false)

const filteredStatuses = computed(() => {
  if (!searchQuery.value) return statuses.value
  
  const query = searchQuery.value.toLowerCase()
  return statuses.value.filter(status =>
    status.name.toLowerCase().includes(query) ||
    (status.description && status.description.toLowerCase().includes(query))
  )
}) as any

const displayedPages = computed(() => {
  const pages = []
  const maxPages = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxPages / 2))
  let end = Math.min(totalPages.value, start + maxPages - 1)
  
  if (end - start < maxPages - 1) {
    start = Math.max(1, end - maxPages + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const openCreateModal = () => {
  selectedStatus.value = null
  showModal.value = true
}

const openEditModal = (status: Status) => {
  selectedStatus.value = status
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedStatus.value = null
}

const handleSave = async (data: Partial<Status>) => {
  try {
    if (selectedStatus.value) {
      await updateStatus(selectedStatus.value.id, data)
      showSuccess('Durum başarıyla güncellendi')
    } else {
      await createStatus(data)
      showSuccess('Durum başarıyla oluşturuldu')
    }
    await fetchStatuses(currentPage.value)
    closeModal()
  } catch (err: any) {
    showError(err.message || 'Bir hata oluştu')
  }
}

const confirmDelete = (status: Status) => {
  statusToDelete.value = status
  showDeleteConfirm.value = true
}

const handleDelete = async () => {
  if (!statusToDelete.value) return
  
  deleting.value = true
  try {
    await deleteStatus(statusToDelete.value.id)
    showSuccess('Durum başarıyla silindi')
    await fetchStatuses(currentPage.value)
    showDeleteConfirm.value = false
    statusToDelete.value = null
  } catch (err: any) {
    showError(err.message || 'Durum silinirken bir hata oluştu')
  } finally {
    deleting.value = false
  }
}

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    fetchStatuses(page)
  }
}

onMounted(() => {
  fetchStatuses()
})
</script>