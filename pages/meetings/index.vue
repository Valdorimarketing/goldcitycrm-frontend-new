<template>
  <div>
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ t('meetings.title', 'Görüşmeler / Randevular') }}
        </h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-gray-400">
          {{ t('meetings.subtitle', 'Müşteri görüşmelerini ve randevularını yönetin.') }}
        </p>
      </div>
      <div class="mt-4 sm:mt-0 flex gap-3">
        <div class="relative">
          <button 
            @click="InitializeData"
            class="inline-flex items-center px-3 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition"
          >
            <ArrowPathIcon class="h-5 w-5 mr-2" />
            {{ t('meetings.actions.refresh', 'Yenile') }}
          </button>
        </div>
        <div class="inline-flex rounded-md shadow-sm">
          <button 
            @click="viewMode = 'calendar'" 
            :class="[
              viewMode === 'calendar'
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600',
              'inline-flex items-center justify-center rounded-l-md px-3 py-2 text-sm font-semibold border border-gray-300 dark:border-gray-600'
            ]"
          >
            <CalendarIcon class="h-5 w-5 mr-1.5" />
            {{ t('meetings.view_mode.calendar', 'Takvim') }}
          </button>
          <button 
            @click="viewMode = 'table'" 
            :class="[
              viewMode === 'table'
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600',
              'inline-flex items-center justify-center rounded-r-md px-3 py-2 text-sm font-semibold border border-l-0 border-gray-300 dark:border-gray-600'
            ]"
          >
            <TableCellsIcon class="h-5 w-5 mr-1.5" />
            {{ t('meetings.view_mode.list', 'Liste') }}
          </button>
        </div>
        <button 
          v-if="viewMode === 'table'" 
          @click="resetFilters"
          class="inline-flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          {{ t('meetings.actions.clear_filters', 'Filtreleri Temizle') }}
        </button>
        <button 
          @click="openCreateModal"
          class="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          <PlusIcon class="-ml-0.5 mr-1.5 h-5 w-5" />
          {{ t('meetings.actions.new_meeting', 'Yeni Görüşme') }}
        </button>
      </div>
    </div>

    <!-- Filters (only show in table view) -->
    <div v-if="viewMode === 'table'" class="card mb-6">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('meetings.filters.search_customer', 'Müşteri Ara') }}
          </label>
          <input 
            v-model="filters.customerSearch" 
            type="text" 
            class="form-input" 
            :placeholder="t('meetings.filters.customer_placeholder', 'Müşteri adı...')" 
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('meetings.filters.status', 'Durum') }}
          </label>
          <select v-model="filters.status" class="form-input">
            <option value="">{{ t('meetings.filters.all_statuses', 'Tümü') }}</option>
            <option v-for="status in meetingStatuses" :key="status.id" :value="status.id">
              {{ status.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('meetings.filters.hospital', 'Hastane') }}
          </label>
          <input 
            v-model="filters.hospitalSearch" 
            type="text" 
            class="form-input" 
            :placeholder="t('meetings.filters.hospital_placeholder', 'Hastane adı...')" 
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('meetings.filters.doctor', 'Doktor') }}
          </label>
          <input 
            v-model="filters.doctorSearch" 
            type="text" 
            class="form-input" 
            :placeholder="t('meetings.filters.doctor_placeholder', 'Doktor adı...')" 
          />
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>

    <!-- Calendar View -->
    <MeetingCalendar 
      v-else-if="viewMode === 'calendar'" 
      :meetings="meetings" 
      :statuses="meetingStatuses" 
      :loading="loading"
      @event-click="handleEventClick" 
      @date-select="handleDateSelect" 
    />

    <!-- Meetings Table -->
    <div v-else-if="viewMode === 'table'" class="card">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="table-header text-gray-700 dark:text-gray-300">
                {{ t('meetings.table.id', 'ID') }}
              </th>
              <th class="table-header text-gray-700 dark:text-gray-300">
                {{ t('meetings.table.customer', 'Müşteri') }}
              </th>
              <th class="table-header text-gray-700 dark:text-gray-300">
                {{ t('meetings.table.hospital', 'Hastane') }}
              </th>
              <th class="table-header text-gray-700 dark:text-gray-300">
                {{ t('meetings.table.doctor', 'Doktor') }}
              </th>
              <th class="table-header text-gray-700 dark:text-gray-300">
                {{ t('meetings.table.start_time', 'Başlangıç') }}
              </th>
              <th class="table-header text-gray-700 dark:text-gray-300">
                {{ t('meetings.table.end_time', 'Bitiş') }}
              </th>
              <th class="table-header text-gray-700 dark:text-gray-300">
                {{ t('meetings.table.status', 'Durum') }}
              </th>
              <th class="table-header text-gray-700 dark:text-gray-300">
                {{ t('meetings.table.actions', 'İşlemler') }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr 
              v-for="meeting in filteredMeetings" 
              :key="meeting.id"
              :class="isPastMeeting(meeting.startTime) ? 'bg-gray-50 dark:bg-gray-800/50' : ''"
            >
              <td class="table-cell">
                <span class="text-sm font-medium text-gray-900 dark:text-gray-100">
                  #{{ meeting.id }}
                </span>
              </td>
              <td class="table-cell">
                <div class="text-sm text-gray-900 dark:text-gray-100">
                  {{ meeting.customerData.name }} {{ meeting.customerData?.surname }}
                </div>
              </td>
              <td class="table-cell">
                <div class="text-sm text-gray-900 dark:text-gray-100">
                  {{ meeting.hospital?.name || '-' }}
                </div>
              </td>
              <td class="table-cell">
                <div class="text-sm text-gray-900 dark:text-gray-100">
                  {{ meeting.doctor?.name || '-' }}
                </div>
              </td>
              <td class="table-cell">
                <div class="text-sm text-gray-900 dark:text-gray-100">
                  {{ formatDateTime(meeting.startTime) }}
                </div>
              </td>
              <td class="table-cell">
                <div class="text-sm text-gray-900 dark:text-gray-100">
                  {{ formatDateTime(meeting.endTime) }}
                </div>
              </td>
              <td class="table-cell">
                <span :class="getStatusBadgeClass(meeting.meetingStatusId)">
                  {{ getStatusName(meeting.meetingStatusId) }}
                </span>
              </td>
              <td class="table-cell">
                <div class="flex gap-1">
                  <button 
                    @click="viewMeeting(meeting)"
                    class="relative group p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    :title="t('meetings.actions.view', 'Görüntüle')"
                  >
                    <EyeIcon class="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  </button>
                  <NuxtLink 
                    :to="`/meetings/edit/${meeting.id}`"
                    class="relative group p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    :title="t('meetings.actions.edit', 'Düzenle')"
                  >
                    <PencilIcon class="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  </NuxtLink>
                  <button
                    v-if="isAdmin"
                    @click="confirmDelete(meeting)"
                    class="relative group p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    :title="t('meetings.actions.delete', 'Sil')"
                  >
                    <TrashIcon class="h-4 w-4 text-red-600 dark:text-red-400" />
                  </button> 
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="filteredMeetings.length === 0">
              <td colspan="8" class="text-center py-12">
                <CalendarIcon class="mx-auto h-12 w-12 text-gray-400" />
                <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  {{ t('meetings.empty.title', 'Görüşme bulunamadı') }}
                </h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {{ t('meetings.empty.message', 'Henüz görüşme eklenmemiş veya filtrelerinize uygun sonuç bulunamadı.') }}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div 
        v-if="meta.total > meta.limit"
        class="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 sm:px-6"
      >
        <div class="flex flex-1 justify-between sm:hidden">
          <button 
            :disabled="meta.page === 1" 
            @click="changePage(meta.page - 1)"
            class="relative inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            {{ t('meetings.pagination.previous', 'Önceki') }}
          </button>
          <button 
            :disabled="meta.page * meta.limit >= meta.total" 
            @click="changePage(meta.page + 1)"
            class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            {{ t('meetings.pagination.next', 'Sonraki') }}
          </button>
        </div>
        <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700 dark:text-gray-400">
              {{ tp('meetings.pagination.results', { 
                start: ((meta.page - 1) * meta.limit) + 1,
                end: Math.min(meta.page * meta.limit, meta.total),
                total: meta.total
              }, '{start} - {end} arası, toplam {total} sonuç') }}
            </p>
          </div>
          <div>
            <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm">
              <button 
                :disabled="meta.page === 1" 
                @click="changePage(meta.page - 1)"
                class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <ChevronLeftIcon class="h-5 w-5" />
              </button>

              <button 
                v-for="page in visiblePages" 
                :key="page" 
                @click="changePage(page)" 
                :class="[
                  page === meta.page
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-900 dark:text-gray-300 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700',
                  'relative inline-flex items-center px-4 py-2 text-sm font-semibold'
                ]"
              >
                {{ page }}
              </button>

              <button 
                :disabled="meta.page * meta.limit >= meta.total" 
                @click="changePage(meta.page + 1)"
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
                  {{ t('meetings.delete_modal.title', 'Görüşmeyi Sil') }}
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ t('meetings.delete_modal.message', 'Bu görüşmeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.') }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button 
              @click="handleDelete"
              class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
            >
              {{ t('meetings.delete_modal.confirm', 'Sil') }}
            </button>
            <button 
              @click="showDeleteModal = false"
              class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-600 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 sm:mt-0 sm:w-auto"
            >
              {{ t('meetings.delete_modal.cancel', 'İptal') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- View Meeting Modal -->
    <div v-if="showViewModal && selectedMeeting" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
        <div 
          class="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-80 transition-opacity"
          @click="showViewModal = false"
        ></div>

        <div class="inline-block transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:align-middle">
          <div class="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ t('meetings.view_modal.title', 'Görüşme Detayları') }}
              </h3>
              <button @click="showViewModal = false" class="text-gray-400 hover:text-gray-500">
                <span class="sr-only">Kapat</span>
                <XMarkIcon class="h-6 w-6" />
              </button>
            </div>

            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    {{ t('meetings.view_modal.customer', 'Müşteri') }}
                  </label>
                  <p class="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {{ selectedMeeting.customerData.name }} {{ selectedMeeting.customerData.surname }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    {{ t('meetings.view_modal.status', 'Durum') }}
                  </label>
                  <p class="mt-1">
                    <span :class="getStatusBadgeClass(selectedMeeting.meetingStatusId)">
                      {{ getStatusName(selectedMeeting.meetingStatusId) }}
                    </span>
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    {{ t('meetings.view_modal.hospital', 'Hastane') }}
                  </label>
                  <p class="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {{ selectedMeeting.hospital?.name || '-' }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    {{ t('meetings.view_modal.doctor', 'Doktor') }}
                  </label>
                  <p class="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {{ selectedMeeting.doctor?.name || '-' }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    {{ t('meetings.view_modal.start_time', 'Başlangıç Zamanı') }}
                  </label>
                  <p class="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {{ formatDateTime(selectedMeeting.startTime) }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    {{ t('meetings.view_modal.end_time', 'Bitiş Zamanı') }}
                  </label>
                  <p class="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {{ formatDateTime(selectedMeeting.endTime) }}
                  </p>
                </div>
                <div v-if="selectedMeeting.remindingAt">
                  <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    {{ t('meetings.view_modal.reminder_time', 'Hatırlatma Zamanı') }}
                  </label>
                  <p class="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {{ formatDateTime(selectedMeeting.remindingAt) }}
                  </p>
                </div>
              </div>

              <div v-if="selectedMeeting.description">
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  {{ t('meetings.view_modal.description', 'Açıklama') }}
                </label>
                <p class="mt-1 text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                  {{ selectedMeeting.description }}
                </p>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <NuxtLink 
              :to="`/meetings/edit/${selectedMeeting.id}`"
              class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
            >
              {{ t('meetings.view_modal.edit_button', 'Düzenle') }}
            </NuxtLink>
            <button 
              @click="showViewModal = false"
              class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-600 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 sm:mt-0 sm:w-auto"
            >
              {{ t('meetings.view_modal.close_button', 'Kapat') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Meeting Modal -->
    <MeetingCreateModal 
      v-model="showCreateModal" 
      :initial-start-time="selectedStartTime"
      :initial-end-time="selectedEndTime" 
      @created="handleMeetingCreated" 
    />
  </div>
</template>

<script setup>
import {
  PlusIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  TableCellsIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/outline'
import { useLanguage } from '~/composables/useLanguage'

const { t, tp } = useLanguage()

definePageMeta({
  middleware: ['auth']
})

const { meetings, loading, error, meta, fetchMeetings, deleteMeeting } = useMeetings()
const { statuses: meetingStatuses, fetchMeetingStatuses } = useMeetingStatuses()
const { isAdmin } = usePermissions()

// Filters
const filters = ref({
  customerSearch: '',
  status: '',
  hospitalSearch: '',
  doctorSearch: ''
})

// View mode
const viewMode = ref('calendar') // 'calendar' or 'table'

// Modals
const showDeleteModal = ref(false)
const showViewModal = ref(false)
const showCreateModal = ref(false)
const meetingToDelete = ref(null)
const selectedMeeting = ref(null)
const selectedStartTime = ref(null)
const selectedEndTime = ref(null)

// Computed
const filteredMeetings = computed(() => {
  let filtered = meetings.value

  if (filters.value.hospitalSearch) {
    const search = filters.value.hospitalSearch.toLowerCase()
    filtered = filtered.filter(m =>
      m.hospital?.name?.toLowerCase().includes(search)
    )
  }

  if (filters.value.doctorSearch) {
    const search = filters.value.doctorSearch.toLowerCase()
    filtered = filtered.filter(m =>
      m.doctor?.name?.toLowerCase().includes(search)
    )
  }

  // Sort by start time (upcoming first)
  return filtered.sort((a, b) => {
    const dateA = a.startTime ? new Date(a.startTime).getTime() : 0
    const dateB = b.startTime ? new Date(b.startTime).getTime() : 0
    return dateA - dateB
  })
})

const visiblePages = computed(() => {
  const pages = []
  const totalPages = Math.ceil(meta.value.total / meta.value.limit)
  const current = meta.value.page

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      pages.push(1, 2, 3, 4, 5, '...', totalPages)
    } else if (current >= totalPages - 3) {
      pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', totalPages)
    }
  }

  return pages.filter(page => page !== '...')
})

const getStatusName = (statusId) => {
  const status = meetingStatuses.value.find(s => s.id === statusId)
  return status?.name || t('meetings.status.unknown', 'Bilinmiyor')
}

const getStatusBadgeClass = (statusId) => {
  const status = meetingStatuses.value.find(s => s.id === statusId)

  if (!status) {
    return 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }

  // Durum tipine göre renk
  if (status.is_sale) {
    return 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
  }
  if (status.is_closed) {
    return 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
  }

  return 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
}

const formatDateTime = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('tr-TR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const isPastMeeting = (startTime) => {
  if (!startTime) return false
  return new Date(startTime) < new Date()
}

const resetFilters = () => {
  filters.value = {
    customerSearch: '',
    status: '',
    hospitalSearch: '',
    doctorSearch: ''
  }
}

const changePage = (page) => {
  fetchMeetings({
    page,
    limit: meta.value.limit,
    status: filters.value.status || undefined
  })
}

const viewMeeting = (meeting) => {
  selectedMeeting.value = meeting
  showViewModal.value = true
}

const confirmDelete = (meeting) => {
  meetingToDelete.value = meeting
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (!meetingToDelete.value) return

  try {
    await deleteMeeting(meetingToDelete.value.id)

    // Refresh list
    await fetchMeetings({
      page: meta.value.page,
      limit: meta.value.limit,
      status: filters.value.status || undefined
    })

    showDeleteModal.value = false
    meetingToDelete.value = null
  } catch (err) {
    console.error('Failed to delete meeting:', err)
  }
}

const openCreateModal = () => {
  selectedStartTime.value = null
  selectedEndTime.value = null
  showCreateModal.value = true
}

const handleEventClick = (meeting) => {
  // Navigate to edit page
  navigateTo(`/meetings/edit/${meeting.id}`)
}

const handleDateSelect = (dateInfo) => {
  selectedStartTime.value = dateInfo.start
  selectedEndTime.value = dateInfo.end
  showCreateModal.value = true
}

const handleMeetingCreated = async () => {
  // Refresh meetings list
  await fetchMeetings({
    page: meta.value.page,
    limit: meta.value.limit,
    status: filters.value.status || undefined
  })
}

// Watch filters
watch(() => filters.value.status, (newStatus) => {
  fetchMeetings({
    page: 1,
    limit: meta.value.limit,
    status: newStatus || undefined
  })
})

const InitializeData = async () => {
  await fetchMeetingStatuses()
  await fetchMeetings({
    page: 1,
    limit: 20
  })
}

// Initialize
onMounted(async () => {
  await InitializeData()
})

// Page head
useHead({
  title: 'Görüşmeler - Valdori CRM'
})
</script>