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
              <div class="absolute inset-0 bg-gradient-to-r from-rose-500 to-orange-600"></div>
              <div
                class="absolute inset-0 opacity-30"
                style="background-image: url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%3E%3Ccircle%20cx%3D%221%22%20cy%3D%221%22%20r%3D%221%22%20fill%3D%22white%22%20fill-opacity%3D%220.3%22%2F%3E%3C%2Fsvg%3E');"
              ></div>

              <div class="relative px-6 py-5">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <div class="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <DocumentTextIcon class="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h2 class="text-xl font-bold text-white">{{ t('notes_modal.title', 'Müşteri Notları') }}</h2>
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

            <!-- Draft Restore Alert -->
            <Transition
              enter-active-class="transition-all duration-300"
              enter-from-class="opacity-0 -translate-y-4"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition-all duration-200"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-4"
            >
              <div v-if="showDraftAlert" class="flex-shrink-0 mx-5 mt-5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <div class="flex items-start gap-3">
                  <div class="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                    <DocumentTextIcon class="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div class="flex-1">
                    <h4 class="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-1">
                      {{ t('notes_modal.draft_found', 'Kaydedilmiş Taslak Bulundu') }}
                    </h4>
                    <p class="text-sm text-blue-700 dark:text-blue-300 mb-3">
                      {{ t('notes_modal.draft_message', 'Bu müşteri için kaydedilmiş bir taslak notunuz var. Devam etmek ister misiniz?') }}
                    </p>
                    <div class="flex items-center gap-2">
                      <button
                        @click="restoreDraft"
                        class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all"
                      >
                        <DocumentDuplicateIcon class="h-4 w-4" />
                        {{ t('notes_modal.restore_draft', 'Devam Et') }}
                      </button>
                      <button
                        @click="deleteDraft"
                        class="px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
                      >
                        {{ t('notes_modal.delete_draft', 'Taslağı Sil') }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>

            <!-- Add Note Section -->
            <div class="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 p-5 bg-gray-50 dark:bg-gray-900/50">
              <!-- Status Selection -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('notes_modal.customer_status', 'Müşteri Durumu') }}
                </label>
                <div class="relative">
                  <TagIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    v-model="selectedStatus"
                    class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                  >
                    <option :value="null" disabled>{{ t('notes_modal.select_status', 'Durum seçiniz...') }}</option>
                    <option v-for="status in availableStatuses" :key="status.id" :value="status.id">
                      {{ status.name }}
                    </option>
                  </select>
                </div>

                <!-- Current Status Badge -->
                <div v-if="customer?.status_info" class="mt-2 flex items-center gap-2">
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{ t('notes_modal.current', 'Mevcut:') }}</span>
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
                  <div v-if="showReminderInfo" class="mt-3 flex items-center gap-3 p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl">
                    <div class="h-8 w-8 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center flex-shrink-0">
                      <CalendarDaysIcon class="h-4 w-4 text-rose-600 dark:text-rose-400" />
                    </div>
                    <div>
                      <p class="text-sm font-medium text-rose-800 dark:text-rose-200">
                        {{ tp('notes_modal.reminder_days', { days: reminderDays }, '{days} gün sonra aranacak.') }}
                      </p>
                      <p v-if="reminderDate" class="text-xs text-rose-600 dark:text-rose-400">
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
                  class="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all resize-none"
                  :placeholder="t('notes_modal.note_placeholder', 'Yeni not ekleyin...')"
                ></textarea>
                
                <!-- Auto-save Indicator -->
                <Transition
                  enter-active-class="transition-all duration-200"
                  enter-from-class="opacity-0 scale-95"
                  enter-to-class="opacity-100 scale-100"
                  leave-active-class="transition-all duration-200"
                  leave-from-class="opacity-100 scale-100"
                  leave-to-class="opacity-0 scale-95"
                >
                  <div 
                    v-if="autoSaveStatus"
                    class="absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm"
                  >
                    <div v-if="autoSaveStatus === 'saving'" class="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></div>
                    <div v-else-if="autoSaveStatus === 'saved'" class="h-2 w-2 rounded-full bg-green-500"></div>
                    <span class="text-xs font-medium" :class="autoSaveStatus === 'saving' ? 'text-rose-600 dark:text-rose-400' : 'text-green-600 dark:text-green-400'">
                      {{ autoSaveStatus === 'saving' ? t('notes_modal.saving', 'Kaydediliyor...') : t('notes_modal.saved', 'Kaydedildi') }}
                    </span>
                  </div>
                </Transition>
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
                      <div class="w-9 h-5 bg-gray-200 dark:bg-gray-700 rounded-full peer-checked:bg-rose-500 transition-colors"></div>
                      <div class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-4 transition-transform"></div>
                    </div>
                    <span class="text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                      <BellIcon class="inline h-4 w-4 mr-1" />
                      {{ t('notes_modal.reminder', 'Hatırlatıcı') }}
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
                      class="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                    />
                  </Transition>
                </div>

                <!-- Add Button -->
                <div class="flex gap-1">
                  <button
                    @click="showConvertToSaleModal = true"
                    :disabled="isSaleStatus"
                    class="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <CurrencyDollarIcon class="h-4 w-4" />
                    {{ t('notes_modal.convert_to_sale', 'Satışa Çevir') }}
                  </button>
                  <button
                    @click="addNote"
                    :disabled="!newNote.note.trim() || addingNote"
                    class="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-600 text-white text-sm font-medium rounded-xl hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <PlusIcon class="h-4 w-4" />
                    {{ addingNote ? t('notes_modal.adding', 'Ekleniyor...') : t('notes_modal.add_note', 'Not Ekle') }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Notes List -->
            <div class="flex-1 overflow-y-auto p-5">
              <!-- Loading State -->
              <div v-if="loading" class="flex flex-col items-center justify-center py-12">
                <div class="relative">
                  <div class="w-12 h-12 rounded-full border-4 border-rose-100 dark:border-rose-900"></div>
                  <div class="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-transparent border-t-rose-600 animate-spin"></div>
                </div>
                <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">{{ t('notes_modal.loading', 'Notlar yükleniyor...') }}</p>
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
                      <div class="h-9 w-9 rounded-lg bg-gradient-to-br from-rose-500 to-orange-600 flex items-center justify-center">
                        <span class="text-xs font-bold text-white">
                          {{ note.userInfo?.name?.charAt(0)?.toUpperCase() || 'S' }}
                        </span>
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ note.userInfo?.name || t('customer_show.history.system', 'Sistem') }}
                        </p>
                        <div class="flex gap-2">
                          <p class="text-xs text-gray-500 dark:text-gray-400">
                          {{ formatHistoryDate(note.createdAt) }}
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          {{ formatDate(note.createdAt) }}
                        </p>
                        </div>
                      </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        @click="cloneNote(note)"
                        class="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
                        :title="t('notes_modal.clone', 'Klonla')"
                      >
                        <DocumentDuplicateIcon class="h-4 w-4" />
                      </button>
                      <button
                        @click="editNote(note)"
                        class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                        :title="t('pool.actions.edit', 'Düzenle')"
                      >
                        <PencilIcon class="h-4 w-4" />
                      </button>
                      <button
                        v-if="isAdmin"
                        @click="deleteNote(note)"
                        class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                        :title="t('pool.actions.delete', 'Sil')"
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
                      class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all resize-none"
                    ></textarea>
                    <div class="flex items-center justify-between">
                      <label class="flex items-center gap-2 cursor-pointer">
                        <input
                          v-model="editingNote.isReminding"
                          type="checkbox"
                          class="h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                        />
                        <span class="text-sm text-gray-600 dark:text-gray-300">{{ t('notes_modal.reminder', 'Hatırlatıcı') }}</span>
                      </label>
                      <div class="flex items-center gap-2">
                        <button
                          @click="cancelEdit"
                          class="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                          {{ t('pool.delete.cancel', 'İptal') }}
                        </button>
                        <button
                          @click="saveEdit"
                          :disabled="!editingNote.note.trim()"
                          class="px-3 py-1.5 bg-rose-600 text-white text-sm font-medium rounded-lg hover:bg-rose-700 disabled:opacity-50 transition-all"
                        >
                          {{ t('notes_modal.save', 'Kaydet') }}
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- View Mode -->
                  <div v-else>
                    <p class="text-md text-gray-700 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                      {{ note.note }}
                    </p>

                    <!-- Reminder Badge -->
                    <div v-if="note.isReminding" class="mt-3 flex items-center gap-2">
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 rounded-lg text-xs font-medium">
                        <BellIcon class="h-3.5 w-3.5" />
                        {{ formatDateTime(note.remindingAt) }}
                      </span>
                      <span 
                        v-if="isOverdue(note.remindingAt)"
                        class="inline-flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-xs font-medium"
                      >
                        <ExclamationTriangleIcon class="h-3 w-3" />
                        {{ t('notes_modal.overdue', 'Gecikmiş') }}
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
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {{ t('notes_modal.empty.title', 'Not Bulunamadı') }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ t('notes_modal.empty.description', 'Bu müşteri için henüz not eklenmemiş.') }}
                </p>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="flex-shrink-0 px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>
                    {{ t('dashboard.total', 'Toplam') }} <span class="font-medium text-gray-700 dark:text-gray-300">{{ notes.length }}</span> {{ t('notes_modal.note', 'not') }}
                  </span>
                  <span v-if="reminderCount > 0" class="flex items-center gap-1">
                    <BellIcon class="h-4 w-4 text-rose-500" />
                    <span class="font-medium text-rose-600 dark:text-rose-400">{{ reminderCount }}</span> {{ t('notes_modal.reminder_count', 'hatırlatıcı') }}
                  </span>
                </div>
                <button
                  @click="$emit('close')"
                  class="px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
                >
                  {{ t('notes_modal.close', 'Kapat') }}
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
  ExclamationTriangleIcon,
  CurrencyDollarIcon
} from '@heroicons/vue/24/outline'
import { useLanguage } from '~/composables/useLanguage'

const { t, tp } = useLanguage()

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

// State
const loading = ref(false)
const notes = ref([])
const addingNote = ref(false)
const editingNote = ref(null)
const selectedStatus = ref(null)
const showConvertToSaleModal = ref(false)
const pendingStatusId = ref(null)
const autoSaveStatus = ref(null) // 'saving', 'saved', null
const autoSaveTimeout = ref(null)
const showDraftAlert = ref(false)
const draftData = ref(null)

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

const isSaleStatus = computed(() => {
  if (!selectedStatus.value) return false
  const status = availableStatuses.value.find(s => s.id === selectedStatus.value)
  return status?.is_sale || status?.isSale || false
})

// Draft Management Methods
const getDraftKey = () => {
  return `customer_note_draft_${props.customer?.id}`
}

const saveDraft = () => {
  if (!props.customer?.id || !newNote.note.trim()) {
    clearDraft()
    return
  }

  const draft = {
    note: newNote.note,
    isReminding: newNote.isReminding,
    remindingAt: newNote.remindingAt,
    status: selectedStatus.value,
    timestamp: new Date().toISOString()
  }

  try {
    localStorage.setItem(getDraftKey(), JSON.stringify(draft))
    autoSaveStatus.value = 'saved'
    setTimeout(() => {
      autoSaveStatus.value = null
    }, 2000)
  } catch (error) {
    console.error('Error saving draft:', error)
  }
}

const loadDraft = () => {
  if (!props.customer?.id) return null

  try {
    const draft = localStorage.getItem(getDraftKey())
    return draft ? JSON.parse(draft) : null
  } catch (error) {
    console.error('Error loading draft:', error)
    return null
  }
}

const clearDraft = () => {
  if (!props.customer?.id) return

  try {
    localStorage.removeItem(getDraftKey())
  } catch (error) {
    console.error('Error clearing draft:', error)
  }
}

const checkForDraft = () => {
  const draft = loadDraft()
  if (draft && draft.note.trim()) {
    draftData.value = draft
    showDraftAlert.value = true
  }
}

const restoreDraft = () => {
  if (draftData.value) {
    newNote.note = draftData.value.note
    newNote.isReminding = draftData.value.isReminding
    newNote.remindingAt = draftData.value.remindingAt
    if (draftData.value.status) {
      selectedStatus.value = draftData.value.status
    }
  }
  showDraftAlert.value = false
  draftData.value = null
}

const deleteDraft = () => {
  clearDraft()
  showDraftAlert.value = false
  draftData.value = null
}

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


const formatHistoryDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })
}


const addNote = async () => {
  if (!newNote.note.trim() || !props.customer?.id) return

  if (notes.value.find(item => item.note === newNote.note.trim())) {
    alert(t('notes_modal.duplicate_note', "Aynı nottan tekrar oluşturulamaz"))
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

      try {
        await customersStore.updateCustomer(props.customer.id, { status: selectedStatus.value })
        statusUpdateSuccess = true

        await customersStore.fetchCustomer(props.customer.id)
        emit('customer-updated')
        showSuccess(t('notes_modal.status_updated', 'Müşteri durumu güncellendi'))
      } catch (error) {
        console.error('Error updating customer status:', error)
        const errorMessage = error?.data?.message || t('notes_modal.status_update_error', 'Durum güncellenirken hata oluştu')
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

    // Clear draft after successful note addition
    clearDraft()

    newNote.note = ''
    newNote.isReminding = false
    newNote.remindingAt = ''

    await fetchNotes()

  } catch (error) {
    console.error('Error adding note:', error)
    showError(t('notes_modal.add_note_error', 'Not eklenirken hata oluştu'))
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
  if (!confirm(t('notes_modal.delete_confirm', 'Bu notu silmek istediğinizden emin misiniz?'))) return
  
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
  return $dayjs(dateString).fromNow();
}

const formatDateTime = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString('tr-TR', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

// Auto-save watcher with debounce
watch(() => newNote.note, (newValue) => {
  if (!props.customer?.id) return

  // Clear existing timeout
  if (autoSaveTimeout.value) {
    clearTimeout(autoSaveTimeout.value)
  }

  // If note is empty, clear draft
  if (!newValue.trim()) {
    autoSaveStatus.value = null
    return
  }

  // Show saving status
  autoSaveStatus.value = 'saving'

  // Set new timeout for auto-save (1 second debounce)
  autoSaveTimeout.value = setTimeout(() => {
    saveDraft()
  }, 1000)
})

// Also watch other fields for auto-save
watch([() => newNote.isReminding, () => newNote.remindingAt, () => selectedStatus.value], () => {
  if (newNote.note.trim() && props.customer?.id) {
    if (autoSaveTimeout.value) {
      clearTimeout(autoSaveTimeout.value)
    }
    autoSaveStatus.value = 'saving'
    autoSaveTimeout.value = setTimeout(() => {
      saveDraft()
    }, 500)
  }
})

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
    
    // Check for draft after a short delay to ensure modal is fully rendered
    setTimeout(() => {
      checkForDraft()
    }, 100)
  } else {
    notes.value = []
    newNote.note = ''
    newNote.isReminding = false
    newNote.remindingAt = ''
    editingNote.value = null
    selectedStatus.value = null
    autoSaveStatus.value = null
    showDraftAlert.value = false
    draftData.value = null
    
    if (autoSaveTimeout.value) {
      clearTimeout(autoSaveTimeout.value)
    }
  }
})

// Cleanup on unmount
onBeforeUnmount(() => {
  if (autoSaveTimeout.value) {
    clearTimeout(autoSaveTimeout.value)
  }
})
</script>