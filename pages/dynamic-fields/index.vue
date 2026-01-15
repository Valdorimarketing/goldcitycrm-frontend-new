<template>
  <div>
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dinamik Alan Yönetimi</h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
          Müşteri formlarında kullanılacak dinamik alanları buradan yönetebilirsiniz.
        </p>
      </div>
      <div class="mt-4 sm:mt-0">
        <button
          @click="showCreateModal = true"
          class="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          <PlusIcon class="-ml-0.5 mr-1.5 h-5 w-5" />
          Yeni Alan Ekle
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>

    <!-- Dynamic Fields Table -->
    <div v-else class="card">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="table-header">Alan Adı</th>
              <th class="table-header">Tip</th>
              <th class="table-header">Sıra</th>
              <th class="table-header">Seçenekler</th>
              <th class="table-header">Oluşturulma Tarihi</th>
              <th class="table-header">İşlemler</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="field in dynamicFields" :key="field.id">
              <td class="table-cell">
                <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ field.name }}</div>
              </td>
              <td class="table-cell">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {{ getFieldTypeLabel(field.type) }}
                </span>
              </td>
              <td class="table-cell">
                <div class="text-sm text-gray-900 dark:text-gray-100">{{ field.order }}</div>
              </td>
              <td class="table-cell">
                <div class="text-sm text-gray-900 dark:text-gray-100">
                  <span v-if="field.type === 'select' && field.options_data">
                    {{ parseOptionsData(field.options_data).length }} seçenek
                  </span>
                  <span v-else>-</span>
                </div>
              </td>
              <td class="table-cell">
                <div class="text-sm text-gray-900 dark:text-gray-100">
                  {{ formatDate(field.created_at) }}
                </div>
              </td>
              <td class="table-cell">
                <div class="flex space-x-2">
                  <button
                    @click="editField(field)"
                    class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm"
                  >
                    Düzenle
                  </button>
                  <button
                    @click="confirmDelete(field)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm"
                  >
                    Sil
                  </button>
                </div>
              </td>
            </tr>
            
            <!-- Empty State -->
            <tr v-if="dynamicFields.length === 0">
              <td colspan="6" class="text-center py-12">
                <CogIcon class="mx-auto h-12 w-12 text-gray-400" />
                <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Dinamik alan bulunamadı</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Henüz dinamik alan tanımlanmamış.
                </p>
                <div class="mt-6">
                  <button
                    @click="showCreateModal = true"
                    class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                  >
                    <PlusIcon class="-ml-0.5 mr-1.5 h-5 w-5" />
                    İlk alanı ekle
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
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        
        <div class="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <ExclamationTriangleIcon class="h-6 w-6 text-red-600" />
              </div>
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 class="text-lg font-semibold leading-6 text-gray-900">
                  Dinamik Alanı Sil
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    <strong>{{ fieldToDelete?.name }}</strong> adlı dinamik alanı silmek istediğinizden emin misiniz? 
                    Bu işlem geri alınamaz ve bu alanı kullanan tüm müşteri verileri de silinecektir.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              @click="handleDelete"
              class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
            >
              Sil
            </button>
            <button
              @click="showDeleteModal = false"
              class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            >
              İptal
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <DynamicFieldModal
      :show="showCreateModal || showEditModal"
      :field="editingField"
      @close="closeModal"
      @created="handleFieldCreated"
      @updated="handleFieldUpdated"
    />
  </div>
</template>

<script setup>
import {
  PlusIcon,
  CogIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

// Page meta
definePageMeta({
  // middleware: 'auth'
})

// Data
const loading = ref(false)
const dynamicFields = ref([])

// Use composable
const { 
  getDynamicFields, 
  deleteDynamicField,
  getFieldTypeLabel,
  parseOptionsData
} = useCustomerDynamicFields()

// Modals
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const editingField = ref(null)
const fieldToDelete = ref(null)

// Load dynamic fields
const loadDynamicFields = async () => {
  try {
    loading.value = true
    const fields = await getDynamicFields()
    dynamicFields.value = fields.sort((a, b) => a.order - b.order)
  } catch (error) {
    console.error('Error loading dynamic fields:', error)
  } finally {
    loading.value = false
  }
}

// Edit field
const editField = (field) => {
  editingField.value = { ...field }
  showEditModal.value = true
}

// Confirm delete
const confirmDelete = (field) => {
  fieldToDelete.value = field
  showDeleteModal.value = true
}

// Handle delete
const handleDelete = async () => {
  if (fieldToDelete.value) {
    try {
      await deleteDynamicField(fieldToDelete.value.id)
      await loadDynamicFields()
      showDeleteModal.value = false
      fieldToDelete.value = null
    } catch (error) {
      console.error('Error deleting dynamic field:', error)
    }
  }
}

// Close modal
const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingField.value = null
}

// Handle field created
const handleFieldCreated = async () => {
  await loadDynamicFields()
  closeModal()
}

// Handle field updated
const handleFieldUpdated = async () => {
  await loadDynamicFields()
  closeModal()
}

// Format date
const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('tr-TR')
}

// Initialize
onMounted(() => {
  loadDynamicFields()
})

// Page head
useHead({
  title: 'Dinamik Alan Yönetimi - Valdori CRM'
})
</script>

