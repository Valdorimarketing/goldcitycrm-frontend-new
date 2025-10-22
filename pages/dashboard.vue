<template>
  <div class="space-y-8">
    <!-- Page Header -->
    <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      <p class="mt-2 text-gray-600 dark:text-gray-400">
        Hoş geldiniz 2, {{ authStore.user?.name || 'Kullanıcı' }}
        <span class="text-sm ml-2 px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded">
          {{ getRoleLabel(authStore.user?.role) }}
        </span>
      </p>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="stat in stats" :key="stat.name" class="stats-card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <component
              :is="stat.icon"
              class="h-8 w-8 text-indigo-600 dark:text-indigo-400"
            />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {{ stat.name }}
              </dt>
              <dd class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ stat.value }}
              </dd>
            </dl>
          </div>
        </div>
        <div class="mt-4">
          <div class="flex items-center">
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ stat.description }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New Customers Cards (Admin Only) -->
    <div v-if="isAdmin" class="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <!-- Unassigned New Customers -->
      <div class="card">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Henüz Atanmamış Kişiler</h3>
          <NuxtLink
            to="/pool-data?tab=unassigned"
            class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium transition-colors"
          >
            Tümünü gör
          </NuxtLink>
        </div>

        <!-- Loading State -->
        <div v-if="loadingUnassignedCustomers" class="space-y-3">
          <div v-for="i in 3" :key="i" class="flex items-center space-x-3">
            <div class="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <div class="flex-1">
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
              <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
            </div>
          </div>
        </div>

        <!-- Data -->
        <div v-else-if="unassignedNewCustomers.length > 0" class="space-y-3">
          <div
            v-for="customer in unassignedNewCustomers"
            :key="customer.id"
            class="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
            @click="navigateTo(`/customers/show/${customer.id}`)"
          >
            <div class="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <span class="text-sm font-medium text-blue-600 dark:text-blue-400">
                {{ customer.name?.charAt(0) || '?' }}{{ customer.surname?.charAt(0) || '' }}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ customer.name || 'İsimsiz' }} {{ customer.surname || '' }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                {{ customer.email || customer.phone || '-' }}
              </p>
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ formatDate(customer.createdAt) }}
            </div>
          </div>

          <!-- Total Count -->
          <div class="pt-3 border-t border-gray-200 dark:border-gray-700">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
              Toplam: <span class="text-gray-900 dark:text-white">{{ unassignedNewCustomersTotal }}</span>
            </p>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-6">
          <p class="text-sm text-gray-500 dark:text-gray-400">Henüz atanmamış kişi bulunmuyor</p>
        </div>
      </div>

      <!-- Assigned Waiting New Customers -->
      <div class="card">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Atanmış Beklemedeki Kişiler</h3>
          <NuxtLink
            to="/pool-data?tab=assigned"
            class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium transition-colors"
          >
            Tümünü gör
          </NuxtLink>
        </div>

        <!-- Loading State -->
        <div v-if="loadingAssignedCustomers" class="space-y-3">
          <div v-for="i in 3" :key="i" class="flex items-center space-x-3">
            <div class="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <div class="flex-1">
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
              <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
            </div>
          </div>
        </div>

        <!-- Data -->
        <div v-else-if="assignedNewCustomers.length > 0" class="space-y-3">
          <div
            v-for="customer in assignedNewCustomers"
            :key="customer.id"
            class="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
            @click="navigateTo(`/customers/show/${customer.id}`)"
          >
            <div class="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
              <span class="text-sm font-medium text-amber-600 dark:text-amber-400">
                {{ customer.name?.charAt(0) || '?' }}{{ customer.surname?.charAt(0) || '' }}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ customer.name || 'İsimsiz' }} {{ customer.surname || '' }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                {{ customer.email || customer.phone || '-' }}
              </p>
              <p class="text-xs text-indigo-600 dark:text-indigo-400 truncate mt-0.5">
                Atanan: {{ customer.relevantUserInfo?.name || 'Bilinmiyor' }}
              </p>
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ formatDate(customer.createdAt) }}
            </div>
          </div>

          <!-- Total Count -->
          <div class="pt-3 border-t border-gray-200 dark:border-gray-700">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
              Toplam: <span class="text-gray-900 dark:text-white">{{ assignedNewCustomersTotal }}</span>
            </p>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-6">
          <p class="text-sm text-gray-500 dark:text-gray-400">Atanmış beklemedeki kişi bulunmuyor</p>
        </div>
      </div>
    </div>

    <!-- User Calendar (User and Admin Roles) -->
    <div v-if="isAdmin || isUser">
      <DashboardCalendar
        :customers-data="userCustomersForCalendar"
        :meetings-data="userMeetingsForCalendar"
      />
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <!-- Recent Customers -->
      <div class="card">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Son Müşteriler</h3>
          <NuxtLink
            to="/customers"
            class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium transition-colors"
          >
            Tümünü gör
          </NuxtLink>
        </div>

        <!-- Loading State -->
        <div v-if="loadingCustomers" class="space-y-3">
          <div v-for="i in 3" :key="i" class="flex items-center space-x-3">
            <div class="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <div class="flex-1">
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
              <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
            </div>
          </div>
        </div>

        <!-- Data -->
        <div v-else-if="recentCustomers.length > 0" class="space-y-3">
          <div
            v-for="customer in recentCustomers"
            :key="customer.id"
            class="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
            @click="navigateTo(`/customers/show/${customer.id}`)"
          >
            <div class="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
              <span class="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                {{ customer.name?.charAt(0) || '?' }}{{ customer.surname?.charAt(0) || '' }}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ customer.name || 'İsimsiz' }} {{ customer.surname || '' }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                {{ customer.email || '-' }}
              </p>
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ formatDate(customer.createdAt) }}
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-6">
          <p class="text-sm text-gray-500 dark:text-gray-400">Henüz müşteri bulunmuyor</p>
        </div>

        <div v-if="canAddCustomer" class="mt-4">
          <NuxtLink
            to="/customers/new"
            class="btn-primary text-center block"
          >
            Yeni Müşteri Ekle
          </NuxtLink>
        </div>
      </div>

      <!-- Upcoming Reminders -->
      <div class="card">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Yaklaşan Hatırlatmalar</h3>
        </div>

        <!-- Loading State -->
        <div v-if="loadingReminders" class="space-y-3">
          <div v-for="i in 3" :key="i" class="flex items-center space-x-3">
            <div class="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <div class="flex-1">
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
              <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
            </div>
          </div>
        </div>

        <!-- Data -->
        <div v-else-if="upcomingReminders.length > 0" class="space-y-3">
          <div
            v-for="reminder in upcomingReminders"
            :key="reminder.id"
            class="flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
            @click="reminder.customer && navigateTo(`/customers/show/${reminder.customer}`)"
          >
            <div class="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center flex-shrink-0">
              <span class="text-sm font-medium text-amber-600 dark:text-amber-400">
                {{ reminder.customerInfo?.name?.charAt(0) || '?' }}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ reminder.customerInfo?.name || 'Bilinmeyen' }} {{ reminder.customerInfo?.surname || '' }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                {{ reminder.note }}
              </p>
              <p class="text-xs text-amber-600 dark:text-amber-400 mt-1">
                {{ formatDateTime(reminder.remindingAt) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-6">
          <p class="text-sm text-gray-500 dark:text-gray-400">Yaklaşan hatırlatma bulunmuyor</p>
        </div>
      </div>
    </div>

    <!-- Upcoming Meetings -->
    <div v-if="canViewMeetings" class="card">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Yaklaşan Randevular</h3>
        <NuxtLink
          to="/meetings"
          class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium transition-colors"
        >
          Tümünü gör
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-if="loadingMeetings" class="space-y-3">
        <div v-for="i in 3" :key="i" class="flex items-center space-x-3">
          <div class="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          <div class="flex-1">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
            <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
          </div>
        </div>
      </div>

      <!-- Data -->
      <div v-else-if="upcomingMeetings.length > 0" class="overflow-hidden">
        <table class="min-w-full">
          <thead>
            <tr>
              <th class="table-header">Müşteri</th>
              <th class="table-header">Başlangıç</th>
              <th class="table-header">Bitiş</th>
              <th class="table-header">Durum</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="meeting in upcomingMeetings" :key="meeting.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
              <td class="table-cell font-medium">{{ meeting.customerInfo?.name || '-' }} {{ meeting.customerInfo?.surname || '' }}</td>
              <td class="table-cell">{{ formatDateTime(meeting.startTime) }}</td>
              <td class="table-cell">{{ formatDateTime(meeting.endTime) }}</td>
              <td class="table-cell">
                <span
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                >
                  {{ meeting.meetingStatusInfo?.name || 'Belirsiz' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-6">
        <p class="text-sm text-gray-500 dark:text-gray-400">Yaklaşan randevu bulunmuyor</p>
      </div>

      <div class="mt-4">
        <NuxtLink
          to="/meetings"
          class="btn-primary text-center block"
        >
          Randevuları Görüntüle
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  UsersIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  CalendarIcon
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '~/stores/auth'
import { useStatuses } from '~/composables/useStatuses'
import { useApi } from '~/composables/useApi'

definePageMeta({
  middleware: 'auth'
})

// Stores and Composables
const authStore = useAuthStore()
const { fetchStatuses, statuses } = useStatuses()
const { getCustomerFilters, canAccessCustomer, getDashboardFilters, getRelatedDataFilters, isAdmin, isUser, isDoctor, isPricing } = usePermissions()

// Loading states
const loadingStats = ref(true)
const loadingCustomers = ref(true)
const loadingSales = ref(true)
const loadingMeetings = ref(true)
const loadingReminders = ref(true)
const loadingUnassignedCustomers = ref(true)
const loadingAssignedCustomers = ref(true)

// Data
const totalCustomers = ref(0)
const totalSales = ref(0)
const totalRevenue = ref(0)
const totalMeetings = ref(0)
const recentCustomers = ref([])
const recentSales = ref([])
const upcomingMeetings = ref([])
const upcomingReminders = ref([])
const unassignedNewCustomers = ref([])
const unassignedNewCustomersTotal = ref(0)
const assignedNewCustomers = ref([])
const assignedNewCustomersTotal = ref(0)
const users = ref([])
const userCustomersForCalendar = ref([])
const userMeetingsForCalendar = ref([])

// Role-based permissions
const userRole = computed(() => authStore.user?.role || '')
const userId = computed(() => authStore.user?.id || null)

const canAddCustomer = computed(() => {
  return isAdmin.value || isUser.value
})

const canViewSales = computed(() => {
  return isAdmin.value || isUser.value
})

const canViewMeetings = computed(() => {
  return isAdmin.value || isUser.value
})

// Get role label
const getRoleLabel = (role: string | undefined) => {
  const labels: Record<string, string> = {
    admin: 'Admin',
    employee: 'Çalışan',
    doctor: 'Doktor',
    pricing: 'Fiyatlandırma'
  }
  return labels[role || ''] || role || 'Kullanıcı'
}

// Get role-based filters for customers
const getRoleBasedFilters = async () => {
  // Fetch statuses first if needed for doctor/pricing roles
  if (isDoctor.value || isPricing.value) {
    try {
      await fetchStatuses()
      console.log('Fetched Statuses:', statuses.value)
    } catch (error) {
      console.error('Error fetching statuses:', error)
    }
  }

  // Use getCustomerFilters for customer queries (uses relevent_user field)
  const customerFilters = getCustomerFilters()

  // For doctor/pricing, we need to map status types to actual status IDs
  if (isDoctor.value) {
    const doctorStatuses = statuses.value.filter(s => s.isDoctor)
    if (doctorStatuses.length > 0) {
      return { status: doctorStatuses.map(s => s.id).join(',') }
    }
  } else if (isPricing.value) {
    const pricingStatuses = statuses.value.filter(s => s.isPricing)
    if (pricingStatuses.length > 0) {
      return { status: pricingStatuses.map(s => s.id).join(',') }
    }
  }

  console.log('Customer Filters:', customerFilters)
  return customerFilters
}

// Calculate statistics
const calculateStats = async () => {
  try {
    loadingStats.value = true
    console.log('=== Starting calculateStats ===')
    const api = useApi()

    // Get role-based filters
    const filters = await getRoleBasedFilters()

    // Fetch customers directly using API
    console.log('Calling customers API with filters:', filters)
    const customersResponse = await api('/customers', { query: filters })
    console.log('Customers response:', customersResponse)

    // Filter customers based on access permissions
    let filteredCustomers = []
    if (Array.isArray(customersResponse)) {
      filteredCustomers = customersResponse.filter(c => canAccessCustomer(c))
      totalCustomers.value = filteredCustomers.length
    } else if (customersResponse.data && Array.isArray(customersResponse.data)) {
      filteredCustomers = customersResponse.data.filter(c => canAccessCustomer(c))
      totalCustomers.value = filteredCustomers.length
    } else {
      totalCustomers.value = 0
    }
    console.log('Total Customers (after filtering):', totalCustomers.value)

    // Fetch sales
    const salesFilters = getRelatedDataFilters() || {}

    const salesResponse = await api('/sales', { query: salesFilters })
    console.log('Sales response:', salesResponse)

    let allSales = []
    if (Array.isArray(salesResponse)) {
      allSales = salesResponse
    } else if (salesResponse.data && Array.isArray(salesResponse.data)) {
      allSales = salesResponse.data
    }

    // Calculate current month sales
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const currentMonthSales = allSales.filter(sale => {
      const saleDate = new Date(sale.date)
      return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear
    })

    totalSales.value = currentMonthSales.reduce((sum, sale) => sum + (sale.amount || 0), 0)
    totalRevenue.value = allSales.reduce((sum, sale) => sum + (sale.amount || 0), 0)

    // Fetch meetings
    const meetingFilters = getRelatedDataFilters() || {}

    const meetingsResponse = await api('/meetings', { query: meetingFilters })
    console.log('Meetings response:', meetingsResponse)

    if (Array.isArray(meetingsResponse)) {
      totalMeetings.value = meetingsResponse.length
    } else if (meetingsResponse.data && Array.isArray(meetingsResponse.data)) {
      totalMeetings.value = meetingsResponse.data.length
    } else {
      totalMeetings.value = 0
    }

  } catch (error) {
    console.error('Error calculating stats:', error)
  } finally {
    loadingStats.value = false
  }
}

// Fetch recent customers
const fetchRecentCustomers = async () => {
  try {
    loadingCustomers.value = true
    const api = useApi()
    const filters = await getRoleBasedFilters()

    const customersResponse = await api('/customers', { query: filters })

    // Filter customers based on access permissions
    if (Array.isArray(customersResponse)) {
      const filtered = customersResponse.filter(c => canAccessCustomer(c))
      recentCustomers.value = filtered.slice(0, 5)
    } else if (customersResponse.data && Array.isArray(customersResponse.data)) {
      const filtered = customersResponse.data.filter(c => canAccessCustomer(c))
      recentCustomers.value = filtered.slice(0, 5)
    } else {
      recentCustomers.value = []
    }
  } catch (error) {
    console.error('Error fetching recent customers:', error)
    recentCustomers.value = []
  } finally {
    loadingCustomers.value = false
  }
}

// Fetch recent sales
const fetchRecentSales = async () => {
  try {
    loadingSales.value = true
    const api = useApi()
    const filters = getRelatedDataFilters() || {}

    const salesResponse = await api('/sales', { query: filters })

    if (Array.isArray(salesResponse)) {
      recentSales.value = salesResponse.slice(0, 5)
    } else if (salesResponse.data && Array.isArray(salesResponse.data)) {
      recentSales.value = salesResponse.data.slice(0, 5)
    } else {
      recentSales.value = []
    }
  } catch (error) {
    console.error('Error fetching recent sales:', error)
    recentSales.value = []
  } finally {
    loadingSales.value = false
  }
}

// Fetch upcoming meetings
const fetchUpcomingMeetings = async () => {
  try {
    loadingMeetings.value = true
    const api = useApi()
    const filters = getRelatedDataFilters() || {}

    const meetingsResponse = await api('/meetings', { query: filters })

    if (Array.isArray(meetingsResponse)) {
      upcomingMeetings.value = meetingsResponse.slice(0, 5)
    } else if (meetingsResponse.data && Array.isArray(meetingsResponse.data)) {
      upcomingMeetings.value = meetingsResponse.data.slice(0, 5)
    } else {
      upcomingMeetings.value = []
    }
  } catch (error) {
    console.error('Error fetching upcoming meetings:', error)
    upcomingMeetings.value = []
  } finally {
    loadingMeetings.value = false
  }
}

// Fetch upcoming reminders
const fetchUpcomingReminders = async () => {
  try {
    loadingReminders.value = true
    const api = useApi()

    // Get future reminders
    const now = new Date()
    const futureDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // Next 30 days

    let filters: any = {
      isReminding: true,
      startDate: now.toISOString().split('T')[0],
      endDate: futureDate.toISOString().split('T')[0]
    }

    // Add user filter if needed
    const userFilters = getRelatedDataFilters()
    if (userFilters) {
      filters = { ...filters, ...userFilters }
    }

    const remindersResponse = await api('/customer-notes', { query: filters })
    console.log('Reminders response:', remindersResponse)

    let allReminders = []
    if (Array.isArray(remindersResponse)) {
      allReminders = remindersResponse
    } else if (remindersResponse.data && Array.isArray(remindersResponse.data)) {
      allReminders = remindersResponse.data
    }

    // Sort by remindingAt and get first 5
    upcomingReminders.value = allReminders
      .filter(r => r.remindingAt && new Date(r.remindingAt) >= now)
      .sort((a, b) => new Date(a.remindingAt).getTime() - new Date(b.remindingAt).getTime())
      .slice(0, 5)
  } catch (error) {
    console.error('Error fetching upcoming reminders:', error)
    upcomingReminders.value = []
  } finally {
    loadingReminders.value = false
  }
}

// Fetch unassigned new customers (Admin only)
const fetchUnassignedNewCustomers = async () => {
  if (!isAdmin.value) {
    loadingUnassignedCustomers.value = false
    return
  }

  try {
    loadingUnassignedCustomers.value = true
    const api = useApi()

    console.log('Fetching unassigned customers with isFirst=true, hasRelevantUser=false')

    // Fetch customers with isFirst=true and hasRelevantUser=false from backend
    const customersResponse = await api('/customers', {
      query: {
        isFirst: true,
        hasRelevantUser: false,
        limit: 50  // Fetch more than needed for display
      }
    })

    console.log('Unassigned customers response:', customersResponse)

    let allCustomers = []
    if (Array.isArray(customersResponse)) {
      allCustomers = customersResponse
    } else if (customersResponse.data && Array.isArray(customersResponse.data)) {
      allCustomers = customersResponse.data
    }

    const meta = customersResponse.meta || {}

    unassignedNewCustomersTotal.value = meta.total || allCustomers.length
    unassignedNewCustomers.value = allCustomers.slice(0, 5)
  } catch (error) {
    console.error('Error fetching unassigned new customers:', error)
    unassignedNewCustomers.value = []
    unassignedNewCustomersTotal.value = 0
  } finally {
    loadingUnassignedCustomers.value = false
  }
}

// Fetch users (Admin only)
const fetchUsers = async () => {
  if (!isAdmin.value) return

  try {
    const api = useApi()
    const usersResponse = await api('/users')

    if (Array.isArray(usersResponse)) {
      users.value = usersResponse
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    users.value = []
  }
}

// Fetch user customers for calendar (User and Admin roles)
const fetchUserCustomersForCalendar = async () => {
  if (!isAdmin.value && !isUser.value) return

  try {
    const api = useApi()
    // If admin, fetch all customers. If regular user, fetch only their customers
    const filters = isAdmin.value ? {} : getCustomerFilters()

    const customersResponse = await api('/customers', { query: filters })

    let allCustomers = []
    if (Array.isArray(customersResponse)) {
      allCustomers = customersResponse
    } else if (customersResponse.data && Array.isArray(customersResponse.data)) {
      allCustomers = customersResponse.data
    }

    // If admin, include all customers. If regular user, filter by access
    userCustomersForCalendar.value = isAdmin.value ? allCustomers : allCustomers.filter(c => canAccessCustomer(c))
  } catch (error) {
    console.error('Error fetching user customers for calendar:', error)
    userCustomersForCalendar.value = []
  }
}

// Fetch user meetings for calendar (User and Admin roles)
const fetchUserMeetingsForCalendar = async () => {
  if (!isAdmin.value && !isUser.value) return

  try {
    const api = useApi()
    // If admin, fetch all meetings. If regular user, fetch only their meetings
    const filters = isAdmin.value ? {} : (getRelatedDataFilters() || {})

    const meetingsResponse = await api('/meetings', { query: filters })

    if (Array.isArray(meetingsResponse)) {
      userMeetingsForCalendar.value = meetingsResponse
    } else if (meetingsResponse.data && Array.isArray(meetingsResponse.data)) {
      userMeetingsForCalendar.value = meetingsResponse.data
    } else {
      userMeetingsForCalendar.value = []
    }
  } catch (error) {
    console.error('Error fetching user meetings for calendar:', error)
    userMeetingsForCalendar.value = []
  }
}

// Fetch assigned new customers (Admin only)
const fetchAssignedNewCustomers = async () => {
  if (!isAdmin.value) {
    loadingAssignedCustomers.value = false
    return
  }

  try {
    loadingAssignedCustomers.value = true
    const api = useApi()

    // Ensure users are loaded for user info mapping
    if (users.value.length === 0) {
      await fetchUsers()
    }

    console.log('Fetching assigned customers with isFirst=true, hasRelevantUser=true')

    // Fetch customers with isFirst=true and hasRelevantUser=true from backend
    const customersResponse = await api('/customers', {
      query: {
        isFirst: true,
        hasRelevantUser: true,
        limit: 50  // Fetch more than needed for display
      }
    })

    console.log('Assigned customers response:', customersResponse)

    let allCustomers = []
    if (Array.isArray(customersResponse)) {
      allCustomers = customersResponse
    } else if (customersResponse.data && Array.isArray(customersResponse.data)) {
      allCustomers = customersResponse.data
    }

    const meta = customersResponse.meta || {}

    // Create users map for quick lookup
    const usersMap: Record<string, any> = {}
    users.value.forEach(user => {
      usersMap[user.id] = user
    })

    // Add user info to each customer
    const customersWithUserInfo = allCustomers.map(customer => {
      const relevantUserId = customer.relevantUserId || customer.relevant_user_id || customer.relevent_user || customer.relevantUser

      // Parse relevantUser correctly - handle both ID and object cases
      let relevantUserObj = null
      if (relevantUserId !== null && relevantUserId !== undefined) {
        if (typeof relevantUserId === 'object') {
          // Already an object
          relevantUserObj = relevantUserId
        } else {
          // It's an ID, look it up in usersMap
          relevantUserObj = usersMap[relevantUserId]
        }
      }

      return {
        ...customer,
        relevantUserInfo: relevantUserObj
      }
    })

    assignedNewCustomersTotal.value = meta.total || customersWithUserInfo.length
    assignedNewCustomers.value = customersWithUserInfo.slice(0, 5)
  } catch (error) {
    console.error('Error fetching assigned new customers:', error)
    assignedNewCustomers.value = []
    assignedNewCustomersTotal.value = 0
  } finally {
    loadingAssignedCustomers.value = false
  }
}

// Initialize data on mount
onMounted(async () => {
  await Promise.all([
    calculateStats(),
    fetchRecentCustomers(),
    fetchRecentSales(),
    fetchUpcomingMeetings(),
    fetchUpcomingReminders(),
    fetchUnassignedNewCustomers(),
    fetchAssignedNewCustomers(),
    fetchUserCustomersForCalendar(),
    fetchUserMeetingsForCalendar()
  ])
})

// Computed stats with real data
const stats = computed(() => {
  const baseStats = [
    {
      name: 'Toplam Müşteri',
      value: loadingStats.value ? '...' : totalCustomers.value.toLocaleString('tr-TR'),
      description: getRoleBasedDescription('customer'),
      icon: UsersIcon
    }
  ]

  if (canViewSales.value) {
    baseStats.push(
      {
        name: 'Bu Ay Satış',
        value: loadingStats.value ? '...' : `₺${totalSales.value.toLocaleString('tr-TR')}`,
        description: getRoleBasedDescription('sales'),
        icon: ShoppingBagIcon
      },
      {
        name: 'Toplam Gelir',
        value: loadingStats.value ? '...' : `₺${totalRevenue.value.toLocaleString('tr-TR')}`,
        description: getRoleBasedDescription('revenue'),
        icon: CurrencyDollarIcon
      }
    )
  }

  baseStats.push({
    name: 'Randevular',
    value: loadingStats.value ? '...' : totalMeetings.value.toLocaleString('tr-TR'),
    description: getRoleBasedDescription('meetings'),
    icon: CalendarIcon
  })

  return baseStats
})

const getRoleBasedDescription = (statType: string) => {
  if (isAdmin.value) {
    return 'Tüm kayıtlar'
  } else if (isUser.value) {
    return 'Sizin kayıtlarınız'
  } else if (isDoctor.value) {
    return 'Doktor müşterileri'
  } else if (isPricing.value) {
    return 'Fiyatlandırma müşterileri'
  }
  return ''
}

// Helper functions
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('tr-TR')
}

const formatDateTime = (dateString: string | undefined) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('tr-TR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('tr-TR').format(amount)
}

// Page head
useHead({
  title: 'Dashboard - Valdori CRM'
})
</script>
