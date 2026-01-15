
import { ref } from 'vue'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
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

interface FetchAlertsParams {
  page?: number
  limit?: number
  search?: string
  order?: 'ASC' | 'DESC'
  userId?: number
  isRead?: boolean
  isChecked?: boolean
  startDate?: string
  endDate?: string
}

export const useFraudAlerts = () => {
  const $api = useApi()
  dayjs.extend(relativeTime)

  const unreadCount = ref(0)
  const uncheckedCount = ref(0)
  const alerts = ref<FraudAlert[]>([])
  const showPopup = ref(false)
  const currentAlert = ref<FraudAlert | null>(null)
  const loading = ref(false)
  const meta = ref({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  })

  // Fetch alerts with pagination and filters
  const fetchAlerts = async (params?: FetchAlertsParams) => {
    loading.value = true
    try {
      const queryParams: any = {
        page: params?.page || 1,
        limit: params?.limit || 20,
        include: 'user'
      }

      if (params?.search) queryParams.search = params.search
      if (params?.order) queryParams.order = params.order
      if (params?.userId) queryParams.userId = params.userId
      if (params?.isRead !== undefined) queryParams.isRead = params.isRead
      if (params?.isChecked !== undefined) queryParams.isChecked = params.isChecked
      if (params?.startDate) queryParams.startDate = params.startDate
      if (params?.endDate) queryParams.endDate = params.endDate

      const response: any = await $api('/fraud-alerts', { params: queryParams })

      // Handle paginated response
      if (response && response.data && Array.isArray(response.data)) {
        alerts.value = response.data
        if (response.meta) {
          meta.value = {
            page: response.meta.page || 1,
            limit: response.meta.limit || 20,
            total: response.meta.total || 0,
            totalPages: response.meta.totalPages || 0
          }
        }
      } else if (Array.isArray(response)) {
        // Handle non-paginated response
        alerts.value = response

        meta.value = {
          page: 1,
          limit: response.length,
          total: response.length,
          totalPages: 1
        }
      } else {
        // Unexpected response format
        console.warn('Unexpected fraud alerts response format:', response)
        alerts.value = []
        meta.value = {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0
        }
      }

      return { data: alerts.value, meta: meta.value }
    } catch (error: any) {
      console.error('Error fetching fraud alerts:', error)
      alerts.value = []
      meta.value = {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0
      }
      // Don't throw, just return empty data
      return { data: [], meta: meta.value }
    } finally {
      loading.value = false
    }
  }

  // Get unread alerts
  const getUnreadAlerts = async () => {
    try {
      const response = await $api<FraudAlert[]>('/fraud-alerts', {
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
  const getUnreadCount = async (userId?: number) => {
    try {
      const params = userId ? { user: userId } : {}
      const response = await $api<{ count: number }>('/fraud-alerts/count/unread', { params })
      unreadCount.value = response.count
      return response.count
    } catch (error) {
      console.error('Error fetching unread count:', error)
      return 0
    }
  }

  // Get unchecked count
  const getUncheckedCount = async (userId?: number) => {
    try {
      const params = userId ? { user: userId } : {}
      const response = await $api<{ count: number }>('/fraud-alerts/count/unchecked', { params })
      uncheckedCount.value = response.count
      return response.count
    } catch (error) {
      console.error('Error fetching unchecked count:', error)
      return 0
    }
  }

  // Get recent alerts for dropdown
  const getRecentAlerts = async (limit = 5) => {
    try {
      const response = await $api<FraudAlert[]>('/fraud-alerts', {
        params: {
          limit,
          include: 'user'
        }
      }) as any
      alerts.value = response.data
      return response
    } catch (error) {
      console.error('Error fetching recent alerts:', error)
      return []
    }
  }

  // Mark as read
  const markAsRead = async (id: number) => {
    try {
      await $api(`/fraud-alerts/${id}/read`, {
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
      await $api(`/fraud-alerts/${id}`, {
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
    const unreadAlerts = await getUnreadAlerts() as any

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
  const formatRelativeTime = (dateString: any) => { 
    if (!dateString) return '';
    dateString = new Date(dateString);
    
    return dayjs(dateString).fromNow()
  }

  // Truncate message
  const truncateMessage = (message: string, length = 50) => {
    if (!message) return;
    if (message.length <= length) return message
    return message.substring(0, length) + '...'
  }

  return {
    unreadCount,
    uncheckedCount,
    alerts,
    showPopup,
    currentAlert,
    loading,
    meta,
    fetchAlerts,
    getUnreadAlerts,
    getUnreadCount,
    getUncheckedCount,
    getRecentAlerts,
    markAsRead,
    markAsChecked,
    checkForNewAlerts,
    dismissPopup,
    formatRelativeTime,
    truncateMessage
  }
}