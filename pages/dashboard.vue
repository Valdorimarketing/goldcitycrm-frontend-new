<template>
  <div class="space-y-8">
    <!-- Page Header -->
    <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      <p class="mt-2 text-gray-600 dark:text-gray-400">
        Hoş geldiniz, {{ authStore.user?.name || 'Kullanıcı' }}
      </p>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="stat in stats" :key="stat.name" class="stats-card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <component :is="stat.icon" class="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {{ stat.name }}
              </dt>
              <dd class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{ stat.value }}
              </dd>
            </dl>
          </div>
        </div>
        <div class="mt-4">
          <div class="flex items-center">
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ stat.description }}
            </div>
          </div>
        </div>
      </div>
    </div>

 
        <!-- New Customers Cards -->
    <div v-if="isAdmin || isUser" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- ADMIN VIEW - Mevcut tasarım -->
      <template v-if="isAdmin">
        <div class="card col-span-2">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Henüz Atanmamış Kişiler -->
            <div class="border-r border-gray-200 dark:border-gray-700 pr-0 lg:pr-6">
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-base font-semibold text-gray-900 dark:text-white">Henüz Atanmamış Kişiler</h4>
                <NuxtLink to="/pool-data?tab=unassigned"
                  class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium transition-colors">
                  Tümünü gör
                </NuxtLink>
              </div>

              <!-- Loading & Data states -->
              <div v-if="loadingUnassignedCustomers" class="space-y-3">
                <div v-for="i in 3" :key="i" class="flex items-center space-x-3">
                  <div class="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  <div class="flex-1">
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                    <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                  </div>
                </div>
              </div>

              <div v-else-if="unassignedNewCustomers.length > 0" class="space-y-3">
                <div v-for="customer in unassignedNewCustomers as any" :key="customer.id"
                  class="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                  @click="navigateTo(`/customers/show/${customer.id}`)">
                  <div class="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <span class="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {{ customer.name?.charAt(0) || '?' }}
                    </span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {{ customer.name || 'İsimsiz' }}
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {{ customer.email || customer.phone || '-' }}
                    </p>
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ formatDate(customer.createdAt) }}
                  </div>
                </div>

                <div class="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Toplam: <span class="text-gray-900 dark:text-white">{{ unassignedNewCustomersTotal }}</span>
                  </p>
                </div>
              </div>

              <div v-else class="text-center py-6">
                <p class="text-sm text-gray-500 dark:text-gray-400">Henüz atanmamış kişi bulunmuyor</p>
              </div>
            </div>

            <!-- Bugünkü Atamalar (Admin) -->
            <div>
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-base font-semibold text-gray-900 dark:text-white">Atamalar</h4>
                <NuxtLink to="/assignments?tab=today"
                  class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium transition-colors">
                  Tümünü gör
                </NuxtLink>
              </div>

              <div v-if="loadingTodayAssignments" class="space-y-3">
                <div v-for="i in 3" :key="i" class="flex items-center justify-between p-3">
                  <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
                  <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
                </div>
              </div>

              <div v-else-if="todayAssignments.length > 0" class="space-y-3 overflow-x-hidden max-h-[600px]">
                <div v-for="assignment in todayAssignments" :key="assignment.salesRepId"
                  class="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors border border-gray-200 dark:border-gray-700">

                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center space-x-3">
                      <div class="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                        <span class="text-sm font-semibold text-purple-600 dark:text-purple-400">
                          {{ assignment.salesRepName?.charAt(0) || '?' }}
                        </span>
                      </div>
                      <div>
                        <p class="text-sm font-semibold text-gray-900 dark:text-white">
                          {{ assignment.salesRepName }}
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          Toplam: {{ assignment.totalCount }} atama
                        </p>
                      </div>
                    </div>
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                      {{ assignment.totalCount }}
                    </span>
                  </div>

                  <div class="grid grid-cols-3 gap-2">
                    <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-2 text-center">
                      <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Yeni Data</p>
                      <p class="text-lg font-bold text-green-600 dark:text-green-400">
                        {{ assignment.newDataCount }}
                      </p>
                    </div>

                    <div class="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-2 text-center">
                      <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Dinamik Arama</p>
                      <p class="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                        {{ assignment.dynamicSearchCount }}
                      </p>
                    </div>

                    <div class="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-2 text-center">
                      <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Eski Data</p>
                      <p class="text-lg font-bold text-gray-600 dark:text-gray-400">
                        {{ assignment.oldDataCount }}
                      </p>
                    </div>
                  </div>
                </div>

                <div class="pt-3 border-t border-gray-200 dark:border-gray-700 mt-4">
                  <div class="flex items-center justify-between">
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Toplam Atama:
                    </p>
                    <span class="text-lg font-bold text-gray-900 dark:text-white">
                      {{ totalTodayAssignments }}
                    </span>
                  </div>

                  <div class="grid grid-cols-3 gap-2 mt-3">
                    <div class="text-center">
                      <p class="text-xs text-gray-500 dark:text-gray-400">Yeni</p>
                      <p class="text-sm font-semibold text-green-600 dark:text-green-400">
                        {{ totalNewData }}
                      </p>
                    </div>
                    <div class="text-center">
                      <p class="text-xs text-gray-500 dark:text-gray-400">Dinamik</p>
                      <p class="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                        {{ totalDynamicSearch }}
                      </p>
                    </div>
                    <div class="text-center">
                      <p class="text-xs text-gray-500 dark:text-gray-400">Eski</p>
                      <p class="text-sm font-semibold text-gray-600 dark:text-gray-400">
                        {{ totalOldData }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="text-center py-6">
                <p class="text-sm text-gray-500 dark:text-gray-400">Bugün henüz atama yapılmadı</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Atanmış Beklemedeki Kişiler (Admin) -->
        <div class="card">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Atanmış Beklemedeki Kişiler</h3>
            <NuxtLink to="/pool-data?tab=assigned"
              class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium transition-colors">
              Tümünü gör
            </NuxtLink>
          </div>

          <div v-if="loadingAssignedCustomers" class="space-y-3">
            <div v-for="i in 3" :key="i" class="flex items-center space-x-3">
              <div class="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
              <div class="flex-1">
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
              </div>
            </div>
          </div>

          <div v-else-if="assignedNewCustomers.length > 0" class="space-y-3">
            <div v-for="customer in assignedNewCustomers as any" :key="customer.id"
              class="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
              @click="navigateTo(`/customers/show/${customer.id}`)">
              <div class="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                <span class="text-sm font-medium text-amber-600 dark:text-amber-400">
                  {{ customer.name?.charAt(0) || '?' }}{{ customer.surname?.charAt(0) || '' }}
                </span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {{ customer.name || 'İsimsiz' }} {{ customer.surname || '' }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {{ customer.email || customer.phone || '-' }}
                </p>
                <p class="text-xs text-indigo-600 dark:text-indigo-400 truncate mt-0.5">
                  Atanan: {{ customer.relevantUserInfo?.name || 'Bilinmiyor' }}
                </p>
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(customer.createdAt) }}
              </div>
            </div>

            <div class="pt-3 border-t border-gray-200 dark:border-gray-700">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                Toplam: <span class="text-gray-900 dark:text-white">{{ assignedNewCustomersTotal }}</span>
              </p>
            </div>
          </div>

          <div v-else class="text-center py-6">
            <p class="text-sm text-gray-500 dark:text-gray-400">Atanmış beklemedeki kişi bulunmuyor</p>
          </div>
        </div>
      </template>

      <!-- USER VIEW - Yeni özel tasarım -->
      <template v-else-if="isUser">
        <!-- Benim Atamalarım - Hero Card -->
        <div class="card col-span-2 lg:col-span-3 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-2 border-indigo-200 dark:border-indigo-800">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div class="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                Bugünkü Atamalarım
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Size bugün atanan müşteri verileri
              </p>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loadingMyAssignments" class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>

          <!-- Data State -->
          <div v-else-if="myAssignments" class="space-y-6">
            <!-- Stats Overview -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <!-- Toplam -->
              <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Toplam Atama</p>
                    <p class="text-3xl font-bold text-gray-900 dark:text-white">
                      {{ myAssignments.totalCount }}
                    </p>
                  </div>
                  <div class="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <svg class="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Yeni Data -->
              <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border-l-4 border-green-500">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Yeni Data</p>
                    <p class="text-3xl font-bold text-green-600 dark:text-green-400">
                      {{ myAssignments.newDataCount }}
                    </p>
                  </div>
                  <div class="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <svg class="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </div>
                <div class="mt-2 flex items-center text-xs text-green-600 dark:text-green-400">
                  <svg class="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" />
                  </svg>
                  Taze potansiyel
                </div>
              </div>

              <!-- Dinamik Arama -->
              <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border-l-4 border-yellow-500">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Dinamik Arama</p>
                    <p class="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                      {{ myAssignments.dynamicSearchCount }}
                    </p>
                  </div>
                  <div class="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                    <svg class="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <div class="mt-2 flex items-center text-xs text-yellow-600 dark:text-yellow-400">
                  <svg class="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
                  </svg>
                  Hızlı takip gerekli
                </div>
              </div>

              <!-- Eski Data -->
              <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border-l-4 border-gray-500">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Eski Data</p>
                    <p class="text-3xl font-bold text-gray-600 dark:text-gray-400">
                      {{ myAssignments.oldDataCount }}
                    </p>
                  </div>
                  <div class="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center">
                    <svg class="h-6 w-6 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div class="mt-2 flex items-center text-xs text-gray-600 dark:text-gray-400">
                  <svg class="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                  </svg>
                  Yeniden aktivasyon
                </div>
              </div>
            </div>

           
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-12">
            <div class="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <svg class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Bugün size henüz atama yapılmadı</p>
            <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Yeni atamalar buradan görüntüleyebileceksiniz</p>
          </div>
        </div>
      </template>

    </div>

    <!-- User Calendar (User and Admin Roles) -->
    <div v-if="isAdmin || isUser">
      <DashboardCalendar :customers-data="userCustomersForCalendar" :meetings-data="userMeetingsForCalendar" />
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <!-- Recent Customers -->
      <div class="card">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Son Müşteriler</h3>
          <NuxtLink to="/customers"
            class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium transition-colors">
            Tümünü gör
          </NuxtLink>
        </div>

        <!-- Loading State -->
        <div v-if="loadingCustomers" class="space-y-3">
          <div v-for="i in 3" :key="i" class="flex items-center space-x-3">
            <div class="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <div class="flex-1">
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
              <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
            </div>
          </div>
        </div>

        <!-- Data -->
        <div v-else-if="recentCustomers.length > 0" class="space-y-3">
          <div v-for="customer in recentCustomers as any" :key="customer.id"
            class="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
            @click="navigateTo(`/customers/show/${customer.id}`)">
            <div class="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
              <span class="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                {{ customer.name?.charAt(0) || '?' }}{{ customer.surname?.charAt(0) || '' }}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ customer.name || 'İsimsiz' }} {{ customer.surname || '' }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                {{ customer.email || '-' }}
              </p>
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ formatDate(customer.createdAt) }}
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-6">
          <p class="text-sm text-gray-500 dark:text-gray-400">Henüz müşteri bulunmuyor</p>
        </div>


      </div>

      <!-- Upcoming Reminders -->
      <div class="card">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Yaklaşan Hatırlatmalar</h3>
        </div>

        <!-- Loading State -->
        <div v-if="loadingReminders" class="space-y-3">
          <div v-for="i in 3" :key="i" class="flex items-center space-x-3">
            <div class="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <div class="flex-1">
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
              <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
            </div>
          </div>
        </div>

        <!-- Data -->
        <div v-else-if="upcomingReminders.length > 0" class="space-y-3">
          <div v-for="reminder in upcomingReminders as any" :key="reminder.id"
            class="flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
            @click="reminder.customer && navigateTo(`/customers/show/${reminder.customer}`)">
            <div
              class="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center flex-shrink-0">
              <span class="text-sm font-medium text-amber-600 dark:text-amber-400">
                {{ reminder.customerInfo?.name?.charAt(0) || '?' }}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ reminder.customerInfo?.name || 'Bilinmeyen' }} {{ reminder.customerInfo?.surname || '' }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                {{ reminder.note }}
              </p>
              <p class="text-xs text-amber-600 dark:text-amber-400 mt-1">
                {{ formatDateTime(reminder.remindingAt) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-6">
          <p class="text-sm text-gray-500 dark:text-gray-400">Yaklaşan hatırlatma bulunmuyor</p>
        </div>
      </div>
    </div>

    <!-- Upcoming Meetings -->
    <div v-if="canViewMeetings" class="card">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Yaklaşan Randevular</h3>
        <NuxtLink to="/meetings"
          class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium transition-colors">
          Tümünü gör
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-if="loadingMeetings" class="space-y-3">
        <div v-for="i in 3" :key="i" class="flex items-center space-x-3">
          <div class="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          <div class="flex-1">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
            <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
          </div>
        </div>
      </div>

      <!-- Data -->
      <div v-else-if="upcomingMeetings.length > 0" class="overflow-hidden">
        <table class="min-w-full">
          <thead>
            <tr>
              <th class="table-header">Müşteri</th>
              <th class="table-header">Başlangıç</th>
              <th class="table-header">Bitiş</th>
              <th class="table-header">Durum</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="meeting in upcomingMeetings as any" :key="meeting.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
              <td class="table-cell font-medium">{{ meeting.customerInfo?.name || '-' }} {{
                meeting.customerInfo?.surname || '' }}</td>
              <td class="table-cell">{{ formatDateTime(meeting.startTime) }}</td>
              <td class="table-cell">{{ formatDateTime(meeting.endTime) }}</td>
              <td class="table-cell">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {{ meeting.meetingStatusInfo?.name || 'Belirsiz' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-6">
        <p class="text-sm text-gray-500 dark:text-gray-400">Yaklaşan randevu bulunmuyor</p>
      </div>

      <div class="mt-4">
        <NuxtLink to="/meetings" class="btn-primary text-center block">
          Randevuları Görüntüle
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  UsersIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  CalendarIcon
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '~/stores/auth'
import { useStatuses } from '~/composables/useStatuses'
import { useApi } from '~/composables/useApi'

definePageMeta({
  middleware: 'auth'
})

// Stores and Composables
const authStore = useAuthStore()
const { fetchStatuses, statuses } = useStatuses()
const { getCustomerFilters, canAccessCustomer, getDashboardFilters, getRelatedDataFilters, isAdmin, isUser, isDoctor, isPricing } = usePermissions()

// Loading states
const loadingStats = ref(true)
const loadingCustomers = ref(true)
const loadingSales = ref(true)
const loadingMeetings = ref(true)
const loadingReminders = ref(true)
const loadingUnassignedCustomers = ref(true)
const loadingAssignedCustomers = ref(true)

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


// Bugünkü atamalar için state'ler
const loadingTodayAssignments = ref(false)
const todayAssignments = ref([]) as any

const totalTodayAssignments = computed(() => {
  return todayAssignments.value.reduce((sum:any, a:any) => sum + a.totalCount, 0)
})

const totalNewData = computed(() => {
  return todayAssignments.value.reduce((sum:any, a:any) => sum + a.newDataCount, 0)
})

const totalDynamicSearch = computed(() => {
  return todayAssignments.value.reduce((sum:any, a:any) => sum + a.dynamicSearchCount, 0)
})

const totalOldData = computed(() => {
  return todayAssignments.value.reduce((sum:any, a:any) => sum + a.oldDataCount, 0)
})



// Role-based permissions
const userRole = computed(() => authStore.user?.role || '')
const userId = computed(() => authStore.user?.id || null)

const canAddCustomer = computed(() => {
  return isAdmin.value || isUser.value
})

const canViewSales = computed(() => {
  return isAdmin.value || isUser.value
})

const canViewMeetings = computed(() => {
  return isAdmin.value || isUser.value
})

// Get role label
const getRoleLabel = (role: string | undefined) => {
  const labels: Record<string, string> = {
    admin: 'Admin',
    employee: 'Çalışan',
    doctor: 'Doktor',
    pricing: 'Fiyatlandırma'
  }
  return labels[role || ''] || role || 'Kullanıcı'
}

// Get role-based filters for customers
const getRoleBasedFilters = async () => {
  // Fetch statuses first if needed for doctor/pricing roles
  if (isDoctor.value || isPricing.value) {
    try {
      await fetchStatuses()
    } catch (error) {
      console.error('Error fetching statuses:', error)
    }
  }

  // Use getCustomerFilters for customer queries (uses relevent_user field)
  const customerFilters = getCustomerFilters()

  // For doctor/pricing, we need to map status types to actual status IDs
  if (isDoctor.value) {
    const doctorStatuses = statuses.value.filter(s => s.isDoctor)
    if (doctorStatuses.length > 0) {
      return { status: doctorStatuses.map(s => s.id).join(',') }
    }
  } else if (isPricing.value) {
    const pricingStatuses = statuses.value.filter(s => s.isPricing)
    if (pricingStatuses.length > 0) {
      return { status: pricingStatuses.map(s => s.id).join(',') }
    }
  }

  return customerFilters
}

// Calculate statistics
const calculateStats = async () => {
  try {
    loadingStats.value = true
    const api = useApi()

    const filters = getRelatedDataFilters() || {}

    // DOĞRU ENDPOINT — Sales page ile aynı
    const response = await api('/sales/user/details', { query: filters }) as any

    let allSales = Array.isArray(response?.data) ? response.data : []

    // Sale page ile birebir hesaplayan fonksiyon
    const calcTotalAmount = (products: any) => {
      if (!products || !Array.isArray(products)) return 0
      return products.reduce((sum, p) => {
        return sum + (p.totalPrice || p.offer || p.price || 0)
      }, 0)
    }

    // Para birimini sales page ile aynı mantıkta çek
    const getCurrency = (products: any) => {
      if (!products || !products.length) return 'TRY'
      return (
        products[0]?.currency?.code ||
        products[0]?.productDetails?.currency?.code ||
        'TRY'
      )
    }

    // Çoklu para birimi depoları (TS düzeltildi)
    const revenue: Record<string, number> = {}
    const revenueMonth: Record<string, number> = {}

    const now = new Date()
    const cm = now.getMonth()
    const cy = now.getFullYear()

    allSales.forEach((sale: any) => {
      const amount = calcTotalAmount(sale.salesProducts)
      const currency = getCurrency(sale.salesProducts)

      // TOPLAM GELİR
      revenue[currency] = (revenue[currency] || 0) + amount

      // BU AYKI SATIŞ
      const d = new Date(sale.createdAt)
      if (d.getMonth() === cm && d.getFullYear() === cy) {
        revenueMonth[currency] = (revenueMonth[currency] || 0) + amount
      }
    })


    // Dashboard kartlarına aktar


    totalRevenue.value = revenue as any
    totalSales.value = revenueMonth as any

  } catch (err) {
    console.error('calculateStats error:', err)
  } finally {
    loadingStats.value = false
  }
}


const formatStatsValue = (data: any) => {
  if (!data || typeof data !== 'object') return '-'

  return Object.entries(data)
    .map(([currency, amount]) =>
      new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency
      }).format(Number(amount))
    )
    .join(' - ')
}

// Bugünkü atamaları çeken fonksiyon
const fetchTodayAssignments = async () => {
  loadingTodayAssignments.value = true
  try {
    const api = useApi()
    const data = await api('/customers/assignments/today') as any
    todayAssignments.value = data || []
  } catch (error) {
    console.error('Bugünkü atamalar yüklenemedi:', error)
  } finally {
    loadingTodayAssignments.value = false
  }
}



// Fetch recent customers
const fetchRecentCustomers = async () => {
  try {
    loadingCustomers.value = true
    const api = useApi()
    const filters = await getRoleBasedFilters()

    const customersResponse = await api('/customers', { query: filters }) as any

    // Filter customers based on access permissions
    if (Array.isArray(customersResponse)) {
      const filtered = customersResponse.filter(c => canAccessCustomer(c))
      recentCustomers.value = filtered.slice(0, 5)
    } else if (customersResponse.data && Array.isArray(customersResponse.data)) {
      const filtered = customersResponse.data.filter((c: any) => canAccessCustomer(c))
      recentCustomers.value = filtered.slice(0, 5)
    } else {
      recentCustomers.value = []
    }


    totalCustomers.value = recentCustomers.value.length;

  } catch (error) {
    console.error('Error fetching recent customers:', error)
    recentCustomers.value = []
  } finally {
    loadingCustomers.value = false
  }
}

// Fetch recent sales
const fetchRecentSales = async () => {
  try {
    loadingSales.value = true
    const api = useApi()
    const filters = getRelatedDataFilters() || {}

    const salesResponse = await api('/sales', { query: filters }) as any

    if (Array.isArray(salesResponse)) {
      recentSales.value = salesResponse.slice(0, 5)
    } else if (salesResponse.data && Array.isArray(salesResponse.data)) {
      recentSales.value = salesResponse.data.slice(0, 5)
    } else {
      recentSales.value = []
    }
  } catch (error) {
    console.error('Error fetching recent sales:', error)
    recentSales.value = []
  } finally {
    loadingSales.value = false
  }
}

// Fetch upcoming meetings
const fetchUpcomingMeetings = async () => {
  try {
    loadingMeetings.value = true
    const api = useApi()
    const filters = getRelatedDataFilters() || {}

    const meetingsResponse = await api('/meetings', { query: filters }) as any

    if (Array.isArray(meetingsResponse)) {
      upcomingMeetings.value = meetingsResponse.slice(0, 5)
    } else if (meetingsResponse.data && Array.isArray(meetingsResponse.data)) {
      upcomingMeetings.value = meetingsResponse.data.slice(0, 5)
    } else {
      upcomingMeetings.value = []
    }



    totalMeetings.value = upcomingMeetings.value.length;

  } catch (error) {
    console.error('Error fetching upcoming meetings:', error)
    upcomingMeetings.value = []
  } finally {
    loadingMeetings.value = false
  }
}

// Fetch upcoming reminders
const fetchUpcomingReminders = async () => {
  try {
    loadingReminders.value = true
    const api = useApi()

    // Get future reminders
    const now = new Date()
    const futureDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // Next 30 days

    let filters: any = {
      isReminding: true,
      startDate: now.toISOString().split('T')[0],
      endDate: futureDate.toISOString().split('T')[0]
    }

    // Add user filter if needed
    const userFilters = getRelatedDataFilters()
    if (userFilters) {
      filters = { ...filters, ...userFilters }
    }

    const remindersResponse = await api('/customer-notes', { query: filters }) as any


    let allReminders = []
    if (Array.isArray(remindersResponse)) {
      allReminders = remindersResponse
    } else if (remindersResponse.data && Array.isArray(remindersResponse.data)) {
      allReminders = remindersResponse.data
    }

    // Sort by remindingAt and get first 5
    upcomingReminders.value = allReminders
      .filter((r: any) => r.remindingAt && new Date(r.remindingAt) >= now)
      .sort((a: any, b: any) => new Date(a.remindingAt).getTime() - new Date(b.remindingAt).getTime())
      .slice(0, 5)
  } catch (error) {
    console.error('Error fetching upcoming reminders:', error)
    upcomingReminders.value = []
  } finally {
    loadingReminders.value = false
  }
}

// Fetch unassigned new customers (Admin only)
const fetchUnassignedNewCustomers = async () => {
  if (!isAdmin.value) {
    loadingUnassignedCustomers.value = false
    return
  }

  try {
    loadingUnassignedCustomers.value = true
    const api = useApi()



    // Fetch customers with isFirst=true and hasRelevantUser=false from backend
    const customersResponse = await api('/customers', {
      query: {
        isFirst: true,
        hasRelevantUser: false,
        limit: 50  // Fetch more than needed for display
      }
    }) as any



    let allCustomers = []
    if (Array.isArray(customersResponse)) {
      allCustomers = customersResponse
    } else if (customersResponse.data && Array.isArray(customersResponse.data)) {
      allCustomers = customersResponse.data
    }

    const meta = customersResponse.meta || {}

    unassignedNewCustomersTotal.value = meta.total || allCustomers.length
    unassignedNewCustomers.value = allCustomers.slice(0, 5)
  } catch (error) {
    console.error('Error fetching unassigned new customers:', error)
    unassignedNewCustomers.value = []
    unassignedNewCustomersTotal.value = 0
  } finally {
    loadingUnassignedCustomers.value = false
  }
}

// Fetch users (Admin only)
const fetchUsers = async () => {
  if (!isAdmin.value) return

  try {
    const api = useApi()
    const usersResponse = await api('/users')

    if (Array.isArray(usersResponse)) {
      users.value = usersResponse
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    users.value = []
  }
}

// Fetch user customers for calendar (User and Admin roles)
const fetchUserCustomersForCalendar = async () => {
  if (!isAdmin.value && !isUser.value) return

  try {
    const api = useApi()
    // If admin, fetch all customers. If regular user, fetch only their customers
    const filters = isAdmin.value ? {} : getCustomerFilters()

    const customersResponse = await api('/customers', { query: filters }) as any

    let allCustomers = []
    if (Array.isArray(customersResponse)) {
      allCustomers = customersResponse
    } else if (customersResponse.data && Array.isArray(customersResponse.data)) {
      allCustomers = customersResponse.data
    }

    // If admin, include all customers. If regular user, filter by access
    userCustomersForCalendar.value = isAdmin.value ? allCustomers : allCustomers.filter((c: any) => canAccessCustomer(c))
  } catch (error) {
    console.error('Error fetching user customers for calendar:', error)
    userCustomersForCalendar.value = []
  }
}

// Fetch user meetings for calendar (User and Admin roles)
const fetchUserMeetingsForCalendar = async () => {
  if (!isAdmin.value && !isUser.value) return

  try {
    const api = useApi()
    // If admin, fetch all meetings. If regular user, fetch only their meetings
    const filters = isAdmin.value ? {} : (getRelatedDataFilters() || {})

    const meetingsResponse = await api('/meetings', { query: filters }) as any

    if (Array.isArray(meetingsResponse)) {
      userMeetingsForCalendar.value = meetingsResponse
    } else if (meetingsResponse.data && Array.isArray(meetingsResponse.data)) {
      userMeetingsForCalendar.value = meetingsResponse.data
    } else {
      userMeetingsForCalendar.value = []
    }
  } catch (error) {
    console.error('Error fetching user meetings for calendar:', error)
    userMeetingsForCalendar.value = []
  }
}

// Fetch assigned new customers (Admin only)
const fetchAssignedNewCustomers = async () => {
  if (!isAdmin.value) {
    loadingAssignedCustomers.value = false
    return
  }

  try {
    loadingAssignedCustomers.value = true
    const api = useApi()

    // Ensure users are loaded for user info mapping
    if (users.value.length === 0) {
      await fetchUsers()
    }



    // Fetch customers with isFirst=true and hasRelevantUser=true from backend
    const customersResponse = await api('/customers', {
      query: {
        isFirst: true,
        hasRelevantUser: true,
        limit: 50  // Fetch more than needed for display
      }
    }) as any



    let allCustomers = []
    if (Array.isArray(customersResponse)) {
      allCustomers = customersResponse
    } else if (customersResponse.data && Array.isArray(customersResponse.data)) {
      allCustomers = customersResponse.data
    }

    const meta = customersResponse.meta || {}

    // Create users map for quick lookup
    const usersMap: Record<string, any> = {}
    users.value.forEach((user: any) => {
      usersMap[user.id] = user
    })

    // Add user info to each customer
    const customersWithUserInfo = allCustomers.map((customer: any) => {
      const relevantUserId = customer.relevantUserId || customer.relevant_user_id || customer.relevent_user || customer.relevantUser

      // Parse relevantUser correctly - handle both ID and object cases
      let relevantUserObj = null
      if (relevantUserId !== null && relevantUserId !== undefined) {
        if (typeof relevantUserId === 'object') {
          // Already an object
          relevantUserObj = relevantUserId
        } else {
          // It's an ID, look it up in usersMap
          relevantUserObj = usersMap[relevantUserId]
        }
      }

      return {
        ...customer,
        relevantUserInfo: relevantUserObj
      }
    })

    assignedNewCustomersTotal.value = meta.total || customersWithUserInfo.length
    assignedNewCustomers.value = customersWithUserInfo.slice(0, 5)
  } catch (error) {
    console.error('Error fetching assigned new customers:', error)
    assignedNewCustomers.value = []
    assignedNewCustomersTotal.value = 0
  } finally {
    loadingAssignedCustomers.value = false
  }
}

// User assignments için yeni state
const loadingMyAssignments = ref(false)
const myAssignments = ref(null) as any

// Kullanıcının kendi atamalarını çeken fonksiyon
const fetchMyAssignments = async () => {
  if (!isUser.value || isAdmin.value) return // Sadece normal user için

  loadingMyAssignments.value = true
  try {
    const api = useApi()
    const data = await api('/customers/assignments/my-today') as any
    myAssignments.value = data || null
  } catch (error) {
    console.error('Atamalarım yüklenemedi:', error)
    myAssignments.value = null
  } finally {
    loadingMyAssignments.value = false
  }
}

// Aramaya başla fonksiyonu
const handleStartCalling = () => {
  // İlk olarak yeni data varsa onları göster
  if (myAssignments.value?.newDataCount > 0) {
    navigateTo('/customers?filter=today&type=new')
  } else if (myAssignments.value?.dynamicSearchCount > 0) {
    navigateTo('/customers?filter=today&type=dynamic')
  } else {
    navigateTo('/customers?filter=today')
  }
}

// onMounted'a ekle
onMounted(async () => {
  await Promise.all([
    calculateStats(),
    fetchRecentCustomers(),
    fetchRecentSales(),
    fetchUpcomingMeetings(),
    fetchUpcomingReminders(),
    fetchUnassignedNewCustomers(),
    fetchAssignedNewCustomers(),
    fetchUserCustomersForCalendar(),
    fetchUserMeetingsForCalendar(),
    fetchTodayAssignments(),
    fetchMyAssignments() // Yeni eklendi
  ])
})

// Computed stats with real data
const stats = computed(() => {
  const baseStats = [
    {
      name: 'Toplam Müşteri',
      value: loadingStats.value ? '...' : totalCustomers.value,
      description: getRoleBasedDescription('customer'),
      icon: UsersIcon
    }
  ]

  if (canViewSales.value) {
    baseStats.push(
      {
        name: 'Bu Ay Satış',
        value: loadingStats.value ? '...' : formatStatsValue(totalSales.value),
        description: getRoleBasedDescription('sales'),
        icon: ShoppingBagIcon
      },
      {
        name: 'Toplam Gelir',
        value: loadingStats.value ? '...' : formatStatsValue(totalRevenue.value),
        description: getRoleBasedDescription('revenue'),
        icon: CurrencyDollarIcon
      }
    )
  }

  baseStats.push({
    name: 'Randevular',
    value: loadingStats.value ? '...' : totalMeetings.value,
    description: getRoleBasedDescription('meetings'),
    icon: CalendarIcon
  })

  return baseStats
})

const getRoleBasedDescription = (statType: string) => {
  if (isAdmin.value) {
    return 'Tüm kayıtlar'
  } else if (isUser.value) {
    return 'Sizin kayıtlarınız'
  } else if (isDoctor.value) {
    return 'Doktor müşterileri'
  } else if (isPricing.value) {
    return 'Fiyatlandırma müşterileri'
  }
  return ''
}

// Helper functions
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('tr-TR')
}

const formatDateTime = (dateString: string | undefined) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('tr-TR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('tr-TR').format(amount)
}

// Page head
useHead({
  title: 'Dashboard - Valdori CRM'
})
</script>
