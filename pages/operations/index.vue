<template>
  <div class="container mx-auto px-4 py-6 max-w-xl">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <!-- Header -->
      <div
        class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between"
      >
        <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
          Operasyon Bildirimleri
        </h1>

        <div class="flex items-center space-x-4">
          <button
            @click="markAllAsDone"
            class="text-sm text-rose-600 dark:text-rose-400 hover:underline disabled:opacity-50"
            :disabled="!undoneNotifications.length"
          >
            Tümünü tamamla
          </button>
        </div>
      </div>

      <!-- Bildirim Listesi -->
      <div v-if="loading" class="p-8 text-center text-gray-500 dark:text-gray-400">
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
        <p class="mt-3 text-gray-500 dark:text-gray-400">Henüz bildiriminiz yok.</p>
      </div>

      <ul v-else class="divide-y divide-gray-200 dark:divide-gray-700">
        <li
          v-for="notif in sortedNotifications"
          :key="notif.id"
          class="p-4 transition-colors flex justify-between items-start"
          :class="[
            notif.done
              ? 'bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800'
              : 'bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-800/50 border-l-4 border-blue-500'
          ]"
        >
          <div>
            <p class="text-sm text-gray-900 dark:text-gray-100 font-medium">
              {{ notif.message }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ formatRelativeTime(notif.date) }}
            </p>
          </div>

          <!-- ✅ Tamamla butonu -->
          <button
            @click="toggleDone(notif)"
            class="text-xs px-2 py-1 rounded border"
            :class="notif.done
              ? 'text-green-600 border-green-600'
              : 'text-gray-600 border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'"
          >
            {{ notif.done ? 'Tamamlandı' : 'Tamamla' }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const api = useApi()
const toast = useToast()

const notifications = ref([])
const loading = ref(true)

const undoneNotifications = computed(() => notifications.value.filter(n => !n.done))
const sortedNotifications = computed(() =>
  [...notifications.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
)

onMounted(fetchNotifications)

async function fetchNotifications() {
  loading.value = true
  try {
    const res = await api('/operations/notifications')
    notifications.value = res.data || []
  } catch (e) {
    toast.showError('Bildirimler yüklenemedi')
  } finally {
    loading.value = false
  }
}

// ✅ Tek bildirim için done toggle
async function toggleDone(notif) {
  const newDone = !notif.done
  notif.done = newDone
  try {
    await api(`/operations/followups/${notif.schedule_id}/followup`, {
      method: 'PATCH',
      body: {
        kind: notif.kind,
        offset: notif.offset,
        done: newDone
      }
    })
    toast.showSuccess(newDone ? 'Takip tamamlandı' : 'Takip geri alındı')
  } catch (e) {
    notif.done = !newDone // rollback
    toast.showError('Durum güncellenemedi')
  }
}

// ✅ Tüm bildirimleri tamamlandı olarak işaretle
async function markAllAsDone() {
  const pending = undoneNotifications.value
  if (!pending.length) return

  for (const n of pending) {
    n.done = true
    try {
      await api(`/operations/followups/${n.schedule_id}/followup`, {
        method: 'PATCH',
        body: { kind: n.kind, offset: n.offset, done: true }
      })
    } catch (e) {
      console.error(e)
    }
  }

  toast.showSuccess('Tüm takipler tamamlandı olarak işaretlendi')
}

function formatRelativeTime(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diff = Math.floor((now - date) / 1000 / 60)
  if (diff < 1) return 'Şimdi'
  if (diff < 60) return `${diff} dk önce`
  const hours = Math.floor(diff / 60)
  if (hours < 24) return `${hours} saat önce`
  const days = Math.floor(hours / 24)
  return `${days} gün önce`
}
</script>
