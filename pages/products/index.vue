<template>
  <div>
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Ürünler</h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
          Tüm ürünlerinizi buradan yönetebilirsiniz.
        </p>
      </div>
      <div class="mt-4 sm:mt-0">
        <button
          @click="showCreateModal = true"
          class="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          <PlusIcon class="-ml-0.5 mr-1.5 h-5 w-5" />
          Yeni Ürün
        </button>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label for="search" class="block text-sm font-medium text-gray-700 mb-2">
            Ara
          </label>
          <input
            id="search"
            v-model="searchTerm"
            type="text"
            class="form-input"
            placeholder="Ürün adı veya kategori..."
          />
        </div>
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
            Kategori
          </label>
          <select
            id="category"
            v-model="categoryFilter"
            class="form-input"
          >
            <option value="">Tüm Kategoriler</option>
            <option value="web">Web Geliştirme</option>
            <option value="mobile">Mobil Uygulama</option>
            <option value="design">Tasarım</option>
            <option value="consulting">Danışmanlık</option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="resetFilters"
            class="btn-secondary"
          >
            Filtreleri Temizle
          </button>
        </div>
      </div>
    </div>

    <!-- Products Grid -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="card hover:shadow-lg transition-shadow duration-200"
      >
        <!-- Product Header -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <CubeIcon class="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h3 class="text-lg font-medium text-gray-900">{{ product.name }}</h3>
              <p class="text-sm text-gray-500">Ürün</p>
            </div>
          </div>
          <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            Aktif
          </span>
        </div>

        <!-- Product Info -->
        <div class="mb-4">
          <div class="text-sm text-gray-600">
            <span class="font-medium">Oluşturulma:</span> {{ formatDate(product.createdAt) }}
          </div>
          <div class="text-sm text-gray-600" v-if="product.updatesAt">
            <span class="font-medium">Güncellenme:</span> {{ formatDate(product.updatesAt) }}
          </div>
        </div>

        <!-- Price -->
        <div class="mb-4">
          <div class="text-2xl font-bold text-gray-900">
            ₺{{ formatCurrency(product.price) }}
          </div>
          <div class="text-sm text-gray-500">Başlangıç fiyatı</div>
        </div>

        <!-- Actions -->
        <div class="space-y-2">
          <div class="flex space-x-2">
            <button
              @click="editProduct(product)"
              class="flex-1 text-center bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 py-2 px-3 rounded-md text-sm font-medium hover:bg-indigo-200 dark:hover:bg-indigo-800"
            >
              Düzenle
            </button>
            <button
              @click="confirmDelete(product)"
              class="flex-1 text-center bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 py-2 px-3 rounded-md text-sm font-medium hover:bg-red-200 dark:hover:bg-red-800"
            >
              Sil
            </button>
          </div>
          <div class="flex space-x-2">
            <button
              @click="openActionCreateModal(product)"
              class="flex-1 text-center bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 py-2 px-3 rounded-md text-sm font-medium hover:bg-green-200 dark:hover:bg-green-800"
            >
              Aksiyon Ekle
            </button>
            <button
              @click="openActionListModal(product)"
              class="flex-1 text-center bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 py-2 px-3 rounded-md text-sm font-medium hover:bg-purple-200 dark:hover:bg-purple-800"
            >
              Aksiyonları Listele
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredProducts.length === 0" class="col-span-full">
        <div class="text-center py-12">
          <CubeIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">Ürün bulunamadı</h3>
          <p class="mt-1 text-sm text-gray-500">
            {{ searchTerm ? 'Arama kriterlerinize uygun ürün bulunamadı.' : 'Henüz ürün eklenmemiş.' }}
          </p>
          <div class="mt-6">
            <NuxtLink
              to="/products/new"
              class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              <PlusIcon class="-ml-0.5 mr-1.5 h-5 w-5" />
              İlk ürünü ekle
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        
        <div class="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <ExclamationTriangleIcon class="h-6 w-6 text-red-600" />
              </div>
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 class="text-lg font-semibold leading-6 text-gray-900">
                  Ürünü Sil
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    <strong>{{ productToDelete?.name }}</strong> adlı ürünü silmek istediğinizden emin misiniz? 
                    Bu işlem geri alınamaz.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              @click="handleDelete"
              class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
            >
              Sil
            </button>
            <button
              @click="showDeleteModal = false"
              class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            >
              İptal
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Create Modal -->
    <ProductCreateModal
      :show="showCreateModal"
      @close="showCreateModal = false"
      @created="handleProductCreated"
    />


    <!-- Product Edit Modal -->
    <ProductEditModal
      :show="showEditModal"
      :product="selectedProduct"
      @close="closeEditModal"
      @updated="handleProductUpdated"
    />

    <!-- Action Create Modal -->
    <ActionCreateModal
      v-if="showActionCreateModal && selectedProductForAction"
      :is-open="showActionCreateModal"
      :product-id="selectedProductForAction.id.toString()"
      @close="showActionCreateModal = false; selectedProductForAction = null"
      @created="handleActionCreated"
    />

    <!-- Action List Modal -->
    <ActionListModal
      v-if="showActionListModal && selectedProductForAction"
      :is-open="showActionListModal"
      :product-id="selectedProductForAction.id.toString()"
      :product-name="selectedProductForAction.name"
      @close="showActionListModal = false; selectedProductForAction = null"
    />
  </div>
</template>

<script setup lang="ts">
import {
  PlusIcon,
  CubeIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  // middleware: 'auth' // Temporarily disabled
})

// Search and filters
const searchTerm = ref('')
const categoryFilter = ref('')

// Modals
const showDeleteModal = ref(false)
const productToDelete = ref(null)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const selectedProduct = ref(null)
const showActionCreateModal = ref(false)
const showActionListModal = ref(false)
const selectedProductForAction = ref(null)

// Import products store
const productsStore = useProductsStore()

// Initialize with empty array to prevent undefined errors
productsStore.products.value = []

// Load data from API
onMounted(async () => {
  try {
    const api = useApi()
    console.log('Loading products...')
    
    const response = await api('/products')
    
    console.log('Products loaded:', response)
    if (response) {
      if (Array.isArray(response)) {
        productsStore.products.value = response
      } else if (response.data && Array.isArray(response.data)) {
        productsStore.products.value = response.data
      }
    }
  } catch (error) {
    console.error('Failed to load products:', error)
    // Continue with empty array instead of demo data
  }
})

// Computed properties
const filteredProducts = computed(() => {
  let filtered = productsStore.products.value

  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(product =>
      product.name?.toLowerCase().includes(search) ||
      product.description?.toLowerCase().includes(search) ||
      product.category?.toLowerCase().includes(search)
    )
  }

  if (categoryFilter.value) {
    filtered = filtered.filter(product => 
      product.category?.toLowerCase().includes(categoryFilter.value.toLowerCase())
    )
  }

  return filtered
})

// Methods
const resetFilters = () => {
  searchTerm.value = ''
  categoryFilter.value = ''
}

const confirmDelete = (product) => {
  productToDelete.value = product
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (productToDelete.value) {
    try {
      const api = useApi()
      
      // First remove from local state for immediate feedback
      const productId = productToDelete.value.id
      productsStore.products.value = productsStore.products.value.filter(
        p => p.id !== productId
      )
      
      // Then sync with API in background
      await api(`/products/${productId}`, {
        method: 'DELETE'
      })
      
      console.log('Product deleted successfully')
    } catch (error) {
      console.error('Error deleting product (using demo mode):', error)
      // Product is already removed from local state, so no need to revert
    }
  }
  showDeleteModal.value = false
  productToDelete.value = null
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('tr-TR').format(amount)
}

const formatDate = (dateString) => {
  if (!dateString) return 'Belirtilmemiş'
  return new Date(dateString).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Handle product creation
const handleProductCreated = (product) => {
  console.log('New product created:', product)
  // Add to beginning of products list for immediate visibility
  productsStore.products.value.unshift({
    ...product,
    description: product.description || 'Açıklama bulunmuyor.',
    category: product.category || 'Genel',
    isActive: product.isActive !== undefined ? product.isActive : true
  })
}

// Handle product edit
const editProduct = (product) => {
  selectedProduct.value = product
  showEditModal.value = true
}

// Handle product update
const handleProductUpdated = (updatedProduct) => {
  console.log('Product updated:', updatedProduct)
  // Find and update the product in the list
  const index = productsStore.products.value.findIndex(p => p.id === updatedProduct.id)
  if (index !== -1) {
    productsStore.products.value[index] = updatedProduct
  }
}

// Close modal functions
const closeEditModal = () => {
  showEditModal.value = false
  selectedProduct.value = null
}

// Action modal functions
const openActionCreateModal = (product) => {
  selectedProductForAction.value = product
  showActionCreateModal.value = true
}

const openActionListModal = (product) => {
  selectedProductForAction.value = product
  showActionListModal.value = true
}

const handleActionCreated = () => {
  // Optionally show a success message or refresh action list
  console.log('Action created successfully')
}

// Page head
useHead({
  title: 'Ürünler - Valdori CRM'
})
</script> 