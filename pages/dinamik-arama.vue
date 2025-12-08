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
                <h3 class="text-lg font-bold text-white">Kritik Seviye Uyarısı!</h3>
                <span class="px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold text-white animate-pulse">
                  ACİL
                </span>
              </div>
              <p class="text-red-100 text-sm mb-3">
                <strong class="text-white">{{ userStats.total }}</strong> adet bekleyen dinamik arama kaydınız var. 
                Bu sayı kritik seviyenin üzerinde. Lütfen en kısa sürede müşterilerinizi arayın.
              </p>
              <div class="flex items-center gap-4">
                <div class="flex items-center gap-2 text-sm text-white/90">
                  <ClockIcon class="h-4 w-4" />
                  <span><strong>{{ userStats.overdue }}</strong> gecikmiş</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-white/90">
                  <CalendarIcon class="h-4 w-4" />
                  <span><strong>{{ userStats.today }}</strong> bugün</span>
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
            <div class="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/25">
              <PhoneArrowUpRightIcon class="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dinamik Arama</h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Hatırlatma gerektiren müşterilerinizi yönetin
              </p>
            </div>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="flex flex-wrap gap-3">
          <div class="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span class="text-sm font-medium text-red-700 dark:text-red-400">{{ stats.overdue }} Gecikmiş</span>
          </div>
          <div class="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
            <div class="w-2 h-2 bg-amber-500 rounded-full"></div>
            <span class="text-sm font-medium text-amber-700 dark:text-amber-400">{{ stats.today }} Bugün</span>
          </div>
          <div class="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
            <div class="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span class="text-sm font-medium text-emerald-700 dark:text-emerald-400">{{ stats.upcoming }} Yaklaşan</span>
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
            <div class="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <ChartBarIcon class="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white">Kullanıcı Performans Tablosu</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">Dinamik arama yükü dağılımı</p>
            </div>
          </div>
          <button 
            @click="showPerformanceDetails = !showPerformanceDetails"
            class="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
          >
            {{ showPerformanceDetails ? 'Gizle' : 'Detaylar' }}
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
                  <span class="text-xs font-medium text-red-600 dark:text-red-400 uppercase tracking-wide">Kritik</span>
                </div>
                <p class="text-3xl font-bold text-red-700 dark:text-red-300">{{ performanceSummary.critical }}</p>
                <p class="text-xs text-red-600/70 dark:text-red-400/70 mt-1">70+ kayıt</p>
              </div>
            </div>

            <!-- Warning Users -->
            <div class="relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/20 dark:to-orange-800/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
              <div class="absolute top-0 right-0 w-16 h-16 bg-amber-200/50 dark:bg-amber-700/20 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div class="relative">
                <div class="flex items-center gap-2 mb-2">
                  <ExclamationCircleIcon class="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <span class="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wide">Uyarı</span>
                </div>
                <p class="text-3xl font-bold text-amber-700 dark:text-amber-300">{{ performanceSummary.warning }}</p>
                <p class="text-xs text-amber-600/70 dark:text-amber-400/70 mt-1">40-69 kayıt</p>
              </div>
            </div>

            <!-- Normal Users -->
            <div class="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <div class="absolute top-0 right-0 w-16 h-16 bg-blue-200/50 dark:bg-blue-700/20 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div class="relative">
                <div class="flex items-center gap-2 mb-2">
                  <InformationCircleIcon class="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span class="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">Normal</span>
                </div>
                <p class="text-3xl font-bold text-blue-700 dark:text-blue-300">{{ performanceSummary.normal }}</p>
                <p class="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">20-39 kayıt</p>
              </div>
            </div>

            <!-- Excellent Users -->
            <div class="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900/20 dark:to-green-800/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
              <div class="absolute top-0 right-0 w-16 h-16 bg-emerald-200/50 dark:bg-emerald-700/20 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div class="relative">
                <div class="flex items-center gap-2 mb-2">
                  <CheckCircleIcon class="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <span class="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Mükemmel</span>
                </div>
                <p class="text-3xl font-bold text-emerald-700 dark:text-emerald-300">{{ performanceSummary.excellent }}</p>
                <p class="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-1">0-19 kayıt</p>
              </div>
            </div>
          </div>

          <!-- Detailed User List -->
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
                    <!-- Status Indicator -->
                    <div 
                      :class="[
                        'absolute top-3 right-3 w-3 h-3 rounded-full',
                        user.total >= 70 ? 'bg-red-500 animate-ping' : 
                        user.total >= 40 ? 'bg-amber-500' : 
                        user.total >= 20 ? 'bg-blue-500' : 'bg-emerald-500'
                      ]"
                    ></div>
                    <div 
                      :class="[
                        'absolute top-3 right-3 w-3 h-3 rounded-full',
                        user.total >= 70 ? 'bg-red-500' : 
                        user.total >= 40 ? 'bg-amber-500' : 
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

                    <!-- Progress Bar -->
                    <div class="mb-3">
                      <div class="flex items-center justify-between text-xs mb-1">
                        <span class="text-gray-500 dark:text-gray-400">Yük Seviyesi</span>
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

                    <!-- Stats -->
                    <div class="grid grid-cols-3 gap-2 text-center">
                      <div class="bg-white/50 dark:bg-gray-800/50 rounded-lg p-2">
                        <p class="text-lg font-bold text-red-600 dark:text-red-400">{{ user.overdue }}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">Gecikmiş</p>
                      </div>
                      <div class="bg-white/50 dark:bg-gray-800/50 rounded-lg p-2">
                        <p class="text-lg font-bold text-amber-600 dark:text-amber-400">{{ user.today }}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">Bugün</p>
                      </div>
                      <div class="bg-white/50 dark:bg-gray-800/50 rounded-lg p-2">
                        <p class="text-lg font-bold text-emerald-600 dark:text-emerald-400">{{ user.upcoming }}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">Yaklaşan</p>
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
              ? 'bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-300 dark:border-amber-700'
              : userStats.total >= 20
                ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-300 dark:border-blue-700'
                : 'bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-300 dark:border-emerald-700'
        ]"
      >
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex items-center gap-4">
            <div 
              :class="[
                'h-16 w-16 rounded-2xl flex items-center justify-center',
                userStats.total >= 70 ? 'bg-red-500 animate-pulse' : 
                userStats.total >= 40 ? 'bg-amber-500' : 
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
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">Performans Durumunuz</h3>
                <span 
                  :class="[
                    'px-2 py-0.5 text-xs font-bold rounded-full',
                    userStats.total >= 70 ? 'bg-red-500 text-white' : 
                    userStats.total >= 40 ? 'bg-amber-500 text-white' : 
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
              <p class="text-xs text-gray-500 dark:text-gray-400">Toplam Kayıt</p>
            </div>
            <div class="h-12 w-px bg-gray-200 dark:bg-gray-700"></div>
            <div class="flex gap-4">
              <div class="text-center">
                <p class="text-xl font-bold text-red-600 dark:text-red-400">{{ userStats.overdue }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Gecikmiş</p>
              </div>
              <div class="text-center">
                <p class="text-xl font-bold text-amber-600 dark:text-amber-400">{{ userStats.today }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Bugün</p>
              </div>
              <div class="text-center">
                <p class="text-xl font-bold text-emerald-600 dark:text-emerald-400">{{ userStats.upcoming }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Yaklaşan</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="mt-4">
          <div class="flex items-center justify-between text-xs mb-2">
            <span class="text-gray-600 dark:text-gray-400">Yük Seviyesi</span>
            <span class="font-medium text-gray-700 dark:text-gray-300">
              {{ userStats.total >= 70 ? 'Kritik' : userStats.total >= 40 ? 'Yüksek' : userStats.total >= 20 ? 'Normal' : 'İyi' }}
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
            <span>Mükemmel (10)</span>
            <span>İyi (20)</span>
            <span>Normal (40)</span>
            <span>Kritik (70+)</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters Card -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6 overflow-hidden">
      <!-- ... existing filter code ... -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
        <div class="flex items-center gap-2">
          <FunnelIcon class="h-5 w-5 text-gray-400" />
          <span class="font-medium text-gray-700 dark:text-gray-300">Filtreler</span>
          <span 
            v-if="relevantUserFilter"
            class="px-2 py-0.5 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full"
          >
            Kullanıcı filtreli
          </span>
        </div>
        <button 
          @click="resetFilters" 
          class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
        >
          <ArrowPathIcon class="h-4 w-4" />
          Temizle
        </button>
      </div>

      <div class="p-5">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Search -->
          <div class="relative">
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Ara</label>
            <div class="relative">
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                v-model="searchTerm" 
                type="text" 
                class="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="İsim, email veya telefon..."
              />
            </div>
          </div>

          <!-- Status -->
          <div>
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Durum</label>
            <select 
              v-model="statusFilter" 
              class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none cursor-pointer"
            >
              <option value="">Tüm Durumlar</option>
              <option v-for="status in statusOptions" :key="status.value" :value="status.value">{{ status.label }}</option>
            </select>
          </div>

          <!-- User Filter (Admin) -->
          <div v-if="isAdmin">
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Atanan Kullanıcı</label>
            <select 
              v-model="relevantUserFilter" 
              class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none cursor-pointer"
            >
              <option value="">Tümü</option>
              <option v-for="item in relevantUserList" :key="item.value" :value="item.value">{{ item.name }}</option>
            </select>
          </div>

          <!-- Date Filter -->
          <div>
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Tarih</label>
            <select 
              v-model="dateFilter" 
              @change="handleDateFilterChange"
              class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none cursor-pointer"
            >
              <option value="today">Bugün ve Öncesi</option>
              <option value="today-only">Sadece Bugün</option>
              <option value="tomorrow">Yarın</option>
              <option value="week">Bu Hafta</option>
              <option value="month">Bu Ay</option>
              <option value="overdue">Gecikmiş</option>
              <option value="all">Tümü</option>
              <option value="custom">Özel Tarih Aralığı</option>
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
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Başlangıç</label>
              <input v-model="customStartDate" type="date" class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Bitiş</label>
              <input v-model="customEndDate" type="date" class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
            </div>
          </div>
        </Transition>
      </div>
    </div>


    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-16">
      <div class="relative">
        <div class="w-12 h-12 rounded-full border-4 border-indigo-100 dark:border-indigo-900"></div>
        <div class="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin"></div>
      </div>
      <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">Yükleniyor...</p>
    </div>

    <!-- Results -->
    <div v-else>
      <!-- Results Header -->
      <div class="flex items-center justify-between mb-4">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          <span class="font-semibold text-gray-700 dark:text-gray-300">{{ pagination.total }}</span> kayıt bulundu
        </p>
        <div class="flex items-center gap-2">
          <button 
            @click="viewMode = 'table'" 
            :class="[
              'p-2 rounded-lg transition-all',
              viewMode === 'table' 
                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' 
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
                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' 
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
                  Müşteri
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  İletişim
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Durum
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Hatırlatma
                </th>
                <th v-if="isAdmin" class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Atanan
                </th>
                <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  İşlem
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
                        class="font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        {{ customer.name }}
                      </NuxtLink>
                      <p class="text-xs text-gray-500 dark:text-gray-400">ID: {{ customer.id }}</p>
                    </div>
                  </div>
                </td>

                <!-- Contact -->
                <td class="px-4 py-4">
                  <div class="space-y-1">
                    <p class="text-sm text-gray-600 dark:text-gray-300">{{ customer.email || '-' }}</p>
                    <p v-if="customer.phone" class="text-xs text-gray-500 dark:text-gray-400">
                      <template v-if="isAdmin">{{ customer.phone }}</template>
                      <template v-else>{{ customer.phone.substring(0, 5) }}****</template>
                    </p>
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
                    <div v-else class="h-7 w-7 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <span class="text-xs font-medium text-purple-600 dark:text-purple-400">
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
                      class="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-all"
                      title="Görüntüle"
                    >
                      <EyeIcon class="h-5 w-5" />
                    </NuxtLink>
                    <button 
                      @click="showNotes(customer)"
                      class="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg transition-all"
                      title="Notlar"
                    >
                      <DocumentTextIcon class="h-5 w-5" />
                    </button>
                    <button 
                      @click="showHistory(customer)"
                      class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all"
                      title="Geçmiş"
                    >
                      <ClockIcon class="h-5 w-5" />
                    </button>
                    <button 
                      @click="toggleShow(customer.id)"
                      class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                      title="Daha fazla"
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
                      Kayıt bulunamadı
                    </h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{ searchTerm ? 'Arama kriterlerinize uygun müşteri bulunamadı.' : 'Henüz hatırlatma gerektiren müşteri yok.' }}
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
                        ? 'bg-indigo-600 text-white shadow-sm'
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
              class="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
            >
              <option :value="10">10 / sayfa</option>
              <option :value="25">25 / sayfa</option>
              <option :value="50">50 / sayfa</option>
              <option :value="100">100 / sayfa</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Cards View -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <div 
          v-for="customer in customersData" 
          :key="customer.id"
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800 transition-all group"
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
                  class="font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
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
                <span class="text-xs text-gray-500 dark:text-gray-400">Hatırlatma</span>
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
                <div v-else class="h-6 w-6 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <span class="text-xs font-medium text-purple-600 dark:text-purple-400">
                    {{ customer.relevantUser?.name?.charAt(0)?.toUpperCase() }}
                  </span>
                </div>
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ customer.relevantUser?.name }}</span>
            </div>
            <div v-else></div>

            <div class="flex items-center gap-1">
              <NuxtLink 
                :to="`/customers/show/${customer.id}`"
                class="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-all"
              >
                <EyeIcon class="h-4 w-4" />
              </NuxtLink>
              <button 
                @click="showNotes(customer)"
                class="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg transition-all"
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
              Kayıt bulunamadı
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ searchTerm ? 'Arama kriterlerinize uygun müşteri bulunamadı.' : 'Henüz hatırlatma gerektiren müşteri yok.' }}
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
            Önceki
          </button>
          <span class="px-4 py-2 text-sm text-gray-500">
            {{ pagination.page }} / {{ totalPages }}
          </span>
          <button 
            @click="goToPage(pagination.page + 1)" 
            :disabled="pagination.page >= totalPages"
            class="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Sonraki
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
                <h3 class="font-semibold text-gray-900 dark:text-white">İşlemler</h3>
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
                  <div class="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                    <EyeIcon class="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span class="text-xs text-gray-600 dark:text-gray-300">Görüntüle</span>
                </NuxtLink>

                <button 
                  @click="showHistory(getCustomerById(showStates.activeId))"
                  class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <ClockIcon class="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span class="text-xs text-gray-600 dark:text-gray-300">Geçmiş</span>
                </button>

                <button 
                  @click="showNotes(getCustomerById(showStates.activeId))"
                  class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  <div class="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <DocumentTextIcon class="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <span class="text-xs text-gray-600 dark:text-gray-300">Notlar</span>
                </button>

                <button 
                  @click="showDoctorAssignment(getCustomerById(showStates.activeId))"
                  class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  <div class="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <UsersIcon class="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span class="text-xs text-gray-600 dark:text-gray-300">Doktor</span>
                </button>

                <button 
                  @click="showServices(getCustomerById(showStates.activeId))"
                  class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  <div class="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <ShoppingBagIcon class="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span class="text-xs text-gray-600 dark:text-gray-300">Hizmetler</span>
                </button>

                <button 
                  @click="showFiles(getCustomerById(showStates.activeId))"
                  class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  <div class="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                    <FolderIcon class="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <span class="text-xs text-gray-600 dark:text-gray-300">Dosyalar</span>
                </button>

                <NuxtLink 
                  v-if="isEditable"
                  :to="`/customers/edit/${showStates.activeId}`"
                  class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  <div class="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <PencilIcon class="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <span class="text-xs text-gray-600 dark:text-gray-300">Düzenle</span>
                </NuxtLink>

                <button 
                  v-if="isDeleteable"
                  @click="confirmDelete(getCustomerById(showStates.activeId))"
                  class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 transition-all"
                >
                  <div class="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <TrashIcon class="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <span class="text-xs text-red-600 dark:text-red-400">Sil</span>
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
    // Admin için seçili kullanıcının veya toplam istatistikler
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
  
  // Normal kullanıcı için
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

// Sorted User Performance (kritik olanlar üstte)
const sortedUserPerformance = computed(() => {
  return [...userPerformanceData.value].sort((a, b) => b.total - a.total)
})

// Helper Functions for Performance UI
const getUserCardClass = (total) => {
  if (total >= 70) return 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-300 dark:border-red-700 hover:border-red-400'
  if (total >= 40) return 'bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/20 dark:to-orange-800/20 border-amber-300 dark:border-amber-700 hover:border-amber-400'
  if (total >= 20) return 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-800/20 border-blue-300 dark:border-blue-700 hover:border-blue-400'
  return 'bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900/20 dark:to-green-800/20 border-emerald-300 dark:border-emerald-700 hover:border-emerald-400'
}

const getUserAvatarClass = (total) => {
  if (total >= 70) return 'bg-gradient-to-br from-red-500 to-red-600 text-white'
  if (total >= 40) return 'bg-gradient-to-br from-amber-500 to-orange-500 text-white'
  if (total >= 20) return 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white'
  return 'bg-gradient-to-br from-emerald-500 to-green-500 text-white'
}

const getUserTextClass = (total) => {
  if (total >= 70) return 'text-red-600 dark:text-red-400'
  if (total >= 40) return 'text-amber-600 dark:text-amber-400'
  if (total >= 20) return 'text-blue-600 dark:text-blue-400'
  return 'text-emerald-600 dark:text-emerald-400'
}

const getUserProgressClass = (total) => {
  if (total >= 70) return 'bg-gradient-to-r from-red-500 to-red-600'
  if (total >= 40) return 'bg-gradient-to-r from-amber-500 to-orange-500'
  if (total >= 20) return 'bg-gradient-to-r from-blue-500 to-indigo-500'
  return 'bg-gradient-to-r from-emerald-500 to-green-500'
}

const getUserStatusLabel = (total) => {
  if (total >= 70) return 'Kritik'
  if (total >= 40) return 'Uyarı'
  if (total >= 20) return 'Normal'
  if (total >= 10) return 'İyi'
  return 'Mükemmel'
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

// Filter by user (click on user card)
const filterByUser = (userId) => {
  relevantUserFilter.value = userId
  showPerformanceDetails.value = false
}

// Fetch User Performance Data
const fetchUserPerformance = async () => {
  if (!isAdmin.value) return
  
  loadingPerformance.value = true
  try {
    const api = useApi()
    
    // Her kullanıcı için dinamik arama sayılarını al
    const response = await api('/customers/dynamic-search/user-stats')
    
    if (Array.isArray(response)) {
      userPerformanceData.value = response
    }
  } catch (error) {
    console.error('Error fetching user performance:', error)
    
    // Fallback: Mevcut verilerden hesapla
    calculateUserPerformanceFromData()
  } finally {
    loadingPerformance.value = false
  }
}

// Fallback: Calculate from loaded data
const calculateUserPerformanceFromData = () => {
  const userMap = new Map()
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  // Bu fonksiyon tüm kullanıcılar için aggregate data gerektirir
  // API endpoint yoksa, sadece mevcut filtrelenmiş veriyi kullanabiliriz
  
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
  
  // Bu kısım API'den gelen toplam verilerle doldurulmalı
  userPerformanceData.value = Array.from(userMap.values())
}

 

// View Mode
const viewMode = ref('table')

// Stats
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

// Helper Methods
const isOverdue = (date) => {
  if (!date) return false
  return new Date(date) < new Date()
}

const getAvatarClass = (customer) => {
  if (isOverdue(customer.remindingDate)) {
    return 'bg-gradient-to-br from-red-400 to-red-600 text-white'
  }
  return 'bg-gradient-to-br from-indigo-400 to-purple-600 text-white'
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

// ... rest of the script remains the same as original ...
// (tüm mevcut script logic'i aynen kalacak)

// CACHE_KEY, loadFromCache, saveToCache, clearCache
// State tanımlamaları
// Pagination computed & methods
// loadCustomers, resetFilters, handleDateFilterChange
// Modal handlers
// formatDateTime, getStatusClass, getStatusText
// getRemainingTime, getRemainingTimeClass
// watchDebounced, onMounted, onBeforeUnmount

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

// State
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

// Computed
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

// Methods
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
    if (days > 0) return `${days} gün gecikmiş`
    if (hours > 0) return `${hours} saat gecikmiş`
    return 'Az önce geçti'
  }

  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days} gün kaldı`
  if (hours > 0) return `${hours} saat kaldı`
  if (minutes > 0) return `${minutes} dk kaldı`
  return 'Şimdi'
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
  // Delete logic
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

// onMounted'a ekle
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