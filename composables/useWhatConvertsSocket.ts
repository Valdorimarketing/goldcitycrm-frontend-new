// composables/useWhatConvertsSocket.ts
import { ref, onMounted, onUnmounted } from 'vue'
import { io, Socket } from 'socket.io-client'
import { useAuthStore } from '~/stores/auth'

export const useWhatConvertsSocket = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  
  const socket = ref<Socket | null>(null)
  const isConnected = ref(false)
  const newLeadNotification = ref<any>(null)
  const showNotification = ref(false)

  /**
   * Socket bağlantısını başlat
   */
  const connect = () => {
    if (socket.value?.connected) {
      console.log('✅ Socket zaten bağlı')
      return
    }

    const userId = authStore.user?.id
    const isAdmin = authStore.user?.role?.toLowerCase() === 'admin'

    // Socket.IO bağlantısı
    socket.value = io(`${config.public.apiBase}/whatconverts`, {
      transports: ['websocket', 'polling'],
      query: {
        userId: userId || '',
        isAdmin: isAdmin ? 'true' : 'false'
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    })

    // Bağlantı kurulduğunda
    socket.value.on('connect', () => {
      console.log('✅ WhatConverts Socket connected:', socket.value?.id)
      isConnected.value = true
    })

    // Bağlantı koptuğunda
    socket.value.on('disconnect', (reason) => {
      console.log('❌ WhatConverts Socket disconnected:', reason)
      isConnected.value = false
    })

    // Yeniden bağlanma denemesi
    socket.value.on('reconnect_attempt', (attempt) => {
      console.log(`🔄 Reconnecting... Attempt ${attempt}`)
    })

    // Bağlantı hatası
    socket.value.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error.message)
      isConnected.value = false
    })

    // ✅ YENİ LEAD BİLDİRİMİ
    socket.value.on('newLead', (data) => {
      console.log('🔔 New lead received:', data)
      
      newLeadNotification.value = data
      showNotification.value = true

      // Browser notification (izin verilmişse)
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🎯 Yeni Lead!', {
          body: `${data.data.leadType} - ${data.data.source}`,
          icon: '/favicon.ico',
          requireInteraction: true
        })
      }
    })

    // Lead güncellendiğinde
    socket.value.on('leadUpdated', (data) => {
      console.log('📝 Lead updated:', data)
    })

    // Lead hatası
    socket.value.on('leadError', (data) => {
      console.error('⚠️ Lead error:', data)
    })
  }

  /**
   * Socket bağlantısını kapat
   */
  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
      isConnected.value = false
      console.log('🔌 Socket disconnected')
    }
  }

  /**
   * Bildirimi kapat
   */
  const dismissNotification = () => {
    showNotification.value = false
    newLeadNotification.value = null
  }

  /**
   * Lead'e git
   */
  const goToLead = (customerId: number) => {
    dismissNotification()
    // Customer detay sayfasına yönlendir
    navigateTo(`/customers/show/${customerId}`)
  }

  /**
   * Browser notification izni iste
   */
  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return Notification.permission === 'granted'
  }

  return {
    socket,
    isConnected,
    newLeadNotification,
    showNotification,
    connect,
    disconnect,
    dismissNotification,
    goToLead,
    requestNotificationPermission
  }
}