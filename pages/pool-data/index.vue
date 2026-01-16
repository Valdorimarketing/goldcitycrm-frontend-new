<template>
  <div class="min-h-screen">
    <!-- Header Section -->
    <div class="mb-8">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/25">
              <InboxStackIcon class="h-7 w-7 text-white" />
            </div>
            <div>
              <div class="flex items-center gap-3">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ t('pool.title', 'Havuz Verileri') }}
                </h1>
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium rounded-full">
                  <span class="relative flex h-2 w-2">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  {{ t('pool.live', 'Canlı') }}
                </span>
              </div>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {{ t('pool.description', 'Yeni gelen müşteri verileri anlık olarak listelenir') }}
              </p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap items-center gap-2">
          <NuxtLink 
            to="/whatconverts" 
            class="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-sm font-medium"
          >
            <PresentationChartLineIcon class="h-5 w-5" />
            WhatConverts
          </NuxtLink>
          <button 
            @click="reFreshList()" 
            class="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-sm font-medium"
          >
            <ArrowPathIcon class="h-5 w-5" :class="{ 'animate-spin': loading }" />
            {{ t('dashboard.refresh', 'Yenile') }}
          </button>
          <button 
            @click="showCreateModal = true"
            class="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r to-rose-400 to-rose-500 text-white rounded-xl hover:from-rose-700 hover:to-rose-700 transition-all text-sm font-medium shadow-lg shadow-rose-500/25"
          >
            <PlusIcon class="h-5 w-5" />
            {{ t('pool.new_customer', 'Yeni Müşteri') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {{ t('pool.stats.unassigned', 'Atanmamış') }}
            </p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ stats.unassigned }}</p>
          </div>
          <div class="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-xl">
            <ClockIcon class="h-6 w-6 text-rose-600 dark:text-rose-400" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {{ t('pool.stats.waiting', 'Beklemede') }}
            </p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ stats.assigned }}</p>
          </div>
          <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
            <UserGroupIcon class="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {{ t('pool.stats.today', 'Bugün Gelen') }}
            </p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ stats.today }}</p>
          </div>
          <div class="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
            <CalendarIcon class="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {{ t('pool.stats.avg_wait', 'Ort. Bekleme') }}
            </p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ stats.avgWait }}</p>
          </div>
          <div class="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-xl">
            <ChartBarIcon class="h-6 w-6 text-rose-600 dark:text-rose-400" />
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 mb-6 overflow-hidden">
      <div class="flex border-b border-gray-200 dark:border-gray-700">
        <button 
          @click="activeTab = 'unassigned'" 
          :class="[
            'flex-1 sm:flex-none px-6 py-4 text-sm font-medium transition-all relative',
            activeTab === 'unassigned'
              ? 'text-rose-600 dark:text-rose-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          ]"
        >
          <div class="flex items-center justify-center gap-2">
            <InboxIcon class="h-5 w-5" />
            <span>{{ t('pool.tabs.not_assigned', 'Henüz Atanmamış') }}</span>
            <span 
              v-if="stats.unassigned > 0"
              class="ml-1 px-2 py-0.5 text-xs font-semibold rounded-full"
              :class="activeTab === 'unassigned' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'"
            >
              {{ stats.unassigned }}
            </span>
          </div>
          <div 
            v-if="activeTab === 'unassigned'" 
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-600 dark:bg-rose-400"
          ></div>
        </button>

        <button 
          @click="activeTab = 'assigned'" 
          :class="[
            'flex-1 sm:flex-none px-6 py-4 text-sm font-medium transition-all relative',
            activeTab === 'assigned'
              ? 'text-rose-600 dark:text-rose-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          ]"
        >
          <div class="flex items-center justify-center gap-2">
            <UserGroupIcon class="h-5 w-5" />
            <span>{{ t('pool.tabs.assigned_waiting', 'Atandı, Beklemede') }}</span>
            <span 
              v-if="stats.assigned > 0"
              class="ml-1 px-2 py-0.5 text-xs font-semibold rounded-full"
              :class="activeTab === 'assigned' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'"
            >
              {{ stats.assigned }}
            </span>
          </div>
          <div 
            v-if="activeTab === 'assigned'" 
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-600 dark:bg-rose-400"
          ></div>
        </button>
      </div>

      <!-- Search Bar -->
      <div class="p-4 border-b border-gray-100 dark:border-gray-700">
        <div class="relative max-w-xl">
          <MagnifyingGlassIcon class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            v-model="columnFilters.name" 
            type="text"
            class="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
            :placeholder="t('pool.search_placeholder', 'Ad, soyad, email, telefon, paket veya URL ile ara...')"
          />
          <button 
            v-if="columnFilters.name"
            @click="columnFilters.name = ''"
            class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          >
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-16">
        <div class="relative">
          <div class="w-12 h-12 rounded-full border-4 border-rose-100 dark:border-rose-900"></div>
          <div class="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-transparent border-t-rose-600 animate-spin"></div>
        </div>
        <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">
          {{ t('pool.loading', 'Veriler yükleniyor...') }}
        </p>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="bg-gray-50 dark:bg-gray-900/50">
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ t('pool.table.customer', 'Müşteri') }}
              </th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ t('pool.table.contact', 'İletişim') }}
              </th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ t('pool.table.source', 'Kaynak') }}
              </th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ t('pool.table.package', 'Paket / Hastalık') }}
              </th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ t('pool.table.waiting', 'Bekleme') }}
              </th>
              <th v-if="activeTab === 'unassigned'" class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ t('pool.table.assignment', 'Atama') }}
              </th>
              <th v-if="activeTab === 'assigned'" class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ t('pool.table.assigned_person', 'Atanan Kişi') }}
              </th>
              <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ t('pool.table.actions', 'İşlem') }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
            <tr 
              v-for="customer in customersData" 
              :key="customer.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
            >
              <!-- Customer Info -->
              <td class="px-4 py-4">
                <div class="flex items-center gap-3">
                  <div 
                    class="h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold shadow-sm"
                    :class="getWaitingClass(customer.createdAt)"
                  >
                    {{ customer.name.charAt(0).toUpperCase() }}
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

              <!-- Contact -->
              <td class="px-4 py-4">
                <div class="space-y-1">
                  <p v-if="customer.email" class="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                    <EnvelopeIcon class="h-4 w-4 text-gray-400" />
                    {{ customer.email }}
                  </p>
                  <p v-if="customer.phone" class="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                    <PhoneIcon class="h-4 w-4 text-gray-400" />
                    {{ customer.phone }}
                  </p>
                  <p v-if="!customer.email && !customer.phone" class="text-sm text-gray-400">-</p>
                </div>
              </td>

              <!-- Source -->
              <td class="px-4 py-4">
                <div class="space-y-1">
                  <span class="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    {{ customer.source || '-' }}
                  </span>
                  <a 
                    v-if="customer.url" 
                    :href="getCustomerUrl(customer)" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="block text-xs text-blue-600 dark:text-blue-400 hover:underline truncate max-w-[150px]"
                  >
                    {{ customer.url }}
                  </a>
                </div>
              </td>

              <!-- Package / Disease -->
              <td class="px-4 py-4">
                <div class="space-y-1">
                  <p v-if="customer.checkup_package" class="text-sm text-gray-700 dark:text-gray-300">
                    {{ customer.checkup_package }}
                  </p>
                  <p v-if="customer.patient" class="text-xs text-gray-500 dark:text-gray-400">
                    {{ customer.patient }}
                  </p>
                  <p v-if="!customer.checkup_package && !customer.patient" class="text-sm text-gray-400">-</p>
                </div>
              </td>

              <!-- Waiting Time -->
              <td class="px-4 py-4">
                <div class="space-y-1">
                  <span 
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full"
                    :class="getWaitingBadgeClass(activeTab === 'assigned' ? (customer.updatesAt || customer.updatedAt) : customer.createdAt)"
                  >
                    <ClockIcon class="h-3.5 w-3.5" />
                    {{ getWaitingTime(activeTab === 'assigned' ? (customer.updatesAt || customer.updatedAt) : customer.createdAt) }}
                  </span>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatDate(customer.createdAt) }}
                  </p>
                </div>
              </td>

              <!-- Assignment (Unassigned Tab) -->
              <td v-if="activeTab === 'unassigned'" class="px-4 py-4">
                <div class="flex flex-col gap-2">
                  <div class="flex gap-2">
                    <select 
                      v-model="rowAssignments[customer.id].selectedGroupId" 
                      @change="onGroupChange(customer.id)"
                      class="text-xs py-2 px-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-rose-500 min-w-[120px]"
                    >
                      <option value="">{{ t('pool.select_group', 'Grup Seç') }}</option>
                      <option v-for="group in userGroups" :key="group.id" :value="group.id">
                        {{ group.name }}
                      </option>
                    </select>
                    <select 
                      v-model="rowAssignments[customer.id].selectedUserId"
                      :disabled="!rowAssignments[customer.id].selectedGroupId"
                      class="text-xs py-2 px-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-rose-500 min-w-[120px] disabled:opacity-50"
                    >
                      <option value="">{{ t('pool.select_user', 'Kullanıcı Seç') }}</option>
                      <option v-for="user in getGroupUsers(customer.id)" :key="user.id" :value="user.id">
                        {{ user.name }}
                      </option>
                    </select>
                  </div>
                  <button 
                    @click="assignCustomerToUser(customer)"
                    :disabled="!rowAssignments[customer.id].selectedUserId"
                    class="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <UserPlusIcon class="h-4 w-4" />
                    {{ t('pool.assign', 'Ata') }}
                  </button>
                </div>
              </td>

              <!-- Assigned User (Assigned Tab) -->
              <td v-if="activeTab === 'assigned'" class="px-4 py-4">
                <div class="flex items-center gap-3">
                  <div v-if="customer.relevantUserData?.avatar" class="h-10 w-10 rounded-full overflow-hidden ring-2 ring-white dark:ring-gray-800 shadow">
                    <img :src="path + customer.relevantUserData.avatar" alt="Avatar" class="h-full w-full object-cover" />
                  </div>
                  <div v-else class="h-10 w-10 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center text-white font-medium text-sm shadow">
                    {{ customer.relevantUserData?.name?.charAt(0) || 'A' }}
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ customer.relevantUserData?.name || t('pool.unassigned', 'Atanmamış') }}
                    </p>
                    <p v-if="customer.relevantUserData?.lastActiveTime" class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <span class="w-1.5 h-1.5 rounded-full" :class="isOnline(customer.relevantUserData?.lastActiveTime) ? 'bg-emerald-500' : 'bg-gray-400'"></span>
                      {{ getLastSeen(customer.relevantUserData?.lastActiveTime) }}
                    </p>
                  </div>
                </div>
              </td>

              <!-- Actions -->
              <td class="px-4 py-4 text-right">
                <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <NuxtLink 
                    :to="`/customers/show/${customer.id}`"
                    class="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-all"
                    :title="t('pool.actions.view', 'Görüntüle')"
                  >
                    <EyeIcon class="h-5 w-5" />
                  </NuxtLink>
                  <button 
                    @click="showNotes(customer)"
                    class="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-all"
                    :title="t('pool.actions.notes', 'Notlar')"
                  >
                    <DocumentTextIcon class="h-5 w-5" />
                  </button>
                  <button 
                    @click="toggleShow(customer.id)"
                    class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                    :title="t('pool.actions.more', 'Daha fazla')"
                  >
                    <EllipsisHorizontalIcon class="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="customersData.length === 0">
              <td :colspan="activeTab === 'unassigned' ? 7 : 7" class="px-4 py-16 text-center">
                <div class="flex flex-col items-center">
                  <div class="p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                    <InboxIcon class="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {{ t('pool.empty.title', 'Havuz verisi bulunamadı') }}
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ hasActiveFilters ? t('pool.empty.filtered', 'Filtrelere uygun veri bulunamadı.') : t('pool.empty.no_data', 'Henüz havuz verisi yok.') }}
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="px-4 py-4 border-t border-gray-100 dark:border-gray-700">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            <span class="font-medium">{{ ((pagination.page - 1) * pagination.limit) + 1 }}</span> - 
            <span class="font-medium">{{ Math.min(pagination.page * pagination.limit, pagination.total) }}</span> / {{ pagination.total }}
          </p>

          <div class="flex items-center gap-2">
            <button 
              @click="changePage(pagination.page - 1)" 
              :disabled="pagination.page === 1"
              class="p-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeftIcon class="h-5 w-5" />
            </button>

            <div class="hidden sm:flex items-center gap-1">
              <template v-for="pageNum in visiblePages" :key="pageNum">
                <button 
                  @click="changePage(pageNum)"
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
              {{ pagination.page }} / {{ pagination.totalPages }}
            </span>

            <button 
              @click="changePage(pagination.page + 1)" 
              :disabled="pagination.page >= pagination.totalPages"
              class="p-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRightIcon class="h-5 w-5" />
            </button>
          </div>
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
                <h3 class="font-semibold text-gray-900 dark:text-white">
                  {{ t('pool.modal.actions', 'İşlemler') }}
                </h3>
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
                  <span class="text-xs text-gray-600 dark:text-gray-300">{{ t('pool.actions.view', 'Görüntüle') }}</span>
                </NuxtLink>

                <button 
                  @click="showHistory(getCustomerById(showStates.activeId))"
                  class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <ClockIcon class="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span class="text-xs text-gray-600 dark:text-gray-300">{{ t('pool.actions.history', 'Geçmiş') }}</span>
                </button>

                <button 
                  @click="showNotes(getCustomerById(showStates.activeId))"
                  class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  <div class="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
                    <DocumentTextIcon class="h-5 w-5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <span class="text-xs text-gray-600 dark:text-gray-300">{{ t('pool.actions.notes', 'Notlar') }}</span>
                </button>

                <button 
                  @click="showDoctorAssignment(getCustomerById(showStates.activeId))"
                  class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  <div class="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
                    <UsersIcon class="h-5 w-5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <span class="text-xs text-gray-600 dark:text-gray-300">{{ t('pool.actions.doctor', 'Doktor') }}</span>
                </button>

                <button 
                  @click="showServices(getCustomerById(showStates.activeId))"
                  class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  <div class="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <ShoppingBagIcon class="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span class="text-xs text-gray-600 dark:text-gray-300">{{ t('pool.actions.services', 'Hizmetler') }}</span>
                </button>

                <button 
                  @click="showFiles(getCustomerById(showStates.activeId))"
                  class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  <div class="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                    <FolderIcon class="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <span class="text-xs text-gray-600 dark:text-gray-300">{{ t('pool.actions.files', 'Dosyalar') }}</span>
                </button>

                <NuxtLink 
                  v-if="isEditable"
                  :to="`/customers/edit/${showStates.activeId}`"
                  class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  <div class="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <PencilIcon class="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <span class="text-xs text-gray-600 dark:text-gray-300">{{ t('pool.actions.edit', 'Düzenle') }}</span>
                </NuxtLink>

                <button 
                  v-if="isDeleteable"
                  @click="confirmDelete(getCustomerById(showStates.activeId))"
                  class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 transition-all"
                >
                  <div class="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <TrashIcon class="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <span class="text-xs text-red-600 dark:text-red-400">{{ t('pool.actions.delete', 'Sil') }}</span>
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>

    <!-- Delete Confirmation Modal -->
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
          v-if="showDeleteModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div class="p-6 text-center">
              <div class="mx-auto w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                <ExclamationTriangleIcon class="h-7 w-7 text-red-600 dark:text-red-400" />
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {{ t('pool.delete.title', 'Müşteriyi Sil') }}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                <strong class="text-gray-700 dark:text-gray-300">{{ customerToDelete?.name }}</strong> 
                {{ t('pool.delete.message', 'adlı müşteriyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.') }}
              </p>
            </div>
            <div class="flex gap-3 px-6 pb-6">
              <button 
                @click="showDeleteModal = false"
                class="flex-1 py-2.5 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
              >
                {{ t('pool.delete.cancel', 'İptal') }}
              </button>
              <button 
                @click="handleDelete"
                class="flex-1 py-2.5 px-4 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all"
              >
                {{ t('pool.delete.confirm', 'Sil') }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Modals -->
    <CustomerCreateModal :show="showCreateModal" @close="showCreateModal = false" @created="handleCustomerCreated" />
    <CustomerHistoryModal :show="showHistoryModal" :customer="selectedCustomer" @close="showHistoryModal = false" />
    <CustomerNotesModal :show="showNotesModal" :customer="selectedCustomer" @close="showNotesModal = false" @customer-updated="() => fetchCustomers(pagination.page)" />
    <DoctorAssignmentModal :show="showDoctorModal" :customer="selectedCustomer" @close="showDoctorModal = false" @assigned="handleDoctorAssigned" />
    <CustomerServicesModal :show="showServicesModal" :customer="selectedCustomer" @close="showServicesModal = false" @saved="handleServicesSaved" />
    <CustomerFilesModal :show="showFilesModal" :customer="selectedCustomer" @close="showFilesModal = false" />
  </div>
</template>

<script setup>
import {
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  ClockIcon,
  DocumentTextIcon,
  ShoppingBagIcon,
  PencilIcon,
  TrashIcon,
  FolderIcon,
  EllipsisHorizontalIcon,
  PresentationChartLineIcon,
  InboxStackIcon,
  InboxIcon,
  UserGroupIcon,
  CalendarIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ArrowPathIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserPlusIcon,
  UsersIcon
} from '@heroicons/vue/24/outline'

import { useAuthStore } from '~/stores/auth'
import { useLanguage } from '~/composables/useLanguage'

const { t } = useLanguage()
const { $dayjs } = useNuxtApp()

const config = useRuntimeConfig()
const path = config.public.apiBase

definePageMeta({
  middleware: ['auth', 'admindoctor']
})

const loading = ref(true)
const pagination = ref({
  total: 0,
  page: 1,
  limit: 50,
  totalPages: 0
})

const customersData = ref([])
const authStore = useAuthStore()

const route = useRoute()
const router = useRouter()
const activeTab = ref(route.query.tab || 'unassigned')
const isEditable = ref(true)
const isDeleteable = ref(true)

const statusOptions = ref([])
const statusMap = ref({})
const usersMap = ref({})

const showStates = ref({ activeId: null })

const columnFilters = ref({
  name: ''
})

const users = ref([])
const userGroups = ref([])
const rowAssignments = ref({})
const groupUsersMap = ref({})

const showDeleteModal = ref(false)
const customerToDelete = ref(null)
const showCreateModal = ref(false)
const showHistoryModal = ref(false)
const showNotesModal = ref(false)
const showDoctorModal = ref(false)
const showServicesModal = ref(false)
const showFilesModal = ref(false)
const selectedCustomer = ref(null)
const isInitialLoad = ref(true)

// Stats
const stats = ref({
  unassigned: 0,
  assigned: 0,
  today: 0,
  avgWait: '0dk'
})

// Computed
const hasActiveFilters = computed(() => columnFilters.value.name !== '')

const visiblePages = computed(() => {
  const pages = []
  const total = pagination.value.totalPages
  const current = pagination.value.page

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    if (current <= 4) pages.push(1, 2, 3, 4, 5)
    else if (current >= total - 3) pages.push(total - 4, total - 3, total - 2, total - 1, total)
    else pages.push(current - 1, current, current + 1)
  }

  return pages
})

// Methods
const toggleShow = (id) => {
  showStates.value.activeId = showStates.value.activeId === id ? null : id
}

const getCustomerById = (id) => customersData.value.find(c => c.id === id)

const getLastSeen = (lastActiveTime) => $dayjs(lastActiveTime).fromNow()

const isOnline = (lastActiveTime) => {
  if (!lastActiveTime) return false
  const diff = Date.now() - new Date(lastActiveTime).getTime()
  return diff < 5 * 60 * 1000 // 5 dakika
}

const getWaitingTime = (dateString) => {
  if (!dateString) return '-'
  return $dayjs(dateString).fromNow()
}

const getWaitingClass = (dateString) => {
  if (!dateString) return 'bg-gradient-to-br from-gray-400 to-gray-500 text-white'
  const hours = (Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60)
  if (hours > 24) return 'bg-gradient-to-br from-red-400 to-red-600 text-white'
  if (hours > 4) return 'bg-gradient-to-br from-rose-400 to-orange-500 text-white'
  return 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white'
}

const getWaitingBadgeClass = (dateString) => {
  if (!dateString) return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
  const hours = (Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60)
  if (hours > 24) return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  if (hours > 4) return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
  return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
}

const getCustomerUrl = (customer) => {
  if (!customer?.url) return null
  const domains = {
    4: 'https://lp.livhospital.com',
    8: 'https://int.livhospital.com',
  }
  const base = domains[customer.sourceId] || '#'
  return base + customer.url
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('tr-TR')
}

const initializeRowAssignment = (id) => {
  if (!rowAssignments.value[id]) {
    rowAssignments.value[id] = { selectedGroupId: '', selectedUserId: '' }
  }
}

const onGroupChange = async (customerId) => {
  initializeRowAssignment(customerId)
  const groupId = rowAssignments.value[customerId].selectedGroupId
  rowAssignments.value[customerId].selectedUserId = ''

  if (!groupId) return

  if (!groupUsersMap.value[groupId]) {
    try {
      const api = useApi()
      const response = await api(`/user-group/${groupId}/users`)
      groupUsersMap.value[groupId] = Array.isArray(response) ? response : (response?.data || [])
    } catch (error) {
      console.error('Error loading group users:', error)
      groupUsersMap.value[groupId] = []
    }
  }
}

const getGroupUsers = (customerId) => {
  if (!rowAssignments.value[customerId]) return []
  const groupId = rowAssignments.value[customerId].selectedGroupId
  return groupUsersMap.value[groupId] || []
}

const assignCustomerToUser = async (customer) => {
  const userId = rowAssignments.value[customer.id].selectedUserId
  if (!userId) return

  try {
    const api = useApi()
    await api(`/customers/${customer.id}`, {
      method: 'PATCH',
      body: { relevantUser: userId }
    })
    delete rowAssignments.value[customer.id]
    await fetchCustomers(pagination.value.page)
    await fetchStats()
  } catch (error) {
    console.error('Error assigning customer:', error)
  }
}

const fetchStats = async () => {
  try {
    const api = useApi()
    
    const [unassignedRes, assignedRes] = await Promise.all([
      api('/customers', { query: { isFirst: true, hasRelevantUser: false, limit: 20 } }),
      api('/customers', { query: { isFirst: true, hasRelevantUser: true, limit: 20 } })
    ])

    stats.value.unassigned = unassignedRes.meta?.total || 0
    stats.value.assigned = assignedRes.meta?.total || 0

    // Today count (simplified)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    stats.value.today = customersData.value.filter(c => new Date(c.createdAt) >= today).length

    // Average wait (simplified)
    if (customersData.value.length > 0) {
      const totalMinutes = customersData.value.reduce((acc, c) => {
        const diff = Date.now() - new Date(c.createdAt).getTime()
        return acc + diff / (1000 * 60)
      }, 0)
      const avgMinutes = Math.round(totalMinutes / customersData.value.length)
      if (avgMinutes < 60) stats.value.avgWait = `${avgMinutes}dk`
      else if (avgMinutes < 1440) stats.value.avgWait = `${Math.round(avgMinutes / 60)}sa`
      else stats.value.avgWait = `${Math.round(avgMinutes / 1440)}gün`
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
  }
}

const fetchCustomers = async (page = 1) => {
  try {
    if (isInitialLoad.value) loading.value = true
    const api = useApi()

    const queryParams = {
      isFirst: true,
      page: page,
      limit: pagination.value.limit
    }

    if (activeTab.value === 'unassigned') queryParams.hasRelevantUser = false
    else if (activeTab.value === 'assigned') queryParams.hasRelevantUser = true

    if (columnFilters.value.name?.trim()) {
      queryParams.search = columnFilters.value.name.trim()
    }

    const response = await api('/customers', { query: queryParams })

    const customersArray = Array.isArray(response) ? response : (response.data || [])
    const meta = response.meta || {}

    customersData.value = customersArray.map(customer => ({
      ...customer,
      name: `${customer.name || ''} ${customer.surname || ''}`.trim() || t('dashboard.unassigned.no_name', 'İsimsiz'),
      source: customer.source || '-',
      isActive: customer.isActive !== undefined ? customer.isActive : true,
      user: usersMap.value[customer.userId] || customer.user,
      relevantUser: usersMap.value[customer.relevantUserId] || customer.relevantUser
    }))

    pagination.value = {
      total: meta.total || customersArray.length,
      page: meta.page || page,
      limit: meta.limit || pagination.value.limit,
      totalPages: meta.totalPages || Math.ceil((meta.total || customersArray.length) / pagination.value.limit)
    }

    customersData.value.forEach(c => initializeRowAssignment(c.id))
  } catch (error) {
    console.error('Failed to load customers:', error)
  } finally {
    if (isInitialLoad.value) {
      loading.value = false
      isInitialLoad.value = false
    }
  }
}

const reFreshList = async () => {
  await fetchCustomers(pagination.value.page)
  await fetchStats()
}

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    fetchCustomers(page)
  }
}

const confirmDelete = (customer) => {
  customerToDelete.value = customer
  showDeleteModal.value = true
  showStates.value.activeId = null
}

const showHistory = (customer) => {
  selectedCustomer.value = customer
  showHistoryModal.value = true
  showStates.value.activeId = null
}

const showNotes = (customer) => {
  selectedCustomer.value = customer
  showNotesModal.value = true
  showStates.value.activeId = null
}

const showDoctorAssignment = (customer) => {
  selectedCustomer.value = customer
  showDoctorModal.value = true
  showStates.value.activeId = null
}

const handleDoctorAssigned = (assignment) => {
  console.log('Doctor assigned:', assignment)
}

const showServices = (customer) => {
  selectedCustomer.value = customer
  showServicesModal.value = true
  showStates.value.activeId = null
}

const handleServicesSaved = () => {
  showServicesModal.value = false
}

const showFiles = (customer) => {
  selectedCustomer.value = customer
  showFilesModal.value = true
  showStates.value.activeId = null
}

const handleDelete = async () => {
  if (customerToDelete.value) {
    try {
      const api = useApi()
      await api(`/customers/${customerToDelete.value.id}`, { method: 'DELETE' })
      await fetchCustomers(pagination.value.page)
      await fetchStats()
    } catch (error) {
      console.error('Error deleting customer:', error)
    }
  }
  showDeleteModal.value = false
  customerToDelete.value = null
}

const handleCustomerCreated = async (customer) => {
  await fetchCustomers(1)
  await fetchStats()
}

// Watchers
watch(columnFilters, () => fetchCustomers(1), { deep: true })

watch(activeTab, async (newTab) => {
  router.push({ query: { tab: newTab } })
  pagination.value.page = 1
  await fetchCustomers(1)
})

// Initialize
onMounted(async () => {
  const api = useApi()
  try {
    const [usersResponse, groupsResponse, statusResponse] = await Promise.all([
      api('/users'),
      api('/user-group'),
      api('/statuses')
    ])

    if (usersResponse) {
      users.value = usersResponse
      usersResponse.forEach(u => (usersMap.value[u.id] = u))
    }

    if (groupsResponse) {
      userGroups.value = groupsResponse.data
    }

    if (statusResponse) {
      statusResponse.forEach(s => (statusMap.value[s.id] = s))
      statusOptions.value = statusResponse
        .filter(s => s.isActive !== false && s.isFirst === true)
        .map(s => ({ value: s.id, label: s.name }))
    }

    isEditable.value = authStore.user?.role !== 'doctor'
    isDeleteable.value = authStore.user?.role !== 'doctor'

    await fetchCustomers(1)
    await fetchStats()
  } catch (error) {
    console.error('Initialization failed:', error)
    loading.value = false
  }
})

useHead({ title: 'Havuz Verileri - Valdori CRM' })
</script>