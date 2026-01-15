// composables/useNotificationSocket.ts

import { ref, onMounted, onUnmounted } from 'vue'
import { io, Socket } from 'socket.io-client'
import { useAuthStore } from '~/stores/auth'
import { useSoundSettings } from '~/composables/useSoundSettings'

interface DoctorReturnAlert {
  type: 'doctor_return_alert'
  notification: any
  customer: {
    id: number
    name: string
  }
  doctor: string
  previousStatus: string
  newStatus: string
}

export const useNotificationSocket = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  const { playNotificationSound } = useSoundSettings()

  const socket = ref<Socket | null>(null)
  const isConnected = ref(false)
  const doctorReturnAlerts = ref<DoctorReturnAlert[]>([])
  const showDoctorReturnModal = ref(false)
  const currentDoctorReturnAlert = ref<DoctorReturnAlert | null>(null)

  const connect = () => {
    if (socket.value?.connected) return

    const baseUrl = config.public.apiBase.replace('/api', '')
    
    socket.value = io(`${baseUrl}/notifications`, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    })

    socket.value.on('connect', () => {
      isConnected.value = true
      console.log('🔔 Notification socket connected')

      // Kullanıcıyı kaydet
      if (authStore.user?.id) {
        socket.value?.emit('register', { userId: authStore.user.id })
      }
    })

    socket.value.on('disconnect', () => {
      isConnected.value = false
      console.log('🔔 Notification socket disconnected')
    })

    // Genel bildirim dinleyici
    socket.value.on('notification', (data) => {
      console.log('📩 New notification:', data)
      playNotificationSound()
    })

    // Doktor dönüşü alert dinleyici
    socket.value.on('doctor_return_alert', (data: DoctorReturnAlert) => {
      console.log('🏥 Doctor return alert:', data)
      
      // Alert'i listeye ekle
      doctorReturnAlerts.value.unshift(data)
      
      // Modal'ı aç
      currentDoctorReturnAlert.value = data
      showDoctorReturnModal.value = true
      
      // Ses çal
      playNotificationSound()
    })
  }

  const disconnect = () => {
    socket.value?.disconnect()
    socket.value = null
    isConnected.value = false
  }

  const dismissDoctorReturnAlert = () => {
    showDoctorReturnModal.value = false
    currentDoctorReturnAlert.value = null
  }

  const dismissAllDoctorReturnAlerts = () => {
    doctorReturnAlerts.value = []
    showDoctorReturnModal.value = false
    currentDoctorReturnAlert.value = null
  }

  onMounted(() => {
    if (authStore.user?.id) {
      connect()
    }
  })

  onUnmounted(() => {
    disconnect()
  })

  return {
    socket,
    isConnected,
    doctorReturnAlerts,
    showDoctorReturnModal,
    currentDoctorReturnAlert,
    connect,
    disconnect,
    dismissDoctorReturnAlert,
    dismissAllDoctorReturnAlerts,
  }
}