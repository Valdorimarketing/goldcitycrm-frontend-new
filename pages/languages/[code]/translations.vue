<template>
  <div>
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-6">
      <div>
        <NuxtLink to="/languages" class="text-rose-600 hover:text-rose-500 text-sm mb-2 inline-block">
          ← Dillere Geri Dön
        </NuxtLink>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ languageName }} - Çeviriler
        </h1>
        <p class="mt-2 text-sm text-gray-700">
          Bu dile ait tüm çevirileri buradan yönetebilirsiniz.
        </p>
      </div>
      <div class="mt-4 sm:mt-0 flex gap-2">
        <button
          @click="showBulkModal = true"
          class="inline-flex items-center justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
        >
          <ArrowUpTrayIcon class="-ml-0.5 mr-1.5 h-5 w-5" />
          Toplu İçe Aktar
        </button>
        <button
          @click="showCreateModal = true"
          class="inline-flex items-center justify-center rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500"
        >
          <PlusIcon class="-ml-0.5 mr-1.5 h-5 w-5" />
          Yeni Çeviri
        </button>
      </div>
    </div>

    <!-- Search -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ara
          </label>
          <input
            id="search"
            v-model="searchQuery"
            type="text"
            class="form-input"
            placeholder="Anahtar kelime veya çeviri ile ara..."
          />
        </div>
        <div class="flex items-end justify-between">
          <button
            @click="searchQuery = ''"
            class="btn-secondary"
          >
            Aramayı Temizle
          </button>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ filteredTranslations.length }} / {{ allTranslations.length }} kayıt
          </span>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
    </div>

    <!-- Translations Table -->
    <div v-else class="card">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="table-header text-gray-700 dark:text-gray-300">Anahtar</th>
              <th class="table-header text-gray-700 dark:text-gray-300">Çeviri</th>
              <th class="table-header text-gray-700 dark:text-gray-300">Açıklama</th>
              <th class="table-header text-gray-700 dark:text-gray-300">İşlemler</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="translation in paginatedTranslations" :key="translation.id">
              <td class="table-cell">
                <code class="text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 px-2 py-1 rounded font-mono">
                  {{ translation.key }}
                </code>
              </td>
              <td class="table-cell">
                <div class="text-sm text-gray-900 dark:text-gray-100 max-w-md truncate">
                  {{ translation.value || '-' }}
                </div>
              </td>
              <td class="table-cell">
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ translation.description || '-' }}
                </div>
              </td>
              <td class="table-cell">
                <div class="flex flex-wrap gap-2">
                  <button
                    @click="editTranslation(translation)"
                    class="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 text-sm"
                  >
                    Düzenle
                  </button>
                  <button
                    @click="confirmDelete(translation)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm"
                  >
                    Sil
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="filteredTranslations.length === 0">
              <td colspan="4" class="text-center py-12">
                <LanguageIcon class="mx-auto h-12 w-12 text-gray-400" />
                <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Çeviri bulunamadı</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {{ searchQuery ? 'Arama kriterlerinize uygun çeviri bulunamadı.' : 'Henüz çeviri eklenmemiş.' }}
                </p>
                <div class="mt-6">
                  <button
                    @click="showCreateModal = true"
                    class="inline-flex items-center rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500"
                  >
                    <PlusIcon class="-ml-0.5 mr-1.5 h-5 w-5" />
                    İlk çeviriyi ekle
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 sm:px-6">
        <div class="flex flex-1 justify-between sm:hidden">
          <button
            :disabled="currentPage === 1"
            @click="currentPage--"
            class="relative inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Önceki
          </button>
          <button
            :disabled="currentPage === totalPages"
            @click="currentPage++"
            class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Sonraki
          </button>
        </div>
        <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700 dark:text-gray-300">
              <span class="font-medium">{{ ((currentPage - 1) * itemsPerPage) + 1 }}</span>
              -
              <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredTranslations.length) }}</span>
              arası, toplam
              <span class="font-medium">{{ filteredTranslations.length }}</span>
              sonuç
            </p>
          </div>
          <div>
            <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm">
              <button
                :disabled="currentPage === 1"
                @click="currentPage--"
                class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <ChevronLeftIcon class="h-5 w-5" />
              </button>

              <button
                v-for="page in visiblePages"
                :key="page"
                @click="currentPage = page"
                :class="[
                  page === currentPage
                    ? 'bg-rose-600 text-white'
                    : 'text-gray-900 dark:text-gray-300 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700',
                  'relative inline-flex items-center px-4 py-2 text-sm font-semibold'
                ]"
              >
                {{ page }}
              </button>

              <button
                :disabled="currentPage === totalPages"
                @click="currentPage++"
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
                  Çeviriyi Sil
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    <strong class="text-gray-700 dark:text-gray-300">{{ translationToDelete?.key }}</strong> çevirisini silmek istediğinizden emin misiniz? 
                    Bu işlem geri alınamaz.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              @click="handleDelete"
              :disabled="deleting"
              class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 dark:bg-red-600 dark:hover:bg-red-700 sm:ml-3 sm:w-auto disabled:opacity-50"
            >
              {{ deleting ? 'Siliniyor...' : 'Sil' }}
            </button>
            <button
              @click="showDeleteModal = false"
              :disabled="deleting"
              class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-600 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 sm:mt-0 sm:w-auto disabled:opacity-50"
            >
              İptal
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <TranslationFormModal
      :show="showFormModal"
      :translation="selectedTranslation"
      :language-id="languageId"
      :language-code="languageCode"
      @close="closeFormModal"
      @saved="handleSaved"
    />

    <!-- Bulk Import Modal -->
    <BulkImportModal
      :show="showBulkModal"
      @close="showBulkModal = false"
      @imported="handleBulkImported"
    />
  </div>
</template>

<script setup>
import {
  PlusIcon,
  LanguageIcon,
  ExclamationTriangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowUpTrayIcon
} from '@heroicons/vue/24/outline'
import { watchDebounced } from '@vueuse/core'
import { languageApi } from '~/services/languageApi'

const route = useRoute()
const languageCode = route.params.code

// State
const languageName = ref('')
const languageId = ref(0)
const allTranslations = ref([])
const loading = ref(false)
const deleting = ref(false)

// Search
const searchQuery = ref('')

// Pagination
const currentPage = ref(1)
const itemsPerPage = 20

// Modals
const showDeleteModal = ref(false)
const translationToDelete = ref(null)
const showCreateModal = ref(false)
const showFormModal = ref(false)
const showBulkModal = ref(false)
const selectedTranslation = ref(null)

// Computed
const filteredTranslations = computed(() => {
  if (!searchQuery.value) return allTranslations.value

  const search = searchQuery.value.toLowerCase()
  return allTranslations.value.filter(
    item =>
      item.key.toLowerCase().includes(search) ||
      item.value?.toLowerCase().includes(search) ||
      item.description?.toLowerCase().includes(search)
  )
})

const totalPages = computed(() => {
  return Math.ceil(filteredTranslations.value.length / itemsPerPage)
})

const paginatedTranslations = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredTranslations.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value

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
const loadTranslations = async () => {
  loading.value = true
  try {
    // Get language info
    const language = await languageApi.getLanguageByCode(languageCode)
    languageName.value = language.name
    languageId.value = language.id

    // Get all translation keys
    const keys = await languageApi.getTranslationKeys()

    // Get translations for this language
    const response = await languageApi.getTranslationsByLanguage(languageCode)

    // Merge data
    allTranslations.value = keys.map((key) => ({
      id: key.id,
      key: key.keyName,
      value: response.translations[key.keyName] || '',
      description: key.description || '',
    }))
  } catch (error) {
    console.error('Failed to load translations:', error)
    useToast().showError('Çeviriler yüklenirken bir hata oluştu')
  } finally {
    loading.value = false
  }
}

const confirmDelete = (translation) => {
  translationToDelete.value = translation
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (!translationToDelete.value) return

  deleting.value = true
  try {
    await languageApi.deleteTranslation(languageId.value, translationToDelete.value.id)
    await loadTranslations()
    useToast().showSuccess('Çeviri başarıyla silindi')
  } catch (error) {
    console.error('Failed to delete translation:', error)
    useToast().showError('Çeviri silinirken bir hata oluştu')
  } finally {
    deleting.value = false
    showDeleteModal.value = false
    translationToDelete.value = null
  }
}

const editTranslation = (translation) => {
  selectedTranslation.value = translation
  showFormModal.value = true
}

const closeFormModal = () => {
  showFormModal.value = false
  showCreateModal.value = false
  selectedTranslation.value = null
}

const handleSaved = async () => {
  await loadTranslations()
  closeFormModal()
}

const handleBulkImported = async () => {
  await loadTranslations()
  showBulkModal.value = false
  useToast().showSuccess('Çeviriler başarıyla içe aktarıldı')
}

// Watch for search term changes
watchDebounced(
  searchQuery,
  () => {
    currentPage.value = 1
  },
  { debounce: 500 }
)

// Watch for create modal
watch(showCreateModal, (newVal) => {
  if (newVal) {
    selectedTranslation.value = null
    showFormModal.value = true
  }
})

// Initialize data
onMounted(async () => {
  await loadTranslations()
})

// Page head
useHead({
  title: `${languageName.value} Çevirileri - Valdori CRM`
})
</script>