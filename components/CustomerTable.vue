<template>
  <div class="overflow-x-auto">
    <table class="min-w-full">
      <thead>
        <tr class="bg-gray-50 dark:bg-gray-900/50">
          <th class="w-12 px-4 py-3"></th>
          <template v-for="col in columns" :key="col.key">
            <th 
              v-if="col.isVisible" 
              @click="sortBy(col.key)"
              class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <div class="flex items-center gap-1.5">
                {{ col.label }}
                <span v-if="sortColumn === col.key" class="text-indigo-600 dark:text-indigo-400">
                  <ChevronUpIcon v-if="sortDirection === 'asc'" class="w-4 h-4" />
                  <ChevronDownIcon v-else class="w-4 h-4" />
                </span>
              </div>
            </th>
          </template>
        </tr>
      </thead>

      <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
        <tr 
          v-for="customer in filteredAndSorted" 
          :key="customer.id"
          class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
        >
          <!-- Actions -->
          <td class="px-4 py-4">
            <button 
              @click="toggleShow(customer.id)"
              class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
            >
              <EllipsisHorizontalIcon class="h-5 w-5" />
            </button>
          </td>

          <!-- Customer Info -->
          <td class="px-4 py-4">
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                {{ customer.name.charAt(0).toUpperCase() }}
              </div>
              <div>
                <NuxtLink 
                  :to="`/customers/show/${customer.id}`"
                  class="font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {{ customer.name }}
                </NuxtLink>
                <p class="text-xs text-gray-500 dark:text-gray-400">ID: {{ customer.id }}</p>
              </div>
            </div>
          </td>

          <!-- Status -->
          <td class="px-4 py-4">
            <StatusBadge :name="customer.statusData?.name" :color="customer.statusData?.color" />
          </td>

          <!-- Source (Admin) -->
          <td v-if="isAdmin" class="px-4 py-4">
            <span class="text-sm text-gray-600 dark:text-gray-300">{{ customer.source || '-' }}</span>
          </td>

          <!-- Phone -->
          <td class="px-4 py-4">
            <template v-if="!customer.phone">
              <span class="text-sm text-gray-400">-</span>
            </template>
            <template v-else-if="isAdmin">
              <span class="text-sm text-gray-600 dark:text-gray-300">{{ customer.phone }}</span>
            </template>
            <template v-else>
              <span class="text-sm text-gray-600 dark:text-gray-300">
                {{ customer.phone.substring(0, 5) }}<span class="blur-[3px] select-none">{{ maskPhone(customer.phone.substring(5)) }}</span>
              </span>
            </template>
          </td>

          <!-- Related Transaction -->
          <td class="px-4 py-4">
            <span class="text-sm text-gray-600 dark:text-gray-300">{{ customer.relatedTransaction || '-' }}</span>
          </td>

          <!-- Patient -->
          <td class="px-4 py-4">
            <span class="text-sm text-gray-600 dark:text-gray-300">{{ customer.patient || '-' }}</span>
          </td>

          <!-- Checkup Package -->
          <td class="px-4 py-4">
            <span class="text-sm text-gray-600 dark:text-gray-300">{{ customer.checkup_package || '-' }}</span>
          </td>

          <!-- Assigned User (Admin) -->
          <td v-if="isAdmin" class="px-4 py-4">
            <NuxtLink 
              v-if="customer.relevantUserData"
              :to="`/profile/${customer.relevantUserData?.id}`" 
              class="flex items-center gap-2 group/user"
            >
              <div v-if="customer.relevantUserData.avatar" class="h-7 w-7 rounded-full overflow-hidden ring-2 ring-white dark:ring-gray-800 shadow">
                <img :src="path + customer.relevantUserData.avatar" alt="Avatar" class="h-full w-full object-cover" />
              </div>
              <div v-else class="h-7 w-7 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white text-xs font-medium shadow">
                {{ customer.relevantUserData?.name?.charAt(0) || 'A' }}
              </div>
              <div>
                <p class="text-sm text-gray-700 dark:text-gray-300 group-hover/user:text-indigo-600 dark:group-hover/user:text-indigo-400 transition-colors">
                  {{ customer.relevantUserData?.name }}
                </p>
                <p v-if="customer.relevantUserData?.lastActiveTime" class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full" :class="isOnline(customer.relevantUserData?.lastActiveTime) ? 'bg-emerald-500' : 'bg-gray-400'"></span>
                  {{ getLastSeen(customer.relevantUserData?.lastActiveTime) }}
                </p>
              </div>
            </NuxtLink>
            <span v-else class="text-sm text-gray-400">Atanmamış</span>
          </td>

          <!-- Created Date -->
          <td class="px-4 py-4">
            <span class="text-sm text-gray-600 dark:text-gray-300">{{ formatDate(customer.createdAt) }}</span>
          </td>

          <!-- Updated Date -->
          <td class="px-4 py-4">
            <span class="text-sm text-gray-600 dark:text-gray-300">{{ formatDate(customer.updatesAt) }}</span>
          </td>
        </tr>

        <!-- Empty State -->
        <tr v-if="filteredAndSorted.length === 0">
          <td :colspan="columns.filter(c => c.isVisible).length + 1" class="px-4 py-16 text-center">
            <div class="flex flex-col items-center">
              <div class="p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                <UsersIcon class="h-8 w-8 text-gray-400" />
              </div>
              <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-1">Müşteri bulunamadı</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Arama kriterlerinizi değiştirmeyi deneyin.</p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Action Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div 
          v-if="showStates.activeId"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          @click.self="showStates.activeId = null"
        >
          <Transition
            enter-active-class="transition-all duration-300"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition-all duration-200"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div 
              v-if="showStates.activeId"
              class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
            >
              <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                <h3 class="font-semibold text-gray-900 dark:text-white">İşlemler</h3>
                <button 
                  @click="showStates.activeId = null"
                  class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  <XMarkIcon class="h-5 w-5" />
                </button>
              </div>

              <div class="p-4 grid grid-cols-3 gap-2">
                <NuxtLink 
                  :to="`/customers/show/${showStates.activeId}`"
                  class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  <div class="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                    <EyeIcon class="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span class="text-xs text-gray-600 dark:text-gray-300">Görüntüle</span>
                </NuxtLink>

                <button 
                  @click="emitAction('show-history')"
                  class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <ClockIcon class="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span class="text-xs text-gray-600 dark:text-gray-300">Geçmiş</span>
                </button>

                <button 
                  @click="emitAction('show-notes')"
                  class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  <div class="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <DocumentTextIcon class="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <span class="text-xs text-gray-600 dark:text-gray-300">Notlar</span>
                </button>

                <button 
                  @click="emitAction('show-doctor')"
                  class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  <div class="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <UsersIcon class="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span class="text-xs text-gray-600 dark:text-gray-300">Doktor</span>
                </button>

                <button 
                  @click="emitAction('show-services')"
                  class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  <div class="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <ShoppingBagIcon class="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span class="text-xs text-gray-600 dark:text-gray-300">Hizmetler</span>
                </button>

                <button 
                  @click="emitAction('show-files')"
                  class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  <div class="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                    <FolderIcon class="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <span class="text-xs text-gray-600 dark:text-gray-300">Dosyalar</span>
                </button>

                <NuxtLink 
                  v-if="isEditable"
                  :to="`/customers/edit/${showStates.activeId}`"
                  class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  <div class="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <PencilIcon class="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <span class="text-xs text-gray-600 dark:text-gray-300">Düzenle</span>
                </NuxtLink>

                <button 
                  v-if="isDeleteable"
                  @click="emitAction('confirm-delete')"
                  class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 transition-all"
                >
                  <div class="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <TrashIcon class="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <span class="text-xs text-red-600 dark:text-red-400">Sil</span>
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { 
  ClockIcon, 
  DocumentTextIcon, 
  EllipsisHorizontalIcon, 
  EyeIcon, 
  FolderIcon, 
  PencilIcon, 
  ShoppingBagIcon, 
  TrashIcon, 
  UsersIcon, 
  XMarkIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  isAdmin: { type: Boolean, default: false },
  isUser: { type: Boolean, default: false },
  data: { type: Array, default: () => [] },
  isEditable: { type: Boolean, default: false },
  isDeleteable: { type: Boolean, default: false }
})

const { $dayjs } = useNuxtApp()
const config = useRuntimeConfig()
const path = config.public.apiBase

const showStates = ref({ activeId: null })
const sortColumn = ref('')
const sortDirection = ref('asc')

const emit = defineEmits([
  'confirm-delete',
  'show-history',
  'show-notes',
  'show-doctor',
  'show-services',
  'show-files'
])

const columns = computed(() => [
  { label: 'İsim', key: 'name', isVisible: props.isAdmin || props.isUser },
  { label: 'Durum', key: 'statusData', isVisible: props.isAdmin || props.isUser },
  { label: 'Kaynak', key: 'source', isVisible: props.isAdmin },
  { label: 'Telefon', key: 'phone', isVisible: props.isAdmin || props.isUser },
  { label: 'İlgilenilen Konu', key: 'relatedTransaction', isVisible: props.isAdmin || props.isUser },
  { label: 'Hastalık', key: 'patient', isVisible: props.isAdmin || props.isUser },
  { label: 'Checkup Paketi', key: 'checkup_package', isVisible: props.isAdmin || props.isUser },
  { label: 'Atanan', key: 'relevantUserData', isVisible: props.isAdmin },
  { label: 'Eklenme', key: 'createdAt', isVisible: props.isAdmin || props.isUser },
  { label: 'Güncelleme', key: 'updatesAt', isVisible: props.isAdmin || props.isUser }
])

const toggleShow = (id) => {
  showStates.value.activeId = showStates.value.activeId === id ? null : id
}

const emitAction = (action) => {
  const customer = props.data.find(c => c.id === showStates.value.activeId)
  if (customer) {
    emit(action, customer)
    showStates.value.activeId = null
  }
}

const getLastSeen = (lastActiveTime) => $dayjs(lastActiveTime).fromNow()

const isOnline = (lastActiveTime) => {
  if (!lastActiveTime) return false
  const diff = Date.now() - new Date(lastActiveTime).getTime()
  return diff < 5 * 60 * 1000
}

const maskPhone = (str) => {
  if (!str) return ''
  return str.replace(/[0-9]/g, () => Math.floor(Math.random() * 10).toString())
            .replace(/[^0-9\s\-\+\(\)]/g, '•')
}

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
</script>