<template>
  <div>
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Doktorlar</h1>
        <p class="mt-2 text-sm text-gray-700">
          Tüm doktorları buradan yönetebilirsiniz.
        </p>
      </div>
      <div class="mt-4 sm:mt-0">
        <button
          @click="showCreateModal = true"
          class="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          <PlusIcon class="-ml-0.5 mr-1.5 h-5 w-5" />
          Yeni Doktor
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
            placeholder="Doktor adı ile ara..."
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

    <!-- Doctors Table -->
    <div v-else class="card">
      <!-- Results Info -->
      <div class="px-6 py-3 border-b border-gray-200 dark:border-gray-700">
        <p class="text-sm text-gray-700 dark:text-gray-300">
          Toplam <span class="font-medium">{{ totalItems }}</span> doktor bulundu
        </p>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="table-header text-gray-700 dark:text-gray-300">Doktor Adı</th>
              <th class="table-header text-gray-700 dark:text-gray-300">Ana Branş</th>
              <th class="table-header text-gray-700 dark:text-gray-300">İlişkili Branşlar</th>
              <th class="table-header text-gray-700 dark:text-gray-300">İlişkili Hastaneler</th>
              <th class="table-header text-gray-700 dark:text-gray-300">Eklenme Tarihi</th>
              <th class="table-header text-gray-700 dark:text-gray-300">İşlemler</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="doctor in paginatedDoctors" :key="doctor.id">
              <td class="table-cell">
                <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ doctor.name || '-' }}
                </div>
              </td>
              <td class="table-cell">
                <div class="text-sm text-gray-900 dark:text-gray-100">{{ doctor.branch?.name || '-' }}</div>
              </td>
              <td class="table-cell">
                <div class="text-sm text-gray-900 dark:text-gray-100">
                  <span v-if="doctor.doctor2Branches && doctor.doctor2Branches.length > 0">
                    {{ doctor.doctor2Branches.map(d2b => d2b.branch.name).join(', ') }}
                  </span>
                  <span v-else>-</span>
                </div>
              </td>
              <td class="table-cell">
                <div class="text-sm text-gray-900 dark:text-gray-100">
                  <span v-if="doctor.doctor2Hospitals && doctor.doctor2Hospitals.length > 0">
                    {{ doctor.doctor2Hospitals.map(d2h => d2h.hospital.name).join(', ') }}
                  </span>
                  <span v-else>-</span>
                </div>
              </td>
              <td class="table-cell">
                <div class="text-sm text-gray-900 dark:text-gray-100">
                  {{ formatDate(doctor.createdAt) }}
                </div>
              </td>
              <td class="table-cell">
                <div class="flex flex-wrap gap-2">
                  <button
                    @click="editDoctor(doctor)"
                    class="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 text-sm"
                  >
                    Düzenle
                  </button>
                  <button
                    @click="confirmDelete(doctor)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm"
                  >
                    Sil
                  </button>
                </div>
              </td>
            </tr>
            
            <!-- Empty State -->
            <tr v-if="paginatedDoctors.length === 0">
              <td colspan="6" class="text-center py-12">
                <UserGroupIcon class="mx-auto h-12 w-12 text-gray-400" />
                <h3 class="mt-2 text-sm font-medium text-gray-900">Doktor bulunamadı</h3>
                <p class="mt-1 text-sm text-gray-500">
                  {{ searchTerm ? 'Arama kriterlerinize uygun doktor bulunamadı.' : 'Henüz doktor eklenmemiş.' }}
                </p>
                <div class="mt-6">
                  <button
                    @click="showCreateModal = true"
                    class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                  >
                    <PlusIcon class="-ml-0.5 mr-1.5 h-5 w-5" />
                    İlk doktoru ekle
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <nav class="flex items-center justify-between">
          <div class="flex flex-1 justify-between sm:hidden">
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Önceki
            </button>
            <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sonraki
            </button>
          </div>
          <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
                -
                <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, totalItems) }}</span>
                arası gösteriliyor, toplam
                <span class="font-medium">{{ totalItems }}</span>
                doktor
              </p>
            </div>
            <div>
              <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  @click="goToPage(currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed dark:ring-gray-600 dark:hover:bg-gray-700"
                >
                  <span class="sr-only">Önceki</span>
                  <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
                </button>

                <template v-for="page in paginationRange" :key="page">
                  <button
                    v-if="page !== '...'"
                    @click="goToPage(page)"
                    :class="[
                      page === currentPage
                        ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0 dark:text-gray-100 dark:ring-gray-600 dark:hover:bg-gray-700',
                      'relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20'
                    ]"
                  >
                    {{ page }}
                  </button>
                  <span
                    v-else
                    class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0 dark:text-gray-300 dark:ring-gray-600"
                  >
                    ...
                  </span>
                </template>

                <button
                  @click="goToPage(currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed dark:ring-gray-600 dark:hover:bg-gray-700"
                >
                  <span class="sr-only">Sonraki</span>
                  <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </nav>
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
                  Doktoru Sil
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    <strong class="text-gray-700 dark:text-gray-300">
                      {{ doctorToDelete?.name }}
                    </strong> adlı doktoru silmek istediğinizden emin misiniz? 
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

    <!-- Create/Edit Modal -->
    <DoctorFormModal
      :show="showFormModal"
      :doctor="selectedDoctor"
      @close="closeFormModal"
      @saved="handleSaved"
    />
  </div>
</template>

<script setup>
import {
  PlusIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'

const { allDoctors, loading, fetchDoctors, fetchDoctor, deleteDoctor } = useDoctors()

// Search and filters
const searchTerm = ref('')

// Modals
const showDeleteModal = ref(false)
const doctorToDelete = ref(null)
const showCreateModal = ref(false)
const showFormModal = ref(false)
const selectedDoctor = ref(null)

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(50)

// Computed properties
const filteredDoctors = computed(() => {
  let filtered = allDoctors.value

  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(doctor =>
      doctor.name?.toLowerCase().includes(search) ||
      doctor.branch?.name?.toLowerCase().includes(search)
    )
  }

  return filtered
})

// Paginated doctors for display
const paginatedDoctors = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredDoctors.value.slice(start, end)
})

// Total items and pages based on filtered results
const totalItems = computed(() => filteredDoctors.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))

const paginationRange = computed(() => {
  const range = []
  const maxVisible = 7
  const halfVisible = Math.floor(maxVisible / 2)

  if (totalPages.value <= maxVisible) {
    for (let i = 1; i <= totalPages.value; i++) {
      range.push(i)
    }
  } else {
    if (currentPage.value <= halfVisible) {
      for (let i = 1; i <= maxVisible - 2; i++) {
        range.push(i)
      }
      range.push('...')
      range.push(totalPages.value)
    } else if (currentPage.value >= totalPages.value - halfVisible) {
      range.push(1)
      range.push('...')
      for (let i = totalPages.value - (maxVisible - 3); i <= totalPages.value; i++) {
        range.push(i)
      }
    } else {
      range.push(1)
      range.push('...')
      for (let i = currentPage.value - 1; i <= currentPage.value + 1; i++) {
        range.push(i)
      }
      range.push('...')
      range.push(totalPages.value)
    }
  }

  return range
})

// Methods
const resetFilters = () => {
  searchTerm.value = ''
}

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return
  currentPage.value = page
}

const confirmDelete = (doctor) => {
  doctorToDelete.value = doctor
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (doctorToDelete.value) {
    try {
      await deleteDoctor(doctorToDelete.value.id)
      await fetchDoctors()
      useToast().success('Doktor başarıyla silindi')
    } catch (error) {
      useToast().error('Doktor silinirken bir hata oluştu')
    }
  }
  showDeleteModal.value = false
  doctorToDelete.value = null
}

const editDoctor = async (doctor) => {
  try {
    // Fetch full doctor details from API
    const fullDoctorData = await fetchDoctor(doctor.id)

    selectedDoctor.value = fullDoctorData
    showFormModal.value = true
  } catch (error) {
    useToast().error('Doktor bilgileri yüklenirken hata oluştu')
  }
}

const closeFormModal = () => {
  showFormModal.value = false
  showCreateModal.value = false
  selectedDoctor.value = null
}

const handleSaved = async () => {
  await fetchDoctors()
  closeFormModal()
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('tr-TR')
}

// Watch for create modal
watch(showCreateModal, (newVal) => {
  if (newVal) {
    selectedDoctor.value = null
    showFormModal.value = true
  }
})

// Initialize data
onMounted(async () => {
  await fetchDoctors()
})

// Reset page when search changes
watch(searchTerm, () => {
  currentPage.value = 1
})

// Page head
useHead({
  title: 'Doktorlar - Valdori CRM'
})
</script>