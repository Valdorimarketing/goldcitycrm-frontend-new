// composables/useSoundSettings.ts
import { ref, watch, onMounted } from 'vue'

const soundEnabled = ref(true)

export function useSoundSettings() {
  const toggleSound = () => {
    soundEnabled.value = !soundEnabled.value
  }

  const playNotificationSound = () => {
    if (!soundEnabled.value) return

    const audio = new Audio('/bell.wav')
    audio.volume = 0.5
    audio.play().catch(() => {
      console.warn('Tarayıcı bildirim sesini engelledi.')
    })
  }

  // LocalStorage senkronizasyonu
  onMounted(() => {
    const stored = localStorage.getItem('soundEnabled')
    if (stored !== null) {
      soundEnabled.value = stored === 'true'
    }
  })

  watch(soundEnabled, (val) => {
    localStorage.setItem('soundEnabled', String(val))
  })

  return {
    soundEnabled,
    toggleSound,
    playNotificationSound
  }
}
