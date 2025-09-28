<template>
  <div>
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Fraud Alerts</h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
          Sistemde tespit edilen dolandırıcılık uyarıları
        </p>
      </div>
      <div class="mt-4 sm:mt-0 flex space-x-3">
        <button
          @click="markAllAsRead"
          :disabled="unreadCount === 0"
          class="inline-flex items-center justify-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Tümünü Okundu İşaretle
        </button>
        <button
          @click="refreshAlerts"
          class="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          <ArrowPathIcon class="h-4 w-4 mr-1" />
          Yenile
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <ExclamationTriangleIcon class="h-8 w-8 text-amber-600" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Toplam Alert
              </dt>
              <dd class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{ totalAlerts }}
              </dd>
            </dl>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <BellAlertIcon class="h-8 w-8 text-red-600" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Okunmamış
              </dt>
              <dd class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{ unreadCount }}
              </dd>
            </dl>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <CheckCircleIcon class="h-8 w-8 text-green-600" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Kontrol Edildi
              </dt>
              <dd class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{ checkedCount }}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- Alerts List -->
    <div class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
      <div v-if="loading" class="px-4 py-12 text-center">
        <div class="inline-flex items-center">
          <svg class="animate-spin h-8 w-8 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="ml-2 text-gray-500">Yükleniyor...</span>
        </div>
      </div>
      
      <div v-else-if="alerts.length === 0" class="px-4 py-12 text-center">
        <CheckCircleIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Fraud alert bulunamadı</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Henüz sistem tarafından tespit edilmiş bir dolandırıcılık uyarısı yok.
        </p>
      </div>
      
      <ul v-else class="divide-y divide-gray-200 dark:divide-gray-700">
        <li
          v-for="alert in alerts"
          :key="alert.id"
          :class="[
            alert.isRead ? 'bg-white dark:bg-gray-800' : 'bg-amber-50 dark:bg-amber-900/10',
            'hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer'
          ]"
          @click="viewAlert(alert)"
        >
          <div class="px-4 py-4 sm:px-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div
                  :class="[
                    alert.isRead ? 'bg-gray-100 dark:bg-gray-700' : 'bg-amber-100 dark:bg-amber-900/50',
                    'flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center'
                  ]"
                >
                  <ExclamationTriangleIcon
                    :class="[
                      alert.isRead ? 'text-gray-500' : 'text-amber-600 dark:text-amber-400',
                      'h-6 w-6'
                    ]"
                  />
                </div>
                <div class="ml-4">
                  <div class="flex items-center">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ alert.user?.name || `Kullanıcı ${alert.userId}` || 'Bilinmeyen Kullanıcı' }}
                    </p>
                    <span
                      v-if="!alert.isRead"
                      class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                    >
                      Yeni
                    </span>
                    <span
                      v-if="alert.isChecked"
                      class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                    >
                      Kontrol Edildi
                    </span>
                  </div>
                  <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {{ alert.message }}
                  </p>
                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-500">
                    {{ formatDate(alert.createdAt) }}
                  </p>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  v-if="!alert.isRead"
                  @click.stop="markAsReadAction(alert)"
                  class="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                  title="Okundu işaretle"
                >
                  <EyeIcon class="h-5 w-5 text-gray-500" />
                </button>
                <button
                  v-if="!alert.isChecked"
                  @click.stop="markAsCheckedAction(alert)"
                  class="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                  title="Kontrol edildi işaretle"
                >
                  <CheckIcon class="h-5 w-5 text-green-600" />
                </button>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  ExclamationTriangleIcon,
  BellAlertIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  EyeIcon,
  CheckIcon
} from '@heroicons/vue/24/outline'
import { useFraudAlerts } from '~/composables/useFraudAlerts'

const {
  alerts,
  unreadCount,
  loading,
  getRecentAlerts,
  getUnreadCount,
  markAsRead,
  markAsChecked,
  formatRelativeTime
} = useFraudAlerts()

// Computed
const totalAlerts = computed(() => alerts.value.length)
const checkedCount = computed(() => alerts.value.filter(a => a.isChecked).length)

// Methods
const refreshAlerts = async () => {
  loading.value = true
  await loadAllAlerts()
  await getUnreadCount()
  loading.value = false
}

const loadAllAlerts = async () => {
  try {
    const api = useApi()
    const response = await api('/fraud-alerts', {
      params: {
        include: 'user'
      }
    })
    alerts.value = response
  } catch (error) {
    console.error('Error loading alerts:', error)
  }
}

const markAllAsRead = async () => {
  loading.value = true
  try {
    // Mark all unread alerts as read
    const unreadAlerts = alerts.value.filter(a => !a.isRead)
    await Promise.all(unreadAlerts.map(alert => markAsRead(alert.id)))
    
    // Refresh the list
    await refreshAlerts()
  } catch (error) {
    console.error('Error marking all as read:', error)
  }
  loading.value = false
}

const markAsReadAction = async (alert) => {
  await markAsRead(alert.id)
  alert.isRead = true
  await getUnreadCount()
}

const markAsCheckedAction = async (alert) => {
  await markAsChecked(alert.id)
  alert.isRead = true
  alert.isChecked = true
  await getUnreadCount()
}

const viewAlert = async (alert) => {
  // Mark as read if not already
  if (!alert.isRead) {
    await markAsReadAction(alert)
  }
  
  // Navigate to detail page
  navigateTo(`/fraud-alerts/${alert.id}`)
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Load data on mount
onMounted(async () => {
  await refreshAlerts()
})

// Page title
useHead({
  title: 'Fraud Alerts - Valdori CRM'
})
</script>