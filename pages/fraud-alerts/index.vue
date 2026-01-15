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

    <!-- Search and Filters -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div>
          <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ara
          </label>
          <input
            id="search"
            v-model="searchTerm"
            type="text"
            class="form-input"
            placeholder="Mesaj içeriğinde ara..."
          />
        </div>
        <div>
          <label for="readStatus" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Okunma Durumu
          </label>
          <select
            id="readStatus"
            v-model="readFilter"
            class="form-input"
          >
            <option :value="undefined">Tümü</option>
            <option :value="false">Okunmamış</option>
            <option :value="true">Okunmuş</option>
          </select>
        </div>
        <div>
          <label for="checkedStatus" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Kontrol Durumu
          </label>
          <select
            id="checkedStatus"
            v-model="checkedFilter"
            class="form-input"
          >
            <option :value="undefined">Tümü</option>
            <option :value="false">Kontrol Edilmemiş</option>
            <option :value="true">Kontrol Edildi</option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="resetFilters"
            class="btn-secondary w-full"
          >
            Filtreleri Temizle
          </button>
        </div>
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
                {{ meta?.total || 0 }}
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
                {{ unreadCount || 0 }}
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
                Kontrol Edilmemiş
              </dt>
              <dd class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{ uncheckedCount || 0 }}
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
          {{ searchTerm || readFilter !== undefined || checkedFilter !== undefined ? 'Arama kriterlerinize uygun fraud alert bulunamadı.' : 'Henüz sistem tarafından tespit edilmiş bir dolandırıcılık uyarısı yok.' }}
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

      <!-- Pagination -->
      <div v-if="meta && meta.totalPages > 1" class="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 sm:px-6">
        <div class="flex flex-1 justify-between sm:hidden">
          <button
            :disabled="meta.page === 1"
            @click="changePage(meta.page - 1)"
            class="relative inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            Önceki
          </button>
          <button
            :disabled="meta.page === meta.totalPages"
            @click="changePage(meta.page + 1)"
            class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            Sonraki
          </button>
        </div>
        <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700 dark:text-gray-300">
              <span class="font-medium">{{ ((meta.page - 1) * meta.limit) + 1 }}</span>
              -
              <span class="font-medium">{{ Math.min(meta.page * meta.limit, meta.total) }}</span>
              arası, toplam
              <span class="font-medium">{{ meta.total }}</span>
              sonuç
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
                :disabled="meta.page === meta.totalPages"
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
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'
import { useFraudAlerts } from '~/composables/useFraudAlerts'
import { watchDebounced } from '@vueuse/core'

const {
  alerts,
  unreadCount,
  uncheckedCount,
  loading,
  meta,
  fetchAlerts,
  getUnreadCount,
  getUncheckedCount,
  markAsRead,
  markAsChecked
} = useFraudAlerts()

// Search and filters
const searchTerm = ref('')
const readFilter = ref(undefined)
const checkedFilter = ref(undefined)

// Computed
const visiblePages = computed(() => {
  const pages = []
  const total = meta.value?.totalPages || 0
  const current = meta.value?.page || 1

  // Guard against invalid values
  if (!total || total <= 0) return []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      pages.push(1, 2, 3, 4, 5, '...', total)
    } else if (current >= total - 3) {
      pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total)
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', total)
    }
  }

  return pages.filter(page => page !== '...')
})

// Methods
const loadAlerts = async (page = 1) => {
  await fetchAlerts({
    page,
    search: searchTerm.value || undefined,
    isRead: readFilter.value,
    isChecked: checkedFilter.value
  })
}

const refreshAlerts = async () => {
  await loadAlerts(meta.value.page)
  await getUnreadCount()
  await getUncheckedCount()
}

const resetFilters = () => {
  searchTerm.value = ''
  readFilter.value = undefined
  checkedFilter.value = undefined
}

const changePage = (page) => {
  if (page >= 1 && page <= meta.value.totalPages) {
    loadAlerts(page)
  }
}

// Watch for search term and filter changes with debounce
watchDebounced(
  [searchTerm, readFilter, checkedFilter],
  () => {
    loadAlerts(1) // Reset to page 1 when searching or filtering
  },
  { debounce: 500 }
)

const markAllAsRead = async () => {
  if (loading.value) return // Prevent double-click

  try {
    // Mark all unread alerts as read
    const unreadAlerts = alerts.value.filter(a => !a.isRead)
    if (unreadAlerts.length === 0) return

    await Promise.all(unreadAlerts.map(alert => markAsRead(alert.id)))

    // Refresh the list
    await refreshAlerts()
  } catch (error) {
    console.error('Error marking all as read:', error)
  }
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
  await getUncheckedCount()
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
  await loadAlerts()
  await getUnreadCount()
  await getUncheckedCount()
})

// Page title
useHead({
  title: 'Fraud Alerts - Valdori CRM'
})
</script>
