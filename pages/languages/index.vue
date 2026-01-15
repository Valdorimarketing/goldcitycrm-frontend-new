<template>
  <div>
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Diller</h1>
        <p class="mt-2 text-sm text-gray-700">
          Tüm dilleri buradan yönetebilirsiniz.
        </p>
      </div>
      <div class="mt-4 sm:mt-0 flex gap-4">
        <button
          @click="initializeData()"
          class="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          <ArrowPathIcon class="-ml-0.5 mr-1.5 h-5 w-5" />
          Yenile
        </button>
        <button
          @click="showCreateModal = true"
          class="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          <PlusIcon class="-ml-0.5 mr-1.5 h-5 w-5" />
          Yeni Dil
        </button>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ara
          </label>
          <input
            id="search"
            v-model="searchTerm"
            type="text"
            class="form-input"
            placeholder="Dil adı veya kodu ile ara..."
          />
        </div>
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Durum
          </label>
          <select
            id="status"
            v-model="statusFilter"
            class="form-input"
          >
            <option :value="undefined">Tümü</option>
            <option value="active">Aktif</option>
            <option value="inactive">Pasif</option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="resetFilters"
            class="btn-secondary w-full"
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

    <!-- Languages Table -->
    <div v-else class="card">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="table-header text-gray-700 dark:text-gray-300">Dil Adı</th>
              <th class="table-header text-gray-700 dark:text-gray-300">Kod</th>
              <th class="table-header text-gray-700 dark:text-gray-300">Durum</th>
              <th class="table-header text-gray-700 dark:text-gray-300">Eklenme Tarihi</th>
              <th class="table-header text-gray-700 dark:text-gray-300">İşlemler</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="language in filteredLanguages" :key="language.id">
              <td class="table-cell">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {{ language.name }}
                  </span>
                  <span
                    v-if="language.isDefault"
                    class="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-400/30"
                  >
                    Varsayılan
                  </span>
                </div>
              </td>
              <td class="table-cell">
                <code class="text-sm text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {{ language.code.toUpperCase() }}
                </code>
              </td>
              <td class="table-cell">
                <span
                  :class="[
                    language.isActive
                      ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 ring-green-600/20 dark:ring-green-400/30'
                      : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 ring-red-600/20 dark:ring-red-400/30',
                    'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset'
                  ]"
                >
                  {{ language.isActive ? 'Aktif' : 'Pasif' }}
                </span>
              </td>
              <td class="table-cell">
                <div class="text-sm text-gray-900 dark:text-gray-100">
                  {{ formatDate(language.createdAt) }}
                </div>
              </td>
              <td class="table-cell">
                <div class="flex flex-wrap gap-2">
                  <button
                    @click="editLanguage(language)"
                    class="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 text-sm"
                  >
                    Düzenle
                  </button>
                  <NuxtLink
                    :to="`/languages/${language.code}/translations`"
                    class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-sm"
                  >
                    Çeviriler
                  </NuxtLink>
                  <button
                    v-if="!language.isDefault"
                    @click="setAsDefault(language)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                  >
                    Varsayılan Yap
                  </button>
                  <button
                    @click="toggleActive(language)"
                    class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm"
                  >
                    {{ language.isActive ? 'Pasifleştir' : 'Aktifleştir' }}
                  </button>
                  <button
                    v-if="!language.isDefault"
                    @click="confirmDelete(language)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm"
                  >
                    Sil
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="filteredLanguages.length === 0">
              <td colspan="5" class="text-center py-12">
                <LanguageIcon class="mx-auto h-12 w-12 text-gray-400" />
                <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Dil bulunamadı</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {{ searchTerm || statusFilter ? 'Arama kriterlerinize uygun dil bulunamadı.' : 'Henüz dil eklenmemiş.' }}
                </p>
                <div class="mt-6">
                  <button
                    @click="showCreateModal = true"
                    class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                  >
                    <PlusIcon class="-ml-0.5 mr-1.5 h-5 w-5" />
                    İlk dili ekle
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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
                  Dili Sil
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    <strong class="text-gray-700 dark:text-gray-300">{{ languageToDelete?.name }}</strong> dilini silmek istediğinizden emin misiniz? 
                  </p>
                  <p class="text-sm text-red-600 dark:text-red-400 font-medium mt-2">
                    Bu dile ait tüm çeviriler de silinecektir. Bu işlem geri alınamaz.
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
    <LanguageFormModal
      :show="showFormModal"
      :language="selectedLanguage"
      @close="closeFormModal"
      @saved="handleSaved"
    />
  </div>
</template>

<script setup>
import {
  PlusIcon,
  LanguageIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/outline'
import { watchDebounced } from '@vueuse/core'
import { languageApi } from '~/services/languageApi'

 

// State
const languages = ref([])
const loading = ref(false)
const deleting = ref(false)

// Search and filters
const searchTerm = ref('')
const statusFilter = ref(undefined)

// Modals
const showDeleteModal = ref(false)
const languageToDelete = ref(null)
const showCreateModal = ref(false)
const showFormModal = ref(false)
const selectedLanguage = ref(null)

// Computed
const filteredLanguages = computed(() => {
  let filtered = [...languages.value]

  // Search filter
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(
      lang => 
        lang.name.toLowerCase().includes(search) ||
        lang.code.toLowerCase().includes(search)
    )
  }

  // Status filter
  if (statusFilter.value === 'active') {
    filtered = filtered.filter(lang => lang.isActive)
  } else if (statusFilter.value === 'inactive') {
    filtered = filtered.filter(lang => !lang.isActive)
  }

  return filtered
})

// Methods
const loadLanguages = async () => {
  loading.value = true
  try {
    languages.value = await languageApi.getLanguages(false)
  } catch (error) {
    console.error('Failed to load languages:', error)
    useToast().showError('Diller yüklenirken bir hata oluştu')
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  searchTerm.value = ''
  statusFilter.value = undefined
}

const confirmDelete = (language) => {
  languageToDelete.value = language
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (!languageToDelete.value) return

  deleting.value = true
  try {
    await languageApi.deleteLanguage(languageToDelete.value.id)
    await loadLanguages()
    useToast().showSuccess('Dil başarıyla silindi')
  } catch (error) {
    console.error('Failed to delete language:', error)
    useToast().showError('Dil silinirken bir hata oluştu')
  } finally {
    deleting.value = false
    showDeleteModal.value = false
    languageToDelete.value = null
  }
}

const editLanguage = (language) => {
  selectedLanguage.value = language
  showFormModal.value = true
}

const setAsDefault = async (language) => {
  try {
    await languageApi.updateLanguage(language.id, { isDefault: true })
    await loadLanguages()
    useToast().showSuccess(`${language.name} varsayılan dil olarak ayarlandı`)
  } catch (error) {
    console.error('Failed to set default:', error)
    useToast().showError('Varsayılan dil ayarlanırken bir hata oluştu')
  }
}

const toggleActive = async (language) => {
  try {
    await languageApi.updateLanguage(language.id, { isActive: !language.isActive })
    await loadLanguages()
    useToast().showSuccess(
      language.isActive 
        ? `${language.name} pasifleştirildi` 
        : `${language.name} aktifleştirildi`
    )
  } catch (error) {
    console.error('Failed to toggle active:', error)
    useToast().showError('Durum değiştirilirken bir hata oluştu')
  }
}

const closeFormModal = () => {
  showFormModal.value = false
  showCreateModal.value = false
  selectedLanguage.value = null
}

const handleSaved = async () => {
  await loadLanguages()
  closeFormModal()
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('tr-TR')
}


const initializeData = async () => {
    await loadLanguages()
}

// Watch for search term changes with debounce
watchDebounced(
  [searchTerm, statusFilter],
  () => {
    // Filtreleme computed property üzerinden otomatik yapılıyor
  },
  { debounce: 500 }
)

// Watch for create modal
watch(showCreateModal, (newVal) => {
  if (newVal) {
    selectedLanguage.value = null
    showFormModal.value = true
  }
}) 

// Initialize data
onMounted(async () => {
  initializeData()
})

// Page head
useHead({
  title: 'Dil Yönetimi - Valdori CRM'
})
</script>