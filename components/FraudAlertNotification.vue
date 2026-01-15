<template>
  <div class="relative">
    <!-- Notification Bell Icon -->
    <button
      @click="toggleDropdown"
      class="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
    >
      <BellIcon class="h-6 w-6" />
      
      <!-- Unread Count Badge -->
      <span
        v-if="unreadCount > 0"
        class="notification-badge"
      >
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </button>
    
    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isDropdownOpen"
        class="absolute right-0 z-40 mt-2 w-80 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5"
      >
        <!-- Header -->
        <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
            Fraud Alerts
          </h3>
        </div>
        
        <!-- Alerts List -->
        <div class="max-h-96 overflow-y-auto">
          <div v-if="loading" class="px-4 py-8 text-center">
            <div class="inline-flex items-center">
              <svg class="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="ml-2 text-sm text-gray-500">Yükleniyor...</span>
            </div>
          </div>
          
          <div v-else-if="alerts.length === 0" class="px-4 py-8 text-center">
            <CheckCircleIcon class="mx-auto h-12 w-12 text-gray-400" />
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Henüz fraud alert bulunmuyor
            </p>
          </div>
          
          <div v-else>
            <button
              v-for="alert in alerts"
              :key="alert.id"
              @click="handleAlertClick(alert)"
              :class="[
                alert.isRead ? 'read-alert' : 'unread-alert',
                'w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left border-b border-gray-200 dark:border-gray-700 last:border-b-0'
              ]"
            >
              <div class="flex items-start">
                <ExclamationTriangleIcon 
                  :class="[
                    alert.isRead ? 'text-gray-400' : 'text-amber-500',
                    'h-5 w-5 mt-0.5 flex-shrink-0'
                  ]"
                /> 

                <div class="ml-3 flex-1">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ truncateMessage(alert.message) }}
                  </p>
                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {{ formatRelativeTime(alert.createdAt) }}
                  </p>
                </div>
                <span
                  v-if="!alert.isRead"
                  class="ml-2 h-2 w-2 bg-blue-600 rounded-full flex-shrink-0"
                ></span>
              </div>
            </button>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <NuxtLink
            to="/fraud-alerts"
            @click="closeDropdown"
            class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium"
          >
            Tümünü Gör →
          </NuxtLink>
        </div>
      </div>
    </Transition>
    
    <!-- Click outside handler -->
    <div
      v-if="isDropdownOpen"
      @click="closeDropdown"
      class="fixed inset-0 z-30"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { BellIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'
import { useFraudAlerts } from '~/composables/useFraudAlerts'

const {
  unreadCount,
  alerts,
  loading,
  getRecentAlerts,
  markAsRead,
  formatRelativeTime,
  truncateMessage
} = useFraudAlerts()

const isDropdownOpen = ref(false)

const toggleDropdown = async () => {
  isDropdownOpen.value = !isDropdownOpen.value
  
  if (isDropdownOpen.value) { 
    await getRecentAlerts(5)  
  }
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const handleAlertClick = async (alert: any) => {
  if (!alert.isRead) {
    await markAsRead(alert.id)
    alert.isRead = true
  }
  
  // Navigate to fraud alert detail or open modal
  closeDropdown()
  // You can emit an event or navigate to detail page here
  navigateTo(`/fraud-alerts/${alert.id}`)
}
</script>

<style scoped>
.notification-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: #ef4444;
  color: white;
  border-radius: 9999px;
  padding: 2px 6px;
  font-size: 11px;
  font-weight: 600;
  min-width: 18px;
  text-align: center;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
  }
}

.unread-alert {
  background-color: #fef3c7;
  border-left: 4px solid #f59e0b;
}

.dark .unread-alert {
  background-color: rgba(251, 191, 36, 0.1);
  border-left-color: #fbbf24;
}

.read-alert {
  background-color: #ffffff;
  opacity: 0.8;
}

.dark .read-alert {
  background-color: transparent;
  opacity: 0.7;
}
</style>