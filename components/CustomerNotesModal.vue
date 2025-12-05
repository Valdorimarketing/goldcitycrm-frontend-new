<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="show" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      >
        <Transition
          enter-active-class="transition-all duration-300"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-200"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div 
            v-if="show"
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            <!-- Modal Header -->
            <div class="relative overflow-hidden flex-shrink-0">
              <div class="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600"></div>
              <div
                class="absolute inset-0 opacity-30"
                style="background-image: url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%3E%3Ccircle%20cx%3D%221%22%20cy%3D%221%22%20r%3D%221%22%20fill%3D%22white%22%20fill-opacity%3D%220.3%22%2F%3E%3C%2Fsvg%3E');"
              ></div>

              <div class="relative px-6 py-5">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <div class="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <DocumentTextIcon class="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 class="text-xl font-bold text-white">Müşteri Notları</h2>
                      <p class="text-sm text-white/70">{{ customer?.name }} {{ customer?.surname }}</p>
                    </div>
                  </div>
                  <button 
                    @click="$emit('close')"
                    class="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
                  >
                    <XMarkIcon class="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Add Note Section -->
            <div class="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 p-5 bg-gray-50 dark:bg-gray-900/50">
              <!-- Status Selection -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Müşteri Durumu
                </label>
                <div class="relative">
                  <TagIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    v-model="selectedStatus"
                    class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                  >
                    <option :value="null" disabled>Durum seçiniz...</option>
                    <option v-for="status in availableStatuses" :key="status.id" :value="status.id">
                      {{ status.name }}
                    </option>
                  </select>
                </div>

                <!-- Current Status Badge -->
                <div v-if="customer?.status_info" class="mt-2 flex items-center gap-2">
                  <span class="text-xs text-gray-500 dark:text-gray-400">Mevcut:</span>
                  <span 
                    class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium"
                    :style="{
                      backgroundColor: customer.status_info.color + '20',
                      color: customer.status_info.color
                    }"
                  >
                    {{ customer.status_info.name }}
                  </span>
                </div>

                <!-- Reminder Info Alert -->
                <Transition
                  enter-active-class="transition-all duration-200"
                  enter-from-class="opacity-0 -translate-y-2"
                  enter-to-class="opacity-100 translate-y-0"
                >
                  <div v-if="showReminderInfo" class="mt-3 flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                    <div class="h-8 w-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                      <CalendarDaysIcon class="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p class="text-sm font-medium text-amber-800 dark:text-amber-200">
                        {{ reminderDays }} gün sonra aranacak
                      </p>
                      <p v-if="reminderDate" class="text-xs text-amber-600 dark:text-amber-400">
                        {{ reminderDate }}
                      </p>
                    </div>
                  </div>
                </Transition>
              </div>

              <!-- Note Input -->
              <div class="relative">
                <textarea
                  v-model="newNote.note"
                  rows="3"
                  class="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
                  placeholder="Yeni not ekleyin..."
                ></textarea>
              </div>

              <!-- Note Actions -->
              <div class="mt-3 flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <!-- Reminder Toggle -->
                  <label class="flex items-center gap-2 cursor-pointer group">
                    <div class="relative">
                      <input
                        v-model="newNote.isReminding"
                        type="checkbox"
                        class="sr-only peer"
                      />
                      <div class="w-9 h-5 bg-gray-200 dark:bg-gray-700 rounded-full peer-checked:bg-amber-500 transition-colors"></div>
                      <div class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-4 transition-transform"></div>
                    </div>
                    <span class="text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                      <BellIcon class="inline h-4 w-4 mr-1" />
                      Hatırlatıcı
                    </span>
                  </label>

                  <!-- Reminder DateTime -->
                  <Transition
                    enter-active-class="transition-all duration-200"
                    enter-from-class="opacity-0 scale-95"
                    enter-to-class="opacity-100 scale-100"
                  >
                    <input
                      v-if="newNote.isReminding"
                      v-model="newNote.remindingAt"
                      type="datetime-local"
                      class="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    />
                  </Transition>
                </div>

                <!-- Add Button -->
                <button
                  @click="addNote"
                  :disabled="!newNote.note.trim() || addingNote"
                  class="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 text-white text-sm font-medium rounded-xl hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <PlusIcon class="h-4 w-4" />
                  {{ addingNote ? 'Ekleniyor...' : 'Not Ekle' }}
                </button>
              </div>
            </div>

            <!-- Notes List -->
            <div class="flex-1 overflow-y-auto p-5">
              <!-- Loading State -->
              <div v-if="loading" class="flex flex-col items-center justify-center py-12">
                <div class="relative">
                  <div class="w-12 h-12 rounded-full border-4 border-amber-100 dark:border-amber-900"></div>
                  <div class="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-transparent border-t-amber-600 animate-spin"></div>
                </div>
                <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">Notlar yükleniyor...</p>
              </div>

              <!-- Notes -->
              <div v-else-if="notes.length > 0" class="space-y-4">
                <div 
                  v-for="note in notes" 
                  :key="note.id"
                  class="group bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-all"
                >
                  <!-- Note Header -->
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center gap-3">
                      <div class="h-9 w-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                        <span class="text-xs font-bold text-white">
                          {{ note.userInfo?.name?.charAt(0)?.toUpperCase() || 'S' }}
                        </span>
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ note.userInfo?.name || 'Sistem' }}
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          {{ formatDate(note.createdAt) }}
                        </p>
                      </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        @click="cloneNote(note)"
                        class="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-all"
                        title="Klonla"
                      >
                        <DocumentDuplicateIcon class="h-4 w-4" />
                      </button>
                      <button
                        @click="editNote(note)"
                        class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                        title="Düzenle"
                      >
                        <PencilIcon class="h-4 w-4" />
                      </button>
                      <button
                        v-if="isAdmin"
                        @click="deleteNote(note)"
                        class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                        title="Sil"
                      >
                        <TrashIcon class="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <!-- Edit Mode -->
                  <div v-if="editingNote?.id === note.id" class="space-y-3">
                    <textarea
                      v-model="editingNote.note"
                      rows="3"
                      class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
                    ></textarea>
                    <div class="flex items-center justify-between">
                      <label class="flex items-center gap-2 cursor-pointer">
                        <input
                          v-model="editingNote.isReminding"
                          type="checkbox"
                          class="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                        />
                        <span class="text-sm text-gray-600 dark:text-gray-300">Hatırlatıcı</span>
                      </label>
                      <div class="flex items-center gap-2">
                        <button
                          @click="cancelEdit"
                          class="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                          İptal
                        </button>
                        <button
                          @click="saveEdit"
                          :disabled="!editingNote.note.trim()"
                          class="px-3 py-1.5 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-all"
                        >
                          Kaydet
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- View Mode -->
                  <div v-else>
                    <p class="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                      {{ note.note }}
                    </p>

                    <!-- Reminder Badge -->
                    <div v-if="note.isReminding" class="mt-3 flex items-center gap-2">
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg text-xs font-medium">
                        <BellIcon class="h-3.5 w-3.5" />
                        {{ formatDateTime(note.remindingAt) }}
                      </span>
                      <span 
                        v-if="isOverdue(note.remindingAt)"
                        class="inline-flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-xs font-medium"
                      >
                        <ExclamationTriangleIcon class="h-3 w-3" />
                        Gecikmiş
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Empty State -->
              <div v-else class="flex flex-col items-center justify-center py-12">
                <div class="h-16 w-16 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                  <DocumentTextIcon class="h-8 w-8 text-gray-400" />
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">Not Bulunamadı</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Bu müşteri için henüz not eklenmemiş.
                </p>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="flex-shrink-0 px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>
                    Toplam <span class="font-medium text-gray-700 dark:text-gray-300">{{ notes.length }}</span> not
                  </span>
                  <span v-if="reminderCount > 0" class="flex items-center gap-1">
                    <BellIcon class="h-4 w-4 text-amber-500" />
                    <span class="font-medium text-amber-600 dark:text-amber-400">{{ reminderCount }}</span> hatırlatıcı
                  </span>
                </div>
                <button
                  @click="$emit('close')"
                  class="px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
                >
                  Kapat
                </button>
              </div>
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
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import {
  XMarkIcon,
  DocumentTextIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  BellIcon,
  DocumentDuplicateIcon,
  TagIcon,
  CalendarDaysIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'
import { useCustomer2Product } from '~/composables/useCustomer2Product'

const props = defineProps({
  show: Boolean,
  customer: Object
})

const emit = defineEmits(['close', 'customer-updated'])

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
const showConvertToSaleModal = ref(false)
const pendingStatusId = ref(null)

const newNote = reactive({
  note: '',
  isReminding: false,
  remindingAt: ''
})

// Computed
const reminderCount = computed(() => notes.value.filter(n => n.isReminding).length)

const isAdmin = computed(() => authStore.user?.role === 'admin')

const showReminderInfo = computed(() => {
  if (!selectedStatus.value) return false
  const status = availableStatuses.value.find(s => s.id === selectedStatus.value)
  return status?.is_remindable || status?.isRemindable || false
})

const reminderDays = computed(() => {
  if (!selectedStatus.value) return 0
  const status = availableStatuses.value.find(s => s.id === selectedStatus.value)
  return status?.reminding_day || status?.remindingDay || 0
})

const reminderDate = computed(() => {
  if (!reminderDays.value) return null
  return $dayjs().add(reminderDays.value, 'day').format('DD.MM.YYYY')
})

// Methods
const fetchNotes = async () => {
  if (!props.customer?.id) return
  
  loading.value = true
  try {
    await customerNotesStore.fetchCustomerNotes(1, 100, { customer: props.customer.id })
    notes.value = customerNotesStore.customerNotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } catch (error) {
    console.error('Error fetching customer notes:', error)
    notes.value = []
  } finally {
    loading.value = false
  }
}

const addNote = async () => {
  if (!newNote.note.trim() || !props.customer?.id) return

  if (notes.value.find(item => item.note === newNote.note.trim())) {
    alert("Aynı nottan tekrar oluşturulamaz")
    return false
  }

  addingNote.value = true
  try {
    const hasStatusChanged = selectedStatus.value && selectedStatus.value !== props.customer?.status
    let statusUpdateSuccess = false
    let isSaleStatus = false

    if (hasStatusChanged) {
      const selectedStatusObj = availableStatuses.value.find(s => s.id === selectedStatus.value)
      isSaleStatus = selectedStatusObj?.is_sale || selectedStatusObj?.isSale

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

      try {
        await customersStore.updateCustomer(props.customer.id, { status: selectedStatus.value })
        statusUpdateSuccess = true

        if (!isSaleStatus) {
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

    const noteData = {
      customer: props.customer.id,
      user: authStore.user?.id,
      note: newNote.note.trim(),
      isReminding: newNote.isReminding,
      remindingAt: newNote.isReminding && newNote.remindingAt ? newNote.remindingAt : undefined
    }

    await customerNotesStore.createCustomerNote(noteData)

    newNote.note = ''
    newNote.isReminding = false
    newNote.remindingAt = ''

    await fetchNotes()

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

const editNote = (note) => {
  editingNote.value = { ...note }
}

const cloneNote = (note) => {
  newNote.note = note.note
}

const cancelEdit = () => {
  editingNote.value = null
}

const saveEdit = async () => {
  if (!editingNote.value) return
  
  try {
    await customerNotesStore.updateCustomerNote(editingNote.value.id, {
      note: editingNote.value.note,
      isReminding: editingNote.value.isReminding,
      remindingAt: editingNote.value.isReminding && editingNote.value.remindingAt ? editingNote.value.remindingAt : undefined
    })
    
    await fetchNotes()
    editingNote.value = null
  } catch (error) {
    console.error('Error updating note:', error)
  }
}

const deleteNote = async (note) => {
  if (!confirm('Bu notu silmek istediğinizden emin misiniz?')) return
  
  try {
    await customerNotesStore.deleteCustomerNote(note.id)
    await fetchNotes()
  } catch (error) {
    console.error('Error deleting note:', error)
  }
}

const isOverdue = (dateString) => {
  if (!dateString) return false
  return new Date(dateString) < new Date()
}

const handleSaleConverted = async (saleResult) => {
  showConvertToSaleModal.value = false
  await customersStore.fetchCustomer(props.customer.id)
  emit('customer-updated')
  await fetchNotes()
  emit('close')
}

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
    return date.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })
  }
}

const formatDateTime = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString('tr-TR', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

// Watchers
watch(() => newNote.isReminding, (value) => {
  if (value && !newNote.remindingAt) {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(9, 0, 0, 0)
    newNote.remindingAt = tomorrow.toISOString().slice(0, 16)
  }
})

watch(() => props.show, async (newValue) => {
  if (newValue) {
    fetchNotes()
    if (availableStatuses.value.length === 0) {
      await fetchStatuses()
    }
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