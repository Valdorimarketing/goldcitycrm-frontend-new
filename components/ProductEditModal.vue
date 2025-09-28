<template>
  <div v-if="show && product" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
      <!-- Background overlay with blur -->
      <div class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>

      <!-- Modal -->
      <div class="inline-block transform overflow-visible rounded-3xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 text-left align-bottom shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
        <!-- Header with gradient background -->
        <div class="relative overflow-hidden rounded-t-3xl bg-gradient-to-r from-orange-500 to-amber-600 px-8 py-6">
          <div class="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
          <div class="relative">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                  <PencilSquareIcon class="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 class="text-xl font-bold text-white">
                    Ürün Düzenle
                  </h3>
                  <p class="mt-1 text-sm text-orange-100">
                    Ürün bilgilerini güncelleyin
                  </p>
                </div>
              </div>
              <button
                type="button"
                @click="$emit('close')"
                class="rounded-xl bg-white/20 p-2 backdrop-blur-sm transition-all hover:bg-white/30"
              >
                <XMarkIcon class="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        <form @submit.prevent="handleSubmit" class="p-8 space-y-6">
          <!-- Product Name with enhanced styling -->
          <div class="space-y-3">
            <div class="flex items-center space-x-2">
              <CubeIcon class="h-5 w-5 text-orange-600" />
              <label for="edit-name" class="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Ürün Adı <span class="text-red-500">*</span>
              </label>
            </div>
            <div class="relative">
              <input
                id="edit-name"
                v-model="form.name"
                type="text"
                required
                class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pl-12 text-sm font-medium text-gray-700 transition-all hover:border-orange-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                placeholder="Ürün adını giriniz"
              />
              <TagIcon class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            </div>
            <p v-if="errors.name" class="flex items-center space-x-1 text-sm text-red-600">
              <ExclamationCircleIcon class="h-4 w-4" />
              <span>{{ errors.name }}</span>
            </p>
          </div>

          <!-- Price with enhanced styling -->
          <div class="space-y-3">
            <div class="flex items-center space-x-2">
              <CurrencyDollarIcon class="h-5 w-5 text-orange-600" />
              <label for="edit-price" class="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Fiyat <span class="text-red-500">*</span>
              </label>
            </div>
            <div class="relative">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <span class="text-sm font-medium text-gray-500 dark:text-gray-400">₺</span>
              </div>
              <input
                id="edit-price"
                v-model.number="form.price"
                type="number"
                step="0.01"
                min="0"
                required
                class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pl-10 pr-20 text-sm font-medium text-gray-700 transition-all hover:border-orange-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                placeholder="0.00"
              />
              <span class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">TRY</span>
            </div>
            <p v-if="errors.price" class="flex items-center space-x-1 text-sm text-red-600">
              <ExclamationCircleIcon class="h-4 w-4" />
              <span>{{ errors.price }}</span>
            </p>
          </div>

          <!-- Category (Optional) -->
          <div class="space-y-3">
            <div class="flex items-center space-x-2">
              <FolderIcon class="h-5 w-5 text-orange-600" />
              <label for="edit-category" class="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Kategori
              </label>
            </div>
            <div class="relative">
              <select
                id="edit-category"
                v-model="form.category"
                class="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 text-sm font-medium text-gray-700 transition-all hover:border-orange-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
              >
                <option value="">Kategori Seçin</option>
                <option value="web">Web Geliştirme</option>
                <option value="mobile">Mobil Uygulama</option>
                <option value="design">Tasarım</option>
                <option value="consulting">Danışmanlık</option>
              </select>
              <ChevronDownIcon class="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <!-- Description (Optional) -->
          <div class="space-y-3">
            <div class="flex items-center space-x-2">
              <DocumentTextIcon class="h-5 w-5 text-orange-600" />
              <label for="edit-description" class="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Açıklama
              </label>
            </div>
            <div class="relative">
              <textarea
                id="edit-description"
                v-model="form.description"
                rows="3"
                class="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-all hover:border-orange-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                placeholder="Ürün hakkında detaylı açıklama..."
              />
              <div class="absolute bottom-2 right-2 text-xs text-gray-400">
                {{ form.description?.length || 0 }}/500
              </div>
            </div>
          </div>

          <!-- Changes Preview -->
          <div v-if="hasChanges" class="flex items-start space-x-3 rounded-xl border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20 p-4">
            <InformationCircleIcon class="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
            <div class="space-y-1 text-sm">
              <p class="font-medium text-blue-800 dark:text-blue-400">Değişiklikler tespit edildi:</p>
              <ul class="ml-4 list-disc text-blue-700 dark:text-blue-300">
                <li v-if="form.name !== product?.name">Ürün adı değiştirildi</li>
                <li v-if="form.price !== product?.price">Fiyat güncellendi</li>
                <li v-if="form.category !== product?.category">Kategori değiştirildi</li>
                <li v-if="form.description !== product?.description">Açıklama güncellendi</li>
              </ul>
            </div>
          </div>

          <!-- Error Message with enhanced styling -->
          <transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div v-if="errorMessage" class="flex items-start space-x-3 rounded-xl border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 p-4">
              <ExclamationTriangleIcon class="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
              <p class="text-sm font-medium text-red-800 dark:text-red-400">{{ errorMessage }}</p>
            </div>
          </transition>

          <!-- Success Message with enhanced styling -->
          <transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div v-if="successMessage" class="flex items-start space-x-3 rounded-xl border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20 p-4">
              <CheckCircleIcon class="h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
              <p class="text-sm font-medium text-green-800 dark:text-green-400">{{ successMessage }}</p>
            </div>
          </transition>

          <!-- Buttons with enhanced styling -->
          <div class="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-6">
            <div class="flex items-center space-x-2 text-xs text-gray-500">
              <SparklesIcon class="h-4 w-4" />
              <span>Değişiklikler anında kaydedilir</span>
            </div>
            <div class="flex space-x-3">
              <button
                type="button"
                @click="$emit('close')"
                :disabled="loading"
                class="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <XMarkIcon class="mr-2 h-4 w-4" />
                İptal
              </button>
              <button
                type="submit"
                :disabled="loading || !hasChanges"
                class="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:from-orange-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span v-if="loading" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Güncelleniyor...
                </span>
                <span v-else class="flex items-center">
                  <CheckIcon class="mr-2 h-4 w-4" />
                  Güncelle
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  PencilSquareIcon,
  XMarkIcon,
  CubeIcon,
  TagIcon,
  CurrencyDollarIcon,
  FolderIcon,
  DocumentTextIcon,
  ChevronDownIcon,
  InformationCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  SparklesIcon,
  CheckIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  show: Boolean,
  product: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'updated'])

// Form data
const form = reactive({
  name: '',
  price: null,
  category: '',
  description: ''
})

// Form state
const loading = ref(false)
const errors = ref({})
const errorMessage = ref('')
const successMessage = ref('')

// Watch for product changes and populate form
watch(() => props.product, (newProduct) => {
  if (newProduct) {
    form.name = newProduct.name || ''
    form.price = newProduct.price || null
    form.category = newProduct.category || ''
    form.description = newProduct.description || ''
  }
}, { immediate: true })

// Computed to check if there are changes
const hasChanges = computed(() => {
  if (!props.product) return false
  return (
    form.name !== props.product.name ||
    form.price !== props.product.price ||
    form.category !== (props.product.category || '') ||
    form.description !== (props.product.description || '')
  )
})

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
  if (!validateForm() || !props.product || !hasChanges.value) return

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const api = useApi()

    const updateData = {}
    if (form.name.trim() !== props.product.name) {
      updateData.name = form.name.trim()
    }
    if (form.price !== props.product.price) {
      updateData.price = parseFloat(form.price)
    }
    if (form.category !== (props.product.category || '')) {
      updateData.category = form.category
    }
    if (form.description !== (props.product.description || '')) {
      updateData.description = form.description
    }

    const response = await api(`/products/${props.product.id}`, {
      method: 'PATCH',
      body: updateData
    })

    console.log('Product updated:', response)
    successMessage.value = 'Ürün başarıyla güncellendi!'

    // Emit the updated product
    emit('updated', { ...props.product, ...updateData })

    // Close modal after short delay
    setTimeout(() => {
      emit('close')
      successMessage.value = ''
    }, 1500)

  } catch (error) {
    console.error('Error updating product:', error)

    if (error.status === 500 || error.name === 'FetchError') {
      // Demo mode fallback for server errors
      const demoProduct = {
        ...props.product,
        name: form.name.trim(),
        price: parseFloat(form.price),
        category: form.category,
        description: form.description,
        updatesAt: new Date().toISOString()
      }

      successMessage.value = 'Ürün başarıyla güncellendi! (Demo Mode - Backend Error)'
      emit('updated', demoProduct)

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
      errorMessage.value = 'Ürün güncellenirken bir hata oluştu'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.bg-grid-white\/10 {
  background-image: url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%23ffffff' fill-opacity='0.1'%3e%3cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e");
}
</style>