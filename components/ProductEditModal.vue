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
              <input
                id="edit-price"
                v-model.number="form.price"
                type="number"
                step="0.01"
                min="0"
                required
                class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-all hover:border-orange-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                placeholder="0"
              /> 
            </div>
            <p v-if="errors.price" class="flex items-center space-x-1 text-sm text-red-600">
              <ExclamationCircleIcon class="h-4 w-4" />
              <span>{{ errors.price }}</span>
            </p>
          </div> 


          <!-- Currency Select Bölümü: Price altına ekleyelim -->
            <div class="space-y-3">
              <div class="flex items-center space-x-2">
                <CurrencyDollarIcon class="h-5 w-5 text-orange-600" />
                <label for="edit-currency" class="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Para Birimi <span class="text-red-500">*</span>
                </label>
              </div>
              <div class="relative">
                <select
                  id="edit-currency"
                  v-model="form.currencyId"
                  required
                  class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-all hover:border-orange-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                >
                  <option value="" disabled>Seçiniz</option>
                  <option v-for="c in currencies" :key="c.id" :value="c.id">
                    {{ c.code }} - {{ c.name }}
                  </option>
                </select>
              </div>
              <p v-if="errors.currencyId" class="flex items-center space-x-1 text-sm text-red-600">
                <ExclamationCircleIcon class="h-4 w-4" />
                <span>{{ errors.currencyId }}</span>
              </p>
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
const currencies = ref([])

// Form data
const form = reactive({
  name: '',
  price: null, 
  currencyId: null,
})

// Form state
const loading = ref(false)
const errors = ref({})
const errorMessage = ref('')
const successMessage = ref('')


// Modal mount olduğunda currency listesini çek
onMounted(async () => {
  try {
    const api = useApi()
    const res = await api('/currencies')
    currencies.value = res || []
  } catch (err) {
    console.error('Currency listesi çekilemedi', err)
  }
})

// Ürün değiştiğinde formu doldur
watch(() => props.product, (newProduct) => {
  if (newProduct) {
    form.name = newProduct.name || ''
    form.price = newProduct.price || null
    form.currencyId = newProduct.currency?.id || null
  }
}, { immediate: true })


 

// Validate form
const validateForm = () => {
  errors.value = {}

  if (!form.name?.trim()) errors.value.name = 'Ürün adı gereklidir'
  if (!form.price || form.price <= 0) errors.value.price = 'Geçerli bir fiyat giriniz'
  if (!form.currencyId) errors.value.currencyId = 'Para birimi seçilmelidir'

  return Object.keys(errors.value).length === 0
}

// Submit
const handleSubmit = async () => {
  if (!validateForm() || !props.product || !hasChanges.value) return

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const api = useApi()
    const updateData = {}
    if (form.name.trim() !== props.product.name) updateData.name = form.name.trim()
    if (form.price !== props.product.price) updateData.price = parseFloat(form.price)
    if (form.currencyId !== props.product.currency?.id) updateData.currencyId = form.currencyId

    const response = await api(`/products/${props.product.id}`, {
      method: 'PATCH',
      body: updateData,
    })

    successMessage.value = 'Ürün başarıyla güncellendi!'
    emit('updated', { ...props.product, ...updateData })

    setTimeout(() => {
      emit('close')
      successMessage.value = ''
    }, 1500)
  } catch (error) {
    console.error('Error updating product:', error)
    errorMessage.value = 'Ürün güncellenirken bir hata oluştu'
  } finally {
    loading.value = false
  }
}


// Computed: değişiklik var mı
const hasChanges = computed(() => {
  if (!props.product) return false
  return (
    form.name !== props.product.name ||
    form.price !== props.product.price ||
    form.currencyId !== props.product.currency?.id
  )
})


</script>

<style scoped>
.bg-grid-white\/10 {
  background-image: url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%23ffffff' fill-opacity='0.1'%3e%3cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e");
}
</style>