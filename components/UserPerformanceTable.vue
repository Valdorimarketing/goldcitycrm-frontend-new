<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Kullanıcı Performans Analizi</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Satış temsilcilerinin detaylı performans metrikleri ve karşılaştırması
      </p>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4">
        <p class="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase mb-1">Aktif Temsilci</p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ users.length }}</p>
      </div>

      <div
        class="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-xl p-4">
        <p class="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase mb-1">En Yüksek Satış</p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ topPerformer?.totalSales || 0 }}</p>
        <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ topPerformer?.userName || '-' }}</p>
      </div>

      <div
        class="bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20 rounded-xl p-4">
        <p class="text-xs font-medium text-rose-600 dark:text-rose-400 uppercase mb-1">Ortalama Satış</p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ avgSalesPerUser }}</p>
        <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">satış/temsilci</p>
      </div>

      <div
        class="bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20 rounded-xl p-4">
        <p class="text-xs font-medium text-rose-600 dark:text-rose-400 uppercase mb-1">En Yüksek Başarı</p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ topConversionRate }}%</p>
        <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">tamamlanma oranı</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-16">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-rose-600"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400">Kullanıcı verileri yükleniyor...</p>
      </div>
    </div>

    <!-- Users Table -->
    <div v-else class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-900/50">
          <tr>
            <th
              class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Sıra
            </th>
            <th
              class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Satış Temsilcisi
            </th>
            <th
              class="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Toplam Satış
            </th>
            <th
              class="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Tamamlanan
            </th>
            <th
              class="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Kısmi Ödeme
            </th>
            <th
              class="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Ödenmedi
            </th>
            <th
              class="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Başarı Oranı
            </th>
            <th
              class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Para Birimi Dağılımı
            </th>
            <th
              class="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              İşlemler
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
          <tr v-for="(user, index) in sortedUsers" :key="user.userId"
            class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <!-- Rank -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center justify-center">
                <div v-if="index < 3"
                  class="h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm"
                  :class="getRankClass(index)">
                  {{ index + 1 }}
                </div>
                <span v-else class="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  {{ index + 1 }}
                </span>
              </div>
            </td>

            <!-- User Name -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div
                  class="h-10 w-10 rounded-full bg-gradient-to-br to-rose-500 to-rose-500 flex items-center justify-center shadow-lg">
                  <span class="text-sm font-bold text-white">
                    {{ user.userName?.charAt(0)?.toUpperCase() || '?' }}
                  </span>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-semibold text-gray-900 dark:text-white">
                    {{ user.userName || 'Bilinmeyen' }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    ID: {{ user.userId }}
                  </div>
                </div>
              </div>
            </td>

            <!-- Total Sales -->
            <td class="px-6 py-4 whitespace-nowrap text-center">
              <div class="text-sm font-bold text-gray-900 dark:text-white">
                {{ user.totalSales }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                satış
              </div>
            </td>

            <!-- Completed -->
            <td class="px-6 py-4 whitespace-nowrap text-center">
              <div class="inline-flex flex-col items-center">
                <span class="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {{ user.completedSales }}
                </span>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatPercentage(user.completedSales, user.totalSales) }}%
                </span>
              </div>
            </td>

            <!-- Partial -->
            <td class="px-6 py-4 whitespace-nowrap text-center">
              <div class="inline-flex flex-col items-center">
                <span class="text-sm font-semibold text-rose-600 dark:text-rose-400">
                  {{ user.partialSales }}
                </span>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatPercentage(user.partialSales, user.totalSales) }}%
                </span>
              </div>
            </td>

            <!-- Unpaid -->
            <td class="px-6 py-4 whitespace-nowrap text-center">
              <div class="inline-flex flex-col items-center">
                <span class="text-sm font-semibold text-red-600 dark:text-red-400">
                  {{ user.unpaidSales }}
                </span>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatPercentage(user.unpaidSales, user.totalSales) }}%
                </span>
              </div>
            </td>

            <!-- Conversion Rate -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex flex-col items-center">
                <div class="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  {{ formatPercentage(user.completedSales, user.totalSales) }}%
                </div>
                <div class="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div class="bg-emerald-500 h-2 rounded-full transition-all duration-1000"
                    :style="{ width: formatPercentage(user.completedSales, user.totalSales) + '%' }"></div>
                </div>
              </div>
            </td>

            <!-- Currency Breakdown -->
            <td class="px-6 py-4">
              <div class="flex flex-wrap gap-2">
                <div v-for="(data, currency) in user.salesByCurrency" :key="currency"
                  class="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-xs">
                  <span class="mr-1">{{ getCurrencyEmoji(currency) }}</span>
                  <span class="font-semibold text-gray-900 dark:text-white">{{ data.count }}</span>
                  <span class="mx-1 text-gray-400">•</span>
                  <span class="text-gray-600 dark:text-gray-400">{{ formatMoney(data.totalAmount, currency) }}</span>
                </div>
              </div>
            </td>

            <!-- Actions -->
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <button @click="$emit('select-user', user.userId)"
                class="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/50 dark:text-rose-300 dark:hover:bg-rose-900 transition-colors">
                <FunnelIcon class="h-3.5 w-3.5 mr-1" />
                Filtrele
              </button>
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-if="users.length === 0">
            <td colspan="9" class="text-center py-16">
              <div class="flex flex-col items-center">
                <div class="p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                  <UserGroupIcon class="h-12 w-12 text-gray-400" />
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Kullanıcı bulunamadı</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Henüz satış yapan kullanıcı kaydı bulunmamaktadır.
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Performance Chart (Optional) -->
    <div v-if="users.length > 0" class="mt-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
      <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">Performans Karşılaştırması</h4>
      <div class="space-y-3">
        <div v-for="user in sortedUsers.slice(0, 5)" :key="'chart-' + user.userId" class="flex items-center gap-4">
          <div class="w-32 text-sm text-gray-600 dark:text-gray-400 truncate">
            {{ user.userName }}
          </div>
          <div class="flex-1">
            <div class="relative pt-1">
              <div class="flex mb-2 items-center justify-between">
                <div>
                  <span class="text-xs font-semibold inline-block text-rose-600 dark:text-rose-400">
                    {{ user.totalSales }} satış
                  </span>
                </div>
              </div>
              <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 dark:bg-gray-600">
                <div class="bg-emerald-500 transition-all duration-1000"
                  :style="{ width: formatPercentage(user.completedSales, user.totalSales) + '%' }"></div>
                <div class="bg-rose-500 transition-all duration-1000"
                  :style="{ width: formatPercentage(user.partialSales, user.totalSales) + '%' }"></div>
                <div class="bg-red-500 transition-all duration-1000"
                  :style="{ width: formatPercentage(user.unpaidSales, user.totalSales) + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { UserGroupIcon, FunnelIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  users: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select-user'])

const sortedUsers = computed(() => {
  return [...props.users].sort((a, b) => b.totalSales - a.totalSales)
})

const topPerformer = computed(() => {
  return sortedUsers.value[0] || null
})

const avgSalesPerUser = computed(() => {
  if (props.users.length === 0) return 0
  const total = props.users.reduce((sum, user) => sum + user.totalSales, 0)
  return Math.round(total / props.users.length)
})

const topConversionRate = computed(() => {
  if (props.users.length === 0) return 0
  const rates = props.users.map(user =>
    user.totalSales > 0 ? (user.completedSales / user.totalSales) * 100 : 0
  )
  return Math.max(...rates).toFixed(1)
})

const getRankClass = (index) => {
  if (index === 0) return 'bg-yellow-400 text-yellow-900'
  if (index === 1) return 'bg-gray-300 text-black'
  if (index === 2) return 'bg-orange-400 text-orange-900'
  return ''
}

const formatPercentage = (value, total) => {
  if (total === 0) return 0
  return ((value / total) * 100).toFixed(1)
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

const getCurrencyEmoji = (code) => {
  const emojis = { TRY: '🇹🇷', EUR: '🇪🇺', USD: '🇺🇸', GBP: '🇬🇧' }
  return emojis[code] || '💰'
}
</script>