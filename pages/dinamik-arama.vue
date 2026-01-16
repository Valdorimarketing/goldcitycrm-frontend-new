<template>
  <div class="min-h-screen">
    <!-- Critical Alert Banner (70+ records) -->
    <Transition
      enter-active-class="transition-all duration-500 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
    >
      <div 
        v-if="!isAdmin && showCriticalAlert && userStats.total >= 70"
        class="mb-6 relative overflow-hidden"
      >
        <div class="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 animate-pulse"></div>
        <div class="relative bg-gradient-to-r from-red-600/95 via-red-500/95 to-orange-500/95 rounded-2xl p-5 border border-red-400/50 shadow-lg shadow-red-500/25">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0">
              <div class="h-14 w-14 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center animate-bounce">
                <ExclamationTriangleIcon class="h-8 w-8 text-white" />
              </div>
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <h3 class="text-lg font-bold text-white">{{ t('dynamic_search.critical_alert.title', 'Kritik Seviye Uyarısı!') }}</h3>
                <span class="px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold text-white animate-pulse">
                  {{ t('dynamic_search.critical_alert.urgent_badge', 'ACİL') }}
                </span>
              </div>
              <p class="text-red-100 text-sm mb-3">
                {{ tp('dynamic_search.critical_alert.message', { count: userStats.total }, '{count} adet bekleyen dinamik arama kaydınız var. Bu sayı kritik seviyenin üzerinde. Lütfen en kısa sürede müşterilerinizi arayın.') }}
              </p>
              <div class="flex items-center gap-4">
                <div class="flex items-center gap-2 text-sm text-white/90">
                  <ClockIcon class="h-4 w-4" />
                  <span>{{ tp('dynamic_search.critical_alert.overdue', { count: userStats.overdue }, '{count} gecikmiş') }}</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-white/90">
                  <CalendarIcon class="h-4 w-4" />
                  <span>{{ tp('dynamic_search.critical_alert.today', { count: userStats.today }, '{count} bugün') }}</span>
                </div>
              </div>
            </div>
            <button 
              @click="showCriticalAlert = false"
              class="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <XMarkIcon class="h-5 w-5 text-white/70" />
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Header Section -->
    <div class="mb-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-gradient-to-br to-rose-500 to-rose-500 rounded-xl shadow-lg shadow-rose-500/25">
              <PhoneArrowUpRightIcon class="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('dynamic_search.title', 'Dinamik Arama') }}</h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ t('dynamic_search.subtitle', 'Hatırlatma gerektiren müşterilerinizi yönetin') }}
              </p>
            </div>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="flex flex-wrap gap-3">
          <div class="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span class="text-sm font-medium text-red-700 dark:text-red-400">
              {{ tp('dynamic_search.stats.overdue', { count: stats.overdue }, '{count} Gecikmiş') }}
            </span>
          </div>
          <div class="flex items-center gap-2 px-4 py-2 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl">
            <div class="w-2 h-2 bg-rose-500 rounded-full"></div>
            <span class="text-sm font-medium text-rose-700 dark:text-rose-400">
              {{ tp('dynamic_search.stats.today', { count: stats.today }, '{count} Bugün') }}
            </span>
          </div>
          <div class="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
            <div class="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span class="text-sm font-medium text-emerald-700 dark:text-emerald-400">
              {{ tp('dynamic_search.stats.upcoming', { count: stats.upcoming }, '{count} Yaklaşan') }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- User Performance Dashboard (Admin Only) -->
    <div v-if="isAdmin && userPerformanceData.length > 0" class="mb-6">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <!-- Dashboard Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <div class="flex items-center gap-3">
            <div class="h-9 w-9 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center">
              <ChartBarIcon class="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white">{{ t('dynamic_search.performance.title', 'Kullanıcı Performans Tablosu') }}</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ t('dynamic_search.performance.subtitle', 'Dinamik arama yükü dağılımı') }}</p>
            </div>
          </div>
          <button 
            @click="showPerformanceDetails = !showPerformanceDetails"
            class="text-sm text-rose-600 dark:text-rose-400 hover:underline font-medium"
          >
            {{ showPerformanceDetails ? t('dynamic_search.performance.toggle_hide', 'Gizle') : t('dynamic_search.performance.toggle_details', 'Detaylar') }}
          </button>
        </div>

        <!-- Performance Summary Cards -->
        <div class="p-5">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
            <!-- Critical Users -->
            <div class="relative overflow-hidden bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
              <div class="absolute top-0 right-0 w-16 h-16 bg-red-200/50 dark:bg-red-700/20 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div class="relative">
                <div class="flex items-center gap-2 mb-2">
                  <ExclamationTriangleIcon class="h-5 w-5 text-red-600 dark:text-red-400" />
                  <span class="text-xs font-medium text-red-600 dark:text-red-400 uppercase tracking-wide">{{ t('dynamic_search.performance.critical', 'Kritik') }}</span>
                </div>
                <p class="text-3xl font-bold text-red-700 dark:text-red-300">{{ performanceSummary.critical }}</p>
                <p class="text-xs text-red-600/70 dark:text-red-400/70 mt-1">{{ t('dynamic_search.performance.critical_count', '70+ kayıt') }}</p>
              </div>
            </div>

            <!-- Warning Users -->
            <div class="relative overflow-hidden bg-gradient-to-br from-rose-50 to-orange-100 dark:from-rose-900/20 dark:to-orange-800/20 rounded-xl p-4 border border-rose-200 dark:border-rose-800">
              <div class="absolute top-0 right-0 w-16 h-16 bg-rose-200/50 dark:bg-rose-700/20 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div class="relative">
                <div class="flex items-center gap-2 mb-2">
                  <ExclamationCircleIcon class="h-5 w-5 text-rose-600 dark:text-rose-400" />
                  <span class="text-xs font-medium text-rose-600 dark:text-rose-400 uppercase tracking-wide">{{ t('dynamic_search.performance.warning', 'Uyarı') }}</span>
                </div>
                <p class="text-3xl font-bold text-rose-700 dark:text-rose-300">{{ performanceSummary.warning }}</p>
                <p class="text-xs text-rose-600/70 dark:text-rose-400/70 mt-1">{{ t('dynamic_search.performance.warning_count', '40-69 kayıt') }}</p>
              </div>
            </div>

            <!-- Normal Users -->
            <div class="relative overflow-hidden bg-gradient-to-br from-blue-50 to-rose-100 dark:from-blue-900/20 dark:to-rose-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <div class="absolute top-0 right-0 w-16 h-16 bg-blue-200/50 dark:bg-blue-700/20 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div class="relative">
                <div class="flex items-center gap-2 mb-2">
                  <InformationCircleIcon class="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span class="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">{{ t('dynamic_search.performance.normal', 'Normal') }}</span>
                </div>
                <p class="text-3xl font-bold text-blue-700 dark:text-blue-300">{{ performanceSummary.normal }}</p>
                <p class="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">{{ t('dynamic_search.performance.normal_count', '20-39 kayıt') }}</p>
              </div>
            </div>

            <!-- Excellent Users -->
            <div class="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900/20 dark:to-green-800/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
              <div class="absolute top-0 right-0 w-16 h-16 bg-emerald-200/50 dark:bg-emerald-700/20 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div class="relative">
                <div class="flex items-center gap-2 mb-2">
                  <CheckCircleIcon class="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <span class="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">{{ t('dynamic_search.performance.excellent', 'Mükemmel') }}</span>
                </div>
                <p class="text-3xl font-bold text-emerald-700 dark:text-emerald-300">{{ performanceSummary.excellent }}</p>
                <p class="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-1">{{ t('dynamic_search.performance.excellent_count', '0-19 kayıt') }}</p>
              </div>
            </div>
          </div>

          <!-- Detailed User List - devam -->
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 max-h-0"
            enter-to-class="opacity-100 max-h-[600px]"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 max-h-[600px]"
            leave-to-class="opacity-0 max-h-0"
          >
            <div v-if="showPerformanceDetails" class="overflow-hidden">
              <div class="border-t border-gray-100 dark:border-gray-700 pt-5">
                <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  <div 
                    v-for="user in sortedUserPerformance" 
                    :key="user.id"
                    :class="[
                      'relative p-4 rounded-xl border-2 transition-all hover:shadow-md cursor-pointer',
                      getUserCardClass(user.total)
                    ]"
                    @click="filterByUser(user.id)"
                  >
                    <div 
                      :class="[
                        'absolute top-3 right-3 w-3 h-3 rounded-full',
                        user.total >= 70 ? 'bg-red-500 animate-ping' : 
                        user.total >= 40 ? 'bg-rose-500' : 
                        user.total >= 20 ? 'bg-blue-500' : 'bg-emerald-500'
                      ]"
                    ></div>
                    <div 
                      :class="[
                        'absolute top-3 right-3 w-3 h-3 rounded-full',
                        user.total >= 70 ? 'bg-red-500' : 
                        user.total >= 40 ? 'bg-rose-500' : 
                        user.total >= 20 ? 'bg-blue-500' : 'bg-emerald-500'
                      ]"
                    ></div>

                    <div class="flex items-center gap-3 mb-3">
                      <div 
                        :class="[
                          'h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm',
                          getUserAvatarClass(user.total)
                        ]"
                      >
                        {{ user.name?.charAt(0)?.toUpperCase() || '?' }}
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="font-semibold text-gray-900 dark:text-white truncate">{{ user.name }}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">{{ getUserStatusLabel(user.total) }}</p>
                      </div>
                    </div>

                    <div class="mb-3">
                      <div class="flex items-center justify-between text-xs mb-1">
                        <span class="text-gray-500 dark:text-gray-400">{{ t('dynamic_search.performance.load_level', 'Yük Seviyesi') }}</span>
                        <span :class="getUserTextClass(user.total)" class="font-bold">{{ user.total }}</span>
                      </div>
                      <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          :class="getUserProgressClass(user.total)"
                          :style="{ width: `${Math.min((user.total / 100) * 100, 100)}%` }"
                          class="h-full rounded-full transition-all duration-500"
                        ></div>
                      </div>
                    </div>

                    <div class="grid grid-cols-3 gap-2 text-center">
                      <div class="bg-white/50 dark:bg-gray-800/50 rounded-lg p-2">
                        <p class="text-lg font-bold text-red-600 dark:text-red-400">{{ user.overdue }}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">{{ t('dynamic_search.performance.user_status.overdue_label', 'Gecikmiş') }}</p>
                      </div>
                      <div class="bg-white/50 dark:bg-gray-800/50 rounded-lg p-2">
                        <p class="text-lg font-bold text-rose-600 dark:text-rose-400">{{ user.today }}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">{{ t('dynamic_search.performance.user_status.today_label', 'Bugün') }}</p>
                      </div>
                      <div class="bg-white/50 dark:bg-gray-800/50 rounded-lg p-2">
                        <p class="text-lg font-bold text-emerald-600 dark:text-emerald-400">{{ user.upcoming }}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">{{ t('dynamic_search.performance.user_status.upcoming_label', 'Yaklaşan') }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <!-- My Performance Card (User Only) -->
    <div v-if="!isAdmin && userStats.total > 0" class="mb-6">
      <div 
        :class="[
          'rounded-2xl p-5 border-2 transition-all',
          userStats.total >= 70 
            ? 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-300 dark:border-red-700' 
            : userStats.total >= 40 
              ? 'bg-gradient-to-br from-rose-50 to-yellow-50 dark:from-rose-900/20 dark:to-yellow-900/20 border-rose-300 dark:border-rose-700'
              : userStats.total >= 20
                ? 'bg-gradient-to-br from-blue-50 to-rose-50 dark:from-blue-900/20 dark:to-rose-900/20 border-blue-300 dark:border-blue-700'
                : 'bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-300 dark:border-emerald-700'
        ]"
      >
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex items-center gap-4">
            <div 
              :class="[
                'h-16 w-16 rounded-2xl flex items-center justify-center',
                userStats.total >= 70 ? 'bg-red-500 animate-pulse' : 
                userStats.total >= 40 ? 'bg-rose-500' : 
                userStats.total >= 20 ? 'bg-blue-500' : 'bg-emerald-500'
              ]"
            >
              <component 
                :is="getStatusIcon(userStats.total)" 
                class="h-8 w-8 text-white" 
              />
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ t('dynamic_search.performance.user_status.your_status', 'Performans Durumunuz') }}</h3>
                <span 
                  :class="[
                    'px-2 py-0.5 text-xs font-bold rounded-full',
                    userStats.total >= 70 ? 'bg-red-500 text-white' : 
                    userStats.total >= 40 ? 'bg-rose-500 text-white' : 
                    userStats.total >= 20 ? 'bg-blue-500 text-white' : 'bg-emerald-500 text-white'
                  ]"
                >
                  {{ getUserStatusLabel(userStats.total) }}
                </span>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ getStatusMessage(userStats.total) }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-6">
            <div class="text-center">
              <p class="text-3xl font-bold" :class="getUserTextClass(userStats.total)">{{ userStats.total }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ t('dynamic_search.performance.user_status.total_records', 'Toplam Kayıt') }}</p>
            </div>
            <div class="h-12 w-px bg-gray-200 dark:bg-gray-700"></div>
            <div class="flex gap-4">
              <div class="text-center">
                <p class="text-xl font-bold text-red-600 dark:text-red-400">{{ userStats.overdue }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ t('dynamic_search.performance.user_status.overdue_label', 'Gecikmiş') }}</p>
              </div>
              <div class="text-center">
                <p class="text-xl font-bold text-rose-600 dark:text-rose-400">{{ userStats.today }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ t('dynamic_search.performance.user_status.today_label', 'Bugün') }}</p>
              </div>
              <div class="text-center">
                <p class="text-xl font-bold text-emerald-600 dark:text-emerald-400">{{ userStats.upcoming }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ t('dynamic_search.performance.user_status.upcoming_label', 'Yaklaşan') }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="mt-4">
          <div class="flex items-center justify-between text-xs mb-2">
            <span class="text-gray-600 dark:text-gray-400">{{ t('dynamic_search.performance.load_level', 'Yük Seviyesi') }}</span>
            <span class="font-medium text-gray-700 dark:text-gray-300">
              {{ userStats.total >= 70 ? t('dynamic_search.performance.status_labels.critical', 'Kritik') : 
                 userStats.total >= 40 ? t('dynamic_search.performance.status_labels.high', 'Yüksek') : 
                 userStats.total >= 20 ? t('dynamic_search.performance.status_labels.normal', 'Normal') : 
                 t('dynamic_search.performance.status_labels.good', 'İyi') }}
            </span>
          </div>
          <div class="h-3 bg-white/50 dark:bg-gray-800/50 rounded-full overflow-hidden">
            <div 
              :class="getUserProgressClass(userStats.total)"
              :style="{ width: `${Math.min((userStats.total / 100) * 100, 100)}%` }"
              class="h-full rounded-full transition-all duration-500"
            ></div>
          </div>
          <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>0</span>
            <span>{{ t('dynamic_search.performance.progress.excellent_10', 'Mükemmel (10)') }}</span>
            <span>{{ t('dynamic_search.performance.progress.good_20', 'İyi (20)') }}</span>
            <span>{{ t('dynamic_search.performance.progress.normal_40', 'Normal (40)') }}</span>
            <span>{{ t('dynamic_search.performance.progress.critical_70', 'Kritik (70+)') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters Card -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6 overflow-hidden">
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
        <div class="flex items-center gap-2">
          <FunnelIcon class="h-5 w-5 text-gray-400" />
          <span class="font-medium text-gray-700 dark:text-gray-300">{{ t('dynamic_search.filters.title', 'Filtreler') }}</span>
          <span 
            v-if="relevantUserFilter"
            class="px-2 py-0.5 text-xs font-medium bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded-full"
          >
            {{ t('dynamic_search.filters.user_filtered', 'Kullanıcı filtreli') }}
          </span>
        </div>
        <button 
          @click="resetFilters" 
          class="text-sm text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-medium flex items-center gap-1 transition-colors"
        >
          <ArrowPathIcon class="h-4 w-4" />
          {{ t('dynamic_search.filters.clear', 'Temizle') }}
        </button>
      </div>

      <div class="p-5">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Search -->
          <div class="relative">
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">{{ t('dynamic_search.filters.search', 'Ara') }}</label>
            <div class="relative">
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                v-model="searchTerm" 
                type="text" 
                class="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                :placeholder="t('dynamic_search.filters.search_placeholder', 'İsim, email veya telefon...')"
              />
            </div>
          </div>

          <!-- Status -->
          <div>
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">{{ t('dynamic_search.filters.status', 'Durum') }}</label>
            <select 
              v-model="statusFilter" 
              class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all appearance-none cursor-pointer"
            >
              <option value="">{{ t('dynamic_search.filters.all_statuses', 'Tüm Durumlar') }}</option>
              <option v-for="status in statusOptions" :key="status.value" :value="status.value">{{ status.label }}</option>
            </select>
          </div>

          <!-- User Filter (Admin) -->
          <div v-if="isAdmin">
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">{{ t('dynamic_search.filters.assigned_user', 'Atanan Kullanıcı') }}</label>
            <select 
              v-model="relevantUserFilter" 
              class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all appearance-none cursor-pointer"
            >
              <option value="">{{ t('dynamic_search.filters.all_users', 'Tümü') }}</option>
              <option v-for="item in relevantUserList" :key="item.value" :value="item.value">{{ item.name }}</option>
            </select>
          </div>

          <!-- Date Filter -->
          <div>
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">{{ t('dynamic_search.filters.date', 'Tarih') }}</label>
            <select 
              v-model="dateFilter" 
              @change="handleDateFilterChange"
              class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all appearance-none cursor-pointer"
            >
              <option value="today">{{ t('dynamic_search.filters.date_today', 'Bugün ve Öncesi') }}</option>
              <option value="today-only">{{ t('dynamic_search.filters.date_today_only', 'Sadece Bugün') }}</option>
              <option value="tomorrow">{{ t('dynamic_search.filters.date_tomorrow', 'Yarın') }}</option>
              <option value="week">{{ t('dynamic_search.filters.date_week', 'Bu Hafta') }}</option>
              <option value="month">{{ t('dynamic_search.filters.date_month', 'Bu Ay') }}</option>
              <option value="overdue">{{ t('dynamic_search.filters.date_overdue', 'Gecikmiş') }}</option>
              <option value="all">{{ t('dynamic_search.filters.date_all', 'Tümü') }}</option>
              <option value="custom">{{ t('dynamic_search.filters.date_custom', 'Özel Tarih Aralığı') }}</option>
            </select>
          </div>
        </div>

        <!-- Custom Date Range -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div v-if="dateFilter === 'custom'" class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div>
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">{{ t('dynamic_search.filters.start_date', 'Başlangıç') }}</label>
              <input v-model="customStartDate" type="date" class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">{{ t('dynamic_search.filters.end_date', 'Bitiş') }}</label>
              <input v-model="customEndDate" type="date" class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all" />
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-16">
      <div class="relative">
        <div class="w-12 h-12 rounded-full border-4 border-rose-100 dark:border-rose-900"></div>
        <div class="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-transparent border-t-rose-600 animate-spin"></div>
      </div>
      <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">{{ t('dynamic_search.loading', 'Yükleniyor...') }}</p>
    </div>

    <!-- Results başlangıç -->
    <div v-else>
      <!-- Results Header -->
      <div class="flex items-center justify-between mb-4">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ tp('dynamic_search.results.found', { count: pagination.total }, '{count} kayıt bulundu') }}
        </p>
        <div class="flex items-center gap-2">
          <button 
            @click="viewMode = 'table'" 
            :class="[
              'p-2 rounded-lg transition-all',
              viewMode === 'table' 
                ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' 
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            ]"
          >
            <Bars3Icon class="h-5 w-5" />
          </button>
          <button 
            @click="viewMode = 'cards'" 
            :class="[
              'p-2 rounded-lg transition-all',
              viewMode === 'cards' 
                ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' 
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            ]"
          >
            <Squares2X2Icon class="h-5 w-5" />
          </button>
        </div>
      </div>

      <!-- Table View -->
      <div v-if="viewMode === 'table'" class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="bg-gray-50 dark:bg-gray-900/50">
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ t('dynamic_search.table.customer', 'Müşteri') }}
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ t('dynamic_search.table.contact', 'İletişim') }}
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ t('dynamic_search.table.status', 'Durum') }}
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ t('dynamic_search.table.reminder', 'Hatırlatma') }}
                </th>
                <th v-if="isAdmin" class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ t('dynamic_search.table.assigned', 'Atanan') }}
                </th>
                <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ t('dynamic_search.table.actions', 'İşlem') }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
              <tr 
                v-for="customer in customersData" 
                :key="customer.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
              >
                <!-- Customer -->
                <td class="px-4 py-4">
                  <div class="flex items-center gap-3">
                    <div class="relative">
                      <div 
                        class="h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold shadow-sm"
                        :class="getAvatarClass(customer)"
                      >
                        {{ customer.name.charAt(0).toUpperCase() }}
                      </div>
                      <div 
                        v-if="isOverdue(customer.remindingDate)"
                        class="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"
                      ></div>
                    </div>
                    <div>
                      <NuxtLink 
                        :to="`/customers/show/${customer.id}`"
                        class="font-medium text-gray-900 dark:text-white hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                      >
                        {{ customer.name }}
                      </NuxtLink>
                      <p class="text-xs text-gray-500 dark:text-gray-400">ID: {{ customer.id }}</p>
                    </div>
                  </div>
                </td>


                <td class="px-6 py-4">
                  <div class="space-y-1">
                    <div v-if="customer.phone || customer.email" class="space-y-1">
                      <p class="text-sm text-gray-600 dark:text-gray-300">{{ customer.email || '-' }}</p>
                      <div v-if="customer.phone" class="flex items-center gap-2">
                        <!-- ✅ Ülke Bayrağı -->
                        <span class="text-lg" :title="getCountryName(customer.phone)">
                          {{ getCountryFlag(customer.phone) }}
                        </span>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          <template v-if="isAdmin">{{ customer.phone }}</template>
                          <template v-else>{{ customer.phone.substring(0, 5) }}****</template>
                        </p>
                      </div>
                    </div>
                    <span v-if="!customer.email && !customer.phone" class="text-sm text-gray-400">-</span>
                  </div>
                </td>

                <!-- Status -->
                <td class="px-4 py-4">
                  <span 
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full"
                    :class="getStatusClass(customer.status)"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDotClass(customer.status)"></span>
                    {{ getStatusText(customer.status) }}
                  </span>
                </td>

                <!-- Reminder -->
                <td class="px-4 py-4">
                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                      <ClockIcon class="h-4 w-4 text-gray-400" />
                      <span class="text-sm text-gray-600 dark:text-gray-300">
                        {{ formatDateTime(customer.remindingDate) }}
                      </span>
                    </div>
                    <span 
                      class="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full"
                      :class="getRemainingTimeClass(customer.remindingDate)"
                    >
                      {{ getRemainingTime(customer.remindingDate) }}
                    </span>
                  </div>
                </td>

                <!-- Assigned User (Admin) -->
                <td v-if="isAdmin" class="px-4 py-4">
                  <div v-if="customer.relevantUser" class="flex items-center gap-2">
                    <img v-if="customer.relevantUser?.avatar" :src="path + customer.relevantUser?.avatar" alt="Avatar" class="object-cover h-7 w-7 rounded-lg" />
                    <div v-else class="h-7 w-7 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                      <span class="text-xs font-medium text-rose-600 dark:text-rose-400">
                        {{ customer.relevantUser?.name?.charAt(0)?.toUpperCase() }}
                      </span>
                    </div>
                    <span class="text-sm text-gray-600 dark:text-gray-300">{{ customer.relevantUser?.name }}</span>
                  </div>
                  <span v-else class="text-sm text-gray-400">-</span>
                </td>

                <!-- Actions -->
                <td class="px-4 py-4 text-right">
                  <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <NuxtLink 
                      :to="`/customers/show/${customer.id}`"
                      class="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-all"
                      :title="t('dynamic_search.actions.view', 'Görüntüle')"
                    >
                      <EyeIcon class="h-5 w-5" />
                    </NuxtLink>
                    <button 
                      @click="showNotes(customer)"
                      class="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-all"
                      :title="t('dynamic_search.actions.notes', 'Notlar')"
                    >
                      <DocumentTextIcon class="h-5 w-5" />
                    </button>
                    <button 
                      @click="showHistory(customer)"
                      class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all"
                      :title="t('dynamic_search.actions.history', 'Geçmiş')"
                    >
                      <ClockIcon class="h-5 w-5" />
                    </button>
                    <button 
                      @click="toggleShow(customer.id)"
                      class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                      :title="t('dynamic_search.actions.more', 'Daha fazla')"
                    >
                      <EllipsisHorizontalIcon class="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-if="customersData.length === 0">
                <td :colspan="isAdmin ? 6 : 5" class="px-4 py-16 text-center">
                  <div class="flex flex-col items-center">
                    <div class="p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                      <PhoneArrowUpRightIcon class="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      {{ t('dynamic_search.empty.title', 'Kayıt bulunamadı') }}
                    </h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{ searchTerm ? t('dynamic_search.empty.search', 'Arama kriterlerinize uygun müşteri bulunamadı.') : t('dynamic_search.empty.no_reminders', 'Henüz hatırlatma gerektiren müşteri yok.') }}
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.total > 0" class="px-4 py-4 border-t border-gray-100 dark:border-gray-700">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              <span class="font-medium">{{ paginationInfo.from }}</span> - <span class="font-medium">{{ paginationInfo.to }}</span> / {{ pagination.total }}
            </p>

            <div class="flex items-center gap-2">
              <button 
                @click="goToPage(pagination.page - 1)" 
                :disabled="pagination.page === 1"
                class="p-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeftIcon class="h-5 w-5" />
              </button>

              <div class="hidden sm:flex items-center gap-1">
                <template v-for="pageNum in visiblePages" :key="pageNum">
                  <span v-if="pageNum === '...'" class="px-2 text-gray-400">...</span>
                  <button 
                    v-else
                    @click="goToPage(pageNum)"
                    :class="[
                      'min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-all',
                      pagination.page === pageNum
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    ]"
                  >
                    {{ pageNum }}
                  </button>
                </template>
              </div>

              <span class="sm:hidden text-sm text-gray-500">
                {{ pagination.page }} / {{ totalPages }}
              </span>

              <button 
                @click="goToPage(pagination.page + 1)" 
                :disabled="pagination.page >= totalPages"
                class="p-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRightIcon class="h-5 w-5" />
              </button>
            </div>

            <select 
              v-model="pagination.limit" 
              @change="handleLimitChange"
              class="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-rose-500"
            >
              <option :value="10">{{ tp('dynamic_search.pagination.per_page', { count: 10 }, '10 / sayfa') }}</option>
              <option :value="25">{{ tp('dynamic_search.pagination.per_page', { count: 25 }, '25 / sayfa') }}</option>
              <option :value="50">{{ tp('dynamic_search.pagination.per_page', { count: 50 }, '50 / sayfa') }}</option>
              <option :value="100">{{ tp('dynamic_search.pagination.per_page', { count: 100 }, '100 / sayfa') }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Cards View -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <div 
          v-for="customer in customersData" 
          :key="customer.id"
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md hover:border-rose-200 dark:hover:border-rose-800 transition-all group"
        >
          <!-- Card Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div 
                class="h-12 w-12 rounded-full flex items-center justify-center text-lg font-semibold shadow-sm"
                :class="getAvatarClass(customer)"
              >
                {{ customer.name.charAt(0).toUpperCase() }}
              </div>
              <div>
                <NuxtLink 
                  :to="`/customers/show/${customer.id}`"
                  class="font-semibold text-gray-900 dark:text-white hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                >
                  {{ customer.name }}
                </NuxtLink>
                <p class="text-xs text-gray-500 dark:text-gray-400">ID: {{ customer.id }}</p>
              </div>
            </div>
            <span 
              class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full"
              :class="getStatusClass(customer.status)"
            >
              {{ getStatusText(customer.status) }}
            </span>
          </div>

          <!-- Card Body -->
          <div class="space-y-3 mb-4">
            <div v-if="customer.email" class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <EnvelopeIcon class="h-4 w-4 text-gray-400" />
              {{ customer.email }}
            </div>
            <div v-if="customer.phone" class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <PhoneIcon class="h-4 w-4 text-gray-400" />
              <template v-if="isAdmin">{{ customer.phone }}</template>
              <template v-else>{{ customer.phone.substring(0, 5) }}****</template>
            </div>
          </div>

          <!-- Reminder Badge -->
          <div class="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl mb-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <BellAlertIcon class="h-4 w-4 text-gray-400" />
                <span class="text-xs text-gray-500 dark:text-gray-400">{{ t('dynamic_search.table.reminder', 'Hatırlatma') }}</span>
              </div>
              <span 
                class="text-xs font-medium px-2 py-0.5 rounded-full"
                :class="getRemainingTimeClass(customer.remindingDate)"
              >
                {{ getRemainingTime(customer.remindingDate) }}
              </span>
            </div>
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
              {{ formatDateTime(customer.remindingDate) }}
            </p>
          </div>

          <!-- Card Footer -->
          <div class="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
            <div v-if="isAdmin && customer.relevantUser" class="flex items-center gap-2">
               <img v-if="customer.relevantUser?.avatar" :src="path + customer.relevantUser?.avatar" alt="Avatar" class="object-cover h-6 w-6 rounded-lg" />
                <div v-else class="h-6 w-6 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                  <span class="text-xs font-medium text-rose-600 dark:text-rose-400">
                    {{ customer.relevantUser?.name?.charAt(0)?.toUpperCase() }}
                  </span>
                </div>
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ customer.relevantUser?.name }}</span>
            </div>
            <div v-else></div>

            <div class="flex items-center gap-1">
              <NuxtLink 
                :to="`/customers/show/${customer.id}`"
                class="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-all"
              >
                <EyeIcon class="h-4 w-4" />
              </NuxtLink>
              <button 
                @click="showNotes(customer)"
                class="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-all"
              >
                <DocumentTextIcon class="h-4 w-4" />
              </button>
              <button 
                @click="toggleShow(customer.id)"
                class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
              >
                <EllipsisHorizontalIcon class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State for Cards -->
        <div v-if="customersData.length === 0" class="col-span-full">
          <div class="flex flex-col items-center py-16">
            <div class="p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
              <PhoneArrowUpRightIcon class="h-8 w-8 text-gray-400" />
            </div>
            <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-1">
              {{ t('dynamic_search.empty.title', 'Kayıt bulunamadı') }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ searchTerm ? t('dynamic_search.empty.search', 'Arama kriterlerinize uygun müşteri bulunamadı.') : t('dynamic_search.empty.no_reminders', 'Henüz hatırlatma gerektiren müşteri yok.') }}
            </p>
          </div>
        </div>
      </div>

      <!-- Cards Pagination -->
      <div v-if="viewMode === 'cards' && pagination.total > 0" class="mt-6 flex justify-center">
        <div class="flex items-center gap-2">
          <button 
            @click="goToPage(pagination.page - 1)" 
            :disabled="pagination.page === 1"
            class="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {{ t('dynamic_search.pagination.previous', 'Önceki') }}
          </button>
          <span class="px-4 py-2 text-sm text-gray-500">
            {{ pagination.page }} / {{ totalPages }}
          </span>
          <button 
            @click="goToPage(pagination.page + 1)" 
            :disabled="pagination.page >= totalPages"
            class="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {{ t('dynamic_search.pagination.next', 'Sonraki') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Action Modal -->
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
          v-if="showStates.activeId"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          @click.self="showStates.activeId = null"
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
              v-if="showStates.activeId"
              class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
            >
              <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                <h3 class="font-semibold text-gray-900 dark:text-white">{{ t('dynamic_search.actions_modal.title', 'İşlemler') }}</h3>
                <button 
                  @click="showStates.activeId = null"
                  class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  <XMarkIcon class="h-5 w-5" />
                </button>
              </div>

              <div class="p-4 grid grid-cols-3 gap-2">
                <NuxtLink 
                  :to="`/customers/show/${showStates.activeId}`"
                  class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  <div class="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
                    <EyeIcon class="h-5 w-5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <span class="text-xs text-gray-600 dark:text-gray-300">{{ t('dynamic_search.actions.view', 'Görüntüle') }}</span>
                </NuxtLink>

                <button 
                  @click="showHistory(getCustomerById(showStates.activeId))"
                  class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <ClockIcon class="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span class="text-xs text-gray-600 dark:text-gray-300">{{ t('dynamic_search.actions.history', 'Geçmiş') }}</span>
                </button>

                <button 
                  @click="showNotes(getCustomerById(showStates.activeId))"
                  class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  <div class="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
                    <DocumentTextIcon class="h-5 w-5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <span class="text-xs text-gray-600 dark:text-gray-300">{{ t('dynamic_search.actions.notes', 'Notlar') }}</span>
                </button>

                <button 
                  @click="showDoctorAssignment(getCustomerById(showStates.activeId))"
                  class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  <div class="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
                    <UsersIcon class="h-5 w-5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <span class="text-xs text-gray-600 dark:text-gray-300">{{ t('dynamic_search.actions.doctor', 'Doktor') }}</span>
                </button>

                <button 
                  @click="showServices(getCustomerById(showStates.activeId))"
                  class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  <div class="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <ShoppingBagIcon class="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span class="text-xs text-gray-600 dark:text-gray-300">{{ t('dynamic_search.actions.services', 'Hizmetler') }}</span>
                </button>

                <button 
                  @click="showFiles(getCustomerById(showStates.activeId))"
                  class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  <div class="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                    <FolderIcon class="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <span class="text-xs text-gray-600 dark:text-gray-300">{{ t('dynamic_search.actions.files', 'Dosyalar') }}</span>
                </button>

                <NuxtLink 
                  v-if="isEditable"
                  :to="`/customers/edit/${showStates.activeId}`"
                  class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  <div class="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <PencilIcon class="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <span class="text-xs text-gray-600 dark:text-gray-300">{{ t('dynamic_search.actions.edit', 'Düzenle') }}</span>
                </NuxtLink>

                <button 
                  v-if="isDeleteable"
                  @click="confirmDelete(getCustomerById(showStates.activeId))"
                  class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 transition-all"
                >
                  <div class="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <TrashIcon class="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <span class="text-xs text-red-600 dark:text-red-400">{{ t('dynamic_search.actions.delete', 'Sil') }}</span>
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>

    <!-- Modals -->
    <CustomerHistoryModal :show="showHistoryModal" :customer="selectedCustomer" @close="showHistoryModal = false" />
    <CustomerNotesModal :show="showNotesModal" :customer="selectedCustomer" @close="showNotesModal = false" @customer-updated="() => loadCustomers()" />
    <DoctorAssignmentModal :show="showDoctorModal" :customer="selectedCustomer" @close="showDoctorModal = false" @assigned="handleDoctorAssigned" />
    <CustomerServicesModal :show="showServicesModal" :customer="selectedCustomer" @close="showServicesModal = false" @saved="handleServicesSaved" />
    <CustomerFilesModal :show="showFilesModal" :customer="selectedCustomer" @close="showFilesModal = false" />
  </div>
</template>


<script setup>
import {
  PhoneArrowUpRightIcon,
  UsersIcon,
  EyeIcon,
  ClockIcon,
  DocumentTextIcon,
  ShoppingBagIcon,
  PencilIcon,
  FolderIcon,
  EllipsisHorizontalIcon,
  XMarkIcon,
  FunnelIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Bars3Icon,
  Squares2X2Icon,
  EnvelopeIcon,
  PhoneIcon,
  BellAlertIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ChartBarIcon,
  CalendarIcon
} from '@heroicons/vue/24/outline'
import { useLanguage } from '~/composables/useLanguage'

const { t, tp } = useLanguage()

definePageMeta({})

const { isAdmin, isEditable, isDeleteable } = usePermissions()
const authStore = useAuthStore()
 
const config = useRuntimeConfig()
const path = config.public.apiBase

// Alert visibility
const showCriticalAlert = ref(true)
const showPerformanceDetails = ref(false)

// User Performance Data (Admin)
const userPerformanceData = ref([])
const loadingPerformance = ref(false)

// Current User Stats
const userStats = computed(() => {
  if (isAdmin.value) {
    const filtered = relevantUserFilter.value 
      ? userPerformanceData.value.find(u => u.id === relevantUserFilter.value)
      : null
    
    if (filtered) return filtered
    
    return {
      total: pagination.value.total,
      overdue: stats.value.overdue,
      today: stats.value.today,
      upcoming: stats.value.upcoming
    }
  }
  
  return {
    total: pagination.value.total,
    overdue: stats.value.overdue,
    today: stats.value.today,
    upcoming: stats.value.upcoming
  }
})

// Performance Summary
const performanceSummary = computed(() => {
  const summary = { critical: 0, warning: 0, normal: 0, excellent: 0 }
  
  userPerformanceData.value.forEach(user => {
    if (user.total >= 70) summary.critical++
    else if (user.total >= 40) summary.warning++
    else if (user.total >= 20) summary.normal++
    else summary.excellent++
  })
  
  return summary
})

// Sorted User Performance
const sortedUserPerformance = computed(() => {
  return [...userPerformanceData.value].sort((a, b) => b.total - a.total)
})


// ============================================================
// ✅ ÜLKE KODU VE BAYRAK FONKSİYONLARI
// ============================================================

/**
 * Telefon numarasından ülke kodunu çıkarır
 */
const getCountryCode = (phone) => {
  if (!phone) return null
  
  // Telefon numarasını temizle (boşluk, tire, parantez vb.)
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '')
  
  // 00 ile başlıyorsa + ile değiştir
  let normalized = cleaned
  if (cleaned.startsWith('00')) {
    normalized = '+' + cleaned.substring(2)
  }
  
  // + ile başlamıyorsa başına ekle
  if (!normalized.startsWith('+')) {
    normalized = '+' + normalized
  }
  
  // Ülke kodlarını kontrol et (uzundan kısaya doğru)
  // 4 haneli kodlar
  if (normalized.startsWith('+9715')) return '971' // UAE
  if (normalized.startsWith('+9665')) return '966' // Saudi Arabia
  if (normalized.startsWith('+9745')) return '974' // Qatar
  
  // 3 haneli kodlar
  if (normalized.startsWith('+971')) return '971' // UAE
  if (normalized.startsWith('+966')) return '966' // Saudi Arabia
  if (normalized.startsWith('+974')) return '974' // Qatar
  if (normalized.startsWith('+965')) return '965' // Kuwait
  if (normalized.startsWith('+962')) return '962' // Jordan
  if (normalized.startsWith('+963')) return '963' // Syria
  if (normalized.startsWith('+961')) return '961' // Lebanon
  if (normalized.startsWith('+964')) return '964' // Iraq
  if (normalized.startsWith('+212')) return '212' // Morocco
  if (normalized.startsWith('+213')) return '213' // Algeria
  if (normalized.startsWith('+216')) return '216' // Tunisia
  if (normalized.startsWith('+218')) return '218' // Libya
  if (normalized.startsWith('+967')) return '967' // Yemen
  if (normalized.startsWith('+968')) return '968' // Oman
  if (normalized.startsWith('+973')) return '973' // Bahrain
  
  // 2 haneli kodlar
  if (normalized.startsWith('+90')) return '90'   // Turkey
  if (normalized.startsWith('+44')) return '44'   // UK
  if (normalized.startsWith('+49')) return '49'   // Germany
  if (normalized.startsWith('+33')) return '33'   // France
  if (normalized.startsWith('+39')) return '39'   // Italy
  if (normalized.startsWith('+34')) return '34'   // Spain
  if (normalized.startsWith('+86')) return '86'   // China
  if (normalized.startsWith('+91')) return '91'   // India
  if (normalized.startsWith('+81')) return '81'   // Japan
  if (normalized.startsWith('+82')) return '82'   // South Korea
  if (normalized.startsWith('+20')) return '20'   // Egypt
  if (normalized.startsWith('+98')) return '98'   // Iran
  if (normalized.startsWith('+92')) return '92'   // Pakistan
  if (normalized.startsWith('+93')) return '93'   // Afghanistan
  if (normalized.startsWith('+95')) return '95'   // Myanmar
  if (normalized.startsWith('+60')) return '60'   // Malaysia
  if (normalized.startsWith('+62')) return '62'   // Indonesia
  if (normalized.startsWith('+63')) return '63'   // Philippines
  if (normalized.startsWith('+64')) return '64'   // New Zealand
  if (normalized.startsWith('+65')) return '65'   // Singapore
  if (normalized.startsWith('+66')) return '66'   // Thailand
  if (normalized.startsWith('+84')) return '84'   // Vietnam
  if (normalized.startsWith('+30')) return '30'   // Greece
  if (normalized.startsWith('+31')) return '31'   // Netherlands
  if (normalized.startsWith('+32')) return '32'   // Belgium
  if (normalized.startsWith('+41')) return '41'   // Switzerland
  if (normalized.startsWith('+43')) return '43'   // Austria
  if (normalized.startsWith('+45')) return '45'   // Denmark
  if (normalized.startsWith('+46')) return '46'   // Sweden
  if (normalized.startsWith('+47')) return '47'   // Norway
  if (normalized.startsWith('+48')) return '48'   // Poland
  if (normalized.startsWith('+51')) return '51'   // Peru
  if (normalized.startsWith('+52')) return '52'   // Mexico
  if (normalized.startsWith('+53')) return '53'   // Cuba
  if (normalized.startsWith('+54')) return '54'   // Argentina
  if (normalized.startsWith('+55')) return '55'   // Brazil
  if (normalized.startsWith('+56')) return '56'   // Chile
  if (normalized.startsWith('+57')) return '57'   // Colombia
  if (normalized.startsWith('+58')) return '58'   // Venezuela
  if (normalized.startsWith('+27')) return '27'   // South Africa
  
  // 1 haneli kodlar
  if (normalized.startsWith('+1')) return '1'     // USA/Canada
  if (normalized.startsWith('+7')) return '7'     // Russia/Kazakhstan
  
  return null
}

/**
 * Ülke koduna göre bayrak emoji döndürür
 */
const countryFlags = {
  '90': '🇹🇷',   // Turkey
  '1': '🇺🇸',     // USA/Canada
  '44': '🇬🇧',   // UK
  '49': '🇩🇪',   // Germany
  '33': '🇫🇷',   // France
  '39': '🇮🇹',   // Italy
  '34': '🇪🇸',   // Spain
  '86': '🇨🇳',   // China
  '91': '🇮🇳',   // India
  '81': '🇯🇵',   // Japan
  '82': '🇰🇷',   // South Korea
  '7': '🇷🇺',     // Russia
  '966': '🇸🇦',  // Saudi Arabia
  '971': '🇦🇪',  // UAE
  '974': '🇶🇦',  // Qatar
  '965': '🇰🇼',  // Kuwait
  '962': '🇯🇴',  // Jordan
  '963': '🇸🇾',  // Syria
  '961': '🇱🇧',  // Lebanon
  '964': '🇮🇶',  // Iraq
  '20': '🇪🇬',   // Egypt
  '212': '🇲🇦',  // Morocco
  '213': '🇩🇿',  // Algeria
  '216': '🇹🇳',  // Tunisia
  '218': '🇱🇾',  // Libya
  '967': '🇾🇪',  // Yemen
  '968': '🇴🇲',  // Oman
  '973': '🇧🇭',  // Bahrain
  '98': '🇮🇷',   // Iran
  '92': '🇵🇰',   // Pakistan
  '93': '🇦🇫',   // Afghanistan
  '95': '🇲🇲',   // Myanmar
  '60': '🇲🇾',   // Malaysia
  '62': '🇮🇩',   // Indonesia
  '63': '🇵🇭',   // Philippines
  '64': '🇳🇿',   // New Zealand
  '65': '🇸🇬',   // Singapore
  '66': '🇹🇭',   // Thailand
  '84': '🇻🇳',   // Vietnam
  '30': '🇬🇷',   // Greece
  '31': '🇳🇱',   // Netherlands
  '32': '🇧🇪',   // Belgium
  '41': '🇨🇭',   // Switzerland
  '43': '🇦🇹',   // Austria
  '45': '🇩🇰',   // Denmark
  '46': '🇸🇪',   // Sweden
  '47': '🇳🇴',   // Norway
  '48': '🇵🇱',   // Poland
  '51': '🇵🇪',   // Peru
  '52': '🇲🇽',   // Mexico
  '53': '🇨🇺',   // Cuba
  '54': '🇦🇷',   // Argentina
  '55': '🇧🇷',   // Brazil
  '56': '🇨🇱',   // Chile
  '57': '🇨🇴',   // Colombia
  '58': '🇻🇪',   // Venezuela
  '27': '🇿🇦',   // South Africa
}

/**
 * Ülke koduna göre ülke ismi döndürür
 */
const countryNames = {
  '90': 'Türkiye',
  '1': 'ABD/Kanada',
  '44': 'İngiltere',
  '49': 'Almanya',
  '33': 'Fransa',
  '39': 'İtalya',
  '34': 'İspanya',
  '86': 'Çin',
  '91': 'Hindistan',
  '81': 'Japonya',
  '82': 'Güney Kore',
  '7': 'Rusya',
  '966': 'Suudi Arabistan',
  '971': 'BAE',
  '974': 'Katar',
  '965': 'Kuveyt',
  '962': 'Ürdün',
  '963': 'Suriye',
  '961': 'Lübnan',
  '964': 'Irak',
  '20': 'Mısır',
  '212': 'Fas',
  '213': 'Cezayir',
  '216': 'Tunus',
  '218': 'Libya',
  '967': 'Yemen',
  '968': 'Umman',
  '973': 'Bahreyn',
  '98': 'İran',
  '92': 'Pakistan',
  '93': 'Afganistan',
  '95': 'Myanmar',
  '60': 'Malezya',
  '62': 'Endonezya',
  '63': 'Filipinler',
  '64': 'Yeni Zelanda',
  '65': 'Singapur',
  '66': 'Tayland',
  '84': 'Vietnam',
  '30': 'Yunanistan',
  '31': 'Hollanda',
  '32': 'Belçika',
  '41': 'İsviçre',
  '43': 'Avusturya',
  '45': 'Danimarka',
  '46': 'İsveç',
  '47': 'Norveç',
  '48': 'Polonya',
  '51': 'Peru',
  '52': 'Meksika',
  '53': 'Küba',
  '54': 'Arjantin',
  '55': 'Brezilya',
  '56': 'Şili',
  '57': 'Kolombiya',
  '58': 'Venezuela',
  '27': 'Güney Afrika',
}

/**
 * Telefon numarasına göre bayrak emoji döndürür
 */
const getCountryFlag = (phone) => {
  const code = getCountryCode(phone)
  return code ? (countryFlags[code] || '🌍') : '🌍'
}


/**
 * Telefon numarasına göre ülke ismi döndürür
 */
const getCountryName = (phone) => {
  const code = getCountryCode(phone)
  return code ? (countryNames[code] || 'Bilinmeyen') : 'Bilinmeyen'
}


// Helper Functions for Performance UI
const getUserCardClass = (total) => {
  if (total >= 70) return 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-300 dark:border-red-700 hover:border-red-400'
  if (total >= 40) return 'bg-gradient-to-br from-rose-50 to-orange-100 dark:from-rose-900/20 dark:to-orange-800/20 border-rose-300 dark:border-rose-700 hover:border-rose-400'
  if (total >= 20) return 'bg-gradient-to-br from-blue-50 to-rose-100 dark:from-blue-900/20 dark:to-rose-800/20 border-blue-300 dark:border-blue-700 hover:border-blue-400'
  return 'bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900/20 dark:to-green-800/20 border-emerald-300 dark:border-emerald-700 hover:border-emerald-400'
}

const getUserAvatarClass = (total) => {
  if (total >= 70) return 'bg-gradient-to-br from-red-500 to-red-600 text-white'
  if (total >= 40) return 'bg-gradient-to-br from-rose-500 to-orange-500 text-white'
  if (total >= 20) return 'bg-gradient-to-br from-red-500 to-rose-500 text-white'
  return 'bg-gradient-to-br from-emerald-500 to-green-500 text-white'
}

const getUserTextClass = (total) => {
  if (total >= 70) return 'text-red-600 dark:text-red-400'
  if (total >= 40) return 'text-rose-600 dark:text-rose-400'
  if (total >= 20) return 'text-blue-600 dark:text-blue-400'
  return 'text-emerald-600 dark:text-emerald-400'
}

const getUserProgressClass = (total) => {
  if (total >= 70) return 'bg-gradient-to-r from-red-500 to-red-600'
  if (total >= 40) return 'bg-gradient-to-r from-rose-500 to-orange-500'
  if (total >= 20) return 'bg-gradient-to-r from-red-500 to-rose-500'
  return 'bg-gradient-to-r from-emerald-500 to-green-500'
}

const getUserStatusLabel = (total) => {
  if (total >= 70) return t('dynamic_search.performance.critical', 'Kritik')
  if (total >= 40) return t('dynamic_search.performance.warning', 'Uyarı')
  if (total >= 20) return t('dynamic_search.performance.normal', 'Normal')
  if (total >= 10) return t('dynamic_search.performance.status_labels.good', 'İyi')
  return t('dynamic_search.performance.excellent', 'Mükemmel')
}

const getStatusIcon = (total) => {
  if (total >= 70) return ExclamationTriangleIcon
  if (total >= 40) return ExclamationCircleIcon
  if (total >= 20) return InformationCircleIcon
  return CheckCircleIcon
}

const getStatusMessage = (total) => {
  if (total >= 70) return 'Acil olarak müşterilerinizi aramanız gerekmektedir. Yük seviyeniz kritik durumda!'
  if (total >= 40) return 'Dinamik arama yükünüz yüksek. Bugün mümkün olduğunca çok arama yapmaya çalışın.'
  if (total >= 20) return 'Dinamik arama yükünüz normal seviyede. Düzenli aramalarla bu seviyeyi koruyun.'
  if (total >= 10) return 'Harika gidiyorsunuz! Dinamik arama yükünüz iyi seviyede.'
  return 'Mükemmel performans! Dinamik arama yükünüz çok düşük.'
}

const filterByUser = (userId) => {
  relevantUserFilter.value = userId
  showPerformanceDetails.value = false
}

const fetchUserPerformance = async () => {
  if (!isAdmin.value) return
  
  loadingPerformance.value = true
  try {
    const api = useApi()
    const response = await api('/customers/dynamic-search/user-stats')
    
    if (Array.isArray(response)) {
      userPerformanceData.value = response
    }
  } catch (error) {
    console.error('Error fetching user performance:', error)
    calculateUserPerformanceFromData()
  } finally {
    loadingPerformance.value = false
  }
}

const calculateUserPerformanceFromData = () => {
  const userMap = new Map()
  
  relevantUserList.value.forEach(user => {
    userMap.set(user.value, {
      id: user.value,
      name: user.name,
      total: 0,
      overdue: 0,
      today: 0,
      upcoming: 0
    })
  })
  
  userPerformanceData.value = Array.from(userMap.values())
}

const viewMode = ref('table')

const stats = computed(() => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  let overdue = 0
  let todayCount = 0
  let upcoming = 0

  customersData.value.forEach(c => {
    if (!c.remindingDate) return
    const date = new Date(c.remindingDate)
    
    if (date < now) overdue++
    else if (date >= today && date < tomorrow) todayCount++
    else upcoming++
  })

  return { overdue, today: todayCount, upcoming }
})

const isOverdue = (date) => {
  if (!date) return false
  return new Date(date) < new Date()
}

const getAvatarClass = (customer) => {
  if (isOverdue(customer.remindingDate)) {
    return 'bg-gradient-to-br from-red-400 to-red-600 text-white'
  }
  return 'bg-gradient-to-br from-rose-400 to-rose-500 text-white'
}

const getStatusDotClass = (statusId) => {
  const status = statusMap.value[statusId]
  if (!status) return 'bg-gray-400'
  if (status.isSale) return 'bg-emerald-500'
  if (status.isClosed) return 'bg-red-500'
  if (status.isFirst) return 'bg-blue-500'
  return 'bg-gray-400'
}

const getCustomerById = (id) => {
  return customersData.value.find(c => c.id === id)
}

const CACHE_KEY = 'dynamic_search_filters'
const CACHE_VERSION = 1

const loadFromCache = () => {
  if (import.meta.server) return null
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null
    const data = JSON.parse(cached)
    if (data.version !== CACHE_VERSION) {
      localStorage.removeItem(CACHE_KEY)
      return null
    }
    const cacheAge = Date.now() - (data.timestamp || 0)
    const maxAge = 24 * 60 * 60 * 1000
    if (cacheAge > maxAge) {
      localStorage.removeItem(CACHE_KEY)
      return null
    }
    return data.filters
  } catch (e) {
    localStorage.removeItem(CACHE_KEY)
    return null
  }
}

const saveToCache = () => {
  if (import.meta.server) return
  try {
    const filters = {
      searchTerm: searchTerm.value,
      statusFilter: statusFilter.value,
      relevantUserFilter: relevantUserFilter.value,
      dateFilter: dateFilter.value,
      customStartDate: customStartDate.value,
      customEndDate: customEndDate.value,
      viewMode: viewMode.value,
      pagination: { page: pagination.value.page, limit: pagination.value.limit }
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify({ version: CACHE_VERSION, timestamp: Date.now(), filters }))
  } catch (e) {}
}

const clearCache = () => {
  if (import.meta.server) return
  localStorage.removeItem(CACHE_KEY)
}

const loading = ref(true)
const customersData = ref([])
const cacheLoaded = ref(false)

const pagination = ref({ page: 1, limit: 10, total: 0 })

const searchTerm = ref('')
const statusFilter = ref('')
const relevantUserFilter = ref('')
const dateFilter = ref('all')
const customStartDate = ref('')
const customEndDate = ref('')

const statusOptions = ref([])
const statusMap = ref({})
const remindableStatusIds = ref([])
const usersMap = ref({})
const relevantUserList = ref([])

const showHistoryModal = ref(false)
const showNotesModal = ref(false)
const showDoctorModal = ref(false)
const showServicesModal = ref(false)
const showFilesModal = ref(false)
const selectedCustomer = ref(null)
const showStates = ref({ activeId: null })

const totalPages = computed(() => Math.ceil(pagination.value.total / pagination.value.limit) || 1)

const paginationInfo = computed(() => {
  const from = ((pagination.value.page - 1) * pagination.value.limit) + 1
  const to = Math.min(pagination.value.page * pagination.value.limit, pagination.value.total)
  return { from, to }
})

const visiblePages = computed(() => {
  const current = pagination.value.page
  const total = totalPages.value
  const pages = []
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    if (current <= 3) pages.push(1, 2, 3, 4, '...', total)
    else if (current >= total - 2) pages.push(1, '...', total - 3, total - 2, total - 1, total)
    else pages.push(1, '...', current - 1, current, current + 1, '...', total)
  }
  return pages
})

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return
  pagination.value.page = page
  loadCustomers()
}

const handleLimitChange = () => {
  pagination.value.page = 1
  loadCustomers()
}

const toggleShow = (id) => {
  showStates.value.activeId = showStates.value.activeId === id ? null : id
}

const getRemainingTime = (remindingDate) => {
  if (!remindingDate) return ''
  const now = new Date()
  const target = new Date(remindingDate)
  const diff = target.getTime() - now.getTime()

  if (diff < 0) {
    const absDiff = Math.abs(diff)
    const hours = Math.floor(absDiff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    if (days > 0) return tp('dynamic_search.time.overdue', { count: days, unit: t('dynamic_search.time.days', 'gün') }, '{count} {unit} gecikmiş')
    if (hours > 0) return tp('dynamic_search.time.overdue', { count: hours, unit: t('dynamic_search.time.hours', 'saat') }, '{count} {unit} gecikmiş')
    return t('dynamic_search.time.passed', 'Az önce geçti')
  }

  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)

  if (days > 0) return tp('dynamic_search.time.remaining', { count: days, unit: t('dynamic_search.time.days', 'gün') }, '{count} {unit} kaldı')
  if (hours > 0) return tp('dynamic_search.time.remaining', { count: hours, unit: t('dynamic_search.time.hours', 'saat') }, '{count} {unit} kaldı')
  if (minutes > 0) return tp('dynamic_search.time.remaining', { count: minutes, unit: t('dynamic_search.time.minutes', 'dk') }, '{count} {unit} kaldı')
  return t('dynamic_search.time.now', 'Şimdi')
}

const getRemainingTimeClass = (remindingDate) => {
  if (!remindingDate) return ''
  const diff = new Date(remindingDate).getTime() - new Date().getTime()
  const hours = diff / (1000 * 60 * 60)

  if (diff < 0) return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  if (hours <= 1) return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
  if (hours <= 24) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
  return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
}

const loadCustomers = async () => {
  loading.value = true
  saveToCache()

  try {
    const api = useApi()
    const { getCustomerFilters, canAccessCustomer } = usePermissions()

    if (Object.keys(usersMap.value).length === 0) {
      const usersResponse = await api('/users')
      if (Array.isArray(usersResponse)) {
        relevantUserList.value = usersResponse.map(u => ({ value: u.id, name: u.name }))
        usersResponse.forEach(u => (usersMap.value[u.id] = u))
      }
    }

    if (statusOptions.value.length === 0) {
      const statusResponse = await api('/statuses')
      if (Array.isArray(statusResponse)) {
        statusResponse.forEach(status => {
          statusMap.value[status.id] = status
          if (status.is_remindable || status.isRemindable) {
            remindableStatusIds.value.push(status.id)
          }
        })
        statusOptions.value = statusResponse
          .filter(s => (s.is_remindable || s.isRemindable) && s.isActive !== false)
          .map(s => ({ value: s.id, label: s.name }))
      }
    }

    const baseFilters = getCustomerFilters()
    const statusToSend = statusFilter.value ? statusFilter.value : remindableStatusIds.value.join(',')

    let relevantUserToSend = relevantUserFilter.value || undefined
    if (!isAdmin.value && !relevantUserToSend) {
      relevantUserToSend = authStore.user?.id
    }

    const query = {
      ...baseFilters,
      search: searchTerm.value || undefined,
      status: statusToSend,
      relevantUser: relevantUserToSend,
      page: pagination.value.page,
      limit: pagination.value.limit,
      ...(dateFilter.value !== 'all' && {
        dateFilter: dateFilter.value,
        startDate: customStartDate.value || undefined,
        endDate: customEndDate.value || undefined
      })
    }

    const response = await api('/customers', { query })

    if (response.meta) {
      pagination.value.page = response.meta.page || 1
      pagination.value.limit = response.meta.limit || 10
      pagination.value.total = response.meta.total || 0
    }

    let customers = Array.isArray(response) ? response : response.data || []

    customers = customers.map(customer => {
      const relevantUserId = customer.relevantUserId || customer.relevant_user_id || customer.relevantUser
      return {
        ...customer,
        name: `${customer.name || ''} ${customer.surname || ''}`.trim() || 'İsimsiz',
        status: customer.statusId || customer.status,
        source: customer.source || '-',
        isActive: customer.isActive ?? true,
        remindingDate: customer.remindingDate || customer.reminding_date || null,
        relevantUser: usersMap.value[relevantUserId] || customer.relevantUser
      }
    })

    customers = customers.filter(c => canAccessCustomer(c))
    customersData.value = customers

  } catch (error) {
    console.error('loadCustomers error:', error)
    customersData.value = []
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  searchTerm.value = ''
  statusFilter.value = ''
  relevantUserFilter.value = ''
  dateFilter.value = 'all'
  customStartDate.value = ''
  customEndDate.value = ''
  pagination.value.page = 1
  clearCache()
  loadCustomers()
}

const handleDateFilterChange = () => {
  if (dateFilter.value !== 'custom') {
    customStartDate.value = ''
    customEndDate.value = ''
  }
  pagination.value.page = 1
  loadCustomers()
}

const showHistory = c => { selectedCustomer.value = c; showHistoryModal.value = true; showStates.value.activeId = null }
const showNotes = c => { selectedCustomer.value = c; showNotesModal.value = true; showStates.value.activeId = null }
const showDoctorAssignment = c => { selectedCustomer.value = c; showDoctorModal.value = true; showStates.value.activeId = null }
const showServices = c => { selectedCustomer.value = c; showServicesModal.value = true; showStates.value.activeId = null }
const showFiles = c => { selectedCustomer.value = c; showFilesModal.value = true; showStates.value.activeId = null }

const handleDoctorAssigned = () => loadCustomers()
const handleServicesSaved = () => loadCustomers()

const formatDateTime = dateString => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('tr-TR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

const getStatusClass = statusId => {
  const status = statusMap.value[statusId]
  if (!status) return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
  if (status.isSale) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
  if (status.isClosed) return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
  if (status.isFirst) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
  return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
}

const getStatusText = statusId => statusMap.value[statusId]?.name || 'Bilinmiyor'

const confirmDelete = (customer) => {
  showStates.value.activeId = null
}

watchDebounced(
  [searchTerm, statusFilter, relevantUserFilter, dateFilter, customStartDate, customEndDate],
  () => {
    if (!cacheLoaded.value) return
    loadCustomers()
  },
  { debounce: 600 }
)

onMounted(async () => {
  const cached = loadFromCache()
  if (cached) {
    searchTerm.value = cached.searchTerm || ''
    statusFilter.value = cached.statusFilter || ''
    relevantUserFilter.value = cached.relevantUserFilter || ''
    dateFilter.value = cached.dateFilter || 'all'
    customStartDate.value = cached.customStartDate || ''
    customEndDate.value = cached.customEndDate || ''
    viewMode.value = cached.viewMode || 'table'
    if (cached.pagination) {
      pagination.value.page = cached.pagination.page || 1
      pagination.value.limit = cached.pagination.limit || 10
    }
  }
  cacheLoaded.value = true
  
  await Promise.all([
    loadCustomers(),
    fetchUserPerformance()
  ])
})

onBeforeUnmount(() => saveToCache())

useHead({ title: 'Dinamik Arama - Valdori CRM' })
</script>