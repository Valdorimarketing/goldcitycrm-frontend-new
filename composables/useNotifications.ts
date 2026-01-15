import { ref } from 'vue'
import { useApi } from '~/composables/useApi'
import { useSoundSettings } from '~/composables/useSoundSettings'

interface Notification {
  id: number
  message: string
  isRead: boolean
  createdAt: string
}

const notifications = ref<Notification[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

export function useNotifications() {
  const api = useApi()
  const { playNotificationSound } = useSoundSettings()

  /** Bildirimleri backend'den çek */
  const fetchNotifications = async () => {
    loading.value = true
    error.value = null

    try {
      const response: any = await api('/notifications')

      // API yanıt formatına göre ayarla
      if (Array.isArray(response)) {
        notifications.value = response
      } else if (response?.data) {
        notifications.value = response.data
      } else {
        notifications.value = []
      }

      return notifications.value
    } catch (err: any) {
      console.error('Bildirimler alınamadı:', err)
      error.value = err.message || 'Bildirimler alınamadı.'
      notifications.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  /** Bildirimi okundu yap */
  const markAsRead = async (notif: Notification) => {
    if (notif.isRead) return

    try {
      await api(`/notifications/${notif.id}/read`, { method: 'PATCH' })
      notif.isRead = true
    } catch (error) {
      console.error('Bildirim okundu işaretlenemedi:', error)
    }
  }

  /** Tüm bildirimleri okundu yap */
  const markAllAsRead = async () => {
    try {
      await api('/notifications/mark-all-read', { method: 'PATCH' })
      notifications.value.forEach((n) => (n.isRead = true))
    } catch (error) {
      console.error('Tüm bildirimler okundu yapılamadı:', error)
    }
  }

  /** Yeni bildirim eklendiğinde */
  const addNotification = (notif: Notification) => {
    notifications.value.unshift(notif)
    playNotificationSound()
  }

  async function deleteReadNotifications() {
    await api('/notifications/delete-read', { method: 'DELETE' })
    notifications.value = notifications.value.filter((n) => !n.isRead)
  }

  return {
    notifications,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    addNotification,
    deleteReadNotifications
  }
}
