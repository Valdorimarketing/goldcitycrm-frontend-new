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
                        class="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>
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
                          class="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>
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

const formData = ref({
  code: '',
  description: '',
  hospitalIds: []
})

const translationMap = ref({})

const handleSubmit = async () => {
  saving.value = true
  try {
    const translations = Object.entries(translationMap.value)
      .filter(([_, name]) => name && name.trim())
      .map(([languageId, name]) => ({
        languageId: parseInt(languageId),
        name: name.trim()
      }))

    if (translations.length === 0) {
      useToast().showError('En az bir dil için branş adı girmelisiniz')
      saving.value = false
      return
    }

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
    useToast().showError('İşlem sırasında bir hata oluştu')
  } finally {
    saving.value = false
  }
}

// Watch for branch changes and load translations
watch(() => props.branch, async (newVal) => {
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
      console.error('Error loading branch:', error)
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

 
</script>