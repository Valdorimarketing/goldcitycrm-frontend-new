<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Ürün Analizi</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        En çok satan ürünler ve kategori bazlı performans analizi
      </p>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-xl p-4">
        <p class="text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase mb-1">Toplam Ürün</p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ products.length }}</p>
      </div>

      <div class="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-xl p-4">
        <p class="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase mb-1">En Çok Satan</p>
        <p class="text-lg font-bold text-gray-900 dark:text-white truncate">{{ topProduct?.name || '-' }}</p>
        <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ topProduct?.salesCount || 0 }} satış</p>
      </div>

      <div class="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4">
        <p class="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase mb-1">Toplam Ciro</p>
        <p class="text-lg font-bold text-gray-900 dark:text-white">{{ totalRevenue }}</p>
      </div>

      <div class="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl p-4">
        <p class="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase mb-1">Ort. Satış Değeri</p>
        <p class="text-lg font-bold text-gray-900 dark:text-white">{{ avgProductRevenue }}</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-16">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-indigo-600"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400">Ürün verileri yükleniyor...</p>
      </div>
    </div>

    <!-- Top Products Grid -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Top Selling Products -->
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white">En Çok Satan Ürünler</h4>
          <span class="text-xs text-gray-500 dark:text-gray-400">Top 10</span>
        </div>

        <div class="space-y-4">
          <div v-for="(product, index) in topProducts" :key="product.id"
            class="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <!-- Rank Badge -->
            <div class="flex-shrink-0">
              <div v-if="index < 3" class="h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm"
                :class="getRankClass(index)">
                {{ index + 1 }}
              </div>
              <div v-else
                class="h-10 w-10 rounded-full flex items-center justify-center font-semibold text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                {{ index + 1 }}
              </div>
            </div>

            <!-- Product Info -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {{ product.name }}
              </p>
              <div class="flex items-center gap-2 mt-1">
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {{ product.salesCount }} satış
                </span>
                <span class="text-xs text-gray-400">•</span>
                <span class="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  {{ formatMoney(product.totalRevenue, product.currency) }}
                </span>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="flex-shrink-0 w-20">
              <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div class="bg-indigo-500 h-2 rounded-full transition-all duration-1000"
                  :style="{ width: getProductPercentage(product.salesCount) + '%' }"></div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="products.length === 0" class="text-center py-8">
            <CubeIcon class="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p class="text-sm text-gray-500 dark:text-gray-400">Ürün verisi bulunamadı</p>
          </div>
        </div>
      </div>

      <!-- Revenue by Currency -->
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Para Birimi Bazlı Ciro</h4>
        </div>

        <div class="space-y-4">
          <div v-for="item in revenueByCurrency" :key="item.currency"
            class="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <span class="text-2xl">{{ getCurrencyEmoji(item.currency) }}</span>
                <span class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ getCurrencyLabel(item.currency) }}
                </span>
              </div>
              <span class="text-xs px-2 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                {{ item.productCount }} ürün
              </span>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ formatMoney(item.totalRevenue, item.currency) }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {{ item.salesCount }} satış
                </p>
              </div>

              <div class="text-right">
                <p class="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  {{ item.percentage.toFixed(1) }}%
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  toplam ciro
                </p>
              </div>
            </div>

            <div class="mt-3 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div class="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                :style="{ width: item.percentage + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Products Table -->
    <div class="mt-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Tüm Ürünler</h4>
          <input v-model="productSearch" type="text" placeholder="Ürün ara..."
            class="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white">
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Ürün Adı
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Satış Sayısı
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Para Birimi
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Toplam Ciro
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Ortalama
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="product in filteredProducts" :key="product.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mr-3">
                    <CubeIcon class="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-gray-900 dark:text-white">
                      {{ product.name }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">ID: {{ product.id }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-center">
                <span class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ product.salesCount }}
                </span>
              </td>
              <td class="px-6 py-4 text-center">
                <span class="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-xs font-medium">
                  {{ getCurrencyEmoji(product.currency) }} {{ product.currency }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <span class="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {{ formatMoney(product.totalRevenue, product.currency) }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <span class="text-sm text-gray-600 dark:text-gray-400">
                  {{ formatMoney(product.totalRevenue / product.salesCount, product.currency) }}
                </span>
              </td>
            </tr>

            <tr v-if="filteredProducts.length === 0">
              <td colspan="5" class="text-center py-8">
                <p class="text-sm text-gray-500 dark:text-gray-400">Ürün bulunamadı</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { CubeIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  products: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const productSearch = ref('')

const topProducts = computed(() => {
  return props.products.slice(0, 10)
})

const topProduct = computed(() => {
  return props.products[0] || null
})

const maxSales = computed(() => {
  if (props.products.length === 0) return 0
  return Math.max(...props.products.map(p => p.salesCount))
})

const totalRevenue = computed(() => {
  const currencies = new Map()
  props.products.forEach(product => {
    const curr = product.currency
    if (!currencies.has(curr)) {
      currencies.set(curr, 0)
    }
    currencies.set(curr, currencies.get(curr) + product.totalRevenue)
  })

  return Array.from(currencies.entries())
    .map(([curr, amount]) => formatMoney(amount, curr))
    .join(', ')
})

const avgProductRevenue = computed(() => {
  if (props.products.length === 0) return '-'
  const currencies = new Map()

  props.products.forEach(product => {
    const curr = product.currency
    if (!currencies.has(curr)) {
      currencies.set(curr, { total: 0, count: 0 })
    }
    const data = currencies.get(curr)
    data.total += product.totalRevenue
    data.count++
  })

  return Array.from(currencies.entries())
    .map(([curr, data]) => formatMoney(data.total / data.count, curr))
    .join(', ')
})

const revenueByCurrency = computed(() => {
  const currencies = new Map()

  props.products.forEach(product => {
    const curr = product.currency
    if (!currencies.has(curr)) {
      currencies.set(curr, {
        currency: curr,
        totalRevenue: 0,
        salesCount: 0,
        productCount: 0
      })
    }
    const data = currencies.get(curr)
    data.totalRevenue += product.totalRevenue
    data.salesCount += product.salesCount
    data.productCount++
  })

  const total = Array.from(currencies.values()).reduce((sum, item) => sum + item.totalRevenue, 0)

  return Array.from(currencies.values()).map(item => ({
    ...item,
    percentage: total > 0 ? (item.totalRevenue / total) * 100 : 0
  })).sort((a, b) => b.totalRevenue - a.totalRevenue)
})

const filteredProducts = computed(() => {
  if (!productSearch.value) return props.products

  const search = productSearch.value.toLowerCase()
  return props.products.filter(product =>
    product.name?.toLowerCase().includes(search)
  )
})

const getRankClass = (index) => {
  if (index === 0) return 'bg-yellow-400 text-yellow-900'
  if (index === 1) return 'bg-gray-300 text-gray-700'
  if (index === 2) return 'bg-orange-400 text-orange-900'
  return ''
}

const getProductPercentage = (salesCount) => {
  if (maxSales.value === 0) return 0
  return (salesCount / maxSales.value) * 100
}

const formatMoney = (amount, currencyCode = 'TRY') => {
  const value = Number(amount || 0)
  try {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currencyCode || 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  } catch (e) {
    return new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(value) + ' ' + currencyCode
  }
}

const getCurrencyLabel = (code) => {
  const labels = { TRY: 'Türk Lirası', EUR: 'Euro', USD: 'Dolar', GBP: 'Sterlin' }
  return labels[code] || code
}

const getCurrencyEmoji = (code) => {
  const emojis = { TRY: '🇹🇷', EUR: '🇪🇺', USD: '🇺🇸', GBP: '🇬🇧' }
  return emojis[code] || '💰'
}
</script>