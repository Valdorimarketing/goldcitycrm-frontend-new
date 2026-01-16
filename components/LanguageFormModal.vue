<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-80 transition-opacity"></div>
      
      <div class="inline-block transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
        <form @submit.prevent="handleSubmit">
          <div class="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="mb-4">
              <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                {{ isEditMode ? 'Dili Düzenle' : 'Yeni Dil Ekle' }}
              </h3>
            </div>

            <!-- Language Code -->
            <div class="mb-4">
              <label for="code" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Dil Kodu <span class="text-red-500">*</span>
              </label>
              <input
                id="code"
                v-model="form.code"
                type="text"
                :disabled="isEditMode"
                maxlength="10"
                required
                class="form-input"
                :class="{ 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed': isEditMode }"
                placeholder="Örn: en, de, fr"
              />
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                ISO 639-1 dil kodu (2-10 karakter)
              </p>
            </div>

            <!-- Language Name -->
            <div class="mb-4">
              <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Dil Adı <span class="text-red-500">*</span>
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="form-input"
                placeholder="Örn: English, Deutsch, Français"
              />
            </div>

            <!-- Is Default -->
            <div class="mb-4">
              <label class="flex items-center">
                <input
                  v-model="form.isDefault"
                  type="checkbox"
                  class="h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-600 dark:border-gray-600 dark:bg-gray-700"
                />
                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Varsayılan dil olarak ayarla
                </span>
              </label>
            </div>

            <!-- Is Active -->
            <div class="mb-4">
              <label class="flex items-center">
                <input
                  v-model="form.isActive"
                  type="checkbox"
                  class="h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-600 dark:border-gray-600 dark:bg-gray-700"
                />
                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Aktif
                </span>
              </label>
            </div>
          </div>

          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="submit"
              :disabled="saving"
              class="inline-flex w-full justify-center rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 sm:ml-3 sm:w-auto disabled:opacity-50"
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
  language: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

const saving = ref(false)

const form = reactive({
  code: '',
  name: '',
  isDefault: false,
  isActive: true
})

const isEditMode = computed(() => !!props.language)

// Reset form when modal opens
watch(() => props.show, (show) => {
  if (show) {
    if (props.language) {
      form.code = props.language.code
      form.name = props.language.name
      form.isDefault = !!props.language.isDefault
      form.isActive = !!props.language.isActive
    } else {
      form.code = ''
      form.name = ''
      form.isDefault = false
      form.isActive = true
    }
  }
})

const handleSubmit = async () => {
  saving.value = true
  try {

    const isActiveValue = (typeof form.isActive === 'string') 
    ? form.isActive.toLowerCase() === 'true' 
    : form.isActive;

    const isDefaultValue = (typeof form.isDefault === 'string') 
    ? form.isDefault.toLowerCase() === 'true' 
    : form.isDefault;

    if (isEditMode.value) {
      // Update
      await languageApi.updateLanguage(props.language.id, {
        name: form.name,
        isDefault: isDefaultValue,
        isActive: isActiveValue
      })
      useToast().showSuccess('Dil başarıyla güncellendi')
    } else {
      // Create
      await languageApi.createLanguage({
        code: form.code.toLowerCase(),
        name: form.name,
        isDefault: isDefaultValue,
        isActive: isActiveValue
      })
      useToast().showSuccess('Dil başarıyla eklendi')
    }
    
    emit('saved')
  } catch (error) {
    console.error('Failed to save language:', error)
    useToast().showError(
      error?.data?.message || 
      (isEditMode.value ? 'Dil güncellenirken bir hata oluştu' : 'Dil eklenirken bir hata oluştu')
    )
  } finally {
    saving.value = false
  }
}
</script>