<template>
  <div class="min-h-[80vh] bg-gray-50 dark:bg-gray-900 px-4 py-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {{ isOwnProfile ? 'İş Akışım' : `${profileUser?.name || 'Kullanıcı'} - İş Akışı` }}
            </h1>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ isOwnProfile ? 'Bugünkü aktiviteleriniz ve görevleriniz' : 'Kullanıcının aktiviteleri ve görevleri' }}
            </p>
          </div>
          <NuxtLink
            v-if="!isOwnProfile"
            to="/profile"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
          >
            ← Kendi Profilim
          </NuxtLink>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loadingProfile" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>

      <!-- User Not Found -->
      <div v-else-if="!profileUser" class="text-center py-12">
        <UserIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Kullanıcı Bulunamadı</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Bu kullanıcı mevcut değil veya erişim yetkiniz yok.
        </p>
        <div class="mt-6">
          <NuxtLink
            to="/profile"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Kendi Profilime Dön
          </NuxtLink>
        </div>
      </div>

      <!-- Profile Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Sol Kolon: Profil ve Özet Kartlar -->
        <div class="relative">
          <div class="space-y-6 sticky top-6">
            <!-- Profil Kartı -->
            <div class="card text-center">
              <div class="flex justify-center mb-4">
                <div class="relative">
                  <img
                    v-if="profileUser?.avatar"
                    :src="path + profileUser.avatar"
                    alt="Avatar"
                    class="w-24 h-24 rounded-full object-cover border-4 border-indigo-500 shadow-md"
                  />
                  <div
                    v-else
                    class="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-bold text-white border-4 border-indigo-500 shadow-md"
                  >
                    {{ profileUser?.name?.charAt(0) || 'U' }}
                  </div>
                  <!-- Online Badge -->
                  <span
                    v-if="isUserOnline"
                    class="absolute bottom-0 right-0 block"
                  >
                    <span class="relative flex h-4 w-4">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white dark:border-gray-800"></span>
                    </span>
                  </span>
                  <span
                    v-else
                    class="absolute bottom-0 right-0 block h-4 w-4 rounded-full bg-gray-400 ring-2 ring-white dark:ring-gray-800"
                  ></span>
                </div>
              </div>

              <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-1">
                {{ profileUser?.name || 'Bilinmeyen Kullanıcı' }}
              </h2>

              <p class="text-indigo-500 dark:text-indigo-400 mb-1 text-sm font-medium">
                {{ getRoleLabel(profileUser?.role) }}
              </p>

              <p class="text-gray-500 dark:text-gray-400 text-sm mb-4">
                {{ profileUser?.email || '-' }}
              </p>

              <!-- User Group & Team Info -->
              <div v-if="profileUser?.userGroup || profileUser?.userTeam" class="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4 space-y-2">
                <div v-if="profileUser?.userGroup" class="text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Grup:</span>
                  <span class="ml-2 font-semibold text-gray-900 dark:text-white">{{ profileUser.userGroup.name }}</span>
                </div>
                <div v-if="profileUser?.userTeam" class="text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Takım:</span>
                  <span class="ml-2 font-semibold text-gray-900 dark:text-white">{{ profileUser.userTeam.name }}</span>
                </div>
              </div>

              <!-- Quick Stats -->
              <div class="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Bugün Eklenen:</span>
                  <span class="font-semibold text-gray-900 dark:text-white">{{ todayStats.added }}</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Güncellenen:</span>
                  <span class="font-semibold text-gray-900 dark:text-white">{{ todayStats.updated }}</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Not Eklenen:</span>
                  <span class="font-semibold text-gray-900 dark:text-white">{{ todayStats.notes }}</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Satış:</span>
                  <span class="font-semibold text-gray-900 dark:text-white">{{ todayStats.sales }}</span>
                </div>
              </div>

              <!-- Last Seen -->
              <div v-if="profileUser?.lastActiveTime" class="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Son görülme: {{ formatTimeAgo(profileUser.lastActiveTime) }}
                </p>
              </div>
            </div>

       
          </div>
        </div>

        <!-- Sağ Kolon: Timeline -->
        <div class="lg:col-span-2">
          <div class="card">
            <!-- Header with Search -->
            <div class="mb-6 space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Aktivite Geçmişi</h3>
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  {{ filteredTimeline.length }} aktivite
                </span>
              </div>

              <!-- Search -->
              <div class="relative">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Müşteri adı ile ara..."
                  class="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 py-2 pr-10 transition-colors"
                />
                <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <button
                  v-if="searchQuery"
                  @click="searchQuery = ''"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon class="h-5 w-5" />
                </button>
              </div>

              <!-- Time Filters -->
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="filter in timeFilters"
                  :key="filter.value"
                  @click="selectedTimeFilter = filter.value"
                  :class="[
                    'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                    selectedTimeFilter === filter.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  ]"
                >
                  {{ filter.label }}
                </button>
              </div>

              <!-- Action Filters -->
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="filter in timelineFilters"
                  :key="filter.value"
                  @click="selectedFilter = filter.value"
                  :class="[
                    'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                    selectedFilter === filter.value
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  ]"
                >
                  {{ filter.label }}
                </button>
              </div>

              <!-- Clear Filters -->
              <div v-if="searchQuery || selectedTimeFilter !== 'all' || selectedFilter !== 'all'" class="flex items-center justify-end">
                <button
                  @click="clearFilters"
                  class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Filtreleri Temizle
                </button>
              </div>
            </div>

            <!-- Loading -->
            <div v-if="loadingTimeline" class="flex justify-center py-12">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>

            <!-- Empty State -->
            <div v-else-if="filteredTimeline.length === 0" class="text-center py-12">
              <ClockIcon class="mx-auto h-12 w-12 text-gray-400" />
              <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                {{ searchQuery || selectedTimeFilter !== 'all' || selectedFilter !== 'all' 
                  ? 'Filtrelere uygun aktivite bulunamadı' 
                  : 'Henüz aktivite yok' 
                }}
              </h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {{ searchQuery || selectedTimeFilter !== 'all' || selectedFilter !== 'all'
                  ? 'Farklı filtreler deneyebilirsiniz'
                  : isOwnProfile 
                    ? 'Müşterilerle ilgili işlemler yaptığınızda burada görünecek.' 
                    : 'Kullanıcının henüz bir aktivitesi bulunmuyor.'
                }}
              </p>
            </div>

            <!-- Timeline -->
            <div v-else class="flow-root">
              <ul role="list" class="-mb-8">
                <li v-for="(event, eventIdx) in filteredTimeline" :key="event.id">
                  <div class="relative pb-8">
                    <!-- Line -->
                    <span
                      v-if="eventIdx !== filteredTimeline.length - 1"
                      class="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                      aria-hidden="true"
                    />

                    <div class="relative flex items-start space-x-3">
                      <!-- Icon -->
                      <div class="relative">
                        <div :class="[
                          'relative h-10 w-10 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-900',
                          getEventColor(event.action)
                        ]">
                          <component :is="getEventIcon(event.action)" class="h-5 w-5 text-white" />
                        </div>
                        <!-- Status Badges -->
                        <span v-if="isHotStatus(event)" class="absolute -top-1 -right-1 flex h-4 w-4">
                          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span class="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                        </span>
                        <span v-else-if="isReminderStatus(event)" class="absolute -top-1 -right-1 flex h-4 w-4">
                          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                          <span class="relative inline-flex rounded-full h-4 w-4 bg-yellow-500"></span>
                        </span>
                      </div>

                      <!-- Content -->
                      <div class="min-w-0 flex-1">
                        <div>
                          <div class="flex items-center gap-2">
                            <span class="font-medium text-gray-900 dark:text-white text-sm">
                              {{ event.action }}
                            </span>
                            <!-- Priority Badges -->
                            <span v-if="isHotStatus(event)" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                              🔥 Sıcak Satış
                            </span>
                            <span v-else-if="isReminderStatus(event)" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                              ⏰ Tekrar Aranacak
                            </span>
                          </div>
                          <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                            {{ formatTimeAgo(event.createdAt) }}
                          </p>
                        </div>

                        <div class="mt-2 text-sm text-gray-700 dark:text-gray-300">
                          <!-- Customer Info -->
                          <div v-if="event.customer" class="flex items-center gap-2 mb-2">
                            <div class="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                              <span class="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                                {{ event.customerData?.name?.charAt(0) || 'M' }}
                              </span>
                            </div>
                            <NuxtLink
                              :to="`/customers/show/${event.customer}`"
                              class="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
                            >
                              <span v-if="event.customerData">
                                {{ event.customerData.name }} {{ event.customerData.surname }}
                              </span>
                              <span v-else class="text-gray-500">
                                Müşteri #{{ event.customer }}
                              </span>
                            </NuxtLink>
                          </div>

                          <!-- Description -->
                          <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {{ event.description }}
                          </p>

                          <!-- Request Data Details -->
                          <div v-if="getEventDetails(event)" class="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div class="space-y-1">
                              <div v-for="(detail, key) in getEventDetails(event)" :key="key" class="flex items-start gap-2 text-xs">
                                <span class="text-gray-500 dark:text-gray-400 font-medium min-w-[80px]">{{ key }}:</span>
                                <span class="text-gray-900 dark:text-white font-medium">{{ detail }}</span>
                              </div>
                            </div>
                          </div>

                          <!-- Status Change Badge -->
                          <div v-if="event.action === 'Durum Değiştirildi' && event.statusChange" class="flex items-center gap-2 mt-2">
                            <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                              {{ event.statusChange.from }}
                            </span>
                            <ArrowRightIcon class="h-4 w-4 text-gray-400" />
                            <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                              {{ event.statusChange.to }}
                            </span>
                          </div>
                        </div>
                      </div>

                      <!-- Action Button -->
                      <div>
                        <NuxtLink
                          v-if="event.customer"
                          :to="`/customers/show/${event.customer}`"
                          class="inline-flex items-center justify-center rounded-md bg-white dark:bg-gray-700 p-2 text-gray-400 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 transition-colors"
                        >
                          <EyeIcon class="h-4 w-4" />
                        </NuxtLink>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>

              <!-- Load More -->
              <div v-if="hasMoreTimeline" class="text-center mt-6">
                <button
                  @click="loadMoreTimeline"
                  :disabled="loadingMore"
                  class="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 disabled:opacity-50"
                >
                  <template v-if="loadingMore">
                    <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
                    Yükleniyor...
                  </template>
                  <template v-else>
                    Daha Fazla Yükle
                  </template>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  UserIcon,
  PencilIcon,
  DocumentTextIcon,
  ClockIcon,
  EyeIcon,
  CheckCircleIcon,
  PlusCircleIcon,
  ArrowPathIcon,
  ChatBubbleLeftIcon,
  UserPlusIcon,
  ShoppingBagIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/tr'

dayjs.extend(relativeTime)
dayjs.locale('tr')

definePageMeta({
  middleware: ['auth']
})

const route = useRoute()
const authStore = useAuthStore()
const config = useRuntimeConfig()
const path = config.public.apiBase

// Profil kullanıcı ID'si - route'dan al veya kendi ID'sini kullan
const profileUserId = computed(() => {
  return route.params.id ? Number(route.params.id) : authStore.user?.id
})

// Kendi profili mi kontrol et
const isOwnProfile = computed(() => {
  return !route.params.id || Number(route.params.id) === authStore.user?.id
})

// Data
const loadingProfile = ref(true)
const loadingCustomers = ref(true)
const loadingTimeline = ref(true)
const loadingMore = ref(false)
const profileUser = ref(null)

const todayStats = ref({
  added: 0,
  updated: 0,
  notes: 0,
  sales: 0
})

 

const timeline = ref([])
const timelinePage = ref(1)
const hasMoreTimeline = ref(true)

// Filters
const searchQuery = ref('')
const selectedFilter = ref('all')
const selectedTimeFilter = ref('all')

const timelineFilters = [
  { label: 'Tümü', value: 'all' },
  { label: 'Müşteri', value: 'customer' },
  { label: 'Notlar', value: 'notes' },
  { label: 'Durum', value: 'status' },
  { label: 'Satış', value: 'sales' }
]

const timeFilters = [
  { label: 'Tüm Zamanlar', value: 'all' },
  { label: 'Son 1 Saat', value: 'hour' },
  { label: 'Bugün', value: 'today' },
  { label: 'Dün', value: 'yesterday' },
  { label: 'Son 7 Gün', value: 'week' },
  { label: 'Son 30 Gün', value: 'month' }
]

// Check if user is online (last active within 60 seconds)
const isUserOnline = computed(() => {
  if (!profileUser.value?.lastActiveTime) return false
  const diffSeconds = dayjs().diff(dayjs(profileUser.value.lastActiveTime), 'second')
  return diffSeconds < 60
})

const filteredTimeline = computed(() => {
  let filtered = timeline.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(event => {
      const customerName = `${event.customerData?.name || ''} ${event.customerData?.surname || ''}`.toLowerCase()
      const description = (event.description || '').toLowerCase()
      return customerName.includes(query) || description.includes(query)
    })
  }

  // Action filter
  if (selectedFilter.value !== 'all') {
    filtered = filtered.filter(event => {
      switch (selectedFilter.value) {
        case 'customer':
          return ['Müşteri Oluşturuldu', 'Müşteri Güncellendi'].includes(event.action)
        case 'notes':
          return event.action === 'Not Eklendi'
        case 'status':
          return event.action === 'Durum Değiştirildi'
        case 'sales':
          return event.action === 'Satış Oluşturuldu'
        default:
          return true
      }
    })
  }

  // Time filter
  if (selectedTimeFilter.value !== 'all') {
    const now = dayjs()
    filtered = filtered.filter(event => {
      const eventTime = dayjs(event.createdAt)
      
      switch (selectedTimeFilter.value) {
        case 'hour':
          return now.diff(eventTime, 'hour') < 1
        case 'today':
          return eventTime.isSame(now, 'day')
        case 'yesterday':
          return eventTime.isSame(now.subtract(1, 'day'), 'day')
        case 'week':
          return now.diff(eventTime, 'day') < 7
        case 'month':
          return now.diff(eventTime, 'day') < 30
        default:
          return true
      }
    })
  }

  return filtered
})

// Helper methods for status detection
const isHotStatus = (event) => {
  // "Sıcak Satış" veya "SICAK" içeren durumlar
  return event.statusChange?.to?.toUpperCase().includes('SICAK') || 
         event.statusChange?.to?.toUpperCase().includes('HOT') ||
         event.description?.toUpperCase().includes('SICAK SATIŞ')
}

const isReminderStatus = (event) => {
  // "Tekrar Aranacak" durumları
  return event.statusChange?.to?.toUpperCase().includes('TEKRAR ARAN') ||
         event.statusChange?.to?.toUpperCase().includes('REMINDER') ||
         event.action === 'Not Eklendi' && event.requestData?.includes('isReminding')
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedFilter.value = 'all'
  selectedTimeFilter.value = 'all'
}

// Methods
const getRoleLabel = (role) => {
  const roles = {
    'admin': 'Yönetici',
    'doctor': 'Doktor',
    'sales': 'Satış Temsilcisi',
    'user': 'Kullanıcı',
    'pricing': 'Fiyatlama'
  }
  return roles[role] || role
}

const getEventColor = (action) => {
  const colors = {
    'Müşteri Oluşturuldu': 'bg-green-500',
    'Müşteri Güncellendi': 'bg-blue-500',
    'Durum Değiştirildi': 'bg-orange-500',
    'Not Eklendi': 'bg-yellow-500',
    'Satış Oluşturuldu': 'bg-purple-500'
  }
  return colors[action] || 'bg-gray-500'
}

const getEventIcon = (action) => {
  const icons = {
    'Müşteri Oluşturuldu': PlusCircleIcon,
    'Müşteri Güncellendi': PencilIcon,
    'Durum Değiştirildi': ArrowPathIcon,
    'Not Eklendi': DocumentTextIcon,
    'Satış Oluşturuldu': ShoppingBagIcon
  }
  return icons[action] || ClockIcon
}

const getEventDetails = (event) => {
  try {
    const requestData = JSON.parse(event.requestData || '{}')
    const details = {}

    // Not için
    if (event.action === 'Not Eklendi' && requestData.note) {
      details['Not'] = requestData.note
      if (requestData.isReminding) {
        details['Hatırlatma'] = 'Evet'
      }
    }

    // Satış için
    if (event.action === 'Satış Oluşturuldu') {
      if (requestData.title) details['Başlık'] = requestData.title
      if (requestData.description) details['Açıklama'] = requestData.description
    }

    return Object.keys(details).length > 0 ? details : null
  } catch (error) {
    return null
  }
}

const parseStatusChange = (event) => {
  try {
    if (event.action !== 'Durum Değiştirildi') return null
    
    const description = event.description
    // "Durum değiştirildi: YENİ -> TEKRAR ARANACAK" formatını parse et
    const match = description.match(/Durum değiştirildi: (.+) -> (.+)/)
    
    if (match) {
      return {
        from: match[1],
        to: match[2]
      }
    }
    return null
  } catch (error) {
    return null
  }
}

const formatTimeAgo = (date) => {
  if (!date) return '-'
  return dayjs(date).fromNow()
}

const fetchProfileUser = async () => {
  // Eğer kendi profiliyse, auth store'dan kullan
  if (isOwnProfile.value) {
    profileUser.value = authStore.user
    loadingProfile.value = false
    return
  }

  // Değilse API'den kullanıcıyı çek
  loadingProfile.value = true
  try {
    const api = useApi()
    const response = await api(`/users/${profileUserId.value}`)
    profileUser.value = response
  } catch (error) {
    console.error('Error fetching profile user:', error)
    profileUser.value = null
  } finally {
    loadingProfile.value = false
  }
}

 
 

const fetchTimeline = async (page = 1) => {
  if (page === 1) {
    loadingTimeline.value = true
  } else {
    loadingMore.value = true
  }

  try {
    const api = useApi()
    const userId = profileUserId.value

    const response = await api('/customer-history', {
      query: {
        userId,
        page,
        limit: 50
      }
    })

    // Backend artık { data: [], meta: {} } formatında dönüyor
    const result = response.data ? response : { data: response, meta: {} }
    let activities = result.data || []
    todayStats.value = {
      added: activities.filter(a => a.action === 'Müşteri Oluşturuldu').length,
      updated: activities.filter(a => a.action === 'Müşteri Güncellendi').length,
      notes: activities.filter(a => a.action === 'Not Eklendi').length,
      sales: activities.filter(a => a.action === 'Satış Oluşturuldu').length
    }

    // Aktiviteleri statusChange ekle
    activities = activities.map(activity => ({
      ...activity,
      statusChange: parseStatusChange(activity)
    }))

    if (page === 1) {
      timeline.value = activities
    } else {
      timeline.value = [...timeline.value, ...activities]
    }

    // Meta bilgilerini kullan
    const meta = result.meta || {}
    hasMoreTimeline.value = meta.page ? meta.page < meta.totalPages : false
    timelinePage.value = meta.page || page
  } catch (error) {
    console.error('Error fetching timeline:', error)
  } finally {
    loadingTimeline.value = false
    loadingMore.value = false
  }
}

const loadMoreTimeline = () => {
  fetchTimeline(timelinePage.value + 1)
}

// Watch for route changes
watch(() => route.params.id, async () => {
  // Reset data
  timeline.value = []
  timelinePage.value = 1
  hasMoreTimeline.value = true
  selectedFilter.value = 'all'
  selectedTimeFilter.value = 'all'
  searchQuery.value = ''
  
  // Reload data
  await fetchProfileUser()
  if (profileUser.value) {
    await Promise.all([ 
      fetchTimeline()
    ])
  }
}, { immediate: false })

// Initialize
onMounted(async () => {
  await fetchProfileUser()
  if (profileUser.value) {
    await Promise.all([ 
      fetchTimeline()
    ])
  }
})

useHead({
  title: computed(() => isOwnProfile.value ? 'İş Akışım - Valdori CRM' : `${profileUser.value?.name || 'Kullanıcı'} - İş Akışı - Valdori CRM`)
})
</script>