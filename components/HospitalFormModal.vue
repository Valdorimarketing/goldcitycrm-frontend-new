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
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
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
              <!-- Header -->
              <div class="bg-gradient-to-r from-rose-400 to-rose-500 px-6 py-5">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <BuildingOffice2Icon class="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <DialogTitle as="h3" class="text-lg font-bold text-white">
                        {{ hospital ? t('hospital_modal.title_edit', 'Hastane Düzenle') : t('hospital_modal.title_new', 'Yeni Hastane Ekle') }}
                      </DialogTitle>
                      <p class="text-sm text-rose-100 mt-0.5">
                        {{ hospital ? 'Hastane bilgilerini güncelleyin' : 'Yeni hastane bilgilerini girin' }}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    @click="$emit('close')"
                    class="rounded-lg p-2 text-white/80 hover:text-white hover:bg-white/20 transition-colors"
                  >
                    <XMarkIcon class="h-5 w-5" />
                  </button>
                </div>
              </div>

              <!-- Form -->
              <form @submit.prevent="handleSubmit" class="p-6">
                <div class="space-y-5">
                  <!-- Hospital Name -->
                  <div>
                    <label for="name" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {{ t('hospital_modal.name_label', 'Hastane Adı') }} *
                    </label>
                    <div class="relative">
                      <BuildingOffice2Icon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                      <input
                        id="name"
                        v-model="formData.name"
                        type="text"
                        required
                        :placeholder="t('hospital_modal.name_placeholder', 'Örn: Acıbadem Hastanesi')"
                        class="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <!-- Hospital Code -->
                  <div>
                    <label for="code" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {{ t('hospital_modal.code_label', 'Hastane Kodu') }} *
                    </label>
                    <div class="relative">
                      <HashtagIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                      <input
                        id="code"
                        v-model="formData.code"
                        type="text"
                        required
                        :placeholder="t('hospital_modal.code_placeholder', 'Örn: ACB-001')"
                        class="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <!-- Address -->
                  <div>
                    <label for="address" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {{ t('hospital_modal.address_label', 'Adres') }}
                    </label>
                    <div class="relative">
                      <MapPinIcon class="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                      <textarea
                        id="address"
                        v-model="formData.address"
                        rows="3"
                        :placeholder="t('hospital_modal.address_placeholder', 'Hastane adresini girin...')"
                        class="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all resize-none"
                      />
                    </div>
                  </div>

                  <!-- Description -->
                  <div>
                    <label for="description" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {{ t('hospital_modal.description_label', 'Açıklama') }}
                    </label>
                    <div class="relative">
                      <DocumentTextIcon class="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                      <textarea
                        id="description"
                        v-model="formData.description"
                        rows="3"
                        :placeholder="t('hospital_modal.description_placeholder', 'Hastane hakkında ek bilgiler...')"
                        class="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="mt-6 flex gap-3">
                  <button
                    type="button"
                    @click="$emit('close')"
                    class="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all text-sm"
                  >
                    {{ t('hospital_modal.cancel', 'İptal') }}
                  </button>
                  <button
                    type="submit"
                    :disabled="saving"
                    class="flex-1 px-4 py-3 bg-gradient-to-r from-rose-400 to-rose-500 text-white rounded-xl font-semibold hover:from-rose-700 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm shadow-lg shadow-rose-500/25"
                  >
                    <span v-if="saving" class="flex items-center justify-center gap-2">
                      <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {{ t('hospital_modal.saving', 'Kaydediliyor...') }}
                    </span>
                    <span v-else>
                      {{ hospital ? t('hospital_modal.save_edit', 'Güncelle') : t('hospital_modal.save_new', 'Ekle') }}
                    </span>
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

<script setup>
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { 
  BuildingOffice2Icon, 
  HashtagIcon, 
  MapPinIcon, 
  DocumentTextIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import { useLanguage } from '~/composables/useLanguage'

const { t } = useLanguage()

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
      useToast().showSuccess(t('hospital_modal.success_updated', 'Hastane başarıyla güncellendi'))
    } else {
      await createHospital(formData.value)
      useToast().showSuccess(t('hospital_modal.success_created', 'Hastane başarıyla eklendi'))
    }
    emit('saved')
    emit('close')
  } catch (error) {
    useToast().showError(t('hospital_modal.error', 'İşlem sırasında bir hata oluştu'))
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