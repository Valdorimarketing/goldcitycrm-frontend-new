<template>
  <div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
    <div class="pointer-events-auto">
      <!-- Main Container -->
      <div
        class="relative backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 rounded-full shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden transition-all duration-300 hover:shadow-3xl hover:scale-105"
      >
        <!-- Background Gradient Animation -->
        <div class="absolute inset-0 bg-gradient-to-r from-rose-500/10 via-rose-500/10 to-rose-400/10 animate-gradient-x"></div>
        
        <!-- Content -->
        <div class="relative flex items-center gap-6 px-6 py-3">
          
          <!-- Avatar Section -->
          <div class="relative group">
            <!-- Online Status Ring -->
            <div class="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse-slow"></div>
            <div class="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 blur-md opacity-75 animate-ping-slow"></div>
            
            <!-- Avatar -->
            <div class="relative w-14 h-14 rounded-full overflow-hidden ring-4 ring-white dark:ring-gray-800 transition-transform duration-300 group-hover:scale-110">
              <img
                v-if="user?.avatar"
                :src="path + user.avatar"
                :alt="user.name"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full bg-gradient-to-br from-rose-500 to-rose-500 flex items-center justify-center text-white font-bold text-lg"
              >
                {{ user?.name?.charAt(0).toUpperCase() }}
              </div>
              
              <!-- Online Indicator -->
              <div class="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></div>
            </div>
          </div>

          <!-- Stats Section -->
          <div class="flex items-center gap-6">
            
            <!-- Speed Stat -->
            <div class="group cursor-pointer">
              <div class="flex items-center gap-2 transition-transform duration-300 group-hover:-translate-y-1">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center shadow-lg group-hover:shadow-rose-500/50 transition-shadow">
                  <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Hız</p>
                  <p class="text-sm font-bold text-gray-900 dark:text-white">
                    {{ formatSpeed(userStats?.avgFirstTouchMinutes) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Divider -->
            <div class="w-px h-10 bg-gradient-to-b from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>

            <!-- Daily Leads -->
            <div class="group cursor-pointer">
              <div class="flex items-center gap-2 transition-transform duration-300 group-hover:-translate-y-1">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-cyan-600 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/50 transition-shadow">
                  <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Bugün</p>
                  <p class="text-sm font-bold text-gray-900 dark:text-white">
                    {{ dailyLeads }} Lead
                  </p>
                </div>
              </div>
            </div>

            <!-- Divider -->
            <div class="w-px h-10 bg-gradient-to-b from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>

            <!-- Sales Count -->
            <div class="group cursor-pointer">
              <div class="flex items-center gap-2 transition-transform duration-300 group-hover:-translate-y-1">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg group-hover:shadow-green-500/50 transition-shadow">
                  <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Satış</p>
                  <p class="text-sm font-bold text-gray-900 dark:text-white">
                    {{ todaySales }} Adet
                  </p>
                </div>
              </div>
            </div>

            <!-- Divider -->
            <div class="w-px h-10 bg-gradient-to-b from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>

            <!-- Conversion Rate -->
            <div class="group cursor-pointer">
              <div class="flex items-center gap-2 transition-transform duration-300 group-hover:-translate-y-1">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:shadow-rose-500/50 transition-shadow">
                  <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Dönüşüm</p>
                  <p class="text-sm font-bold text-gray-900 dark:text-white">
                    {{ userStats?.conversionRate || 0 }}%
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- Tooltip on Hover -->
      <div class="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div class="bg-gray-900 dark:bg-gray-800 text-white text-xs px-3 py-2 rounded-lg shadow-xl whitespace-nowrap">
          {{ user?.name }} - Aktif
          <div class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900 dark:bg-gray-800"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'


const config = useRuntimeConfig()
const path = config.public.apiBase


const props = defineProps({
  user: Object,
  userStats: Object,
  dailyLeads: {
    type: Number,
    default: 0
  },
  todaySales: {
    type: Number,
    default: 0
  }
})

const formatSpeed = (minutes) => {
  if (!minutes || minutes === 0) return 'Veri yok';
  
  if (minutes < 1) {
    const seconds = Math.round(minutes * 60);
    return `${seconds}sn`;
  }
  
  if (minutes < 60) {
    return `${Math.round(minutes)}dk`;
  }
  
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}s ${mins}dk`;
}
</script>

<style scoped>
@keyframes gradient-x {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.05);
  }
}

@keyframes ping-slow {
  0% {
    transform: scale(1);
    opacity: 0.75;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.4;
  }
  100% {
    transform: scale(1.4);
    opacity: 0;
  }
}

.animate-gradient-x {
  background-size: 200% 200%;
  animation: gradient-x 3s ease infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-ping-slow {
  animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.shadow-3xl {
  box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.3);
}
</style>