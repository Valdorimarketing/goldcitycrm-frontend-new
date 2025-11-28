<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-80 transition-opacity"
        @click="close"></div>

      <div
        class="inline-block transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:align-middle sm:max-h-[90vh] sm:min-h-[700px]">
        <div class="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4 overflow-y-auto max-h-[75vh] min-h-[600px]">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-white mb-4">
                {{ customer?.name }} - Hizmetler
              </h3>

              <!-- Satış durumu uyarısı -->
              <div v-if="isSaleStatus"
                class="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div class="flex items-center">
                  <ExclamationTriangleIcon class="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                  <p class="text-sm text-yellow-700 dark:text-yellow-300 font-medium">
                    Müşterinin durumu satış durumunda olduğundan değiştirilemez
                  </p>
                </div>
              </div>

              <!-- Mevcut Hizmetler -->
              <div v-if="existingServices.length > 0"
                class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div class="flex justify-between items-center mb-3">
                  <h4 class="text-md font-medium text-gray-900 dark:text-white">Mevcut Hizmetler</h4>
                  <button v-if="!isSaleStatus" @click="updateExistingServices" :disabled="updatingExisting"
                    class="btn-primary text-sm">
                    {{ updatingExisting ? 'Güncelleniyor...' : 'Ürünleri Güncelle' }}
                  </button>
                </div>

                <div class="space-y-2">
                  <div v-for="(service, index) in existingServices" :key="service.id"
                    class="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div class="flex items-start justify-between">
                      <div class="flex-1">
                        <div class="flex gap-2 justify-between items-center">
                          <div class="font-medium text-gray-900 dark:text-white">{{ service.productName || 'Ürün' }}</div>
                          <div class="flex items-center gap-2">
                            <span class="text-gray-500 dark:text-gray-400">
                              {{ formatPrice(service.offer) }} {{ service.product.currency?.code || 'TL' }}
                            </span>
                            <!-- Ödeme Durumu Badge -->
                            <span v-if="service.isPayCompleted"
                              class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              <CheckCircleIcon class="w-3 h-3 mr-1" />
                              Ödendi
                            </span>
                            <span v-else-if="parseFloat(service.paidAmount) > 0"
                              class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                              <ClockIcon class="w-3 h-3 mr-1" />
                              Kısmi Ödeme
                            </span>
                            <span v-else
                              class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                              <XCircleIcon class="w-3 h-3 mr-1" />
                              Ödenmedi
                            </span>
                          </div>
                        </div>

                        <div class="grid grid-cols-4 gap-2 mt-2">
                          <div>
                            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Fiyat
                            </label>
                            <input v-model.number="service.price" type="number" class="form-input text-sm"
                              :readonly="isSaleStatus" :disabled="isSaleStatus" @input="calculateExistingOffer(index)" />
                          </div>
                          <div>
                            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Teklif
                            </label>
                            <input v-model.number="service.offer" type="number" class="form-input text-sm"
                              :readonly="isSaleStatus" :disabled="isSaleStatus" @input="calculateExistingRemaining(index)" />
                          </div>
                          <div>
                            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Alınan Tutar
                            </label>
                            <input v-model.number="service.paidAmount" type="number" min="0" class="form-input text-sm"
                              :readonly="isSaleStatus || service.isPayCompleted" 
                              :disabled="isSaleStatus || service.isPayCompleted" 
                              @input="calculateExistingRemaining(index)" />
                          </div>
                          <div>
                            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Kalan Para
                            </label>
                            <input :value="calculateRemainingAmount(service)" type="number" class="form-input text-sm bg-gray-100 dark:bg-gray-700" readonly />
                          </div>
                        </div>
                        
                        <!-- Ödeme İşlemleri -->
                        <div class="mt-3 flex items-center justify-between">
                          <!-- Ödeme Tamamla Butonu -->
                          <button 
                            v-if="!service.isPayCompleted"
                            @click="openPaymentCompleteConfirm(service, index)"
                            class="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                            :class="calculateRemainingAmount(service) > 0 
                              ? 'bg-green-600 hover:bg-green-700 text-white' 
                              : 'bg-green-100 hover:bg-green-200 text-green-800 dark:bg-green-900 dark:hover:bg-green-800 dark:text-green-200'"
                          >
                            <BanknotesIcon class="w-4 h-4 mr-1.5" />
                            <span v-if="calculateRemainingAmount(service) > 0">
                              Kalan {{ formatPrice(calculateRemainingAmount(service)) }} {{ service.product.currency?.code || 'TL' }} Alındı
                            </span>
                            <span v-else>
                              Ödemeyi Tamamla
                            </span>
                          </button>
                          
                          <!-- Ödeme Tamamlandı Bilgisi -->
                          <div v-else class="inline-flex items-center text-sm text-green-600 dark:text-green-400">
                            <CheckCircleIcon class="w-4 h-4 mr-1" />
                            Ödeme tamamlandı
                          </div>
                          
                          <!-- Silme Butonu -->
                          <button @click="deleteExistingService(service.id)"
                            class="ml-3 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                            <TrashIcon class="h-5 w-5" />
                          </button>
                        </div>

                        <div v-if="service.note" class="text-sm text-gray-600 dark:text-gray-300 mt-2">
                          Not: {{ service.note }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Ödeme Tamamlama Onay Modalı -->
                <div v-if="showPaymentConfirm" class="fixed inset-0 z-[60] overflow-y-auto">
                  <div class="flex min-h-screen items-center justify-center px-4">
                    <div class="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-80" @click="closePaymentConfirm"></div>
                    <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
                      <div class="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900">
                        <BanknotesIcon class="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 class="text-lg font-semibold text-center text-gray-900 dark:text-white mb-2">
                        Ödeme Tamamlama
                      </h3>
                      <p class="text-sm text-center text-gray-600 dark:text-gray-400 mb-4">
                        <strong>{{ pendingPaymentService?.productName }}</strong> için ödemeyi tamamlamak istediğinize emin misiniz?
                      </p>
                      
                      <!-- Ödeme Özeti -->
                      <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4 space-y-2">
                        <div class="flex justify-between text-sm">
                          <span class="text-gray-600 dark:text-gray-400">Toplam Teklif:</span>
                          <span class="font-medium text-gray-900 dark:text-white">
                            {{ formatPrice(pendingPaymentService?.offer) }} {{ pendingPaymentService?.product?.currency?.code || 'TL' }}
                          </span>
                        </div>
                        <div class="flex justify-between text-sm">
                          <span class="text-gray-600 dark:text-gray-400">Önceki Alınan:</span>
                          <span class="font-medium text-gray-900 dark:text-white">
                            {{ formatPrice(pendingPaymentService?.paidAmount) }} {{ pendingPaymentService?.product?.currency?.code || 'TL' }}
                          </span>
                        </div>
                        <div class="flex justify-between text-sm pt-2 border-t border-gray-200 dark:border-gray-600">
                          <span class="text-gray-600 dark:text-gray-400">Şimdi Alınan:</span>
                          <span class="font-semibold text-green-600 dark:text-green-400">
                            {{ formatPrice(calculateRemainingAmount(pendingPaymentService)) }} {{ pendingPaymentService?.product?.currency?.code || 'TL' }}
                          </span>
                        </div>
                      </div>

                      <div class="flex gap-3">
                        <button @click="closePaymentConfirm"
                          class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500">
                          İptal
                        </button>
                        <button @click="confirmPaymentComplete" :disabled="completingPayment"
                          class="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50">
                          {{ completingPayment ? 'İşleniyor...' : 'Ödemeyi Tamamla' }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Mevcut Hizmetler Toplamı -->
                <div class="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg space-y-2">
                  <div class="flex justify-between items-center">
                    <span class="font-medium text-gray-900 dark:text-white">Toplam Teklif:</span>
                    <span class="text-lg font-bold text-gray-900 dark:text-white">
                      {{ formatPrice(totalOfferExisting) }} {{ selectedCurrency?.code || 'TL' }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="font-medium text-gray-900 dark:text-white">Toplam Alınan:</span>
                    <span class="text-lg font-bold text-green-600 dark:text-green-400">
                      {{ formatPrice(totalPaidExisting) }} {{ selectedCurrency?.code || 'TL' }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center border-t border-gray-300 dark:border-gray-600 pt-2">
                    <span class="font-medium text-gray-900 dark:text-white">Toplam Kalan:</span>
                    <span class="text-lg font-bold" :class="totalRemainingExisting > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'">
                      {{ formatPrice(totalRemainingExisting) }} {{ selectedCurrency?.code || 'TL' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Yeni Hizmet Ekleme -->
              <div v-if="!isSaleStatus" class="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 class="text-md font-medium text-gray-900 dark:text-white mb-3">Yeni Hizmet Ekle</h4>

                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Para Birimi
                  </label>
                  <select v-model="selectedCurrency" :disabled="existingServices.length" class="form-select">
                    <option v-for="(currency) in currencies" :key="currency.id" :value="currency">
                      {{ currency.name }} ({{ currency.code }})
                    </option>
                  </select>

                  <div v-if="existingServices.length" class="block text-sm font-medium text-red-700 dark:text-red-300 mb-2 mt-2">
                    Mevcut hizmet varken para birimi değişikliği yapılamaz
                  </div>
                </div>

                <!-- Ürün Seçimi -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ürün Seç
                  </label>
                  <div class="relative">
                    <input v-model="productSearch" :disabled="!selectedCurrency" @input="searchProducts"
                      @focus="showProductDropdown = true" type="text" class="form-input w-full"
                      placeholder="Ürün ara..." />

                    <!-- Ürün Dropdown -->
                    <div v-if="showProductDropdown && filteredProducts.length > 0"
                      class="absolute z-50 mt-1 w-full bg-white dark:bg-gray-700 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto">
                      <div v-for="product in filteredProducts" :key="product.id" @click="selectProduct(product)"
                        class="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 dark:hover:bg-gray-600">
                        <div class="flex items-center justify-between">
                          <span class="font-normal block truncate text-gray-900 dark:text-gray-100">
                            {{ product.name }}
                          </span>
                          <span class="text-gray-500 dark:text-gray-400 ml-2">
                            {{ formatPrice(product.price) }} {{ product.currency?.code || 'TL' }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Seçili Ürün Bilgileri -->
                <div v-if="selectedProduct" class="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bu ürünü eklemeden önce son bir kez gözden geçirin.
                  </label>

                  <div class="flex justify-between items-center mb-2">
                    <span class="font-medium text-gray-900 dark:text-white">{{ selectedProduct.name }}</span>
                    <span class="text-gray-600 dark:text-gray-300">{{ formatPrice(selectedProduct.price) }} {{
                      selectedProduct.currency?.code || 'TL' }}</span>
                  </div>

                  <div class="grid grid-cols-4 gap-3">
                    <div>
                      <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Fiyat
                      </label>
                      <input v-model.number="newService.price" type="number" class="form-input text-sm"
                        @input="calculateOffer" />
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Teklif
                      </label>
                      <input v-model.number="newService.offer" type="number" class="form-input text-sm"
                        @input="calculateRemaining" />
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Alınan Tutar
                      </label>
                      <input v-model.number="newService.paidAmount" type="number" min="0" class="form-input text-sm"
                        @input="calculateRemaining" />
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Kalan Para
                      </label>
                      <input :value="newService.remainingAmount" type="number" class="form-input text-sm bg-gray-100 dark:bg-gray-600" readonly />
                    </div>
                  </div>

                  <div class="mt-3">
                    <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Not (Opsiyonel)
                    </label>
                    <input v-model="newService.note" type="text" class="form-input text-sm"
                      placeholder="Hizmet notu..." />
                  </div>

                  <div class="mt-3 flex gap-2">
                    <button @click="addService" class="flex-1 btn-primary text-sm">
                      Hizmeti Ekle
                    </button>
                    <button @click="cancelProductSelection"
                      class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-500">
                      Vazgeç
                    </button>
                  </div>
                </div>
              </div>

              <!-- Eklenen Hizmetler Listesi -->
              <div v-if="services.length > 0" class="mb-4">
                <h4 class="text-md font-medium text-gray-900 dark:text-white mb-3">Eklenecek Hizmetler</h4>
                <div class="space-y-2">
                  <div v-for="(service, index) in services" :key="index"
                    class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div class="flex-1">
                      <div class="font-medium text-gray-900 dark:text-white">{{ service.productName }}</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                        Fiyat: {{ formatPrice(service.price) }} {{ service.currency?.code || 'TL' }} |
                        Teklif: {{ formatPrice(service.offer) }} {{ service.currency?.code || 'TL' }} |
                        Alınan: {{ formatPrice(service.paidAmount) }} {{ service.currency?.code || 'TL' }} |
                        Kalan: {{ formatPrice(service.offer - service.paidAmount) }} {{ service.currency?.code || 'TL' }}
                      </div>
                      <div v-if="service.note" class="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        Not: {{ service.note }}
                      </div>
                    </div>
                    <button @click="removeService(index)"
                      class="ml-3 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                      <XMarkIcon class="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <!-- Eklenecek Hizmetler Toplamı -->
                <div class="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg space-y-2">
                  <div class="flex justify-between items-center">
                    <span class="font-medium text-gray-900 dark:text-white">Toplam Teklif:</span>
                    <span class="text-lg font-bold text-gray-900 dark:text-white">
                      {{ formatPrice(totalOffer) }} {{ selectedCurrency?.code || 'TL' }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="font-medium text-gray-900 dark:text-white">Toplam Alınan:</span>
                    <span class="text-lg font-bold text-green-600 dark:text-green-400">
                      {{ formatPrice(totalPaid) }} {{ selectedCurrency?.code || 'TL' }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center border-t border-gray-300 dark:border-gray-600 pt-2">
                    <span class="font-medium text-gray-900 dark:text-white">Toplam Kalan:</span>
                    <span class="text-lg font-bold" :class="totalRemaining > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'">
                      {{ formatPrice(totalRemaining) }} {{ selectedCurrency?.code || 'TL' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button v-if="!isSaleStatus" @click="saveServices" :disabled="services.length === 0 || saving"
            class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto">
            {{ saving ? 'Kaydediliyor...' : 'Kaydet' }}
          </button>
          <button @click="close"
            class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-600 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 sm:mt-0 sm:w-auto">
            İptal
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { XMarkIcon, TrashIcon, ExclamationTriangleIcon, CheckCircleIcon, ClockIcon, XCircleIcon, BanknotesIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  customer: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

const api = useApi()
const authStore = useAuthStore()

// State
const products = ref([])
const productSearch = ref('')
const showProductDropdown = ref(false)
const selectedProduct = ref(null)
const services = ref([])
const saving = ref(false)
const existingServices = ref([])
const updatingExisting = ref(false)
const customerStatus = ref(null)
const isSaleStatus = ref(false)
const currencies = ref([])
const selectedCurrency = ref(null)

// Ödeme Tamamlama State
const showPaymentConfirm = ref(false)
const pendingPaymentService = ref(null)
const pendingPaymentIndex = ref(null)
const completingPayment = ref(false)

const newService = ref({
  price: 0,
  paidAmount: 0,
  offer: 0,
  remainingAmount: 0,
  note: ''
})

// Computed
const filteredProducts = computed(() => {
  if (!productSearch.value) return products.value.slice(0, 10)

  const search = productSearch.value.toLowerCase()
  return products.value
    .filter(p => p.name.toLowerCase().includes(search))
    .slice(0, 10)
})

// Yeni Hizmetler Toplamları
const totalOffer = computed(() => {
  return services.value.reduce((sum, service) => {
    const offer = parseFloat(service.offer) || 0
    return sum + offer
  }, 0)
})

const totalPaid = computed(() => {
  return services.value.reduce((sum, service) => {
    const paidAmount = parseFloat(service.paidAmount) || 0
    return sum + paidAmount
  }, 0)
})

const totalRemaining = computed(() => {
  return totalOffer.value - totalPaid.value
})

// Mevcut Hizmetler Toplamları
const totalOfferExisting = computed(() => {
  return existingServices.value.reduce((sum, service) => {
    const offer = parseFloat(service.offer) || 0
    return sum + offer
  }, 0)
})

const totalPaidExisting = computed(() => {
  return existingServices.value.reduce((sum, service) => {
    const paidAmount = parseFloat(service.paidAmount) || 0
    return sum + paidAmount
  }, 0)
})

const totalRemainingExisting = computed(() => {
  return totalOfferExisting.value - totalPaidExisting.value
})

// --- Para Birimlerini Çek ---
const fetchCurrencies = async () => {
  try {
    const response = await api('/currencies')
    currencies.value = response || []
  } catch (error) {
    console.error('Para birimleri alınamadı:', error)
  }
}

// Methods
const searchProducts = async () => {
  try {
    if (!selectedCurrency.value) {
      products.value = []
      return
    }
    showProductDropdown.value = true
    const response = await api('/products?currencyId=' + selectedCurrency.value.id)
    products.value = Array.isArray(response) ? response : response.data || []
  } catch (error) {
    console.error('Error loading products:', error)
  }
}

const selectProduct = (product) => {
  selectedProduct.value = product
  productSearch.value = product.name
  showProductDropdown.value = false

  // Set default price from product
  newService.value.price = product.price || 0
  newService.value.offer = product.price || 0
  newService.value.paidAmount = 0
  calculateRemaining()
}

const calculateOffer = () => {
  // Fiyat değiştiğinde teklifi de güncelle (eğer teklif fiyattan büyükse)
  if (newService.value.offer < newService.value.price) {
    newService.value.offer = newService.value.price
  }
  calculateRemaining()
}

const calculateRemaining = () => {
  const offer = newService.value.offer || 0
  const paidAmount = newService.value.paidAmount || 0
  newService.value.remainingAmount = Math.max(0, offer - paidAmount)
}

const calculateRemainingAmount = (service) => {
  const offer = parseFloat(service.offer) || 0
  const paidAmount = parseFloat(service.paidAmount) || 0
  return Math.max(0, offer - paidAmount)
}

const addService = () => {
  if (!selectedProduct.value) return

  const paidAmount = newService.value.paidAmount || 0
  const offer = newService.value.offer || 0
  const isPayCompleted = paidAmount >= offer && offer > 0

  services.value.push({
    product: selectedProduct.value.id,
    currency: selectedProduct.value.currency,
    productName: selectedProduct.value.name,
    price: newService.value.price,
    paidAmount: paidAmount,
    offer: offer,
    isPayCompleted: isPayCompleted,
    note: newService.value.note
  })

  // Reset form
  selectedProduct.value = null
  productSearch.value = ''
  newService.value = {
    price: 0,
    paidAmount: 0,
    offer: 0,
    remainingAmount: 0,
    note: ''
  }
}

const removeService = (index) => {
  services.value.splice(index, 1)
}

const cancelProductSelection = () => {
  selectedProduct.value = null
  productSearch.value = ''
  services.value = []
  newService.value = {
    price: 0,
    paidAmount: 0,
    offer: 0,
    remainingAmount: 0,
    note: ''
  }
}

const saveServices = async () => {
  if (services.value.length === 0 || !props.customer) return

  saving.value = true
  try {
    const payload = {
      items: services.value.map(service => ({
        product: service.product,
        customer: props.customer.id,
        price: service.price,
        paidAmount: service.paidAmount,
        offer: service.offer,
        isPayCompleted: service.isPayCompleted,
        note: service.note || undefined,
        user: authStore.user?.id,
      }))
    }

    await api('/customer2product/bulk', {
      method: 'POST',
      body: payload
    })

    emit('saved')
    close()
  } catch (error) {
    console.error('Error saving services:', error)
    alert('Hizmetler kaydedilirken bir hata oluştu.')
  } finally {
    saving.value = false
  }
}

const close = () => {
  services.value = []
  existingServices.value = []
  selectedProduct.value = null
  productSearch.value = ''
  newService.value = {
    price: 0,
    paidAmount: 0,
    offer: 0,
    remainingAmount: 0,
    note: ''
  }
  emit('close')
}

const checkCustomerStatus = async () => {
  const statusId = props.customer?.status || props.customer?.statusId

 
  

  if (!props.customer || !statusId) {
    isSaleStatus.value = false
    return
  }

  try {
    const status = await api(`/statuses/${statusId}`)

    if (!status) {
      isSaleStatus.value = false
      return
    }

    customerStatus.value = status
    isSaleStatus.value = status?.isSale === true
  } catch (error) {
    console.error('Error fetching customer status:', error)
    isSaleStatus.value = false
  }
}

const loadExistingServices = async () => {
  if (!props.customer || !props.customer.id) {
    existingServices.value = []
    return
  }

  try {
    const response = await api(`/customer2product/customer/${props.customer.id}`)
    const customerServices = Array.isArray(response) ? response : response.data || []

    existingServices.value = await Promise.all(customerServices.map(async (service) => {
      selectedCurrency.value = service.product?.currency || null;

      if (service.product && typeof service.product === 'object') {
        return {
          ...service,
          productId: service.product.id,
          productName: service.product.name || 'Ürün',
          paidAmount: service.paidAmount || 0,
          isPayCompleted: service.isPayCompleted || false
        }
      }

      const productId = service.productId || service.product
      if (productId) {
        try {
          const productResponse = await api(`/products/${productId}`)
          return {
            ...service,
            productId: productId,
            productName: productResponse.name || 'Ürün',
            paidAmount: service.paidAmount || 0,
            isPayCompleted: service.isPayCompleted || false
          }
        } catch (error) {
          return {
            ...service,
            productId: productId,
            productName: 'Ürün',
            paidAmount: service.paidAmount || 0,
            isPayCompleted: service.isPayCompleted || false
          }
        }
      }

      return {
        ...service,
        productName: 'Ürün',
        paidAmount: service.paidAmount || 0,
        isPayCompleted: service.isPayCompleted || false
      }
    }))
  } catch (error) {
    console.error('Error loading existing services:', error)
    existingServices.value = []
  }
}

const calculateExistingOffer = (index) => {
  // Fiyat değiştiğinde teklifi kontrol et
  const service = existingServices.value[index]
  if (service && service.offer < service.price) {
    service.offer = service.price
  }
  calculateExistingRemaining(index)
}

const calculateExistingRemaining = (index) => {
  const service = existingServices.value[index]
  if (service) {
    // Kalan tutarı hesapla (readonly field için)
    // isPayCompleted değilse ve paidAmount >= offer olursa otomatik işaretle
    if (!service.isPayCompleted && service.paidAmount >= service.offer && service.offer > 0) {
      service.isPayCompleted = true
    }
  }
}

const handlePaymentCompleteChange = (service, index) => {
  if (service.isPayCompleted) {
    // Ödeme tamamlandı olarak işaretlendiğinde, paidAmount'u offer'a eşitle
    service.paidAmount = parseFloat(service.offer) || 0
  }
}

// Ödeme Tamamlama Modalı Fonksiyonları
const openPaymentCompleteConfirm = (service, index) => {
  pendingPaymentService.value = service
  pendingPaymentIndex.value = index
  showPaymentConfirm.value = true
}

const closePaymentConfirm = () => {
  showPaymentConfirm.value = false
  pendingPaymentService.value = null
  pendingPaymentIndex.value = null
}

const confirmPaymentComplete = async () => {
  if (!pendingPaymentService.value) return

  completingPayment.value = true
  try {
    const service = pendingPaymentService.value
    const offer = parseFloat(service.offer) || 0
    
    // API'ye güncelleme gönder
    await api(`/customer2product/${service.id}`, {
      method: 'PUT',
      body: {
        product: service.productId || service.product?.id || service.product,
        customer: props.customer.id,
        price: parseFloat(service.price) || 0,
        paidAmount: offer, // Teklif tutarı kadar ödeme alındı
        offer: offer,
        isPayCompleted: true,
        note: service.note || undefined
      }
    })

    // Local state güncelle
    service.paidAmount = offer
    service.isPayCompleted = true

    closePaymentConfirm()
    alert('Ödeme başarıyla tamamlandı!')
  } catch (error) {
    console.error('Error completing payment:', error)
    alert('Ödeme tamamlanırken bir hata oluştu.')
  } finally {
    completingPayment.value = false
  }
}

const updateExistingServices = async () => {
  if (existingServices.value.length === 0 || !props.customer) return

  updatingExisting.value = true
  try {
    const updatePromises = existingServices.value.map(service =>
      api(`/customer2product/${service.id}`, {
        method: 'PUT',
        body: {
          product: service.productId || service.product?.id || service.product,
          customer: props.customer.id,
          price: service.price || 0,
          paidAmount: service.paidAmount || 0,
          offer: service.offer || 0,
          isPayCompleted: service.isPayCompleted || false,
          note: service.note || undefined
        }
      })
    )

    await Promise.all(updatePromises)
    alert('Hizmetler başarıyla güncellendi!')
  } catch (error) {
    console.error('Error updating services:', error)
    alert('Hizmetler güncellenirken bir hata oluştu.')
  } finally {
    updatingExisting.value = false
  }
}

const deleteExistingService = async (serviceId) => {
  if (!confirm('Bu hizmeti silmek istediğinizden emin misiniz?')) return

  try {
    await api(`/customer2product/${serviceId}`, {
      method: 'DELETE'
    })

    existingServices.value = existingServices.value.filter(s => s.id !== serviceId)
  } catch (error) {
    console.error('Error deleting service:', error)
    alert('Hizmet silinirken bir hata oluştu.')
  }
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price || 0)
}

// Load products and existing services on mount
onMounted(() => {
  searchProducts()
  fetchCurrencies()
})

// Watch for customer change to load their services
watch(() => props.customer, async (newCustomer, oldCustomer) => {
  if (newCustomer?.id !== oldCustomer?.id) {
    existingServices.value = []
    isSaleStatus.value = false
    customerStatus.value = null
  }

  if (newCustomer && props.show) {
    await checkCustomerStatus()
    await loadExistingServices()
  }
}, { deep: true })

// Also load when modal opens
watch(() => props.show, async (isOpen) => {
  if (isOpen && props.customer) {
    services.value = []
    existingServices.value = []
    await checkCustomerStatus()
    await loadExistingServices()
  }
})

watch(selectedCurrency, async (newCurrency, oldCurrency) => {
  if (newCurrency?.id === oldCurrency?.id) return
  cancelProductSelection()
  searchProducts()
})

// Close dropdown when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
      showProductDropdown.value = false
    }
  })
})
</script>