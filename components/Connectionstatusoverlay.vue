<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="!isConnected && showOverlay" 
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      >
        <!-- Animated Background Pattern -->
        <div class="absolute inset-0 overflow-hidden">
          <div class="absolute inset-0 opacity-10">
            <div class="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div class="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div class="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
          </div>
        </div>

        <!-- Content -->
        <div class="relative z-10 max-w-lg mx-4 text-center">
          <!-- Logo/Icon -->
          <div class="mb-8">
            <div class="relative inline-flex items-center justify-center">
              <!-- Outer Ring Animation -->
              <div class="absolute w-32 h-32 border-4 border-blue-500/30 rounded-full animate-ping-slow"></div>
              <div class="absolute w-28 h-28 border-2 border-indigo-500/40 rounded-full animate-spin-slow"></div>
              
              <!-- Inner Icon Container -->
              <div class="relative w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/30">
                <svg 
                  class="w-12 h-12 text-white animate-pulse" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
            </div>
          </div>

          <!-- Main Text -->
          <h1 class="text-3xl md:text-4xl font-bold text-white mb-4">
            Sistem Güncelleniyor
          </h1>
          
          <p class="text-lg text-slate-300 mb-8 leading-relaxed">
            Şu anda bakım çalışması yapılmaktadır.<br>
            En kısa sürede tekrar aktif olacaktır.
          </p>

          <!-- Status Card -->
          <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
            <div class="flex items-center justify-center gap-3 mb-4">
              <span class="relative flex h-3 w-3">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              <span class="text-amber-400 font-medium">Bağlantı bekleniyor...</span>
            </div>
            
            <p class="text-slate-400 text-sm">
              Herhangi bir işlem yapmanıza gerek yok.<br>
              Bağlantı sağlandığında bu ekran otomatik olarak kapanacaktır.
            </p>
          </div>

          <!-- Progress Indicator -->
          <div class="mb-8">
            <div class="flex items-center justify-center gap-2 mb-3">
              <span class="text-slate-400 text-sm">Yeniden bağlanılıyor</span>
              <div class="flex gap-1">
                <span class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
                <span class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
                <span class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
              </div>
            </div>
            
            <!-- Retry Counter -->
            <div class="text-slate-500 text-xs">
              Deneme: {{ retryCount }} • Son kontrol: {{ lastCheckTime }}
            </div>
          </div>

          <!-- Manual Retry Button (appears after multiple failures) -->
          <Transition
            enter-active-class="transition-all duration-300"
            enter-from-class="opacity-0 translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
          >
            <button 
              v-if="retryCount >= 5"
              @click="manualRetry"
              :disabled="checking"
              class="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50"
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
          </Transition>

          <div class="mt-8 pt-6 border-t border-white/10 text-center">
            <p class="text-slate-600 text-xs">
              MLP Care CRM © 2025 • Powered by <a href="https://valdori.com" target="_blank" class="text-slate-500 hover:text-blue-400 transition-colors">Valdori</a>
            </p>
          </div>
        </div>

        <!-- Version Info -->
        <div class="absolute bottom-4 left-0 right-0 text-center">
          <span class="text-slate-600 text-xs">v1.0.0</span>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  pingUrl: {
    type: String,
    default: '/health' // veya '/api/ping'
  },
  pingInterval: {
    type: Number,
    default: 10000 // 10 saniye
  },
  initialDelay: {
    type: Number,
    default: 3000 // İlk gösterim için 3 saniye bekle
  }
})

const emit = defineEmits(['connected', 'disconnected'])

const config = useRuntimeConfig()
const apiBase = config.public.apiBase

const isConnected = ref(true)
const showOverlay = ref(false)
const checking = ref(false)
const retryCount = ref(0)
const lastCheck = ref(new Date())

let pingIntervalId = null
let connectionLostTimeout = null

const lastCheckTime = computed(() => {
  return lastCheck.value.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
})

async function checkConnection() {
  checking.value = true
  
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 saniye timeout
    
    const response = await fetch(`${apiBase}${props.pingUrl}`, {
      method: 'GET',
      signal: controller.signal,
      cache: 'no-store'
    })
    
    clearTimeout(timeoutId)
    
    if (response.ok) {
      // Bağlantı başarılı
      if (!isConnected.value) {
        isConnected.value = true
        showOverlay.value = false
        retryCount.value = 0
        emit('connected')
      }
    } else {
      handleDisconnection()
    }
  } catch (error) {
    handleDisconnection()
  } finally {
    checking.value = false
    lastCheck.value = new Date()
  }
}

function handleDisconnection() {
  retryCount.value++
  
  if (isConnected.value) {
    isConnected.value = false
    emit('disconnected')
    
    // Küçük bir gecikme ile overlay'i göster (geçici bağlantı kopmaları için)
    if (!connectionLostTimeout) {
      connectionLostTimeout = setTimeout(() => {
        if (!isConnected.value) {
          showOverlay.value = true
        }
      }, props.initialDelay)
    }
  }
}

function manualRetry() {
  retryCount.value = 0
  checkConnection()
}

// Online/Offline event listeners
function handleOnline() {
  checkConnection()
}

function handleOffline() {
  handleDisconnection()
}

onMounted(() => {
  // İlk kontrol
  checkConnection()
  
  // Periyodik kontrol
  pingIntervalId = setInterval(checkConnection, props.pingInterval)
  
  // Browser online/offline events
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
})

onUnmounted(() => {
  if (pingIntervalId) {
    clearInterval(pingIntervalId)
  }
  if (connectionLostTimeout) {
    clearTimeout(connectionLostTimeout)
  }
  window.removeEventListener('online', handleOnline)
  window.removeEventListener('offline', handleOffline)
})
</script>

<style scoped>
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

@keyframes ping-slow {
  75%, 100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.animate-ping-slow {
  animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.animate-spin-slow {
  animation: spin-slow 8s linear infinite;
}
</style>