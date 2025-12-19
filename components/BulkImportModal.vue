<template>
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
        v-if="show" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="$emit('close')"
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
            v-if="show"
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            <!-- Modal Header -->
            <div class="relative overflow-hidden flex-shrink-0">
              <div class="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600"></div>
              <div class="relative px-6 py-5">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <div class="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <ArrowUpTrayIcon class="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 class="text-xl font-bold text-white">Toplu Çeviri İçe Aktar</h2>
                      <p class="text-sm text-white/70">JSON formatında çevirileri yükleyin</p>
                    </div>
                  </div>
                  <button 
                    @click="$emit('close')"
                    class="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
                  >
                    <XMarkIcon class="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Modal Content -->
            <div class="flex-1 overflow-y-auto p-6">
              <!-- Instructions -->
              <div class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                <h3 class="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
                  📋 JSON Formatı
                </h3>
                <p class="text-sm text-blue-700 dark:text-blue-300 mb-3">
                  Aşağıdaki formata uygun JSON verisi girin:
                </p>
                <pre class="text-xs bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg overflow-x-auto text-blue-900 dark:text-blue-200"><code>[
  {
    "keyName": "example.key",
    "description": "Açıklama",
    "translations": {
      "tr": "Türkçe çeviri",
      "en": "English translation"
    }
  }
]</code></pre>
              </div>

              <!-- JSON Input -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  JSON Verisi
                </label>
                <textarea
                  v-model="jsonInput"
                  rows="12"
                  class="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-mono focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                  placeholder='[{"keyName": "example.key", "description": "Açıklama", "translations": {"tr": "Merhaba", "en": "Hello"}}]'
                ></textarea>
              </div>

              <!-- Validation Error -->
              <div v-if="validationError" class="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <div class="flex items-start gap-3">
                  <ExclamationTriangleIcon class="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 class="text-sm font-semibold text-red-900 dark:text-red-200 mb-1">
                      Geçersiz JSON
                    </h4>
                    <p class="text-sm text-red-700 dark:text-red-300">
                      {{ validationError }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Preview -->
              <div v-if="parsedData && !validationError" class="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                <h4 class="text-sm font-semibold text-green-900 dark:text-green-200 mb-2">
                  ✅ Önizleme
                </h4>
                <p class="text-sm text-green-700 dark:text-green-300">
                  <strong>{{ parsedData.length }}</strong> çeviri anahtarı içe aktarılacak
                </p>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="flex-shrink-0 px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-end gap-3">
                <button
                  @click="$emit('close')"
                  :disabled="importing"
                  class="px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all disabled:opacity-50"
                >
                  İptal
                </button>
                <button
                  @click="handleImport"
                  :disabled="!parsedData || validationError || importing"
                  class="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ArrowUpTrayIcon v-if="!importing" class="h-4 w-4" />
                  <div v-else class="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  {{ importing ? 'İçe Aktarılıyor...' : 'İçe Aktar' }}
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { XMarkIcon, ArrowUpTrayIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { languageApi } from '~/services/languageApi'

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['close', 'imported'])

const { showSuccess, showError } = useToast()

// State
const jsonInput = ref('')
const validationError = ref('')
const parsedData = ref(null)
const importing = ref(false)

// Validate JSON
const validateJson = () => {
  validationError.value = ''
  parsedData.value = null

  if (!jsonInput.value.trim()) {
    return
  }

  try {
    const data = JSON.parse(jsonInput.value)

    // Check if it's an array
    if (!Array.isArray(data)) {
      validationError.value = 'JSON verisi bir array olmalıdır'
      return
    }

    // Validate each item
    for (let i = 0; i < data.length; i++) {
      const item = data[i]

      if (!item.keyName) {
        validationError.value = `${i + 1}. öğede 'keyName' eksik`
        return
      }

      if (!item.translations || typeof item.translations !== 'object') {
        validationError.value = `${i + 1}. öğede 'translations' eksik veya geçersiz`
        return
      }
    }

    parsedData.value = data
  } catch (error) {
    validationError.value = `JSON parse hatası: ${error.message}`
  }
}

// Handle import
const handleImport = async () => {
  if (!parsedData.value) return

  importing.value = true
  try {
    // ✅ Wrap array in { items: [...] } format
    const result = await languageApi.bulkCreateTranslations({
      items: parsedData.value
    })

    console.log('Bulk import result:', result)

    showSuccess(`${parsedData.value.length} çeviri başarıyla içe aktarıldı`)
    emit('imported')
    emit('close')

    // Reset form
    jsonInput.value = ''
    parsedData.value = null
    validationError.value = ''
  } catch (error) {
    console.error('Bulk import failed:', error)
    showError(error.message || 'Çeviriler içe aktarılırken bir hata oluştu')
  } finally {
    importing.value = false
  }
}

// Watch JSON input
watch(jsonInput, () => {
  validateJson()
})

// Reset on close
watch(() => props.show, (newVal) => {
  if (!newVal) {
    jsonInput.value = ''
    parsedData.value = null
    validationError.value = ''
  }
})
</script>