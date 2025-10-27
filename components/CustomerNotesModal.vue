<template>
  <Teleport to="body">
    <Transition
      enter-active-class="duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
        <!-- Backdrop -->
        <div 
          class="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/80 backdrop-blur-sm transition-opacity" 
          @click="$emit('close')"
        ></div>
        
        <!-- Modal -->
        <div class="flex min-h-screen items-center justify-center p-4">
          <Transition
            enter-active-class="duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div v-if="show" class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl transition-all sm:w-full sm:max-w-4xl">
              <!-- Header -->
              <div class="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                      <DocumentTextIcon class="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-white">Müşteri Notları</h3>
                      <p class="text-sm text-amber-100">{{ customer?.name }} {{ customer?.surname }}</p>
                    </div>
                  </div>
                  <button
                    @click="$emit('close')"
                    class="rounded-lg p-2 hover:bg-white/20 transition-colors"
                  >
                    <XMarkIcon class="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>

              <!-- Add Note Section -->
              <div class="border-b dark:border-gray-700 p-4">
                <div class="flex items-start space-x-3">
                  <div class="flex-1">
                    <!-- Customer Status -->
                    <div class="mb-4">
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Müşteri Durumu
                      </label>
                      <select
                        v-model="selectedStatus"
                        class="block w-full rounded-lg border-0 px-4 py-2.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-amber-600 dark:bg-gray-700 transition-all"
                      >
                        <option :value="null" disabled>Durum seçiniz...</option>
                        <option
                          v-for="status in availableStatuses"
                          :key="status.id"
                          :value="status.id"
                        >
                          {{ status.name }}
                        </option>
                      </select>
                      <div v-if="customer?.status_info" class="mt-2 inline-flex items-center">
                        <span class="text-xs text-gray-500 dark:text-gray-400 mr-2">Mevcut durum:</span>
                        <span
                          class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                          :style="{
                            backgroundColor: customer.status_info.color + '20',
                            color: customer.status_info.color
                          }"
                        >
                          {{ customer.status_info.name }}
                        </span>
                      </div>

                      <!-- Reminder Info -->
                      <div v-if="showReminderInfo" class="mt-3 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                        <p class="text-sm text-gray-700 dark:text-gray-300">
                          <span class="font-semibold">{{ reminderDays }} gün sonra aranacak</span>
                          <span v-if="reminderDate" class="ml-1">({{ reminderDate }})</span>
                        </p>
                      </div>
                    </div>

                    <textarea
                      v-model="newNote.note"
                      rows="3"
                      class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 dark:bg-gray-700 transition-all"
                      placeholder="Yeni not ekle..."
                    ></textarea>
                    
                    <!-- Reminder Option -->
                    <div class="mt-3 flex items-center justify-between">
                      <div class="flex items-center space-x-4">
                        <label class="flex items-center">
                          <input
                            v-model="newNote.isReminding"
                            type="checkbox"
                            class="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-600"
                          />
                          <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            <BellIcon class="inline h-4 w-4 mr-1" />
                            Hatırlatıcı ekle
                          </span>
                        </label>
                        
                        <Transition
                          enter-active-class="duration-200 ease-out"
                          enter-from-class="opacity-0 scale-95"
                          enter-to-class="opacity-100 scale-100"
                          leave-active-class="duration-100 ease-in"
                          leave-from-class="opacity-100 scale-100"
                          leave-to-class="opacity-0 scale-95"
                        >
                          <input
                            v-if="newNote.isReminding"
                            v-model="newNote.remindingAt"
                            type="datetime-local"
                            class="rounded-lg border-0 px-3 py-1.5 text-sm text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-amber-600 dark:bg-gray-700"
                          />
                        </Transition>
                      </div>
                      
                      <button
                        @click="addNote"
                        :disabled="!newNote.note.trim() || addingNote"
                        class="inline-flex items-center rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <PlusIcon class="mr-2 h-4 w-4" />
                        {{ addingNote ? 'Ekleniyor...' : 'Not Ekle' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Content -->
              <div class="max-h-[50vh] overflow-y-auto p-6">
                <!-- Loading State -->
                <div v-if="loading" class="flex justify-center py-8">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                </div>

                <!-- Notes List -->
                <div v-else-if="notes.length > 0" class="space-y-4">
                  <div 
                    v-for="note in notes" 
                    :key="note.id"
                    class="group relative bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:shadow-md transition-all"
                  >
                    <!-- Note Header -->
                    <div class="flex items-start justify-between mb-2">
                      <div class="flex items-center space-x-2">
                        <UserIcon class="h-4 w-4 text-gray-400" />
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {{ note.userInfo?.name || 'Sistem' }}
                        </span>
                        <span class="text-xs text-gray-500 dark:text-gray-400">
                          • {{ formatDate(note.createdAt) }}
                        </span>
                      </div>
                      
                      <!-- Actions -->
                      <div class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          @click="editNote(note)"
                          class="text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                          title="Düzenle"
                        >
                          <PencilIcon class="h-4 w-4" />
                        </button>
                        <button
                          v-if="isAdmin"
                          @click="deleteNote(note)"
                          class="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          title="Sil"
                        >
                          <TrashIcon class="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <!-- Note Content -->
                    <div v-if="editingNote?.id === note.id" class="space-y-3">
                      <textarea
                        v-model="editingNote.note"
                        rows="3"
                        required
                        class="block w-full rounded-lg border-0 px-3 py-2 text-sm text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-amber-600 dark:bg-gray-600"
                      ></textarea>
                      <div class="flex items-center justify-between">
                        <label class="flex items-center">
                          <input
                            v-model="editingNote.isReminding"
                            type="checkbox"
                            class="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-600"
                          />
                          <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Hatırlatıcı</span>
                        </label>
                        <div class="flex items-center space-x-2">
                          <button
                            @click="cancelEdit"
                            class="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            İptal
                          </button>
                          <button
                            @click="saveEdit"
                            :disabled="!editingNote.note.trim()"
                            class="text-sm font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Kaydet
                          </button>
                        </div>
                      </div>
                    </div>
                    <div v-else>
                      <p class="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{{ note.note }}</p>
                      
                      <!-- Reminder Badge -->
                      <div v-if="note.isReminding" class="mt-3 inline-flex items-center space-x-2">
                        <span class="inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-900/30 px-3 py-1 text-xs font-medium text-amber-800 dark:text-amber-300">
                          <BellIcon class="mr-1.5 h-3.5 w-3.5" />
                          Hatırlatma: {{ formatDateTime(note.remindingAt) }}
                        </span>
                        <span 
                          v-if="isOverdue(note.remindingAt)"
                          class="inline-flex items-center rounded-full bg-red-100 dark:bg-red-900/30 px-2 py-1 text-xs font-medium text-red-800 dark:text-red-300"
                        >
                          Gecikmiş
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Empty State -->
                <div v-else class="text-center py-8">
                  <DocumentTextIcon class="mx-auto h-12 w-12 text-gray-400" />
                  <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Not Bulunamadı</h3>
                  <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Bu müşteri için henüz not eklenmemiş.
                  </p>
                </div>
              </div>

              <!-- Footer -->
              <div class="border-t dark:border-gray-700 px-6 py-4">
                <div class="flex justify-between items-center">
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Toplam <span class="font-medium">{{ notes.length }}</span> not
                    <span v-if="reminderCount > 0" class="ml-2">
                      • <span class="font-medium text-amber-600 dark:text-amber-400">{{ reminderCount }}</span> hatırlatıcı
                    </span>
                  </p>
                  <button
                    @click="$emit('close')"
                    class="inline-flex items-center rounded-lg bg-gray-100 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Kapat
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>

    <!-- Convert To Sale Modal -->
    <ConvertToSaleModal
      :show="showConvertToSaleModal"
      :customer="customer"
      :target-status="pendingStatusId"
      @close="showConvertToSaleModal = false"
      @converted="handleSaleConverted"
    />
  </Teleport>
</template>

<script setup>
import {
  XMarkIcon,
  DocumentTextIcon,
  UserIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  BellIcon
} from '@heroicons/vue/24/outline'
import { useCustomer2Product } from '~/composables/useCustomer2Product'

const props = defineProps({
  show: Boolean,
  customer: Object
})

const emit = defineEmits(['close', 'customer-updated'])

// dayjs datetime library
const { $dayjs } = useNuxtApp()

// Stores
const customerNotesStore = useCustomerNotesStore()
const authStore = useAuthStore()
const customersStore = useCustomersStore()
const { statuses: availableStatuses, fetchStatuses } = useStatuses()
const { showSuccess, showError } = useToast()
const { fetchUnsoldProducts } = useCustomer2Product()

// State
const loading = ref(false)
const notes = ref([])
const addingNote = ref(false)
const editingNote = ref(null)
const selectedStatus = ref(null)
const updatingStatus = ref(false)
const showConvertToSaleModal = ref(false)
const pendingStatusId = ref(null)

// New note form
const newNote = reactive({
  note: '',
  isReminding: false,
  remindingAt: ''
})

// Computed
const reminderCount = computed(() => {
  return notes.value.filter(n => n.isReminding).length
})

const isAdmin = computed(() => {
  return authStore.user?.role === 'admin'
})

// Check if selected status is remindable
const showReminderInfo = computed(() => {
  if (!selectedStatus.value) return false
  const status = availableStatuses.value.find(s => s.id === selectedStatus.value)
  return status?.is_remindable || status?.isRemindable || false
})

// Get reminder days from selected status
const reminderDays = computed(() => {
  if (!selectedStatus.value) return 0
  const status = availableStatuses.value.find(s => s.id === selectedStatus.value)
  return status?.reminding_day || status?.remindingDay || 0
})

// Yeni: reminder tarihini hesaplıyor
const reminderDate = computed(() => {
  if (!reminderDays.value) return null
  return $dayjs().add(reminderDays.value, 'day').format('DD.MM.YYYY')
})

// Fetch customer notes
const fetchNotes = async () => {
  if (!props.customer?.id) return
  
  loading.value = true
  try {
    await customerNotesStore.fetchCustomerNotes(1, 100, {
      customer: props.customer.id
    })
    
    notes.value = customerNotesStore.customerNotes
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } catch (error) {
    console.error('Error fetching customer notes:', error)
    notes.value = []
  } finally {
    loading.value = false
  }
}

// Add new note
const addNote = async () => {
  if (!newNote.note.trim() || !props.customer?.id) return

  addingNote.value = true
  try {
    // First, update status if it has changed
    const hasStatusChanged = selectedStatus.value && selectedStatus.value !== props.customer?.status
    let statusUpdateSuccess = false
    let isSaleStatus = false

    if (hasStatusChanged) {
      const selectedStatusObj = availableStatuses.value.find(s => s.id === selectedStatus.value)
      isSaleStatus = selectedStatusObj?.is_sale || selectedStatusObj?.isSale

      // If changing to sale status, check if there are unsold products first
      if (isSaleStatus) {
        try {
          const unsoldProducts = await fetchUnsoldProducts(props.customer.id)

          if (!unsoldProducts || unsoldProducts.length === 0) {
            alert('Satış yapılamaz. Önce ürün girilmeli')
            addingNote.value = false
            return
          }
        } catch (error) {
          console.error('Error fetching unsold products:', error)
          alert('Ürünler kontrol edilirken hata oluştu')
          addingNote.value = false
          return
        }
      }

      // Update customer status
      try {
        await customersStore.updateCustomer(props.customer.id, {
          status: selectedStatus.value
        })

        statusUpdateSuccess = true

        if (!isSaleStatus) {
          // For non-sale status, refresh customer data
          await customersStore.fetchCustomer(props.customer.id)
          emit('customer-updated')
          showSuccess('Müşteri durumu güncellendi')
        }
      } catch (error) {
        console.error('Error updating customer status:', error)
        const errorMessage = error?.data?.message || 'Durum güncellenirken hata oluştu'
        showError(errorMessage)
        addingNote.value = false
        return
      }
    }

    // Add the note
    const noteData = {
      customer: props.customer.id,
      user: authStore.user?.id,
      note: newNote.note.trim(),
      isReminding: newNote.isReminding,
      remindingAt: newNote.isReminding && newNote.remindingAt ? newNote.remindingAt : undefined
    }

    await customerNotesStore.createCustomerNote(noteData)

    // Reset form
    newNote.note = ''
    newNote.isReminding = false
    newNote.remindingAt = ''

    // Refresh notes
    await fetchNotes()

    // If status was updated successfully and it's a sale status, open the modal
    if (statusUpdateSuccess && isSaleStatus) {
      pendingStatusId.value = selectedStatus.value
      showConvertToSaleModal.value = true
    }
  } catch (error) {
    console.error('Error adding note:', error)
    showError('Not eklenirken hata oluştu')
  } finally {
    addingNote.value = false
  }
}

// Edit note
const editNote = (note) => {
  editingNote.value = { ...note }
}

// Cancel edit
const cancelEdit = () => {
  editingNote.value = null
}

// Save edit
const saveEdit = async () => {
  if (!editingNote.value) return
  
  try {
    await customerNotesStore.updateCustomerNote(editingNote.value.id, {
      note: editingNote.value.note,
      isReminding: editingNote.value.isReminding,
      remindingAt: editingNote.value.isReminding && editingNote.value.remindingAt ? editingNote.value.remindingAt : undefined
    })
    
    // Refresh notes
    await fetchNotes()
    editingNote.value = null
  } catch (error) {
    console.error('Error updating note:', error)
  }
}

// Delete note
const deleteNote = async (note) => {
  if (!confirm('Bu notu silmek istediğinizden emin misiniz?')) return
  
  try {
    await customerNotesStore.deleteCustomerNote(note.id)
    
    // Refresh notes
    await fetchNotes()
  } catch (error) {
    console.error('Error deleting note:', error)
  }
}

// Check if reminder is overdue
const isOverdue = (dateString) => {
  if (!dateString) return false
  return new Date(dateString) < new Date()
}

// Handle status change
const handleStatusChange = async () => {
  if (!selectedStatus.value || !props.customer?.id || updatingStatus.value) return

  // Check if the selected status is a sale status
  const selectedStatusObj = availableStatuses.value.find(s => s.id === selectedStatus.value)
  const isSaleStatus = selectedStatusObj?.is_sale || selectedStatusObj?.isSale

  updatingStatus.value = true
  try {
    // If changing to sale status, check if there are unsold products first
    if (isSaleStatus) {
      const unsoldProducts = await fetchUnsoldProducts(props.customer.id)
      if (!unsoldProducts || unsoldProducts.length === 0) {
        showError('Satış yapılamaz. Önce ürün girilmeli')
        // Revert selection
        selectedStatus.value = props.customer?.status || null
        updatingStatus.value = false
        return
      }
    }

    // Attempt to update customer status
    await customersStore.updateCustomer(props.customer.id, {
      status: selectedStatus.value
    })

    // If it's a sale status and update was successful, open convert to sale modal
    if (isSaleStatus) {
      pendingStatusId.value = selectedStatus.value
      showConvertToSaleModal.value = true
    } else {
      // For non-sale status, just refresh and notify
      await customersStore.fetchCustomer(props.customer.id)
      emit('customer-updated')
      showSuccess('Müşteri durumu güncellendi')
    }
  } catch (error) {
    console.error('Error updating customer status:', error)

    // Show error message from backend
    const errorMessage = error?.data?.message || 'Durum güncellenirken hata oluştu'
    showError(errorMessage)

    // Revert selection on error
    selectedStatus.value = props.customer?.status || null
  } finally {
    updatingStatus.value = false
  }
}

// Handle successful sale conversion
const handleSaleConverted = async (saleResult) => {
  showConvertToSaleModal.value = false

  // Refresh customer data
  await customersStore.fetchCustomer(props.customer.id)

  // Update local customer reference
  emit('customer-updated')

  // Refresh notes
  await fetchNotes()

  // Close the notes modal as well
  emit('close')
}

// Format date
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60))
      if (minutes === 0) return 'Az önce'
      return `${minutes} dakika önce`
    }
    return `${hours} saat önce`
  } else if (days === 1) {
    return 'Dün'
  } else if (days < 7) {
    return `${days} gün önce`
  } else {
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
}

// Format date time
const formatDateTime = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Set default reminder date to tomorrow at 9 AM
watch(() => newNote.isReminding, (value) => {
  if (value && !newNote.remindingAt) {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(9, 0, 0, 0)
    newNote.remindingAt = tomorrow.toISOString().slice(0, 16)
  }
})

// Watch for modal open
watch(() => props.show, async (newValue) => {
 
  if (newValue) {
    // Fetch notes
    fetchNotes()

    // Fetch available statuses
    if (availableStatuses.value.length === 0) {
      await fetchStatuses()
    }

    // Set current customer status
    selectedStatus.value = props.customer?.status || null
  } else {
    notes.value = []
    newNote.note = ''
    newNote.isReminding = false
    newNote.remindingAt = ''
    editingNote.value = null
    selectedStatus.value = null
  }
})
</script>