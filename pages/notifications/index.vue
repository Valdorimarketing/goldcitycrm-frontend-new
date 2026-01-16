<template>
  <div class="container mx-auto px-4 py-6 max-w-xl">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <!-- Header -->
      <div
        class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between"
      >
        <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
          Bildirimler
        </h1>

        <div class="flex items-center space-x-4">
          <button
            @click="markAllAsRead"
            class="text-sm text-rose-600 dark:text-rose-400 hover:underline disabled:opacity-50"
            :disabled="!unreadNotifications.length"
          >
            Tümünü okundu yap
          </button>

          <button
            @click="deleteReadNotifications"
            class="text-sm text-red-600 dark:text-red-400 hover:underline disabled:opacity-50"
            :disabled="!readNotifications.length"
          >
            Okunanları sil
          </button>
        </div>
      </div>

      <!-- Bildirim Listesi -->
      <div
        v-if="loading"
        class="p-8 text-center text-gray-500 dark:text-gray-400"
      >
        Yükleniyor...
      </div>

      <div v-else-if="notifications.length === 0" class="p-8 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M12 20h.01M4 6h16M4 6l2 14h12l2-14H4z"
          />
        </svg>
        <p class="mt-3 text-gray-500 dark:text-gray-400">
          Henüz bildiriminiz yok.
        </p>
      </div>

      <ul v-else class="divide-y divide-gray-200 dark:divide-gray-700">
        <li
          v-for="notif in notifications"
          :key="notif.id"
          @click="markAsRead(notif)"
          class="p-4 cursor-pointer transition-colors"
          :class="[
            notif.isRead
              ? 'bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800'
              : 'bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-800/50 border-l-4 border-blue-500'
          ]"
        >
          <div class="flex items-start justify-between">
            <div>
              <p
                class="text-sm text-gray-900 dark:text-gray-100 font-medium"
              >
                {{ notif.message }}
              </p>
              <p
                class="text-xs text-gray-500 dark:text-gray-400 mt-1"
              >
                {{ formatRelativeTime(notif.createdAt) }}
              </p>
            </div>
            <div v-if="!notif.isRead" class="mt-1 ml-3 flex-shrink-0">
              <span
                class="inline-block w-2 h-2 bg-blue-600 rounded-full"
              ></span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/tr'
import { useNotifications } from '~/composables/useNotifications'

dayjs.extend(relativeTime)
dayjs.locale('tr')

const {
  notifications,
  fetchNotifications,
  markAsRead,
  markAllAsRead,
  deleteReadNotifications
} = useNotifications()

const loading = ref(true)

onMounted(async () => {
  await fetchNotifications()
  loading.value = false
})

const unreadNotifications = computed(() =>
  notifications.value.filter((n) => !n.isRead)
)
const readNotifications = computed(() =>
  notifications.value.filter((n) => n.isRead)
)

function formatRelativeTime(date: string) {
  return dayjs(date).fromNow()
}
</script>

<style scoped>
li {
  transition: background-color 0.2s ease;
}
</style>
