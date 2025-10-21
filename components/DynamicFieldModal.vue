<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>
      
      <div class="inline-block transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
        <form @submit.prevent="handleSubmit">
          <div class="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900 sm:mx-0 sm:h-10 sm:w-10">
                <CogIcon class="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
              </div>
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                  {{ isEditing ? 'Dinamik Alan Düzenle' : 'Yeni Dinamik Alan Ekle' }}
                </h3>
                <div class="mt-4 space-y-4">
                  <!-- Field Name -->
                  <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Alan Adı <span class="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      v-model="form.name"
                      type="text"
                      required
                      class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Örn: Şirket Türü, Bütçe, vs."
                    />
                    <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
                  </div>

                  <!-- Field Type -->
                  <div>
                    <label for="type" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Alan Tipi <span class="text-red-500">*</span>
                    </label>
                    <select
                      id="type"
                      v-model="form.type"
                      required
                      class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">Tip seçin</option>
                      <option value="text">Metin</option>
                      <option value="number">Sayı</option>
                      <option value="select">Seçim</option>
                      <option value="file">Dosya</option>
                      <option value="textarea">Uzun Metin</option>
                      <option value="date">Tarih</option>
                      <option value="email">E-posta</option>
                      <option value="phone">Telefon</option>
                      <option value="url">URL</option>
                    </select>
                    <p v-if="errors.type" class="mt-1 text-sm text-red-600">{{ errors.type }}</p>
                  </div>

                  <!-- Field Order -->
                  <div>
                    <label for="order" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Sıra <span class="text-red-500">*</span>
                    </label>
                    <input
                      id="order"
                      v-model.number="form.order"
                      type="number"
                      min="1"
                      required
                      class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="1"
                    />
                    <p v-if="errors.order" class="mt-1 text-sm text-red-600">{{ errors.order }}</p>
                  </div>

                  <!-- Is Required Checkbox -->
                  <div class="flex items-center col-span-2">
                    <input
                      id="is_required"
                      v-model="form.is_required"
                      type="checkbox"
                      class="h-4 w-4 text-indigo-600 focus:ring-indigo-600 border-gray-300 rounded"
                    />
                    <label for="is_required" class="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Zorunlu Alan
                    </label>
                  </div>

                  <!-- Options for Select Type -->
                  <div v-if="form.type === 'select'">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Seçenekler <span class="text-red-500">*</span>
                    </label>
                    <div class="mt-1 space-y-2">
                      <div v-for="(option, index) in selectOptions" :key="index" class="flex space-x-2">
                        <input
                          v-model="selectOptions[index]"
                          type="text"
                          class="flex-1 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="Seçenek değeri"
                        />
                        <button
                          type="button"
                          @click="removeOption(index)"
                          class="inline-flex items-center px-2 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <XMarkIcon class="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        type="button"
                        @click="addOption"
                        class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <PlusIcon class="-ml-0.5 mr-1.5 h-4 w-4" />
                        Seçenek Ekle
                      </button>
                    </div>
                    <p v-if="errors.options_data" class="mt-1 text-sm text-red-600">{{ errors.options_data }}</p>
                  </div>

                  <!-- Error/Success Messages -->
                  <div v-if="errorMessage" class="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
                    <div class="text-sm text-red-700 dark:text-red-300">{{ errorMessage }}</div>
                  </div>

                  <div v-if="successMessage" class="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
                    <div class="text-sm text-green-700 dark:text-green-300">{{ successMessage }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="submit"
              :disabled="loading"
              class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto"
            >
              <span v-if="loading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isEditing ? 'Güncelleniyor...' : 'Ekleniyor...' }}
              </span>
              <span v-else>{{ isEditing ? 'Güncelle' : 'Ekle' }}</span>
            </button>
            <button
              type="button"
              @click="$emit('close')"
              :disabled="loading"
              class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-600 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 disabled:opacity-50 sm:mt-0 sm:w-auto"
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
import { 
  CogIcon, 
  PlusIcon, 
  XMarkIcon 
} from '@heroicons/vue/24/outline'

const props = defineProps({
  show: Boolean,
  field: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'created', 'updated'])

const { 
  createDynamicField, 
  updateDynamicField,
  stringifyOptionsData,
  parseOptionsData
} = useCustomerDynamicFields()

// Computed
const isEditing = computed(() => !!props.field)

// Form data
const form = reactive({
  name: '',
  type: '',
  order: 1,
  is_required: false,
  options_data: ''
})

// Select options for select type
const selectOptions = ref([''])

// Form state
const loading = ref(false)
const errors = ref({})
const errorMessage = ref('')
const successMessage = ref('')

// Reset form
const resetForm = () => {
  form.name = ''
  form.type = ''
  form.order = 1
  form.is_required = false
  form.options_data = ''
  selectOptions.value = ['']
  errors.value = {}
  errorMessage.value = ''
  successMessage.value = ''
}

// Initialize form when field prop changes
watch(() => props.field, (newField) => {
  if (newField) {
    form.name = newField.name
    form.type = newField.type
    form.order = newField.order
    form.is_required = newField.is_required || false
    form.options_data = newField.options_data || ''

    if (newField.type === 'select' && newField.options_data) {
      selectOptions.value = parseOptionsData(newField.options_data)
    } else {
      selectOptions.value = ['']
    }
  } else {
    resetForm()
  }
}, { immediate: true })

// Add option for select
const addOption = () => {
  selectOptions.value.push('')
}

// Remove option for select
const removeOption = (index) => {
  selectOptions.value.splice(index, 1)
  if (selectOptions.value.length === 0) {
    selectOptions.value = ['']
  }
}

// Validate form
const validateForm = () => {
  errors.value = {}
  
  if (!form.name?.trim()) {
    errors.value.name = 'Alan adı gereklidir'
  }
  
  if (!form.type) {
    errors.value.type = 'Alan tipi gereklidir'
  }
  
  if (!form.order || form.order < 1) {
    errors.value.order = 'Geçerli bir sıra numarası giriniz'
  }
  
  if (form.type === 'select') {
    const validOptions = selectOptions.value.filter(opt => opt.trim())
    if (validOptions.length === 0) {
      errors.value.options_data = 'En az bir seçenek gereklidir'
    }
  }
  
  return Object.keys(errors.value).length === 0
}

// Handle form submission
const handleSubmit = async () => {
  if (!validateForm()) return
  
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    const fieldData = {
      name: form.name.trim(),
      type: form.type,
      order: form.order,
      is_required: form.is_required
    }

    // Add options data for select type
    if (form.type === 'select') {
      const validOptions = selectOptions.value.filter(opt => opt.trim())
      fieldData.options_data = stringifyOptionsData(validOptions)
    }
    
    let response
    if (isEditing.value) {
      response = await updateDynamicField(props.field.id, fieldData)
      successMessage.value = 'Dinamik alan başarıyla güncellendi!'
      emit('updated', response)
    } else {
      response = await createDynamicField(fieldData)
      successMessage.value = 'Dinamik alan başarıyla oluşturuldu!'
      emit('created', response)
    }
    
    // Reset form
    resetForm()
    
    // Close modal after short delay
    setTimeout(() => {
      emit('close')
      successMessage.value = ''
    }, 1500)
    
  } catch (error) {
    console.error('Error saving dynamic field:', error)
    errorMessage.value = 'Dinamik alan kaydedilirken bir hata oluştu'
  } finally {
    loading.value = false
  }
}

// Reset form when modal closes
watch(() => props.show, (newValue) => {
  if (!newValue) {
    resetForm()
  }
})
</script>

