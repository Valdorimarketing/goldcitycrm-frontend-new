<template>
  <div class="min-h-screen">
    <!-- Header Section -->
    <div class="mb-8">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/25">
              <TagIcon class="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Durum Yönetimi</h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Müşteri durumlarını yönetin ve özelleştirin
              </p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-2">
          <button 
            @click="fetchStatuses()"
            class="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-sm font-medium"
          >
            <ArrowPathIcon class="h-5 w-5" :class="{ 'animate-spin': loading }" />
            Yenile
          </button>
          <button 
            @click="openCreateModal"
            class="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all text-sm font-medium shadow-lg shadow-emerald-500/25"
          >
            <PlusIcon class="h-5 w-5" />
            Yeni Durum
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Toplam</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ statuses.length }}</p>
          </div>
          <div class="h-10 w-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <Squares2X2Icon class="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Aktif</p>
            <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{{ activeCount }}</p>
          </div>
          <div class="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <CheckCircleIcon class="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Hatırlatılabilir</p>
            <p class="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{{ remindableCount }}</p>
          </div>
          <div class="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <BellIcon class="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Satış</p>
            <p class="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">{{ saleCount }}</p>
          </div>
          <div class="h-10 w-10 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
            <CurrencyDollarIcon class="h-5 w-5 text-rose-600 dark:text-rose-400" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Kapalı</p>
            <p class="text-2xl font-bold text-gray-600 dark:text-gray-400 mt-1">{{ closedCount }}</p>
          </div>
          <div class="h-10 w-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <XCircleIcon class="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </div>
        </div>
      </div>
    </div>

    <!-- Search & Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6 overflow-hidden">
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
        <div class="flex items-center gap-2">
          <FunnelIcon class="h-5 w-5 text-gray-400" />
          <span class="font-medium text-gray-700 dark:text-gray-300">Filtreler</span>
        </div>
      </div>

      <div class="p-5">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Search -->
          <div class="relative">
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
              Ara
            </label>
            <div class="relative">
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                v-model="searchQuery" 
                type="text" 
                class="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="Durum adı veya açıklama..."
              />
            </div>
          </div>

          <!-- Type Filter -->
          <div>
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
              Tür
            </label>
            <select 
              v-model="typeFilter" 
              class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none cursor-pointer"
            >
              <option value="">Tümü</option>
              <option value="first">İlk Durum</option>
              <option value="remindable">Hatırlatılabilir</option>
              <option value="sale">Satış</option>
              <option value="closed">Kapalı</option>
              <option value="doctor">Doktor</option>
              <option value="pricing">Fiyatlandırma</option>
            </select>
          </div>

          <!-- Active Filter -->
          <div>
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
              Durum
            </label>
            <select 
              v-model="activeFilter" 
              class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none cursor-pointer"
            >
              <option value="">Tümü</option>
              <option value="active">Aktif</option>
              <option value="inactive">Pasif</option>
            </select>
          </div>

          <!-- Reset -->
          <div class="flex items-end">
            <button 
              @click="resetFilters"
              class="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all text-sm font-medium"
            >
              Filtreleri Temizle
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && statuses.length === 0" class="flex flex-col items-center justify-center py-16">
      <div class="relative">
        <div class="w-12 h-12 rounded-full border-4 border-emerald-100 dark:border-emerald-900"></div>
        <div class="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-transparent border-t-emerald-600 animate-spin"></div>
      </div>
      <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">Durumlar yükleniyor...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 rounded-2xl p-8 text-center">
      <div class="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <ExclamationTriangleIcon class="h-6 w-6 text-red-600 dark:text-red-400" />
      </div>
      <p class="text-red-700 dark:text-red-300 mb-4">{{ error }}</p>
      <button 
        @click="fetchStatuses()"
        class="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all text-sm font-medium"
      >
        Tekrar Dene
      </button>
    </div>

    <!-- Status Grid -->
    <div v-else-if="filteredStatuses.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div 
        v-for="status in filteredStatuses" 
        :key="status.id"
        class="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 transition-all"
      >
        <!-- Color Header -->
        <div 
          class="h-2"
          :style="{ backgroundColor: status.color || '#6b7280' }"
        ></div>

        <div class="p-5">
          <!-- Status Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div 
                class="h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm"
                :style="{ backgroundColor: status.color || '#6b7280' }"
              >
                {{ status.name?.charAt(0)?.toUpperCase() || '?' }}
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="font-semibold text-gray-900 dark:text-white">{{ status.name }}</h3>
                  <span 
                    :class="[
                      'px-2 py-0.5 text-xs font-medium rounded-full',
                      status.isActive 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    ]"
                  >
                    {{ status.isActive ? 'Aktif' : 'Pasif' }}
                  </span>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400">ID: {{ status.id }}</p>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                @click="openEditModal(status)"
                class="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-all"
                title="Düzenle"
              >
                <PencilIcon class="h-4 w-4" />
              </button>
              <button 
                @click="confirmDelete(status)"
                class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                title="Sil"
              >
                <TrashIcon class="h-4 w-4" />
              </button>
            </div>
          </div>

          <!-- Description -->
          <p v-if="status.description" class="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {{ status.description }}
          </p>
          <p v-else class="text-sm text-gray-400 dark:text-gray-500 mb-4 italic">
            Açıklama yok
          </p>

          <!-- Properties -->
          <div class="flex flex-wrap gap-2 mb-4">
            <span 
              v-if="status.isFirst"
              class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            >
              <PlayIcon class="h-3 w-3" />
              İlk Durum
            </span>
            <span 
              v-if="status.isRemindable"
              class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
            >
              <BellIcon class="h-3 w-3" />
              Hatırlatılabilir
              <template v-if="status.remindingDay">({{ status.remindingDay }} gün)</template>
            </span>
            <span 
              v-if="status.isSale"
              class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
            >
              <CurrencyDollarIcon class="h-3 w-3" />
              Satış
            </span>
            <span 
              v-if="status.isClosed"
              class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
            >
              <XCircleIcon class="h-3 w-3" />
              Kapalı
            </span>
            <span 
              v-if="status.isDoctor"
              class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
            >
              <HeartIcon class="h-3 w-3" />
              Doktor
            </span>
            <span 
              v-if="status.isPricing"
              class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
            >
              <CalculatorIcon class="h-3 w-3" />
              Fiyatlandırma
            </span>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
            <div class="flex items-center gap-2">
              <div 
                class="w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"
                :style="{ backgroundColor: status.color || '#6b7280' }"
              ></div>
              <span class="text-xs text-gray-500 dark:text-gray-400 font-mono">{{ status.color || '#6b7280' }}</span>
            </div>
            <span class="text-xs text-gray-400 dark:text-gray-500">
              {{ formatDate(status.updatesAt || status.createdAt) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center">
      <div class="h-16 w-16 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
        <TagIcon class="h-8 w-8 text-gray-400" />
      </div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {{ searchQuery || typeFilter || activeFilter ? 'Sonuç bulunamadı' : 'Henüz durum eklenmemiş' }}
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {{ searchQuery || typeFilter || activeFilter ? 'Arama kriterlerinize uygun durum bulunamadı.' : 'İlk durumunuzu ekleyerek başlayın.' }}
      </p>
      <button 
        v-if="!searchQuery && !typeFilter && !activeFilter"
        @click="openCreateModal"
        class="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all text-sm font-medium"
      >
        <PlusIcon class="h-5 w-5" />
        Yeni Durum Ekle
      </button>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-6 flex items-center justify-center">
      <div class="flex items-center gap-2">
        <button 
          @click="changePage(currentPage - 1)" 
          :disabled="currentPage === 1"
          class="p-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeftIcon class="h-5 w-5" />
        </button>

        <div class="flex items-center gap-1">
          <button 
            v-for="page in displayedPages" 
            :key="page"
            @click="changePage(page)"
            :class="[
              'min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-all',
              currentPage === page
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            ]"
          >
            {{ page }}
          </button>
        </div>

        <button 
          @click="changePage(currentPage + 1)" 
          :disabled="currentPage >= totalPages"
          class="p-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRightIcon class="h-5 w-5" />
        </button>
      </div>
    </div>

    <!-- Status Modal -->
    <StatusModal :show="showModal" :status="selectedStatus" @close="closeModal" @save="handleSave" />

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div 
          v-if="showDeleteConfirm"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <Transition
            enter-active-class="transition-all duration-300"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition-all duration-200"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div 
              v-if="showDeleteConfirm"
              class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div class="p-6 text-center">
                <div class="mx-auto w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                  <ExclamationTriangleIcon class="h-7 w-7 text-red-600 dark:text-red-400" />
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Durumu Sil
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <strong class="text-gray-700 dark:text-gray-300">{{ statusToDelete?.name }}</strong> durumunu silmek istediğinize emin misiniz?
                </p>
                <p class="text-xs text-red-600 dark:text-red-400">
                  Bu işlem geri alınamaz ve bu duruma sahip müşteriler etkilenebilir.
                </p>
              </div>
              <div class="flex gap-3 px-6 pb-6">
                <button 
                  @click="showDeleteConfirm = false"
                  class="flex-1 py-2.5 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                >
                  İptal
                </button>
                <button 
                  @click="handleDelete"
                  :disabled="deleting"
                  class="flex-1 py-2.5 px-4 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ArrowPathIcon v-if="deleting" class="h-4 w-4 animate-spin" />
                  {{ deleting ? 'Siliniyor...' : 'Sil' }}
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { AnyComponent } from '@fullcalendar/core/preact.js'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowPathIcon,
  TagIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  Squares2X2Icon,
  CheckCircleIcon,
  XCircleIcon,
  BellIcon,
  CurrencyDollarIcon,
  PlayIcon,
  HeartIcon,
  CalculatorIcon
} from '@heroicons/vue/24/outline'
import StatusModal from '~/components/StatusModal.vue'
import { useStatuses, type Status } from '~/composables/useStatuses'
import { useToast } from '~/composables/useToast'

const { showSuccess, showError } = useToast()
const {
  statuses,
  loading,
  error,
  currentPage,
  totalPages,
  totalItems,
  fetchStatuses,
  createStatus,
  updateStatus,
  deleteStatus
} = useStatuses()

// Ensure statuses is reactive
if (!statuses.value) statuses.value = []

// Filters
const searchQuery = ref('')
const typeFilter = ref('')
const activeFilter = ref('')

// Modal states
const showModal = ref(false)
const selectedStatus = ref<Status | null>(null)
const showDeleteConfirm = ref(false)
const statusToDelete = ref<Status | null>(null)
const deleting = ref(false)

// Stats Computed
const activeCount = computed(() => statuses.value.filter(s => s.isActive).length)
const remindableCount = computed(() => statuses.value.filter(s => s.isRemindable).length)
const saleCount = computed(() => statuses.value.filter(s => s.isSale).length)
const closedCount = computed(() => statuses.value.filter(s => s.isClosed).length)

// Filtered statuses
const filteredStatuses = computed(() => {
  let result = statuses.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(status =>
      status.name?.toLowerCase().includes(query) ||
      status.description?.toLowerCase().includes(query)
    )
  }

  // Type filter
  if (typeFilter.value) {
    switch (typeFilter.value) {
      case 'first':
        result = result.filter(s => s.isFirst)
        break
      case 'remindable':
        result = result.filter(s => s.isRemindable)
        break
      case 'sale':
        result = result.filter(s => s.isSale)
        break
      case 'closed':
        result = result.filter(s => s.isClosed)
        break
      case 'doctor':
        result = result.filter(s => s.isDoctor)
        break
      case 'pricing':
        result = result.filter(s => s.isPricing)
        break
    }
  }

  // Active filter
  if (activeFilter.value) {
    result = result.filter(s => 
      activeFilter.value === 'active' ? s.isActive : !s.isActive
    )
  }

  return result
}) as any

// Pagination
const displayedPages = computed(() => {
  const pages = []
  const maxPages = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxPages / 2))
  let end = Math.min(totalPages.value, start + maxPages - 1)

  if (end - start < maxPages - 1) {
    start = Math.max(1, end - maxPages + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// Methods
const resetFilters = () => {
  searchQuery.value = ''
  typeFilter.value = ''
  activeFilter.value = ''
}

const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const openCreateModal = () => {
  selectedStatus.value = null
  showModal.value = true
}

const openEditModal = (status: Status) => {
  selectedStatus.value = status
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedStatus.value = null
}

const handleSave = async (data: Partial<Status>) => {
  try {
    if (selectedStatus.value) {
      await updateStatus(selectedStatus.value.id, data)
      showSuccess('Durum başarıyla güncellendi')
    } else {
      await createStatus(data)
      showSuccess('Durum başarıyla oluşturuldu')
    }
    await fetchStatuses(currentPage.value)
    closeModal()
  } catch (err: any) {
    showError(err.message || 'Bir hata oluştu')
  }
}

const confirmDelete = (status: Status) => {
  statusToDelete.value = status
  showDeleteConfirm.value = true
}

const handleDelete = async () => {
  if (!statusToDelete.value) return

  deleting.value = true
  try {
    await deleteStatus(statusToDelete.value.id)
    showSuccess('Durum başarıyla silindi')
    await fetchStatuses(currentPage.value)
    showDeleteConfirm.value = false
    statusToDelete.value = null
  } catch (err: any) {
    showError(err.message || 'Durum silinirken bir hata oluştu')
  } finally {
    deleting.value = false
  }
}

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    fetchStatuses(page)
  }
}

onMounted(() => {
  fetchStatuses()
})

useHead({ title: 'Durum Yönetimi - Valdori CRM' })
</script>