<template>
  <div>
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Hastaneler</h1>
        <p class="mt-2 text-sm text-gray-700">
          Tüm hastaneleri buradan yönetebilirsiniz.
        </p>
      </div>
      <div class="mt-4 sm:mt-0">
        <button
          @click="showCreateModal = true"
          class="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          <PlusIcon class="-ml-0.5 mr-1.5 h-5 w-5" />
          Yeni Hastane
        </button>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label for="search" class="block text-sm font-medium text-gray-700 mb-2">
            Ara
          </label>
          <input
            id="search"
            v-model="searchTerm"
            type="text"
            class="form-input"
            placeholder="İsim veya kod ile ara..."
          />
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

    <!-- Hospitals Table -->
    <div v-else class="card">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="table-header text-gray-700 dark:text-gray-300">Hastane Adı</th>
              <th class="table-header text-gray-700 dark:text-gray-300">Kod</th>
              <th class="table-header text-gray-700 dark:text-gray-300">Adres</th>
              <th class="table-header text-gray-700 dark:text-gray-300">Açıklama</th>
              <th class="table-header text-gray-700 dark:text-gray-300">Eklenme Tarihi</th>
              <th class="table-header text-gray-700 dark:text-gray-300">İşlemler</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="hospital in filteredHospitals" :key="hospital.id">
              <td class="table-cell">
                <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ hospital.name || '-' }}
                </div>
              </td>
              <td class="table-cell">
                <div class="text-sm text-gray-900 dark:text-gray-100">{{ hospital.code || '-' }}</div>
              </td>
              <td class="table-cell">
                <div class="text-sm text-gray-900 dark:text-gray-100">{{ hospital.address || '-' }}</div>
              </td>
              <td class="table-cell">
                <div class="text-sm text-gray-900 dark:text-gray-100">{{ hospital.description || '-' }}</div>
              </td>
              <td class="table-cell">
                <div class="text-sm text-gray-900 dark:text-gray-100">
                  {{ formatDate(hospital.createdAt) }}
                </div>
              </td>
              <td class="table-cell">
                <div class="flex flex-wrap gap-2">
                  <button
                    @click="editHospital(hospital)"
                    class="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 text-sm"
                  >
                    Düzenle
                  </button>
                  <button
                    @click="confirmDelete(hospital)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm"
                  >
                    Sil
                  </button>
                </div>
              </td>
            </tr>
            
            <!-- Empty State -->
            <tr v-if="filteredHospitals.length === 0">
              <td colspan="6" class="text-center py-12">
                <BuildingOffice2Icon class="mx-auto h-12 w-12 text-gray-400" />
                <h3 class="mt-2 text-sm font-medium text-gray-900">Hastane bulunamadı</h3>
                <p class="mt-1 text-sm text-gray-500">
                  {{ searchTerm ? 'Arama kriterlerinize uygun hastane bulunamadı.' : 'Henüz hastane eklenmemiş.' }}
                </p>
                <div class="mt-6">
                  <button
                    @click="showCreateModal = true"
                    class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                  >
                    <PlusIcon class="-ml-0.5 mr-1.5 h-5 w-5" />
                    İlk hastaneyi ekle
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
                  Hastaneyi Sil
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    <strong class="text-gray-700 dark:text-gray-300">{{ hospitalToDelete?.name }}</strong> adlı hastaneyi silmek istediğinizden emin misiniz? 
                    Bu işlem geri alınamaz ve ilişkili tüm branşlar de silinecektir.
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
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

const { hospitals, loading, fetchHospitals, deleteHospital } = useHospitals()

// Search and filters
const searchTerm = ref('')

// Modals
const showDeleteModal = ref(false)
const hospitalToDelete = ref(null)
const showCreateModal = ref(false)
const showFormModal = ref(false)
const selectedHospital = ref(null)

// Computed properties
const filteredHospitals = computed(() => {
  let filtered = hospitals.value

  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(hospital =>
      hospital.name?.toLowerCase().includes(search) ||
      hospital.code?.toLowerCase().includes(search) ||
      hospital.address?.toLowerCase().includes(search)
    )
  }

  return filtered
})

// Methods
const resetFilters = () => {
  searchTerm.value = ''
}

const confirmDelete = (hospital) => {
  hospitalToDelete.value = hospital
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (hospitalToDelete.value) {
    try {
      await deleteHospital(hospitalToDelete.value.id)
      await fetchHospitals()
      useToast().success('Hastane başarıyla silindi')
    } catch (error) {
      useToast().error('Hastane silinirken bir hata oluştu')
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
  await fetchHospitals()
  closeFormModal()
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('tr-TR')
}

// Watch for create modal
watch(showCreateModal, (newVal) => {
  if (newVal) {
    selectedHospital.value = null
    showFormModal.value = true
  }
})

// Initialize data
onMounted(async () => {
  await fetchHospitals()
})

// Page head
useHead({
  title: 'Hastaneler - Valdori CRM'
})
</script>