<template>
  <TransitionRoot as="template" :show="show">
    <Dialog as="div" class="relative z-50" @close="close">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
        leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild as="template" enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <form @submit.prevent="handleSubmit">
                <div>
                  <DialogTitle as="h3" class="text-lg font-semibold leading-6 text-gray-900 dark:text-white mb-4">
                    {{ isEdit ? 'Durumu Düzenle' : 'Yeni Durum Oluştur' }}
                  </DialogTitle>

                  <div class="space-y-4">
                    <div>
                      <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Durum Adı <span class="text-red-500">*</span>
                      </label>
                      <input id="name" v-model="formData.name" type="text" required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Örn: Yeni Müşteri" />
                    </div>

                    <div>
                      <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Açıklama
                      </label>
                      <textarea id="description" v-model="formData.description" rows="3"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Durum açıklaması..." />
                    </div>

                    <div>
                      <label for="color" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Renk <span class="text-red-500">*</span>
                      </label>
                      <div class="flex items-center space-x-2">
                        <input id="color" v-model="formData.color" type="color" required
                          class="h-10 w-20 border border-gray-300 rounded-md cursor-pointer" />
                        <input v-model="formData.color" type="text" pattern="^#[0-9A-Fa-f]{6}$" placeholder="#000000"
                          class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                      </div>
                      <div class="mt-2 flex flex-wrap gap-2">
                        <button v-for="color in presetColors" :key="color" type="button" @click="formData.color = color"
                          class="w-8 h-8 rounded-md border-2 hover:scale-110 transition-transform"
                          :style="{ backgroundColor: color }"
                          :class="formData.color === color ? 'border-gray-900 dark:border-white' : 'border-gray-300'" />
                      </div>
                    </div>

                    <div class="flex items-center space-x-1">
                      <span class="text-sm text-gray-500">Önizleme:</span>
                      <StatusBadge :name="formData.name || 'Örnek'" :color="formData.color" />
                    </div>

                    <div>
                      <label for="order" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Sıra
                      </label>
                      <input id="order" v-model.number="formData.order" type="number" min="0"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="0" />
                    </div>

                    <div class="space-y-2">
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Durum Özellikleri
                      </label>

                      <div class="flex items-center">
                        <input id="is_remindable" v-model="formData.isRemindable" type="checkbox"
                          class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                        <label for="is_remindable" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Zorunlu Arama
                        </label>
                      </div>

                      <div v-if="formData.isRemindable" class="ml-6">
                        <label for="remindingDay"
                          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Zorunlu Arama Günü
                        </label>
                        <input id="remindingDay" v-model.number="formData.remindingDay" type="number" min="0"
                          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="Örn: 7" />
                      </div>

                      <div class="flex items-center">
                        <input id="isFirst" v-model="formData.isFirst" type="checkbox"
                          class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                        <label for="isFirst" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          İlk durum
                        </label>
                      </div>

                      <div class="flex items-center">
                        <input id="is_closed" v-model="formData.isClosed" type="checkbox"
                          class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                        <label for="is_closed" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Kapalı durum
                        </label>
                      </div>

                      <div class="flex items-center">
                        <input id="is_sale" v-model="formData.isSale" type="checkbox"
                          class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                        <label for="is_sale" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Satış durumu
                        </label>
                      </div>

                      <div class="flex items-center">
                        <input id="isDoctor" v-model="formData.isDoctor" type="checkbox"
                          class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                        <label for="isDoctor" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Doktor Kontrolü Gerekli
                        </label>
                      </div>

                      <div class="flex items-center">
                        <input id="isPricing" v-model="formData.isPricing" type="checkbox"
                          class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                        <label for="isPricing" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Fiyatlandırma Gerekli
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mt-6 flex justify-end space-x-3">
                  <button type="button" @click="close"
                    class="inline-flex justify-center rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600">
                    İptal
                  </button>
                  <button type="submit" :disabled="loading"
                    class="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed">
                    <span v-if="loading" class="flex items-center">
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                      </svg>
                      Kaydediliyor...
                    </span>
                    <span v-else>{{ isEdit ? 'Güncelle' : 'Oluştur' }}</span>
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'
import StatusBadge from './StatusBadge.vue'
import type { Status } from '~/composables/useStatuses'

interface Props {
  show: boolean
  status?: Status | null
}

const props = defineProps<Props>()
const emit = defineEmits(['close', 'save'])

const isEdit = computed(() => !!props.status)
const loading = ref(false)

const presetColors = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e'
]

const defaultFormData = () => ({
  name: '',
  description: '',
  color: '#3b82f6',
  order: 0,
  isRemindable: false,
  isFirst: false,
  isClosed: false,
  isSale: false,
  remindingDay: null as number | null,
  isDoctor: false,
  isPricing: false
})

const formData = ref(defaultFormData())

watch(() => props.status, (newStatus) => {
  if (newStatus) {
    formData.value = {
      name: newStatus.name || '',
      description: newStatus.description || '',
      color: newStatus.color || '#3b82f6',
      order: newStatus.order ?? 0,
      isRemindable: newStatus.isRemindable === true || (newStatus as any).isRemindable === true,
      isFirst: newStatus.isFirst === true || (newStatus as any).isFirst === true,
      isClosed: newStatus.isClosed === true || (newStatus as any).isClosed === true,
      isSale: newStatus.isSale === true || (newStatus as any).isSale === true,
      remindingDay: newStatus.remindingDay ?? (newStatus as any).reminding_day ?? null,
      isDoctor: newStatus.isDoctor === true || (newStatus as any).is_doctor === true,
      isPricing: newStatus.isPricing === true || (newStatus as any).is_pricing === true
    }
  } else {
    formData.value = defaultFormData()
  }
}, { immediate: true })

const close = () => {
  emit('close')
  setTimeout(() => {
    formData.value = defaultFormData()
  }, 300)
}

const handleSubmit = async () => {
  loading.value = true
  try {
    emit('save', formData.value)
    close()
  } finally {
    loading.value = false
  }
}
</script>