<template>
  <div class="min-h-screen">
    <!-- Header Section -->
    <div class="mb-8">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl shadow-lg shadow-violet-500/25">
            <CurrencyDollarIcon class="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Fiyatlandırmalar</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Fiyatlandırma sürecindeki müşterileri takip edin
            </p>
          </div>
        </div>

        <!-- Action Button -->
        <button 
          @click="loadAllData"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-sm font-medium"
        >
          <ArrowPathIcon class="h-5 w-5" :class="{ 'animate-spin': loading }" />
          Yenile
        </button>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="group bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Toplam</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ totalCount }}</p>
          </div>
          <div class="h-12 w-12 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
            <UsersIcon class="h-6 w-6 text-violet-600 dark:text-violet-400" />
          </div>
        </div>
        <div class="h-1 w-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full mt-4 opacity-60"></div>
      </div>

      <div class="group bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Gönderilen</p>
            <p class="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{{ sentPagination.total }}</p>
          </div>
          <div class="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
            <PaperAirplaneIcon class="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <div class="h-1 w-full bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full mt-4 opacity-60"></div>
      </div>

      <div class="group bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Fiyat Girilen</p>
            <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{{ enteredPagination.total }}</p>
          </div>
          <div class="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
            <CalculatorIcon class="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
        <div class="h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mt-4 opacity-60"></div>
      </div>

      <div class="group bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Teklif İletilen</p>
            <p class="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{{ offeredPagination.total }}</p>
          </div>
          <div class="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
            <DocumentCheckIcon class="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div class="h-1 w-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mt-4 opacity-60"></div>
      </div>
    </div>

    <!-- Progress Pipeline -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 mb-6">
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Süreç Akışı</span>
        <span class="text-xs text-gray-500">{{ conversionRate }}% dönüşüm oranı</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="flex-1 h-3 bg-purple-500 rounded-l-full" :style="{ flex: sentPagination.total || 1 }"></div>
        <div class="flex-1 h-3 bg-emerald-500" :style="{ flex: enteredPagination.total || 1 }"></div>
        <div class="flex-1 h-3 bg-blue-500 rounded-r-full" :style="{ flex: offeredPagination.total || 1 }"></div>
      </div>
      <div class="flex items-center justify-between mt-2 text-xs text-gray-500">
        <span>Gönderilen</span>
        <span>Fiyat Girilen</span>
        <span>Teklif İletilen</span>
      </div>
    </div>

    <!-- Filters Card -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6 overflow-hidden">
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
        <div class="flex items-center gap-2">
          <FunnelIcon class="h-5 w-5 text-gray-400" />
          <span class="font-medium text-gray-700 dark:text-gray-300">Filtreler</span>
        </div>
        <button 
          v-if="searchTerm || relevantUserFilter || dateFilter !== 'all'"
          @click="resetFilters"
          class="text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 font-medium"
        >
          Temizle
        </button>
      </div>

      <div class="p-5">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Search -->
          <div>
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
              Ara
            </label>
            <div class="relative">
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                v-model="searchTerm" 
                type="text" 
                class="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                placeholder="İsim, email, telefon..."
              />
            </div>
          </div>

          <!-- User Filter -->
          <div v-if="isAdmin">
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
              Atanan Kullanıcı
            </label>
            <select 
              v-model="relevantUserFilter" 
              class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all appearance-none cursor-pointer"
            >
              <option value="">Tüm Kullanıcılar</option>
              <option v-for="user in usersList" :key="user.id" :value="user.id">
                {{ user.name }}
              </option>
            </select>
          </div>

          <!-- Date Filter -->
          <div>
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
              Tarih Aralığı
            </label>
            <select 
              v-model="dateFilter" 
              class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all appearance-none cursor-pointer"
            >
              <option value="all">Tümü</option>
              <option value="today">Bugün</option>
              <option value="week">Bu Hafta</option>
              <option value="month">Bu Ay</option>
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
    <div v-if="loading" class="flex flex-col items-center justify-center py-16">
      <div class="relative">
        <div class="w-14 h-14 rounded-full border-4 border-violet-100 dark:border-violet-900"></div>
        <div class="absolute top-0 left-0 w-14 h-14 rounded-full border-4 border-transparent border-t-violet-600 animate-spin"></div>
      </div>
      <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">Yükleniyor...</p>
    </div>

    <!-- Three Column Layout -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      
      <!-- Kolon 1: Fiyatlandırmaya Gönderilenler -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
        <!-- Column Header -->
        <div class="relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-purple-500 to-fuchsia-500"></div>
         <div
          class="absolute inset-0 opacity-30"
          style="background-image: url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%3E%3Ccircle%20cx%3D%221%22%20cy%3D%221%22%20r%3D%221%22%20fill%3D%22white%22%20fill-opacity%3D%220.3%22%2F%3E%3C%2Fsvg%3E');"
        ></div>
          <div class="relative px-4 py-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="h-8 w-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <PaperAirplaneIcon class="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2 class="font-semibold text-white text-sm">Fiyatlandırmaya Gönderilen</h2>
                  <p class="text-[10px] text-white/70">İşlem bekliyor</p>
                </div>
              </div>
              <span class="px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                {{ sentPagination.total }}
              </span>
            </div>
          </div>
        </div>

        <!-- Customer List -->
        <div class="flex-1 overflow-y-auto max-h-[450px] divide-y divide-gray-100 dark:divide-gray-700">
          <!-- Empty State -->
          <div v-if="sentToPricing.length === 0" class="flex flex-col items-center justify-center py-10 px-4">
            <div class="h-14 w-14 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3">
              <CurrencyDollarIcon class="h-7 w-7 text-purple-500" />
            </div>
            <p class="text-sm font-medium text-gray-900 dark:text-white mb-1">Müşteri Yok</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 text-center">
              Fiyatlandırmaya gönderilen müşteri bulunmuyor
            </p>
          </div>

          <!-- Customer Cards -->
          <div 
            v-for="customer in sentToPricing" 
            :key="customer.id"
            @click="goToCustomer(customer.id)"
            class="p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all cursor-pointer group"
          >
            <div class="flex items-center gap-3">
              <!-- Avatar -->
              <div class="relative flex-shrink-0">
                <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-sm">
                  <span class="text-xs font-bold text-white">
                    {{ getInitials(customer.name) }}
                  </span>
                </div>
                <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-purple-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></div>
              </div>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <p class="font-medium text-sm text-gray-900 dark:text-white truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {{ customer.name }} {{ customer.surname }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {{ customer.email || customer.phone || '-' }}
                </p>
                <div class="flex items-center gap-2 mt-1">
                  <span class="inline-flex items-center gap-1 text-[10px] text-gray-400">
                    <CalendarIcon class="h-3 w-3" />
                    {{ formatDate(customer.createdAt) }}
                  </span>
                  <span v-if="customer.relevantUserData" class="inline-flex items-center gap-1 px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 rounded text-[10px] text-purple-600 dark:text-purple-400">
                    {{ customer.relevantUserData.name }}
                  </span>
                </div>
              </div>

              <ChevronRightIcon class="h-4 w-4 text-gray-300 group-hover:text-purple-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="sentPagination.totalPages > 1" class="border-t border-gray-100 dark:border-gray-700 px-3 py-2 flex items-center justify-between bg-gray-50 dark:bg-gray-900/50">
          <span class="text-xs text-gray-500">{{ sentPagination.page }}/{{ sentPagination.totalPages }}</span>
          <div class="flex items-center gap-1">
            <button 
              @click="loadSentData(sentPagination.page - 1)"
              :disabled="sentPagination.page <= 1"
              class="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeftIcon class="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button 
              @click="loadSentData(sentPagination.page + 1)"
              :disabled="sentPagination.page >= sentPagination.totalPages"
              class="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRightIcon class="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      <!-- Kolon 2: Fiyatlar Girilenler -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
        <!-- Column Header -->
        <div class="relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
       <div
  class="absolute inset-0 opacity-30"
  style="background-image: url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%3E%3Ccircle%20cx%3D%221%22%20cy%3D%221%22%20r%3D%221%22%20fill%3D%22white%22%20fill-opacity%3D%220.3%22%2F%3E%3C%2Fsvg%3E');"
></div>

          <div class="relative px-4 py-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="h-8 w-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <CalculatorIcon class="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2 class="font-semibold text-white text-sm">Fiyatlar Girilen</h2>
                  <p class="text-[10px] text-white/70">Teklif hazır</p>
                </div>
              </div>
              <span class="px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                {{ enteredPagination.total }}
              </span>
            </div>
          </div>
        </div>

        <!-- Customer List -->
        <div class="flex-1 overflow-y-auto max-h-[450px] divide-y divide-gray-100 dark:divide-gray-700">
          <!-- Empty State -->
          <div v-if="priceEntered.length === 0" class="flex flex-col items-center justify-center py-10 px-4">
            <div class="h-14 w-14 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-3">
              <CalculatorIcon class="h-7 w-7 text-emerald-500" />
            </div>
            <p class="text-sm font-medium text-gray-900 dark:text-white mb-1">Müşteri Yok</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 text-center">
              Fiyatı girilen müşteri bulunmuyor
            </p>
          </div>

          <!-- Customer Cards -->
          <div 
            v-for="customer in priceEntered" 
            :key="customer.id"
            @click="goToCustomer(customer.id)"
            class="p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all cursor-pointer group"
          >
            <div class="flex items-center gap-3">
              <!-- Avatar -->
              <div class="relative flex-shrink-0">
                <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm">
                  <span class="text-xs font-bold text-white">
                    {{ getInitials(customer.name) }}
                  </span>
                </div>
                <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                  <CheckIcon class="w-2 h-2 text-white" />
                </div>
              </div>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <p class="font-medium text-sm text-gray-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {{ customer.name }} {{ customer.surname }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {{ customer.email || customer.phone || '-' }}
                </p>
                <div class="flex items-center gap-2 mt-1">
                  <span class="inline-flex items-center gap-1 text-[10px] text-gray-400">
                    <CalendarIcon class="h-3 w-3" />
                    {{ formatDate(customer.createdAt) }}
                  </span>
                  <span v-if="customer.relevantUserData" class="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 rounded text-[10px] text-emerald-600 dark:text-emerald-400">
                    {{ customer.relevantUserData.name }}
                  </span>
                </div>
              </div>

              <ChevronRightIcon class="h-4 w-4 text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="enteredPagination.totalPages > 1" class="border-t border-gray-100 dark:border-gray-700 px-3 py-2 flex items-center justify-between bg-gray-50 dark:bg-gray-900/50">
          <span class="text-xs text-gray-500">{{ enteredPagination.page }}/{{ enteredPagination.totalPages }}</span>
          <div class="flex items-center gap-1">
            <button 
              @click="loadEnteredData(enteredPagination.page - 1)"
              :disabled="enteredPagination.page <= 1"
              class="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeftIcon class="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button 
              @click="loadEnteredData(enteredPagination.page + 1)"
              :disabled="enteredPagination.page >= enteredPagination.totalPages"
              class="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRightIcon class="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      <!-- Kolon 3: Fiyat Teklifi İletilenler -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
        <!-- Column Header -->
        <div class="relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
         <div
          class="absolute inset-0 opacity-30"
          style="background-image: url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%3E%3Ccircle%20cx%3D%221%22%20cy%3D%221%22%20r%3D%221%22%20fill%3D%22white%22%20fill-opacity%3D%220.3%22%2F%3E%3C%2Fsvg%3E');"
        ></div>

          <div class="relative px-4 py-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="h-8 w-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <DocumentCheckIcon class="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2 class="font-semibold text-white text-sm">Fiyat Teklifi İletilen</h2>
                  <p class="text-[10px] text-white/70">Cevap bekleniyor</p>
                </div>
              </div>
              <span class="px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                {{ offeredPagination.total }}
              </span>
            </div>
          </div>
        </div>

        <!-- Customer List -->
        <div class="flex-1 overflow-y-auto max-h-[450px] divide-y divide-gray-100 dark:divide-gray-700">
          <!-- Empty State -->
          <div v-if="priceOffered.length === 0" class="flex flex-col items-center justify-center py-10 px-4">
            <div class="h-14 w-14 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
              <DocumentCheckIcon class="h-7 w-7 text-blue-500" />
            </div>
            <p class="text-sm font-medium text-gray-900 dark:text-white mb-1">Müşteri Yok</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 text-center">
              Fiyat teklifi iletilen müşteri bulunmuyor
            </p>
          </div>

          <!-- Customer Cards -->
          <div 
            v-for="customer in priceOffered" 
            :key="customer.id"
            @click="goToCustomer(customer.id)"
            class="p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all cursor-pointer group"
          >
            <div class="flex items-center gap-3">
              <!-- Avatar -->
              <div class="relative flex-shrink-0">
                <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-sm">
                  <span class="text-xs font-bold text-white">
                    {{ getInitials(customer.name) }}
                  </span>
                </div>
                <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                  <ClockIcon class="w-2 h-2 text-white" />
                </div>
              </div>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <p class="font-medium text-sm text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {{ customer.name }} {{ customer.surname }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {{ customer.email || customer.phone || '-' }}
                </p>
                <div class="flex items-center gap-2 mt-1">
                  <span class="inline-flex items-center gap-1 text-[10px] text-gray-400">
                    <CalendarIcon class="h-3 w-3" />
                    {{ formatDate(customer.createdAt) }}
                  </span>
                  <span v-if="customer.relevantUserData" class="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 rounded text-[10px] text-blue-600 dark:text-blue-400">
                    {{ customer.relevantUserData.name }}
                  </span>
                </div>
              </div>

              <ChevronRightIcon class="h-4 w-4 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="offeredPagination.totalPages > 1" class="border-t border-gray-100 dark:border-gray-700 px-3 py-2 flex items-center justify-between bg-gray-50 dark:bg-gray-900/50">
          <span class="text-xs text-gray-500">{{ offeredPagination.page }}/{{ offeredPagination.totalPages }}</span>
          <div class="flex items-center gap-1">
            <button 
              @click="loadOfferedData(offeredPagination.page - 1)"
              :disabled="offeredPagination.page <= 1"
              class="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeftIcon class="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button 
              @click="loadOfferedData(offeredPagination.page + 1)"
              :disabled="offeredPagination.page >= offeredPagination.totalPages"
              class="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRightIcon class="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  CurrencyDollarIcon,
  DocumentCheckIcon,
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  UsersIcon,
  PaperAirplaneIcon,
  CalculatorIcon,
  CheckIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/vue/24/outline'
import { watchDebounced } from '@vueuse/core'

definePageMeta({
  layout: 'default'
})

const api = useApi()
const router = useRouter()
const authStore = useAuthStore()
const { isAdmin, getCustomerFilters } = usePermissions()

// Status IDs
const STATUS_SENT_TO_PRICING = 7
const STATUS_PRICE_ENTERED = 8
const STATUS_PRICE_OFFERED = 14

// State
const loading = ref(true)
const searchTerm = ref('')
const relevantUserFilter = ref('')
const dateFilter = ref('all')
const usersList = ref([])

// Kolon verileri
const sentToPricing = ref([])
const sentPagination = ref({ page: 1, limit: 20, total: 0, totalPages: 0 })

const priceEntered = ref([])
const enteredPagination = ref({ page: 1, limit: 20, total: 0, totalPages: 0 })

const priceOffered = ref([])
const offeredPagination = ref({ page: 1, limit: 20, total: 0, totalPages: 0 })

// Computed
const totalCount = computed(() => 
  sentPagination.value.total + enteredPagination.value.total + offeredPagination.value.total
)

const conversionRate = computed(() => {
  if (totalCount.value === 0) return 0
  return Math.round((offeredPagination.value.total / totalCount.value) * 100)
})

// API Calls
const buildQuery = (statusId, page = 1) => {
  const baseFilters = getCustomerFilters()
  const query = {
    ...baseFilters,
    status: statusId,
    page,
    limit: 20
  }

  if (searchTerm.value) query.search = searchTerm.value
  if (relevantUserFilter.value) query.relevantUser = relevantUserFilter.value
  if (dateFilter.value && dateFilter.value !== 'all') query.dateFilter = dateFilter.value

  return query
}

const loadSentData = async (page = 1) => {
  try {
    const query = buildQuery(STATUS_SENT_TO_PRICING, page)
    const response = await api('/customers', { query })
    sentToPricing.value = Array.isArray(response) ? response : response.data || []
    if (response.meta) {
      sentPagination.value = {
        page: response.meta.page || 1,
        limit: response.meta.limit || 20,
        total: response.meta.total || 0,
        totalPages: Math.ceil((response.meta.total || 0) / (response.meta.limit || 20))
      }
    }
  } catch (error) {
    console.error('Sent data yükleme hatası:', error)
  }
}

const loadEnteredData = async (page = 1) => {
  try {
    const query = buildQuery(STATUS_PRICE_ENTERED, page)
    const response = await api('/customers', { query })
    priceEntered.value = Array.isArray(response) ? response : response.data || []
    if (response.meta) {
      enteredPagination.value = {
        page: response.meta.page || 1,
        limit: response.meta.limit || 20,
        total: response.meta.total || 0,
        totalPages: Math.ceil((response.meta.total || 0) / (response.meta.limit || 20))
      }
    }
  } catch (error) {
    console.error('Entered data yükleme hatası:', error)
  }
}

const loadOfferedData = async (page = 1) => {
  try {
    const query = buildQuery(STATUS_PRICE_OFFERED, page)
    const response = await api('/customers', { query })
    priceOffered.value = Array.isArray(response) ? response : response.data || []
    if (response.meta) {
      offeredPagination.value = {
        page: response.meta.page || 1,
        limit: response.meta.limit || 20,
        total: response.meta.total || 0,
        totalPages: Math.ceil((response.meta.total || 0) / (response.meta.limit || 20))
      }
    }
  } catch (error) {
    console.error('Offered data yükleme hatası:', error)
  }
}

const loadAllData = async () => {
  loading.value = true
  try {
    await Promise.all([
      loadSentData(1),
      loadEnteredData(1),
      loadOfferedData(1)
    ])
  } finally {
    loading.value = false
  }
}

const loadUsers = async () => {
  try {
    const response = await api('/users')
    if (Array.isArray(response)) {
      usersList.value = response.map(u => ({
        id: u.id,
        name: `${u.name || ''} ${u.surname || ''}`.trim()
      }))
    }
  } catch (error) {
    console.error('Kullanıcılar yüklenemedi:', error)
  }
}

// Helpers
const goToCustomer = (customerId) => {
  router.push(`/customers/show/${customerId}`)
}

const resetFilters = () => {
  searchTerm.value = ''
  relevantUserFilter.value = ''
  dateFilter.value = 'all'
  loadAllData()
}

const getInitials = (name) => {
  if (!name) return '?'
  return name.charAt(0).toUpperCase()
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'short'
  })
}

// Watchers
watchDebounced(
  [searchTerm, relevantUserFilter, dateFilter],
  () => loadAllData(),
  { debounce: 500 }
)

onMounted(async () => {
  await loadUsers()
  await loadAllData()
})

useHead({ title: 'Fiyatlandırmalar - Valdori CRM' })
</script>