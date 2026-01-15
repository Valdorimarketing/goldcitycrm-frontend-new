<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8 flex gap-2 justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Performans Paneli</h1>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Kullanıcı etkileşimleri ve performans takibi
          </p>
        </div>
        <button class="btn-secondary" @click="initFuncs()">Yenile</button>
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Aktif Süreçler -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
              <svg class="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400">CANLI</span>
          </div>
          <div class="space-y-1">
            <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ kpiData.activeProcesses }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Aktif Süreçler</p>
          </div>
          <div class="mt-4 flex items-center space-x-4 text-xs">
            <span class="inline-flex items-center text-blue-600 dark:text-blue-400">
              <span class="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400 mr-1.5"></span>
              Satışçı: {{ kpiData.salesActive }}
            </span>
            <span class="inline-flex items-center text-purple-600 dark:text-purple-400">
              <span class="h-2 w-2 rounded-full bg-purple-600 dark:bg-purple-400 mr-1.5"></span>
              Doktor: {{ kpiData.doctorActive }}
            </span>
          </div>
        </div>

        <!-- Ortalama İlk Temas -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <svg class="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span class="text-xs font-medium text-green-600 dark:text-green-400">🟢 İYİ</span>
          </div>
          <div class="space-y-1">
            <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ kpiData.avgFirstTouch }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Ort. İlk Temas</p>
          </div>
          <p class="mt-4 text-xs text-gray-500 dark:text-gray-400">
            Atanmadan profile bakış süresi
          </p>
        </div>

        <!-- Ortalama Cevap Süresi -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
              <svg class="h-6 w-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <span class="text-xs font-medium text-amber-600 dark:text-amber-400">🟡 ORTA</span>
          </div>
          <div class="space-y-1">
            <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ kpiData.avgFirstCall }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Ort. İlk Arama</p>
          </div>
          <p class="mt-4 text-xs text-gray-500 dark:text-gray-400">
            Atanmadan aramaya başlama süresi
          </p>
        </div>

        <!-- Bu Hafta Kapanan -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
              <svg class="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span class="text-xs font-medium text-indigo-600 dark:text-indigo-400">↑ %12</span>
          </div>
          <div class="space-y-1">
            <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ kpiData.closedThisWeek }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Bu Hafta Kapanan</p>
          </div>
          <p class="mt-4 text-xs text-gray-500 dark:text-gray-400">
            Satış + İptal engagementleri
          </p>
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6 border border-gray-200 dark:border-gray-700">
        <div class="flex flex-wrap items-center gap-4">
          <!-- Search -->
          <div class="flex-1 min-w-[200px]">
            <div class="relative">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input v-model="searchQuery" type="text" placeholder="Kullanıcı ara..."
                class="block w-full rounded-lg border-0 py-2 pl-10 pr-3 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 text-sm" />
            </div>
          </div>

          <!-- Role Filter -->
          <select v-model="roleFilter"
            class="rounded-lg border-0 py-2 pl-3 pr-10 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 text-sm">
            <option value="all">Tüm Roller</option>
            <option value="sales">Sales</option>
            <option value="doctor">Doctor</option>
          </select>

          <!-- Sort -->
          <select v-model="sortBy"
            class="rounded-lg border-0 py-2 pl-3 pr-10 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 text-sm">
            <option value="slowest">En Yavaş</option>
            <option value="fastest">En Hızlı</option>
            <option value="alphabetic">Alfabetik</option>
            <option value="mostActive">En Aktif</option>
          </select>

          <!-- Period -->
          <div class="flex rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
            <button @click="period = 'week'" :class="[
              period === 'week'
                ? 'bg-white dark:bg-gray-600 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
              'px-3 py-1.5 text-sm font-medium rounded-md transition-all'
            ]">
              Bu Hafta
            </button>
            <button @click="period = 'month'" :class="[
              period === 'month'
                ? 'bg-white dark:bg-gray-600 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
              'px-3 py-1.5 text-sm font-medium rounded-md transition-all'
            ]">
              Bu Ay
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p class="text-gray-600 dark:text-gray-400">Veriler yükleniyor...</p>
        </div>
      </div>

      <!-- User Cards Grid -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div v-for="user in filteredUsers" :key="user.id"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer"
          @click="openUserDetail(user)">
          <!-- User Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="relative">

                <img :src="path + user.avatar" v-if="user.avatar" class="h-12 w-12 rounded-full">
                <div v-else
                  class="h-12 w-12 rounded-full bg-gradient-to-br to-amber-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
                  {{ user.name.charAt(0) }}
                </div>
                <span v-if="user.activeEngagement"
                  class="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white dark:border-gray-800 animate-pulse"></span>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ user.name }}</h3>
                <span :class="[
                  user.role === 'sales'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
                  'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium'
                ]">
                  {{ user.role.toUpperCase() == 'SALES' ? 'Satışçı' : 'Doktor' }}
                </span>
              </div>
            </div>

            <!-- Speed Indicator -->
           <div :class="[
              getSpeedColor(user.stats.avgFirstTouchMinutes),
              'px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1'
            ]">
              <span>{{ getSpeedLabel(user.stats.avgFirstTouchMinutes) }}</span>
              <span class="opacity-75">
                ({{ formatFirstTouch(user.stats.avgFirstTouchMinutes) }})
              </span>
            </div>
          </div>

          <!-- Active Timer (if any) -->
        <div class="space-y-2">
          <div v-if="user.activeEngagements && user.activeEngagements.length > 0">
            <div v-for="engagement in user.activeEngagements" :key="engagement.customerId"
              class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
              <div class="flex items-center justify-between mb-2">
                <div class="flex-1">
                  <h5 class="font-medium text-gray-900 dark:text-white text-sm">
                    {{ engagement.customerName }}
                  </h5>
                  <p class="text-xs text-gray-600 dark:text-gray-400">
                    {{ engagement.status }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-mono font-bold text-blue-600 dark:text-blue-400">
                    {{ engagement.timer }}
                  </p>
                  <p class="text-xs text-gray-600 dark:text-gray-400">
                    {{ engagement.phase }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
            Aktif müşteri yok
          </div>
        </div>

          <!-- Stats -->
          <div class="space-y-3 my-4">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">Bu {{ period === 'week' ? 'Hafta' : 'Ay' }}:</span>
              <span class="font-semibold text-gray-900 dark:text-white">{{ user.stats.totalCustomers }} müşteri</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">Ort. İlk Temas:</span>
              <span class="font-semibold text-gray-900 dark:text-white">{{ user.stats.avgFirstTouch }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">Ort. Kapanış:</span>
              <span class="font-semibold text-gray-900 dark:text-white">{{ user.stats.avgClosing }}</span>
            </div>
          </div>

          <!-- Active & Conversion -->
          <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div class="flex items-center space-x-4 text-xs">
              <span class="inline-flex items-center text-blue-600 dark:text-blue-400">
                <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Aktif: {{ user.stats.activeCount }}
              </span>
              <span class="inline-flex items-center text-green-600 dark:text-green-400">
                <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Dönüşüm: %{{ user.stats.conversionRate }}
              </span>
            </div>
            <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredUsers.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Kullanıcı bulunamadı</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Farklı filtreler deneyin
        </p>
      </div>
    </div>

    <!-- User Detail Modal -->
    <Teleport to="body">
      <Transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100"
        leave-active-class="duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="showUserDetailModal" class="fixed inset-0 z-50 overflow-y-auto">
          <!-- Backdrop -->
          <div class="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/80 backdrop-blur-sm transition-opacity"
            @click="closeUserDetail"></div>

          <!-- Modal -->
          <div class="flex min-h-screen items-center justify-center p-4">
            <Transition enter-active-class="duration-300 ease-out"
              enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to-class="opacity-100 translate-y-0 sm:scale-100" leave-active-class="duration-200 ease-in"
              leave-from-class="opacity-100 translate-y-0 sm:scale-100"
              leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <div v-if="showUserDetailModal && selectedUser"
                class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl transition-all w-full max-w-5xl max-h-[90vh] flex flex-col">
                <!-- Header -->
                <div class="bg-gradient-to-r to-amber-400 to-amber-500 px-6 py-4 flex-shrink-0">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                      <div
                        class="h-14 w-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white font-bold text-xl">
                        {{ selectedUser.name.charAt(0) }}
                      </div>
                      <div>
                        <h3 class="text-xl font-semibold text-white">{{ selectedUser.name }}</h3>
                        <p class="text-sm text-indigo-100">
                          {{ selectedUser.role === 'sales' ? 'Sales Temsilcisi' : 'Doktor' }} • Performans
                          Detayı
                        </p>
                      </div>
                    </div>
                    <button @click="closeUserDetail" class="rounded-lg p-2 hover:bg-white/20 transition-colors">
                      <svg class="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Content -->
                <div class="flex-1 overflow-y-auto p-6">
                  <!-- Summary Metrics -->
                  <div class="mb-6">
                    <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <svg class="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Özet Metrikler (Son 30 Gün)
                    </h4>
                    <div class="grid grid-cols-4 gap-4">
                      <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Toplam Lead</p>
                        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ selectedUser.stats.totalCustomers
                        }}</p>
                      </div>
                      <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">İlk Temas</p>
                        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{
                          selectedUser.stats.avgFirstTouchMinutes }} <span class="text-sm">dk</span> </p>
                      </div>
                      <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Ortalama Süre</p>
                        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{
                          selectedUser.stats.avgClosingMinutes }} <span class="text-sm">dk</span></p>
                      </div>
                      <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Dönüşüm</p>
                        <p class="text-2xl font-bold text-green-600 dark:text-green-400">%{{
                          selectedUser.stats.conversionRate }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Active Engagements -->
                  <div v-if="selectedUser.activeEngagement" class="mb-6">
                    <div class="flex items-center justify-between mb-4">
                      <h4 class="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                        <svg class="h-5 w-5 mr-2 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Aktif Engagementler
                        <span
                          class="ml-2 inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-0.5 text-xs font-medium text-green-800 dark:text-green-400">
                          {{ selectedUser.stats.activeCount }}
                        </span>
                      </h4>
                      <button class="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                        Tümünü Gör
                      </button>
                    </div>

                    <div class="space-y-3">
                      <div
                        class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                        <div class="flex items-start justify-between mb-3">
                          <div class="flex-1">
                            <h5 class="font-semibold text-gray-900 dark:text-white">
                              {{ selectedUser.activeEngagement.customerName }}
                            </h5>
                            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              📍 {{ selectedUser.activeEngagement.status }}
                            </p>
                          </div>
                          <div class="text-right">
                            <p class="text-2xl font-bold text-green-700 dark:text-green-400 font-mono">
                              {{ selectedUser.activeEngagement.timer }}
                            </p>
                            <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {{ selectedUser.activeEngagement.phase }}
                            </p>
                          </div>
                        </div>
                        <div class="flex items-center justify-between">
                          <div class="flex items-center space-x-3 text-xs text-gray-600 dark:text-gray-400">
                            <span>Son İşlem: {{ getFromNow(selectedUser.activeEngagement.lastTouchAt) }} </span>
                          </div>
                          <NuxtLink :to="`/customers/show/${selectedUser.activeEngagement.customerId}`"
                            class="inline-flex items-center rounded-lg bg-white dark:bg-gray-700 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                            Müşteriyi Aç
                            <svg class="ml-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                            </svg>
                          </NuxtLink>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Speed Distribution Chart (Placeholder) -->
                  <EngagementspeedChart :history="userHistory" :activeEngagement="selectedUser.activeEngagement" />

                  <!-- History -->
                  <div class="mt-6">
                    <div class="flex items-center justify-between mb-4">
                      <h4 class="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                        <svg class="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Geçmiş (Son 20 Engagement)
                      </h4>
                      <select v-model="historyFilter"
                        class="rounded-lg border-0 py-1.5 pl-3 pr-8 text-xs text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700">
                        <option value="all">Tümü</option>
                        <option value="completed">Tamamlanan</option>
                        <option value="cancelled">İptal</option>
                      </select>
                    </div>

                    <div class="space-y-2">
                      <div v-for="item in filteredHistory" :key="item.id"
                        class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer group"
                        @click="openEngagementTimeline(item)">
                        <div class="flex items-center justify-between mb-2">
                          <div class="flex items-center space-x-3">
                            <div :class="[
                              item.status === 'completed'
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400',
                              'h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold'
                            ]">
                              {{ item.status === 'completed' ? '✓' : '✕' }}
                            </div>
                            <div>
                              <h5 class="font-semibold text-gray-900 dark:text-white">{{ item.customerName }}</h5>
                              <p class="text-xs text-gray-600 dark:text-gray-400">
                                {{ getFormatDate(item.startDate) }} - {{ getFromNow(item.startDate) }}
                              </p>
                            </div>
                          </div>
                          <div class="text-right">
                            <p class="text-lg font-bold text-gray-900 dark:text-white">{{ item.duration }}</p>
                            <p class="text-xs text-gray-600 dark:text-gray-400">Toplam Süre</p>
                          </div>
                        </div>

                        <div class="flex items-center justify-between text-xs">
                          <div class="flex items-center space-x-4">
                            <span class="text-gray-600 dark:text-gray-400">
                              ⚡ İlk Temas: <span class="font-medium text-gray-900 dark:text-white">
                                {{ formatMinutes(item.firstTouchMinutes) }}
                              </span>
                            </span>
                            <span v-if="item.firstCallMinutes" class="text-gray-600 dark:text-gray-400">
                              📞 İlk Arama: <span class="font-medium text-gray-900 dark:text-white">
                                {{ formatMinutes(item.firstCallMinutes) }}
                              </span>
                            </span>
                          </div>
                          <div class="flex items-center space-x-2">
                            <span :class="[
                              item.status === 'completed'
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400',
                              'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium'
                            ]">
                              {{ item.result }}
                            </span>
                            <svg class="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                              fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Empty State -->
                    <div v-if="filteredHistory.length === 0" class="text-center py-8">
                      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Geçmiş bulunamadı</p>
                    </div>
                  </div>
                </div>

                <!-- Footer -->
                <div class="border-t dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
                  <div class="flex items-center justify-between">
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      Toplam <span class="font-medium">{{ filteredHistory.length }}</span> kayıt
                    </p>
                    <div class="flex items-center space-x-2">
                      <button @click="closeUserDetail"
                        class="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors">
                        Kapat
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Timeline Detail Modal -->
    <Teleport to="body">
      <Transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100"
        leave-active-class="duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="showTimelineModal" class="fixed inset-0 z-[60] overflow-y-auto">
          <!-- Backdrop -->
          <div class="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/80 backdrop-blur-sm transition-opacity"
            @click="closeTimelineModal"></div>

          <!-- Modal -->
          <div class="flex min-h-screen items-center justify-center p-4">
            <Transition enter-active-class="duration-300 ease-out"
              enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to-class="opacity-100 translate-y-0 sm:scale-100" leave-active-class="duration-200 ease-in"
              leave-from-class="opacity-100 translate-y-0 sm:scale-100"
              leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <div v-if="showTimelineModal && selectedEngagement"
                class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl transition-all w-full max-w-3xl max-h-[90vh] flex flex-col">
                <!-- Header -->
                <div class="bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-4 flex-shrink-0">
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="text-xl font-semibold text-white">
                        {{ selectedEngagement.customerName }}
                      </h3>
                      <p class="text-sm text-cyan-100 mt-1">
                        Sorumlu: {{ selectedUser.name }} • Engagement Timeline
                      </p>
                    </div>
                    <button @click="closeTimelineModal" class="rounded-lg p-2 hover:bg-white/20 transition-colors">
                      <svg class="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Summary Bar -->
                <div class="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 border-b dark:border-gray-700 flex-shrink-0">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-6">
                      <div>
                        <p class="text-xs text-gray-500 dark:text-gray-400">Toplam Süre</p>
                        <p class="text-lg font-bold text-gray-900 dark:text-white">{{ selectedEngagement.duration }}</p>
                      </div>
                      <div class="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>
                      <div>
                        <p class="text-xs text-gray-500 dark:text-gray-400">Sonuç</p>
                        <p :class="[
                          selectedEngagement.status === 'completed'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400',
                          'text-lg font-bold'
                        ]">
                          {{ selectedEngagement.result }}
                        </p>
                      </div>
                      <div class="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>
                      <div>
                        <p class="text-xs text-gray-500 dark:text-gray-400">Tarih</p>
                        <p class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ selectedEngagement.startDate.split(' ')[0] }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Timeline Content -->
                <div class="flex-1 overflow-y-auto p-6">
                  <div class="relative">
                    <!-- Timeline Line -->
                    <div class="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

                    <!-- Timeline Events -->
                    <div class="space-y-6">
                      <div v-for="(event, index) in timelineEvents" :key="event.id" class="relative pl-14">
                        <!-- Icon -->
                        <div :class="[
                          getEventColorClass(event.color),
                          'absolute left-0 flex h-12 w-12 items-center justify-center rounded-full ring-4 ring-white dark:ring-gray-800'
                        ]" v-html="iconComponents[event.icon]"></div>

                        <!-- Content -->
                        <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                          <div class="flex items-start justify-between mb-2">
                            <div class="flex-1">
                              <div class="flex items-center space-x-2 mb-1">
                                <h4 class="text-sm font-bold text-gray-900 dark:text-white">
                                  {{ event.title }}
                                </h4>
                                <span v-if="event.duration" :class="[
                                  getSpeedBadgeClass(event.speed),
                                  'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium'
                                ]">
                                  {{ event.duration }}
                                </span>
                              </div>
                              <p class="text-sm text-gray-600 dark:text-gray-400">
                                {{ event.description }}
                              </p>
                              <p v-if="event.note" class="text-xs text-gray-500 dark:text-gray-500 mt-2 italic">
                                💬 Not: "{{ event.note }}"
                              </p>
                            </div>
                            <span class="text-xs font-medium text-gray-500 dark:text-gray-400 ml-4">
                              🕐 {{ event.time }}
                            </span>
                          </div>

                          <!-- Performance Badge -->
                          <div v-if="event.speed" class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                            <div class="flex items-center space-x-2">
                              <span class="text-xs text-gray-500 dark:text-gray-400">Performans:</span>
                              <span :class="[
                                event.speed === 'fast' ? 'text-green-600 dark:text-green-400' :
                                  event.speed === 'normal' ? 'text-yellow-600 dark:text-yellow-400' :
                                    'text-red-600 dark:text-red-400',
                                'text-xs font-semibold'
                              ]">
                                {{ event.speed === 'fast' ? '🟢 Hızlı' : event.speed === 'normal' ? '🟡 Normal' : '🔴 Yavaş' }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Performance Summary -->
                  <div
                    class="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                    <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <svg class="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Performans Analizi
                    </h4>
                    <div class="grid grid-cols-3 gap-4">
                      <div>
                        <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">İlk Temas Hızı</p>
                        <p class="text-sm font-bold text-green-600 dark:text-green-400">
                          🟢 Hızlı ({{ selectedEngagement.firstTouch }})
                        </p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">İlk Arama Hızı</p>
                        <p class="text-sm font-bold text-yellow-600 dark:text-yellow-400">
                          🟡 Normal ({{ selectedEngagement.firstCall || 'N/A' }})
                        </p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Kapanış Süresi</p>
                        <p class="text-sm font-bold text-green-600 dark:text-green-400">
                          🟢 Hızlı ({{ selectedEngagement.duration }})
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Footer -->
                <div class="border-t dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
                  <div class="flex items-center justify-between">
                    <NuxtLink :to="`/customers/show/${selectedEngagement.customerId}`"
                      class="inline-flex items-center rounded-lg bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border border-gray-300 dark:border-gray-600">
                      <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Müşteri Profiline Git
                    </NuxtLink>
                    <button @click="closeTimelineModal"
                      class="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors">
                      Kapat
                    </button>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import EngagementspeedChart from './EngagementspeedChart.vue'

import {
  CalendarIcon,
  PhoneIcon,
  CheckCircleIcon,
  BellIcon,
  ArrowPathIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  SparklesIcon,
  CalendarDaysIcon,
} from '@heroicons/vue/24/outline';

// Engagement API
const {
  fetchDashboardKpi,
  fetchUserPerformanceList,
  fetchUserHistory,
  fetchEngagementTimeline
} = useEngagements()
const { $dayjs } = useNuxtApp()


const config = useRuntimeConfig()
const path = config.public.apiBase


// STATE
const loading = ref(true)
const users = ref([])
const kpiData = ref({
  activeProcesses: 0,
  salesActive: 0,
  doctorActive: 0,
  avgFirstTouch: '-',
  avgFirstCall: '-',
  closedThisWeek: 0
})

const searchQuery = ref('')
const roleFilter = ref('all')
const sortBy = ref('slowest')
const period = ref('week')

// MODALS
const selectedUser = ref(null)
const showUserDetailModal = ref(false)

const selectedEngagement = ref(null)
const showTimelineModal = ref(false)

const userHistory = ref([])
const historyFilter = ref('all')

const timelineEvents = ref([])

// --------------------------------------------------
// FETCH KPI
// --------------------------------------------------
const loadKpi = async () => {
  try {
    const res = await fetchDashboardKpi()
    kpiData.value = res
  } catch (e) {
    console.error(e)
  }
}

// --------------------------------------------------
// FETCH USER PERFORMANCE LIST
// --------------------------------------------------
const loadUsers = async () => {
  try {
    const res = await fetchUserPerformanceList(period.value)

    // API direkt kullanıcı listesi döndürüyor
    users.value = res || []
  } catch (e) {
    console.error(e)
    users.value = []
  }
}

const getFromNow = (timeStr) => {
  return $dayjs(timeStr).fromNow()
}

const getFormatDate = (timeStr) => {
  return $dayjs(timeStr).format('DD MMM YYYY, HH:mm')
}



// --------------------------------------------------
// OPEN USER DETAIL (load history)
// --------------------------------------------------
const openUserDetail = async (user) => {
  console.log(user);

  selectedUser.value = user
  showUserDetailModal.value = true

  try {
    const res = await fetchUserHistory(user.id)
    userHistory.value = res || []
  } catch (e) {
    console.error(e)
    userHistory.value = []
  }
}

const closeUserDetail = () => {
  showUserDetailModal.value = false
  selectedUser.value = null
  userHistory.value = []
  historyFilter.value = 'all'
}

// --------------------------------------------------
// TIMELINE MODAL
// --------------------------------------------------
const openEngagementTimeline = async (engagement) => {
  selectedEngagement.value = engagement
  showTimelineModal.value = true

  try {
    const res = await fetchEngagementTimeline(engagement.id)
    timelineEvents.value = res || []
  } catch (e) {
    console.error(e)
    timelineEvents.value = []
  }
}

const closeTimelineModal = () => {
  showTimelineModal.value = false
  selectedEngagement.value = null
  timelineEvents.value = []
}

// --------------------------------------------------
// FILTERS
// --------------------------------------------------
const filteredHistory = computed(() => {
  if (historyFilter.value === 'all') return userHistory.value
  return userHistory.value.filter((i) => i.status === historyFilter.value)
})

const parseTime = (str) => {
  if (!str) return 999999
  const h = str.match(/(\d+)sa/) ? parseInt(str.match(/(\d+)sa/)[1]) : 0
  const m = str.match(/(\d+)(dk|dakika)/) ? parseInt(str.match(/(\d+)(dk|dakika)/)[1]) : 0
  return h * 60 + m
}

const filteredUsers = computed(() => {
  let list = [...users.value]

  if (searchQuery.value)
    list = list.filter((u) =>
      u.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )

  if (roleFilter.value !== 'all')
    list = list.filter((u) => u.role === roleFilter.value)

  list.sort((a, b) => {
    switch (sortBy.value) {
      case 'slowest':
        return parseTime(b.stats.avgFirstTouch) - parseTime(a.stats.avgFirstTouch)
      case 'fastest':
        return parseTime(a.stats.avgFirstTouch) - parseTime(b.stats.avgFirstTouch)
      case 'alphabetic':
        return a.name.localeCompare(b.name)
      case 'mostActive':
        return b.stats.activeCount - a.stats.activeCount
    }
  })

  return list
})

// --------------------------------------------------
// SPEED BADGES
// --------------------------------------------------
const getSpeedColor = (minutes) => {
  if (!minutes || minutes === 0) return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
  
  if (minutes < 1) return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400';
  if (minutes < 5) return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400';
  if (minutes < 15) return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400';
  if (minutes < 30) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400';
  return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400';
}

const getSpeedLabel = (minutes) => {
  if (!minutes || minutes === 0) return 'Veri yok';
  
  if (minutes < 1) return '⚡ Çok Hızlı'; // 1 dakikadan az
  if (minutes < 5) return '🚀 Hızlı'; // 1-5 dakika
  if (minutes < 15) return '✓ Normal'; // 5-15 dakika
  if (minutes < 30) return '🐌 Yavaş'; // 15-30 dakika
  return '🚨 Çok Yavaş'; // 30+ dakika
}

// Eğer formatlanmış string istiyorsanız:
const formatFirstTouch = (minutes) => {
  if (!minutes || minutes === 0) return 'Veri yok';
  
  if (minutes < 1) {
    const seconds = Math.round(minutes * 60);
    return `${seconds} saniye`;
  }
  
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  
  if (hours > 0) {
    return `${hours} saat ${mins} dakika`;
  }
  return `${mins} dakika`;
}

const timeToSeconds = (t) => {
  const [h, m, s] = t.split(":").map(Number)
  return h * 3600 + m * 60 + s
}

const secondsToTime = (sec) => {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

const initializeTimers = () => {
  users.value.forEach(user => {
    if (user.activeEngagement) {
      user.activeEngagement._seconds = timeToSeconds(user.activeEngagement.timer)
    }
  })
}

const formatMinutes = (minutes) => {
  if (!minutes || minutes === 0) return '0 dakika';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0 && mins > 0) {
    return `${hours} saat ${mins} dakika`;
  } else if (hours > 0) {
    return `${hours} saat`;
  } else {
    return `${mins} dakika`;
  }
}


const iconComponents = {
  'meeting': CalendarIcon,
  'call': PhoneIcon,
  'task': CheckCircleIcon,
  'reminder': BellIcon,
  'follow-up': ArrowPathIcon,
  'appointment': ClockIcon,
  'deadline': ExclamationTriangleIcon,
  'email': EnvelopeIcon,
  'note': DocumentTextIcon,
  'event': SparklesIcon,
  'default': CalendarDaysIcon,
};


let timerInterval = null

const startGlobalTimer = () => {
  if (timerInterval) return  // 2 kere başlama

  timerInterval = setInterval(() => {
    users.value.forEach(user => {
      if (user.activeEngagement?._seconds >= 0) {
        user.activeEngagement._seconds++
        user.activeEngagement.timer = secondsToTime(user.activeEngagement._seconds)
      }
    })
  }, 1000)
}

const getEventColorClass = (event) => {
  
  // 1. Eğer event'in bir statusData varsa, onun rengini kullan
  if (event.statusData?.color) {
    return event.statusData.color;
  }
  
  // 2. Eğer event'in type'ı varsa, type'a göre renk ver
  if (event.type) {
    const typeColors = {
      'meeting': 'bg-blue-500',
      'call': 'bg-green-500',
      'task': 'bg-purple-500',
      'reminder': 'bg-yellow-500',
      'follow-up': 'bg-orange-500',
      'appointment': 'bg-indigo-500',
      'deadline': 'bg-red-500',
    };
    return typeColors[event.type] || 'bg-gray-500';
  }
  
  // 3. Eğer event'in priority'si varsa, önceliğe göre renk ver
  if (event.priority) {
    const priorityColors = {
      'high': 'bg-red-500',
      'medium': 'bg-yellow-500',
      'low': 'bg-green-500',
    };
    return priorityColors[event.priority] || 'bg-gray-500';
  }
  
  // 4. Default renk
  return 'bg-blue-500';
}

const initBase = async () => {
  await Promise.all([loadKpi(), loadUsers()])
}

const initFuncs = async () => {
  loading.value = true

  await initBase()

  initializeTimers()
  startGlobalTimer()

  loading.value = false
}

// --------------------------------------------------
// INITIAL LOAD
// --------------------------------------------------
onMounted(async () => {
  await initFuncs()

  setInterval(async () => {
    await initBase()
    initializeTimers()
  }, 30000)
})




// Reload when period changes (week / month)
watch(period, () => loadUsers())
</script>
