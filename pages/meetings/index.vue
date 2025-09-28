<template>
  <div>
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Toplantılar</h1>
        <p class="mt-2 text-sm text-gray-700">
          Tüm toplantılarınızı buradan yönetebilirsiniz.
        </p>
      </div>
      <div class="mt-4 sm:mt-0">
        <NuxtLink
          to="/meetings/new"
          class="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          <PlusIcon class="-ml-0.5 mr-1.5 h-5 w-5" />
          Yeni Toplantı
        </NuxtLink>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div>
          <label for="search" class="block text-sm font-medium text-gray-700 mb-2">
            Ara
          </label>
          <input
            id="search"
            v-model="searchTerm"
            type="text"
            class="form-input"
            placeholder="Başlık veya müşteri adı..."
          />
        </div>
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
            Durum
          </label>
          <select
            id="status"
            v-model="statusFilter"
            class="form-input"
          >
            <option value="">Tüm Durumlar</option>
            <option value="scheduled">Planlandı</option>
            <option value="confirmed">Onaylandı</option>
            <option value="completed">Tamamlandı</option>
            <option value="cancelled">İptal</option>
          </select>
        </div>
        <div>
          <label for="dateRange" class="block text-sm font-medium text-gray-700 mb-2">
            Tarih
          </label>
          <select
            id="dateRange"
            v-model="dateFilter"
            class="form-input"
          >
            <option value="">Tüm Tarihler</option>
            <option value="today">Bugün</option>
            <option value="tomorrow">Yarın</option>
            <option value="week">Bu Hafta</option>
            <option value="month">Bu Ay</option>
          </select>
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

    <!-- Meetings Calendar View Toggle -->
    <div class="flex justify-end mb-4">
      <div class="bg-gray-100 p-1 rounded-lg">
        <button
          @click="viewMode = 'list'"
          :class="[
            viewMode === 'list' ? 'bg-white shadow-sm' : '',
            'px-3 py-1 text-sm font-medium rounded-md'
          ]"
        >
          Liste
        </button>
        <button
          @click="viewMode = 'calendar'"
          :class="[
            viewMode === 'calendar' ? 'bg-white shadow-sm' : '',
            'px-3 py-1 text-sm font-medium rounded-md'
          ]"
        >
          Takvim
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>

    <!-- List View -->
    <div v-else-if="viewMode === 'list'" class="space-y-4">
      <div
        v-for="meeting in filteredMeetings"
        :key="meeting.id"
        class="card hover:shadow-md transition-shadow duration-200"
      >
        <div class="flex items-start justify-between">
          <!-- Meeting Info -->
          <div class="flex-1">
            <div class="flex items-center space-x-3 mb-2">
              <CalendarIcon class="h-5 w-5 text-indigo-600" />
              <h3 class="text-lg font-medium text-gray-900">
                Toplantı #{{ meeting.id }}
              </h3>
              <span
                v-if="meeting.meetingStatusInfo"
                class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                :class="getStatusClass(meeting.meetingStatusInfo.name)"
              >
                {{ meeting.meetingStatusInfo.name }}
              </span>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
              <div class="flex items-center space-x-2">
                <ClockIcon class="h-4 w-4" />
                <span>{{ formatDateTime(meeting.startTime) }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <UserIcon class="h-4 w-4" />
                <span>{{ meeting.customerInfo ? `${meeting.customerInfo.name} ${meeting.customerInfo.surname}` : 'Müşteri belirtilmemiş' }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <MapPinIcon class="h-4 w-4" />
                <span>{{ meeting.meetingLocationInfo?.name || 'Konum belirtilmemiş' }}</span>
              </div>
              <div v-if="meeting.salesProduct" class="flex items-center space-x-2">
                <CubeIcon class="h-4 w-4" />
                <span class="text-indigo-600 font-medium">{{ meeting.salesProduct.name }}</span>
              </div>
            </div>
            
            <p v-if="meeting.description" class="mt-2 text-sm text-gray-600">
              {{ meeting.description }}
            </p>
          </div>

          <!-- Actions -->
          <div class="flex space-x-2 ml-4">
            <NuxtLink
              :to="`/meetings/${meeting.id}/edit`"
              class="text-yellow-600 hover:text-yellow-900 text-sm font-medium"
            >
              Düzenle
            </NuxtLink>
            <button
              @click="confirmDelete(meeting)"
              class="text-red-600 hover:text-red-900 text-sm font-medium"
            >
              Sil
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredMeetings.length === 0" class="text-center py-12 card">
        <CalendarIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">Toplantı bulunamadı</h3>
        <p class="mt-1 text-sm text-gray-500">
          {{ searchTerm ? 'Arama kriterlerinize uygun toplantı bulunamadı.' : 'Henüz toplantı planlanmamış.' }}
        </p>
        <div class="mt-6">
          <NuxtLink
            to="/meetings/new"
            class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            <PlusIcon class="-ml-0.5 mr-1.5 h-5 w-5" />
            İlk toplantıyı planla
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Calendar View -->
    <div v-else class="card">
      <div class="text-center py-12">
        <CalendarIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">Takvim Görünümü</h3>
        <p class="mt-1 text-sm text-gray-500">
          Takvim görünümü yakında eklenecek.
        </p>
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
                  Toplantıyı Sil
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    <strong>Toplantı #{{ meetingToDelete?.id }}</strong> silmek istediğinizden emin misiniz? 
                    Bu işlem geri alınamaz.
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
  </div>
</template>

<script setup lang="ts">
import {
  PlusIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  MapPinIcon,
  ExclamationTriangleIcon,
  CubeIcon
} from '@heroicons/vue/24/outline'
import type { Meeting } from '~/types'

// definePageMeta({
//   middleware: 'auth'
// })

// View mode and filters
const viewMode = ref('list')
const searchTerm = ref('')
const statusFilter = ref('')
const dateFilter = ref('')
const loading = ref(false)

// Delete modal
const showDeleteModal = ref(false)
const meetingToDelete = ref<Meeting | null>(null)

// Store
const meetingsStore = useMeetingsStore()

// Load meetings from API
onMounted(async () => {
  try {
    await meetingsStore.fetchMeetings(1, 100)
  } catch (error) {
    console.error('Failed to load meetings:', error)
  }
})

// Computed properties
const filteredMeetings = computed(() => {
  let filtered = meetingsStore.meetings || []

  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(meeting =>
      meeting.description?.toLowerCase().includes(search) ||
      meeting.customerInfo?.name?.toLowerCase().includes(search) ||
      meeting.customerInfo?.surname?.toLowerCase().includes(search) ||
      meeting.salesProduct?.name?.toLowerCase().includes(search)
    )
  }

  if (statusFilter.value) {
    // Convert status filter string to ID if needed
    // This would need mapping based on actual status IDs from API
  }

  if (dateFilter.value && filtered.length > 0) {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
    
    filtered = filtered.filter(meeting => {
      if (!meeting.startTime) return false
      const meetingDate = new Date(meeting.startTime)
      switch (dateFilter.value) {
        case 'today':
          return meetingDate.toDateString() === today.toDateString()
        case 'tomorrow':
          return meetingDate.toDateString() === tomorrow.toDateString()
        case 'week':
          const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
          return meetingDate >= today && meetingDate <= weekFromNow
        case 'month':
          return meetingDate.getMonth() === now.getMonth() && meetingDate.getFullYear() === now.getFullYear()
        default:
          return true
      }
    })
  }

  // Sort by date
  return filtered.sort((a, b) => {
    const dateA = a.startTime ? new Date(a.startTime).getTime() : 0
    const dateB = b.startTime ? new Date(b.startTime).getTime() : 0
    return dateA - dateB
  })
})

// Methods
const resetFilters = () => {
  searchTerm.value = ''
  statusFilter.value = ''
  dateFilter.value = ''
}

const confirmDelete = (meeting) => {
  meetingToDelete.value = meeting
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (meetingToDelete.value) {
    try {
      await meetingsStore.deleteMeeting(meetingToDelete.value.id)
    } catch (error) {
      console.error('Error deleting meeting:', error)
    }
  }
  showDeleteModal.value = false
  meetingToDelete.value = null
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

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('tr-TR')
}

const getStatusClass = (status: string | undefined) => {
  if (!status) return 'bg-gray-100 text-gray-800'
  
  const statusLower = status.toLowerCase()
  if (statusLower.includes('planla')) return 'bg-blue-100 text-blue-800'
  if (statusLower.includes('onay')) return 'bg-green-100 text-green-800'
  if (statusLower.includes('tamamla')) return 'bg-gray-100 text-gray-800'
  if (statusLower.includes('iptal')) return 'bg-red-100 text-red-800'
  
  return 'bg-gray-100 text-gray-800'
}

// Page head
useHead({
  title: 'Toplantılar - Valdori CRM'
})
</script> 