<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-10">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                {{ productName }} - Aksiyonlar
              </DialogTitle>

              <!-- Loading State -->
              <div v-if="loading" class="flex justify-center py-8">
                <svg class="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>

              <!-- Actions Table -->
              <div v-else-if="actions.length > 0" class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead class="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Aksiyon Adı
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Açıklama
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Planlanan Gün
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Kullanıcı
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-for="action in actions" :key="action.id">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {{ action.name }}
                      </td>
                      <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {{ action.description }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <span v-if="action.plannedDate < 0" class="text-yellow-600">
                          {{ Math.abs(action.plannedDate) }} gün önce
                        </span>
                        <span v-else class="text-green-600">
                          {{ action.plannedDate }} gün sonra
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {{ action.userInfo?.name || 'Bilinmeyen' }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          @click="editAction(action)"
                          class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
                        >
                          Düzenle
                        </button>
                        <button
                          @click="deleteAction(action.id)"
                          class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Empty State -->
              <div v-else class="text-center py-8">
                <p class="text-gray-500 dark:text-gray-400">Bu ürün için henüz aksiyon bulunmuyor.</p>
              </div>

              <!-- Error Message -->
              <div v-if="error" class="rounded-md bg-red-50 dark:bg-red-900/20 p-4 mt-4">
                <p class="text-sm text-red-800 dark:text-red-400">{{ error }}</p>
              </div>

              <!-- Close Button -->
              <div class="flex justify-end mt-6">
                <button
                  @click="closeModal"
                  class="btn-secondary"
                >
                  Kapat
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>

  <!-- Edit Modal -->
  <ActionEditModal
    v-if="editModalOpen"
    :is-open="editModalOpen"
    :action="selectedAction"
    @close="editModalOpen = false; selectedAction = null"
    @updated="handleActionUpdated"
  />
</template>

<script setup lang="ts">
import { toRaw, unref } from 'vue'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'
import type { ActionList } from '~/types'

const props = defineProps<{
  isOpen: boolean
  productId: string
  productName: string
}>()

const emit = defineEmits<{
  close: []
}>()

const actionListsStore = useActionListsStore()

const actions = ref<ActionList[]>([])
const loading = ref(false)
const error = ref('')
const editModalOpen = ref(false)
const selectedAction = ref<ActionList | null>(null)

const fetchActions = async () => {
  loading.value = true
  error.value = ''
  
  try {
    await actionListsStore.fetchActionLists(1, 100, props.productId)
    
    // Store'daki actionLists direkt ref olarak geliyor
    // Ref'in içindeki değere erişmek için unref kullanıyoruz
    const storeActions = unref(actionListsStore.actionLists)
    
    // Planlanan güne göre sıralama (küçükten büyüğe)
    if (storeActions && Array.isArray(storeActions)) {
      actions.value = [...storeActions].sort((a, b) => {
        const aDate = a.plannedDate || 0
        const bDate = b.plannedDate || 0
        return aDate - bDate
      })
    } else {
      actions.value = []
    }
  } catch (err: any) {
    console.error('Error in fetchActions:', err)
    error.value = err.data?.message || 'Aksiyonlar yüklenirken bir hata oluştu'
  } finally {
    loading.value = false
  }
}

// Fetch actions when modal opens
watch(() => props.isOpen, async (newVal) => {
  if (newVal && props.productId) {
    await fetchActions()
  }
})

// Also fetch on mount if modal is already open
onMounted(() => {
  if (props.isOpen && props.productId) {
    fetchActions()
  }
})

const editAction = (action: ActionList) => {
  selectedAction.value = action
  editModalOpen.value = true
}

const deleteAction = async (id: number) => {
  if (!confirm('Bu aksiyonu silmek istediğinizden emin misiniz?')) return

  try {
    await actionListsStore.deleteActionList(id)
    actions.value = actions.value.filter(a => a.id !== id)
  } catch (err: any) {
    error.value = err.data?.message || 'Aksiyon silinirken bir hata oluştu'
  }
}

const handleActionUpdated = async () => {
  await fetchActions()
}

const closeModal = () => {
  actions.value = []
  error.value = ''
  emit('close')
}
</script>