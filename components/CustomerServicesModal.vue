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
                    class="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div class="flex-1">
                      <div class="flex gap-2 justify-between items-center">
                        <div class="font-medium text-gray-900 dark:text-white">{{ service.productName || 'Ürün' }}</div>
                        <span class="text-gray-500 dark:text-gray-400 ml-2">
                          {{ formatPrice(service.price) }} {{ service.product.currency?.code || 'TL' }}
                        </span>
                      </div>

                      <div class="grid grid-cols-3 gap-2 mt-2">
                        <div>
                          <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Fiyat
                          </label>
                          <input v-model.number="service.price" type="number" class="form-input text-sm"
                            :readonly="isSaleStatus" :disabled="isSaleStatus" @input="calculateExistingOffer(index)" />
                        </div>
                        <div>
                          <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            İndirim
                          </label>
                          <input v-model.number="service.discount" min="0" type="number" class="form-input text-sm"
                            :readonly="isSaleStatus" :disabled="isSaleStatus" @input="calculateExistingOffer(index)" />
                        </div>
                        <div>
                          <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Teklif
                          </label>
                          <input v-model.number="service.offer" type="number" class="form-input text-sm" readonly />
                        </div>
                      </div>
                      <div v-if="service.note" class="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        Not: {{ service.note }}
                      </div>
                    </div>
                    <button v-if="!isSaleStatus" @click="deleteExistingService(service.id)"
                      class="ml-3 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                      <TrashIcon class="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <!-- Toplam -->
                <div class="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <div class="flex justify-between items-center">
                    <span class="font-medium text-gray-900 dark:text-white">Mevcut Toplam Teklif:</span>
                    <span class="text-lg font-bold text-gray-900 dark:text-white">
                      {{ formatPrice(totalOfferExisting) }} {{ selectedCurrency?.code || 'TL' }}
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

                  <div v-if="existingServices.length" class="block text-sm font-medium text-red-700 dark:text-red-300 mb-2 mt-2">Mevcut hizmet varken para birimi değişikliği yapılamaz</div>
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

                  <div class="grid grid-cols-3 gap-3">
                    <div>
                      <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Fiyat
                      </label>
                      <input v-model.number="newService.price" type="number" class="form-input text-sm"
                        @input="calculateOffer" />
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        İndirim
                      </label>
                      <input v-model.number="newService.discount" type="number" class="form-input text-sm"
                        @input="calculateOffer" />
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Teklif
                      </label>
                      <input v-model.number="newService.offer" type="number" class="form-input text-sm" readonly />
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
                        İndirim: {{ formatPrice(service.discount) }} {{ service.currency?.code || 'TL' }} |
                        Teklif: {{ formatPrice(service.offer) }} {{ service.currency?.code || 'TL' }}
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

                <!-- Toplam -->
                <div class="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <div class="flex justify-between items-center">
                    <span class="font-medium text-gray-900 dark:text-white">Toplam Teklif:</span>
                    <span class="text-lg font-bold text-gray-900 dark:text-white">
                      {{ formatPrice(totalOffer) }} {{ selectedCurrency?.code || 'TL' }}
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
import { XMarkIcon, TrashIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

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

const newService = ref({
  price: 0,
  discount: 0,
  offer: 0,
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

const totalOffer = computed(() => {
  return services.value.reduce((sum, service) => sum + (service.offer || 0), 0)
})

const totalOfferExisting = computed(() => {
  return existingServices.value
    .reduce((sum, service) => sum + (service.offer || 0), 0)
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
    if(!selectedCurrency.value) {
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
  newService.value.discount = 0
  calculateOffer()
}

const calculateOffer = () => {
  const price = newService.value.price || 0
  const discount = newService.value.discount || 0
  newService.value.offer = Math.max(0, price - discount)
}

const addService = () => {
  if (!selectedProduct.value) return

  services.value.push({
    product: selectedProduct.value.id,
    currency: selectedProduct.value.currency,
    productName: selectedProduct.value.name,
    price: newService.value.price,
    discount: newService.value.discount,
    offer: newService.value.offer,
    note: newService.value.note
  })


  // Reset form
  selectedProduct.value = null
  productSearch.value = ''
  newService.value = {
    price: 0,
    discount: 0,
    offer: 0,
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
    discount: 0,
    offer: 0,
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
        discount: service.discount,
        offer: service.offer,
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
    discount: 0,
    offer: 0,
    note: ''
  }
  emit('close')
}

const checkCustomerStatus = async () => {
  // status alanını kontrol et (backend'den status: 3 şeklinde geliyor)
  const statusId = props.customer?.status || props.customer?.statusId

  if (!props.customer || !statusId) {
    isSaleStatus.value = false
    return
  }

  try {
    // Direkt API çağrısı yapalım
    const status = await api(`/statuses/${statusId}`)

    if (!status) {
      isSaleStatus.value = false
      return
    }

    customerStatus.value = status

    // Backend camelCase olarak isSale döndürüyor
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
    // Use the correct endpoint format: /customer2product/customer/{customerId}
    const response = await api(`/customer2product/customer/${props.customer.id}`)
    const customerServices = Array.isArray(response) ? response : response.data || []
 

    // Map services with product names
    existingServices.value = await Promise.all(customerServices.map(async (service) => {

      
      selectedCurrency.value = service.product?.currency || null;

      // Check if product info is already included (nested object)
      if (service.product && typeof service.product === 'object') {
        return {
          ...service,
          productId: service.product.id,
          productName: service.product.name || 'Ürün'
        }
      }
 
  
      // Otherwise try to fetch product info
      const productId = service.productId || service.product
      if (productId) {
        try {
          const productResponse = await api(`/products/${productId}`)
          return {
            ...service,
            productId: productId,
            productName: productResponse.name || 'Ürün'
          }
        } catch (error) {
          return {
            ...service,
            productId: productId,
            productName: 'Ürün'
          }
        }
      }

      return {
        ...service,
        productName: 'Ürün'
      }
    }))



  } catch (error) {
    console.error('Error loading existing services:', error)
    existingServices.value = []
  }
}

const calculateExistingOffer = (index) => {
  const service = existingServices.value[index]
  if (service) {
    const price = service.price || 0
    const discount = service.discount || 0
    service.offer = Math.max(0, price - discount)
  }
}

const updateExistingServices = async () => {
  if (existingServices.value.length === 0 || !props.customer) return

  updatingExisting.value = true
  try {
    // Update each service individually
    const updatePromises = existingServices.value.map(service =>
      api(`/customer2product/${service.id}`, {
        method: 'PUT',
        body: {
          product: service.productId || service.product?.id || service.product,
          customer: props.customer.id,
          price: service.price || 0,
          discount: service.discount || 0,
          offer: service.offer || 0,
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

    // Remove from list
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
  // Reset existing services when customer changes
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
    // Reset services when modal opens
    services.value = []
    existingServices.value = []
    await checkCustomerStatus()
    await loadExistingServices()
  }
})

watch(selectedCurrency, async (newCurrency, oldCurrency) => {
  if(newCurrency?.id === oldCurrency?.id) return
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