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
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div>
          <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ara
          </label>
          <input
            id="search"
            v-model="searchTerm"
            type="text"
            class="form-input"
            placeholder="Ürün adı..."
          />
        </div>
        <div>
          <label for="minPrice" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Min. Fiyat
          </label>
          <input
            id="minPrice"
            v-model.number="minPrice"
            type="number"
            class="form-input"
            placeholder="0"
          />
        </div>
        <div>
          <label for="maxPrice" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Max. Fiyat
          </label>
          <input
            id="maxPrice"
            v-model.number="maxPrice"
            type="number"
            class="form-input"
            placeholder="999999"
          />
        </div>
        <div class="flex items-end">
          <button
            @click="resetFilters"
            class="btn-secondary w-full"
          >
            Filtreleri Temizle
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>

    <!-- Products Grid -->
    <div v-else>
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        <div
          v-for="product in products"
          :key="product.id"
          class="card hover:shadow-lg transition-shadow duration-200"
        >
        <!-- Product Header -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="h-10 w-10 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
              <CubeIcon class="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ product.name }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Ürün</p>
            </div>
          </div>
          <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
            Aktif
          </span>
        </div>

        <!-- Product Info -->
        <div class="mb-4">
          <div class="text-sm text-gray-600 dark:text-gray-400">
            <span class="font-medium">Oluşturulma:</span> {{ formatDate(product.createdAt) }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400" v-if="product.updatesAt">
            <span class="font-medium">Güncellenme:</span> {{ formatDate(product.updatesAt) }}
          </div>
        </div>

        <!-- Price -->
        <div class="mb-4">
          <div class="text-2xl font-bold text-gray-900 dark:text-white">
            ₺{{ formatCurrency(product.price) }}
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">Başlangıç fiyatı</div>
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
      </div>

      <!-- Empty State -->
      <div v-if="products.length === 0">
        <div class="text-center py-12">
          <CubeIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Ürün bulunamadı</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ searchTerm ? 'Arama kriterlerinize uygun ürün bulunamadı.' : 'Henüz ürün eklenmemiş.' }}
          </p>
          <div class="mt-6">
            <button
              @click="showCreateModal = true"
              class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              <PlusIcon class="-ml-0.5 mr-1.5 h-5 w-5" />
              İlk ürünü ekle
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="card mt-6">
        <div class="flex items-center justify-between px-4 py-3 sm:px-6">
          <div class="flex flex-1 justify-between sm:hidden">
            <button
              :disabled="pagination.page === 1"
              @click="changePage(pagination.page - 1)"
              class="relative inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Önceki
            </button>
            <button
              :disabled="pagination.page === pagination.totalPages"
              @click="changePage(pagination.page + 1)"
              class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Sonraki
            </button>
          </div>
          <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                <span class="font-medium">{{ ((pagination.page - 1) * pagination.limit) + 1 }}</span>
                -
                <span class="font-medium">{{ Math.min(pagination.page * pagination.limit, pagination.total) }}</span>
                arası, toplam
                <span class="font-medium">{{ pagination.total }}</span>
                sonuç
              </p>
            </div>
            <div>
              <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm">
                <button
                  :disabled="pagination.page === 1"
                  @click="changePage(pagination.page - 1)"
                  class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  <ChevronLeftIcon class="h-5 w-5" />
                </button>

                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="changePage(page)"
                  :class="[
                    page === pagination.page
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-900 dark:text-gray-300 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700',
                    'relative inline-flex items-center px-4 py-2 text-sm font-semibold'
                  ]"
                >
                  {{ page }}
                </button>

                <button
                  :disabled="pagination.page === pagination.totalPages"
                  @click="changePage(pagination.page + 1)"
                  class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  <ChevronRightIcon class="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-80 transition-opacity"></div>

        <div class="inline-block transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div class="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                <ExclamationTriangleIcon class="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                  Ürünü Sil
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    <strong class="text-gray-700 dark:text-gray-300">{{ productToDelete?.name }}</strong> adlı ürünü silmek istediğinizden emin misiniz?
                    Bu işlem geri alınamaz.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              @click="handleDelete"
              class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 dark:bg-red-600 dark:hover:bg-red-700 sm:ml-3 sm:w-auto"
            >
              Sil
            </button>
            <button
              @click="showDeleteModal = false"
              class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-600 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 sm:mt-0 sm:w-auto"
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
  ExclamationTriangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'
import { watchDebounced } from '@vueuse/core'

definePageMeta({
  // middleware: 'auth' // Temporarily disabled
})

const { products, loading, meta, fetchProducts, deleteProduct } = useProducts()

// Search and filters
const searchTerm = ref('')
const minPrice = ref<number | undefined>(undefined)
const maxPrice = ref<number | undefined>(undefined)

// Pagination
const pagination = computed(() => ({
  page: meta.value.page,
  limit: meta.value.limit,
  total: meta.value.total,
  totalPages: Math.ceil(meta.value.total / meta.value.limit)
}))

// Modals
const showDeleteModal = ref(false)
const productToDelete = ref(null)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const selectedProduct = ref(null)
const showActionCreateModal = ref(false)
const showActionListModal = ref(false)
const selectedProductForAction = ref(null)

// Computed properties
const visiblePages = computed(() => {
  const pages = []
  const total = pagination.value.totalPages
  const current = pagination.value.page

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      pages.push(1, 2, 3, 4, 5, '...', total)
    } else if (current >= total - 3) {
      pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total)
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', total)
    }
  }

  return pages.filter(page => page !== '...')
})

// Methods
const loadProducts = async (page = 1) => {
  await fetchProducts({
    page,
    search: searchTerm.value || undefined,
    minPrice: minPrice.value,
    maxPrice: maxPrice.value
  })
}

const resetFilters = () => {
  searchTerm.value = ''
  minPrice.value = undefined
  maxPrice.value = undefined
}

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    loadProducts(page)
  }
}

const confirmDelete = (product) => {
  productToDelete.value = product
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (productToDelete.value) {
    try {
      await deleteProduct(productToDelete.value.id)
      await loadProducts(pagination.value.page)
      useToast().showSuccess('Ürün başarıyla silindi')
    } catch (error) {
      useToast().showError('Ürün silinirken bir hata oluştu')
    }
  }
  showDeleteModal.value = false
  productToDelete.value = null

  console.log(showDeleteModal.value);
  
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
const handleProductCreated = async (product) => {
  await loadProducts(pagination.value.page)
  useToast().showSuccess('Ürün başarıyla oluşturuldu')
}

// Handle product edit
const editProduct = (product) => {
  selectedProduct.value = product
  showEditModal.value = true
}

// Handle product update
const handleProductUpdated = async (updatedProduct) => {
  await loadProducts(pagination.value.page)
  useToast().showSuccess('Ürün başarıyla güncellendi')
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
  console.log('Action created successfully')
}

// Watch for search term changes with debounce
watchDebounced(
  [searchTerm, minPrice, maxPrice],
  () => {
    loadProducts(1) // Reset to page 1 when searching or filtering
  },
  { debounce: 500 }
)

// Initialize data
onMounted(async () => {
  await loadProducts()
})

// Page head
useHead({
  title: 'Ürünler - Valdori CRM'
})
</script> 