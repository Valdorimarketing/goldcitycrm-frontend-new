<template>
  <Teleport to="body">
    <Transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100"
      leave-active-class="duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="show && sale" class="fixed inset-0 z-50 overflow-y-auto">
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
            <div v-if="show && sale"
              class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl transition-all w-full max-w-3xl">
              
              <!-- Header -->
              <div class="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-5">
                <div class="flex items-start justify-between">
                  <div class="flex items-center space-x-4">
                    <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
                      <ShoppingBagIcon class="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 class="text-xl font-bold text-white">
                        Satış Detayları
                      </h3>
                      <p class="text-sm text-green-100 mt-0.5">
                        {{ sale.customer?.name }} - {{ formatDate(sale.date) }}
                      </p>
                    </div>
                  </div>
                  <button @click="$emit('close')" 
                    class="rounded-lg p-2 text-white/80 hover:bg-white/20 hover:text-white transition-colors">
                    <XMarkIcon class="h-6 w-6" />
                  </button>
                </div>

                <!-- Payment Status Banner -->
                <div class="mt-4 flex items-center justify-between p-4 bg-white/10 backdrop-blur rounded-xl">
                  <div class="flex items-center space-x-3">
                    <div v-if="sale.isFullyPaid" 
                      class="flex h-10 w-10 items-center justify-center rounded-full bg-green-400/30">
                      <CheckCircleIcon class="h-7 w-7 text-white" />
                    </div>
                    <div v-else-if="sale.paidAmount > 0" 
                      class="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400/30">
                      <ClockIcon class="h-7 w-7 text-white" />
                    </div>
                    <div v-else 
                      class="flex h-10 w-10 items-center justify-center rounded-full bg-red-400/30">
                      <XCircleIcon class="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <p class="text-sm font-medium text-white">
                        {{ getPaymentStatusText() }}
                      </p>
                      <p class="text-xs text-green-100">
                        {{ sale.products?.length || 0 }} ürün
                      </p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-2xl font-bold text-white">
                      {{ formatCurrency(sale.totalAmount, sale.currency) }}
                    </p>
                    <p class="text-xs text-green-100">Toplam Tutar</p>
                  </div>
                </div>
              </div>

              <!-- Content -->
              <div class="max-h-[60vh] overflow-y-auto px-6 py-6 space-y-6">
                
                <!-- Customer Info -->
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                  <div class="flex items-start space-x-3">
                    <UserCircleIcon class="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div class="flex-1">
                      <h4 class="text-sm font-semibold text-gray-900 dark:text-white">
                        {{ sale.customer?.name }}
                      </h4>
                      <p v-if="sale.customer?.company" class="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                        {{ sale.customer.company }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Description -->
                <div v-if="sale.description && sale.description !== '-'" 
                  class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <div class="flex items-start space-x-3">
                    <DocumentTextIcon class="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h5 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                        Açıklama
                      </h5>
                      <p class="text-sm text-gray-900 dark:text-white">
                        {{ sale.description }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Products -->
                <div v-if="sale.products && sale.products.length > 0">
                  <h5 class="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <ShoppingBagIcon class="h-4 w-4 mr-2 text-gray-400" />
                    Ürünler ({{ sale.products.length }})
                  </h5>
                  <div class="space-y-3">
                    <div v-for="product in sale.products" :key="product.id"
                      class="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/30 dark:to-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all">
                      <div class="flex items-start justify-between">
                        <div class="flex-1">
                          <h6 class="text-sm font-semibold text-gray-900 dark:text-white">
                            {{ product.productDetails?.name || 'Ürün' }}
                          </h6>
                          <div class="mt-2 flex items-center space-x-4">
                            <!-- Original Price -->
                            <div class="bg-white dark:bg-gray-800 rounded-lg px-3 py-1.5">
                              <span class="text-xs text-gray-500 dark:text-gray-400">Birim Fiyat</span>
                              <p class="text-sm font-semibold text-gray-900 dark:text-white">
                                {{ formatCurrency(product.price, product.productDetails?.currency?.code) }}
                              </p>
                            </div>
                            <!-- Total Price -->
                            <div class="bg-white dark:bg-gray-800 rounded-lg px-3 py-1.5">
                              <span class="text-xs text-gray-500 dark:text-gray-400">Toplam</span>
                              <p class="text-sm font-bold text-green-600 dark:text-green-400">
                                {{ formatCurrency(product.totalPrice, product.productDetails?.currency?.code) }}
                              </p>
                            </div>
                            <!-- USD Equivalent (if not USD) -->
                            <div v-if="product.productDetails?.currency?.code !== 'USD'" 
                              class="bg-blue-50 dark:bg-blue-900/30 rounded-lg px-3 py-1.5">
                              <span class="text-xs text-blue-600 dark:text-blue-400">USD Karşılığı</span>
                              <p class="text-sm font-semibold text-blue-700 dark:text-blue-300">
                                ≈ {{ formatCurrency(convertToUSD(product.totalPrice, product.productDetails?.currency), 'USD') }}
                              </p>
                            </div>
                          </div>
                        </div>
                        <!-- Payment Status Badge -->
                        <div class="ml-4 flex-shrink-0">
                          <span v-if="product.isPayCompleted"
                            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            <CheckCircleIcon class="w-4 h-4 mr-1" />
                            Ödendi
                          </span>
                          <span v-else-if="product.paidAmount > 0"
                            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            <ClockIcon class="w-4 h-4 mr-1" />
                            Kısmi
                          </span>
                          <span v-else
                            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            <XCircleIcon class="w-4 h-4 mr-1" />
                            Ödenmedi
                          </span>
                        </div>
                      </div>
                      
                      <!-- Discount & VAT (if applicable) -->
                      <div v-if="product.discount || product.vat" class="mt-2 flex items-center space-x-3 text-xs">
                        <span v-if="product.discount" class="text-orange-600 dark:text-orange-400">
                          İndirim: {{ formatCurrency(product.discount, product.productDetails?.currency?.code) }}
                        </span>
                        <span v-if="product.vat" class="text-gray-600 dark:text-gray-400">
                          KDV: %{{ product.vat }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Payment Summary -->
                <div class="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20 rounded-xl p-5 border-2 border-green-200 dark:border-green-800">
                  <h5 class="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <CurrencyDollarIcon class="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                    Ödeme Özeti ({{ sale.currency }})
                  </h5>
                  
                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-600 dark:text-gray-400">Toplam Tutar:</span>
                      <span class="text-lg font-bold text-gray-900 dark:text-white">
                        {{ formatCurrency(sale.totalAmount, sale.currency) }}
                      </span>
                    </div>
                    
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-600 dark:text-gray-400">Ödenen:</span>
                      <span class="text-lg font-bold text-green-600 dark:text-green-400">
                        {{ formatCurrency(sale.paidAmount, sale.currency) }}
                      </span>
                    </div>
                    
                    <!-- Progress Bar -->
                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div class="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                        :style="{ width: `${paymentProgress}%` }"></div>
                    </div>
                    
                    <div class="flex items-center justify-between pt-3 border-t-2 border-green-200 dark:border-green-700">
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Kalan:</span>
                      <span class="text-xl font-bold" 
                        :class="sale.remainingAmount > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'">
                        {{ formatCurrency(sale.remainingAmount, sale.currency) }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Users Info -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div v-if="sale.user" class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <div class="flex items-center space-x-2 mb-1">
                      <UserIcon class="h-4 w-4 text-blue-500" />
                      <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                        Satış Yapan
                      </label>
                    </div>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ sale.user.name || '-' }}
                    </p>
                  </div>
                  
                  <div v-if="sale.responsibleUser" class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <div class="flex items-center space-x-2 mb-1">
                      <UserIcon class="h-4 w-4 text-purple-500" />
                      <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                        Sorumlu
                      </label>
                    </div>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ sale.responsibleUser.name || '-' }}
                    </p>
                  </div>
                  
                  <div v-if="sale.followerUser" class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <div class="flex items-center space-x-2 mb-1">
                      <UserIcon class="h-4 w-4 text-green-500" />
                      <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                        Takipçi
                      </label>
                    </div>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ sale.followerUser.name || '-' }}
                    </p>
                  </div>
                </div>

                <!-- Date Info -->
                <div class="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <div class="flex items-center space-x-2">
                    <CalendarIcon class="h-5 w-5 text-gray-400" />
                    <span class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ formatDate(sale.date) }}
                    </span>
                  </div>
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    Satış Tarihi
                  </span>
                </div>

              </div>

              <!-- Footer -->
              <div class="border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 px-6 py-4">
                <div class="flex items-center justify-end space-x-3">
                  <button @click="$emit('close')"
                    class="inline-flex items-center rounded-lg bg-white dark:bg-gray-700 px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 transition-colors">
                    Kapat
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
  ShoppingBagIcon,
  XMarkIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  UserCircleIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  UserIcon,
  CalendarIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  show: Boolean,
  sale: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close'])

// Exchange rates (should be loaded from API)
const exchangeRates = ref({
  USD: 1,
  EUR: 1.1666,
  TRY: 0.0236,
  GBP: 1.334
})

// Computed
const paymentProgress = computed(() => {
  if (!props.sale?.totalAmount) return 0
  return Math.min(100, (props.sale.paidAmount / props.sale.totalAmount) * 100)
})

// Methods
const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(amount || 0)
}

const convertToUSD = (amount, currency) => {
  if (!amount || !currency?.code) return 0
  if (currency.code === 'USD') return amount
  
  const rate = exchangeRates.value[currency.code] || 1
  return amount * rate
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  try {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return 'Geçersiz tarih'
  }
}

const getPaymentStatusText = () => {
  if (!props.sale) return ''
  
  if (props.sale.isFullyPaid) {
    return 'Ödeme Tamamlandı'
  } else if (props.sale.paidAmount > 0) {
    return 'Kısmi Ödeme Yapıldı'
  } else {
    return 'Ödeme Bekleniyor'
  }
}
</script>