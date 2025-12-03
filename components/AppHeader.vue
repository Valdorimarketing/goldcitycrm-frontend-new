<template>
  <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
    <div class="flex items-center justify-between h-16 px-4 lg:px-6">
      <!-- Left side - Mobile menu button and sidebar toggle -->
      <div class="flex items-center">
        <!-- Mobile menu button -->
        <button @click="openMobileSidebar"
          class="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700">
          <Bars3Icon class="w-6 h-6" />
        </button>

        <!-- Desktop sidebar toggle -->
        <button @click="toggleSidebar"
          class="hidden lg:block p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700">
          <Bars3Icon class="w-5 h-5" />
        </button>
      </div>

      <!-- Right side - User menu and notifications -->
      <div class="flex items-center space-x-2">
        <!-- Fraud Alert Notifications (Admin Only) -->
        <FraudAlertNotification v-if="authStore.user?.role === 'admin'" />
        <OperationNotifications v-if="authStore.user?.role === 'admin'" />
        <Notification v-if="authStore.user?.role === 'user'" />

        <!-- Lock Screen Button -->
        <button 
          @click="lockScreen"
          class="p-2 rounded-full text-gray-500 hover:text-amber-600 hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-gray-400 dark:hover:text-amber-400 dark:hover:bg-amber-900/20 transition-colors"
          title="Ekranı Kilitle (Ctrl+L)"
        >
          <LockClosedIcon class="w-5 h-5" />
        </button>

        <!-- Theme toggle -->
        <button @click="toggleDarkMode"
          class="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700">
          <SunIcon v-if="isDarkMode" class="w-6 h-6" />
          <MoonIcon v-else class="w-6 h-6" />
        </button>

        <!-- User menu -->
        <div class="relative">
          <button v-if="authStore" @click="userMenuOpen = !userMenuOpen"
            class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <img :src="path + authStore.user?.avatar" class="w-8 h-8 rounded-full border-2 border-white"
              v-if="authStore.user?.avatar" alt="">
            <div class="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center" v-else>
              <span class="text-sm font-medium text-white">
                {{ authStore.user?.name?.charAt(0) || 'U' }}
              </span>
            </div>
          </button>

          <!-- User dropdown menu -->
          <transition enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95">
            <div v-if="userMenuOpen"
              class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
              <div class="py-1">
                <div
                  class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                  <p class="font-medium">{{ authStore.user?.name || 'Demo User' }}</p>
                  <p class="text-gray-500 dark:text-gray-400">{{ authStore.user?.email || 'demo@example.com' }}</p>
                </div> 
                <NuxtLink to="/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                  Profil
                </NuxtLink>
                <button @click="lockScreen"
                  class="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                  <LockClosedIcon class="w-4 h-4" />
                  Ekranı Kilitle
                </button>
                <button @click="logout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                  Çıkış Yap
                </button>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- Lock Screen Overlay -->
    <LockScreenOverlay 
      :is-locked="isScreenLocked" 
      :user="authStore.user"
      @unlock="unlockScreen"
    />
  </header>
</template>

<script setup>
import { ref, inject, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import FraudAlertNotification from '~/components/FraudAlertNotification.vue'
import Notification from '~/components/Notification.vue'
import LockScreenOverlay from '~/components/LockScreenOverlay.vue'
import {
  Bars3Icon,
  SunIcon,
  MoonIcon,
  LockClosedIcon
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const sidebar = inject('sidebar')
const { toggleSidebar, openMobileSidebar } = sidebar
const config = useRuntimeConfig()

const userMenuOpen = ref(false)
const isDarkMode = ref(false)
const isScreenLocked = ref(false)
const path = config.public.apiBase

// Lock Screen Functions
const lockScreen = () => {
  userMenuOpen.value = false
  isScreenLocked.value = true
}

const unlockScreen = () => {
  isScreenLocked.value = false
}

// Keyboard shortcut for lock (Ctrl+L)
const handleKeydown = (event) => {
  if (event.ctrlKey && event.key === 'l') {
    event.preventDefault()
    lockScreen()
  }
}

// Close user menu when clicking outside
const closeUserMenu = (event) => {
  if (!event.target.closest('.relative')) {
    userMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeUserMenu)
  document.addEventListener('keydown', handleKeydown)
  // Check if dark mode is enabled
  isDarkMode.value = document.documentElement.classList.contains('dark')
})

onUnmounted(() => {
  document.removeEventListener('click', closeUserMenu)
  document.removeEventListener('keydown', handleKeydown)
})

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

const logout = () => {
  authStore.logout()
  navigateTo('/login')
}
</script>