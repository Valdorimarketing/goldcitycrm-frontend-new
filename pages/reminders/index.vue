<template>
  <div>
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('reminders.title', 'Hatırlatmalar') }}</h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
          {{ t('reminders.subtitle', 'Müşteri notlarındaki hatırlatmaları görüntüleyin.') }}
        </p>
      </div>
    </div>

    <!-- Date Filter -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label for="dateFilter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('reminders.filters.date_label', 'Tarih Filtresi') }}
          </label>
          <select
            id="dateFilter"
            v-model="dateFilter"
            @change="handleDateFilterChange"
            class="form-input"
          >
            <option value="today">{{ t('reminders.filters.date_today', 'Bugün ve Öncesi') }}</option>
            <option value="today-only">{{ t('reminders.filters.date_today_only', 'Sadece Bugün') }}</option>
            <option value="tomorrow">{{ t('reminders.filters.date_tomorrow', 'Yarın') }}</option>
            <option value="week">{{ t('reminders.filters.date_week', 'Bu Hafta') }}</option>
            <option value="month">{{ t('reminders.filters.date_month', 'Bu Ay') }}</option>
            <option value="overdue">{{ t('reminders.filters.date_overdue', 'Gecikmiş') }}</option>
            <option value="all">{{ t('reminders.filters.date_all', 'Tümü') }}</option>
            <option value="custom">{{ t('reminders.filters.date_custom', 'Özel Tarih Aralığı') }}</option>
          </select>
        </div>

        <!-- Custom Date Range -->
        <template v-if="dateFilter === 'custom'">
          <div>
            <label for="startDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('reminders.filters.start_date', 'Başlangıç Tarihi') }}
            </label>
            <input
              id="startDate"
              v-model="customStartDate"
              type="date"
              @change="fetchReminders"
              class="form-input"
            />
          </div>
          <div>
            <label for="endDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('reminders.filters.end_date', 'Bitiş Tarihi') }}
            </label>
            <input
              id="endDate"
              v-model="customEndDate"
              type="date"
              @change="fetchReminders"
              class="form-input"
            />
          </div>
        </template>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>

    <!-- Reminders List -->
    <div v-else-if="reminders.length > 0" class="space-y-4">
      <div
        v-for="reminder in reminders"
        :key="reminder.id"
        class="card hover:shadow-md transition-shadow duration-200"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <!-- Customer Info -->
            <div class="flex items-center space-x-3 mb-2">
              <UserIcon class="h-5 w-5 text-indigo-600" />
              <div class="flex-1">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                  <NuxtLink
                    v-if="customerMap.get(reminder.customer)"
                    :to="`/customers/show/${reminder.customer}`"
                    class="hover:text-indigo-600"
                  >
                    {{ customerMap.get(reminder.customer).name }} {{ customerMap.get(reminder.customer).surname }}
                  </NuxtLink>
                  <NuxtLink
                    v-else-if="reminder.customerInfo"
                    :to="`/customers/show/${reminder.customer}`"
                    class="hover:text-indigo-600"
                  >
                    {{ reminder.customerInfo.name }} {{ reminder.customerInfo.surname }}
                  </NuxtLink>
                  <span v-else>{{ tp('reminders.customer_id', { id: reminder.customer }, 'Müşteri #{id}') }}</span>
                </h3>
                <!-- Phone Numbers -->
                <div v-if="customerMap.get(reminder.customer)" class="flex items-center space-x-2 mt-1 text-sm text-gray-600 dark:text-gray-400">
                  <span v-if="customerMap.get(reminder.customer).phone1">
                    📱 {{ customerMap.get(reminder.customer).phone1 }}
                  </span>
                  <span v-if="customerMap.get(reminder.customer).phone2" class="text-gray-400">|</span>
                  <span v-if="customerMap.get(reminder.customer).phone2">
                    📱 {{ customerMap.get(reminder.customer).phone2 }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Note Content -->
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-3">
              <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ reminder.note }}</p>
            </div>

            <!-- Meta Info -->
            <div class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div class="flex items-center space-x-1">
                <BellIcon class="h-4 w-4" />
                <span>{{ formatDateTime(reminder.remindingAt) }}</span>
              </div>
              <div class="flex items-center space-x-1">
                <ClockIcon class="h-4 w-4" />
                <span>{{ getTimeRemaining(reminder.remindingAt) }}</span>
              </div>
              <div v-if="reminder.userInfo" class="flex items-center space-x-1">
                <UserIcon class="h-4 w-4" />
                <span>{{ reminder.userInfo.name }}</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col space-y-2 ml-4">
            <button
              @click="markAsCompleted(reminder)"
              class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-sm font-medium"
              :title="t('reminders.actions.mark_completed', 'Tamamlandı olarak işaretle')"
            >
              <CheckIcon class="h-5 w-5" />
            </button>
            <button
              @click="editReminder(reminder)"
              class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium"
              :title="t('reminders.actions.edit', 'Düzenle')"
            >
              <PencilIcon class="h-5 w-5" />
            </button>
            <button
              @click="deleteReminder(reminder)"
              class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
              :title="t('reminders.actions.delete', 'Sil')"
            >
              <TrashIcon class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 card">
      <BellIcon class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">{{ t('reminders.empty.title', 'Hatırlatma bulunamadı') }}</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {{ t('reminders.empty.message', 'Seçilen tarih aralığında hatırlatma bulunmuyor.') }}
      </p>
    </div>

    <!-- Edit Note Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showEditModal" class="fixed inset-0 z-50 overflow-y-auto">
          <!-- Backdrop -->
          <div
            class="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/80 backdrop-blur-sm transition-opacity"
            @click="closeEditModal"
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
              <div v-if="showEditModal" class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl transition-all sm:w-full sm:max-w-lg">
                <!-- Header -->
                <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <div class="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                        <PencilIcon class="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 class="text-lg font-semibold text-white">{{ t('reminders.modal.title', 'Notu Düzenle') }}</h3>
                        <p class="text-sm text-indigo-100">{{ t('reminders.modal.subtitle', 'Hatırlatma notunu düzenleyin') }}</p>
                      </div>
                    </div>
                    <button
                      @click="closeEditModal"
                      class="rounded-lg p-2 hover:bg-white/20 transition-colors"
                    >
                      <XMarkIcon class="h-5 w-5 text-white" />
                    </button>
                  </div>
                </div>

                <!-- Content -->
                <div class="p-6">
                  <div class="space-y-4">
                    <!-- Note Textarea -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {{ t('reminders.modal.note_label', 'Not İçeriği') }}
                      </label>
                      <textarea
                        v-model="editingNote.note"
                        rows="4"
                        class="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 transition-all"
                        :placeholder="t('reminders.modal.note_placeholder', 'Not içeriğini giriniz...')"
                      ></textarea>
                    </div>

                    <!-- Reminder Option -->
                    <div>
                      <label class="flex items-center mb-3">
                        <input
                          v-model="editingNote.isReminding"
                          type="checkbox"
                          class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                        <span class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          <BellIcon class="inline h-4 w-4 mr-1" />
                          {{ t('reminders.modal.reminder_checkbox', 'Hatırlatıcı olarak ayarla') }}
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
                        <div v-if="editingNote.isReminding">
                          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {{ t('reminders.modal.reminder_datetime', 'Hatırlatma Tarihi ve Saati') }}
                          </label>
                          <input
                            v-model="editingNote.remindingAt"
                            type="datetime-local"
                            class="block w-full rounded-lg border-0 px-3 py-2 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700"
                          />
                        </div>
                      </Transition>
                    </div>
                  </div>
                </div>

                <!-- Footer -->
                <div class="border-t dark:border-gray-700 px-6 py-4">
                  <div class="flex justify-end space-x-3">
                    <button
                      @click="closeEditModal"
                      class="inline-flex items-center rounded-lg bg-gray-100 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      {{ t('reminders.modal.cancel', 'İptal') }}
                    </button>
                    <button
                      @click="saveEditedNote"
                      :disabled="!editingNote.note?.trim() || savingNote"
                      class="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <CheckIcon class="mr-2 h-4 w-4" />
                      {{ savingNote ? t('reminders.modal.saving', 'Kaydediliyor...') : t('reminders.modal.save', 'Kaydet') }}
                    </button>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import {
  BellIcon,
  UserIcon,
  ClockIcon,
  CheckIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import type { CustomerNote } from '~/types'
import { useLanguage } from '~/composables/useLanguage'

const { t, tp } = useLanguage()

// Store
const customerNotesStore = useCustomerNotesStore()
const authStore = useAuthStore()
const customersStore = useCustomersStore()

// State
const loading = ref(false)
const reminders = ref<CustomerNote[]>([])
const dateFilter = ref('today')
const customStartDate = ref('')
const customEndDate = ref('')
const customerMap = ref<Map<number, any>>(new Map())
const showEditModal = ref(false)
const editingNote = ref<CustomerNote | any>({})
const savingNote = ref(false)

// Helper functions
const getTodayDateString = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getTomorrowDateString = () => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
}

const getWeekEndDateString = () => {
  const weekEnd = new Date()
  weekEnd.setDate(weekEnd.getDate() + 7)
  return weekEnd.toISOString().split('T')[0]
}

const getMonthEndDateString = () => {
  const monthEnd = new Date()
  monthEnd.setMonth(monthEnd.getMonth() + 1)
  return monthEnd.toISOString().split('T')[0]
}

// Fetch reminders based on filter
const fetchReminders = async () => {
  loading.value = true

  try {
    let filters: any = {
      isReminding: true
    }

    const currentUserId = authStore.user?.id || useCookie('user-id').value
    if (currentUserId) {
      filters.user = parseInt(String(currentUserId))
    }

    switch (dateFilter.value) {
      case 'today':
        filters.startDate = '2020-01-01'
        filters.endDate = getTodayDateString()
        break
      case 'today-only':
        filters.today = true
        break
      case 'overdue':
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        filters.startDate = '2020-01-01'
        filters.endDate = yesterday.toISOString().split('T')[0]
        break
      case 'tomorrow':
        const tomorrow = getTomorrowDateString()
        filters.startDate = tomorrow
        filters.endDate = tomorrow
        break
      case 'week':
        filters.startDate = getTodayDateString()
        filters.endDate = getWeekEndDateString()
        break
      case 'month':
        filters.startDate = getTodayDateString()
        filters.endDate = getMonthEndDateString()
        break
      case 'all':
        filters.startDate = '2020-01-01'
        filters.endDate = '2030-12-31'
        break
      case 'custom':
        if (customStartDate.value) {
          filters.startDate = customStartDate.value
        }
        if (customEndDate.value) {
          filters.endDate = customEndDate.value
        }
        break
    }

    await customerNotesStore.fetchCustomerNotes(1, 100, filters)
    reminders.value = customerNotesStore.customerNotes || []

    const customerIds = [...new Set(reminders.value.map(r => r.customer).filter(Boolean))]
    for (const customerId of customerIds) {
      if (!customerMap.value.has(customerId)) {
        try {
          const customer = await customersStore.fetchCustomer(customerId)
          customerMap.value.set(customerId, customer)
        } catch (error) {
          console.error(`Failed to fetch customer ${customerId}:`, error)
        }
      }
    }
  } catch (error) {
    console.error('Failed to fetch reminders:', error)
    reminders.value = []
  } finally {
    loading.value = false
  }
}

const handleDateFilterChange = () => {
  if (dateFilter.value !== 'custom') {
    customStartDate.value = ''
    customEndDate.value = ''
    fetchReminders()
  }
}

const markAsCompleted = async (reminder: CustomerNote) => {
  try {
    await customerNotesStore.updateCustomerNote(reminder.id, {
      isReminding: false
    })
    reminders.value = reminders.value.filter(r => r.id !== reminder.id)
  } catch (error) {
    console.error('Failed to mark reminder as completed:', error)
  }
}

const editReminder = (reminder: CustomerNote) => {
  editingNote.value = { ...reminder }
  if (editingNote.value.remindingAt) {
    const date = new Date(editingNote.value.remindingAt)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    editingNote.value.remindingAt = `${year}-${month}-${day}T${hours}:${minutes}`
  }
  showEditModal.value = true
}

const deleteReminder = async (reminder: CustomerNote) => {
  if (!confirm(t('reminders.confirm_delete', 'Bu hatırlatmayı silmek istediğinizden emin misiniz?'))) return
  
  try {
    await customerNotesStore.deleteCustomerNote(reminder.id)
    reminders.value = reminders.value.filter(r => r.id !== reminder.id)
  } catch (error) {
    console.error('Failed to delete reminder:', error)
  }
}

const formatDateTime = (dateString: string | undefined) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getTimeRemaining = (dateString: string | undefined) => {
  if (!dateString) return ''
  
  const now = new Date()
  const reminderDate = new Date(dateString)
  const diff = reminderDate.getTime() - now.getTime()
  
  if (diff < 0) {
    const hours = Math.abs(Math.floor(diff / (1000 * 60 * 60)))
    if (hours < 24) {
      return tp('reminders.time.hours_passed', { hours }, '{hours} saat geçti')
    } else {
      const days = Math.floor(hours / 24)
      return tp('reminders.time.days_passed', { days }, '{days} gün geçti')
    }
  } else {
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours < 24) {
      return tp('reminders.time.hours_left', { hours }, '{hours} saat kaldı')
    } else {
      const days = Math.floor(hours / 24)
      return tp('reminders.time.days_left', { days }, '{days} gün kaldı')
    }
  }
}

const closeEditModal = () => {
  showEditModal.value = false
  editingNote.value = {}
}

const saveEditedNote = async () => {
  if (!editingNote.value.note?.trim()) return

  savingNote.value = true
  try {
    const updateData: any = {
      note: editingNote.value.note,
      isReminding: editingNote.value.isReminding
    }

    if (editingNote.value.isReminding && editingNote.value.remindingAt) {
      updateData.remindingAt = new Date(editingNote.value.remindingAt).toISOString()
    } else {
      updateData.remindingAt = null
    }

    await customerNotesStore.updateCustomerNote(editingNote.value.id, updateData)

    const index = reminders.value.findIndex(r => r.id === editingNote.value.id)
    if (index !== -1) {
      if (!updateData.isReminding) {
        reminders.value.splice(index, 1)
      } else {
        reminders.value[index] = {
          ...reminders.value[index],
          ...updateData
        }
      }
    }

    closeEditModal()
  } catch (error) {
    console.error('Failed to update reminder:', error)
    alert(t('reminders.error.update', 'Hatırlatma güncellenirken bir hata oluştu.'))
  } finally {
    savingNote.value = false
  }
}

onMounted(() => {
  fetchReminders()
})

useHead({
  title: 'Hatırlatmalar - Valdori CRM'
})
</script>