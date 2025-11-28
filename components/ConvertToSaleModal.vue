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
                            <!-- Ödeme Durumu Badge -->
                            <div class="flex-shrink-0 ml-2">
                              <span v-if="product.isPayCompleted"
                                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                <CheckCircleIcon class="w-3.5 h-3.5 mr-1" />
                                Ödendi
                              </span>
                              <span v-else-if="product.paidAmount > 0"
                                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                <ClockIcon class="w-3.5 h-3.5 mr-1" />
                                Kısmi Ödeme
                              </span>
                              <span v-else
                                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                <XCircleIcon class="w-3.5 h-3.5 mr-1" />
                                Ödenmedi
                              </span>
                            </div>
                          </div>

                          <!-- Price Info -->
                          <div class="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                            <div class="bg-white dark:bg-gray-800 rounded p-2">
                              <span class="block text-xs text-gray-500 dark:text-gray-400">Fiyat</span>
                              <span class="font-medium text-gray-900 dark:text-white">
                                {{ formatCurrency(product.price, product.product.currency?.code) }}
                              </span>
                            </div>
                            <div class="bg-white dark:bg-gray-800 rounded p-2">
                              <span class="block text-xs text-gray-500 dark:text-gray-400">Teklif</span>
                              <span class="font-semibold text-blue-600 dark:text-blue-400">
                                {{ formatCurrency(product.offer, product.product.currency?.code) }}
                              </span>
                            </div>
                            <div class="bg-white dark:bg-gray-800 rounded p-2">
                              <span class="block text-xs text-gray-500 dark:text-gray-400">Alınan Tutar</span>
                              <span class="font-semibold text-green-600 dark:text-green-400">
                                {{ formatCurrency(product.paidAmount || 0, product.product.currency?.code) }}
                              </span>
                            </div>
                            <div class="bg-white dark:bg-gray-800 rounded p-2">
                              <span class="block text-xs text-gray-500 dark:text-gray-400">Kalan Para</span>
                              <span class="font-semibold" :class="getRemainingAmount(product) > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'">
                                {{ formatCurrency(getRemainingAmount(product), product.product.currency?.code) }}
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

                  <!-- Summary Section -->
                  <div v-if="selectedProductIds.length > 0 && currentCurrency"
                    class="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border-2 border-green-200 dark:border-green-800">
                    <h5 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      Seçili Ürünler Özeti ({{ selectedProductIds.length }} ürün)
                    </h5>
                    <div class="space-y-2">
                      <div class="flex items-center justify-between text-sm">
                        <span class="text-gray-600 dark:text-gray-400">Toplam Teklif:</span>
                        <span class="font-medium text-gray-900 dark:text-white">
                          {{ formatCurrency(totalOffer, currentCurrency) }}
                        </span>
                      </div>
                      <div class="flex items-center justify-between text-sm">
                        <span class="text-gray-600 dark:text-gray-400">Toplam Alınan:</span>
                        <span class="font-semibold text-green-600 dark:text-green-400">
                          {{ formatCurrency(totalPaid, currentCurrency) }}
                        </span>
                      </div>
                      <div class="flex items-center justify-between text-sm pt-2 border-t border-green-200 dark:border-green-700">
                        <span class="font-medium text-gray-700 dark:text-gray-300">Toplam Kalan:</span>
                        <span class="text-lg font-bold" :class="totalRemaining > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'">
                          {{ formatCurrency(totalRemaining, currentCurrency) }}
                        </span>
                      </div>
                    </div>
                    
                    <!-- Ödeme Durumu Özeti -->
                    <div class="mt-3 pt-3 border-t border-green-200 dark:border-green-700">
                      <div class="flex flex-wrap gap-2">
                        <span v-if="paymentSummary.completed > 0" class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200">
                          <CheckCircleIcon class="w-3 h-3 mr-1" />
                          {{ paymentSummary.completed }} Ödendi
                        </span>
                        <span v-if="paymentSummary.partial > 0" class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200">
                          <ClockIcon class="w-3 h-3 mr-1" />
                          {{ paymentSummary.partial }} Kısmi Ödeme
                        </span>
                        <span v-if="paymentSummary.unpaid > 0" class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200">
                          <XCircleIcon class="w-3 h-3 mr-1" />
                          {{ paymentSummary.unpaid }} Ödenmedi
                        </span>
                      </div>
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
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon
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

// Computed - Seçili ürünlerin toplamları
const selectedProducts = computed(() => {
  return products.value.filter(p => selectedProductIds.value.includes(p.id))
})

const totalOffer = computed(() => {
  return selectedProducts.value.reduce((sum, p) => {
    const offer = parseFloat(p.offer) || 0
    return sum + offer
  }, 0)
})

const totalPaid = computed(() => {
  return selectedProducts.value.reduce((sum, p) => {
    const paidAmount = parseFloat(p.paidAmount) || 0
    return sum + paidAmount
  }, 0)
})

const totalRemaining = computed(() => {
  return totalOffer.value - totalPaid.value
})

// Ödeme durumu özeti
const paymentSummary = computed(() => {
  const selected = selectedProducts.value
  return {
    completed: selected.filter(p => p.isPayCompleted).length,
    partial: selected.filter(p => !p.isPayCompleted && (p.paidAmount || 0) > 0).length,
    unpaid: selected.filter(p => !p.isPayCompleted && (p.paidAmount || 0) === 0).length
  }
})

// Methods
const formatCurrency = (amount, currency) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: currency || 'TRY',
  }).format(amount || 0)
}

const getRemainingAmount = (product) => {
  const offer = parseFloat(product.offer) || 0
  const paidAmount = parseFloat(product.paidAmount) || 0
  return Math.max(0, offer - paidAmount)
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

    if (products.value.length > 0) {
      currentCurrency.value = products.value[0].product.currency?.code || 'TRY'
    }

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
    const productNames = selectedProducts.value.map(p => p.product.name).join(', ')

    const saleData = {
      customerId: props.customer.id,
      customer2ProductIds: selectedProductIds.value,
      userId: authStore.user?.id,
      title: `Satış - ${productNames}`,
      description: `${props.customer.name} ${props.customer.surname} için ${selectedProducts.value.length} ürün satışa çevrildi. Toplam: ${formatCurrency(totalOffer.value, currentCurrency.value)}, Alınan: ${formatCurrency(totalPaid.value, currentCurrency.value)}, Kalan: ${formatCurrency(totalRemaining.value, currentCurrency.value)}`
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
    currentCurrency.value = null
  }
})

// Watch selected items to update selectAll checkbox
watch(() => selectedProductIds.value.length, (newLength) => {
  selectAll.value = newLength === products.value.length && newLength > 0
})
</script>