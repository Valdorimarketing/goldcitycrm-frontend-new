<template>
  <div class="min-h-screen">
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <div class="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
            <ChartBarIcon class="h-8 w-8 text-white" />
          </div>
          Satış Finans Paneli
        </h1>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Detaylı satış ve ödeme takibi
        </p>
      </div>

      <div class="flex gap-3 mt-4 sm:mt-0">
        <button @click="resetFilters" class="btn-secondary flex items-center gap-2 hover:scale-105 transition-transform">
          <FunnelIcon class="h-5 w-5" />
          Filtreleri Temizle
        </button>
        <button @click="loadSalesData" :disabled="loading"
          class="btn-primary flex items-center gap-2 hover:scale-105 transition-transform">
          <ArrowPathIcon class="h-5 w-5" :class="{ 'animate-spin': loading }" />
          Yenile
        </button>
      </div>
    </div>

    <!-- Currency Toggle -->
    <div class="flex justify-center mb-6">
      <div class="inline-flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1 shadow-inner">
        <button
          v-for="curr in availableCurrencies"
          :key="curr"
          @click="activeCurrency = curr"
          class="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300"
          :class="activeCurrency === curr 
            ? 'bg-white dark:bg-gray-700 shadow-lg text-indigo-600 dark:text-indigo-400 scale-105' 
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
        >
          {{ getCurrencyLabel(curr) }}
        </button>
      </div>
    </div>

    <!-- Grand Total Card (Genel Toplam) -->
    <div class="mb-8">
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 p-6 shadow-2xl border border-slate-700">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-10">
          <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
        </div>
        
        <div class="relative">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-lg">
                <GlobeAltIcon class="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 class="text-xl font-bold text-white">Genel Toplam (USD)</h3>
                <p class="text-sm text-slate-400">Tüm para birimleri Dolar'a çevrildi</p>
              </div>
            </div>
            
            <!-- Exchange Rate Info -->
            <div class="text-right">
              <div class="flex items-center gap-2 text-xs text-slate-400">
                <ArrowPathIcon class="h-4 w-4" :class="{ 'animate-spin': loadingRates }" />
                <span>Kurlar: {{ formatRateDate(ratesLastUpdated) }}</span>
              </div>
              <button @click="refreshExchangeRates" :disabled="loadingRates"
                class="mt-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                Kurları Güncelle
              </button>
            </div>
          </div>

          <!-- Grand Total Stats -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <!-- Toplam Satış (USD) -->
            <div class="bg-slate-800/50 rounded-xl p-5 backdrop-blur border border-slate-700/50">
              <div class="flex items-center gap-3 mb-3">
                <div class="p-2 bg-blue-500/20 rounded-lg">
                  <BanknotesIcon class="h-5 w-5 text-blue-400" />
                </div>
                <span class="text-sm text-slate-400">Toplam Satış</span>
              </div>
              <p class="text-2xl font-bold text-white">
                {{ formatMoney(grandTotal.totalSalesInUsd, 'USD') }}
              </p>
            </div>

            <!-- Kasaya Giren (USD) -->
            <div class="bg-slate-800/50 rounded-xl p-5 backdrop-blur border border-slate-700/50">
              <div class="flex items-center gap-3 mb-3">
                <div class="p-2 bg-emerald-500/20 rounded-lg">
                  <WalletIcon class="h-5 w-5 text-emerald-400" />
                </div>
                <span class="text-sm text-slate-400">Kasaya Giren</span>
              </div>
              <p class="text-2xl font-bold text-emerald-400">
                {{ formatMoney(grandTotal.totalPaidInUsd, 'USD') }}
              </p>
              <div class="mt-2 w-full bg-slate-700 rounded-full h-1.5">
                <div class="bg-emerald-500 h-1.5 rounded-full transition-all duration-1000"
                  :style="{ width: grandTotalPaidPercentage + '%' }"></div>
              </div>
            </div>

            <!-- Beklenen (USD) -->
            <div class="bg-slate-800/50 rounded-xl p-5 backdrop-blur border border-slate-700/50">
              <div class="flex items-center gap-3 mb-3">
                <div class="p-2 bg-amber-500/20 rounded-lg">
                  <ClockIcon class="h-5 w-5 text-amber-400" />
                </div>
                <span class="text-sm text-slate-400">Beklenen Ödeme</span>
              </div>
              <p class="text-2xl font-bold text-amber-400">
                {{ formatMoney(grandTotal.totalRemainingInUsd, 'USD') }}
              </p>
            </div>
          </div>

          <!-- Currency Breakdown -->
          <div class="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
            <p class="text-xs text-slate-500 mb-3 font-medium uppercase tracking-wider">Para Birimi Dökümü</p>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div v-for="item in grandTotal.breakdown" :key="item.currency"
                class="bg-slate-700/30 rounded-lg p-3 hover:bg-slate-700/50 transition-colors">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-white">{{ getCurrencyEmoji(item.currency) }} {{ item.currency }}</span>
                  <span class="text-xs text-slate-400">1 {{ item.currency }} = ${{ item.rate?.toFixed(4) }}</span>
                </div>
                <p class="text-sm text-slate-300">{{ formatMoney(item.totalSales, item.currency) }}</p>
                <p class="text-xs text-slate-500">= {{ formatMoney(item.totalSalesInUsd, 'USD') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    
    <!-- Monthly Stats Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- Bu Ay Satış -->
      <div class="col-span-1 lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
              <CalendarDaysIcon class="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ currentMonthTitle }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Aylık performans özeti</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="curr in availableCurrencies" :key="'month-' + curr" 
            class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            @click="activeCurrency = curr">
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">{{ getCurrencyLabel(curr) }} Satış</p>
            <p class="text-xl font-bold text-gray-900 dark:text-white">
              {{ formatMoney(getMonthlyStats(curr).totalSales, curr) }}
            </p>
            <div class="flex items-center mt-2 text-xs">
              <span class="text-emerald-600 dark:text-emerald-400">
                {{ formatMoney(getMonthlyStats(curr).totalPaid, curr) }} kasada
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Ödeme Durumu Dağılımı -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
        <div class="flex items-center gap-3 mb-6">
          <div class="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-xl">
            <ChartPieIcon class="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Ödeme Durumu</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ activeCurrency }} bazında</p>
          </div>
        </div>

        <div class="space-y-4">
          <!-- Tamamlanan -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span class="text-sm text-gray-600 dark:text-gray-400">Tamamlanan</span>
            </div>
            <span class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ getStatsByCurrency(activeCurrency).completedCount }}
            </span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div class="bg-emerald-500 h-2 rounded-full transition-all duration-1000"
              :style="{ width: getStatsByCurrency(activeCurrency).completedPercentage + '%' }"></div>
          </div>

          <!-- Kısmi Ödeme -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-amber-500"></div>
              <span class="text-sm text-gray-600 dark:text-gray-400">Kısmi Ödeme</span>
            </div>
            <span class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ getStatsByCurrency(activeCurrency).partialCount }}
            </span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div class="bg-amber-500 h-2 rounded-full transition-all duration-1000"
              :style="{ width: getStatsByCurrency(activeCurrency).partialPercentage + '%' }"></div>
          </div>

          <!-- Ödenmedi -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-red-500"></div>
              <span class="text-sm text-gray-600 dark:text-gray-400">Ödenmedi</span>
            </div>
            <span class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ getStatsByCurrency(activeCurrency).unpaidCount }}
            </span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div class="bg-red-500 h-2 rounded-full transition-all duration-1000"
              :style="{ width: getStatsByCurrency(activeCurrency).unpaidPercentage + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- All Currencies Summary -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <div v-for="curr in availableCurrencies" :key="'summary-' + curr"
        class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 border border-gray-100 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-300 cursor-pointer"
        :class="{ 'ring-2 ring-indigo-500': activeCurrency === curr }"
        @click="activeCurrency = curr">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <span class="text-2xl">{{ getCurrencyEmoji(curr) }}</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ getCurrencyLabel(curr) }}</span>
          </div>
          <span class="text-xs px-2 py-1 rounded-full"
            :class="activeCurrency === curr ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'">
            {{ getStatsByCurrency(curr).salesCount }} satış
          </span>
        </div>
        
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500 dark:text-gray-400">Toplam</span>
            <span class="font-bold text-gray-900 dark:text-white">{{ formatMoney(getStatsByCurrency(curr).totalSales, curr) }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-emerald-600 dark:text-emerald-400">Kasada</span>
            <span class="font-semibold text-emerald-600 dark:text-emerald-400">{{ formatMoney(getStatsByCurrency(curr).totalPaid, curr) }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-amber-600 dark:text-amber-400">Beklenen</span>
            <span class="font-semibold text-amber-600 dark:text-amber-400">{{ formatMoney(getStatsByCurrency(curr).totalRemaining, curr) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6 border border-gray-100 dark:border-gray-700">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ara
          </label>
          <div class="relative">
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              v-model="searchTerm"
              type="text"
              class="form-input pl-10"
              placeholder="Müşteri, açıklama..."
            />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Başlangıç Tarihi
          </label>
          <input v-model="startDate" type="date" class="form-input" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bitiş Tarihi
          </label>
          <input v-model="endDate" type="date" class="form-input" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ödeme Durumu
          </label>
          <select v-model="paymentFilter" class="form-select">
            <option value="all">Tümü</option>
            <option value="completed">Tamamlanan</option>
            <option value="partial">Kısmi Ödeme</option>
            <option value="unpaid">Ödenmedi</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-16">
      <div class="relative">
        <div class="w-16 h-16 border-4 border-indigo-200 dark:border-indigo-900 rounded-full animate-spin"></div>
        <div class="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
      <p class="mt-4 text-gray-600 dark:text-gray-400 animate-pulse">Veriler yükleniyor...</p>
    </div>

    <!-- Sales Table -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Müşteri
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Açıklama
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Toplam
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Alınan
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Kalan
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Durum
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Tarih
              </th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="(sale, index) in filteredSales" :key="sale.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              :style="{ animationDelay: index * 50 + 'ms' }">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                    <span class="text-sm font-bold text-white">
                      {{ sale.customer?.name?.charAt(0)?.toUpperCase() || '?' }}
                    </span>
                  </div>
                  <div class="ml-4">
                    <NuxtLink
                      :to="`/customers/show/${sale.customer?.id}`"
                      class="text-sm font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                      {{ sale.customer?.name || 'Bilinmeyen' }}
                    </NuxtLink>
                    <p class="text-xs text-gray-500 dark:text-gray-400">ID: {{ sale.customer?.id }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm text-gray-900 dark:text-gray-100 truncate max-w-xs">{{ sale.description || '-' }}</p>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ formatMoney(sale.totalAmount, sale.currency) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {{ formatMoney(sale.paidAmount, sale.currency) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-semibold" :class="sale.remainingAmount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-400'">
                  {{ formatMoney(sale.remainingAmount, sale.currency) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="sale.isFullyPaid" 
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                  <CheckCircleIcon class="w-3.5 h-3.5 mr-1" />
                  Tamamlandı
                </span>
                <span v-else-if="sale.paidAmount > 0"
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                  <ClockIcon class="w-3.5 h-3.5 mr-1" />
                  Kısmi Ödeme
                </span>
                <span v-else
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">
                  <XCircleIcon class="w-3.5 h-3.5 mr-1" />
                  Ödenmedi
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <p class="text-sm text-gray-900 dark:text-gray-100">{{ formatDate(sale.date) }}</p>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <button
                  @click="viewSaleDetails(sale)"
                  class="p-2 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-lg transition-colors">
                  <EyeIcon class="h-5 w-5" />
                </button>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="filteredSales.length === 0">
              <td colspan="8" class="text-center py-16">
                <div class="flex flex-col items-center">
                  <div class="p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                    <ShoppingBagIcon class="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Satış bulunamadı</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ searchTerm ? 'Arama kriterlerinize uygun satış bulunamadı.' : 'Henüz satış kaydı eklenmemiş.' }}
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="pagination.totalPages > 1"
        class="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-6 py-4">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            :disabled="pagination.page === 1"
            @click="changePage(pagination.page - 1)"
            class="btn-secondary">
            Önceki
          </button>
          <button
            :disabled="pagination.page === pagination.totalPages"
            @click="changePage(pagination.page + 1)"
            class="btn-secondary">
            Sonraki
          </button>
        </div>
        <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <p class="text-sm text-gray-700 dark:text-gray-300">
            <span class="font-medium">{{ ((pagination.page - 1) * pagination.limit) + 1 }}</span>
            -
            <span class="font-medium">{{ Math.min(pagination.page * pagination.limit, pagination.total) }}</span>
            arası, toplam
            <span class="font-medium">{{ pagination.total }}</span>
            sonuç
          </p>
          <nav class="isolate inline-flex -space-x-px rounded-lg shadow-sm">
            <button
              :disabled="pagination.page === 1"
              @click="changePage(pagination.page - 1)"
              class="relative inline-flex items-center rounded-l-lg px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors">
              <ChevronLeftIcon class="h-5 w-5" />
            </button>
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="changePage(page)"
              class="relative inline-flex items-center px-4 py-2 text-sm font-semibold transition-colors"
              :class="page === pagination.page
                ? 'bg-indigo-600 text-white'
                : 'text-gray-900 dark:text-gray-300 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'">
              {{ page }}
            </button>
            <button
              :disabled="pagination.page === pagination.totalPages"
              @click="changePage(pagination.page + 1)"
              class="relative inline-flex items-center rounded-r-lg px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors">
              <ChevronRightIcon class="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>

    <!-- Sale Detail Modal -->
    <SaleViewModal :show="showDetailModal" :sale="selectedSale" @close="closeDetailModal" />
  </div>
</template>

<script setup>
import {
  ShoppingBagIcon,
  ChartBarIcon,
  BanknotesIcon,
  WalletIcon,
  ClockIcon,
  CheckBadgeIcon,
  CalendarDaysIcon,
  ChartPieIcon,
  ArrowTrendingUpIcon,
  SparklesIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  ArrowPathIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  GlobeAltIcon
} from '@heroicons/vue/24/outline'
import { useApi } from '~/composables/useApi'

// Animated Counter Component
const AnimatedCounter = {
  props: ['value', 'currency'],
  setup(props) {
    const displayValue = ref(0)
    
    watch(() => props.value, (newVal) => {
      // Sadece client-side'da çalıştır
      if (import.meta.server) {
        displayValue.value = newVal
        return
      }
      
      const duration = 1000
      const steps = 60
      const stepValue = (newVal - displayValue.value) / steps
      let currentStep = 0
      
      const timer = setInterval(() => {
        currentStep++
        displayValue.value += stepValue
        if (currentStep >= steps) {
          displayValue.value = newVal
          clearInterval(timer)
        }
      }, duration / steps)
    }, { immediate: true })

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

    return () => h('span', formatMoney(displayValue.value, props.currency))
  }
}

const api = useApi()
const { userId, isAdmin } = usePermissions()

// State
const loading = ref(true)
const salesData = ref([])
const searchTerm = ref('')
const startDate = ref('')
const endDate = ref('')
const paymentFilter = ref('all')
const activeCurrency = ref('USD')  // Varsayılan USD
const showDetailModal = ref(false)
const selectedSale = ref(null)

// Exchange Rates State
const loadingRates = ref(false)
const exchangeRates = ref({
  USD: 1,
  EUR: 1.09,
  TRY: 0.029,
  GBP: 1.27
})
const ratesLastUpdated = ref(null)

// Grand Total State
const grandTotal = ref({
  totalSalesInUsd: 0,
  totalPaidInUsd: 0,
  totalRemainingInUsd: 0,
  breakdown: []
})

const pagination = ref({
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0
})

// Available currencies - USD öncelikli
const availableCurrencies = computed(() => {
  const currencies = new Set(['USD'])  // USD varsayılan olarak ekle
  salesData.value.forEach(sale => {
    if (sale.currency) currencies.add(sale.currency)
  })
  // USD'yi başa al
  const arr = Array.from(currencies)
  const usdIndex = arr.indexOf('USD')
  if (usdIndex > 0) {
    arr.splice(usdIndex, 1)
    arr.unshift('USD')
  }
  return arr
})

// Grand Total Paid Percentage
const grandTotalPaidPercentage = computed(() => {
  if (grandTotal.value.totalSalesInUsd === 0) return 0
  return (grandTotal.value.totalPaidInUsd / grandTotal.value.totalSalesInUsd) * 100
})

// Load data on mount
onMounted(async () => {
  await loadExchangeRates()
  await loadSalesData()
})

/**
 * Para birimi belirleme fonksiyonu
 * Öncelik sırası:
 * 1. salesProduct.currency.code (eğer varsa)
 * 2. salesProduct.productDetails.currency.code (ürünün varsayılan para birimi)
 * 3. 'TRY' (fallback)
 */
const getCurrencyFromProduct = (salesProduct) => {
  // Önce salesProduct'ın kendi currency'sine bak
  if (salesProduct.currency?.code) {
    return salesProduct.currency.code
  }
  // Sonra spCurrency'e bak (join ile gelen)
  if (salesProduct.spCurrency?.code) {
    return salesProduct.spCurrency.code
  }
  // Sonra ürünün currency'sine bak
  if (salesProduct.productDetails?.currency?.code) {
    return salesProduct.productDetails.currency.code
  }
  // Son çare TRY
  return 'TRY'
}

/**
 * Satış verilerini API'den yükler ve işler
 * 
 * ÖNEMLİ: isPayCompleted kontrolü salesProducts seviyesinde yapılmalı
 * - Tüm ürünlerin isPayCompleted=true ise satış tamamlanmış sayılır
 * - En az bir ürün paidAmount > 0 ve isPayCompleted=false ise kısmi ödeme
 * - Hiçbir ürün için ödeme alınmamışsa ödenmedi
 */
const loadSalesData = async () => {
  loading.value = true
  try {
    const query = {
      page: pagination.value.page,
      limit: pagination.value.limit
    }

    if (!isAdmin.value && userId.value) {
      query.user = userId.value
    }

    const response = await api('/sales/user/details', { query })

    if (response?.data) {
      salesData.value = response.data.map(sale => {
        const products = sale.salesProducts || []
        
        // Her ürün için değerleri hesapla
        // totalPrice = satış tutarı (offer değeri)
        // paidAmount = alınan tutar
        const totalAmount = products.reduce((sum, p) => {
          const price = parseFloat(p.totalPrice) || 0
          return sum + price
        }, 0)
        
        const paidAmount = products.reduce((sum, p) => {
          const paid = parseFloat(p.paidAmount) || 0
          return sum + paid
        }, 0)
        
        const remainingAmount = totalAmount - paidAmount
        
        // isFullyPaid: TÜM ürünlerin isPayCompleted=true olması gerekir
        // Eğer hiç ürün yoksa tamamlanmamış sayılır
        const isFullyPaid = products.length > 0 && products.every(p => p.isPayCompleted === true)
        
        // Para birimi: İlk ürünün para birimini al
        const currency = products.length > 0 
          ? getCurrencyFromProduct(products[0])
          : 'TRY'

        return {
          id: sale.id,
          customer: {
            name: [sale.customerDetails?.name, sale.customerDetails?.surname].filter(Boolean).join(' ') || 'Bilinmeyen Müşteri',
            id: sale.customer
          },
          totalAmount,
          paidAmount,
          remainingAmount,
          isFullyPaid, // isPayCompleted yerine isFullyPaid kullanıyoruz
          currency,
          description: sale.title || '-',
          date: sale.createdAt || new Date().toISOString(),
          products // Detay modal için orijinal ürünleri tut
        }
      })

      if (response.meta) {
        pagination.value = {
          total: response.meta.total || 0,
          page: response.meta.page || 1,
          limit: response.meta.limit || 10,
          totalPages: Math.ceil((response.meta.total || 0) / (response.meta.limit || 10))
        }
      }

      // Set default currency if available
      if (availableCurrencies.value.length > 0 && !availableCurrencies.value.includes(activeCurrency.value)) {
        activeCurrency.value = availableCurrencies.value[0]
      }

      // Grand Total hesapla
      calculateGrandTotal()
    }
  } catch (error) {
    console.error('Error loading sales data:', error)
    salesData.value = []
  } finally {
    loading.value = false
  }
}

// =====================================================
// EXCHANGE RATE FONKSİYONLARI
// =====================================================

/**
 * Döviz kurlarını backend'den yükler
 */
const loadExchangeRates = async () => {
  loadingRates.value = true
  try {
    const response = await api('/exchange-rates')
    if (response?.rates) {
      exchangeRates.value = response.rates
      ratesLastUpdated.value = response.lastUpdated ? new Date(response.lastUpdated) : new Date()
    }
  } catch (error) {
    console.error('Error loading exchange rates:', error)
    // Fallback değerler zaten tanımlı
  } finally {
    loadingRates.value = false
  }
}

/**
 * Döviz kurlarını manuel olarak yeniler
 */
const refreshExchangeRates = async () => {
  loadingRates.value = true
  try {
    const response = await api('/exchange-rates/refresh', { method: 'POST' })
    if (response?.data?.rates) {
      exchangeRates.value = response.data.rates
      ratesLastUpdated.value = response.data.lastUpdated ? new Date(response.data.lastUpdated) : new Date()
    }
    // Grand Total'ı yeniden hesapla
    calculateGrandTotal()
  } catch (error) {
    console.error('Error refreshing exchange rates:', error)
  } finally {
    loadingRates.value = false
  }
}

/**
 * Genel toplamı hesaplar (Tüm para birimlerini USD'ye çevirir)
 */
const calculateGrandTotal = () => {
  const rates = exchangeRates.value
  let totalSalesInUsd = 0
  let totalPaidInUsd = 0
  let totalRemainingInUsd = 0
  const breakdown = []

  // Her para birimi için hesapla
  for (const currency of availableCurrencies.value) {
    const stats = getStatsByCurrency(currency)
    const rate = rates[currency] || 1

    const salesInUsd = stats.totalSales * rate
    const paidInUsd = stats.totalPaid * rate
    const remainingInUsd = stats.totalRemaining * rate

    totalSalesInUsd += salesInUsd
    totalPaidInUsd += paidInUsd
    totalRemainingInUsd += remainingInUsd

    breakdown.push({
      currency,
      totalSales: stats.totalSales,
      totalPaid: stats.totalPaid,
      totalRemaining: stats.totalRemaining,
      rate,
      totalSalesInUsd: salesInUsd,
      totalPaidInUsd: paidInUsd,
      totalRemainingInUsd: remainingInUsd
    })
  }

  grandTotal.value = {
    totalSalesInUsd,
    totalPaidInUsd,
    totalRemainingInUsd,
    breakdown
  }
}

/**
 * Kur güncelleme tarihini formatlar
 */
const formatRateDate = (date) => {
  if (!date) return 'Bilinmiyor'
  const d = new Date(date)
  return d.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Para birimine göre istatistikleri hesaplar
 * 
 * HESAPLAMA KURALLARI:
 * - totalSales: Seçilen para birimindeki tüm satışların toplam tutarı
 * - totalPaid: Kasaya giren para (paidAmount toplamı)
 * - totalRemaining: Beklenen ödeme (totalSales - totalPaid)
 * - completedCount: Tüm ürünleri tamamlanmış satış sayısı
 * - partialCount: En az bir ödeme alınmış ama tamamlanmamış satış sayısı
 * - unpaidCount: Hiç ödeme alınmamış satış sayısı
 */
const getStatsByCurrency = (currency) => {
  const sales = salesData.value.filter(s => s.currency === currency)
  
  // Toplam tutarlar
  const totalSales = sales.reduce((sum, s) => sum + s.totalAmount, 0)
  const totalPaid = sales.reduce((sum, s) => sum + s.paidAmount, 0)
  const totalRemaining = totalSales - totalPaid
  
  // Durum sayıları
  const completedCount = sales.filter(s => s.isFullyPaid).length
  const partialCount = sales.filter(s => !s.isFullyPaid && s.paidAmount > 0).length
  const unpaidCount = sales.filter(s => !s.isFullyPaid && s.paidAmount === 0).length
  
  const salesCount = sales.length
  const pendingCount = partialCount + unpaidCount

  return {
    totalSales,
    totalPaid,
    totalRemaining,
    salesCount,
    completedCount,
    partialCount,
    unpaidCount,
    pendingCount,
    paidPercentage: totalSales > 0 ? (totalPaid / totalSales) * 100 : 0,
    completedPercentage: salesCount > 0 ? (completedCount / salesCount) * 100 : 0,
    partialPercentage: salesCount > 0 ? (partialCount / salesCount) * 100 : 0,
    unpaidPercentage: salesCount > 0 ? (unpaidCount / salesCount) * 100 : 0
  }
}

/**
 * Bu ayki istatistikleri hesaplar
 */
const getMonthlyStats = (currency) => {
  const now = new Date()
  const sales = salesData.value.filter(s => {
    const saleDate = new Date(s.date)
    return s.currency === currency && 
      saleDate.getMonth() === now.getMonth() && 
      saleDate.getFullYear() === now.getFullYear()
  })

  return {
    totalSales: sales.reduce((sum, s) => sum + s.totalAmount, 0),
    totalPaid: sales.reduce((sum, s) => sum + s.paidAmount, 0),
    count: sales.length
  }
}

// Current month title
const currentMonthTitle = computed(() => {
  const now = new Date()
  const monthName = now.toLocaleDateString('tr-TR', { month: 'long' })
  return `${now.getFullYear()} ${monthName.charAt(0).toUpperCase() + monthName.slice(1)}`
})

/**
 * Filtrelenmiş satışlar
 * Sıralama: Tarih (yeniden eskiye)
 */
const filteredSales = computed(() => {
  let filtered = salesData.value

  // Currency filter
  if (activeCurrency.value) {
    filtered = filtered.filter(s => s.currency === activeCurrency.value)
  }

  // Search filter
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(sale => {
      const name = sale.customer?.name?.toLowerCase() || ''
      const desc = sale.description?.toLowerCase() || ''
      return name.includes(search) || desc.includes(search)
    })
  }

  // Date filter
  if (startDate.value || endDate.value) {
    filtered = filtered.filter(sale => {
      const saleDate = new Date(sale.date)
      const start = startDate.value ? new Date(startDate.value) : null
      const end = endDate.value ? new Date(endDate.value) : null
      if (start) start.setHours(0, 0, 0, 0)
      if (end) end.setHours(23, 59, 59, 999)
      if (start && end) return saleDate >= start && saleDate <= end
      if (start) return saleDate >= start
      if (end) return saleDate <= end
      return true
    })
  }

  // Payment status filter
  // isFullyPaid kullanıyoruz (tüm ürünler için isPayCompleted kontrolü)
  if (paymentFilter.value !== 'all') {
    filtered = filtered.filter(sale => {
      if (paymentFilter.value === 'completed') return sale.isFullyPaid
      if (paymentFilter.value === 'partial') return !sale.isFullyPaid && sale.paidAmount > 0
      if (paymentFilter.value === 'unpaid') return !sale.isFullyPaid && sale.paidAmount === 0
      return true
    })
  }

  return filtered
})

// Visible pages for pagination
const visiblePages = computed(() => {
  const pages = []
  const total = pagination.value.totalPages
  const current = pagination.value.page

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    if (current <= 4) {
      pages.push(1, 2, 3, 4, 5)
    } else if (current >= total - 3) {
      pages.push(total - 4, total - 3, total - 2, total - 1, total)
    } else {
      pages.push(current - 1, current, current + 1)
    }
  }
  return pages
})

// Helpers
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

const getCurrencyLabel = (code) => {
  const labels = { TRY: 'Türk Lirası', EUR: 'Euro', USD: 'Dolar', GBP: 'Sterlin' }
  return labels[code] || code
}

const getCurrencyEmoji = (code) => {
  const emojis = { TRY: '🇹🇷', EUR: '🇪🇺', USD: '🇺🇸', GBP: '🇬🇧' }
  return emojis[code] || '💰'
}

const resetFilters = () => {
  searchTerm.value = ''
  startDate.value = ''
  endDate.value = ''
  paymentFilter.value = 'all'
}

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    pagination.value.page = page
    loadSalesData()
  }
}

const viewSaleDetails = (sale) => {
  selectedSale.value = sale
  showDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedSale.value = null
}

useHead({
  title: 'Satış Finans Paneli - Valdori CRM'
})
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

tbody tr {
  animation: fadeInUp 0.5s ease-out forwards;
  opacity: 0;
}
</style>