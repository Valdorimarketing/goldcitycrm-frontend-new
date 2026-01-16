<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header with Actions -->
    <div class="sticky top-16 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm rounded-md">
      <div class="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div class="p-2 bg-gradient-to-br to-rose-500 to-rose-500 rounded-xl shadow-lg">
                <ChartBarIcon class="h-7 w-7 text-white" />
              </div>
              {{ t('sales_management.title', 'Satış & Finans Yönetimi') }}
            </h1>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {{ t('sales_management.subtitle', 'Kapsamlı satış analizi ve performans takibi') }}
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <!-- Quick Date Filters -->
            <div class="inline-flex rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
              <button 
                v-for="preset in datePresets" 
                :key="preset.value" 
                @click="applyDatePreset(preset.value)"
                class="px-3 py-1.5 text-xs font-medium rounded-md transition-all"
                :class="activeDatePreset === preset.value
                  ? 'bg-white dark:bg-gray-600 text-rose-600 dark:text-rose-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
              >
                {{ preset.label }}
              </button>
            </div>

            <button 
              @click="loadAllData" 
              :disabled="loading"
              class="btn-primary flex items-center gap-2 text-sm hover:scale-105 transition-transform"
            >
              <ArrowPathIcon class="h-4 w-4" :class="{ 'animate-spin': loading }" />
              {{ t('sales_management.actions.refresh', 'Yenile') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-[1920px] mx-auto px-4 py-6 space-y-6">
      <!-- Key Metrics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total Sales Count -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <ShoppingBagIcon class="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
              {{ t('sales_management.metrics.all_time', 'Tüm Zamanlar') }}
            </span>
          </div>
          <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {{ formatNumber(overallStats.totalSalesCount) }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ t('sales_management.metrics.total_sales', 'Toplam Satış') }}
          </p>
          <div class="mt-3 flex items-center text-xs">
            <span class="text-green-600 dark:text-green-400 flex items-center">
              <ArrowTrendingUpIcon class="h-3 w-3 mr-1" />
              {{ tp('sales_management.metrics.completed_count', { count: overallStats.completedCount }, '{count} tamamlandı') }}
            </span>
          </div>
        </div>

        <!-- Active Customers -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-xl">
              <UsersIcon class="h-6 w-6 text-rose-600 dark:text-rose-400" />
            </div>
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
              {{ t('sales_management.metrics.customers_label', 'Müşteriler') }}
            </span>
          </div>
          <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {{ formatNumber(overallStats.uniqueCustomers) }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ t('sales_management.metrics.active_customers', 'Aktif Müşteri') }}
          </p>
          <div class="mt-3 flex items-center text-xs">
            <span class="text-gray-600 dark:text-gray-400">
              {{ tp('sales_management.metrics.avg_per_customer', { avg: formatNumber(overallStats.avgSalesPerCustomer, 1) }, 'Ortalama {avg} satış/müşteri') }}
            </span>
          </div>
        </div>

        <!-- Average Sale Value -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
              <BanknotesIcon class="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
              {{ t('sales_management.metrics.average_label', 'Ortalama') }}
            </span>
          </div>
          <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {{ formatMoney(overallStats.avgSaleValue, activeCurrency) }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ t('sales_management.metrics.avg_sale_value', 'Satış Değeri') }}
          </p>
          <div class="mt-3 flex items-center text-xs">
            <span class="text-gray-600 dark:text-gray-400">
              {{ tp('sales_management.metrics.currency_based', { currency: activeCurrency }, '{currency} bazında') }}
            </span>
          </div>
        </div>

        <!-- Conversion Rate -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-xl">
              <ChartPieIcon class="h-6 w-6 text-rose-600 dark:text-rose-400" />
            </div>
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
              {{ t('sales_management.metrics.success_label', 'Başarı') }}
            </span>
          </div>
          <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {{ formatNumber(overallStats.conversionRate, 1) }}%
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ t('sales_management.metrics.conversion_rate', 'Tamamlanma Oranı') }}
          </p>
          <div class="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div 
              class="bg-rose-500 h-1.5 rounded-full transition-all duration-1000"
              :style="{ width: overallStats.conversionRate + '%' }"
            ></div>
          </div>
        </div>
      </div>


      <!-- Grand Total Card (USD) -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 p-6 shadow-2xl border border-slate-700">
        <div class="absolute inset-0 opacity-10">
          <div 
            class="absolute inset-0"
            style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"
          ></div>
        </div>

        <div class="relative">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-lg">
                <GlobeAltIcon class="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 class="text-xl font-bold text-white">
                  {{ t('sales_management.grand_total.title', 'Genel Toplam (USD)') }}
                </h3>
                <p class="text-sm text-slate-400">
                  {{ t('sales_management.grand_total.subtitle', "Tüm para birimleri Dolar'a çevrildi") }}
                </p>
              </div>
            </div>

            <div class="text-right">
              <div class="flex items-center gap-2 text-xs text-slate-400">
                <ArrowPathIcon class="h-4 w-4" :class="{ 'animate-spin': loadingRates }" />
                <span>{{ tp('sales_management.grand_total.rates_label', { date: formatRateDate(ratesLastUpdated) }, 'Kurlar: {date}') }}</span>
              </div>
              <button 
                @click="refreshExchangeRates" 
                :disabled="loadingRates"
                class="mt-1 text-xs text-rose-400 hover:text-rose-300 transition-colors"
              >
                {{ t('sales_management.grand_total.refresh_rates', 'Kurları Güncelle') }}
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div class="bg-slate-800/50 rounded-xl p-5 backdrop-blur border border-slate-700/50">
              <div class="flex items-center gap-3 mb-3">
                <div class="p-2 bg-blue-500/20 rounded-lg">
                  <BanknotesIcon class="h-5 w-5 text-blue-400" />
                </div>
                <span class="text-sm text-slate-400">
                  {{ t('sales_management.grand_total.total_sales', 'Toplam Satış') }}
                </span>
              </div>
              <p class="text-2xl font-bold text-white">
                {{ formatMoney(grandTotal.totalSalesInUsd, 'USD') }}
              </p>
            </div>

            <div class="bg-slate-800/50 rounded-xl p-5 backdrop-blur border border-slate-700/50">
              <div class="flex items-center gap-3 mb-3">
                <div class="p-2 bg-emerald-500/20 rounded-lg">
                  <WalletIcon class="h-5 w-5 text-emerald-400" />
                </div>
                <span class="text-sm text-slate-400">
                  {{ t('sales_management.grand_total.cash_received', 'Kasaya Giren') }}
                </span>
              </div>
              <p class="text-2xl font-bold text-emerald-400">
                {{ formatMoney(grandTotal.totalPaidInUsd, 'USD') }}
              </p>
              <div class="mt-2 w-full bg-slate-700 rounded-full h-1.5">
                <div 
                  class="bg-emerald-500 h-1.5 rounded-full transition-all duration-1000"
                  :style="{ width: grandTotalPaidPercentage + '%' }"
                ></div>
              </div>
            </div>

            <div class="bg-slate-800/50 rounded-xl p-5 backdrop-blur border border-slate-700/50">
              <div class="flex items-center gap-3 mb-3">
                <div class="p-2 bg-rose-500/20 rounded-lg">
                  <ClockIcon class="h-5 w-5 text-rose-400" />
                </div>
                <span class="text-sm text-slate-400">
                  {{ t('sales_management.grand_total.pending_payment', 'Beklenen Ödeme') }}
                </span>
              </div>
              <p class="text-2xl font-bold text-rose-400">
                {{ formatMoney(grandTotal.totalRemainingInUsd, 'USD') }}
              </p>
            </div>
          </div>

          <div class="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
            <p class="text-xs text-slate-500 mb-3 font-medium uppercase tracking-wider">
              {{ t('sales_management.grand_total.currency_breakdown', 'Para Birimi Dökümü') }}
            </p>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div 
                v-for="item in grandTotal.breakdown" 
                :key="item.currency"
                class="bg-slate-700/30 rounded-lg p-3 hover:bg-slate-700/50 transition-colors cursor-pointer"
                @click="activeCurrency = item.currency"
              >
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-white">
                    {{ getCurrencyEmoji(item.currency) }} {{ item.currency }}
                  </span>
                  <span class="text-xs text-slate-400">
                    1 {{ item.currency }} = ${{ item.rate?.toFixed(4) }}
                  </span>
                </div>
                <p class="text-sm text-slate-300">
                  {{ formatMoney(item.totalSales, item.currency) }}
                </p>
                <p class="text-xs text-slate-500">
                  = {{ formatMoney(item.totalSalesInUsd, 'USD') }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Advanced Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
        <div class="flex items-center gap-3 mb-4">
          <FunnelIcon class="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ t('sales_management.filters.title', 'Gelişmiş Filtreler') }}
          </h3>
          <button 
            @click="resetAllFilters"
            class="ml-auto text-sm text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-medium"
          >
            {{ t('sales_management.filters.clear_all', 'Tümünü Temizle') }}
          </button>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          <!-- Search -->
          <div class="lg:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('sales_management.filters.search', 'Ara') }}
            </label>
            <div class="relative">
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                v-model="searchTerm" 
                type="text" 
                class="form-input pl-10"
                :placeholder="t('sales_management.filters.search_placeholder', 'Müşteri, ürün, açıklama...')"
              />
            </div>
          </div>

          <!-- Currency -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('sales_management.filters.currency', 'Para Birimi') }}
            </label>
            <select v-model="activeCurrency" class="form-select">
              <option value="">{{ t('sales_management.filters.all_currencies', 'Tümü') }}</option>
              <option v-for="curr in availableCurrencies" :key="curr" :value="curr">
                {{ getCurrencyEmoji(curr) }} {{ getCurrencyLabel(curr) }}
              </option>
            </select>
          </div>

          <!-- User -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('sales_management.filters.sales_rep', 'Satış Temsilcisi') }}
            </label>
            <select v-model="selectedUserId" class="form-select">
              <option :value="null">{{ t('sales_management.filters.all_users', 'Tüm Kullanıcılar') }}</option>
              <option v-for="user in usersList" :key="user.id" :value="user.id">
                {{ user.name }}
              </option>
            </select>
          </div>

          <!-- Payment Status -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('sales_management.filters.payment_status', 'Ödeme Durumu') }}
            </label>
            <select v-model="paymentFilter" class="form-select">
              <option value="all">{{ t('sales_management.filters.payment_all', 'Tümü') }}</option>
              <option value="completed">{{ t('sales_management.filters.payment_completed', 'Tamamlanan') }}</option>
              <option value="partial">{{ t('sales_management.filters.payment_partial', 'Kısmi Ödeme') }}</option>
              <option value="unpaid">{{ t('sales_management.filters.payment_unpaid', 'Ödenmedi') }}</option>
            </select>
          </div>

          <!-- Custom Date Range -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('sales_management.filters.start_date', 'Başlangıç') }}
            </label>
            <input v-model="startDate" type="date" class="form-input" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('sales_management.filters.end_date', 'Bitiş') }}
            </label>
            <input v-model="endDate" type="date" class="form-input" />
          </div>
        </div>
      </div>

      <!-- Tabs for Different Views -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            <button 
              v-for="tab in tabs" 
              :key="tab.id" 
              @click="activeTab = tab.id"
              class="py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap"
              :class="activeTab === tab.id
                ? 'border-rose-500 text-rose-600 dark:text-rose-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'"
            >
              <component :is="tab.icon" class="h-5 w-5 inline-block mr-2" />
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <div class="p-6">
          <!-- Overview Tab -->
          <div v-if="activeTab === 'overview'">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <!-- Payment Status Distribution -->
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {{ t('sales_management.payment_distribution.title', 'Ödeme Durumu Dağılımı') }}
                </h4>
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                      <span class="text-sm text-gray-600 dark:text-gray-400">
                        {{ t('sales_management.payment_distribution.completed', 'Tamamlanan') }}
                      </span>
                    </div>
                    <span class="text-sm font-semibold text-gray-900 dark:text-white">
                      {{ getStatsByCurrency(activeCurrency).completedCount }} ({{ formatNumber(getStatsByCurrency(activeCurrency).completedPercentage, 1) }}%)
                    </span>
                  </div>
                  <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div 
                      class="bg-emerald-500 h-2 rounded-full transition-all duration-1000"
                      :style="{ width: getStatsByCurrency(activeCurrency).completedPercentage + '%' }"
                    ></div>
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded-full bg-rose-500"></div>
                      <span class="text-sm text-gray-600 dark:text-gray-400">
                        {{ t('sales_management.payment_distribution.partial', 'Kısmi Ödeme') }}
                      </span>
                    </div>
                    <span class="text-sm font-semibold text-gray-900 dark:text-white">
                      {{ getStatsByCurrency(activeCurrency).partialCount }} ({{ formatNumber(getStatsByCurrency(activeCurrency).partialPercentage, 1) }}%)
                    </span>
                  </div>
                  <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div 
                      class="bg-rose-500 h-2 rounded-full transition-all duration-1000"
                      :style="{ width: getStatsByCurrency(activeCurrency).partialPercentage + '%' }"
                    ></div>
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded-full bg-red-500"></div>
                      <span class="text-sm text-gray-600 dark:text-gray-400">
                        {{ t('sales_management.payment_distribution.unpaid', 'Ödenmedi') }}
                      </span>
                    </div>
                    <span class="text-sm font-semibold text-gray-900 dark:text-white">
                      {{ getStatsByCurrency(activeCurrency).unpaidCount }} ({{ formatNumber(getStatsByCurrency(activeCurrency).unpaidPercentage, 1) }}%)
                    </span>
                  </div>
                  <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div 
                      class="bg-red-500 h-2 rounded-full transition-all duration-1000"
                      :style="{ width: getStatsByCurrency(activeCurrency).unpaidPercentage + '%' }"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- Monthly Performance -->
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ currentMonthTitle }}</h4>
                <div class="grid grid-cols-2 gap-4">
                  <div 
                    v-for="curr in availableCurrencies.slice(0, 4)" 
                    :key="'month-' + curr"
                    class="bg-white dark:bg-gray-600/50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    @click="activeCurrency = curr"
                  >
                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">{{ getCurrencyLabel(curr) }}</p>
                    <p class="text-lg font-bold text-gray-900 dark:text-white">
                      {{ formatMoney(getMonthlyStats(curr).totalSales, curr) }}
                    </p>
                    <div class="flex items-center mt-2 text-xs">
                      <span class="text-emerald-600 dark:text-emerald-400">
                        {{ tp('sales_management.currency_summary.sales_count', { count: getMonthlyStats(curr).count }, '{count} satış') }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Currency Summary Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <div 
                v-for="curr in availableCurrencies" 
                :key="'summary-' + curr"
                class="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg p-5 border border-gray-100 dark:border-gray-600 hover:border-rose-300 dark:hover:border-rose-500 transition-all duration-300 cursor-pointer hover:scale-105"
                :class="{ 'ring-2 ring-rose-500': activeCurrency === curr }" 
                @click="activeCurrency = curr"
              >
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-2">
                    <span class="text-2xl">{{ getCurrencyEmoji(curr) }}</span>
                    <span class="font-semibold text-gray-900 dark:text-white">{{ getCurrencyLabel(curr) }}</span>
                  </div>
                  <span 
                    class="text-xs px-2 py-1 rounded-full"
                    :class="activeCurrency === curr 
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300' 
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-400'"
                  >
                    {{ tp('sales_management.currency_summary.sales_count', { count: getStatsByCurrency(curr).salesCount }, '{count} satış') }}
                  </span>
                </div>

                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-500 dark:text-gray-400">
                      {{ t('sales_management.currency_summary.total', 'Toplam') }}
                    </span>
                    <span class="font-bold text-gray-900 dark:text-white">
                      {{ formatMoney(getStatsByCurrency(curr).totalSales, curr) }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-emerald-600 dark:text-emerald-400">
                      {{ t('sales_management.currency_summary.in_cash', 'Kasada') }}
                    </span>
                    <span class="font-semibold text-emerald-600 dark:text-emerald-400">
                      {{ formatMoney(getStatsByCurrency(curr).totalPaid, curr) }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-rose-600 dark:text-rose-400">
                      {{ t('sales_management.currency_summary.pending', 'Beklenen') }}
                    </span>
                    <span class="font-semibold text-rose-600 dark:text-rose-400">
                      {{ formatMoney(getStatsByCurrency(curr).totalRemaining, curr) }}
                    </span>
                  </div>

                  <div class="pt-3 border-t border-gray-200 dark:border-gray-600">
                    <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        class="bg-gradient-to-r from-emerald-500 to-green-600 h-2 rounded-full transition-all duration-1000"
                        :style="{ width: getStatsByCurrency(curr).paidPercentage + '%' }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sales List Tab -->
          <div v-if="activeTab === 'sales'">
            <SalesListTable :sales="filteredSales" :loading="loading" @view-detail="viewSaleDetails" />
          </div>

          <!-- User Performance Tab -->
          <div v-if="activeTab === 'users'">
            <UserPerformanceTable :users="userPerformanceData" :loading="loading" @select-user="selectUser" />
          </div>

          <!-- Products Tab -->
          <div v-if="activeTab === 'products'">
            <ProductsAnalysis :products="productsData" :loading="loading" />
          </div>
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
  CalendarDaysIcon,
  ChartPieIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  ArrowPathIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  GlobeAltIcon,
  UsersIcon,
  ArrowDownTrayIcon,
  ArrowTrendingUpIcon,
  TableCellsIcon,
  UserGroupIcon,
  CubeIcon,
  DocumentChartBarIcon
} from '@heroicons/vue/24/outline'
import { useApi } from '~/composables/useApi'
import { useLanguage } from '~/composables/useLanguage'

const { t, tp } = useLanguage()
const api = useApi()
const { userId, isAdmin } = usePermissions()

// =====================================================
// STATE
// =====================================================
const loading = ref(true)
const loadingRates = ref(false)
const salesData = ref([])
const usersList = ref([])
const userPerformanceData = ref([])
const productsData = ref([]) 

// Filters
const searchTerm = ref('')
const startDate = ref('')
const endDate = ref('')
const paymentFilter = ref('all')
const activeCurrency = ref('USD')
const selectedUserId = ref(null)
const activeDatePreset = ref('all')
const activeTab = ref('overview')

// Modals
const showDetailModal = ref(false)
const selectedSale = ref(null)

// Exchange Rates
const exchangeRates = ref({
  USD: 1,
  EUR: 1.09,
  TRY: 0.029,
  GBP: 1.27
})
const ratesLastUpdated = ref(null)

// Grand Total
const grandTotal = ref({
  totalSalesInUsd: 0,
  totalPaidInUsd: 0,
  totalRemainingInUsd: 0,
  breakdown: []
})

// Overall Statistics
const overallStats = ref({
  totalSalesCount: 0,
  completedCount: 0,
  partialCount: 0,
  unpaidCount: 0,
  uniqueCustomers: 0,
  avgSalesPerCustomer: 0,
  avgSaleValue: 0,
  conversionRate: 0
})

// =====================================================
// TABS CONFIGURATION
// =====================================================
const tabs = [
  { 
    id: 'overview', 
    name: t('sales_management.tabs.overview', 'Genel Bakış'), 
    icon: ChartBarIcon 
  },
  { 
    id: 'sales', 
    name: t('sales_management.tabs.sales_list', 'Satış Listesi'), 
    icon: TableCellsIcon 
  },
  { 
    id: 'users', 
    name: t('sales_management.tabs.user_performance', 'Kullanıcı Performansı'), 
    icon: UserGroupIcon 
  },
  { 
    id: 'products', 
    name: t('sales_management.tabs.product_analysis', 'Ürün Analizi'), 
    icon: CubeIcon 
  }
]

// =====================================================
// DATE PRESETS
// =====================================================
const datePresets = [
  { label: t('sales_management.date_presets.all', 'Tümü'), value: 'all' },
  { label: t('sales_management.date_presets.today', 'Bugün'), value: 'today' },
  { label: t('sales_management.date_presets.week', 'Bu Hafta'), value: 'week' },
  { label: t('sales_management.date_presets.month', 'Bu Ay'), value: 'month' },
  { label: t('sales_management.date_presets.quarter', 'Son 3 Ay'), value: 'quarter' },
  { label: t('sales_management.date_presets.year', 'Bu Yıl'), value: 'year' }
]

// =====================================================
// COMPUTED
// =====================================================
const availableCurrencies = computed(() => {
  const currencies = new Set(['USD'])
  salesData.value.forEach(sale => {
    if (sale.currency) currencies.add(sale.currency)
  })
  const arr = Array.from(currencies)
  const usdIndex = arr.indexOf('USD')
  if (usdIndex > 0) {
    arr.splice(usdIndex, 1)
    arr.unshift('USD')
  }
  return arr
})

const grandTotalPaidPercentage = computed(() => {
  if (grandTotal.value.totalSalesInUsd === 0) return 0
  return (grandTotal.value.totalPaidInUsd / grandTotal.value.totalSalesInUsd) * 100
})

const currentMonthTitle = computed(() => {
  const now = new Date()
  const monthName = now.toLocaleDateString('tr-TR', { month: 'long' })
  return `${now.getFullYear()} ${monthName.charAt(0).toUpperCase() + monthName.slice(1)}`
})

const filteredSales = computed(() => {
  let filtered = salesData.value

  if (activeCurrency.value) {
    filtered = filtered.filter(s => s.currency === activeCurrency.value)
  }

  if (selectedUserId.value) {
    filtered = filtered.filter(s => s.user === selectedUserId.value)
  }

  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(sale => {
      const name = sale.customer?.name?.toLowerCase() || ''
      const desc = sale.description?.toLowerCase() || ''
      const title = sale.title?.toLowerCase() || ''
      return name.includes(search) || desc.includes(search) || title.includes(search)
    })
  }

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

// =====================================================
// LIFECYCLE
// =====================================================
onMounted(async () => {
  await loadAllData()
})


// =====================================================
// METHODS - DATA LOADING
// =====================================================
const loadAllData = async () => {
  loading.value = true
  try {
    await Promise.all([
      loadExchangeRates(),
      loadSalesData(),
      loadUsersList()
    ])
    
    await Promise.all([
      loadUserPerformance(),
      loadProductsData()
    ])
  } catch (error) {
    console.error('Error loading data:', error)
  } finally {
    loading.value = false
  }
}

const loadSalesData = async () => {
  try {
    const query = { limit: 1000 }
    if (!isAdmin.value && userId.value) {
      query.user = userId.value
    }

    const response = await api('/sales/user/details', { query })

    if (response?.data) {
      const groupedSales = []

      for (const sale of response.data) {
        const productsByCurrency = new Map()

        for (const sp of sale.salesProducts || []) {
          const currency = sp.currency?.code ||
            sp.productDetails?.currency?.code ||
            'TRY'

          if (!productsByCurrency.has(currency)) {
            productsByCurrency.set(currency, [])
          }
          productsByCurrency.get(currency).push(sp)
        }

        for (const [currency, products] of productsByCurrency.entries()) {
          const totalAmount = products.reduce((sum, p) => sum + (parseFloat(p.totalPrice) || 0), 0)
          const paidAmount = products.reduce((sum, p) => sum + (parseFloat(p.paidAmount) || 0), 0)
          const remainingAmount = totalAmount - paidAmount
          const isFullyPaid = products.length > 0 && products.every(p => p.isPayCompleted === true)

          groupedSales.push({
            id: `${sale.id}-${currency}`,
            originalId: sale.id,
            customer: {
              name: [sale.customerDetails?.name, sale.customerDetails?.surname]
                .filter(Boolean)
                .join(' ') || 'Bilinmeyen Müşteri',
              id: sale.customer
            },
            user: sale.user,
            userName: sale.userDetails?.name || 'Bilinmeyen',
            totalAmount,
            paidAmount,
            remainingAmount,
            isFullyPaid,
            currency,
            description: `${sale.title || '-'} (${currency})`,
            title: sale.title,
            date: sale.createdAt || new Date().toISOString(),
            products
          })
        }
      }

      salesData.value = groupedSales
      calculateOverallStats()
      calculateGrandTotal()
      
      await Promise.all([
        loadUserPerformance(),
        loadProductsData()
      ])
    }
  } catch (error) {
    console.error('Error loading sales data:', error)
    salesData.value = []
  }
}

const loadUsersList = async () => {
  try {
    const response = await api('/users')
    if (response) {
      usersList.value = response
    }
  } catch (error) {
    console.error('Error loading users:', error)
  }
}

const loadUserPerformance = async () => {
  try {
    if (!salesData.value || salesData.value.length === 0) {
      userPerformanceData.value = []
      return
    }

    const usersMap = new Map()

    salesData.value.forEach(sale => {
      if (!sale.user) return

      if (!usersMap.has(sale.user)) {
        usersMap.set(sale.user, {
          userId: sale.user,
          userName: sale.userName,
          salesByCurrency: {},
          totalSales: 0,
          completedSales: 0,
          partialSales: 0,
          unpaidSales: 0
        })
      }

      const user = usersMap.get(sale.user)
      const curr = sale.currency

      if (!user.salesByCurrency[curr]) {
        user.salesByCurrency[curr] = {
          count: 0,
          totalAmount: 0,
          paidAmount: 0,
          remainingAmount: 0
        }
      }

      user.salesByCurrency[curr].count++
      user.salesByCurrency[curr].totalAmount += sale.totalAmount
      user.salesByCurrency[curr].paidAmount += sale.paidAmount
      user.salesByCurrency[curr].remainingAmount += sale.remainingAmount

      user.totalSales++
      if (sale.isFullyPaid) user.completedSales++
      else if (sale.paidAmount > 0) user.partialSales++
      else user.unpaidSales++
    })

    userPerformanceData.value = Array.from(usersMap.values())
  } catch (error) {
    console.error('Error calculating user performance:', error)
  }
}

const loadProductsData = async () => {
  try {
    if (!salesData.value || salesData.value.length === 0) {
      productsData.value = []
      return
    }

    const productsMap = new Map()

    salesData.value.forEach(sale => {
      sale.products?.forEach(product => {
        const productId = product.product
        const productName = product.productDetails?.name || 'Bilinmeyen Ürün'

        if (!productsMap.has(productId)) {
          productsMap.set(productId, {
            id: productId,
            name: productName,
            salesCount: 0,
            totalRevenue: 0,
            currency: sale.currency
          })
        }

        const prod = productsMap.get(productId)
        prod.salesCount++
        prod.totalRevenue += parseFloat(product.totalPrice) || 0
      })
    })

    productsData.value = Array.from(productsMap.values())
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
  } catch (error) {
    console.error('Error calculating products data:', error)
  }
}

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
  } finally {
    loadingRates.value = false
  }
}

const refreshExchangeRates = async () => {
  loadingRates.value = true
  try {
    const response = await api('/exchange-rates/refresh', { method: 'POST' })
    if (response?.data?.rates) {
      exchangeRates.value = response.data.rates
      ratesLastUpdated.value = response.data.lastUpdated ? new Date(response.data.lastUpdated) : new Date()
    }
    calculateGrandTotal()
  } catch (error) {
    console.error('Error refreshing exchange rates:', error)
  } finally {
    loadingRates.value = false
  }
}

// =====================================================
// METHODS - CALCULATIONS
// =====================================================
const calculateOverallStats = () => {
  const total = salesData.value.length
  const completed = salesData.value.filter(s => s.isFullyPaid).length
  const partial = salesData.value.filter(s => !s.isFullyPaid && s.paidAmount > 0).length
  const unpaid = salesData.value.filter(s => !s.isFullyPaid && s.paidAmount === 0).length

  const uniqueCustomers = new Set(salesData.value.map(s => s.customer?.id).filter(Boolean)).size

  const currencySales = salesData.value.filter(s => s.currency === activeCurrency.value)
  const avgValue = currencySales.length > 0
    ? currencySales.reduce((sum, s) => sum + s.totalAmount, 0) / currencySales.length
    : 0

  overallStats.value = {
    totalSalesCount: total,
    completedCount: completed,
    partialCount: partial,
    unpaidCount: unpaid,
    uniqueCustomers,
    avgSalesPerCustomer: uniqueCustomers > 0 ? total / uniqueCustomers : 0,
    avgSaleValue: avgValue,
    conversionRate: total > 0 ? (completed / total) * 100 : 0
  }
}

const calculateGrandTotal = () => {
  const rates = exchangeRates.value
  let totalSalesInUsd = 0
  let totalPaidInUsd = 0
  let totalRemainingInUsd = 0
  const breakdown = []

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

const getStatsByCurrency = (currency) => {
  const sales = salesData.value.filter(s => s.currency === currency)

  const totalSales = sales.reduce((sum, s) => sum + s.totalAmount, 0)
  const totalPaid = sales.reduce((sum, s) => sum + s.paidAmount, 0)
  const totalRemaining = totalSales - totalPaid

  const completedCount = sales.filter(s => s.isFullyPaid).length
  const partialCount = sales.filter(s => !s.isFullyPaid && s.paidAmount > 0).length
  const unpaidCount = sales.filter(s => !s.isFullyPaid && s.paidAmount === 0).length

  const salesCount = sales.length

  return {
    totalSales,
    totalPaid,
    totalRemaining,
    salesCount,
    completedCount,
    partialCount,
    unpaidCount,
    paidPercentage: totalSales > 0 ? (totalPaid / totalSales) * 100 : 0,
    completedPercentage: salesCount > 0 ? (completedCount / salesCount) * 100 : 0,
    partialPercentage: salesCount > 0 ? (partialCount / salesCount) * 100 : 0,
    unpaidPercentage: salesCount > 0 ? (unpaidCount / salesCount) * 100 : 0
  }
}

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

// =====================================================
// METHODS - FILTER FUNCTIONS
// =====================================================
const applyDatePreset = (preset) => {
  activeDatePreset.value = preset
  const now = new Date()

  switch (preset) {
    case 'all':
      startDate.value = ''
      endDate.value = ''
      break
    case 'today':
      startDate.value = now.toISOString().split('T')[0]
      endDate.value = now.toISOString().split('T')[0]
      break
    case 'week':
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - now.getDay())
      startDate.value = weekStart.toISOString().split('T')[0]
      endDate.value = now.toISOString().split('T')[0]
      break
    case 'month':
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      startDate.value = monthStart.toISOString().split('T')[0]
      endDate.value = now.toISOString().split('T')[0]
      break
    case 'quarter':
      const quarterStart = new Date(now)
      quarterStart.setMonth(now.getMonth() - 3)
      startDate.value = quarterStart.toISOString().split('T')[0]
      endDate.value = now.toISOString().split('T')[0]
      break
    case 'year':
      const yearStart = new Date(now.getFullYear(), 0, 1)
      startDate.value = yearStart.toISOString().split('T')[0]
      endDate.value = now.toISOString().split('T')[0]
      break
  }
}

const resetAllFilters = () => {
  searchTerm.value = ''
  startDate.value = ''
  endDate.value = ''
  paymentFilter.value = 'all'
  activeCurrency.value = ''
  selectedUserId.value = null
  activeDatePreset.value = 'all'
}

const selectUser = (userId) => {
  selectedUserId.value = userId
  activeTab.value = 'sales'
}

const viewSaleDetails = (sale) => {
  selectedSale.value = sale
  showDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedSale.value = null
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================
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

const formatNumber = (number, decimals = 0) => {
  return Number(number || 0).toFixed(decimals)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('tr-TR')
}

const formatRateDate = (date) => {
  if (!date) return t('sales_management.grand_total.rates_unknown', 'Bilinmiyor')
  const d = new Date(date)
  return d.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getCurrencyLabel = (code) => {
  const key = `sales_management.currency_labels.${code.toLowerCase()}`
  return t(key, code)
}

const getCurrencyEmoji = (code) => {
  const emojis = { TRY: '🇹🇷', EUR: '🇪🇺', USD: '🇺🇸', GBP: '🇬🇧' }
  return emojis[code] || '💰'
}

useHead({
  title: 'Satış & Finans Yönetimi - Valdori CRM'
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
</style>