
import { ref } from 'vue'

interface FraudAlert {
  id: number
  message: string
  userId: number
  user?: {
    id: number
    name: string
    email?: string
  }
  isRead: boolean
  isChecked: boolean
  createdAt: string
  updatedAt: string
}

export const useFraudAlerts = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase
  
  const unreadCount = ref(0)
  const alerts = ref<FraudAlert[]>([])
  const showPopup = ref(false)
  const currentAlert = ref<FraudAlert | null>(null)
  const loading = ref(false)
  
  // Get unread alerts
  const getUnreadAlerts = async () => {
    try {
      const response = await $fetch<FraudAlert[]>('/fraud-alerts', {
        baseURL: apiBase,
        params: {
          unread: true,
          include: 'user'
        }
      })
      return response
    } catch (error) {
      console.error('Error fetching unread alerts:', error)
      return []
    }
  }
  
  // Get unread count
  const getUnreadCount = async () => {
    try {
      const response = await $fetch<{ count: number }>('/fraud-alerts/count/unread', {
        baseURL: apiBase
      })
      unreadCount.value = response.count
      return response.count
    } catch (error) {
      console.error('Error fetching unread count:', error)
      return 0
    }
  }
  
  // Get recent alerts for dropdown
  const getRecentAlerts = async (limit = 5) => {
    try {
      const response = await $fetch<FraudAlert[]>('/fraud-alerts', {
        baseURL: apiBase,
        params: {
          limit,
          include: 'user'
        }
      })
      alerts.value = response
      return response
    } catch (error) {
      console.error('Error fetching recent alerts:', error)
      return []
    }
  }
  
  // Mark as read
  const markAsRead = async (id: number) => {
    try {
      await $fetch(`/fraud-alerts/${id}/read`, {
        baseURL: apiBase,
        method: 'PUT'
      })
      await getUnreadCount()
      return true
    } catch (error) {
      console.error('Error marking alert as read:', error)
      return false
    }
  }
  
  // Mark as checked
  const markAsChecked = async (id: number) => {
    try {
      await $fetch(`/fraud-alerts/${id}`, {
        baseURL: apiBase,
        method: 'PATCH',
        body: {
          isRead: true,
          isChecked: true
        }
      })
      await getUnreadCount()
      showPopup.value = false
      return true
    } catch (error) {
      console.error('Error marking alert as checked:', error)
      return false
    }
  }
  
  // Check for new alerts (called every 30 seconds)
  const checkForNewAlerts = async () => {
    const unreadAlerts = await getUnreadAlerts()
    
    if (unreadAlerts.length > 0) {
      const sessionKey = `fraudAlert_${unreadAlerts[0].id}_shown`
      const alertShown = sessionStorage.getItem(sessionKey)
      
      if (!alertShown) {
        currentAlert.value = unreadAlerts[0]
        showPopup.value = true
        sessionStorage.setItem(sessionKey, 'true')
      }
    }
    
    await getUnreadCount()
  }
  
  // Dismiss popup (Sonra Hatırlat)
  const dismissPopup = () => {
    showPopup.value = false
    currentAlert.value = null
  }
  
  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Az önce'
    if (diffMins < 60) return `${diffMins} dakika önce`
    
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} saat önce`
    
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 7) return `${diffDays} gün önce`
    
    return date.toLocaleDateString('tr-TR')
  }
  
  // Truncate message
  const truncateMessage = (message: string, length = 50) => {
    if (message.length <= length) return message
    return message.substring(0, length) + '...'
  }
  
  return {
    unreadCount,
    alerts,
    showPopup,
    currentAlert,
    loading,
    getUnreadAlerts,
    getUnreadCount,
    getRecentAlerts,
    markAsRead,
    markAsChecked,
    checkForNewAlerts,
    dismissPopup,
    formatRelativeTime,
    truncateMessage
  }
}