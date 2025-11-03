<template>
  <div class="overflow-x-auto">


    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead class="bg-gray-50 dark:bg-gray-800">
        <tr>
          <th v-for="col in columns" :key="col.key" @click="sortBy(col.key)"
            class="table-header cursor-pointer text-gray-700 dark:text-gray-300">
            <div class="flex items-center gap-1">
              {{ col.label }}
              <span v-if="sortColumn === col.key">
                <svg v-if="sortDirection === 'asc'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 12l5-5 5 5H5z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 8l5 5 5-5H5z" />
                </svg>
              </span>
            </div>
          </th>
          <th class="table-header text-gray-700 dark:text-gray-300">İşlemler</th>
        </tr>
      </thead>

      <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700 text-sm font-light">
        <tr v-for="customer in filteredAndSorted" :key="customer.id">
          <td class="table-cell">
            <div class="flex items-center">
              <div class="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                <span class="text-sm font-medium text-indigo-600 dark:text-indigo-300">
                  {{ customer.name.charAt(0).toUpperCase() }}
                </span>
              </div>
              <div class="ml-4">
                <NuxtLink :to="`/customers/show/${customer.id}`"
                  class="text-sm flex flex-col gap-1 font-medium text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">
                  <span>{{ customer.name }}</span>
                  <span class="text-xs dark:text-gray-400">ID: {{ customer.id }}</span>
                </NuxtLink>
              </div>
            </div>
          </td>
          <td class="table-cell">{{ customer.phone || '-' }}</td>
          <td class="table-cell">{{ getStatusText(customer.status) }}</td>
          <td class="table-cell">{{ customer.source || '-' }}</td>
          <td class="table-cell">{{ customer.relatedTransaction || '-' }}</td>
          <td class="table-cell">{{ customer.user?.name || '-' }}</td>
          <td class="table-cell">{{ customer.relevantUser ? `${customer.relevantUser.name}` : '-' }}</td>
          <td class="table-cell">{{ customer.isActive ? 'Aktif' : 'Pasif' }}</td>
          <td class="table-cell">{{ formatDate(customer.createdAt) }}</td>

          <td class="table-cell text-right">
            <div class="relative inline-block text-left">
              <!-- Trigger Button -->
              <button type="button"
                class="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                @click="toggleShow(customer.id)">
                <EllipsisHorizontalIcon class="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </button>

              <!-- Dropdown -->
              <div v-show="showStates.activeId === customer.id"
                class="absolute  right-0 z-50 mt-2 w-48 origin-top-right rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition">
                <div class="py-1">
                  <NuxtLink :to="`/customers/show/${customer.id}`"
                    class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                    <EyeIcon class="h-4 w-4 text-indigo-500" />
                    Görüntüle
                  </NuxtLink>

                  <button @click="emit('show-history', customer)"
                    class="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <ClockIcon class="h-4 w-4 text-blue-500" />
                    Geçmiş
                  </button>

                  <button @click="emit('show-notes', customer)"
                    class="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <DocumentTextIcon class="h-4 w-4 text-amber-500" />
                    Notlar
                  </button>

                  <button @click="emit('show-doctor', customer)"
                    class="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <UserIcon class="h-4 w-4 text-purple-500" />
                    Doktor Görüşü
                  </button>

                  <button @click="emit('show-services', customer)"
                    class="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <ShoppingBagIcon class="h-4 w-4 text-green-500" />
                    Hizmetler
                  </button>

                  <button @click="emit('show-files', customer)"
                    class="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <FolderIcon class="h-4 w-4 text-cyan-500" />
                    Müşteri Dosyaları
                  </button>

                  <NuxtLink v-if="isEditable" :to="`/customers/edit/${customer.id}`"
                    class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <PencilIcon class="h-4 w-4 text-yellow-500" />
                    Düzenle
                  </NuxtLink>

                  <button v-if="isDeleteable" @click="emit('confirm-delete', customer)"
                    class="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30">
                    <TrashIcon class="h-4 w-4 text-red-500" />
                    Sil
                  </button>
                </div>
              </div>
            </div>
          </td>

        </tr>

        <tr v-if="filteredAndSorted.length === 0">
          <td colspan="10" class="text-center py-12">
            <UsersIcon class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Müşteri bulunamadı</h3>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ClockIcon, DocumentTextIcon, EllipsisHorizontalIcon, EyeIcon, FolderIcon, PencilIcon, ShoppingBagIcon, TrashIcon, UserIcon } from '@heroicons/vue/24/outline'
import { ref, computed } from 'vue'

const props = defineProps({
  data: { type: Array, default: () => [] },
  isEditable: { type: Boolean, default: false },
  isDeleteable: { type: Boolean, default: false }
})

const showStates = ref({ activeId: null })

const toggleShow = (id) => {
  if (showStates.value.activeId === id) {
    // Aynı id'ye tıklandıysa: kapat
    showStates.value.activeId = null
  } else {
    // Farklı id'ye tıklandıysa: mevcut açık olanı kapat, yenisini aç
    showStates.value.activeId = id
  }
}


const emit = defineEmits([
  'confirm-delete',
  'show-history',
  'show-notes',
  'show-doctor-assignment',
  'show-services',
  'show-files'
])

const statusMap = ref({
  1: 'Yeni',
  2: 'İlgileniliyor',
  3: 'Tamamlandı',
  4: 'Reddedildi'
})

// Dropdown durumu
const open = ref(false)

// Sıralama
const sortColumn = ref('')
const sortDirection = ref('asc')
const columns = [
  { label: 'İsim', key: 'name' },
  { label: 'Telefon', key: 'phone' },
  { label: 'Durum', key: 'status' },
  { label: 'Kaynak', key: 'source' },
  { label: 'İlgilenilen Konu', key: 'relatedTransaction' },
  { label: 'Oluşturan', key: 'user.name' },
  { label: 'Atanan', key: 'relevantUser.name' },
  { label: 'Aktif', key: 'isActive' },
  { label: 'Eklenme Tarihi', key: 'createdAt' }
]

const sortBy = (key) => {
  if (sortColumn.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = key
    sortDirection.value = 'asc'
  }
}

const customers = computed(() => props.data)

const filteredAndSorted = computed(() => {
  let result = customers.value

  if (sortColumn.value) {
    result = result.slice().sort((a, b) => {
      const aVal = getValueByPath(a, sortColumn.value)
      const bVal = getValueByPath(b, sortColumn.value)
      if (aVal === bVal) return 0
      if (!aVal) return 1
      if (!bVal) return -1
      return sortDirection.value === 'asc'
        ? aVal.toString().localeCompare(bVal.toString())
        : bVal.toString().localeCompare(aVal.toString())
    })
  }

  return result
})

function getValueByPath(obj, path) {
  return path.split('.').reduce((o, key) => (o ? o[key] : null), obj)
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function getStatusText(status) {
  return statusMap.value[status] || '-'
}
</script>

<style scoped>
.tooltip {
  @apply absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none;
}
</style>
