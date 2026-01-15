<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-500"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="showOverlay" 
        class="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      >
        <!-- Background -->
        <div class="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div class="absolute inset-0 overflow-hidden">
            <div class="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/15 rounded-full filter blur-3xl animate-float"></div>
            <div class="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-600/15 rounded-full filter blur-3xl animate-float-delayed"></div>
          </div>
        </div>

        <!-- Content -->
        <div class="relative z-10 w-full max-w-md mx-4 text-center">
          <div class="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            
            <!-- Animated Icon -->
            <div class="mb-8 flex justify-center">
              <div class="relative">
                <div class="absolute -inset-4 bg-blue-500/20 rounded-full animate-ping-slow"></div>
                <div class="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-xl">
                  <svg class="w-10 h-10 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Title -->
            <h1 class="text-2xl font-bold text-white mb-3">
              Bağlantı Bekleniyor
            </h1>

            <!-- Message -->
            <p class="text-slate-300 text-sm leading-relaxed mb-6">
              Sisteme şu anda ulaşılamıyor.<br>
              Bağlantı sağlandığında bu ekran otomatik kapanacaktır.
            </p>

            <!-- Status Indicator -->
            <div class="flex items-center justify-center gap-3 mb-6">
              <span class="relative flex h-3 w-3">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              <span class="text-amber-400 text-sm font-medium">Yeniden bağlanılıyor...</span>
            </div>

            <!-- Retry Counter -->
            <div class="text-slate-500 text-xs mb-6">
              Deneme: {{ retryCount }} • {{ lastCheckTime }}
            </div>

            <!-- Manual Retry Button -->
            <button 
              @click="manualRetry"
              :disabled="checking"
              class="w-full py-3 px-6 bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <svg 
                class="w-5 h-5" 
                :class="{ 'animate-spin': checking }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {{ checking ? 'Kontrol ediliyor...' : 'Tekrar Dene' }}
            </button>
          </div>

          <!-- Time -->
          <div class="mt-8 text-center">
            <p class="text-4xl font-light text-white/80 tracking-wider">{{ currentTime }}</p>
            <p class="text-slate-500 text-sm mt-2">{{ currentDate }}</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="absolute bottom-6 left-0 right-0 text-center">
          <p class="text-slate-600 text-xs">
            MLP Care CRM © 2025 • Powered by Valdori
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  pingInterval: {
    type: Number,
    default: 10000 // 10 saniye
  },
  failThreshold: {
    type: Number,
    default: 3 // 3 başarısız denemeden sonra göster
  }
})

const emit = defineEmits(['connected', 'disconnected'])

const config = useRuntimeConfig()
const apiBase = config.public.apiBase

// State
const showOverlay = ref(false)
const checking = ref(false)
const retryCount = ref(0)
const failCount = ref(0)
const lastCheck = ref(new Date())
const currentTime = ref('')
const currentDate = ref('')

// Intervals
let pingIntervalId = null
let timeIntervalId = null

// Computed
const lastCheckTime = computed(() => {
  return lastCheck.value.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
})

// Health check
async function checkConnection() {
  checking.value = true
  retryCount.value++
  lastCheck.value = new Date()

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    const response = await fetch(`${apiBase}/health`, {
      method: 'GET',
      signal: controller.signal,
      cache: 'no-store',
    })

    clearTimeout(timeoutId)

    if (response.ok) {
      handleSuccess()
    } else {
      handleFailure()
    }
  } catch {
    handleFailure()
  } finally {
    checking.value = false
  }
}

function handleFailure() {
  failCount.value++
  
  if (failCount.value >= props.failThreshold && !showOverlay.value) {
    showOverlay.value = true
    emit('disconnected')
  }
}

function handleSuccess() {
  failCount.value = 0
  
  if (showOverlay.value) {
    showOverlay.value = false
    emit('connected')
  }
}

function manualRetry() {
  retryCount.value = 0
  checkConnection()
}

// Update time
function updateTime() {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit'
  })
  currentDate.value = now.toLocaleDateString('tr-TR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })
}

// Lifecycle
onMounted(() => {
  updateTime()
  timeIntervalId = setInterval(updateTime, 1000)

  // İlk kontrol
  setTimeout(() => {
    checkConnection()
    pingIntervalId = setInterval(checkConnection, props.pingInterval)
  }, 2000)

  // Browser online/offline
  window.addEventListener('online', checkConnection)
  window.addEventListener('offline', handleFailure)
})

onUnmounted(() => {
  if (pingIntervalId) clearInterval(pingIntervalId)
  if (timeIntervalId) clearInterval(timeIntervalId)
  window.removeEventListener('online', checkConnection)
  window.removeEventListener('offline', handleFailure)
})
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@keyframes float-delayed {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(20px); }
}

@keyframes ping-slow {
  75%, 100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.animate-float {
  animation: float 8s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 10s ease-in-out infinite;
}

.animate-ping-slow {
  animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}
</style>