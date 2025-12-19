<template>
  <div>
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Kullanıcılar</h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
          Sistem kullanıcılarını buradan yönetebilirsiniz.
        </p>
      </div>
      <div class="mt-4 sm:mt-0 flex gap-2 flex-wrap">
        <button @click="openModal"
          class="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
          <PlusIcon class="-ml-0.5 mr-1.5 h-5 w-5" />
          Yeni Kullanıcı
        </button>
        <div class="relative">
          <button @click="loadUsers"
            class="inline-flex items-center px-3 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition">
            <ArrowPathIcon class="h-5 w-5 mr-2" />
            Yenile
          </button>
        </div>
      </div>
    </div>

    <!-- Online/Offline Stats & Filter -->
    <div class="mb-4 flex flex-wrap gap-2">
      <!-- Tümü -->
      <button @click="onlineFilter = null" class="px-4 py-2 rounded-md text-sm font-medium border transition" :class="[
        onlineFilter === null
          ? 'bg-indigo-600 text-white border-indigo-600'
          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-indigo-50 dark:hover:bg-gray-700'
      ]">
        Tümü ({{ usersStore.users.value?.length }})
      </button>

      <!-- Çevrimiçi -->
      <button @click="onlineFilter = 'online'" class="px-4 py-2 rounded-md text-sm font-medium border transition"
        :class="[
          onlineFilter === 'online'
            ? 'bg-green-600 text-white border-green-600'
            : 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-800/40'
        ]">
        <span class="flex items-center gap-1.5">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Çevrimiçi ({{ onlineCount }})
        </span>
      </button>

      <!-- Çevrimdışı -->
      <button @click="onlineFilter = 'offline'" class="px-4 py-2 rounded-md text-sm font-medium border transition"
        :class="[
          onlineFilter === 'offline'
            ? 'bg-gray-600 text-white border-gray-600'
            : 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
        ]">
        Çevrimdışı ({{ offlineCount }})
      </button>
    </div>

    <!-- Role Tabs / Statistics -->
    <div v-if="roleStats?.length" class="mt-6 flex flex-wrap gap-2 mb-4">
      <button @click="activeRole = null" class="px-4 py-2 rounded-md text-sm font-medium border transition" :class="[
        !activeRole
          ? 'bg-indigo-600 text-white border-indigo-600'
          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-indigo-50 dark:hover:bg-gray-700'
      ]">
        Tüm Roller ({{ filteredByOnlineUsers?.length }})
      </button>

      <button v-for="stat in roleStats" :key="stat.role" @click="activeRole = stat.role"
        class="px-4 py-2 rounded-md text-sm font-medium border transition" :class="[
          activeRole === stat.role
            ? getRoleColorClass(stat.role, true)
            : getRoleColorClass(stat.role, false)
        ]">
        {{ getRoleText(stat.role) }} ({{ stat.count }})
      </button>
    </div>



    <!-- Users List -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2  xl:grid-cols-3">
      <div v-for="user in filteredUsers" :key="user.id" class="card border-l-4 p-3 rounded-lg shadow-sm transition"
        :class="[
          user.role === 'admin'
            ? 'border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
            : user.role === 'doctor'
              ? 'border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
              : user.role === 'pricing'
                ? 'border-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                : user.role === 'user'
                  ? 'border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                  : 'border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/40'
        ]">

        <div class="flex flex-col space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <div class="flex gap-2">
                <div class="relative w-16 h-16">
                  <div
                    class="relative rounded-full w-full h-full overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                    <img v-if="user.avatar" :src="path + user.avatar" alt="Avatar" class="object-cover w-full h-full" />
                    <div v-else
                      class="flex items-center justify-center w-full h-full text-gray-400 dark:text-gray-500 text-sm">
                      Yok
                    </div>
                  </div>

                  <!-- Online indicator with pulse animation -->
                  <span v-if="isUserOnline(user)" class="absolute bottom-0 right-0 block">
                    <span class="relative flex h-4 w-4">
                      <span
                        class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span
                        class="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white dark:border-gray-800"></span>
                    </span>
                  </span>
                </div>


                <div class="flex flex-col items-start gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400 ">


                  <div class="flex items-center justify-between gap-2">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white truncate">
                      {{ user.name || 'İsimsiz Kullanıcı' }}
                    </h3>
                    <span :class="getRoleBadgeClass(user.role)">
                      {{ getRoleText(user.role) }}
                    </span>
                  </div>


                  <span v-if="user?.userGroup?.name" title="Grup Bilgisi"
                    class="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
                    {{ user.userGroup.name }}
                  </span>

                  <span v-else title="Grup Bilgisi"
                    class="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
                    bulunamadı
                  </span>

                  <span v-if="user?.userTeam?.name" title="Takım Bilgisi"
                    class="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
                    {{ user.userTeam.name }}
                  </span>

                  <span v-else title="Takım Bilgisi"
                    class="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
                    bulunamadı
                  </span>

                </div>

              </div>
            </div>
            <div class="flex items-end space-y-1 flex-col">
              <span
                :class="user.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                {{ user.isActive ? 'Aktif' : 'Pasif' }}
              </span>

              <span :class="getLastActiveClass(user.lastActiveTime)"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                {{ getLastActiveText(user.lastActiveTime) }}
              </span>

            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button @click="openEditModal(user)"
              class="flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800">
              Düzenle
            </button>
            <button @click="toggleUserStatus(user)" :disabled="toggleLoading[user.id]"
              class="flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors disabled:opacity-50"
              :class="user.isActive
                ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800'
                : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800'">
              <span v-if="toggleLoading[user.id]" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-1 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                İşleniyor...
              </span>
              <span v-else>
                {{ user.isActive ? 'Deaktif Et' : 'Aktif Et' }}
              </span>
            </button>
            <NuxtLink :to="`/profile/${user.id}`"
              class="flex-1 px-3 py-1.5 text-xs text-center font-medium rounded transition-colors bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800">
              Profil
            </NuxtLink>
          </div>
          <div class="w-full relative flex justify-center">
            <span
              class="bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
              son görülme: {{ getLastSeen(user.lastActiveTime) }}
            </span>
            <span :title="dayjs(user.createdAt).fromNow()"
              class="bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
              {{ user.createdAt ? 'Oluşturulma: ' + dayjs(user.createdAt).format('DD MMM YYYY') : 'Oluşturulma tarihi bilinmiyor' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredUsers?.length === 0" class="text-center py-12">
      <p class="text-gray-500 dark:text-gray-400">Kullanıcı bulunamadı</p>
    </div>

    <!-- Create/Edit User Modal -->
    <UserCreateModal :is-open="showCreateModal" :user="selectedUser" @close="closeModal" @created="handleUserCreated"
      @updated="handleUserUpdated" />
  </div>
</template>



<script setup>
import { ref, computed, onMounted } from 'vue'
import { ArrowPathIcon,PlusIcon } from '@heroicons/vue/24/outline'
import { useUsersStore } from '~/stores/users'
import UserCreateModal from '~/components/UserCreateModal.vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

definePageMeta({
  // middleware: 'auth' // Temporarily disabled
})

const config = useRuntimeConfig()

// Store
const usersStore = useUsersStore()

// Modal state
const showCreateModal = ref(false)
const selectedUser = ref(null)
const activeRole = ref(null)
const onlineFilter = ref(null) // null = tümü, 'online' = çevrimiçi, 'offline' = çevrimdışı
const path = config.public.apiBase

// Loading state for toggle buttons
const toggleLoading = ref({})

// Check if user is online (last active within 60 seconds)
const isUserOnline = (user) => {
  if (!user.lastActiveTime) return false
  const diffSeconds = dayjs().diff(dayjs(user.lastActiveTime), 'second')
  return diffSeconds < 60
}

// Count online users
const onlineCount = computed(() => {
  return usersStore.users.value?.filter(user => isUserOnline(user))?.length
})

// Count offline users
const offlineCount = computed(() => {
  return usersStore.users.value?.filter(user => !isUserOnline(user))?.length
})

const getLastActiveClass = (lastActiveTime) => {
  if (!lastActiveTime) return 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'

  const diffSeconds = dayjs().diff(dayjs(lastActiveTime), 'second')
  const diffHours = dayjs().diff(dayjs(lastActiveTime), 'hour')

  if (diffSeconds < 60) {
    // 1 dakikadan kısa
    return 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-200'
  } else if (diffHours >= 1) {
    // 1 dakikadan uzun
    return 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
  } else {
    // 1 dakikadan uzun ama 1 saatten kısa
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
  }
}

const getLastActiveText = (lastActiveTime) => {
  if (!lastActiveTime) return 'Çevrimdışı'

  const diffSeconds = dayjs().diff(dayjs(lastActiveTime), 'second')
  const diffHours = dayjs().diff(dayjs(lastActiveTime), 'hour')

  if (diffSeconds < 60) {
    return 'Çevrimiçi'
  } else if (diffHours >= 1) {
    return 'Çevrimdışı'
  } else {
    return dayjs(lastActiveTime).fromNow()
  }
}

const getLastSeen = (lastActiveTime) => {
  return dayjs(lastActiveTime).fromNow()
}

// Load users function
const loadUsers = async () => {
  try {
    const api = useApi()

    const response = await api('/users')

    if (Array.isArray(response)) {
      usersStore.users.value = response
    } else {
      usersStore.users.value = response.data || []
    }
  } catch (error) {
    console.error('Failed to load users:', error)
    // Fallback to demo data
    usersStore.users.value = [
      {
        id: 999,
        name: 'Demo User',
        email: 'demo@example.com',
        role: 'admin',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z'
      }
    ]
  }
}

// Filter by online/offline first
const filteredByOnlineUsers = computed(() => {
  const all = usersStore.users.value || []

  if (onlineFilter.value === 'online') {
    return all?.filter(user => isUserOnline(user))
  } else if (onlineFilter.value === 'offline') {
    return all?.filter(user => !isUserOnline(user))
  }

  return all
})

// Then calculate role stats based on online/offline filter
const roleStats = computed(() => {
  const users = filteredByOnlineUsers.value
  const counts = {}

  users.forEach(user => {
    const role = user.role || 'unknown'
    counts[role] = (counts[role] || 0) + 1
  })

  return Object.keys(counts).map(role => ({
    role,
    count: counts[role]
  }))
})

// Finally filter by role
const filteredUsers = computed(() => {
  const users = filteredByOnlineUsers.value
  if (!activeRole.value) return users
  return users?.filter(user => user.role === activeRole.value)
})



// Role göre renk sınıfı
const getRoleColorClass = (role, isActive) => {
  const base = 'border transition-colors'

  const colorMap = {
    admin: {
      active: 'bg-red-600 text-white border-red-600',
      inactive:
        'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-800/40'
    },
    doctor: {
      active: 'bg-green-600 text-white border-green-600',
      inactive:
        'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-800/40'
    },
    pricing: {
      active: 'bg-yellow-500 text-white border-yellow-500',
      inactive:
        'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-800/40'
    },
    user: {
      active: 'bg-blue-600 text-white border-blue-600',
      inactive:
        'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-800/40'
    },
    default: {
      active: 'bg-gray-600 text-white border-gray-600',
      inactive:
        'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
    }
  }

  const selected = colorMap[role] || colorMap.default
  return `${base} ${isActive ? selected.active : selected.inactive}`
}

// Load data on mount
onMounted(() => {
  loadUsers()
  setInterval(loadUsers, 30000)
})


// Modal functions
const openModal = () => {
  selectedUser.value = null
  showCreateModal.value = true
}

const openEditModal = (user) => {
  selectedUser.value = { ...user }
  showCreateModal.value = true
}

const closeModal = () => {
  showCreateModal.value = false
  selectedUser.value = null
}

// Handle user creation
const handleUserCreated = (newUser) => {
  console.log('New user created:', newUser)
  // Add to store manually since we're not using store methods
  usersStore.users.value.unshift(newUser)
}

// Handle user update
const handleUserUpdated = () => {
  loadUsers()
}

// Data is loaded above in script setup



const toggleUserStatus = async (user) => {
  // Set loading state
  toggleLoading.value[user.id] = true

  // Always update local state first for immediate UI feedback
  const index = usersStore.users.value.findIndex(u => u.id === user.id)
  const oldStatus = user.isActive

  if (index !== -1) {
    usersStore.users.value[index].isActive = !usersStore.users.value[index].isActive
    console.log(`User ${user.name} is now ${usersStore.users.value[index].isActive ? 'active' : 'inactive'}`)
  }

  // Try to sync with API in background
  try {
    const api = useApi()

    const response = await api(`/users/${user.id}`, {
      method: 'PATCH',
      body: { isActive: !oldStatus }
    })

    console.log('PATCH response:', response)

    console.log('Successfully synced with API')
  } catch (error) {
    console.error('Error syncing with API (using demo mode):', error)
    // Local state is already updated, so no need to revert
  } finally {
    // Clear loading state
    toggleLoading.value[user.id] = false
  }
}

const getRoleText = (role) => {
  switch (role) {
    case 'admin':
      return 'Admin'
    case 'user':
      return 'Kullanıcı'
    case 'doctor':
      return 'Doktor'
    case 'pricing':
      return 'Fiyatlama'
    default:
      return 'Bilinmiyor'
  }
}

const getRoleBadgeClass = (role) => {
  const baseClass = 'px-2 py-1 text-xs rounded-full font-medium'

  const roleColors = {
    admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    doctor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    pricing: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    user: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    default: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
  }

  return `${baseClass} ${roleColors[role] || roleColors.default}`
}

// Page head
useHead({
  title: 'Kullanıcılar - Valdori CRM'
})
</script>