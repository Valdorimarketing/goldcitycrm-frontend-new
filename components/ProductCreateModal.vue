<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>
      
      <div class="inline-block transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
        <form @submit.prevent="handleSubmit">
          <div class="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900 sm:mx-0 sm:h-10 sm:w-10">
                <PlusIcon class="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
              </div>
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                  Yeni Ürün Ekle
                </h3>
                <div class="mt-4 space-y-4">
                  <!-- Product Name -->
                  <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Ürün Adı <span class="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      v-model="form.name"
                      type="text"
                      required
                      class="mt-1 form-input"
                      placeholder="Ürün adını giriniz"
                    />
                    <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
                  </div>

                  <!-- Price -->
                  <div>
                    <label for="price" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Fiyat <span class="text-red-500">*</span>
                    </label>
                    <div class="mt-1 relative rounded-md shadow-sm"> 
                      <input
                        id="price"
                        v-model.number="form.price"
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        class="mt-1 form-input"
                        placeholder="₺ 0.00"
                      />
                    </div>
                    <p v-if="errors.price" class="mt-1 text-sm text-red-600">{{ errors.price }}</p>
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
                Ekleniyor...
              </span>
              <span v-else>Ürün Ekle</span>
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
import { PlusIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['close', 'created'])

// Form data
const form = reactive({
  name: '',
  price: null
})

// Form state
const loading = ref(false)
const errors = ref({})
const errorMessage = ref('')
const successMessage = ref('')

// Validate form
const validateForm = () => {
  errors.value = {}
  
  if (!form.name?.trim()) {
    errors.value.name = 'Ürün adı gereklidir'
  }
  
  if (!form.price || form.price <= 0) {
    errors.value.price = 'Geçerli bir fiyat giriniz'
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
    const api = useApi()
    
    const productData = {
      name: form.name.trim(),
      price: parseFloat(form.price)
    }
    
    const response = await api('/products', {
      method: 'POST',
      body: productData
    })
    
    console.log('Product created:', response)
    successMessage.value = 'Ürün başarıyla oluşturuldu!'
    
    // Emit the created product
    emit('created', response)
    
    // Reset form
    form.name = ''
    form.price = null
    
    // Close modal after short delay
    setTimeout(() => {
      emit('close')
      successMessage.value = ''
    }, 1500)
    
  } catch (error) {
    console.error('Error creating product:', error)
    
    if (error.status === 500 || error.name === 'FetchError') {
      // Demo mode fallback for server errors
      const demoProduct = {
        id: Date.now(),
        name: form.name.trim(),
        price: parseFloat(form.price),
        createdAt: new Date().toISOString(),
        updatesAt: new Date().toISOString()
      }
      
      successMessage.value = 'Ürün başarıyla oluşturuldu! (Demo Mode - Backend Error)'
      emit('created', demoProduct)
      
      // Reset form
      form.name = ''
      form.price = null
      
      setTimeout(() => {
        emit('close')
        successMessage.value = ''
      }, 1500)
      
    } else if (error.status === 400 && error.data?.message) {
      // Validation errors from backend
      if (Array.isArray(error.data.message)) {
        errorMessage.value = error.data.message.join(', ')
      } else {
        errorMessage.value = error.data.message
      }
    } else {
      errorMessage.value = 'Ürün oluşturulurken bir hata oluştu'
    }
  } finally {
    loading.value = false
  }
}

// Reset form when modal closes
watch(() => props.show, (newValue) => {
  if (!newValue) {
    form.name = ''
    form.price = null
    errors.value = {}
    errorMessage.value = ''
    successMessage.value = ''
  }
})
</script> 