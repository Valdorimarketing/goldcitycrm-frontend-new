<template>
  <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
    <div class="flex items-center justify-between h-16 px-4 lg:px-6">
      <!-- Left side - Mobile menu button and sidebar toggle -->
      <div class="flex items-center">
        <!-- Mobile menu button -->
        <button
          @click="openMobileSidebar"
          class="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
        >
          <Bars3Icon class="w-6 h-6" />
        </button>

        <!-- Desktop sidebar toggle -->
        <button
          @click="toggleSidebar"
          class="hidden lg:block p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
        >
          <Bars3Icon class="w-5 h-5" />
        </button>

        
      </div>

      <!-- Right side - User menu and notifications -->
      <div class="flex items-center space-x-4">
        <!-- Fraud Alert Notifications (Admin Only) -->
        <FraudAlertNotification v-if="authStore.user?.role === 'admin'" />
        <OperationNotifications v-if="authStore.user?.role === 'admin'"  />
        <Notification v-if="authStore.user?.role === 'user'" />


 
        <!-- Theme toggle -->
        <button
          @click="toggleDarkMode"
          class="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
        >
          <SunIcon v-if="isDarkMode" class="w-6 h-6" />
          <MoonIcon v-else class="w-6 h-6" />
        </button>

        <!-- User menu -->
        <div class="relative">
          <button
            @click="userMenuOpen = !userMenuOpen"
            class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <div class="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center" v-if="!authStore.user.avatar">
              <span class="text-sm font-medium text-white">
                {{ authStore.user?.name?.charAt(0) || 'U' }}
              </span>
            </div>
            <img :src="path + authStore.user.avatar" class="w-8 h-8 rounded-full border-2 border-white" alt="">
          </button>

          <!-- User dropdown menu -->
          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div
              v-if="userMenuOpen"
              class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
            >
              <div class="py-1">
                <div class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                  <p class="font-medium">{{ authStore.user?.name || 'Demo User' }}</p>
                  <p class="text-gray-500 dark:text-gray-400">{{ authStore.user?.email || 'demo@example.com' }}</p>
                </div>
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                  Profil
                </a>
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                  Ayarlar
                </a>
                <button
                  @click="logout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Çıkış Yap
                </button>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, inject, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import FraudAlertNotification from '~/components/FraudAlertNotification.vue' 
import Notification from '~/components/Notification.vue'
import {
  Bars3Icon, 
  SunIcon,
  MoonIcon
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const sidebar = inject('sidebar')
const { toggleSidebar, openMobileSidebar } = sidebar
const config = useRuntimeConfig()

const userMenuOpen = ref(false)
const isDarkMode = ref(false)
const path = config.public.apiBase

// Close user menu when clicking outside
const closeUserMenu = (event) => {
  if (!event.target.closest('.relative')) {
    userMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeUserMenu)
  // Check if dark mode is enabled
  isDarkMode.value = document.documentElement.classList.contains('dark')
})

onUnmounted(() => {
  document.removeEventListener('click', closeUserMenu)
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