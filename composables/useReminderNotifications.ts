interface CustomerNote {
  id: number
  note: string
  customer: number
  customerInfo?: {
    name: string
    surname: string
  }
  isReminding: boolean
  remindingAt?: string
  user?: number
  userInfo?: {
    name: string
  }
  createdAt: string
  updatedAt: string
}

export const useReminderNotifications = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase
  const authStore = useAuthStore()

  const showPopup = ref(false)
  const currentReminder = ref<CustomerNote | null>(null)
  const loading = ref(false)
  const notifiedReminders = ref<Set<number>>(new Set())

  // Bugün ve öncesi için hatırlatmaları al
  const getTodayReminders = async () => {
    try {
      const currentUserId = authStore.user?.id || useCookie('user-id').value
      if (!currentUserId) return []

      const today = new Date()
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

      const response = await $fetch<CustomerNote[]>('/customer-notes', {
        baseURL: apiBase,
        params: {
          isReminding: true,
          user: parseInt(String(currentUserId)),
          startDate: '2020-01-01',
          endDate: todayStr,
          limit: 100
        }
      })

      return response || []
    } catch (error) {
      console.error('Error fetching reminders:', error)
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

      // Session storage'da bu hatırlatmanın gösterilip gösterilmediğini kontrol et
      const sessionKey = `reminder_${reminder.id}_shown`
      const reminderShown = sessionStorage.getItem(sessionKey)

      // Zamanı geçmiş veya 5 dakika içinde olan hatırlatmalar
      if (timeDiff <= 5 * 60 * 1000 && !reminderShown && !notifiedReminders.value.has(reminder.id)) {
        // Müşteri bilgilerini al
        if (reminder.customer && !reminder.customerInfo) {
          try {
            const customersStore = useCustomersStore()
            const customer = await customersStore.fetchCustomer(reminder.customer)
            reminder.customerInfo = {
              name: customer.name,
              surname: customer.surname
            }
          } catch (error) {
            console.error('Failed to fetch customer:', error)
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
      const customerNotesStore = useCustomerNotesStore()
      await customerNotesStore.updateCustomerNote(currentReminder.value.id, {
        isReminding: false
      })
      showPopup.value = false
      currentReminder.value = null
      return true
    } catch (error) {
      console.error('Error marking reminder as completed:', error)
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

  // Format date time
  const formatDateTime = (dateString: string | undefined) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Time remaining
  const getTimeRemaining = (dateString: string | undefined) => {
    if (!dateString) return ''

    const now = new Date()
    const reminderDate = new Date(dateString)
    const diff = reminderDate.getTime() - now.getTime()

    if (diff <= 0) {
      return 'Zamanı geldi!'
    } else {
      const minutes = Math.ceil(diff / 60000)
      if (minutes < 60) {
        return `${minutes} dakika kaldı`
      } else {
        const hours = Math.ceil(minutes / 60)
        return `${hours} saat kaldı`
      }
    }
  }

  return {
    showPopup,
    currentReminder,
    loading,
    checkForDueReminders,
    markAsCompleted,
    dismissPopup,
    requestNotificationPermission,
    formatDateTime,
    getTimeRemaining
  }
}