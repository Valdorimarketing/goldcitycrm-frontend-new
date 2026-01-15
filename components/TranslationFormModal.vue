<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-80 transition-opacity"></div>
      
      <div class="inline-block transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:align-middle">
        <form @submit.prevent="handleSubmit">
          <div class="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="mb-4">
              <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                {{ isEditMode ? 'Çeviriyi Düzenle' : 'Yeni Çeviri Ekle' }}
              </h3>
            </div>

            <!-- Translation Key -->
            <div class="mb-4">
              <label for="key" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Anahtar <span class="text-red-500">*</span>
              </label>
              <input
                id="key"
                v-model="form.key"
                type="text"
                :disabled="isEditMode"
                required
                class="form-input"
                :class="{ 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed': isEditMode }"
                placeholder="Örn: common.hello, menu.dashboard"
              />
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Nokta ile ayırarak hiyerarşik yapı oluşturabilirsiniz
              </p>
            </div>

            <!-- Translation Value -->
            <div class="mb-4">
              <label for="value" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Çeviri <span class="text-red-500">*</span>
              </label>
              <textarea
                id="value"
                v-model="form.value"
                rows="4"
                required
                class="form-input"
                placeholder="Çeviri metni"
              ></textarea>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Parametreli çeviri için {parametre} formatını kullanın
              </p>
            </div>

            <!-- Description -->
            <div class="mb-4">
              <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Açıklama
              </label>
              <input
                id="description"
                v-model="form.description"
                type="text"
                class="form-input"
                placeholder="Bu çevirinin ne için kullanıldığı"
              />
            </div>
          </div>

          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="submit"
              :disabled="saving"
              class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto disabled:opacity-50"
            >
              {{ saving ? 'Kaydediliyor...' : 'Kaydet' }}
            </button>
            <button
              type="button"
              @click="$emit('close')"
              :disabled="saving"
              class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-600 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 sm:mt-0 sm:w-auto disabled:opacity-50"
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { languageApi } from '~/services/languageApi'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  translation: {
    type: Object,
    default: null
  },
  languageId: {
    type: Number,
    required: true
  },
  languageCode: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close', 'saved'])

const saving = ref(false)

const form = reactive({
  key: '',
  value: '',
  description: ''
})

const isEditMode = computed(() => !!props.translation)

// Reset form when modal opens
watch(() => props.show, (show) => {
  if (show) {
    if (props.translation) {
      form.key = props.translation.key
      form.value = props.translation.value
      form.description = props.translation.description
    } else {
      form.key = ''
      form.value = ''
      form.description = ''
    }
  }
})


const handleSubmit = async () => {
  saving.value = true
  try {
    if (isEditMode.value) {
  // ✅ DOĞRU - Object gönder
      await languageApi.updateTranslation(
        props.languageId, 
        props.translation.id, 
        { value: form.value, description: form.description } // ✅ Object olarak gönder
      )
      useToast().showSuccess('Çeviri başarıyla güncellendi')
    } else {
      // ✅ Sadece items array'i gönder
      const items = [
        {
          keyName: form.key,
          description: form.description || undefined,
          translations: {
            [props.languageCode]: form.value
          }
        }
      ]
      
      await languageApi.bulkCreateTranslations(items) // ✅ Array gönder
      useToast().showSuccess('Çeviri başarıyla eklendi')
    }
    
    emit('saved')
  } catch (error) {
    console.error('Failed to save translation:', error)
    useToast().showError(
      error?.data?.message || 
      (isEditMode.value ? 'Çeviri güncellenirken bir hata oluştu' : 'Çeviri eklenirken bir hata oluştu')
    )
  } finally {
    saving.value = false
  }
}


</script>