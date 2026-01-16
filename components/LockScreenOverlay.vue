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
        v-if="isLocked" 
        class="fixed inset-0 z-[9998] flex items-center justify-center overflow-hidden"
      >
        <!-- Animated Gradient Background -->
        <div class="absolute inset-0 bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900">
          <!-- Animated Orbs -->
          <div class="absolute inset-0 overflow-hidden">
            <div class="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/20 rounded-full filter blur-3xl animate-float"></div>
            <div class="absolute bottom-1/4 -right-20 w-96 h-96 bg-rose-600/20 rounded-full filter blur-3xl animate-float-delayed"></div>
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-600/10 rounded-full filter blur-3xl animate-pulse-slow"></div>
          </div>
          
          <!-- Grid Pattern Overlay -->
          <div class="absolute inset-0 opacity-5" style="background-image: radial-gradient(circle at 1px 1px, white 1px, transparent 0); background-size: 40px 40px;"></div>
        </div>

        <!-- Content -->
        <div class="relative z-10 w-full max-w-md mx-4">
          <!-- Lock Card -->
          <div class="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <!-- Avatar -->
            <div class="flex justify-center mb-6">
              <div class="relative">
                <!-- Avatar Ring Animation -->
                <div class="absolute -inset-2 bg-gradient-to-r from-red-500 via-rose-500 to-rose-400 rounded-full animate-spin-slow opacity-75 blur-sm"></div>
                <div class="absolute -inset-2 bg-gradient-to-r from-red-500 via-rose-500 to-rose-400 rounded-full animate-spin-slow opacity-50"></div>
                
                <!-- Avatar Image -->
                <div class="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white/20 shadow-xl">
                  <img 
                    v-if="user?.avatar" 
                    :src="avatarPath + user.avatar" 
                    :alt="user?.name"
                    class="w-full h-full object-cover"
                  />
                  <div 
                    v-else 
                    class="w-full h-full bg-gradient-to-br to-rose-500 to-rose-500 flex items-center justify-center"
                  >
                    <span class="text-4xl font-bold text-white">
                      {{ user?.name?.charAt(0) || 'U' }}
                    </span>
                  </div>
                </div>

                <!-- Lock Badge -->
                <div class="absolute -bottom-1 -right-1 w-10 h-10 bg-gradient-to-br from-rose-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- User Name -->
            <h1 class="text-2xl font-bold text-white text-center mb-2">
              {{ user?.name || 'Kullanıcı' }}
            </h1>

            <!-- Lock Duration -->
            <div class="flex items-center justify-center gap-2 mb-6">
              <div class="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-slate-300 text-sm font-medium">{{ formattedDuration }}</span>
              </div>
            </div>

            <!-- Motivational Quote -->
            <div class="mb-8 text-center">
              <p class="text-slate-400 text-sm italic leading-relaxed">
                "{{ currentQuote }}"
              </p>
            </div>

            <!-- Unlock Button -->
            <button 
              @click="unlock"
              class="group relative w-full py-4 px-6 overflow-hidden rounded-2xl font-semibold text-white transition-all duration-300"
            >
              <!-- Button Background -->
              <div class="absolute inset-0 bg-gradient-to-r from-blue-600 via-rose-600 to-rose-500 transition-transform duration-300 group-hover:scale-105"></div>
              <div class="absolute inset-0 bg-gradient-to-r from-red-500 via-rose-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <!-- Shine Effect -->
              <div class="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </div>
              
              <!-- Button Content -->
              <div class="relative flex items-center justify-center gap-3">
                <svg class="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
                <span>Kilidi Aç</span>
              </div>
            </button>

            <!-- Keyboard Shortcut Hint -->
            <p class="mt-4 text-center text-slate-500 text-xs">
              veya <kbd class="px-2 py-1 bg-white/10 rounded text-slate-400 font-mono">Enter</kbd> tuşuna basın
            </p>
          </div>

          <!-- Current Time -->
          <div class="mt-6 text-center">
            <p class="text-5xl font-light text-white/90 tracking-wider">
              {{ currentTime }}
            </p>
            <p class="text-slate-400 text-sm mt-2">
              {{ currentDate }}
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="absolute bottom-6 left-0 right-0 text-center">
          <p class="text-slate-600 text-xs">
            MLP Care CRM © 2025 • Powered by <span class="text-slate-500">Valdori</span>
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  isLocked: {
    type: Boolean,
    default: false
  },
  user: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['unlock'])

const config = useRuntimeConfig()
const avatarPath = config.public.apiBase

// Lock duration tracking
const lockStartTime = ref(null)
const elapsedSeconds = ref(0)

// Current time
const currentTime = ref('')
const currentDate = ref('')

// Motivational quotes
const quotes = [
  "Başarı, küçük çabaların her gün tekrarlanmasıdır.",
  "Bugün atacağın adımlar, yarının temelini oluşturur.",
  "Her başarı hikayesi, bir karar anıyla başlar.",
  "Mükemmellik bir eylem değil, bir alışkanlıktır.",
  "Fırsatlar bekleyenlere değil, arayanlara gelir.",
  "Güçlü olan kazanmaz, kazanan güçlü olur.",
  "Başlamak için harika olmak zorunda değilsin, harika olmak için başlamak zorundasın.",
  "Bir gün değil, birinci gün.",
  "Disiplin, motivasyonun bittiği yerde başlar.",
  "Bugünün işini yarına bırakma."
]

const currentQuote = ref(quotes[Math.floor(Math.random() * quotes.length)])

// Intervals
let timeInterval = null
let durationInterval = null

// Formatted duration
const formattedDuration = computed(() => {
  const hours = Math.floor(elapsedSeconds.value / 3600)
  const minutes = Math.floor((elapsedSeconds.value % 3600) / 60)
  const seconds = elapsedSeconds.value % 60

  if (hours > 0) {
    return `${hours} saat ${minutes} dakika kilitli`
  } else if (minutes > 0) {
    return `${minutes} dakika ${seconds} saniye kilitli`
  } else {
    return `${seconds} saniye kilitli`
  }
})

// Update current time
function updateTime() {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit'
  })
  currentDate.value = now.toLocaleDateString('tr-TR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// Update elapsed duration
function updateDuration() {
  if (lockStartTime.value) {
    elapsedSeconds.value = Math.floor((Date.now() - lockStartTime.value) / 1000)
  }
}

// Unlock handler
function unlock() {
  emit('unlock')
}

// Keyboard handler
function handleKeydown(event) {
  if (props.isLocked && event.key === 'Enter') {
    unlock()
    event.preventDefault()
    return false;
  }
}

// Watch lock state
watch(() => props.isLocked, (newValue) => {
  if (newValue) {
    lockStartTime.value = Date.now()
    elapsedSeconds.value = 0
    currentQuote.value = quotes[Math.floor(Math.random() * quotes.length)]
    
    // Start duration interval
    durationInterval = setInterval(updateDuration, 1000)
  } else {
    lockStartTime.value = null
    elapsedSeconds.value = 0
    
    // Clear duration interval
    if (durationInterval) {
      clearInterval(durationInterval)
      durationInterval = null
    }
  }
})

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
  
  window.addEventListener('keydown', handleKeydown)
  
  // If already locked on mount
  if (props.isLocked) {
    lockStartTime.value = Date.now()
    durationInterval = setInterval(updateDuration, 1000)
  }
})

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval)
  if (durationInterval) clearInterval(durationInterval)
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(-20px) translateX(10px);
  }
  50% {
    transform: translateY(0) translateX(20px);
  }
  75% {
    transform: translateY(20px) translateX(10px);
  }
}

@keyframes float-delayed {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(20px) translateX(-10px);
  }
  50% {
    transform: translateY(0) translateX(-20px);
  }
  75% {
    transform: translateY(-20px) translateX(-10px);
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

@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.1;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.2;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

.animate-float {
  animation: float 8s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 10s ease-in-out infinite;
}

.animate-spin-slow {
  animation: spin-slow 8s linear infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 6s ease-in-out infinite;
}
</style>