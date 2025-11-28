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

    <!-- Main Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Toplam Satış -->
      <div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
        <div class="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <BanknotesIcon class="h-6 w-6 text-white" />
            </div>
            <span class="text-xs font-medium text-blue-100 bg-white/20 px-2 py-1 rounded-full">
              {{ activeCurrency }}
            </span>
          </div>
          <p class="text-blue-100 text-sm font-medium mb-1">Toplam Satış</p>
          <p class="text-3xl font-bold text-white mb-2">
            <AnimatedCounter :value="getStatsByCurrency(activeCurrency).totalSales" :currency="activeCurrency" />
          </p>
          <div class="flex items-center text-blue-100 text-xs">
            <ArrowTrendingUpIcon class="h-4 w-4 mr-1" />
            <span>{{ getStatsByCurrency(activeCurrency).salesCount }} satış</span>
          </div>
        </div>
      </div>

      <!-- Kasaya Giren -->
      <div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
        <div class="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <WalletIcon class="h-6 w-6 text-white" />
            </div>
            <span class="text-xs font-medium text-emerald-100 bg-white/20 px-2 py-1 rounded-full animate-pulse">
              Kasada
            </span>
          </div>
          <p class="text-emerald-100 text-sm font-medium mb-1">Kasaya Giren</p>
          <p class="text-3xl font-bold text-white mb-2">
            <AnimatedCounter :value="getStatsByCurrency(activeCurrency).totalPaid" :currency="activeCurrency" />
          </p>
          <div class="w-full bg-white/20 rounded-full h-2 mt-3">
            <div 
              class="bg-white rounded-full h-2 transition-all duration-1000 ease-out"
              :style="{ width: getStatsByCurrency(activeCurrency).paidPercentage + '%' }"
            ></div>
          </div>
          <p class="text-emerald-100 text-xs mt-2">
            %{{ getStatsByCurrency(activeCurrency).paidPercentage.toFixed(1) }} tahsil edildi
          </p>
        </div>
      </div>

      <!-- Beklenen Ödeme -->
      <div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
        <div class="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <ClockIcon class="h-6 w-6 text-white" />
            </div>
            <span class="text-xs font-medium text-amber-100 bg-white/20 px-2 py-1 rounded-full">
              Bekliyor
            </span>
          </div>
          <p class="text-amber-100 text-sm font-medium mb-1">Beklenen Ödeme</p>
          <p class="text-3xl font-bold text-white mb-2">
            <AnimatedCounter :value="getStatsByCurrency(activeCurrency).totalRemaining" :currency="activeCurrency" />
          </p>
          <div class="flex items-center text-amber-100 text-xs">
            <ExclamationCircleIcon class="h-4 w-4 mr-1" />
            <span>{{ getStatsByCurrency(activeCurrency).pendingCount }} bekleyen</span>
          </div>
        </div>
      </div>

      <!-- Tamamlanan Ödemeler -->
      <div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
        <div class="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <CheckBadgeIcon class="h-6 w-6 text-white" />
            </div>
            <span class="text-xs font-medium text-purple-100 bg-white/20 px-2 py-1 rounded-full">
              ✓ Tamamlandı
            </span>
          </div>
          <p class="text-purple-100 text-sm font-medium mb-1">Tamamlanan</p>
          <p class="text-3xl font-bold text-white mb-2">
            {{ getStatsByCurrency(activeCurrency).completedCount }}
          </p>
          <div class="flex items-center text-purple-100 text-xs">
            <SparklesIcon class="h-4 w-4 mr-1" />
            <span>%{{ getStatsByCurrency(activeCurrency).completedPercentage.toFixed(1) }} tamamlandı</span>
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
                <span v-if="sale.isPayCompleted" 
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
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'
import { useApi } from '~/composables/useApi'

// Animated Counter Component

// AnimatedCounter Component
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
const activeCurrency = ref('TRY')
const showDetailModal = ref(false)
const selectedSale = ref(null)

const pagination = ref({
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0
})

// Available currencies
const availableCurrencies = computed(() => {
  const currencies = new Set(['TRY'])
  salesData.value.forEach(sale => {
    if (sale.currency) currencies.add(sale.currency)
  })
  return Array.from(currencies)
})

// Load data on mount
onMounted(async () => {
  await loadSalesData()
})

// Fetch sales data
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
        const totalAmount = products.reduce((sum, p) => sum + (parseFloat(p.totalPrice) || parseFloat(p.offer) || 0), 0)
        const paidAmount = products.reduce((sum, p) => sum + (parseFloat(p.paidAmount) || 0), 0)
        const remainingAmount = totalAmount - paidAmount
        const isPayCompleted = products.every(p => p.isPayCompleted) && products.length > 0
        const currency = products[0]?.currency?.code || products[0]?.productDetails?.currency?.code || 'TRY'

        return {
          id: sale.id,
          customer: {
            name: [sale.customerDetails?.name, sale.customerDetails?.surname].filter(Boolean).join(' ') || 'Bilinmeyen Müşteri',
            id: sale.customer
          },
          totalAmount,
          paidAmount,
          remainingAmount,
          isPayCompleted,
          currency,
          description: sale.title || '-',
          date: sale.createdAt || new Date().toISOString(),
          products
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
    }
  } catch (error) {
    console.error('Error loading sales data:', error)
    salesData.value = []
  } finally {
    loading.value = false
  }
}

// Get stats by currency
const getStatsByCurrency = (currency) => {
  const sales = salesData.value.filter(s => s.currency === currency)
  const totalSales = sales.reduce((sum, s) => sum + s.totalAmount, 0)
  const totalPaid = sales.reduce((sum, s) => sum + s.paidAmount, 0)
  const totalRemaining = sales.reduce((sum, s) => sum + s.remainingAmount, 0)
  
  const completedCount = sales.filter(s => s.isPayCompleted).length
  const partialCount = sales.filter(s => !s.isPayCompleted && s.paidAmount > 0).length
  const unpaidCount = sales.filter(s => !s.isPayCompleted && s.paidAmount === 0).length
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

// Get monthly stats
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

// Filtered sales
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
  if (paymentFilter.value !== 'all') {
    filtered = filtered.filter(sale => {
      if (paymentFilter.value === 'completed') return sale.isPayCompleted
      if (paymentFilter.value === 'partial') return !sale.isPayCompleted && sale.paidAmount > 0
      if (paymentFilter.value === 'unpaid') return !sale.isPayCompleted && sale.paidAmount === 0
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