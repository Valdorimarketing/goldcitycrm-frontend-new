<template>
  <Teleport to="body">
    <Transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100"
      leave-active-class="duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/80 backdrop-blur-sm transition-opacity"
          @click="$emit('close')"></div>

        <!-- Modal -->
        <div class="flex min-h-screen items-center justify-center p-4">
          <Transition enter-active-class="duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100" leave-active-class="duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <div v-if="show"
              class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl transition-all sm:w-full sm:max-w-4xl">
              <!-- Header -->
              <div class="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                      <ShoppingBagIcon class="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-white">Satışa Çevir</h3>
                      <p class="text-sm text-green-100">{{ customer?.name }} {{ customer?.surname }} - Hizmet Seçimi</p>
                    </div>
                  </div>
                  <button @click="$emit('close')" class="rounded-lg p-2 hover:bg-white/20 transition-colors">
                    <XMarkIcon class="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>

              <!-- Content -->
              <div class="max-h-[60vh] overflow-y-auto p-6">
                <!-- Loading State -->
                <div v-if="loading" class="flex justify-center py-8">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>

                <!-- Products List -->
                <div v-else-if="products.length > 0">
                  <!-- Info Banner -->
                  <div class="mb-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4">
                    <div class="flex">
                      <InformationCircleIcon class="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div class="ml-3">
                        <p class="text-sm text-blue-700 dark:text-blue-300">
                          Aşağıdaki hizmetlerden satışa çevirmek istediklerinizi seçin. Seçtiğiniz hizmetler için
                          otomatik olarak satış kaydı oluşturulacak.
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Select All -->
                  <div class="mb-4 flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <label class="flex items-center cursor-pointer">
                      <input v-model="selectAll" type="checkbox"
                        class="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600"
                        @change="toggleSelectAll" />
                      <span class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tümünü Seç
                      </span>
                    </label>
                    <span class="text-sm text-gray-500 dark:text-gray-400">
                      {{ selectedProductIds.length }} / {{ products.length }} seçili
                    </span>
                  </div>

                  <!-- Products -->
                  <div class="space-y-3">
                    <div v-for="product in products" :key="product.id"
                      class="group relative bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:shadow-md transition-all border-2"
                      :class="selectedProductIds.includes(product.id) ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-transparent'">
                      <label class="flex items-start cursor-pointer">
                        <input v-model="selectedProductIds" type="checkbox" :value="product.id"
                          class="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-600 mt-1 flex-shrink-0" />
                        <div class="ml-3 flex-1">
                          <div class="flex items-start justify-between">
                            <div>
                              <h4 class="text-sm font-semibold text-gray-900 dark:text-white">
                                {{ product.product.name }}
                              </h4>
                              <p v-if="product.product.description"
                                class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {{ product.product.description }}
                              </p>
                            </div>
                          </div>

                          <!-- Price Info -->
                          <div class="mt-3 grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span class="text-gray-500 dark:text-gray-400">Fiyat:</span>
                              <span class="ml-1 font-medium text-gray-900 dark:text-white">
                                {{ formatCurrency(product.price, product.product.currency.code) }}
                              </span>
                            </div>
                            <div v-if="product.discount > 0">
                              <span class="text-gray-500 dark:text-gray-400">İndirim:</span>
                              <span class="ml-1 font-medium text-red-600 dark:text-red-400">
                                {{ formatCurrency(product.discount, product.product.currency.code) }}
                              </span>
                            </div>
                            <div>
                              <span class="text-gray-500 dark:text-gray-400">Teklif:</span>
                              <span class="ml-1 font-semibold text-green-600 dark:text-green-400">
                                {{ formatCurrency(product.offer, product.product.currency.code) }}
                              </span>
                            </div>
                          </div>

                          <!-- Note -->
                          <div v-if="product.note" class="mt-2 text-xs text-gray-600 dark:text-gray-300 italic">
                            Not: {{ product.note }}
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  <!-- Total Amount -->
                  <div v-if="selectedProductIds.length > 0 && currentCurrency"
                    class="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-200 dark:border-green-800">
                    <div class="flex items-center justify-between">
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Toplam Tutar ({{ selectedProductIds.length }} ürün):
                      </span>
                      <span class="text-lg font-bold text-green-600 dark:text-green-400">
                        {{ formatCurrency(totalAmount, currentCurrency) }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Empty State -->
                <div v-else class="text-center py-12">
                  <ShoppingBagIcon class="mx-auto h-12 w-12 text-gray-400" />
                  <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Satılmamış Hizmet Bulunamadı</h3>
                  <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Bu müşteri için satışa çevrilebilecek hizmet bulunmuyor.
                  </p>
                </div>
              </div>

              <!-- Footer -->
              <div class="border-t dark:border-gray-700 px-6 py-4">
                <div class="flex justify-between items-center">
                  <button @click="$emit('close')"
                    class="inline-flex items-center rounded-lg bg-gray-100 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    İptal
                  </button>
                  <button @click="handleConvertToSale" :disabled="selectedProductIds.length === 0 || converting"
                    class="inline-flex items-center rounded-lg bg-green-600 px-6 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    <CheckCircleIcon class="mr-2 h-5 w-5" />
                    {{ converting ? 'İşleniyor...' : `Seçili Ürünleri Satışa Çevir (${selectedProductIds.length})` }}
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import {
  XMarkIcon,
  ShoppingBagIcon,
  InformationCircleIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'
import { useCustomer2Product } from '~/composables/useCustomer2Product'

const props = defineProps({
  show: Boolean,
  customer: Object,
  targetStatus: Number
})

const emit = defineEmits(['close', 'converted'])

// Composables
const { fetchUnsoldProducts, convertToSale } = useCustomer2Product()
const authStore = useAuthStore()
const { showSuccess, showError } = useToast()

// State
const loading = ref(false)
const converting = ref(false)
const products = ref([])
const selectedProductIds = ref([])
const selectAll = ref(false)
const currentCurrency = ref(null)

// Computed
const totalAmount = computed(() => {
  return products.value
    .filter(p => selectedProductIds.value.includes(p.id))
    .reduce((sum, p) => sum + p.offer, 0)
})

// Methods
const formatCurrency = (amount, currency) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: currency || 'TRY',
  }).format(amount)
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedProductIds.value = products.value.map(p => p.id)
  } else {
    selectedProductIds.value = []
  }
}

const loadProducts = async () => {
  if (!props.customer?.id) return

  loading.value = true
  try {
    const data = await fetchUnsoldProducts(props.customer.id)
    products.value = data || [] 

    currentCurrency.value = products.value[0].product.currency.code



    // Auto-select all products by default
    selectedProductIds.value = products.value.map(p => p.id)
    selectAll.value = true
  } catch (error) {
    console.error('Error loading unsold products:', error)
    showError('Hizmetler yüklenirken hata oluştu')
  } finally {
    loading.value = false
  }
}

const handleConvertToSale = async () => {
  if (selectedProductIds.value.length === 0 || !props.customer?.id) return

  converting.value = true
  try {
    // Get selected product names for title
    const selectedProducts = products.value.filter(p =>
      selectedProductIds.value.includes(p.id)
    )
    const productNames = selectedProducts.map(p => p.product.name).join(', ')

    const saleData = {
      customerId: props.customer.id,
      customer2ProductIds: selectedProductIds.value,
      userId: authStore.user?.id,
      title: `Satış - ${productNames}`,
      description: `${props.customer.name} ${props.customer.surname} için ${selectedProducts.length} ürün satışa çevrildi`
    }

    const result = await convertToSale(saleData)

    showSuccess('Satış girişi yapıldı')
    emit('converted', result)
  } catch (error) {
    console.error('Error converting to sale:', error)
    const errorMessage = error?.data?.message || 'Satışa çevirme işlemi başarısız oldu'
    showError(errorMessage)
  } finally {
    converting.value = false
  }
}

// Watch for modal open
watch(() => props.show, (newValue) => {
  if (newValue) {
    loadProducts()
  } else {
    // Reset state
    products.value = []
    selectedProductIds.value = []
    selectAll.value = false
  }
})

// Watch selected items to update selectAll checkbox
watch(() => selectedProductIds.value.length, (newLength) => {
  selectAll.value = newLength === products.value.length && newLength > 0

})
</script>
