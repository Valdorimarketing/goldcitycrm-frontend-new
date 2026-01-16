<template>
  <div class="relative">
    <!-- Notification Bell Button -->
    <button
      @click="toggleNotifications"
      class="relative p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
      :title="'Bildirimler' + (notificationCount > 0 ? ` (${notificationCount})` : '')"
    >
      <BellIcon class="w-6 h-6" />

      <!-- Badge -->
      <span
        v-if="notificationCount > 0"
        class="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full"
      >
        {{ notificationCount > 99 ? '99+' : notificationCount }}
      </span>
    </button>

    <!-- Notification Dropdown -->
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="showNotifications"
        class="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
      >
        <!-- Header -->
        <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
              Bildirimler
            </h3>
            <span class="text-xs text-gray-500 dark:text-gray-400">
              {{ notificationCount }} müşteri
            </span>
          </div>
        </div>

        <!-- Notification List -->
        <div class="max-h-96 overflow-y-auto">
          <div v-if="loading" class="px-4 py-8 text-center">
            <div class="inline-block w-6 h-6 border-2 border-gray-300 border-t-rose-600 rounded-full animate-spin"></div>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Yükleniyor...</p>
          </div>

          <div v-else-if="notifications.length === 0" class="px-4 py-8 text-center">
            <BellIcon class="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600" />
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Bildirim bulunmuyor
            </p>
          </div>

          <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
            <button
              v-for="customer in notifications"
              :key="customer.id"
              @click="viewCustomer(customer)"
              class="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
            >
              <div class="flex items-start">
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-gray-700 dark:text-gray-300">
                    <span class="font-semibold text-gray-900 dark:text-white">{{ customer.name }} {{ customer.surname }}</span>
                    kişisi fiyat girildi durumunda bekliyor
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <!-- Footer -->
        <div
          v-if="notifications.length > 0"
          class="px-4 py-2 border-t border-gray-200 dark:border-gray-700"
        >
          <button
            @click="viewAllNotifications"
            class="w-full text-sm text-center text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 font-medium"
          >
            Tümünü Görüntüle
          </button>
        </div>
      </div>
    </transition>

    <!-- Click outside to close -->
    <div
      v-if="showNotifications"
      @click="showNotifications = false"
      class="fixed inset-0 z-40"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { BellIcon } from '@heroicons/vue/24/outline'
import { useCustomersStore } from '~/stores/customers'
import { useAuthStore } from '~/stores/auth'
import { usePermissions } from '~/composables/usePermissions'

const customersStore = useCustomersStore()
const authStore = useAuthStore()
const { isUser, userId } = usePermissions()
const router = useRouter()

const showNotifications = ref(false)
const notifications = ref([])
const loading = ref(false)
const notificationCount = ref(0)

// Fetch notifications
const fetchNotifications = async () => {
  // Only fetch if user is in 'user' role
  if (!isUser.value) {
    console.log('[NotificationBell] User is not in user role:', authStore.user?.role)
    notifications.value = []
    notificationCount.value = 0
    return
  }

  loading.value = true
  try {
    const api = useApi()

    // First, let's test with just status filter
    const queryParams = {
      status: 8,
      limit: 100, // Get up to 100 notifications
      order: 'DESC'
    }

    console.log('[NotificationBell] Fetching notifications with params:', queryParams)
    console.log('[NotificationBell] Current user ID:', userId.value)
    console.log('[NotificationBell] Current user role:', authStore.user?.role)

    // Fetch customers with status=8 and relevantUser=currentUserId
    const response = await api('/customers', {
      query: queryParams
    })

    console.log('[NotificationBell] API Response:', response)
    console.log('[NotificationBell] Response type:', typeof response)
    console.log('[NotificationBell] Is array?', Array.isArray(response))

    // If we got results, let's filter by relevantUser on client side for now
    let allCustomers = []
    if (Array.isArray(response)) {
      allCustomers = response
    } else if (response.data && Array.isArray(response.data)) {
      allCustomers = response.data
    }

    console.log('[NotificationBell] All customers with status=8:', allCustomers.length)

    // Filter by relevantUser on client side
    const filteredCustomers = allCustomers.filter(customer => {
      const relevantUserId = customer.relevantUserId || customer.relevant_user_id || customer.relevent_user || customer.relevantUser
      const customerUserId = typeof relevantUserId === 'object' ? relevantUserId?.id : relevantUserId

      console.log('[NotificationBell] Customer', customer.id, 'relevantUser:', relevantUserId, 'userId:', userId.value, 'match:', customerUserId == userId.value)

      return customerUserId == userId.value
    })

    console.log('[NotificationBell] Filtered customers for user', userId.value, ':', filteredCustomers.length)

    notifications.value = filteredCustomers
    notificationCount.value = filteredCustomers.length

    console.log('[NotificationBell] Final result:', notificationCount.value, 'notifications')
  } catch (error) {
    console.error('[NotificationBell] Error fetching notifications:', error)
    console.error('[NotificationBell] Error details:', error?.data, error?.statusCode)
    notifications.value = []
    notificationCount.value = 0
  } finally {
    loading.value = false
  }
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  if (showNotifications.value && notifications.value.length === 0) {
    fetchNotifications()
  }
}

const viewCustomer = (customer) => {
  showNotifications.value = false
  router.push(`/customers/show/${customer.id}`)
}

const viewAllNotifications = () => {
  showNotifications.value = false
  router.push('/customers?status=8')
}

// Fetch notifications on mount
onMounted(() => {
  fetchNotifications()

  // Auto-refresh every 30 seconds
  const interval = setInterval(() => {
    fetchNotifications()
  }, 30000)

  // Clean up interval on unmount
  onUnmounted(() => {
    clearInterval(interval)
  })
})

// Watch for user changes
watch(() => authStore.user, () => {
  fetchNotifications()
}, { deep: true })
</script>
