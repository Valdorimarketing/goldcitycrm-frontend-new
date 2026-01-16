<template>
  <div>
    <!-- Table Controls -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-4">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          <span class="font-semibold text-gray-900 dark:text-white">{{ sales.length }}</span> satış gösteriliyor
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button @click="sortBy('date')"
          class="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
          <ArrowsUpDownIcon class="h-4 w-4 inline mr-1" />
          Tarih
        </button>
        <button @click="sortBy('amount')"
          class="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
          <ArrowsUpDownIcon class="h-4 w-4 inline mr-1" />
          Tutar
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-16">
      <div class="relative">
        <div class="w-16 h-16 border-4 border-rose-200 dark:border-rose-900 rounded-full animate-spin"></div>
        <div
          class="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-rose-600 rounded-full animate-spin">
        </div>
      </div>
      <p class="mt-4 text-gray-600 dark:text-gray-400 animate-pulse">Satışlar yükleniyor...</p>
    </div>

    <!-- Sales Table -->
    <div v-else class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-900/50">
          <tr>
            <th
              class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              #ID
            </th>
            <th
              class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Müşteri
            </th>
            <th
              class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Satış Temsilcisi
            </th>
            <th
              class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Ürünler
            </th>
            <th
              class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Toplam
            </th>
            <th
              class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Alınan
            </th>
            <th
              class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Kalan
            </th>
            <th
              class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Durum
            </th>
            <th
              class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Tarih
            </th>
            <th
              class="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              İşlemler
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
          <tr v-for="(sale, index) in sortedSales" :key="sale.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            :style="{ animationDelay: index * 30 + 'ms' }">
            <!-- Sale ID -->
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="text-sm font-mono font-semibold text-gray-900 dark:text-white">
                #{{ sale.originalId }}
              </span>
            </td>

            <!-- Customer -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div
                  class="h-10 w-10 rounded-full bg-gradient-to-br to-rose-500 to-rose-500 flex items-center justify-center shadow-lg">
                  <span class="text-sm font-bold text-white">
                    {{ sale.customer?.name?.charAt(0)?.toUpperCase() || '?' }}
                  </span>
                </div>
                <div class="ml-4">
                  <NuxtLink :to="`/customers/show/${sale.customer?.id}`"
                    class="text-sm font-semibold text-gray-900 dark:text-white hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                    {{ sale.customer?.name || 'Bilinmeyen' }}
                  </NuxtLink>
                  <p class="text-xs text-gray-500 dark:text-gray-400">ID: {{ sale.customer?.id }}</p>
                </div>
              </div>
            </td>

            <!-- Sales Rep -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                  <span class="text-xs font-semibold text-gray-600 dark:text-gray-300">
                    {{ sale.userName?.charAt(0)?.toUpperCase() || '?' }}
                  </span>
                </div>
                <span class="ml-2 text-sm text-gray-900 dark:text-white">
                  {{ sale.userName || 'Bilinmeyen' }}
                </span>
              </div>
            </td>

            <!-- Products -->
            <td class="px-6 py-4">
              <div class="flex flex-col gap-1">
                <span v-for="product in sale.products?.slice(0, 2)" :key="product.id"
                  class="text-xs text-gray-600 dark:text-gray-400 truncate max-w-xs">
                  {{ product.productDetails?.name || 'Bilinmeyen' }}
                </span>
                <span v-if="sale.products?.length > 2" class="text-xs text-rose-600 dark:text-rose-400">
                  +{{ sale.products.length - 2 }} daha
                </span>
              </div>
            </td>

            <!-- Total Amount -->
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="text-sm font-semibold text-gray-900 dark:text-white">
                {{ formatMoney(sale.totalAmount, sale.currency) }}
              </span>
            </td>

            <!-- Paid Amount -->
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                {{ formatMoney(sale.paidAmount, sale.currency) }}
              </span>
            </td>

            <!-- Remaining Amount -->
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="text-sm font-semibold"
                :class="sale.remainingAmount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-gray-400'">
                {{ formatMoney(sale.remainingAmount, sale.currency) }}
              </span>
            </td>

            <!-- Status -->
            <td class="px-6 py-4 whitespace-nowrap">
              <span v-if="sale.isFullyPaid"
                class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                <CheckCircleIcon class="w-3.5 h-3.5 mr-1" />
                Tamamlandı
              </span>
              <span v-else-if="sale.paidAmount > 0"
                class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300">
                <ClockIcon class="w-3.5 h-3.5 mr-1" />
                Kısmi Ödeme
              </span>
              <span v-else
                class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">
                <XCircleIcon class="w-3.5 h-3.5 mr-1" />
                Ödenmedi
              </span>
            </td>

            <!-- Date -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex flex-col">
                <span class="text-sm text-gray-900 dark:text-gray-100">{{ formatDate(sale.date) }}</span>
                <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatTime(sale.date) }}</span>
              </div>
            </td>

            <!-- Actions -->
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <button @click="$emit('view-detail', sale)"
                class="p-2 text-rose-600 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-900/50 rounded-lg transition-colors"
                title="Detayları Görüntüle">
                <EyeIcon class="h-5 w-5" />
              </button>
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-if="sales.length === 0">
            <td colspan="10" class="text-center py-16">
              <div class="flex flex-col items-center">
                <div class="p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                  <ShoppingBagIcon class="h-12 w-12 text-gray-400" />
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Satış bulunamadı</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Filtrelere uygun satış kaydı bulunamadı.
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Table Footer with Stats -->
    <div v-if="sales.length > 0"
      class="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl flex items-center justify-between">
      <div class="flex items-center gap-6">
        <div>
          <p class="text-xs text-gray-500 dark:text-gray-400">Toplam Satış</p>
          <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ totalSales }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-500 dark:text-gray-400">Toplam Tutar</p>
          <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ totalAmount }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-500 dark:text-gray-400">Tahsil Edilen</p>
          <p class="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{{ totalPaid }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-500 dark:text-gray-400">Bekleyen</p>
          <p class="text-sm font-semibold text-rose-600 dark:text-rose-400">{{ totalRemaining }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ShoppingBagIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  ArrowsUpDownIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  sales: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['view-detail'])

const sortField = ref('date')
const sortOrder = ref('desc')

const sortBy = (field) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'desc'
  }
}

const sortedSales = computed(() => {
  const sales = [...props.sales]

  sales.sort((a, b) => {
    let aVal, bVal

    switch (sortField.value) {
      case 'date':
        aVal = new Date(a.date)
        bVal = new Date(b.date)
        break
      case 'amount':
        aVal = a.totalAmount
        bVal = b.totalAmount
        break
      default:
        return 0
    }

    if (sortOrder.value === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })

  return sales
})

const totalSales = computed(() => props.sales.length)

const totalAmount = computed(() => {
  const currencies = new Map()
  props.sales.forEach(sale => {
    const curr = sale.currency
    if (!currencies.has(curr)) {
      currencies.set(curr, 0)
    }
    currencies.set(curr, currencies.get(curr) + sale.totalAmount)
  })

  return Array.from(currencies.entries())
    .map(([curr, amount]) => formatMoney(amount, curr))
    .join(', ')
})

const totalPaid = computed(() => {
  const currencies = new Map()
  props.sales.forEach(sale => {
    const curr = sale.currency
    if (!currencies.has(curr)) {
      currencies.set(curr, 0)
    }
    currencies.set(curr, currencies.get(curr) + sale.paidAmount)
  })

  return Array.from(currencies.entries())
    .map(([curr, amount]) => formatMoney(amount, curr))
    .join(', ')
})

const totalRemaining = computed(() => {
  const currencies = new Map()
  props.sales.forEach(sale => {
    const curr = sale.currency
    if (!currencies.has(curr)) {
      currencies.set(curr, 0)
    }
    currencies.set(curr, currencies.get(curr) + sale.remainingAmount)
  })

  return Array.from(currencies.entries())
    .map(([curr, amount]) => formatMoney(amount, curr))
    .join(', ')
})

const formatMoney = (amount, currencyCode = 'TRY') => {
  const value = Number(amount || 0)
  try {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currencyCode || 'TRY'
    }).format(value)
  } catch (e) {
    return new Intl.NumberFormat('tr-TR').format(value) + ' ' + currencyCode
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('tr-TR')
}

const formatTime = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

tbody tr {
  animation: fadeInUp 0.3s ease-out forwards;
  opacity: 0;
}
</style>