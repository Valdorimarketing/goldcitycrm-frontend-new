<template>
  <aside :class="[
    'fixed top-0 left-0 z-50 h-screen transition-all duration-300 ease-in-out',
    'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950',
    'border-r border-slate-800/50',
    sidebarOpen ? 'w-72' : 'w-20',
    mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
  ]">
    <!-- Decorative Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>
    </div>

    <div class="relative h-full flex flex-col">
      <!-- Logo Section -->
      <div class="flex items-center justify-between h-16 px-4 border-b border-slate-800/50">
        <div class="flex items-center gap-3">
          <div class="relative">
            <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <span class="text-white font-bold text-lg">V</span>
            </div>
            <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900"></div>
          </div>
          <Transition name="fade-slide">
            <div v-if="sidebarOpen" class="overflow-hidden">
              <h1 class="text-lg font-bold text-white tracking-tight">Valdori</h1>
              <p class="text-xs text-slate-400 -mt-0.5">CRM Platform</p>
            </div>
          </Transition>
        </div>

        <!-- Toggle Button -->
        <button 
          @click="sidebar.toggleSidebar"
          class="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200"
          :title="sidebarOpen ? 'Daralt' : 'Genişlet'"
        >
          <ChevronLeftIcon :class="[
            'w-5 h-5 transition-transform duration-300',
            !sidebarOpen && 'rotate-180'
          ]" />
        </button>
      </div>

    

      <!-- Navigation -->
      <nav class="flex-1 px-3 py-2 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        <template v-for="item in navigationItems" :key="item.name">
          
          <!-- Section Divider -->
          <div 
            v-if="item.type === 'divider'" 
            class="pt-4 pb-2"
          >
            <Transition name="fade">
              <p v-if="sidebarOpen" class="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {{ item.name }}
              </p>
            </Transition>
            <div v-if="!sidebarOpen" class="mx-3 border-t border-slate-700/50"></div>
          </div>

          <!-- Collapsible Group -->
          <div v-else-if="item.type === 'group'" class="space-y-1">
            <button 
              @click="toggleGroup(item.name)" 
              :class="[
                'group flex items-center w-full px-3 py-2.5 rounded-xl transition-all duration-200',
                hasActiveChild(item.items)
                  ? 'bg-slate-800/80 text-white'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white',
                !sidebarOpen && 'justify-center'
              ]"
              :title="!sidebarOpen ? item.name : ''"
            >
              <div :class="[
                'flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200',
                hasActiveChild(item.items)
                  ? 'bg-indigo-500/20 text-indigo-400'
                  : 'text-slate-400 group-hover:text-white'
              ]">
                <component :is="item.icon" class="w-5 h-5" />
              </div>
              
              <Transition name="fade-slide">
                <div v-if="sidebarOpen" class="flex-1 flex items-center justify-between ml-3">
                  <span class="font-medium text-sm">{{ item.name }}</span>
                  <ChevronRightIcon :class="[
                    'w-4 h-4 transition-transform duration-200',
                    openGroups[item.name] && 'rotate-90'
                  ]" />
                </div>
              </Transition>
            </button>

            <!-- Group Items -->
            <Transition name="expand">
              <div 
                v-if="openGroups[item.name] && sidebarOpen" 
                class="ml-4 pl-4 border-l border-slate-700/50 space-y-1"
              >
                <button 
                  v-for="subItem in item.items" 
                  :key="subItem.name"
                  @click="navigateTo(subItem.href)"
                  :class="[
                    'group flex items-center w-full px-3 py-2 rounded-lg transition-all duration-200 text-sm',
                    route.path === subItem.href
                      ? 'bg-indigo-500/20 text-indigo-400 font-medium'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  ]"
                >
                  <component :is="subItem.icon" class="w-4 h-4 mr-3" />
                  <span>{{ subItem.name }}</span>
                  
                  <!-- Active Indicator -->
                  <div 
                    v-if="route.path === subItem.href"
                    class="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400"
                  ></div>
                </button>
              </div>
            </Transition>
          </div>

          <!-- Regular Item -->
          <button 
            v-else
            @click="navigateTo(item.href)"
            :class="[
              'group flex items-center w-full px-3 py-2.5 rounded-xl transition-all duration-200',
              route.path === item.href
                ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white shadow-lg shadow-indigo-500/10'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-white',
              !sidebarOpen && 'justify-center'
            ]"
            :title="!sidebarOpen ? item.name : ''"
          >
            <!-- Icon Container -->
            <div :class="[
              'relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200',
              route.path === item.href
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                : 'text-slate-400 group-hover:text-white group-hover:bg-slate-700/50'
            ]">
              <component :is="item.icon" class="w-5 h-5" />
              
              <!-- Notification Badge -->
              <div 
                v-if="item.badge"
                class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
              >
                <span class="text-[10px] font-bold text-white">{{ item.badge }}</span>
              </div>
            </div>

            <Transition name="fade-slide">
              <div v-if="sidebarOpen" class="flex-1 flex items-center justify-between ml-3">
                <span class="font-medium text-sm">{{ item.name }}</span>
                
                <!-- Active Indicator -->
                <div 
                  v-if="route.path === item.href"
                  class="flex items-center gap-1"
                >
                  <div class="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></div>
                </div>
              </div>
            </Transition>
          </button>
        </template>
      </nav>

      <!-- Quick Actions (when collapsed) -->
      <Transition name="fade">
        <div 
          v-if="!sidebarOpen" 
          class="px-3 py-2 border-t border-slate-800/50"
        >
          <button 
            @click="sidebar.toggleSidebar"
            class="w-full flex items-center justify-center py-2 text-slate-500 hover:text-white transition-colors"
            title="Menüyü Genişlet"
          >
            <Bars3Icon class="w-5 h-5" />
          </button>
        </div>
      </Transition>

      <!-- User Profile Section -->
      <div class="flex-shrink-0 p-4 border-t border-slate-800/50 bg-slate-900/50">
        <div :class="[
          'flex items-center gap-3',
          !sidebarOpen && 'justify-center'
        ]">
          <!-- Avatar -->
          <div class="relative flex-shrink-0">
            <div class="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-slate-700 ring-offset-2 ring-offset-slate-900">
              <img 
                v-if="authStore.user?.avatar" 
                :src="path + authStore.user.avatar" 
                class="w-full h-full object-cover"
                alt="Avatar"
              />
              <div 
                v-else 
                class="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"
              >
                <span class="text-sm font-bold text-white">
                  {{ authStore.user?.name?.charAt(0)?.toUpperCase() || 'U' }}
                </span>
              </div>
            </div>
            <!-- Online Status -->
            <div class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900"></div>
          </div>

          <!-- User Info -->
          <Transition name="fade-slide">
            <div v-if="sidebarOpen" class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-white truncate">
                {{ authStore.user?.name || 'Kullanıcı' }}
              </p>
              <p class="text-xs text-slate-400 truncate">
                {{ authStore.user?.email || 'email@example.com' }}
              </p>
              <div class="flex items-center gap-2 mt-1">
                <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-500/20 text-indigo-400">
                  {{ getRoleLabel(authStore.user?.role) }}
                </span>
                <span class="text-[10px] text-slate-500">#{{ authStore.user?.id }}</span>
              </div>
            </div>
          </Transition>

          <!-- Settings Button -->
          <Transition name="fade">
            <button 
              v-if="sidebarOpen"
              @click="navigateTo('/profile')"
              class="flex-shrink-0 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
              title="Profil Ayarları"
            >
              <Cog6ToothIcon class="w-5 h-5" />
            </button>
          </Transition>
        </div>

        <!-- Sound Toggle (for user role) -->
        <Transition name="fade-slide">
          <div v-if="sidebarOpen && authStore.user?.role === 'user'" class="mt-3">
            <SoundToggle :sidebarOpen="sidebarOpen" />
          </div>
        </Transition>

        <!-- Logout Button -->
        <Transition name="fade-slide">
          <button 
            v-if="sidebarOpen"
            @click="handleLogout"
            class="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-xl transition-all duration-200 text-sm font-medium"
          >
            <ArrowRightOnRectangleIcon class="w-4 h-4" />
            Çıkış Yap
          </button>
        </Transition>
      </div>
    </div>
  </aside>

  <!-- Mobile Overlay -->
  <Transition name="fade">
    <div 
      v-if="mobileSidebarOpen"
      class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
      @click="sidebar.closeMobileSidebar"
    ></div>
  </Transition>
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
  CircleStackIcon,
  FlagIcon,
  ChartBarSquareIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  ShieldExclamationIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const config = useRuntimeConfig()
const { canViewMenu } = usePermissions()
const sidebar = inject('sidebar')
const { sidebarOpen, mobileSidebarOpen } = sidebar
const router = useRouter()
const route = useRoute()
const path = config.public.apiBase

const openGroups = ref({
  'Müşteriler': false,
  'Tanımlamalar': false
}) 

const toggleGroup = (groupName) => {
  if (!sidebarOpen.value) {
    sidebar.toggleSidebar()
    openGroups.value[groupName] = true
  } else {
    openGroups.value[groupName] = !openGroups.value[groupName]
  }
}

const hasActiveChild = (items) => {
  if (!items) return false
  return items.some(item => route.path === item.href)
}

const getRoleLabel = (role) => {
  const labels = {
    admin: 'Admin',
    user: 'Kullanıcı',
    doctor: 'Doktor',
    pricing: 'Fiyatlandırma'
  }
  return labels[role] || role || 'Kullanıcı'
}

const allNavigationItems = [
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

const navigationItems = computed(() => {
  return allNavigationItems.filter(item => {
    if (item.type === 'divider') return true
    if (!canViewMenu(item.name)) return false
    if (item.type === 'group' && item.items) {
      const filteredItems = item.items.filter(subItem => canViewMenu(subItem.name))
      if (filteredItems.length === 0) return false
    }
    return true
  }).map(item => {
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
  router.push(path)
  if (mobileSidebarOpen.value) {
    sidebar.closeMobileSidebar()
  }
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Fade Slide Transition */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

/* Expand Transition */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}
.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 500px;
}

/* Custom Scrollbar */
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: rgb(51, 65, 85);
  border-radius: 2px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: rgb(71, 85, 105);
}
</style>