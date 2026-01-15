<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useCustomersStore } from '~/stores/customers'
import { useLanguage } from '~/composables/useLanguage'
import {
  Bars3Icon,
  HomeIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  LockClosedIcon,
  SunIcon,
  MoonIcon,
  UserIcon,
  ChevronDownIcon, 
  UsersIcon,
  ShoppingBagIcon,
  ArrowLeftIcon
} from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  breadcrumbInfo: {
    type: Object,
    default: () => ({
      current: { name: '', icon: null },
      parent: null
    })
  }
})

// Inject sidebar state
const sidebar = inject('sidebar')
const config = useRuntimeConfig()

// Stores
const authStore = useAuthStore()
const customersStore = useCustomersStore()
const router = useRouter()
const route = useRoute()

// Language & RTL
const { t, currentLanguage } = useLanguage()

// RTL diller listesi
const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur']

// Mevcut dil RTL mi?
const isRTL = computed(() => {
  return RTL_LANGUAGES.includes(currentLanguage.value)
})

// Dil değiştiğinde HTML'i güncelle
watch(currentLanguage, (newLang) => {
  const isRtl = RTL_LANGUAGES.includes(newLang)
  document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr')
  document.documentElement.setAttribute('lang', newLang)
})

// State
const userMenuOpen = ref(false)
const showQuickSearch = ref(false)
const quickSearchQuery = ref('')
const quickSearchInput = ref(null)
const searchResults = ref([])
const isSearching = ref(false)
const isScreenLocked = ref(false)
const isDarkMode = ref(false)

// API path
const path = config.public.apiBase

// Mobile Sidebar - Use sidebar inject
const openMobileSidebar = () => {
  if (sidebar && sidebar.openMobileSidebar) {
    sidebar.openMobileSidebar()
  } else {
    console.warn('Sidebar openMobileSidebar function not available')
  }
}

// Role label
const getRoleLabel = (role) => {
  const labels = {
    admin: t('header.roles.admin', 'Yönetici'),
    user: t('header.roles.user', 'Kullanıcı'),
    doctor: t('header.roles.doctor', 'Doktor'),
    pricing: t('header.roles.pricing', 'Fiyatlandırma')
  }
  return labels[role] || role || t('header.user_menu.unnamed', 'Kullanıcı')
}

// Dark Mode
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

// Lock Screen
const lockScreen = () => {
  isScreenLocked.value = true
  userMenuOpen.value = false
}

const unlockScreen = () => {
  isScreenLocked.value = false
}

// Quick Search
const openQuickSearch = () => {
  showQuickSearch.value = true
  nextTick(() => {
    quickSearchInput.value?.focus()
  })
}

// Quick Search with debounce
let searchTimeout = null
watch(quickSearchQuery, (newVal) => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  if (!newVal || newVal.length < 2) {
    searchResults.value = []
    return
  }

  isSearching.value = true

  searchTimeout = setTimeout(async () => {
    try {
      await customersStore.fetchCustomers({
        search: newVal,
        limit: 5
      })
      searchResults.value = customersStore.customers || []
    } catch (error) {
      console.error('Search error:', error)
      searchResults.value = []
    } finally {
      isSearching.value = false
    }
  }, 300)
})

const performQuickSearch = () => {
  if (searchResults.value.length > 0) {
    navigateToProfile(searchResults.value[0].id)
  }
}

const navigateToProfile = (customerId) => {
  router.push(`/customers/show/${customerId}`)
  showQuickSearch.value = false
  quickSearchQuery.value = ''
  searchResults.value = []
}

const quickAction = (path) => {
  router.push(path)
  showQuickSearch.value = false
}

// Logout
const logout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

// Close dropdowns on outside click
const handleClickOutside = (event) => {
  if (userMenuOpen.value && !event.target.closest('.relative')) {
    userMenuOpen.value = false
  }
}

// Keyboard shortcuts
const handleKeyboard = (event) => {
  // Ctrl/Cmd + K for quick search
  if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
    event.preventDefault()
    openQuickSearch()
  }

  // Ctrl + L for lock screen
  if (event.ctrlKey && event.key === 'l') {
    event.preventDefault()
    lockScreen()
  }

  // ESC to close quick search
  if (event.key === 'Escape' && showQuickSearch.value) {
    showQuickSearch.value = false
    quickSearchQuery.value = ''
    searchResults.value = []
  }
}

// Lifecycle
onMounted(() => {
  // Check dark mode preference
  const theme = localStorage.getItem('theme')
  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDarkMode.value = true
    document.documentElement.classList.add('dark')
  }

  // Check RTL on mount
  const isRtl = RTL_LANGUAGES.includes(currentLanguage.value)
  document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr')
  document.documentElement.setAttribute('lang', currentLanguage.value)

  // Add event listeners
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeyboard)
})

onUnmounted(() => {
  // Cleanup
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeyboard)
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
})
</script>

<template>
  <header
    class="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-slate-700/50"
  >
    <div class="flex items-center justify-between h-16 px-4 lg:px-6">
      <!-- Left Side -->
      <div class="flex items-center gap-3" :class="{ 'flex-row-reverse': isRTL }">
        <!-- Mobile Menu Button -->
        <button
          @click="openMobileSidebar"
          class="lg:hidden p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-all"
        >
          <Bars3Icon class="w-6 h-6" />
        </button>

        <!-- Breadcrumb / Page Title -->
        <div class="hidden sm:flex items-center gap-2">
          <div class="flex items-center gap-2 text-sm" :class="{ 'flex-row-reverse': isRTL }">
            <NuxtLink
              to="/dashboard"
              class="text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
            >
              <HomeIcon class="w-4 h-4" />
            </NuxtLink>

            <!-- Parent Group (eğer varsa) -->
            <template v-if="breadcrumbInfo.parent">
              <ChevronRightIcon 
                class="w-4 h-4 text-gray-300 dark:text-slate-600" 
                :class="{ 'rotate-180': isRTL }"
              />
              <span class="text-gray-400 dark:text-slate-500">
                {{ breadcrumbInfo.parent.name }}
              </span>
            </template>

            <!-- Current Page -->
            <ChevronRightIcon 
              class="w-4 h-4 text-gray-300 dark:text-slate-600"
              :class="{ 'rotate-180': isRTL }"
            />
            <div class="flex items-center gap-1.5" :class="{ 'flex-row-reverse': isRTL }">
              <component
                v-if="breadcrumbInfo.current.icon"
                :is="breadcrumbInfo.current.icon"
                class="w-4 h-4 text-indigo-500 dark:text-indigo-400"
              />
              <span class="font-medium text-gray-700 dark:text-slate-200">
                {{ breadcrumbInfo.current.name }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Center - Quick Search (Optional) -->
      <div class="hidden md:flex flex-1 max-w-md" :class="isRTL ? 'mr-8' : 'mx-8'">
        <div class="relative w-full">
          <MagnifyingGlassIcon
            class="absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500"
            :class="isRTL ? 'right-3' : 'left-3'"
          />
          <input
            type="text"
            :placeholder="t('header.quick_search.placeholder', 'Hızlı ara... (⌘K)')"
            @focus="openQuickSearch"
            readonly
            class="w-full py-2 bg-gray-100 dark:bg-slate-800 border border-transparent hover:border-gray-200 dark:hover:border-slate-700 rounded-xl text-sm text-gray-600 dark:text-slate-300 placeholder-gray-400 dark:placeholder-slate-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            :class="isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'"
          />
          <kbd
            class="absolute top-1/2 -translate-y-1/2 hidden lg:inline-flex items-center gap-1 px-2 py-0.5 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded text-xs text-gray-400 dark:text-slate-500"
            :class="isRTL ? 'left-3' : 'right-3'"
          >
            ⌘K
          </kbd>
        </div>
      </div>

      <!-- Right Side -->
      <div class="flex items-center gap-1">
        <!-- Notifications -->
        <div class="flex items-center" :class="{ 'flex-row-reverse': isRTL }">
          <!-- Language  -->
          <LanguageDropdown />

          <!-- Fraud Alerts (Admin) -->
          <FraudAlertNotification v-if="authStore.user?.role === 'admin'" />

          <!-- Operation Notifications (Admin) -->
          <OperationNotifications v-if="authStore.user?.role === 'admin'" />

          <!-- User Notifications -->
          <Notification v-if="authStore.user?.role === 'user'" />
        </div>

        <!-- Divider -->
        <div class="hidden sm:block w-px h-6 bg-gray-200 dark:bg-slate-700 mx-2"></div>

        <!-- Lock Screen -->
        <button
          @click="lockScreen"
          class="relative p-2.5 rounded-xl text-gray-500 hover:text-amber-600 hover:bg-amber-50 dark:text-slate-400 dark:hover:text-amber-400 dark:hover:bg-amber-900/20 transition-all group"
          :title="t('header.lock_screen.title', 'Ekranı Kilitle (Ctrl+L)')"
        >
          <LockClosedIcon class="w-5 h-5" />
          <span
            class="absolute -bottom-8 whitespace-nowrap px-2 py-1 bg-gray-900 dark:bg-slate-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            :class="isRTL ? 'right-1/2 translate-x-1/2' : 'left-1/2 -translate-x-1/2'"
          >
            Ctrl+L
          </span>
        </button>

        <!-- Theme Toggle -->
        <button
          @click="toggleDarkMode"
          class="relative p-2.5 rounded-xl text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:text-slate-400 dark:hover:text-indigo-400 dark:hover:bg-indigo-900/20 transition-all overflow-hidden"
        >
          <Transition name="theme-toggle" mode="out-in">
            <SunIcon v-if="isDarkMode" key="sun" class="w-5 h-5" />
            <MoonIcon v-else key="moon" class="w-5 h-5" />
          </Transition>
        </button>

        <!-- Divider -->
        <div class="hidden sm:block w-px h-6 bg-gray-200 dark:bg-slate-700 mx-2"></div>

        <!-- User Menu -->
        <div class="relative">
          <button
            @click="userMenuOpen = !userMenuOpen"
            class="flex items-center gap-3 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
            :class="{ 'flex-row-reverse': isRTL }"
          >
            <!-- Avatar -->
            <div class="relative">
              <div class="w-9 h-9 rounded-xl overflow-hidden ring-2 ring-white dark:ring-slate-800 shadow-sm">
                <img
                  v-if="authStore.user?.avatar"
                  :src="path + authStore.user.avatar"
                  class="w-full h-full object-cover"
                  alt="Avatar"
                />
                <div
                  v-else
                  class="w-full h-full bg-gradient-to-br to-amber-500 to-amber-500 flex items-center justify-center"
                >
                  <span class="text-sm font-bold text-white">
                    {{ authStore.user?.name?.charAt(0)?.toUpperCase() || 'U' }}
                  </span>
                </div>
              </div>
              <!-- Online Status -->
              <div
                class="absolute -bottom-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900"
                :class="isRTL ? '-left-0.5' : '-right-0.5'"
              ></div>
            </div>

            <!-- User Info (Desktop) -->
            <div class="hidden lg:block" :class="isRTL ? 'text-right' : 'text-left'">
              <p class="text-sm font-semibold text-gray-700 dark:text-slate-200 line-clamp-1">
                {{ authStore.user?.name || t('header.user_menu.unnamed', 'Kullanıcı') }}
              </p>
              <p class="text-xs text-gray-500 dark:text-slate-400">
                {{ getRoleLabel(authStore.user?.role) }}
              </p>
            </div>

            <!-- Dropdown Arrow -->
            <ChevronDownIcon
              :class="[
                'hidden lg:block w-4 h-4 text-gray-400 transition-transform duration-200',
                userMenuOpen && 'rotate-180'
              ]"
            />
          </button>

          <!-- Dropdown Menu -->
          <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 scale-95 -translate-y-2"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 -translate-y-2"
          >
            <div
              v-if="userMenuOpen"
              class="absolute mt-2 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-xl ring-1 ring-black/5 dark:ring-white/10 overflow-hidden z-50"
              :class="isRTL ? 'left-0' : 'right-0'"
            >
              <!-- User Info Header -->
              <div class="p-4 bg-gradient-to-r to-amber-500 to-amber-500">
                <div class="flex items-center gap-3" :class="{ 'flex-row-reverse': isRTL }">
                  <div class="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-white/30">
                    <img
                      v-if="authStore.user?.avatar"
                      :src="path + authStore.user.avatar"
                      class="w-full h-full object-cover"
                      alt="Avatar"
                    />
                    <div v-else class="w-full h-full bg-white/20 flex items-center justify-center">
                      <span class="text-lg font-bold text-white">
                        {{ authStore.user?.name?.charAt(0)?.toUpperCase() || 'U' }}
                      </span>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-white truncate">
                      {{ authStore.user?.name || t('header.user_menu.unnamed', 'Kullanıcı') }}
                    </p>
                    <p class="text-xs text-white/70 truncate">
                      {{ authStore.user?.email || 'email@example.com' }}
                    </p>
                    <span
                      class="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white"
                    >
                      {{ getRoleLabel(authStore.user?.role) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Menu Items -->
              <div class="p-2">
                <NuxtLink
                  to="/profile"
                  class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                  :class="{ 'flex-row-reverse': isRTL }"
                  @click="userMenuOpen = false"
                >
                  <div class="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <UserIcon class="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div class="flex-1" :class="isRTL ? 'text-right' : ''">
                    <p class="text-sm font-medium">{{ t('header.user_menu.profile', 'Profilim') }}</p>
                    <p class="text-xs text-gray-500 dark:text-slate-400">
                      {{ t('header.user_menu.account_settings', 'Hesap ayarları') }}
                    </p>
                  </div>
                  <ChevronRightIcon 
                    class="w-4 h-4 text-gray-400" 
                    :class="{ 'rotate-180': isRTL }"
                  />
                </NuxtLink>

                <button
                  @click="lockScreen"
                  class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                  :class="{ 'flex-row-reverse': isRTL }"
                >
                  <div class="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <LockClosedIcon class="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div class="flex-1" :class="isRTL ? 'text-right' : 'text-left'">
                    <p class="text-sm font-medium">{{ t('header.lock_screen.button', 'Ekranı Kilitle') }}</p>
                    <p class="text-xs text-gray-500 dark:text-slate-400">
                      {{ t('header.lock_screen.subtitle', 'Oturumu koruyun') }}
                    </p>
                  </div>
                  <kbd class="px-1.5 py-0.5 bg-gray-100 dark:bg-slate-700 text-xs rounded text-gray-400">
                    Ctrl+L
                  </kbd>
                </button>
              </div>

              <!-- Logout -->
              <div class="p-2 border-t border-gray-100 dark:border-slate-700">
                <button
                  @click="logout"
                  class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  :class="{ 'flex-row-reverse': isRTL }"
                >
                  <div class="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <ArrowLeftIcon class="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                  <span class="text-sm font-medium">{{ t('header.user_menu.logout', 'Çıkış Yap') }}</span>
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <!-- Lock Screen Overlay -->
    <LockScreenOverlay :is-locked="isScreenLocked" :user="authStore.user" @unlock="unlockScreen" />

    <!-- Quick Search Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showQuickSearch"
          class="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/50 backdrop-blur-sm"
          @click.self="showQuickSearch = false"
        >
          <Transition
            enter-active-class="transition-all duration-200"
            enter-from-class="opacity-0 scale-95 -translate-y-4"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition-all duration-150"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 -translate-y-4"
          >
            <div
              v-if="showQuickSearch"
              class="w-full max-w-xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden"
            >
              <!-- Search Input -->
              <div class="flex items-center gap-3 px-4 py-4 border-b border-gray-100 dark:border-slate-700">
                <MagnifyingGlassIcon class="w-6 h-6 text-gray-400 dark:text-slate-500" />
                <input
                  ref="quickSearchInput"
                  v-model="quickSearchQuery"
                  type="text"
                  :placeholder="t('header.quick_search.detailed_placeholder', 'Müşteri, telefon veya işlem ara...')"
                  @keydown.enter="performQuickSearch"
                  class="flex-1 bg-transparent text-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none"
                  :dir="isRTL ? 'rtl' : 'ltr'"
                />
                <kbd
                  class="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-xs text-gray-400 dark:text-slate-500 rounded-lg"
                >
                  ESC
                </kbd>
              </div>

              <div class="overflow-y-auto p-2">
                <div v-if="searchResults.length > 0" class="space-y-1">
                  <p class="px-2 py-1.5 text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase">
                    {{ t('header.quick_search.results', 'Sonuçlar') }}
                  </p>

                  <button
                    v-for="customer in searchResults"
                    :key="customer.id"
                    @click="navigateToProfile(customer.id)"
                    class="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors group text-left"
                    :class="{ 'flex-row-reverse text-right': isRTL }"
                  >
                    <div
                      class="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm group-hover:scale-105 transition-transform"
                    >
                      {{ customer.name?.charAt(0).toUpperCase() || '?' }}
                    </div>

                    <div class="flex-1 min-w-0">
                      <p
                        class="font-medium text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                      >
                        {{ customer.name }} {{ customer.surname }}
                      </p>
                      <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
                        <span v-if="customer.phone">{{ customer.phone }}</span>
                        <span v-if="customer.phone && customer.email" class="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span v-if="customer.email" class="truncate">{{ customer.email }}</span>
                      </div>
                    </div>

                    <ChevronRightIcon 
                      class="w-4 h-4 text-gray-300 group-hover:text-gray-500" 
                      :class="{ 'rotate-180': isRTL }"
                    />
                  </button>
                </div>

                <div
                  v-else-if="quickSearchQuery.length > 2 && !isSearching"
                  class="text-center py-8 text-gray-500"
                >
                  <p>{{ t('header.quick_search.no_results', 'Sonuç bulunamadı.') }}</p>
                </div>

                <div v-else-if="quickSearchQuery.length === 0" class="space-y-1">
                  <p class="px-2 py-1.5 text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase">
                    {{ t('header.quick_search.quick_access', 'Hızlı Erişim') }}
                  </p>
                  <button
                    @click="quickAction('/customers')"
                    class="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-left"
                    :class="{ 'flex-row-reverse': isRTL }"
                  >
                    <div
                      class="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center"
                    >
                      <UsersIcon class="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div class="flex-1">
                      <p class="text-sm font-medium text-gray-700 dark:text-slate-300">
                        {{ t('header.menu.customers', 'Müşteriler') }}
                      </p>
                    </div>
                  </button>
                  <button
                    @click="quickAction('/sales')"
                    class="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-left"
                    :class="{ 'flex-row-reverse': isRTL }"
                  >
                    <div
                      class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center"
                    >
                      <ShoppingBagIcon class="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div class="flex-1">
                      <p class="text-sm font-medium text-gray-700 dark:text-slate-300">
                        {{ t('header.menu.sales', 'Satışlar') }}
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </header>
</template>

<style scoped>
/* Theme toggle animation */
.theme-toggle-enter-active,
.theme-toggle-leave-active {
  transition: all 0.2s ease;
}

.theme-toggle-enter-from {
  opacity: 0;
  transform: rotate(-180deg) scale(0.5);
}

.theme-toggle-leave-to {
  opacity: 0;
  transform: rotate(180deg) scale(0.5);
}
</style>