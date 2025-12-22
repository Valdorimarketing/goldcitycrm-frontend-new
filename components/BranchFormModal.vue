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
            <DialogPanel class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
              <!-- Header -->
              <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <BuildingOfficeIcon class="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <DialogTitle as="h3" class="text-lg font-bold text-white">
                        {{ branch ? 'Branş Düzenle' : 'Yeni Branş' }}
                      </DialogTitle>
                      <p class="text-sm text-indigo-100 mt-0.5">
                        {{ branch ? 'Branş bilgilerini güncelleyin' : 'Yeni branş bilgilerini girin' }}
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

              <!-- Error Alert -->
              <div v-if="errorMessage" class="mx-6 mt-4">
                <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="ml-3 flex-1">
                      <h3 class="text-sm font-medium text-red-800 dark:text-red-300">
                        {{ errorTitle }}
                      </h3>
                      <div class="mt-2 text-sm text-red-700 dark:text-red-400">
                        <p>{{ errorMessage }}</p>
                        <ul v-if="errorDetails.length > 0" class="mt-2 list-disc list-inside space-y-1">
                          <li v-for="(detail, index) in errorDetails" :key="index">
                            {{ detail }}
                          </li>
                        </ul>
                      </div>
                    </div>
                    <button
                      @click="clearError"
                      class="ml-3 flex-shrink-0 rounded-lg p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <XMarkIcon class="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Form -->
              <form @submit.prevent="handleSubmit" class="p-6">
                <div class="space-y-5">
                  <!-- Branch Code -->
                  <div>
                    <label for="code" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Branş Kodu *
                    </label>
                    <div class="relative">
                      <HashtagIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                      <input
                        id="code"
                        v-model="formData.code"
                        type="text"
                        required
                        placeholder="Örn: KARD"
                        :class="[
                          'w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all',
                          fieldErrors.code 
                            ? 'border-red-300 dark:border-red-700' 
                            : 'border-gray-200 dark:border-gray-600'
                        ]"
                      />
                    </div>
                    <p v-if="fieldErrors.code" class="mt-1 text-xs text-red-600 dark:text-red-400">
                      {{ fieldErrors.code }}
                    </p>
                  </div>

                  <!-- Hospital Multi-Select -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Hastaneler
                    </label>
                    <div class="space-y-2 max-h-40 overflow-y-auto bg-gray-50 dark:bg-gray-900 rounded-xl p-3 border border-gray-200 dark:border-gray-600">
                      <label
                        v-for="hospital in hospitals"
                        :key="hospital.id"
                        class="flex items-center gap-2 p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          :value="hospital.id"
                          v-model="formData.hospitalIds"
                          class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span class="text-sm text-gray-700 dark:text-gray-300">{{ hospital.name }}</span>
                      </label>
                    </div>
                  </div>

                  <!-- Description -->
                  <div>
                    <label for="description" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Açıklama
                    </label>
                    <textarea
                      id="description"
                      v-model="formData.description"
                      rows="3"
                      placeholder="Branş açıklaması..."
                      class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                    ></textarea>
                  </div>

                  <!-- Translations Section -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Branş Adı (Çeviriler) *
                    </label>
                    <div class="space-y-3">
                      <div
                        v-for="language in languages"
                        :key="language.id"
                        class="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-600"
                      >
                        <div class="flex items-center gap-3 mb-2">
                          <img
                            v-if="language.flag"
                            :src="language.flag"
                            :alt="language.name"
                            class="w-6 h-4 object-cover rounded"
                          />
                          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {{ language.name }}
                          </span>
                          <span
                            v-if="language.isDefault"
                            class="ml-auto text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded"
                          >
                            Varsayılan
                          </span>
                        </div>
                        <input
                          v-model="translationMap[language.id]"
                          type="text"
                          :required="language.isDefault"
                          :placeholder="`${language.name} için branş adı`"
                          :class="[
                            'w-full px-4 py-2 bg-white dark:bg-gray-800 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all',
                            fieldErrors[`translation_${language.id}`]
                              ? 'border-red-300 dark:border-red-700'
                              : 'border-gray-200 dark:border-gray-600'
                          ]"
                        />
                        <p v-if="fieldErrors[`translation_${language.id}`]" class="mt-1 text-xs text-red-600 dark:text-red-400">
                          {{ fieldErrors[`translation_${language.id}`] }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="mt-6 flex gap-3">
                  <button
                    type="button"
                    @click="$emit('close')"
                    :disabled="saving"
                    class="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    :disabled="saving"
                    class="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm shadow-lg shadow-indigo-500/25"
                  >
                    <span v-if="saving" class="flex items-center justify-center gap-2">
                      <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Kaydediliyor...
                    </span>
                    <span v-else>Kaydet</span>
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
  XMarkIcon, 
  BuildingOfficeIcon,
  HashtagIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  show: Boolean,
  branch: Object,
  hospitals: Array
})

const emit = defineEmits(['close', 'saved'])

const { createBranch, updateBranch, fetchBranch } = useBranches()
const { availableLanguages: languages } = useLanguage()
const saving = ref(false)

// Error state
const errorMessage = ref('')
const errorTitle = ref('')
const errorDetails = ref([])
const fieldErrors = ref({})

const formData = ref({
  code: '',
  description: '',
  hospitalIds: []
})

const translationMap = ref({})

const clearError = () => {
  errorMessage.value = ''
  errorTitle.value = ''
  errorDetails.value = []
  fieldErrors.value = {}
}


const handleApiError = (error) => {
  clearError()
  
  console.error('API Error:', error)
  
  // Backend'den gelen response
  const response = error?.response?.data || error?.data || error
  const status = error?.response?.status || error?.status
  
  // Backend'in döndürdüğü errorCode'u kontrol et
  const errorCode = response?.errorCode
  const backendMessage = response?.message
  const details = response?.details
  
  console.log('Error Code:', errorCode)
  console.log('Backend Message:', backendMessage)
  console.log('Details:', details)
  
  // ✅ DUPLICATE_ENTRY - Backend'den gelen mesajı kullan
  if (errorCode === 'DUPLICATE_ENTRY' || status === 409 || 
      backendMessage?.includes('zaten kullanılıyor') ||
      backendMessage?.includes('Duplicate')) {
    errorTitle.value = '❌ Mükerrer Kayıt'
    errorMessage.value = backendMessage || 'Bu branş kodu zaten kullanılıyor. Lütfen farklı bir kod deneyin.'
    
    // Field hatası ekle
    if (details?.field === 'branş kodu' || details?.field === 'code') {
      fieldErrors.value.code = `"${details.value}" zaten kullanımda`
    } else {
      fieldErrors.value.code = 'Bu kod zaten mevcut'
    }
    return
  }
  
  // ✅ FOREIGN_KEY_VIOLATION
  if (errorCode === 'FOREIGN_KEY_VIOLATION') {
    errorTitle.value = '⚠️ İlişki Hatası'
    errorMessage.value = backendMessage || 'Seçtiğiniz kayıt bulunamadı veya geçersiz.'
    return
  }
  
  // ✅ REFERENCED_RECORD
  if (errorCode === 'REFERENCED_RECORD') {
    errorTitle.value = '⚠️ Silme Hatası'
    errorMessage.value = backendMessage || 'Bu kayıt başka yerlerde kullanılıyor ve silinemez.'
    return
  }
  
  // ✅ VALIDATION_ERROR - 400 Bad Request
  if (errorCode === 'VALIDATION_ERROR' || status === 400) {
    errorTitle.value = '⚠️ Geçersiz Veri'
    
    if (Array.isArray(backendMessage)) {
      errorMessage.value = 'Lütfen aşağıdaki hataları düzeltin:'
      errorDetails.value = backendMessage
    } else if (Array.isArray(details)) {
      errorMessage.value = 'Lütfen aşağıdaki hataları düzeltin:'
      errorDetails.value = details
    } else {
      errorMessage.value = backendMessage || 'Girdiğiniz bilgilerde hatalar var. Lütfen kontrol edin.'
    }
    
    // Field-specific errors
    if (details && typeof details === 'object') {
      Object.keys(details).forEach(field => {
        fieldErrors.value[field] = details[field]
      })
    }
    return
  }
  
  // ✅ NOT_FOUND - 404
  if (status === 404) {
    errorTitle.value = '❌ Bulunamadı'
    errorMessage.value = backendMessage || 'Aradığınız kayıt bulunamadı.'
    return
  }
  
  // ✅ FORBIDDEN - 403
  if (status === 403) {
    errorTitle.value = '🔒 Yetki Hatası'
    errorMessage.value = backendMessage || 'Bu işlemi gerçekleştirmek için yetkiniz yok.'
    return
  }
  
  // ✅ UNAUTHORIZED - 401
  if (status === 401) {
    errorTitle.value = '🔒 Oturum Hatası'
    errorMessage.value = 'Oturumunuz sonlanmış. Lütfen tekrar giriş yapın.'
    return
  }
  
  // ✅ SERVER_ERROR - 500
  if (status === 500 || status >= 500) {
    errorTitle.value = '💥 Sunucu Hatası'
    errorMessage.value = backendMessage || 'Sunucuda bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
    
    if (details) {
      errorDetails.value = [`Hata Kodu: ${details.code || 'N/A'}`]
    }
    return
  }
  
  // ✅ NETWORK_ERROR - No connection
  if (!navigator.onLine) {
    errorTitle.value = '📡 Bağlantı Hatası'
    errorMessage.value = 'İnternet bağlantınızı kontrol edin.'
    return
  }
  
  // ✅ TIMEOUT
  if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
    errorTitle.value = '⏱️ Zaman Aşımı'
    errorMessage.value = 'İstek zaman aşımına uğradı. Lütfen tekrar deneyin.'
    return
  }
  
  // ✅ Generic fallback
  errorTitle.value = '❌ Hata Oluştu'
  errorMessage.value = backendMessage || 'İşlem sırasında bir hata oluştu. Lütfen tekrar deneyin.'
  
  if (details) {
    if (typeof details === 'string') {
      errorDetails.value = [details]
    } else if (typeof details === 'object') {
      errorDetails.value = [JSON.stringify(details, null, 2)]
    }
  }
}

const handleSubmit = async () => {
  clearError()
  
  // Validate translations
  const translations = Object.entries(translationMap.value)
    .filter(([_, name]) => name && name.trim())
    .map(([languageId, name]) => ({
      languageId: parseInt(languageId),
      name: name.trim()
    }))

  if (translations.length === 0) {
    errorTitle.value = 'Eksik Bilgi'
    errorMessage.value = 'En az bir dil için branş adı girmelisiniz.'
    return
  }

  // Check if default language is provided
  const defaultLanguage = languages.value.find(l => l.isDefault)
  if (defaultLanguage && !translationMap.value[defaultLanguage.id]?.trim()) {
    errorTitle.value = 'Eksik Bilgi'
    errorMessage.value = 'Varsayılan dil için branş adı zorunludur.'
    fieldErrors.value[`translation_${defaultLanguage.id}`] = 'Bu alan zorunludur'
    return
  }

  saving.value = true
  
  try {
    const data = {
      ...formData.value,
      translations
    }
    
    if (props.branch) {
      await updateBranch(props.branch.id, data)
      useToast().showSuccess('Branş başarıyla güncellendi')
    } else {
      await createBranch(data)
      useToast().showSuccess('Branş başarıyla eklendi')
    }
    
    emit('saved')
    emit('close')
  } catch (error) {
    handleApiError(error)
  } finally {
    saving.value = false
  }
}

// Watch for branch changes and load translations
watch(() => props.branch, async (newVal) => {
  clearError()
  
  if (newVal) {
    try {
      const fullBranch = await fetchBranch(newVal.id)
      formData.value = {
        code: fullBranch.code || '',
        description: fullBranch.description || '',
        hospitalIds: fullBranch.branch2Hospitals?.map(b2h => b2h.hospitalId) || []
      }
      
      translationMap.value = {}
      if (fullBranch.translations) {
        fullBranch.translations.forEach(t => {
          translationMap.value[t.languageId] = t.name
        })
      }
    } catch (error) {
      handleApiError(error)
    }
  } else {
    formData.value = {
      code: '',
      description: '',
      hospitalIds: []
    }
    translationMap.value = {}
  }
}, { immediate: true })

// Clear errors when modal closes
watch(() => props.show, (newVal) => {
  if (!newVal) {
    clearError()
  }
})
</script>