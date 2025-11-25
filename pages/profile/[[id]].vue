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
        <div class="space-y-6">
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

          <!-- Atanan Müşteriler Kartı -->
          <div class="card">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-base font-semibold text-gray-900 dark:text-white">Atanan Müşteriler</h3>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                {{ assignedCustomers.total }}
              </span>
            </div>

            <!-- Loading -->
            <div v-if="loadingCustomers" class="space-y-3">
              <div v-for="i in 3" :key="i" class="flex items-center space-x-3">
                <div class="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                <div class="flex-1">
                  <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                  <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                </div>
              </div>
            </div>

            <!-- Customer Stats -->
            <div v-else class="space-y-3">
              <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div class="flex items-center space-x-2">
                  <div class="h-2 w-2 rounded-full bg-yellow-500"></div>
                  <span class="text-sm text-gray-700 dark:text-gray-300">İşlem Bekleyen</span>
                </div>
                <span class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ assignedCustomers.pending }}
                </span>
              </div>

              <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div class="flex items-center space-x-2">
                  <div class="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span class="text-sm text-gray-700 dark:text-gray-300">Hatırlatmalı</span>
                </div>
                <span class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ assignedCustomers.withReminder }}
                </span>
              </div>

              <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div class="flex items-center space-x-2">
                  <div class="h-2 w-2 rounded-full bg-green-500"></div>
                  <span class="text-sm text-gray-700 dark:text-gray-300">Satış</span>
                </div>
                <span class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ assignedCustomers.sales }}
                </span>
              </div>

              <!-- View All Button -->
              <NuxtLink
                :to="isOwnProfile ? '/customers' : `/customers?user=${profileUserId}`"
                class="block w-full text-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium mt-4"
              >
                {{ isOwnProfile ? 'Tüm Müşterileri Görüntüle' : 'Kullanıcının Müşterilerini Görüntüle' }} →
              </NuxtLink>
            </div>
          </div>

          <!-- Bugünün Hedefleri -->
          <div class="card">
            <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4">Bugünün Hedefleri</h3>
            <div class="space-y-3">
              <div class="flex items-center space-x-3">
                <input type="checkbox" :checked="todayStats.added >= 5" class="h-4 w-4 text-indigo-600 rounded" disabled />
                <span class="text-sm text-gray-700 dark:text-gray-300">5 yeni müşteri ekle</span>
              </div>
              <div class="flex items-center space-x-3">
                <input type="checkbox" :checked="todayStats.updated >= 10" class="h-4 w-4 text-indigo-600 rounded" disabled />
                <span class="text-sm text-gray-700 dark:text-gray-300">10 müşteri güncelle</span>
              </div>
              <div class="flex items-center space-x-3">
                <input type="checkbox" :checked="todayStats.notes >= 5" class="h-4 w-4 text-indigo-600 rounded" disabled />
                <span class="text-sm text-gray-700 dark:text-gray-300">5 not ekle</span>
              </div>
              <div class="flex items-center space-x-3">
                <input type="checkbox" :checked="todayStats.sales >= 2" class="h-4 w-4 text-indigo-600 rounded" disabled />
                <span class="text-sm text-gray-700 dark:text-gray-300">2 satış yap</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Sağ Kolon: Timeline -->
        <div class="lg:col-span-2">
          <div class="card">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Aktivite Geçmişi</h3>
              <div class="flex gap-2">
                <button
                  v-for="filter in timelineFilters"
                  :key="filter.value"
                  @click="selectedFilter = filter.value"
                  :class="[
                    'px-3 py-1 text-xs font-medium rounded-md transition-colors',
                    selectedFilter === filter.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  ]"
                >
                  {{ filter.label }}
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
              <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Henüz aktivite yok</h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {{ isOwnProfile ? 'Müşterilerle ilgili işlemler yaptığınızda burada görünecek.' : 'Kullanıcının henüz bir aktivitesi bulunmuyor.' }}
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
                      <div>
                        <div :class="[
                          'relative h-10 w-10 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-900',
                          getEventColor(event.action)
                        ]">
                          <component :is="getEventIcon(event.action)" class="h-5 w-5 text-white" />
                        </div>
                      </div>

                      <!-- Content -->
                      <div class="min-w-0 flex-1">
                        <div>
                          <div class="text-sm">
                            <span class="font-medium text-gray-900 dark:text-white">
                              {{ event.action }}
                            </span>
                          </div>
                          <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                            {{ formatTimeAgo(event.createdAt) }}
                          </p>
                        </div>

                        <div class="mt-2 text-sm text-gray-700 dark:text-gray-300">
                          <!-- Customer Info -->
                          <div v-if="event.customerData" class="flex items-center gap-2 mb-2">
                            <div class="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                              <span class="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                                {{ event.customerData.name?.charAt(0) || '?' }}
                              </span>
                            </div>
                            <NuxtLink
                              :to="`/customers/show/${event.customer}`"
                              class="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
                            >
                              {{ event.customerData.name }} {{ event.customerData.surname }}
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
  ArrowRightIcon
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

const assignedCustomers = ref({
  total: 0,
  pending: 0,
  withReminder: 0,
  sales: 0
})

const timeline = ref([])
const timelinePage = ref(1)
const hasMoreTimeline = ref(true)

const selectedFilter = ref('all')
const timelineFilters = [
  { label: 'Tümü', value: 'all' },
  { label: 'Müşteri', value: 'customer' },
  { label: 'Notlar', value: 'notes' },
  { label: 'Durum', value: 'status' },
  { label: 'Satış', value: 'sales' }
]

// Check if user is online (last active within 60 seconds)
const isUserOnline = computed(() => {
  if (!profileUser.value?.lastActiveTime) return false
  const diffSeconds = dayjs().diff(dayjs(profileUser.value.lastActiveTime), 'second')
  return diffSeconds < 60
})

const filteredTimeline = computed(() => {
  if (selectedFilter.value === 'all') return timeline.value

  return timeline.value.filter(event => {
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
})

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

const fetchTodayStats = async () => {
  try {
    const api = useApi()
    const userId = profileUserId.value

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const response = await api('/customer-history', {
      query: {
        userId,
        startDate: today.toISOString()
      }
    })

    const activities = Array.isArray(response) ? response : (response.data || [])

    todayStats.value = {
      added: activities.filter(a => a.action === 'Müşteri Oluşturuldu').length,
      updated: activities.filter(a => a.action === 'Müşteri Güncellendi').length,
      notes: activities.filter(a => a.action === 'Not Eklendi').length,
      sales: activities.filter(a => a.action === 'Satış Oluşturuldu').length
    }
  } catch (error) {
    console.error('Error fetching today stats:', error)
  }
}

const fetchAssignedCustomers = async () => {
  loadingCustomers.value = true
  try {
    const api = useApi()
    const userId = profileUserId.value

    const response = await api('/customers', {
      query: {
        relevantUser: userId
      }
    })

    const customers = Array.isArray(response) ? response : (response.data || [])

    // Müşteri istatistiklerini hesapla
    const stats = {
      total: customers.length,
      pending: 0,
      withReminder: 0,
      sales: 0
    }

    customers.forEach(customer => {
      // İşlem bekleyen (status 1 veya 2 olan)
      if (customer.status === 1 || customer.status === 2) {
        stats.pending++
      }
      
      // Hatırlatmalı
      if (customer.remindingDate) {
        stats.withReminder++
      }
      
      // Satış (statusData'da isSale true olan veya status 3)
      if (customer.statusData?.isSale || customer.status === 3) {
        stats.sales++
      }
    })

    assignedCustomers.value = stats
  } catch (error) {
    console.error('Error fetching assigned customers:', error)
  } finally {
    loadingCustomers.value = false
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
        limit: 20
      }
    })

    let activities = Array.isArray(response) ? response : (response.data || [])

    // Her aktivite için müşteri bilgisini ekle
    const customerIds = [...new Set(activities.map(a => a.customer).filter(Boolean))]
    
    if (customerIds.length > 0) {
      const customersResponse = await api('/customers', {
        query: {
          ids: customerIds.join(',')
        }
      })
      
      const customers = Array.isArray(customersResponse) ? customersResponse : (customersResponse.data || [])
      const customerMap = {}
      customers.forEach(c => {
        customerMap[c.id] = c
      })

      // Aktivitelere müşteri bilgisini ekle
      activities = activities.reverse().map(activity => ({
        ...activity,
        customerData: customerMap[activity.customer],
        statusChange: parseStatusChange(activity)
      }))
    }

    if (page === 1) {
      timeline.value = activities
    } else {
      timeline.value = [...timeline.value, ...activities]
    }

    const meta = response.meta || {}
    hasMoreTimeline.value = (meta.page || page) < (meta.totalPages || 1)
    timelinePage.value = page
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
  
  // Reload data
  await fetchProfileUser()
  if (profileUser.value) {
    await Promise.all([
      fetchTodayStats(),
      fetchAssignedCustomers(),
      fetchTimeline()
    ])
  }
}, { immediate: false })

// Initialize
onMounted(async () => {
  await fetchProfileUser()
  if (profileUser.value) {
    await Promise.all([
      fetchTodayStats(),
      fetchAssignedCustomers(),
      fetchTimeline()
    ])
  }
})

useHead({
  title: computed(() => isOwnProfile.value ? 'İş Akışım - Valdori CRM' : `${profileUser.value?.name || 'Kullanıcı'} - İş Akışı - Valdori CRM`)
})
</script>