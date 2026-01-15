<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-gradient-to-br from-violet-500 to-amber-500 rounded-2xl shadow-lg shadow-violet-500/25">
            <UsersIcon class="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ t('users.title', 'Kullanıcılar') }}
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {{ t('users.subtitle', 'Sistem kullanıcılarını buradan yönetebilirsiniz.') }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="loadUsers"
            class="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all text-sm font-medium border border-gray-200 dark:border-gray-600"
          >
            <ArrowPathIcon class="h-5 w-5" />
            {{ t('users.actions.refresh', 'Yenile') }}
          </button>
          <button
            @click="openModal"
            class="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-amber-500 text-white rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all text-sm font-medium shadow-lg shadow-violet-500/25"
          >
            <PlusIcon class="h-5 w-5" />
            {{ t('users.actions.new_user', 'Yeni Kullanıcı') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Online/Offline Filter -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div class="flex flex-wrap gap-2">
        <!-- Tümü -->
        <button
          @click="onlineFilter = null"
          :class="[
            'px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
            onlineFilter === null
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          ]"
        >
          {{ t('users.filters.all', 'Tümü') }} ({{ usersStore.users.value?.length || 0 }})
        </button>

        <!-- Çevrimiçi -->
        <button
          @click="onlineFilter = 'online'"
          :class="[
            'px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2',
            onlineFilter === 'online'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
              : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
          ]"
        >
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          {{ t('users.filters.online', 'Çevrimiçi') }} ({{ onlineCount }})
        </button>

        <!-- Çevrimdışı -->
        <button
          @click="onlineFilter = 'offline'"
          :class="[
            'px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
            onlineFilter === 'offline'
              ? 'bg-gray-600 text-white shadow-lg'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
          ]"
        >
          {{ t('users.filters.offline', 'Çevrimdışı') }} ({{ offlineCount }})
        </button>
      </div>
    </div>

    <!-- Role Tabs -->
    <div v-if="roleStats?.length" class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div class="flex flex-wrap gap-2">
        <button
          @click="activeRole = null"
          :class="[
            'px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
            !activeRole
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          ]"
        >
          {{ t('users.filters.all_roles', 'Tüm Roller') }} ({{ filteredByOnlineUsers?.length || 0 }})
        </button>

        <button
          v-for="stat in roleStats"
          :key="stat.role"
          @click="activeRole = stat.role"
          :class="[
            'px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
            activeRole === stat.role
              ? getRoleColorClass(stat.role, true)
              : getRoleColorClass(stat.role, false)
          ]"
        >
          {{ getRoleText(stat.role) }} ({{ stat.count }})
        </button>
      </div>
    </div>

    <!-- Users Grid -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      <div
        v-for="user in filteredUsers"
        :key="user.id"
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-l-4 p-5 transition-all hover:shadow-md"
        :class="getRoleBorderClass(user.role)"
      >
        <!-- User Header -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3">
            <!-- Avatar with Online Indicator -->
            <div class="relative">
              <div class="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 ring-2 ring-gray-200 dark:ring-gray-600">
                <img
                  v-if="user.avatar"
                  :src="path + user.avatar"
                  alt="Avatar"
                  class="w-full h-full object-cover"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center text-xs text-gray-400"
                >
                  {{ t('users.card.no_avatar', 'Yok') }}
                </div>
              </div>
              <!-- Online Pulse -->
              <span v-if="isUserOnline(user)" class="absolute -bottom-1 -right-1">
                <span class="relative flex h-4 w-4">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 ring-2 ring-white dark:ring-gray-800"></span>
                </span>
              </span>
            </div>

            <!-- Name & Role -->
            <div class="flex-1 min-w-0">
              <h3 class="text-base font-semibold text-gray-900 dark:text-white truncate mb-1">
                {{ user.name || t('users.card.unnamed_user', 'İsimsiz Kullanıcı') }}
              </h3>
              <span :class="getRoleBadgeClass(user.role)">
                {{ getRoleText(user.role) }}
              </span>
            </div>
          </div>

          <!-- Status Badges -->
          <div class="flex flex-col items-end gap-1.5">
            <span
              :class="[
                'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium',
                user.isActive
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
              ]"
            >
              {{ user.isActive ? t('users.status.active', 'Aktif') : t('users.status.inactive', 'Pasif') }}
            </span>
            <span :class="getLastActiveClass(user.lastActiveTime)">
              {{ getLastActiveText(user.lastActiveTime) }}
            </span>
          </div>
        </div>

        <!-- Group & Team Info -->
        <div class="flex flex-wrap gap-2 mb-4">
          <span
            v-if="user?.userGroup?.name"
            class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
          >
            <UserGroupIcon class="h-3.5 w-3.5 mr-1.5" />
            {{ user.userGroup.name }}
          </span>
          <span
            v-else
            class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
          >
            <UserGroupIcon class="h-3.5 w-3.5 mr-1.5" />
            {{ t('users.card.group_not_found', 'bulunamadı') }}
          </span>

          <span
            v-if="user?.userTeam?.name"
            class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
          >
            <UsersIcon class="h-3.5 w-3.5 mr-1.5" />
            {{ user.userTeam.name }}
          </span>
          <span
            v-else
            class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
          >
            <UsersIcon class="h-3.5 w-3.5 mr-1.5" />
            {{ t('users.card.team_not_found', 'bulunamadı') }}
          </span>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-2 mb-4">
          <button
            @click="openEditModal(user)"
            class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl transition-colors bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/30"
          >
            <PencilIcon class="h-3.5 w-3.5" />
            {{ t('users.actions.edit', 'Düzenle') }}
          </button>
          <button
            @click="toggleUserStatus(user)"
            :disabled="toggleLoading[user.id]"
            class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl transition-colors disabled:opacity-50"
            :class="[
              user.isActive
                ? 'bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:hover:bg-emerald-900/30'
            ]"
          >
            <span v-if="toggleLoading[user.id]" class="flex items-center gap-1">
              <svg class="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ t('users.actions.processing', 'İşleniyor...') }}
            </span>
            <span v-else class="flex items-center gap-1">
              <component :is="user.isActive ? XMarkIcon : CheckIcon" class="h-3.5 w-3.5" />
              {{ user.isActive ? t('users.actions.deactivate', 'Deaktif Et') : t('users.actions.activate', 'Aktif Et') }}
            </span>
          </button>
          <NuxtLink
            :to="`/profile/${user.id}`"
            class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl transition-colors bg-violet-50 text-violet-700 hover:bg-violet-100 dark:bg-violet-900/20 dark:text-violet-300 dark:hover:bg-violet-900/30"
          >
            <UserIcon class="h-3.5 w-3.5" />
            {{ t('users.actions.profile', 'Profil') }}
          </NuxtLink>
        </div>

        <!-- Footer Info -->
        <div class="flex flex-wrap gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
          <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
            <ClockIcon class="h-3.5 w-3.5 mr-1.5" />
            {{ t('users.card.last_seen', 'son görülme') }}: {{ getLastSeen(user.lastActiveTime) }}
          </span>
          <span
            :title="dayjs(user.createdAt).fromNow()"
            class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
          >
            <CalendarIcon class="h-3.5 w-3.5 mr-1.5" />
            {{ user.createdAt ? t('users.card.created', 'Oluşturulma') + ': ' + dayjs(user.createdAt).format('DD MMM YYYY') : t('users.card.created_unknown', 'Oluşturulma tarihi bilinmiyor') }}
          </span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredUsers?.length === 0" class="flex flex-col items-center justify-center py-16">
      <div class="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
        <UsersIcon class="h-8 w-8 text-gray-400" />
      </div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
        {{ t('users.empty.title', 'Kullanıcı bulunamadı') }}
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        {{ t('users.empty.message', 'Seçtiğiniz filtrelere uygun kullanıcı bulunamadı.') }}
      </p>
    </div>

    <!-- Create/Edit User Modal -->
    <UserCreateModal
      :is-open="showCreateModal"
      :user="selectedUser"
      @close="closeModal"
      @created="handleUserCreated"
      @updated="handleUserUpdated"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  ArrowPathIcon,
  PlusIcon,
  UsersIcon,
  UserGroupIcon,
  UserIcon,
  PencilIcon,
  XMarkIcon,
  CheckIcon,
  ClockIcon,
  CalendarIcon
} from '@heroicons/vue/24/outline'
import { useUsersStore } from '~/stores/users'
import { useLanguage } from '~/composables/useLanguage'
import UserCreateModal from '~/components/UserCreateModal.vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/tr'

dayjs.extend(relativeTime)
dayjs.locale('tr')

const { t } = useLanguage()

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
const onlineFilter = ref(null)
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
  return usersStore.users.value?.filter(user => isUserOnline(user))?.length || 0
})

// Count offline users
const offlineCount = computed(() => {
  return usersStore.users.value?.filter(user => !isUserOnline(user))?.length || 0
})

const getLastActiveClass = (lastActiveTime) => {
  if (!lastActiveTime) return 'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'

  const diffSeconds = dayjs().diff(dayjs(lastActiveTime), 'second')
  const diffHours = dayjs().diff(dayjs(lastActiveTime), 'hour')

  if (diffSeconds < 60) {
    return 'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
  } else if (diffHours >= 1) {
    return 'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
  } else {
    return 'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
  }
}

const getLastActiveText = (lastActiveTime) => {
  if (!lastActiveTime) return t('users.status.offline', 'Çevrimdışı')

  const diffSeconds = dayjs().diff(dayjs(lastActiveTime), 'second')
  const diffHours = dayjs().diff(dayjs(lastActiveTime), 'hour')

  if (diffSeconds < 60) {
    return t('users.status.online', 'Çevrimiçi')
  } else if (diffHours >= 1) {
    return t('users.status.offline', 'Çevrimdışı')
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
    usersStore.users.value = []
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

// Calculate role stats
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

// Filter by role
const filteredUsers = computed(() => {
  const users = filteredByOnlineUsers.value
  if (!activeRole.value) return users
  return users?.filter(user => user.role === activeRole.value)
})

// Role color class
const getRoleColorClass = (role, isActive) => {
  const colorMap = {
    admin: {
      active: 'bg-red-600 text-white shadow-lg shadow-red-500/25',
      inactive: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30'
    },
    doctor: {
      active: 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25',
      inactive: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
    },
    pricing: {
      active: 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/25',
      inactive: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
    },
    user: {
      active: 'bg-blue-600 text-white shadow-lg shadow-blue-500/25',
      inactive: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30'
    },
    default: {
      active: 'bg-gray-600 text-white shadow-lg',
      inactive: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
    }
  }

  const selected = colorMap[role] || colorMap.default
  return isActive ? selected.active : selected.inactive
}

const getRoleBorderClass = (role) => {
  const borderMap = {
    admin: 'border-red-500 hover:shadow-red-500/10',
    doctor: 'border-emerald-500 hover:shadow-emerald-500/10',
    pricing: 'border-yellow-500 hover:shadow-yellow-500/10',
    user: 'border-blue-500 hover:shadow-blue-500/10',
    default: 'border-gray-400'
  }
  return borderMap[role] || borderMap.default
}

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

const handleUserCreated = (newUser) => {
  usersStore.users.value.unshift(newUser)
}

const handleUserUpdated = () => {
  loadUsers()
}

const toggleUserStatus = async (user) => {
  toggleLoading.value[user.id] = true

  const index = usersStore.users.value.findIndex(u => u.id === user.id)
  const oldStatus = user.isActive

  if (index !== -1) {
    usersStore.users.value[index].isActive = !usersStore.users.value[index].isActive
  }

  try {
    const api = useApi()
    await api(`/users/${user.id}`, {
      method: 'PATCH',
      body: { isActive: !oldStatus }
    })
  } catch (error) {
    console.error('Error syncing with API:', error)
  } finally {
    toggleLoading.value[user.id] = false
  }
}

const getRoleText = (role) => {
  const roleMap = {
    admin: t('users.roles.admin', 'Admin'),
    user: t('users.roles.user', 'Kullanıcı'),
    doctor: t('users.roles.doctor', 'Doktor'),
    pricing: t('users.roles.pricing', 'Fiyatlama'),
    default: t('users.roles.unknown', 'Bilinmiyor')
  }
  return roleMap[role] || roleMap.default
}

const getRoleBadgeClass = (role) => {
  const baseClass = 'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium'
  const roleColors = {
    admin: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    doctor: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
    pricing: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
    user: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    default: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
  }
  return `${baseClass} ${roleColors[role] || roleColors.default}`
}

// Load data on mount
onMounted(() => {
  loadUsers()
  setInterval(loadUsers, 30000)
})

// Page head
useHead({
  title: 'Kullanıcılar - Valdori CRM'
})
</script>