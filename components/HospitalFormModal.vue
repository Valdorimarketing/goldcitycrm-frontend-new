<template>
  <TransitionRoot as="template" :show="show">
    <Dialog as="div" class="relative z-50" @close="$emit('close')">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-xl">
              <form @submit.prevent="handleSubmit">
                <div class="bg-white dark:bg-gray-800 px-6 pb-6 pt-6">
                  <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center space-x-3">
                      <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
                        <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <DialogTitle as="h3" class="text-xl font-semibold leading-6 text-gray-900 dark:text-white">
                        {{ hospital ? 'Hastane Düzenle' : 'Yeni Hastane Ekle' }}
                      </DialogTitle>
                    </div>
                    <button
                      @click="$emit('close')"
                      type="button"
                      class="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <svg class="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                      
                  <div class="space-y-5">
                    <div class="group">
                      <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Hastane Adı <span class="text-red-500">*</span>
                      </label>
                      <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <input
                          id="name"
                          v-model="formData.name"
                          type="text"
                          required
                          placeholder="Örn: Acıbadem Hastanesi"
                          class="pl-10 block w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-200 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div class="group">
                      <label for="code" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Hastane Kodu <span class="text-red-500">*</span>
                      </label>
                      <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                          </svg>
                        </div>
                        <input
                          id="code"
                          v-model="formData.code"
                          type="text"
                          required
                          placeholder="Örn: ACB-001"
                          class="pl-10 block w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-200 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div class="group">
                      <label for="address" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Adres
                      </label>
                      <div class="relative">
                        <div class="absolute top-3 left-3 pointer-events-none">
                          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <textarea
                          id="address"
                          v-model="formData.address"
                          rows="3"
                          placeholder="Hastane adresini girin..."
                          class="pl-10 block w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-200 sm:text-sm resize-none"
                        />
                      </div>
                    </div>

                    <div class="group">
                      <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Açıklama
                      </label>
                      <div class="relative">
                        <div class="absolute top-3 left-3 pointer-events-none">
                          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <textarea
                          id="description"
                          v-model="formData.description"
                          rows="3"
                          placeholder="Hastane hakkında ek bilgiler..."
                          class="pl-10 block w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-200 sm:text-sm resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700 px-6 py-4">
                  <div class="flex items-center justify-end space-x-3">
                    <button
                      type="button"
                      @click="$emit('close')"
                      class="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      :disabled="saving"
                      class="inline-flex items-center px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-indigo-500/25"
                    >
                      <svg v-if="saving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <svg v-else class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {{ saving ? 'Kaydediliyor...' : (hospital ? 'Güncelle' : 'Ekle') }}
                    </button>
                  </div>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'

const props = defineProps({
  show: Boolean,
  hospital: Object
})

const emit = defineEmits(['close', 'saved'])

const { createHospital, updateHospital } = useHospitals()
const saving = ref(false)

const formData = ref({
  name: '',
  code: '',
  address: '',
  description: ''
})

const handleSubmit = async () => {
  saving.value = true
  try {
    if (props.hospital) {
      await updateHospital(props.hospital.id, formData.value)
      useToast().showSuccess('Hastane başarıyla güncellendi')
    } else {
      await createHospital(formData.value)
      useToast().showSuccess('Hastane başarıyla eklendi')
    }
    emit('saved')
    emit('close')
  } catch (error) {
    useToast().showError('İşlem sırasında bir hata oluştu')
  } finally {
    saving.value = false
  }
}

// Watch for hospital changes
watch(() => props.hospital, (newVal) => {
  if (newVal) {
    formData.value = {
      name: newVal.name || '',
      code: newVal.code || '',
      address: newVal.address || '',
      description: newVal.description || ''
    }
  } else {
    formData.value = {
      name: '',
      code: '',
      address: '',
      description: ''
    }
  }
}, { immediate: true })
</script>