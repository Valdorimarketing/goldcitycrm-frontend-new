<template>
  <div>
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Toplantı Detayı</h1>
        <p class="mt-2 text-sm text-gray-700">
          Toplantı #{{ meetingId }} detayları
        </p>
      </div>
      <div class="mt-4 sm:mt-0 space-x-3">
        <NuxtLink
          :to="`/meetings/${meetingId}/edit`"
          class="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          Düzenle
        </NuxtLink>
        <button
          @click="confirmDelete"
          class="inline-flex items-center justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
        >
          Sil
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>

    <!-- Meeting Details -->
    <div v-else-if="meeting" class="space-y-6">
      <!-- Main Info Card -->
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Genel Bilgiler</h2>
        
        <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <!-- Customer -->
          <div>
            <dt class="text-sm font-medium text-gray-500">Müşteri</dt>
            <dd class="mt-1 text-sm text-gray-900">
              <NuxtLink 
                v-if="meeting.customerInfo"
                :to="`/customers/${meeting.customer}`"
                class="text-indigo-600 hover:text-indigo-900"
              >
                {{ meeting.customerInfo.name }} {{ meeting.customerInfo.surname }}
              </NuxtLink>
              <span v-else>-</span>
            </dd>
          </div>

          <!-- Sales Product -->
          <div>
            <dt class="text-sm font-medium text-gray-500">İlgili Satış Ürünü</dt>
            <dd class="mt-1 text-sm text-gray-900">
              <span v-if="meeting.salesProduct" class="inline-flex items-center">
                <CubeIcon class="h-4 w-4 mr-1 text-indigo-600" />
                <span class="font-medium text-indigo-600">{{ meeting.salesProduct.name }}</span>
                <span class="ml-2 text-gray-500">₺{{ formatCurrency(meeting.salesProduct.price) }}</span>
              </span>
              <span v-else>-</span>
            </dd>
          </div>

          <!-- Location -->
          <div>
            <dt class="text-sm font-medium text-gray-500">Konum</dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{ meeting.meetingLocationInfo?.name || '-' }}
            </dd>
          </div>

          <!-- Status -->
          <div>
            <dt class="text-sm font-medium text-gray-500">Durum</dt>
            <dd class="mt-1">
              <span
                v-if="meeting.meetingStatusInfo"
                class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                :class="getStatusClass(meeting.meetingStatusInfo.name)"
              >
                {{ meeting.meetingStatusInfo.name }}
              </span>
              <span v-else>-</span>
            </dd>
          </div>

          <!-- Start Time -->
          <div>
            <dt class="text-sm font-medium text-gray-500">Başlangıç Zamanı</dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{ formatDateTime(meeting.startTime) }}
            </dd>
          </div>

          <!-- End Time -->
          <div>
            <dt class="text-sm font-medium text-gray-500">Bitiş Zamanı</dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{ formatDateTime(meeting.endTime) }}
            </dd>
          </div>

          <!-- Reminding At -->
          <div>
            <dt class="text-sm font-medium text-gray-500">Hatırlatma Zamanı</dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{ formatDateTime(meeting.remindingAt) }}
            </dd>
          </div>

          <!-- Responsible User -->
          <div>
            <dt class="text-sm font-medium text-gray-500">Sorumlu Kullanıcı</dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{ meeting.userInfo?.name || '-' }}
            </dd>
          </div>
        </dl>
      </div>

      <!-- Description Card -->
      <div v-if="meeting.description" class="card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Açıklama</h2>
        <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ meeting.description }}</p>
      </div>

      <!-- Metadata Card -->
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Sistem Bilgileri</h2>
        
        <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div>
            <dt class="text-sm font-medium text-gray-500">Oluşturulma Tarihi</dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{ formatDateTime(meeting.createdAt) }}
            </dd>
          </div>
          
          <div>
            <dt class="text-sm font-medium text-gray-500">Son Güncelleme</dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{ formatDateTime(meeting.updatedAt) }}
            </dd>
          </div>
        </dl>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="text-center py-12">
      <p class="text-gray-500">Toplantı bulunamadı.</p>
      <NuxtLink to="/meetings" class="text-indigo-600 hover:text-indigo-900 mt-2 inline-block">
        Toplantı listesine dön
      </NuxtLink>
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
                    Bu toplantıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
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
  ExclamationTriangleIcon,
  CubeIcon
} from '@heroicons/vue/24/outline'
import type { Meeting } from '~/types'

const route = useRoute()
const router = useRouter()
const meetingsStore = useMeetingsStore()

const loading = ref(true)
const meeting = ref<Meeting | null>(null)
const showDeleteModal = ref(false)
const meetingId = parseInt(route.params.id as string)

// Load meeting data
onMounted(async () => {
  try {
    meeting.value = await meetingsStore.fetchMeeting(meetingId)
  } catch (error) {
    console.error('Failed to load meeting:', error)
  } finally {
    loading.value = false
  }
})

// Delete functions
const confirmDelete = () => {
  showDeleteModal.value = true
}

const handleDelete = async () => {
  try {
    await meetingsStore.deleteMeeting(meetingId)
    router.push('/meetings')
  } catch (error) {
    console.error('Failed to delete meeting:', error)
    alert('Toplantı silinirken bir hata oluştu!')
  }
  showDeleteModal.value = false
}

// Helper functions
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

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('tr-TR').format(amount)
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
  title: `Toplantı #${meetingId} - Valdori CRM`
})
</script>