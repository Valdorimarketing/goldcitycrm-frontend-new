<template>
    <div class="relative">
        <button @click="toggleDropdown"
            class="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            <BellIcon class="h-6 w-6" />
            <span v-if="unreadCount > 0"
                class="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">
                {{ unreadCount > 9 ? '9+' : unreadCount }}
            </span>
        </button>

        <Transition enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95">
            <div v-if="isDropdownOpen"
                class="absolute right-0 z-40 mt-2 w-96 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5">
                <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
                        Operasyon Bildirimleri
                    </h3>
                </div>

                <div class="max-h-96 overflow-y-auto">
                    <div v-if="loading" class="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                        Yükleniyor...
                    </div>

                    <div v-else-if="notifications.length === 0" class="px-4 py-8 text-center">
                        <CheckCircleIcon class="mx-auto h-10 w-10 text-gray-400" />
                        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Henüz bildirim bulunmuyor</p>
                    </div>

                    <div v-else>
                        <div v-for="n in sortedNotifications" :key="n.id"
                            class="w-full px-4 py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            :class="{
                                'bg-blue-50 dark:bg-blue-900/40': !n.done && !n.expired,
                                'bg-gray-50 dark:bg-gray-900': n.done || n.expired
                            }">
                            <div class="flex items-start justify-between">
                                <div class="flex items-start"> 
                                    <div class="relative">
                                        <p class="text-sm font-medium text-gray-900 dark:text-white">
                                            {{ n.message }}
                                        </p>
                                        <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                            {{ formatDate(n.date) }} • {{ n.operation_type_name }}
                                        </p>
                                        <p class="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                                            {{ n.customer_name }}
                                        </p>
                                    </div>
                                </div>

                                <!-- ✅ TAMAMLANDI BUTONU -->
                                <button @click="toggleDone(n)"
                                    class="ml-3 text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    :class="n.done ? 'text-green-600 border-green-600' : 'text-gray-500'">
                                    {{ n.done ? 'Tamamlandı' : 'Tamamla' }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="px-4 py-3 border-t border-gray-200 dark:border-gray-700 text-center">
                    <NuxtLink to="/operations" @click="closeDropdown"
                        class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium">
                        Tümünü Gör →
                    </NuxtLink>
                </div>
            </div>
        </Transition>

        <div v-if="isDropdownOpen" @click="closeDropdown" class="fixed inset-0 z-30"></div>
    </div>
</template>

<script setup>
import { BellIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/solid'
import { ref, computed, onMounted } from 'vue'

const api = useApi()
const notifications = ref([])
const loading = ref(false)
const isDropdownOpen = ref(false)

onMounted(fetchNotifications)

async function fetchNotifications() {
    loading.value = true
    try {
        const res = await api('/operations/notifications')
        notifications.value = res.data.map(n => ({
            ...n,
            isRead: n.isRead ?? false
        }))
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
}

const unreadCount = computed(() => notifications.value.filter(n => !n.done && !n.expired).length)
const sortedNotifications = computed(() =>
    [...notifications.value].sort((a, b) => new Date(b.date) - new Date(a.date))
)

function toggleDropdown() {
    isDropdownOpen.value = !isDropdownOpen.value
}
function closeDropdown() {
    isDropdownOpen.value = false
}

/**
 * ✅ Kullanıcı "Tamamla"ya tıklarsa hem local state'i hem backend'i günceller
 */
async function toggleDone(n) {
    const newDone = !n.done
    n.done = newDone

    try {
        await api(`/operations/followups/${n.schedule_id}/followup`, {
            method: 'PATCH',
            body: {
                kind: n.kind,
                offset: n.offset,
                done: newDone
            }
        })
    } catch (e) {
        console.error(e)
        n.done = !newDone // rollback
    }
}

function formatDate(d) {
    return new Intl.DateTimeFormat('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(new Date(d))
}
</script>
