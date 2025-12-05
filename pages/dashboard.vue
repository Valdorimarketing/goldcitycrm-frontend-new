<template>
  <div class="min-h-screen">
    <!-- Welcome Header -->
    <div class="mb-8">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div class="flex items-center gap-4">
            <div class="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <span class="text-xl font-bold text-white">
                {{ authStore.user?.name?.charAt(0) || 'U' }}
              </span>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                Hoş geldiniz, {{ authStore.user?.name || 'Kullanıcı' }}
              </h1>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-2">
                <span class="inline-flex items-center gap-1">
                  <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Çevrimiçi
                </span>
                <span class="text-gray-300 dark:text-gray-600">•</span>
                <span>{{ currentDate }}</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="flex items-center gap-2">
          <button 
            @click="refreshAllData"
            class="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            <ArrowPathIcon class="h-4 w-4" :class="{ 'animate-spin': isRefreshing }" />
            Yenile
          </button> 
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <div 
        v-for="(stat, index) in stats" 
        :key="stat.name"
        class="group relative bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              {{ stat.name }}
            </p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ stat.value }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ stat.description }}
            </p>
          </div>
          <div :class="[
            'h-12 w-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110',
            statColors[index]
          ]">
            <component :is="stat.icon" class="h-6 w-6" />
          </div>
        </div>
        
        <!-- Decorative gradient -->
        <div :class="[
          'absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity',
          statGradients[index]
        ]"></div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div v-if="isAdmin || isUser" class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
      
      <!-- ADMIN VIEW -->
      <template v-if="isAdmin">
        <!-- Left Column - Unassigned & Assignments -->
        <div class="lg:col-span-8 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <!-- Unassigned Customers -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="h-9 w-9 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <UserPlusIcon class="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white text-sm">Atanmamış Kişiler</h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Bekleyen müşteriler</p>
                  </div>
                </div>
                <NuxtLink 
                  to="/pool-data?tab=unassigned"
                  class="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Tümü →
                </NuxtLink>
              </div>

              <div class="p-4">
                <!-- Loading -->
                <div v-if="loadingUnassignedCustomers" class="space-y-3">
                  <div v-for="i in 3" :key="i" class="flex items-center gap-3">
                    <div class="h-10 w-10 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                    <div class="flex-1">
                      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2 w-3/4"></div>
                      <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
                    </div>
                  </div>
                </div>

                <!-- Data -->
                <div v-else-if="unassignedNewCustomers.length > 0" class="space-y-2">
                  <div 
                    v-for="customer in unassignedNewCustomers" 
                    :key="customer.id"
                    @click="navigateTo(`/customers/show/${customer.id}`)"
                    class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors group"
                  >
                    <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-sm font-medium shadow-sm">
                      {{ customer.name?.charAt(0) || '?' }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {{ customer.name || 'İsimsiz' }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {{ customer.email || customer.phone || '-' }}
                      </p>
                    </div>
                    <span class="text-xs text-gray-400 dark:text-gray-500">
                      {{ formatDate(customer.createdAt) }}
                    </span>
                  </div>

                  <!-- Total -->
                  <div class="pt-3 mt-3 border-t border-gray-100 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                      <span class="text-xs text-gray-500 dark:text-gray-400">Toplam</span>
                      <span class="text-sm font-bold text-gray-900 dark:text-white">{{ unassignedNewCustomersTotal }}</span>
                    </div>
                  </div>
                </div>

                <!-- Empty -->
                <div v-else class="text-center py-8">
                  <div class="h-12 w-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-3">
                    <CheckCircleIcon class="h-6 w-6 text-gray-400" />
                  </div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Tüm müşteriler atandı</p>
                </div>
              </div>
            </div>

            <!-- Today's Assignments -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="h-9 w-9 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <ClipboardDocumentListIcon class="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white text-sm">Bugünkü Atamalar</h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Temsilci bazında dağılım</p>
                  </div>
                </div>
                <NuxtLink 
                  to="/assignments?tab=today"
                  class="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Tümü →
                </NuxtLink>
              </div>

              <div class="p-4 max-h-[400px] overflow-y-auto">
                <!-- Loading -->
                <div v-if="loadingTodayAssignments" class="space-y-3">
                  <div v-for="i in 3" :key="i" class="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
                </div>

                <!-- Data -->
                <div v-else-if="todayAssignments.length > 0" class="space-y-3">
                  <div 
                    v-for="assignment in todayAssignments" 
                    :key="assignment.salesRepId"
                    class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600"
                  >
                    <div class="flex items-center justify-between mb-3">
                      <div class="flex items-center gap-2">
                        <div class="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                          {{ assignment.salesRepName?.charAt(0) || '?' }}
                        </div>
                        <div>
                          <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ assignment.salesRepName }}</p>
                          <p class="text-xs text-gray-500 dark:text-gray-400">{{ assignment.totalCount }} atama</p>
                        </div>
                      </div>
                      <span class="px-2.5 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-bold rounded-lg">
                        {{ assignment.totalCount }}
                      </span>
                    </div>

                    <div class="grid grid-cols-3 gap-2">
                      <div class="text-center p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                        <p class="text-lg font-bold text-emerald-600 dark:text-emerald-400">{{ assignment.newDataCount }}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">Yeni</p>
                      </div>
                      <div class="text-center p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                        <p class="text-lg font-bold text-amber-600 dark:text-amber-400">{{ assignment.dynamicSearchCount }}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">Dinamik</p>
                      </div>
                      <div class="text-center p-2 bg-gray-100 dark:bg-gray-600/50 rounded-lg">
                        <p class="text-lg font-bold text-gray-600 dark:text-gray-300">{{ assignment.oldDataCount }}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">Eski</p>
                      </div>
                    </div>
                  </div>

                  <!-- Totals -->
                  <div class="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Toplam Atama</span>
                      <span class="text-xl font-bold text-gray-900 dark:text-white">{{ totalTodayAssignments }}</span>
                    </div>
                    <div class="grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <span class="font-semibold text-emerald-600 dark:text-emerald-400">{{ totalNewData }}</span>
                        <span class="text-gray-500 dark:text-gray-400 ml-1">Yeni</span>
                      </div>
                      <div>
                        <span class="font-semibold text-amber-600 dark:text-amber-400">{{ totalDynamicSearch }}</span>
                        <span class="text-gray-500 dark:text-gray-400 ml-1">Dinamik</span>
                      </div>
                      <div>
                        <span class="font-semibold text-gray-600 dark:text-gray-400">{{ totalOldData }}</span>
                        <span class="text-gray-500 dark:text-gray-400 ml-1">Eski</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Empty -->
                <div v-else class="text-center py-8">
                  <div class="h-12 w-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-3">
                    <CalendarIcon class="h-6 w-6 text-gray-400" />
                  </div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Bugün henüz atama yok</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Assigned Waiting -->
        <div class="lg:col-span-4">
          <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden h-full">
            <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="h-9 w-9 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <ClockIcon class="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white text-sm">Beklemedekiler</h3>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Atanmış, işlem bekliyor</p>
                </div>
              </div>
              <NuxtLink 
                to="/pool-data?tab=assigned"
                class="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Tümü →
              </NuxtLink>
            </div>

            <div class="p-4 max-h-[500px] overflow-y-auto">
              <!-- Loading -->
              <div v-if="loadingAssignedCustomers" class="space-y-3">
                <div v-for="i in 4" :key="i" class="flex items-center gap-3">
                  <div class="h-10 w-10 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  <div class="flex-1">
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2 w-3/4"></div>
                    <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
                  </div>
                </div>
              </div>

              <!-- Data -->
              <div v-else-if="assignedNewCustomers.length > 0" class="space-y-2">
                <div 
                  v-for="customer in assignedNewCustomers" 
                  :key="customer.id"
                  @click="navigateTo(`/customers/show/${customer.id}`)"
                  class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors group"
                >
                  <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-sm font-medium shadow-sm">
                    {{ customer.name?.charAt(0) || '?' }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {{ customer.name || 'İsimsiz' }}
                    </p>
                    <p class="text-xs text-indigo-600 dark:text-indigo-400 truncate">
                      {{ customer.relevantUserInfo?.name || 'Bilinmiyor' }}
                    </p>
                  </div>
                  <span class="text-xs text-gray-400 dark:text-gray-500">
                    {{ formatDate(customer.createdAt) }}
                  </span>
                </div>

                <!-- Total -->
                <div class="pt-3 mt-3 border-t border-gray-100 dark:border-gray-700">
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-500 dark:text-gray-400">Toplam</span>
                    <span class="text-sm font-bold text-gray-900 dark:text-white">{{ assignedNewCustomersTotal }}</span>
                  </div>
                </div>
              </div>

              <!-- Empty -->
              <div v-else class="text-center py-8">
                <div class="h-12 w-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-3">
                  <InboxIcon class="h-6 w-6 text-gray-400" />
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Bekleyen müşteri yok</p>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- USER VIEW - My Assignments Hero Card -->
      <template v-else-if="isUser">
        <div class="lg:col-span-12">
          <div class="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-1">
            <div class="bg-white dark:bg-gray-800 rounded-[22px] p-6">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-4">
                  <div class="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <ClipboardDocumentCheckIcon class="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white">Bugünkü Atamalarım</h2>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Size bugün atanan müşteri verileri</p>
                  </div>
                </div>
              </div>

              <!-- Loading -->
              <div v-if="loadingMyAssignments" class="flex items-center justify-center py-12">
                <div class="relative">
                  <div class="w-12 h-12 rounded-full border-4 border-indigo-100 dark:border-indigo-900/50"></div>
                  <div class="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin"></div>
                </div>
              </div>

              <!-- Data -->
              <div v-else-if="myAssignments" class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <!-- Total -->
                <div class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-600">
                  <div class="flex items-center justify-between mb-3">
                    <div class="h-10 w-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                      <UsersIcon class="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span class="text-3xl font-bold text-gray-900 dark:text-white">{{ myAssignments.totalCount }}</span>
                  </div>
                  <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Toplam Atama</p>
                </div>

                <!-- New Data -->
                <div class="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl p-5 border-l-4 border-emerald-500">
                  <div class="flex items-center justify-between mb-3">
                    <div class="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <SparklesIcon class="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span class="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{{ myAssignments.newDataCount }}</span>
                  </div>
                  <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Yeni Data</p>
                  <p class="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                    <ArrowTrendingUpIcon class="h-3 w-3" />
                    Taze potansiyel
                  </p>
                </div>

                <!-- Dynamic Search -->
                <div class="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-2xl p-5 border-l-4 border-amber-500">
                  <div class="flex items-center justify-between mb-3">
                    <div class="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <MagnifyingGlassIcon class="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <span class="text-3xl font-bold text-amber-600 dark:text-amber-400">{{ myAssignments.dynamicSearchCount }}</span>
                  </div>
                  <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Dinamik Arama</p>
                  <p class="text-xs text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                    <BoltIcon class="h-3 w-3" />
                    Hızlı takip gerekli
                  </p>
                </div>

                <!-- Old Data -->
                <div class="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-700/50 dark:to-slate-800/50 rounded-2xl p-5 border-l-4 border-gray-400">
                  <div class="flex items-center justify-between mb-3">
                    <div class="h-10 w-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <ArchiveBoxIcon class="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <span class="text-3xl font-bold text-gray-600 dark:text-gray-400">{{ myAssignments.oldDataCount }}</span>
                  </div>
                  <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Eski Data</p>
                  <p class="text-xs text-gray-500 dark:text-gray-500 mt-1 flex items-center gap-1">
                    <ClockIcon class="h-3 w-3" />
                    Yeniden aktivasyon
                  </p>
                </div>
              </div>

              <!-- Empty -->
              <div v-else class="text-center py-12">
                <div class="h-16 w-16 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
                  <InboxIcon class="h-8 w-8 text-gray-400" />
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Bugün size henüz atama yapılmadı</p>
                <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Yeni atamalar burada görünecek</p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Calendar Section -->
    <div v-if="isAdmin || isUser" class="mb-8">
      <DashboardCalendar :customers-data="userCustomersForCalendar" :meetings-data="userMeetingsForCalendar" />
    </div>

    <!-- Bottom Grid - Recent & Reminders -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      
      <!-- Recent Customers -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="h-9 w-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <UsersIcon class="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Son Müşteriler</h3>
          </div>
          <NuxtLink 
            to="/customers"
            class="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Tümünü gör →
          </NuxtLink>
        </div>

        <div class="p-4">
          <!-- Loading -->
          <div v-if="loadingCustomers" class="space-y-3">
            <div v-for="i in 4" :key="i" class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
              <div class="flex-1">
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2 w-3/4"></div>
                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
              </div>
            </div>
          </div>

          <!-- Data -->
          <div v-else-if="recentCustomers.length > 0" class="space-y-2">
            <div 
              v-for="customer in recentCustomers" 
              :key="customer.id"
              @click="navigateTo(`/customers/show/${customer.id}`)"
              class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors group"
            >
              <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium shadow-sm">
                {{ customer.name?.charAt(0) || '?' }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {{ customer.name || 'İsimsiz' }} {{ customer.surname || '' }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {{ customer.email || '-' }}
                </p>
              </div>
              <span class="text-xs text-gray-400 dark:text-gray-500">
                {{ formatDate(customer.createdAt) }}
              </span>
            </div>
          </div>

          <!-- Empty -->
          <div v-else class="text-center py-8">
            <div class="h-12 w-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-3">
              <UsersIcon class="h-6 w-6 text-gray-400" />
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Henüz müşteri yok</p>
          </div>
        </div>
      </div>

      <!-- Upcoming Reminders -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="h-9 w-9 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <BellAlertIcon class="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Yaklaşan Hatırlatmalar</h3>
          </div>
        </div>

        <div class="p-4">
          <!-- Loading -->
          <div v-if="loadingReminders" class="space-y-3">
            <div v-for="i in 4" :key="i" class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
              <div class="flex-1">
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2 w-3/4"></div>
                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
              </div>
            </div>
          </div>

          <!-- Data -->
          <div v-else-if="upcomingReminders.length > 0" class="space-y-2">
            <div 
              v-for="reminder in upcomingReminders" 
              :key="reminder.id"
              @click="reminder.customer && navigateTo(`/customers/show/${reminder.customer}`)"
              class="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors group"
            >
              <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-sm font-medium shadow-sm flex-shrink-0">
                {{ reminder.customerInfo?.name?.charAt(0) || '?' }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {{ reminder.customerInfo?.name || 'Bilinmeyen' }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {{ reminder.note }}
                </p>
                <p class="text-xs text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                  <ClockIcon class="h-3 w-3" />
                  {{ formatDateTime(reminder.remindingAt) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Empty -->
          <div v-else class="text-center py-8">
            <div class="h-12 w-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-3">
              <BellAlertIcon class="h-6 w-6 text-gray-400" />
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Yaklaşan hatırlatma yok</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Upcoming Meetings -->
    <div v-if="canViewMeetings" class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="h-9 w-9 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
            <CalendarDaysIcon class="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
          </div>
          <h3 class="font-semibold text-gray-900 dark:text-white">Yaklaşan Randevular</h3>
        </div>
        <NuxtLink 
          to="/meetings"
          class="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Tümünü gör →
        </NuxtLink>
      </div>

      <div class="p-4">
        <!-- Loading -->
        <div v-if="loadingMeetings" class="space-y-3">
          <div v-for="i in 3" :key="i" class="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
        </div>

        <!-- Data -->
        <div v-else-if="upcomingMeetings.length > 0" class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-100 dark:border-gray-700">
                <th class="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider py-3 px-4">Müşteri</th>
                <th class="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider py-3 px-4">Başlangıç</th>
                <th class="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider py-3 px-4">Bitiş</th>
                <th class="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider py-3 px-4">Durum</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
              <tr 
                v-for="meeting in upcomingMeetings" 
                :key="meeting.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <td class="py-3 px-4">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ meeting.customerInfo?.name || '-' }} {{ meeting.customerInfo?.surname || '' }}
                  </p>
                </td>
                <td class="py-3 px-4">
                  <p class="text-sm text-gray-600 dark:text-gray-300">{{ formatDateTime(meeting.startTime) }}</p>
                </td>
                <td class="py-3 px-4">
                  <p class="text-sm text-gray-600 dark:text-gray-300">{{ formatDateTime(meeting.endTime) }}</p>
                </td>
                <td class="py-3 px-4">
                  <span class="inline-flex px-2.5 py-1 text-xs font-semibold rounded-lg bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300">
                    {{ meeting.meetingStatusInfo?.name || 'Belirsiz' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty -->
        <div v-else class="text-center py-8">
          <div class="h-12 w-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-3">
            <CalendarDaysIcon class="h-6 w-6 text-gray-400" />
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400">Yaklaşan randevu yok</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  UsersIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ArrowPathIcon,
  PlusIcon,
  UserPlusIcon,
  ClipboardDocumentListIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  CheckCircleIcon,
  InboxIcon,
  BellAlertIcon,
  CalendarDaysIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  BoltIcon,
  ArchiveBoxIcon,
  ArrowTrendingUpIcon
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '~/stores/auth'
import { useStatuses } from '~/composables/useStatuses'
import { useApi } from '~/composables/useApi'

definePageMeta({ middleware: 'auth' })

// Stores
const authStore = useAuthStore()
const { fetchStatuses, statuses } = useStatuses()
const { getCustomerFilters, canAccessCustomer, getDashboardFilters, getRelatedDataFilters, isAdmin, isUser, isDoctor, isPricing } = usePermissions()

// Loading states
const loadingStats = ref(true)
const loadingCustomers = ref(true) 
const loadingMeetings = ref(true)
const loadingReminders = ref(true)
const loadingUnassignedCustomers = ref(true)
const loadingAssignedCustomers = ref(true)
const loadingTodayAssignments = ref(false)
const loadingMyAssignments = ref(false)
const isRefreshing = ref(false)

// Data
const totalCustomers = ref('0')
const totalSales = ref(0)
const totalRevenue = ref(0)
const totalMeetings = ref('0')
const recentCustomers = ref([]) as any
const recentSales = ref([]) as any
const upcomingMeetings = ref([]) as any
const upcomingReminders = ref([]) as any
const unassignedNewCustomers = ref([]) as any
const unassignedNewCustomersTotal = ref(0)
const assignedNewCustomers = ref([]) as any
const assignedNewCustomersTotal = ref(0)
const users = ref([]) as any
const userCustomersForCalendar = ref([]) as any
const userMeetingsForCalendar = ref([]) as any
const todayAssignments = ref([]) as any
const myAssignments = ref(null) as any

// Stat card colors
const statColors = [
  'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
  'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
  'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400'
]

const statGradients = [
  'bg-gradient-to-r from-indigo-500 to-purple-500',
  'bg-gradient-to-r from-emerald-500 to-teal-500',
  'bg-gradient-to-r from-purple-500 to-pink-500',
  'bg-gradient-to-r from-cyan-500 to-blue-500'
]

// Current date
const currentDate = computed(() => {
  return new Date().toLocaleDateString('tr-TR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

// Computed totals
const totalTodayAssignments = computed(() => todayAssignments.value.reduce((sum: any, a: any) => sum + a.totalCount, 0))
const totalNewData = computed(() => todayAssignments.value.reduce((sum: any, a: any) => sum + a.newDataCount, 0))
const totalDynamicSearch = computed(() => todayAssignments.value.reduce((sum: any, a: any) => sum + a.dynamicSearchCount, 0))
const totalOldData = computed(() => todayAssignments.value.reduce((sum: any, a: any) => sum + a.oldDataCount, 0))

// Permissions
const canAddCustomer = computed(() => isAdmin.value || isUser.value)
const canViewSales = computed(() => isAdmin.value || isUser.value)
const canViewMeetings = computed(() => isAdmin.value || isUser.value)

// Stats computed
const stats = computed(() => {
  const baseStats = [
    {
      name: 'Toplam Müşteri',
      value: loadingStats.value ? '...' : totalCustomers.value,
      description: isAdmin.value ? 'Tüm kayıtlar' : 'Sizin kayıtlarınız',
      icon: UsersIcon
    }
  ]

  if (canViewSales.value) {
    baseStats.push( 
      {
        name: 'Toplam Gelir',
        value: loadingStats.value ? '...' : formatStatsValue(totalRevenue.value),
        description: isAdmin.value ? 'Tüm kayıtlar' : 'Sizin kayıtlarınız',
        icon: CurrencyDollarIcon
      }
    )
  }

  baseStats.push({
    name: 'Randevular',
    value: loadingStats.value ? '...' : totalMeetings.value,
    description: isAdmin.value ? 'Tüm kayıtlar' : 'Sizin kayıtlarınız',
    icon: CalendarIcon
  })

  return baseStats
})

// Helper functions
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('tr-TR')
}

const formatDateTime = (dateString: string | undefined) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('tr-TR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatStatsValue = (data: any) => {
  if (!data || typeof data !== 'object') return '-'
  return Object.entries(data)
    .map(([currency, amount]) =>
      new Intl.NumberFormat('tr-TR', { style: 'currency', currency }).format(Number(amount))
    )
    .join(' • ')
}

// Refresh all data
const refreshAllData = async () => {
  isRefreshing.value = true
  await Promise.all([
    calculateStats(),
    fetchRecentCustomers(),
    fetchUpcomingMeetings(),
    fetchUpcomingReminders(),
    fetchUnassignedNewCustomers(),
    fetchAssignedNewCustomers(),
    fetchTodayAssignments(),
    fetchMyAssignments()
  ])
  isRefreshing.value = false
}

// Data fetching functions (aynı mantık, kısaltılmış)
const getRoleBasedFilters = async () => {
  if (isDoctor.value || isPricing.value) {
    try { await fetchStatuses() } catch (error) { console.error('Error fetching statuses:', error) }
  }
  const customerFilters = getCustomerFilters()
  if (isDoctor.value) {
    const doctorStatuses = statuses.value.filter(s => s.isDoctor)
    if (doctorStatuses.length > 0) return { status: doctorStatuses.map(s => s.id).join(',') }
  } else if (isPricing.value) {
    const pricingStatuses = statuses.value.filter(s => s.isPricing)
    if (pricingStatuses.length > 0) return { status: pricingStatuses.map(s => s.id).join(',') }
  }
  return customerFilters
}

const calculateStats = async () => {
  try {
    loadingStats.value = true
    const api = useApi()
    const filters = getRelatedDataFilters() || {}
    const response = await api('/sales/user/details', { query: filters }) as any

    let allSales = Array.isArray(response?.data) ? response.data : []

    const calcTotalAmount = (products: any) => {
      if (!products || !Array.isArray(products)) return 0
      return products.reduce((sum, p) => sum + (p.totalPrice || p.offer || p.price || 0), 0)
    }

    const getCurrency = (products: any) => {
      if (!products || !products.length) return 'TRY'
      return products[0]?.currency?.code || products[0]?.productDetails?.currency?.code || 'TRY'
    }

    const revenue: Record<string, number> = {}
    const revenueMonth: Record<string, number> = {}
    const now = new Date()
    const cm = now.getMonth()
    const cy = now.getFullYear()

    allSales.forEach((sale: any) => {
      const amount = calcTotalAmount(sale.salesProducts)
      const currency = getCurrency(sale.salesProducts)
      revenue[currency] = (revenue[currency] || 0) + amount
      const d = new Date(sale.createdAt)
      if (d.getMonth() === cm && d.getFullYear() === cy) {
        revenueMonth[currency] = (revenueMonth[currency] || 0) + amount
      }
    })
 
    

    totalRevenue.value = revenue as any
    totalSales.value = revenueMonth as any
  } catch (err) {
    console.error('calculateStats error:', err)
  } finally {
    loadingStats.value = false
  }
}

const fetchRecentCustomers = async () => {
  try {
    loadingCustomers.value = true
    const api = useApi()
    const filters = await getRoleBasedFilters()
    const customersResponse = await api('/customers', { query: filters }) as any

    if (Array.isArray(customersResponse)) {
      recentCustomers.value = customersResponse.filter(c => canAccessCustomer(c)).slice(0, 5)
    } else if (customersResponse.data) {
      recentCustomers.value = customersResponse.data.filter((c: any) => canAccessCustomer(c)).slice(0, 5)
    }
    totalCustomers.value = recentCustomers.value.length
  } catch (error) {
    console.error('Error fetching recent customers:', error)
  } finally {
    loadingCustomers.value = false
  }
}

const fetchUpcomingMeetings = async () => {
  try {
    loadingMeetings.value = true
    const api = useApi()
    const filters = getRelatedDataFilters() || {}
    const meetingsResponse = await api('/meetings', { query: filters }) as any

    if (Array.isArray(meetingsResponse)) {
      upcomingMeetings.value = meetingsResponse.slice(0, 5)
    } else if (meetingsResponse.data) {
      upcomingMeetings.value = meetingsResponse.data.slice(0, 5)
    }
    totalMeetings.value = upcomingMeetings.value.length
  } catch (error) {
    console.error('Error fetching upcoming meetings:', error)
  } finally {
    loadingMeetings.value = false
  }
}

const fetchUpcomingReminders = async () => {
  try {
    loadingReminders.value = true
    const api = useApi()
    const now = new Date()
    const futureDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

    let filters: any = {
      isReminding: true,
      startDate: now.toISOString().split('T')[0],
      endDate: futureDate.toISOString().split('T')[0]
    }

    const userFilters = getRelatedDataFilters()
    if (userFilters) filters = { ...filters, ...userFilters }

    const remindersResponse = await api('/customer-notes', { query: filters }) as any

    let allReminders = Array.isArray(remindersResponse) ? remindersResponse : (remindersResponse.data || [])

    upcomingReminders.value = allReminders
      .filter((r: any) => r.remindingAt && new Date(r.remindingAt) >= now)
      .sort((a: any, b: any) => new Date(a.remindingAt).getTime() - new Date(b.remindingAt).getTime())
      .slice(0, 5)
  } catch (error) {
    console.error('Error fetching upcoming reminders:', error)
  } finally {
    loadingReminders.value = false
  }
}

const fetchUnassignedNewCustomers = async () => {
  if (!isAdmin.value) { loadingUnassignedCustomers.value = false; return }
  try {
    loadingUnassignedCustomers.value = true
    const api = useApi()
    const customersResponse = await api('/customers', { query: { isFirst: true, hasRelevantUser: false, limit: 50 } }) as any

    let allCustomers = Array.isArray(customersResponse) ? customersResponse : (customersResponse.data || [])
    const meta = customersResponse.meta || {}

    unassignedNewCustomersTotal.value = meta.total || allCustomers.length
    unassignedNewCustomers.value = allCustomers.slice(0, 5)
  } catch (error) {
    console.error('Error fetching unassigned customers:', error)
  } finally {
    loadingUnassignedCustomers.value = false
  }
}

const fetchUsers = async () => {
  if (!isAdmin.value) return
  try {
    const api = useApi()
    const usersResponse = await api('/users')
    if (Array.isArray(usersResponse)) users.value = usersResponse
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

const fetchAssignedNewCustomers = async () => {
  if (!isAdmin.value) { loadingAssignedCustomers.value = false; return }
  try {
    loadingAssignedCustomers.value = true
    const api = useApi()
    if (users.value.length === 0) await fetchUsers()

    const customersResponse = await api('/customers', { query: { isFirst: true, hasRelevantUser: true, limit: 50 } }) as any

    let allCustomers = Array.isArray(customersResponse) ? customersResponse : (customersResponse.data || [])
    const meta = customersResponse.meta || {}

    const usersMap: Record<string, any> = {}
    users.value.forEach((user: any) => { usersMap[user.id] = user })

    const customersWithUserInfo = allCustomers.map((customer: any) => {
      const relevantUserId = customer.relevantUserId || customer.relevant_user_id || customer.relevent_user || customer.relevantUser
      let relevantUserObj = null
      if (relevantUserId !== null && relevantUserId !== undefined) {
        relevantUserObj = typeof relevantUserId === 'object' ? relevantUserId : usersMap[relevantUserId]
      }
      return { ...customer, relevantUserInfo: relevantUserObj }
    })

    assignedNewCustomersTotal.value = meta.total || customersWithUserInfo.length
    assignedNewCustomers.value = customersWithUserInfo.slice(0, 5)
  } catch (error) {
    console.error('Error fetching assigned customers:', error)
  } finally {
    loadingAssignedCustomers.value = false
  }
}

const fetchUserCustomersForCalendar = async () => {
  if (!isAdmin.value && !isUser.value) return
  try {
    const api = useApi()
    const filters = isAdmin.value ? {} : getCustomerFilters()
    const customersResponse = await api('/customers', { query: filters }) as any

    let allCustomers = Array.isArray(customersResponse) ? customersResponse : (customersResponse.data || [])
    userCustomersForCalendar.value = isAdmin.value ? allCustomers : allCustomers.filter((c: any) => canAccessCustomer(c))
  } catch (error) {
    console.error('Error fetching calendar customers:', error)
  }
}

const fetchUserMeetingsForCalendar = async () => {
  if (!isAdmin.value && !isUser.value) return
  try {
    const api = useApi()
    const filters = isAdmin.value ? {} : (getRelatedDataFilters() || {})
    const meetingsResponse = await api('/meetings', { query: filters }) as any

    userMeetingsForCalendar.value = Array.isArray(meetingsResponse) ? meetingsResponse : (meetingsResponse.data || [])
  } catch (error) {
    console.error('Error fetching calendar meetings:', error)
  }
}

const fetchTodayAssignments = async () => {
  loadingTodayAssignments.value = true
  try {
    const api = useApi()
    const data = await api('/customers/assignments/today') as any
    todayAssignments.value = data || []
  } catch (error) {
    console.error('Error fetching today assignments:', error)
  } finally {
    loadingTodayAssignments.value = false
  }
}

const fetchMyAssignments = async () => {
  if (!isUser.value || isAdmin.value) return
  loadingMyAssignments.value = true
  try {
    const api = useApi()
    const data = await api('/customers/assignments/my-today') as any
    myAssignments.value = data || null
  } catch (error) {
    console.error('Error fetching my assignments:', error)
  } finally {
    loadingMyAssignments.value = false
  }
}

// Mount
onMounted(async () => {
  await Promise.all([
    calculateStats(),
    fetchRecentCustomers(),
    fetchUpcomingMeetings(),
    fetchUpcomingReminders(),
    fetchUnassignedNewCustomers(),
    fetchAssignedNewCustomers(),
    fetchUserCustomersForCalendar(),
    fetchUserMeetingsForCalendar(),
    fetchTodayAssignments(),
    fetchMyAssignments()
  ])
})

useHead({ title: 'Dashboard - Valdori CRM' })
</script>