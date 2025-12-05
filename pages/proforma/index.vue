<template>
  <div class="min-h-screen">
    <!-- Header Section -->
    <div class="mb-8">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-gradient-to-br from-orange-500 to-rose-600 rounded-2xl shadow-lg shadow-orange-500/25">
            <DocumentTextIcon class="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Proforma Takibi</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Proforma istenen ve gelen müşterileri takip edin
            </p>
          </div>
        </div>

        <!-- Action Button -->
        <button @click="loadAllData"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-sm font-medium">
          <ArrowPathIcon class="h-5 w-5" :class="{ 'animate-spin': loading }" />
          Yenile
        </button>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div
        class="group bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Toplam</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ requestedPagination.total +
              receivedPagination.total }}</p>
          </div>
          <div
            class="h-12 w-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
            <DocumentDuplicateIcon class="h-6 w-6 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
        <div class="h-1 w-full bg-gradient-to-r from-orange-500 to-rose-500 rounded-full mt-4 opacity-60"></div>
      </div>

      <div
        class="group bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">İstenen</p>
            <p class="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1">{{ requestedPagination.total }}</p>
          </div>
          <div
            class="h-12 w-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ClockIcon class="h-6 w-6 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
        <div class="h-1 w-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full mt-4 opacity-60"></div>
      </div>

      <div
        class="group bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Gelen</p>
            <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{{ receivedPagination.total }}</p>
          </div>
          <div
            class="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
            <CheckCircleIcon class="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
        <div class="h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mt-4 opacity-60"></div>
      </div>

      <div
        class="group bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Dönüşüm</p>
            <p class="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{{ conversionRate }}%</p>
          </div>
          <div
            class="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ChartBarIcon class="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <div class="h-1 w-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-4 opacity-60"></div>
      </div>
    </div>

    <!-- Filters Card -->
    <div
      class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6 overflow-hidden">
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
        <div class="flex items-center gap-2">
          <FunnelIcon class="h-5 w-5 text-gray-400" />
          <span class="font-medium text-gray-700 dark:text-gray-300">Filtreler</span>
        </div>
        <button v-if="searchTerm || relevantUserFilter || dateFilter !== 'all'" @click="resetFilters"
          class="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 font-medium">
          Temizle
        </button>
      </div>

      <div class="p-5">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Search -->
          <div>
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
              Ara
            </label>
            <div class="relative">
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input v-model="searchTerm" type="text"
                class="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="İsim, email, telefon..." />
            </div>
          </div>

          <!-- User Filter (Admin only) -->
          <div v-if="isAdmin">
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
              Atanan Kullanıcı
            </label>
            <select v-model="relevantUserFilter"
              class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all appearance-none cursor-pointer">
              <option value="">Tüm Kullanıcılar</option>
              <option v-for="user in usersList" :key="user.id" :value="user.id">
                {{ user.name }}
              </option>
            </select>
          </div>

          <!-- Date Filter -->
          <div>
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
              Tarih Aralığı
            </label>
            <select v-model="dateFilter"
              class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all appearance-none cursor-pointer">
              <option value="all">Tümü</option>
              <option value="today">Bugün</option>
              <option value="week">Bu Hafta</option>
              <option value="month">Bu Ay</option>
            </select>
          </div>

          <!-- Reset Button -->
          <div class="flex items-end">
            <button @click="resetFilters"
              class="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all text-sm font-medium">
              Filtreleri Temizle
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-16">
      <div class="relative">
        <div class="w-14 h-14 rounded-full border-4 border-orange-100 dark:border-orange-900"></div>
        <div
          class="absolute top-0 left-0 w-14 h-14 rounded-full border-4 border-transparent border-t-orange-600 animate-spin">
        </div>
      </div>
      <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">Yükleniyor...</p>
    </div>

    <!-- Two Column Layout -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">

      <!-- Sol Kolon: Proforma İstendi -->
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
        <!-- Column Header -->
        <div class="relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500"></div>
          <div class="absolute inset-0 opacity-30"
            style="background-image: url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%3E%3Ccircle%20cx%3D%221%22%20cy%3D%221%22%20r%3D%221%22%20fill%3D%22white%22%20fill-opacity%3D%220.3%22%2F%3E%3C%2Fsvg%3E');">
          </div>

          <div class="relative px-5 py-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <ClockIcon class="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 class="font-semibold text-white">Proforma İstendi</h2>
                  <p class="text-xs text-white/70">Cevap bekleniyor</p>
                </div>
              </div>
              <span class="px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white text-sm font-bold rounded-full">
                {{ requestedPagination.total }}
              </span>
            </div>
          </div>
        </div>

        <!-- Customer List -->
        <div class="flex-1 overflow-y-auto max-h-[500px] divide-y divide-gray-100 dark:divide-gray-700">
          <!-- Empty State -->
          <div v-if="proformaRequested.length === 0" class="flex flex-col items-center justify-center py-12 px-4">
            <div
              class="h-16 w-16 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4">
              <DocumentTextIcon class="h-8 w-8 text-orange-500" />
            </div>
            <p class="text-sm font-medium text-gray-900 dark:text-white mb-1">Müşteri Yok</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 text-center">
              Proforma istenen müşteri bulunmuyor
            </p>
          </div>

          <!-- Customer Cards -->
          <div v-for="customer in proformaRequested" :key="customer.id" @click="goToCustomer(customer.id)"
            class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all cursor-pointer group">
            <div class="flex items-start gap-4">
              <!-- Avatar -->
              <div class="relative flex-shrink-0">
                <div
                  class="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                  <span class="text-sm font-bold text-white">
                    {{ getInitials(customer.name) }}
                  </span>
                </div>
                <!-- Waiting indicator -->
                <div
                  class="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center animate-pulse">
                  <ClockIcon class="w-2.5 h-2.5 text-white" />
                </div>
              </div>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <p
                      class="font-medium text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      {{ customer.name }} {{ customer.surname }}
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">
                      {{ customer.email || customer.phone || '-' }}
                    </p>
                  </div>
                  <ChevronRightIcon
                    class="h-5 w-5 text-gray-300 dark:text-gray-600 group-hover:text-orange-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>

                <!-- Meta Info -->
                <div class="flex flex-wrap items-center gap-3 mt-3">
                  <span
                    class="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs text-gray-600 dark:text-gray-300">
                    <CalendarIcon class="h-3.5 w-3.5" />
                    {{ formatDate(customer.createdAt) }}
                  </span>
                  <span v-if="customer.relevantUserData"
                    class="inline-flex items-center gap-1.5 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-xs text-purple-600 dark:text-purple-400">
                    <UserIcon class="h-3.5 w-3.5" />
                    {{ customer.relevantUserData.name }}
                  </span>
                  <span
                    class="inline-flex items-center gap-1.5 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-xs text-orange-600 dark:text-orange-400">
                    <ClockIcon class="h-3.5 w-3.5" />
                    Bekliyor
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="requestedPagination.totalPages > 1"
          class="border-t border-gray-100 dark:border-gray-700 px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-900/50">
          <span class="text-xs text-gray-500 dark:text-gray-400">
            Sayfa {{ requestedPagination.page }} / {{ requestedPagination.totalPages }}
          </span>
          <div class="flex items-center gap-1">
            <button @click="loadRequestedData(requestedPagination.page - 1)" :disabled="requestedPagination.page <= 1"
              class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              <ChevronLeftIcon class="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button @click="loadRequestedData(requestedPagination.page + 1)"
              :disabled="requestedPagination.page >= requestedPagination.totalPages"
              class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              <ChevronRightIcon class="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      <!-- Sağ Kolon: Proforma Geldi -->
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
        <!-- Column Header -->
        <div class="relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
          <div class="absolute inset-0 opacity-30"
            style="background-image: url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%3E%3Ccircle%20cx%3D%221%22%20cy%3D%221%22%20r%3D%221%22%20fill%3D%22white%22%20fill-opacity%3D%220.3%22%2F%3E%3C%2Fsvg%3E');">
          </div>

          <div class="relative px-5 py-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <CheckCircleIcon class="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 class="font-semibold text-white">Proforma Geldi</h2>
                  <p class="text-xs text-white/70">İşleme hazır</p>
                </div>
              </div>
              <span class="px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white text-sm font-bold rounded-full">
                {{ receivedPagination.total }}
              </span>
            </div>
          </div>
        </div>

        <!-- Customer List -->
        <div class="flex-1 overflow-y-auto max-h-[500px] divide-y divide-gray-100 dark:divide-gray-700">
          <!-- Empty State -->
          <div v-if="proformaReceived.length === 0" class="flex flex-col items-center justify-center py-12 px-4">
            <div
              class="h-16 w-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
              <DocumentCheckIcon class="h-8 w-8 text-emerald-500" />
            </div>
            <p class="text-sm font-medium text-gray-900 dark:text-white mb-1">Müşteri Yok</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 text-center">
              Proforma gelen müşteri bulunmuyor
            </p>
          </div>

          <!-- Customer Cards -->
          <div v-for="customer in proformaReceived" :key="customer.id" @click="goToCustomer(customer.id)"
            class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all cursor-pointer group">
            <div class="flex items-start gap-4">
              <!-- Avatar -->
              <div class="relative flex-shrink-0">
                <div
                  class="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                  <span class="text-sm font-bold text-white">
                    {{ getInitials(customer.name) }}
                  </span>
                </div>
                <!-- Success indicator -->
                <div
                  class="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                  <CheckIcon class="w-2.5 h-2.5 text-white" />
                </div>
              </div>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <p
                      class="font-medium text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {{ customer.name }} {{ customer.surname }}
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">
                      {{ customer.email || customer.phone || '-' }}
                    </p>
                  </div>
                  <ChevronRightIcon
                    class="h-5 w-5 text-gray-300 dark:text-gray-600 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>

                <!-- Meta Info -->
                <div class="flex flex-wrap items-center gap-3 mt-3">
                  <span
                    class="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs text-gray-600 dark:text-gray-300">
                    <CalendarIcon class="h-3.5 w-3.5" />
                    {{ formatDate(customer.createdAt) }}
                  </span>
                  <span v-if="customer.relevantUserData"
                    class="inline-flex items-center gap-1.5 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-xs text-purple-600 dark:text-purple-400">
                    <UserIcon class="h-3.5 w-3.5" />
                    {{ customer.relevantUserData.name }}
                  </span>
                  <span
                    class="inline-flex items-center gap-1.5 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-xs text-emerald-600 dark:text-emerald-400">
                    <CheckCircleIcon class="h-3.5 w-3.5" />
                    Hazır
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="receivedPagination.totalPages > 1"
          class="border-t border-gray-100 dark:border-gray-700 px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-900/50">
          <span class="text-xs text-gray-500 dark:text-gray-400">
            Sayfa {{ receivedPagination.page }} / {{ receivedPagination.totalPages }}
          </span>
          <div class="flex items-center gap-1">
            <button @click="loadReceivedData(receivedPagination.page - 1)" :disabled="receivedPagination.page <= 1"
              class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              <ChevronLeftIcon class="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button @click="loadReceivedData(receivedPagination.page + 1)"
              :disabled="receivedPagination.page >= receivedPagination.totalPages"
              class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              <ChevronRightIcon class="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  DocumentTextIcon,
  DocumentCheckIcon,
  DocumentDuplicateIcon,
  CalendarIcon,
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  CheckIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/vue/24/outline'
import { watchDebounced } from '@vueuse/core'

definePageMeta({
  layout: 'default'
})

const api = useApi()
const router = useRouter()
const authStore = useAuthStore()
const { isAdmin, getCustomerFilters } = usePermissions()

// Status IDs
const STATUS_PROFORMA_REQUESTED = 28
const STATUS_PROFORMA_RECEIVED = 29

// State
const loading = ref(true)
const searchTerm = ref('')
const relevantUserFilter = ref('')
const dateFilter = ref('all')
const usersList = ref([])

// Sol kolon - Proforma İstendi
const proformaRequested = ref([])
const requestedPagination = ref({
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0
})

// Sağ kolon - Proforma Geldi
const proformaReceived = ref([])
const receivedPagination = ref({
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0
})

// Computed
const conversionRate = computed(() => {
  const total = requestedPagination.value.total + receivedPagination.value.total
  if (total === 0) return 0
  return Math.round((receivedPagination.value.total / total) * 100)
})

// API Calls
const buildQuery = (statusId, page = 1) => {
  const baseFilters = getCustomerFilters()

  const query = {
    ...baseFilters,
    status: statusId,
    page,
    limit: 20
  }

  if (searchTerm.value) {
    query.search = searchTerm.value
  }

  if (relevantUserFilter.value) {
    query.relevantUser = relevantUserFilter.value
  }

  if (dateFilter.value && dateFilter.value !== 'all') {
    query.dateFilter = dateFilter.value
  }

  return query
}

const loadRequestedData = async (page = 1) => {
  try {
    const query = buildQuery(STATUS_PROFORMA_REQUESTED, page)
    const response = await api('/customers', { query })

    proformaRequested.value = Array.isArray(response) ? response : response.data || []

    if (response.meta) {
      requestedPagination.value = {
        page: response.meta.page || 1,
        limit: response.meta.limit || 20,
        total: response.meta.total || 0,
        totalPages: Math.ceil((response.meta.total || 0) / (response.meta.limit || 20))
      }
    }
  } catch (error) {
    console.error('Proforma İstendi verisi yükleme hatası:', error)
  }
}

const loadReceivedData = async (page = 1) => {
  try {
    const query = buildQuery(STATUS_PROFORMA_RECEIVED, page)
    const response = await api('/customers', { query })

    proformaReceived.value = Array.isArray(response) ? response : response.data || []

    if (response.meta) {
      receivedPagination.value = {
        page: response.meta.page || 1,
        limit: response.meta.limit || 20,
        total: response.meta.total || 0,
        totalPages: Math.ceil((response.meta.total || 0) / (response.meta.limit || 20))
      }
    }
  } catch (error) {
    console.error('Proforma Geldi verisi yükleme hatası:', error)
  }
}

const loadAllData = async () => {
  loading.value = true
  try {
    await Promise.all([
      loadRequestedData(1),
      loadReceivedData(1)
    ])
  } finally {
    loading.value = false
  }
}

const loadUsers = async () => {
  try {
    const response = await api('/users')
    if (Array.isArray(response)) {
      usersList.value = response.map(u => ({
        id: u.id,
        name: `${u.name || ''} ${u.surname || ''}`.trim()
      }))
    }
  } catch (error) {
    console.error('Kullanıcılar yüklenemedi:', error)
  }
}

// Helpers
const goToCustomer = (customerId) => {
  router.push(`/customers/show/${customerId}`)
}

const resetFilters = () => {
  searchTerm.value = ''
  relevantUserFilter.value = ''
  dateFilter.value = 'all'
  loadAllData()
}

const getInitials = (name) => {
  if (!name) return '?'
  return name.charAt(0).toUpperCase()
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

// Watchers
watchDebounced(
  [searchTerm, relevantUserFilter, dateFilter],
  () => loadAllData(),
  { debounce: 500 }
)

onMounted(async () => {
  await loadUsers()
  await loadAllData()
})

useHead({ title: 'Proforma Takibi - Valdori CRM' })
</script>