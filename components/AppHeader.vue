<template>
  <header
    class="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-slate-700/50">
    <div class="flex items-center justify-between h-16 px-4 lg:px-6">

      <!-- Left Side -->
      <div class="flex items-center gap-3">
        <!-- Mobile Menu Button -->
        <button @click="openMobileSidebar"
          class="lg:hidden p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-all">
          <Bars3Icon class="w-6 h-6" />
        </button>

        <!-- Breadcrumb / Page Title -->
        <div class="hidden sm:flex items-center gap-2">
          <div class="flex items-center gap-2 text-sm">
            <NuxtLink to="/dashboard"
              class="text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors">
              <HomeIcon class="w-4 h-4" />
            </NuxtLink>

            <!-- Parent Group (eğer varsa) -->
            <template v-if="breadcrumbInfo.parent">
              <ChevronRightIcon class="w-4 h-4 text-gray-300 dark:text-slate-600" />
              <span class="text-gray-400 dark:text-slate-500">
                {{ breadcrumbInfo.parent.name }}
              </span>
            </template>

            <!-- Current Page -->
            <ChevronRightIcon class="w-4 h-4 text-gray-300 dark:text-slate-600" />
            <div class="flex items-center gap-1.5">
              <component v-if="breadcrumbInfo.current.icon" :is="breadcrumbInfo.current.icon"
                class="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
              <span class="font-medium text-gray-700 dark:text-slate-200">
                {{ breadcrumbInfo.current.name }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Center - Quick Search (Optional) -->
      <div class="hidden md:flex flex-1 max-w-md mx-8">
        <div class="relative w-full">
          <MagnifyingGlassIcon
            class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" />
          <input type="text" placeholder="Hızlı ara... (⌘K)" @focus="openQuickSearch" readonly
            class="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-slate-800 border border-transparent hover:border-gray-200 dark:hover:border-slate-700 rounded-xl text-sm text-gray-600 dark:text-slate-300 placeholder-gray-400 dark:placeholder-slate-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" />
          <kbd
            class="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-flex items-center gap-1 px-2 py-0.5 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded text-xs text-gray-400 dark:text-slate-500">
            ⌘K
          </kbd>
        </div>
      </div>

      <!-- Right Side -->
      <div class="flex items-center gap-1">

        <!-- Notifications -->
        <div class="flex items-center">
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
        <button @click="lockScreen"
          class="relative p-2.5 rounded-xl text-gray-500 hover:text-amber-600 hover:bg-amber-50 dark:text-slate-400 dark:hover:text-amber-400 dark:hover:bg-amber-900/20 transition-all group"
          title="Ekranı Kilitle (Ctrl+L)">
          <LockClosedIcon class="w-5 h-5" />
          <span
            class="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-slate-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Ctrl+L
          </span>
        </button>

        <!-- Theme Toggle -->
        <button @click="toggleDarkMode"
          class="relative p-2.5 rounded-xl text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:text-slate-400 dark:hover:text-indigo-400 dark:hover:bg-indigo-900/20 transition-all overflow-hidden">
          <Transition name="theme-toggle" mode="out-in">
            <SunIcon v-if="isDarkMode" key="sun" class="w-5 h-5" />
            <MoonIcon v-else key="moon" class="w-5 h-5" />
          </Transition>
        </button>

        <!-- Divider -->
        <div class="hidden sm:block w-px h-6 bg-gray-200 dark:bg-slate-700 mx-2"></div>

        <!-- User Menu -->
        <div class="relative">
          <button @click="userMenuOpen = !userMenuOpen"
            class="flex items-center gap-3 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-all">
            <!-- Avatar -->
            <div class="relative">
              <div class="w-9 h-9 rounded-xl overflow-hidden ring-2 ring-white dark:ring-slate-800 shadow-sm">
                <img v-if="authStore.user?.avatar" :src="path + authStore.user.avatar"
                  class="w-full h-full object-cover" alt="Avatar" />
                <div v-else
                  class="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <span class="text-sm font-bold text-white">
                    {{ authStore.user?.name?.charAt(0)?.toUpperCase() || 'U' }}
                  </span>
                </div>
              </div>
              <!-- Online Status -->
              <div
                class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900">
              </div>
            </div>

            <!-- User Info (Desktop) -->
            <div class="hidden lg:block text-left">
              <p class="text-sm font-semibold text-gray-700 dark:text-slate-200 line-clamp-1">
                {{ authStore.user?.name || 'Kullanıcı' }}
              </p>
              <p class="text-xs text-gray-500 dark:text-slate-400">
                {{ getRoleLabel(authStore.user?.role) }}
              </p>
            </div>

            <!-- Dropdown Arrow -->
            <ChevronDownIcon :class="[
              'hidden lg:block w-4 h-4 text-gray-400 transition-transform duration-200',
              userMenuOpen && 'rotate-180'
            ]" />
          </button>

          <!-- Dropdown Menu -->
          <Transition enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 scale-95 -translate-y-2" enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 -translate-y-2">
            <div v-if="userMenuOpen"
              class="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-xl ring-1 ring-black/5 dark:ring-white/10 overflow-hidden z-50">
              <!-- User Info Header -->
              <div class="p-4 bg-gradient-to-r from-indigo-500 to-purple-600">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-white/30">
                    <img v-if="authStore.user?.avatar" :src="path + authStore.user.avatar"
                      class="w-full h-full object-cover" alt="Avatar" />
                    <div v-else class="w-full h-full bg-white/20 flex items-center justify-center">
                      <span class="text-lg font-bold text-white">
                        {{ authStore.user?.name?.charAt(0)?.toUpperCase() || 'U' }}
                      </span>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-white truncate">
                      {{ authStore.user?.name || 'Kullanıcı' }}
                    </p>
                    <p class="text-xs text-white/70 truncate">
                      {{ authStore.user?.email || 'email@example.com' }}
                    </p>
                    <span
                      class="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                      {{ getRoleLabel(authStore.user?.role) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Quick Stats -->
              <div class="grid grid-cols-3 gap-px bg-gray-100 dark:bg-slate-700">
                <div class="bg-white dark:bg-slate-800 p-3 text-center">
                  <p class="text-lg font-bold text-gray-900 dark:text-white">{{ userStats.customers }}</p>
                  <p class="text-xs text-gray-500 dark:text-slate-400">Müşteri</p>
                </div>
                <div class="bg-white dark:bg-slate-800 p-3 text-center">
                  <p class="text-lg font-bold text-gray-900 dark:text-white">{{ userStats.sales }}</p>
                  <p class="text-xs text-gray-500 dark:text-slate-400">Satış</p>
                </div>
                <div class="bg-white dark:bg-slate-800 p-3 text-center">
                  <p class="text-lg font-bold text-emerald-600 dark:text-emerald-400">{{ userStats.pending }}</p>
                  <p class="text-xs text-gray-500 dark:text-slate-400">Bekleyen</p>
                </div>
              </div>

              <!-- Menu Items -->
              <div class="p-2">
                <NuxtLink to="/profile"
                  class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                  @click="userMenuOpen = false">
                  <div class="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <UserIcon class="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-medium">Profilim</p>
                    <p class="text-xs text-gray-500 dark:text-slate-400">Hesap ayarları</p>
                  </div>
                  <ChevronRightIcon class="w-4 h-4 text-gray-400" />
                </NuxtLink>

                <button @click="lockScreen"
                  class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                  <div class="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <LockClosedIcon class="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div class="flex-1 text-left">
                    <p class="text-sm font-medium">Ekranı Kilitle</p>
                    <p class="text-xs text-gray-500 dark:text-slate-400">Oturumu koruyun</p>
                  </div>
                  <kbd class="px-1.5 py-0.5 bg-gray-100 dark:bg-slate-700 text-xs rounded text-gray-400">
                    Ctrl+L
                  </kbd>
                </button>

              </div>

              <!-- Logout -->
              <div class="p-2 border-t border-gray-100 dark:border-slate-700">
                <button @click="logout"
                  class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  <div class="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <ArrowRightOnRectangleIcon class="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                  <span class="text-sm font-medium">Çıkış Yap</span>
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
      <Transition enter-active-class="transition-all duration-200" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition-all duration-150" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="showQuickSearch"
          class="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/50 backdrop-blur-sm"
          @click.self="showQuickSearch = false">
          <Transition enter-active-class="transition-all duration-200"
            enter-from-class="opacity-0 scale-95 -translate-y-4" enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition-all duration-150" leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 -translate-y-4">
            <div v-if="showQuickSearch"
              class="w-full max-w-xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
              <!-- Search Input -->
              <div class="flex items-center gap-3 px-4 py-4 border-b border-gray-100 dark:border-slate-700">
                <MagnifyingGlassIcon class="w-6 h-6 text-gray-400 dark:text-slate-500" />
                <input ref="quickSearchInput" v-model="quickSearchQuery" type="text"
                  placeholder="Müşteri, telefon veya işlem ara..." @keydown.enter="performQuickSearch"
                  class="flex-1 bg-transparent text-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none" />
                <kbd
                  class="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-xs text-gray-400 dark:text-slate-500 rounded-lg">
                  ESC
                </kbd>
              </div>

              <div class="overflow-y-auto p-2">

                <div v-if="searchResults.length > 0" class="space-y-1">
                  <p class="px-2 py-1.5 text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase">Sonuçlar</p>

                  <button v-for="customer in searchResults" :key="customer.id" @click="navigateToProfile(customer.id)"
                    class="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors group text-left">
                    <div
                      class="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm group-hover:scale-105 transition-transform">
                      {{ customer.name?.charAt(0).toUpperCase() || '?' }}
                    </div>

                    <div class="flex-1 min-w-0">
                      <p
                        class="font-medium text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {{ customer.name }} {{ customer.surname }}
                      </p>
                      <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
                        <span v-if="customer.phone">{{ customer.phone }}</span>
                        <span v-if="customer.phone && customer.email" class="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span v-if="customer.email" class="truncate">{{ customer.email }}</span>
                      </div>
                    </div>

                    <ChevronRightIcon class="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
                  </button>
                </div>

                <div v-else-if="quickSearchQuery.length > 2 && !isSearching" class="text-center py-8 text-gray-500">
                  <p>Sonuç bulunamadı.</p>
                </div>

                <div v-else-if="quickSearchQuery.length === 0" class="space-y-1">
                  <p class="px-2 py-1.5 text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase">Hızlı Erişim
                  </p>
                  <button @click="quickAction('/customers')"
                    class="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-left">
                    <div
                      class="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                      <UsersIcon class="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div class="flex-1">
                      <p class="text-sm font-medium text-gray-700 dark:text-slate-300">Müşteriler</p>
                    </div>
                  </button>
                  <button @click="quickAction('/sales')"
                    class="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-left">
                    <div
                      class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <ShoppingBagIcon class="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div class="flex-1">
                      <p class="text-sm font-medium text-gray-700 dark:text-slate-300">Satışlar</p>
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

<script setup>
import { ref, inject, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useAuthStore } from '~/stores/auth'
import FraudAlertNotification from '~/components/FraudAlertNotification.vue'
import Notification from '~/components/Notification.vue'
import LockScreenOverlay from '~/components/LockScreenOverlay.vue'
import {
  Bars3Icon,
  SunIcon,
  MoonIcon,
  LockClosedIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UsersIcon,
  ShoppingBagIcon,
  CalendarIcon,
  ClockIcon,
  CircleStackIcon,
  UserPlusIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ChartBarSquareIcon,
  FlagIcon,
  TagIcon,
  BuildingOffice2Icon,
  BuildingOfficeIcon,
  WrenchScrewdriverIcon,
  ExclamationTriangleIcon,
  ShieldExclamationIcon,
  BellIcon
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const sidebar = inject('sidebar')
const { toggleSidebar, openMobileSidebar } = sidebar
const config = useRuntimeConfig()
const router = useRouter()
const route = useRoute()

const userMenuOpen = ref(false)
const isDarkMode = ref(false)
const isScreenLocked = ref(false)
const showQuickSearch = ref(false)
const quickSearchQuery = ref('')
const quickSearchInput = ref(null)
const {  getCustomerFilters } = usePermissions()

const searchResults = ref([]) // Arama sonuçları
const isSearching = ref(false) // Loading durumu

const path = config.public.apiBase

const customersStore = useCustomersStore()

// Mock stats - Replace with real data
const userStats = ref({
  customers: 156,
  sales: 24,
  pending: 8
})


// Page titles mapping - Sidebar ile aynı yapı
const pageTitles = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Havuz Verileri', href: '/pool-data', icon: CircleStackIcon },
  { name: 'Müşteri Yönetimi', type: 'divider' },
  {
    name: 'Müşteriler',
    type: 'group',
    icon: UsersIcon,
    items: [
      { name: 'Kişiler', href: '/customers', icon: UsersIcon },
      { name: 'Yeni Kişiler', href: '/new-customers', icon: UserPlusIcon },
      { name: 'Dinamik Arama', href: '/dinamik-arama', icon: MagnifyingGlassIcon },
      { name: 'Hatırlatmalar', href: '/reminders', icon: BellIcon },
    ]
  },
  { name: 'Doktor Dönüşü', href: '/doctor-review', icon: UserGroupIcon },
  { name: 'Proforma', href: '/proforma', icon: DocumentTextIcon },
  { name: 'Fiyatlandırmalar', href: '/pricing', icon: CurrencyDollarIcon },
  { name: 'Satış & Randevu', type: 'divider' },
  { name: 'Satışlar', href: '/sales', icon: ShoppingBagIcon },
  { name: 'Randevusuz Satışlar', href: '/randevusuz-satislar', icon: ShoppingBagIcon },
  { name: 'Randevular', href: '/meetings', icon: CalendarIcon },
  { name: 'Sistem', type: 'divider' },
  {
    name: 'Tanımlamalar',
    type: 'group',
    icon: WrenchScrewdriverIcon,
    items: [
      { name: 'Kullanıcılar', href: '/users', icon: UserIcon },
      { name: 'Etkileşim Analizi', href: '/engagement', icon: ChartBarSquareIcon },
      { name: 'Kullanıcı Grupları', href: '/user-groups', icon: UserGroupIcon },
      { name: 'Takımlar', href: '/teams', icon: FlagIcon },
      { name: 'Ürünler', href: '/products', icon: ShoppingBagIcon },
      { name: 'Durumlar', href: '/statuses', icon: TagIcon },
      { name: 'Hastaneler', href: '/hospitals', icon: BuildingOffice2Icon },
      { name: 'Branşlar', href: '/branches', icon: BuildingOfficeIcon },
      { name: 'Doktorlar', href: '/doctors', icon: UserGroupIcon },
      { name: 'Dinamik Alanlar', href: '/dynamic-fields', icon: WrenchScrewdriverIcon },
    ]
  },
  { name: 'Fraud Alerts', href: '/fraud-alerts', icon: ExclamationTriangleIcon },
  { name: 'Sheets Sync', href: '/sheets-sync', icon: ShieldExclamationIcon },
]


// Arama kutusunu izle (Watch)
// Arama kutusunu izle (Watch)
let searchTimeout = null
watch(quickSearchQuery, (newVal) => {
  // Eğer timeout varsa temizle (Debounce)
  if (searchTimeout) clearTimeout(searchTimeout)

  // Input boşsa veya 2 karakterden azsa arama yapma
  if (!newVal || newVal.length < 2) {
    searchResults.value = []
    isSearching.value = false
    return
  }

  // Kullanıcı yazmayı bitirdikten 300ms sonra API'ye git
  isSearching.value = true
  searchTimeout = setTimeout(async () => {
    try {
      await customersStore.fetchCustomers({ 
        search: newVal, 
        page: 1, 
        limit: 5
      })

      // Store'un state'inden veriyi al
      searchResults.value = customersStore.customers || []

    } catch (error) {
      console.error('Hızlı arama hatası:', error)
      searchResults.value = []
    } finally {
      isSearching.value = false
    }
  }, 300)
})

// Sonuca tıklandığında Profile Git
const navigateToProfile = (customerId) => {
  showQuickSearch.value = false
  router.push(`/customers/show/${customerId}`)
}

// Breadcrumb için parent grup bilgisini de al
const breadcrumbInfo = computed(() => {
  const currentPath = route.path

  for (const item of pageTitles) {
    if (item.type === 'divider') continue

    if (item.href === currentPath) {
      return { parent: null, current: item }
    }

    if (item.type === 'group' && item.items) {
      const found = item.items.find(subItem => subItem.href === currentPath)
      if (found) {
        return { parent: item, current: found }
      }
    }
  }

  return { parent: null, current: { name: route.meta?.title || 'Sayfa', icon: null } }
})
 
 


const getRoleLabel = (role) => {
  const labels = {
    admin: 'Yönetici',
    user: 'Kullanıcı',
    doctor: 'Doktor',
    pricing: 'Fiyatlandırma'
  }
  return labels[role] || role || 'Kullanıcı'
}

// Lock Screen Functions
const lockScreen = () => {
  userMenuOpen.value = false
  isScreenLocked.value = true
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

// Perform Quick Search - Navigate to customers page with search query
const performQuickSearch = () => {
  const query = quickSearchQuery.value.trim()
  if (query) {
    showQuickSearch.value = false
    router.push({
      path: '/customers',
      query: {
        page: 1,
        limit: 20,
        search: query
      }
    })
    // Reset search query after navigation
    quickSearchQuery.value = ''
  }
}

const quickAction = (path) => {
  showQuickSearch.value = false
  router.push(path)
}

// Keyboard shortcuts
const handleKeydown = (event) => {
  // Lock screen: Ctrl+L
  if (event.ctrlKey && event.key === 'l') {
    event.preventDefault()
    lockScreen()
  }
  // Quick search: Cmd/Ctrl+K
  if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
    event.preventDefault()
    openQuickSearch()
  }
  // Close quick search: Escape
  if (event.key === 'Escape' && showQuickSearch.value) {
    showQuickSearch.value = false
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

<style scoped>
/* Theme Toggle Animation */
.theme-toggle-enter-active,
.theme-toggle-leave-active {
  transition: all 0.3s ease;
}

.theme-toggle-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.5);
}

.theme-toggle-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.5);
}
</style>