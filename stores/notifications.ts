import { defineStore } from 'pinia'
import { useApi } from '@/composables/useApi'

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    notifications: [] as any[],
  }),
  getters: {
    unreadCount: (state) => state.notifications.filter((n) => !n.read).length,
  },
  actions: {
    async fetchNotifications() {
      try {
        const api = useApi()
        const data = await api('/notifications') as any
        this.notifications = data
      } catch (error) {
        console.error('Bildirimler alınamadı:', error)
      }
    },

    async markAsRead(id: number) {
      try {
        const api = useApi()
        await api(`/notifications/${id}/read`, { method: 'PATCH' })
        const notif = this.notifications.find((n) => n.id === id)
        if (notif) notif.read = true
      } catch (error) {
        console.error('Bildirim okunamadı:', error)
      }
    },
  },
})
