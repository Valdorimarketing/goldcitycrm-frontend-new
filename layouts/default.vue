<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Sidebar -->
    <AppSidebar />

    <!-- Main Content -->
    <div class="transition-all duration-300 ease-in-out" :class="[sidebarOpen ? 'lg:ml-64' : 'lg:ml-20']">
      <!-- Header -->
      <AppHeader />

      <!-- Page Content -->
      <main class="p-4 lg:p-6">
        <slot />
      </main>
    </div>

    <!-- Mobile Sidebar Overlay -->
    <div v-if="mobileSidebarOpen" class="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
      @click="closeMobileSidebar"></div>

    <!-- Fraud Alert Popup -->
    <FraudAlertPopup v-if="isAdmin" :is-open="fraudAlertPopup" :alert="currentFraudAlert" :loading="fraudAlertLoading"
      @dismiss="dismissFraudAlert" @check="checkFraudAlert" />

    <!-- Reminder Popup -->
    <ReminderPopup :is-open="reminderPopup" :reminder="currentReminder" :loading="reminderLoading"
      @dismiss="dismissReminder" @complete="completeReminder" />


     <!-- Fixed User Stats Bar -->
    <!-- <UserStatsBar
      :user="authStore.user"
      :user-stats="userStats"
      :daily-leads="dailyLeadsCount"
      :today-sales="todaySalesCount"
    />
       -->
  </div>
</template>

<script setup>
import { ref, provide, onMounted, onUnmounted } from 'vue'
import { useFraudAlerts } from '~/composables/useFraudAlerts'
import FraudAlertPopup from '~/components/FraudAlertPopup.vue'
import ReminderPopup from '~/components/ReminderPopup.vue'

// Sidebar state
const sidebarOpen = ref(true)
const mobileSidebarOpen = ref(false)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const openMobileSidebar = () => {
  mobileSidebarOpen.value = true
}

const closeMobileSidebar = () => {
  mobileSidebarOpen.value = false
}

// Fraud Alert System
const {
  showPopup: fraudAlertPopup,
  currentAlert: currentFraudAlert,
  loading: fraudAlertLoading,
  checkForNewAlerts,
  dismissPopup,
  markAsChecked,
  getUnreadCount
} = useFraudAlerts()

const { isAdmin } = usePermissions()

const authStore = useAuthStore()
const userStats = ref(null)
const dailyLeadsCount = ref(0)
const todaySalesCount = ref(0)

 
// Reminder Notification System - composable'ı inline olarak tanımlayalım
const useReminderNotifications = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase
  const authStore = useAuthStore()

  const showPopup = ref(false)
  const currentReminder = ref(null)
  const loading = ref(false)
  const notifiedReminders = ref(new Set())

  // Bugün ve öncesi için hatırlatmaları al
  const getTodayReminders = async () => {
    try {
      const currentUserId = authStore.user?.id || useCookie('user-id').value

      if (!currentUserId) {
        console.warn('❌ Kullanıcı ID bulunamadı!')
        return []
      }

      const today = new Date()
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`



      // Token'ı al
      const token = useCookie('auth-token').value || authStore.token

      const response = await $fetch('/customer-notes', {
        baseURL: apiBase,
        params: {
          isReminding: true,
          user: parseInt(String(currentUserId)),
          startDate: '2020-01-01',
          endDate: todayStr,
          limit: 100
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      return response || []
    } catch (error) {
      console.error('❌ Hatırlatmaları getirirken hata:', error)
      return []
    }
  }

  // Yaklaşan hatırlatmaları kontrol et
  const checkForDueReminders = async () => {

    const reminders = await getTodayReminders()


    const now = new Date()
    const currentTime = now.getTime()


    for (const reminder of reminders) {
      if (!reminder.remindingAt) continue

      const reminderTime = new Date(reminder.remindingAt).getTime()
      const timeDiff = reminderTime - currentTime
      const timeDiffMinutes = Math.ceil(timeDiff / 60000)



      // Session storage'da bu hatırlatmanın gösterilip gösterilmediğini kontrol et
      const sessionKey = `reminder_${reminder.id}_shown`
      const reminderShown = sessionStorage.getItem(sessionKey)

      // Zamanı geçmiş veya 5 dakika içinde olan hatırlatmalar
      if (timeDiff <= 5 * 60 * 1000 && !reminderShown && !notifiedReminders.value.has(reminder.id)) {

        // Müşteri bilgilerini al
        if (reminder.customer && !reminder.customerInfo) {
          try {
            const token = useCookie('auth-token').value || authStore.token
            const customer = await $fetch(`/customers/${reminder.customer}`, {
              baseURL: apiBase,
              headers: {
                Authorization: `Bearer ${token}`
              }
            })
            reminder.customerInfo = {
              name: customer.name,
              surname: customer.surname
            }

          } catch (error) {
            console.error('❌ Müşteri bilgileri alınamadı:', error)
          }
        }

        currentReminder.value = reminder
        showPopup.value = true
        notifiedReminders.value.add(reminder.id)
        sessionStorage.setItem(sessionKey, 'true')

        // Browser notification göster
        if ('Notification' in window && Notification.permission === 'granted') {
          const customerName = reminder.customerInfo
            ? `${reminder.customerInfo.name} ${reminder.customerInfo.surname}`
            : `Müşteri #${reminder.customer}`

          const timeText = timeDiff <= 0 ? 'Zamanı geldi!' : `${Math.ceil(timeDiff / 60000)} dakika kaldı`

          new Notification(`Hatırlatma - ${timeText}`, {
            body: `${customerName}: ${reminder.note}`,
            icon: '/favicon.ico',
            requireInteraction: true
          })
        }

        break // Bir seferde sadece bir hatırlatma göster
      }
    }
  }

  // Hatırlatmayı tamamlandı olarak işaretle
  const markAsCompleted = async () => {
    if (!currentReminder.value) return false

    try {
      loading.value = true
      const token = useCookie('auth-token').value || authStore.token

      // API'yi direkt çağır
      await $fetch(`/customer-notes/${currentReminder.value.id}`, {
        baseURL: apiBase,
        method: 'PATCH',
        body: {
          isReminding: false
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      showPopup.value = false
      currentReminder.value = null

      return true
    } catch (error) {
      console.error('❌ Hatırlatma tamamlanırken hata:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  // Popup'ı kapat (Sonra Hatırlat)
  const dismissPopup = () => {
    showPopup.value = false
    currentReminder.value = null
  }

  // Bildirim izni iste
  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return Notification.permission === 'granted'
  }

  return {
    showPopup,
    currentReminder,
    loading,
    checkForDueReminders,
    markAsCompleted,
    dismissPopup,
    requestNotificationPermission
  }
}

const {
  showPopup: reminderPopup,
  currentReminder,
  loading: reminderLoading,
  checkForDueReminders,
  markAsCompleted,
  dismissPopup: dismissReminderPopup,
  requestNotificationPermission
} = useReminderNotifications()

// Check for fraud alerts every 30 seconds
let fraudAlertInterval = null
let reminderInterval = null

const dismissFraudAlert = () => {
  dismissPopup()
}

const checkFraudAlert = async () => {
  if (currentFraudAlert.value) {
    fraudAlertLoading.value = true
    await markAsChecked(currentFraudAlert.value.id)
    fraudAlertLoading.value = false
  }
}

const dismissReminder = () => {
  dismissReminderPopup()
}

const completeReminder = async () => {
  await markAsCompleted()
}

onMounted(async () => {

   
  // Request notification permission
  await requestNotificationPermission()

  await checkForNewAlerts()
  await getUnreadCount()
  await checkForDueReminders()

  // Set up interval to check every 30 seconds for fraud alerts
  if (isAdmin) {
    fraudAlertInterval = setInterval(async () => {
      await checkForNewAlerts()
    }, 30000)
  }

  // Set up interval to check every 30 seconds for reminders
  reminderInterval = setInterval(async () => {
    await checkForDueReminders()
  }, 30000)

})

onUnmounted(() => {
  // Clean up intervals
  if (fraudAlertInterval && isAdmin) {
    clearInterval(fraudAlertInterval)
    fraudAlertInterval = null
  }
  if (reminderInterval) {
    clearInterval(reminderInterval)
    reminderInterval = null
  }
})

// Provide sidebar state to child components
provide('sidebar', {
  sidebarOpen,
  mobileSidebarOpen,
  toggleSidebar,
  openMobileSidebar,
  closeMobileSidebar
})
</script>