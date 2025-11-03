<template>
  <aside
    :class="[
      'fixed overflow-x-hidden top-0 left-0 z-50 h-screen transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700',
      sidebarOpen ? 'w-64' : 'w-20',
      mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]"
  >
    <!-- Logo -->
    <div class="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center">
        <div class="flex items-center justify-center w-8 h-8 bg-indigo-600 rounded-lg">
          <span class="text-white font-bold">V</span>
        </div>
        <transition name="fade">
          <span v-if="sidebarOpen" class="ml-3 text-xl font-semibold text-gray-900 dark:text-white">
            Valdori CRM
          </span>
        </transition>
      </div>

      <!-- Toggle Sidebar Button (Desktop only) -->
      <button
        @click="sidebar.toggleSidebar"
        class="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
        :title="sidebarOpen ? 'Minimize' : 'Expand'"
      >
        <svg
          :class="[
            'w-5 h-5 transition-transform duration-200',
            sidebarOpen ? '' : 'rotate-180'
          ]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      <template v-for="item in navigationItems" :key="item.name">
        <!-- Collapsible Group -->
        <div v-if="item.type === 'group'">
          <!-- Group Header Button -->
          <button
            @click="toggleGroup(item.name)"
            :class="[
              'group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 cursor-pointer w-full text-left',
              'text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
            ]"
            :title="!sidebarOpen ? item.name : ''"
          >
            <div class="flex items-center">
              <component
                :is="item.icon"
                :class="[
                  'flex-shrink-0 w-5 h-5',
                  sidebarOpen ? 'mr-3' : 'mx-auto'
                ]"
              />
              <transition name="fade">
                <span v-if="sidebarOpen">{{ item.name }}</span>
              </transition>
            </div>
            <transition name="fade">
              <svg
                v-if="sidebarOpen"
                :class="[
                  'w-4 h-4 transition-transform duration-200',
                  openGroups[item.name] ? 'rotate-90' : ''
                ]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </transition>
          </button>

          <!-- Group Items -->
          <div
            v-show="openGroups[item.name] && sidebarOpen"
            class="mt-1 space-y-1"
          >
            <button
              v-for="subItem in item.items"
              :key="subItem.name"
              @click="navigateTo(subItem.href)"
              :class="[
                'group flex items-center pl-11 pr-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 cursor-pointer w-full text-left',
                route.path === subItem.href
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
              ]"
            >
              <component
                :is="subItem.icon"
                class="flex-shrink-0 w-4 h-4 mr-3"
              />
              <span>{{ subItem.name }}</span>
            </button>
          </div>
        </div>

        <!-- Regular Item -->
        <button
          v-else
          @click="navigateTo(item.href)"
          :class="[
            'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 cursor-pointer w-full text-left relative',
            route.path === item.href
              ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
          ]"
          :title="!sidebarOpen ? item.name : ''"
        >
          <component
            :is="item.icon"
            :class="[
              'flex-shrink-0 w-5 h-5',
              sidebarOpen ? 'mr-3' : 'mx-auto'
            ]"
          />
          <transition name="fade">
            <span v-if="sidebarOpen">{{ item.name }}</span>
          </transition>
        </button>
      </template>
    </nav>

    <!-- User Profile -->
    <div class="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <UserIcon class="w-5 h-5 text-gray-600" />
          </div>
        </div>
        <transition name="fade">
          <div v-if="sidebarOpen" class="ml-3">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ authStore.user?.name || 'Demo User' }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ authStore.user?.email || 'demo@example.com' }}
            </p>
          </div>
        </transition>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { inject, ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import {
  HomeIcon,
  UsersIcon,
  ShoppingBagIcon,
  CalendarIcon,
  UserIcon,
  WrenchScrewdriverIcon,
  ExclamationTriangleIcon,
  BellIcon,
  TagIcon,
  BuildingOffice2Icon,
  BuildingOfficeIcon,
  UserGroupIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
  CircleStackIcon
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
// Nuxt 3 auto-imports composables from ~/composables
const { canViewMenu } = usePermissions()
const sidebar = inject('sidebar')
const { sidebarOpen, mobileSidebarOpen } = sidebar
const router = useRouter()
const route = useRoute()

const openGroups = ref({
  'Müşteriler': false,
  'Tanımlamalar': false
})

const toggleGroup = (groupName) => {
  // Eğer sidebar minimize ise, önce sidebar'ı büyüt
  if (!sidebarOpen.value) {
    sidebar.toggleSidebar()
    // Grubu açık yap
    openGroups.value[groupName] = true
  } else {
    openGroups.value[groupName] = !openGroups.value[groupName]
  }
}

const allNavigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Havuz Verileri', href: '/pool-data', icon: CircleStackIcon },
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
  { name: 'Satışlar', href: '/sales', icon: ShoppingBagIcon },
  { name: 'Randevusuz Satışlar', href: '/randevusuz-satislar', icon: ShoppingBagIcon },
  { name: 'Randevular', href: '/meetings', icon: CalendarIcon },
  // { name: 'Ödemeler', href: '/payments', icon: CurrencyDollarIcon }, // Geçici olarak gizlendi
  {
    name: 'Tanımlamalar',
    type: 'group',
    icon: WrenchScrewdriverIcon,
    items: [
      { name: 'Kullanıcılar', href: '/users', icon: UserIcon },
      { name: 'Kullanıcı Grupları', href: '/user-groups', icon: UserGroupIcon },
      { name: 'Ürünler', href: '/products', icon: ShoppingBagIcon },
      { name: 'Durumlar', href: '/statuses', icon: TagIcon },
      { name: 'Hastaneler', href: '/hospitals', icon: BuildingOffice2Icon },
      { name: 'Branşlar', href: '/branches', icon: BuildingOfficeIcon },
      { name: 'Doktorlar', href: '/doctors', icon: UserGroupIcon },
      { name: 'Dinamik Alanlar', href: '/dynamic-fields', icon: WrenchScrewdriverIcon },
    ]
  },
  { name: 'Fraud Alerts', href: '/fraud-alerts', icon: ExclamationTriangleIcon },
]

// Yetkilere göre filtrelenmiş menü
const navigationItems = computed(() => {
  return allNavigationItems.filter(item => {
    // Menü ana başlığı görülebilir mi kontrol et
    if (!canViewMenu(item.name)) return false

    // Eğer grup ise, alt itemları da filtrele
    if (item.type === 'group' && item.items) {
      const filteredItems = item.items.filter(subItem => canViewMenu(subItem.name))
      // Eğer hiç alt item kalmadıysa grubu gösterme
      if (filteredItems.length === 0) return false
    }

    return true
  }).map(item => {
    // Grup itemlarını filtrele
    if (item.type === 'group' && item.items) {
      return {
        ...item,
        items: item.items.filter(subItem => canViewMenu(subItem.name))
      }
    }
    return item
  })
})

const navigateTo = (path) => {
  // Eğer sidebar minimize ise, tıklandığında büyüt
  if (!sidebarOpen.value) {
    sidebar.toggleSidebar()
  }
  router.push(path)
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style> 