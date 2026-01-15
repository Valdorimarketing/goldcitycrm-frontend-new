<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900" :dir="isRTL ? 'rtl' : 'ltr'" :lang="currentLanguage">
    <!-- Connection Status Overlay -->
    <Connectionstatusoverlay ping-url="/health" :ping-interval="15000" :initial-delay="3000" @connected="onConnected"
      @disconnected="onDisconnected" />

    <!-- Sidebar -->
    <AppSidebar />

    <!-- Main Content -->
    <div class="transition-all duration-300 ease-in-out" :class="getMainContentClass">
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
    <!-- Reminder Popup -->
    <ReminderPopup :is-open="reminderPopup" :reminder="currentReminder" :loading="reminderLoading"
      @dismiss="dismissReminder" @complete="completeReminder" />

    <!-- ✅ YENİ: Lead Notification Popup (Sadece Admin) -->
    <LeadNotificationPopup v-if="isAdmin" :is-open="showLeadNotification" :lead="newLeadNotification"
      @dismiss="dismissLeadNotification" @go-to-customer="goToCustomer" />
  </div>
</template>

<script setup>
import { ref, computed, provide, watch, onMounted, onUnmounted } from 'vue'
import { useFraudAlerts } from '~/composables/useFraudAlerts'
import { usePermissions } from '~/composables/usePermissions'
import { useAuthStore } from '~/stores/auth'
import FraudAlertPopup from '~/components/FraudAlertPopup.vue'
import ReminderPopup from '~/components/ReminderPopup.vue'
import Connectionstatusoverlay from '~/components/Connectionstatusoverlay.vue'
import { useApi } from '~/composables/useApi'
import { useLanguage } from '~/composables/useLanguage'

import LeadNotificationPopup from '~/components/LeadNotificationPopup.vue'
import { useWhatConvertsSocket } from '~/composables/useWhatConvertsSocket'

const { currentLanguage } = useLanguage()

// RTL dilleri
const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur']

// Mevcut dil RTL mi kontrol et
const isRTL = computed(() => {
  return RTL_LANGUAGES.includes(currentLanguage.value)
})

// Main content class - RTL'de margin-right, LTR'de margin-left
const getMainContentClass = computed(() => {
  if (isRTL.value) {
    // RTL: Sidebar sağda, content solda -> margin-right
    return sidebarOpen.value ? 'lg:mr-72' : 'lg:mr-20'
  } else {
    // LTR: Sidebar solda, content sağda -> margin-left
    return sidebarOpen.value ? 'lg:ml-72' : 'lg:ml-20'
  }
})

// HTML direction attribute'unu güncelle
const updateHTMLDirection = (lang) => {
  const isRtl = RTL_LANGUAGES.includes(lang)

  // HTML element'e dir attribute ekle
  document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr')
  document.documentElement.setAttribute('lang', lang)

  // Body'ye de class ekle (opsiyonel, CSS için kullanışlı)
  if (isRtl) {
    document.body.classList.add('rtl')
    document.body.classList.remove('ltr')
  } else {
    document.body.classList.add('ltr')
    document.body.classList.remove('rtl')
  }
}

// Dil değiştiğinde HTML elementini güncelle
watch(currentLanguage, (newLang) => {
  updateHTMLDirection(newLang)
})

// Connection handlers
const onConnected = () => {
  console.log('✅ Bağlantı sağlandı')
}

const onDisconnected = () => {
  console.log('❌ Bağlantı koptu')
}

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
const api = useApi()


// ✅ YENİ: WhatConverts Socket System (Sadece Admin için)
const {
  isConnected: socketConnected,
  newLeadNotification,
  showNotification: showLeadNotification,
  connect: connectSocket,
  disconnect: disconnectSocket,
  dismissNotification: dismissLeadNotification,
  goToLead,
  requestNotificationPermission: requestLeadNotificationPermission
} = useWhatConvertsSocket()

const goToCustomer = (customerId) => {
  goToLead(customerId)
}


// Reminder Notification System
const useReminderNotifications = () => {
  const config = useRuntimeConfig()
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

      const response = await api('/customer-notes', {
        params: {
          isReminding: true,
          user: parseInt(String(currentUserId)),
          startDate: '2020-01-01',
          endDate: todayStr,
          limit: 100
        },
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

      const sessionKey = `reminder_${reminder.id}_shown`
      const reminderShown = sessionStorage.getItem(sessionKey)

      if (timeDiff <= 5 * 60 * 1000 && !reminderShown && !notifiedReminders.value.has(reminder.id)) {
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

        break
      }
    }
  }

  const markAsCompleted = async () => {
    if (!currentReminder.value) return false

    try {
      loading.value = true
      const token = useCookie('auth-token').value || authStore.token

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

  const dismissPopup = () => {
    showPopup.value = false
    currentReminder.value = null
  }

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
  updateHTMLDirection(currentLanguage.value)
  
  // ✅ GÜNCELLEME: Her iki notification izni de iste
  await requestNotificationPermission()
  await requestLeadNotificationPermission()
  
  // Fraud Alerts (sadece admin)
  if (isAdmin.value) {
    await checkForNewAlerts()
    await getUnreadCount()
    
    fraudAlertInterval = setInterval(async () => {
      await checkForNewAlerts()
    }, 30000)
  }
  
  // Reminders (herkes)
  await checkForDueReminders()
  
  reminderInterval = setInterval(async () => {
    await checkForDueReminders()
  }, 30000)

  // ✅ YENİ: Socket bağlantısı (sadece admin)
  if (isAdmin.value) {
    console.log('🔌 Admin detected, connecting to WhatConverts socket...')
    connectSocket()
  }
})

onUnmounted(() => {
  if (fraudAlertInterval && isAdmin.value) {
    clearInterval(fraudAlertInterval)
    fraudAlertInterval = null
  }
  
  if (reminderInterval) {
    clearInterval(reminderInterval)
    reminderInterval = null
  }

  // ✅ YENİ: Socket bağlantısını kapat
  if (isAdmin.value) {
    disconnectSocket()
  }
})

provide('sidebar', {
  sidebarOpen,
  mobileSidebarOpen,
  toggleSidebar,
  openMobileSidebar,
  closeMobileSidebar,
  isRTL
})
</script>

<style>
/* RTL-specific adjustments */
[dir="rtl"] {
  direction: rtl;
  text-align: right;
}

[dir="ltr"] {
  direction: ltr;
  text-align: left;
}

/* Tailwind RTL margin utilities */
[dir="rtl"] .ltr\:ml-4 {
  margin-left: 0;
  margin-right: 1rem;
}

[dir="rtl"] .ltr\:mr-4 {
  margin-right: 0;
  margin-left: 1rem;
}

[dir="rtl"] .ltr\:ml-20 {
  margin-left: 0;
  margin-right: 5rem;
}

[dir="rtl"] .ltr\:ml-72 {
  margin-left: 0;
  margin-right: 18rem;
}

/* RTL padding utilities */
[dir="rtl"] .ltr\:pl-4 {
  padding-left: 0;
  padding-right: 1rem;
}

[dir="rtl"] .ltr\:pr-4 {
  padding-right: 0;
  padding-left: 1rem;
}
</style>