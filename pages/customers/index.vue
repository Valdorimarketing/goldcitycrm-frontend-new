<template>
  <div class="min-h-screen">
    <!-- Header Section -->
    <div class="mb-8">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div class="flex items-center gap-3">
            <div
              class="p-2.5 bg-gradient-to-br from-violet-500 to-violet-500 rounded-xl shadow-lg shadow-violet-500/25">
              <UsersIcon class="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ t('customers.title', 'Müşteriler') }}
              </h1>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {{ t('customers.description', 'Tüm müşterilerinizi tek bir yerden yönetin') }}
              </p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap items-center gap-2">
          <button @click="showExportModal = true"
            class="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-sm font-medium">
            <ArrowDownTrayIcon class="h-5 w-5" />
            {{ t('customers.export', 'Dışa Aktar') }}
          </button>
          <button @click="loadCustomers(pagination.page)"
            class="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-sm font-medium">
            <ArrowPathIcon class="h-5 w-5" :class="{ 'animate-spin': loading }" />
            {{ t('dashboard.refresh', 'Yenile') }}
          </button>
          <button v-if="authStore.user?.role === 'admin'" @click="showCreateModal = true"
            class="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-400 to-violet-500 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all text-sm font-medium shadow-lg shadow-indigo-500/25">
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
              {{ t('dashboard.total', 'Toplam') }}
            </p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ pagination.total || 0 }}</p>
          </div>
          <div class="p-3 bg-violet-100 dark:bg-violet-900/30 rounded-xl">
            <UsersIcon class="h-6 w-6 text-violet-600 dark:text-violet-400" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {{ t('customers.stats.active_filter', 'Aktif Filtre') }}
            </p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ activeFilterCount }}</p>
          </div>
          <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
            <FunnelIcon class="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {{ t('customers.stats.page', 'Sayfa') }}
            </p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ pagination.page }} / {{
              pagination.totalPages || 1 }}</p>
          </div>
          <div class="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
            <DocumentDuplicateIcon class="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {{ t('customers.stats.shown', 'Gösterilen') }}
            </p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ customers.length }}</p>
          </div>
          <div class="p-3 bg-violet-100 dark:bg-violet-900/30 rounded-xl">
            <EyeIcon class="h-6 w-6 text-violet-600 dark:text-violet-400" />
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ SEGMENT FİLTRELEME KARTI - YENİ -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
        <div class="flex items-center gap-2">
          <TagIcon class="h-5 w-5 text-gray-400" />
          <span class="font-medium text-gray-700 dark:text-gray-300">
            {{ t('customers.segment_filter.title', 'Segment Filtresi') }}
          </span>
          <span v-if="selectedMainSegment || selectedSubSegment"
            class="px-2 py-0.5 text-xs font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full">
            Aktif
          </span>
        </div>
        <button v-if="selectedMainSegment || selectedSubSegment" @click="clearSegmentFilters"
          class="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium flex items-center gap-1">
          <XMarkIcon class="h-4 w-4" />
          Temizle
        </button>
      </div>

      <div class="p-5">
        <!-- Ana Segment Seçimi -->
        <div class="mb-4">
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">Ana Segmentler
          </p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button v-for="segment in mainSegments" :key="segment.id" @click="selectMainSegment(segment.id)" :class="[
              'relative p-4 rounded-xl border-2 transition-all text-left',
              selectedMainSegment === segment.id
                ? `${segment.activeClass} shadow-md`
                : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            ]">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div :class="[
                    'h-10 w-10 rounded-lg flex items-center justify-center',
                    selectedMainSegment === segment.id ? segment.iconBgActive : segment.iconBg
                  ]">
                    <component :is="segment.icon" class="h-5 w-5"
                      :class="selectedMainSegment === segment.id ? 'text-white' : segment.iconColor" />
                  </div>
                  <div>
                    <p class="font-semibold"
                      :class="selectedMainSegment === segment.id ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'">
                      {{ segment.name }}
                    </p>
                    <p class="text-xs"
                      :class="selectedMainSegment === segment.id ? 'text-gray-600 dark:text-gray-400' : 'text-gray-500 dark:text-gray-500'">
                      {{ segment.description }}
                    </p>
                  </div>
                </div>
                <div v-if="selectedMainSegment === segment.id"
                  class="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center">
                  <CheckIcon class="h-4 w-4 text-white" />
                </div>
              </div>

              <!-- Segment Sayısı Badge -->
              <div class="absolute top-2 right-2">
                <span :class="[
                  'px-2 py-0.5 text-xs font-bold rounded-full',
                  selectedMainSegment === segment.id ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                ]">
                  {{ getSegmentCount(segment.id) }}
                </span>
              </div>
            </button>
          </div>
        </div>

        <!-- Alt Segment Seçimi -->
        <Transition enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 -translate-y-2 max-h-0" enter-to-class="opacity-100 translate-y-0 max-h-96"
          leave-active-class="transition-all duration-200 ease-in" leave-from-class="opacity-100 translate-y-0 max-h-96"
          leave-to-class="opacity-0 -translate-y-2 max-h-0">
          <div v-if="selectedMainSegment && currentSubSegments.length > 0" class="overflow-hidden">
            <div class="pt-4 border-t border-gray-100 dark:border-gray-700">
              <div class="flex items-center gap-2 mb-3">
                <FolderIcon class="h-4 w-4 text-gray-400" />
                <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Alt Segmentler</span>
                <button v-if="selectedSubSegment" @click="selectedSubSegment = null; loadCustomers(1)"
                  class="ml-auto text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                  Temizle
                </button>
              </div>

              <div class="flex flex-wrap gap-2">
                <button v-for="subSeg in currentSubSegments" :key="subSeg.id" @click="selectSubSegment(subSeg.id)"
                  :class="[
                    'inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                    selectedSubSegment === subSeg.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  ]">
                  <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: subSeg.color || '#6b7280' }"></span>
                  {{ subSeg.name }}
                  <span :class="[
                    'px-1.5 py-0.5 text-xs rounded',
                    selectedSubSegment === subSeg.id ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-600'
                  ]">
                    {{ subSeg.remindingDay || subSeg.defaultRemindingDays }} gün
                  </span>
                </button>
              </div>
            </div>
          </div>
        </Transition>

        <!-- Seçili Segment Göstergesi -->
        <div v-if="selectedMainSegment || selectedSubSegment"
          class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">Seçili:</span>
            <span v-if="selectedMainSegment"
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400">
              <TagIcon class="h-3 w-3" />
              {{mainSegments.find(s => s.id === selectedMainSegment)?.name}}
              <button @click="clearSegmentFilters" class="ml-1 hover:opacity-70">×</button>
            </span>
            <span v-if="selectedSubSegment"
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400">
              <FolderIcon class="h-3 w-3" />
              {{currentSubSegments.find(s => s.id === selectedSubSegment)?.name}}
              <button @click="selectedSubSegment = null; loadCustomers(1)" class="ml-1 hover:opacity-70">×</button>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ ADVANCED FILTERS CARD -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
        <div class="flex items-center gap-2">
          <FunnelIcon class="h-5 w-5 text-gray-400" />
          <span class="font-medium text-gray-700 dark:text-gray-300">
            {{ t('customers.filters.title', 'Filtreler') }}
          </span>
          <span v-if="activeFilterCount > 0"
            class="px-2 py-0.5 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full">
            {{ tp('customers.filters.active_count', { count: activeFilterCount }, '{count} aktif') }}
          </span>
        </div>
        <button @click="resetFilters"
          class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors">
          <XMarkIcon class="h-4 w-4" />
          {{ t('customers.filters.clear', 'Temizle') }}
        </button>
      </div>

      <div class="p-5">
        <!-- ✅ Row 1: Search, Status, Source, Active Status -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <!-- Search -->
          <div>
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
              {{ t('customers.filters.search', 'Ara') }}
            </label>
            <div class="relative">
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input v-model="searchTerm" type="text"
                class="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                :placeholder="t('customers.filters.search_placeholder', 'ID, İsim, email veya telefon...')" />
            </div>
          </div>

          <!-- Status (Segment dışındaki durumlar) -->
          <div>
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
              {{ t('customers.filters.status', 'Durum') }}
            </label>
            <select v-model="statusFilter"
              class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none cursor-pointer">
              <option :value="undefined">{{ t('customers.filters.all_statuses', 'Tüm Durumlar') }}</option>
              <option v-for="status in nonSegmentStatusOptions" :key="status.value" :value="status.value">
                {{ status.label }}
              </option>
            </select>
          </div>

          <!-- Source -->
          <div v-if="isAdmin">
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
              {{ t('customers.filters.source', 'Kaynak') }}
            </label>

            <select v-model="sourceIdFilter"
              class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none cursor-pointer">
              <option value="">{{ t('customers.filters.select_source', 'Kaynak seçiniz') }}</option>
              <option v-for="source in sources" :key="source.id" :value="source.id">
                {{ source.name }}
              </option>
            </select>
          </div>

          <!-- ✅ User Filter (Admin) - MULTI SELECT -->
          <div v-if="authStore.user?.role === 'admin'">
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
              {{ t('customers.filters.assigned_user', 'Atanan Kullanıcı') }}
            </label>
            <Combobox v-model="relevantUserFilters" multiple>
              <div class="relative">
                <ComboboxInput
                  class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  @change="userQuery = $event.target.value" :placeholder="relevantUserFilters.length > 0
                    ? tp('customers.filters.users_selected', { count: relevantUserFilters.length }, '{count} kullanıcı seçili')
                    : t('customers.filters.select_user', 'Kullanıcı seçin...')" />
                <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-3">
                  <ChevronUpDownIcon class="h-5 w-5 text-gray-400" />
                </ComboboxButton>
                <Transition enter-active-class="transition duration-100 ease-out"
                  enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
                  leave-active-class="transition duration-75 ease-out"
                  leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
                  <ComboboxOptions
                    class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white dark:bg-gray-800 py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <!-- Clear All Option -->
                    <div v-if="relevantUserFilters.length > 0" @click="relevantUserFilters = []"
                      class="relative cursor-pointer select-none py-2.5 pl-4 pr-9 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border-b border-gray-100 dark:border-gray-700">
                      <span class="flex items-center gap-2">
                        <XMarkIcon class="h-4 w-4" />
                        {{ t('customers.filters.clear_selection', 'Seçimi Temizle') }}
                      </span>
                    </div>

                    <ComboboxOption v-for="user in filteredUsers" :key="user.id" :value="user"
                      v-slot="{ active, selected }" class="relative cursor-pointer select-none py-2.5 pl-4 pr-9"
                      :class="active ? 'bg-indigo-600 text-white' : 'text-gray-900 dark:text-gray-100'">
                      <span class="block truncate" :class="selected ? 'font-semibold' : 'font-normal'">
                        {{ user.name }}
                      </span>
                      <span v-if="selected" class="absolute inset-y-0 right-0 flex items-center pr-4"
                        :class="active ? 'text-white' : 'text-indigo-600'">
                        <CheckIcon class="h-5 w-5" />
                      </span>
                    </ComboboxOption>
                    <div v-if="filteredUsers.length === 0"
                      class="relative cursor-default select-none py-2.5 px-4 text-gray-500 dark:text-gray-400">
                      {{ t('customers.filters.no_user_found', 'Kullanıcı bulunamadı') }}
                    </div>
                  </ComboboxOptions>
                </Transition>
              </div>
            </Combobox>

            <!-- ✅ Selected Users Badges -->
            <div v-if="relevantUserFilters.length > 0" class="flex flex-wrap gap-1.5 mt-2">
              <span v-for="user in relevantUserFilters" :key="user.id"
                class="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                {{ user.name }}
                <button @click.stop="removeUserFilter(user)" class="hover:text-indigo-600 dark:hover:text-indigo-200">
                  <XMarkIcon class="h-3.5 w-3.5" />
                </button>
              </span>
            </div>
          </div>
          <div v-else></div>
        </div>

        <!-- ✅ Row 3: Date Filters -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Start Date -->
          <div>
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
              {{ t('customers.filters.start_date', 'Başlangıç Tarihi') }}
            </label>
            <input v-model="startDateFilter" type="date"
              class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
          </div>

          <!-- End Date -->
          <div>
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
              {{ t('customers.filters.end_date', 'Bitiş Tarihi') }}
            </label>
            <input v-model="endDateFilter" type="date"
              class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
          </div>

          <!-- Quick Date Filters -->
          <div class="lg:col-span-2">
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
              {{ t('customers.filters.quick_date', 'Hızlı Tarih Seçimi') }}
            </label>
            <div class="flex gap-2">
              <button @click="setQuickDateFilter('today')"
                class="flex-1 px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                {{ t('customers.filters.date.today', 'Bugün') }}
              </button>
              <button @click="setQuickDateFilter('week')"
                class="flex-1 px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                {{ t('customers.filters.date.week', 'Bu Hafta') }}
              </button>
              <button @click="setQuickDateFilter('month')"
                class="flex-1 px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                {{ t('customers.filters.date.month', 'Bu Ay') }}
              </button>
              <button @click="setQuickDateFilter('year')"
                class="flex-1 px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                {{ t('customers.filters.date.year', 'Bu Yıl') }}
              </button>
            </div>
          </div>
        </div>

        <!-- ✅ Active Filters Display -->
        <div v-if="hasActiveFilters" class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div class="flex flex-wrap gap-2">
            <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">
              {{ t('customers.filters.active_filters', 'Aktif Filtreler:') }}
            </span>

            <span v-if="searchTerm" class="filter-badge">
              {{ tp('customers.filters.badge.search', { value: searchTerm }, 'Arama: {value}') }}
              <button @click="searchTerm = ''" class="ml-1">×</button>
            </span>

            <span v-if="statusFilter" class="filter-badge">
              {{tp('customers.filters.badge.status', {
                value: statusOptions.find(s => s.value === statusFilter)?.label
              }, 'Durum: {value}')}}
              <button @click="statusFilter = undefined" class="ml-1">×</button>
            </span>

            <!-- Segment Filter Badges -->
            <span v-if="selectedMainSegment"
              class="filter-badge bg-violet-100 dark:bg-violet-900/20 text-violet-800 dark:text-violet-400">
              Segment: {{mainSegments.find(s => s.id === selectedMainSegment)?.name}}
              <button @click="clearSegmentFilters" class="ml-1">×</button>
            </span>

            <span v-if="selectedSubSegment"
              class="filter-badge bg-indigo-100 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-400">
              Alt Segment: {{currentSubSegments.find(s => s.id === selectedSubSegment)?.name}}
              <button @click="selectedSubSegment = null; loadCustomers(1)" class="ml-1">×</button>
            </span>

            <span v-if="sourceIdFilter" class="filter-badge">
              {{tp('customers.filters.badge.source', {
                value: sources.find(a => a.id == sourceIdFilter)?.name
              }, 'Kaynak: {value}')}}
              <button @click="sourceIdFilter = ''" class="ml-1">×</button>
            </span>

            <span v-if="relatedTransactionFilter" class="filter-badge">
              {{ tp('customers.filters.badge.topic', {
                value: relatedTransactionFilter
              }, 'Konu: {value}') }}
              <button @click="relatedTransactionFilter = ''" class="ml-1">×</button>
            </span>

            <span v-if="checkupPackageFilter" class="filter-badge">
              {{ tp('customers.filters.badge.checkup', {
                value: checkupPackageFilter
              }, 'Checkup: {value}') }}
              <button @click="checkupPackageFilter = ''" class="ml-1">×</button>
            </span>

            <!-- ✅ UPDATED: Multi-user filter badges -->
            <span v-if="relevantUserFilters.length > 0" class="filter-badge">
              {{tp('customers.filters.badge.assigned_multi', {
                count: relevantUserFilters.length,
                names: relevantUserFilters.map(u => u.name).join(', ')
              }, 'Atanan: {names}')}}
              <button @click="relevantUserFilters = []" class="ml-1">×</button>
            </span>

            <span v-if="startDateFilter" class="filter-badge">
              {{ tp('customers.filters.badge.start_date', {
                value: startDateFilter
              }, 'Başlangıç: {value}') }}
              <button @click="startDateFilter = ''" class="ml-1">×</button>
            </span>

            <span v-if="endDateFilter" class="filter-badge">
              {{ tp('customers.filters.badge.end_date', {
                value: endDateFilter
              }, 'Bitiş: {value}') }}
              <button @click="endDateFilter = ''" class="ml-1">×</button>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-16">
      <div class="relative">
        <div class="w-12 h-12 rounded-full border-4 border-indigo-100 dark:border-indigo-900"></div>
        <div
          class="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin">
        </div>
      </div>
      <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">
        {{ t('customers.loading', 'Müşteriler yükleniyor...') }}
      </p>
    </div>

    <!-- Table -->
    <div v-else
      class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <CustomerTable :isAdmin="isAdmin" :isUser="isUser" :data="customers" :users-map="usersMap"
          :status-map="statusMap" @sort="handleSort" :is-editable="isEditable" :is-deleteable="isDeleteable"
          @confirm-delete="confirmDelete" @show-history="showHistory" @show-notes="showNotes"
          @show-doctor="showDoctorAssignment" @show-services="showServices" @show-files="showFiles" />

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="px-4 py-4 border-t border-gray-100 dark:border-gray-700">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            <span class="font-medium">{{ ((pagination.page - 1) * pagination.limit) + 1 }}</span> -
            <span class="font-medium">{{ Math.min(pagination.page * pagination.limit, pagination.total) }}</span> / {{
              pagination.total }}
          </p>

          <div class="flex items-center gap-2">
            <button @click="changePage(pagination.page - 1)" :disabled="pagination.page === 1"
              class="p-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              <ChevronLeftIcon class="h-5 w-5" />
            </button>

            <div class="hidden sm:flex items-center gap-1">
              <template v-for="page in visiblePages" :key="page">
                <span v-if="page === '...'" class="px-2 text-gray-400">...</span>
                <button v-else @click="changePage(page)" :class="[
                  'min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-all',
                  pagination.page === page
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                ]">
                  {{ page }}
                </button>
              </template>
            </div>

            <span class="sm:hidden text-sm text-gray-500">
              {{ pagination.page }} / {{ pagination.totalPages }}
            </span>

            <button @click="changePage(pagination.page + 1)" :disabled="pagination.page >= pagination.totalPages"
              class="p-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              <ChevronRightIcon class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <CustomerExportModal ref="exportModalRef" :isopen="showExportModal" :filters="currentExportFilters"
      :total-filtered="pagination.total" :current-page-count="customers.length" @close="showExportModal = false"
      @export="handleExport" />

    <CustomerCreateModal :show="showCreateModal" @close="showCreateModal = false" @created="handleCustomerCreated" />
    <CustomerHistoryModal :show="showHistoryModal" :customer="selectedCustomer" @close="showHistoryModal = false" />
    <CustomerNotesModal :show="showNotesModal" :customer="selectedCustomer" @close="showNotesModal = false"
      @customer-updated="() => loadCustomers(pagination.page)" />
    <DoctorAssignmentModal :show="showDoctorModal" :customer="selectedCustomer" @close="showDoctorModal = false"
      @assigned="handleDoctorAssigned" />
    <CustomerServicesModal :show="showServicesModal" :customer="selectedCustomer" @close="showServicesModal = false"
      @saved="handleServicesSaved" />
    <CustomerFilesModal :show="showFilesModal" :customer="selectedCustomer" @close="showFilesModal = false" />

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <Transition enter-active-class="transition-all duration-300" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition-all duration-200" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="showDeleteModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div class="p-6 text-center">
              <div
                class="mx-auto w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                <ExclamationTriangleIcon class="h-7 w-7 text-red-600 dark:text-red-400" />
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {{ t('pool.delete.title', 'Müşteriyi Sil') }}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                <strong class="text-gray-700 dark:text-gray-300">{{ customerToDelete?.name }}</strong>
                {{ t('pool.delete.message', 'adlı müşteriyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')
                }}
              </p>
            </div>
            <div class="flex gap-3 px-6 pb-6">
              <button @click="showDeleteModal = false"
                class="flex-1 py-2.5 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                {{ t('pool.delete.cancel', 'İptal') }}
              </button>
              <button @click="handleDelete"
                class="flex-1 py-2.5 px-4 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all">
                {{ t('pool.delete.confirm', 'Sil') }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import {
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  CheckIcon,
  ChevronUpDownIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  UsersIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  TagIcon,
  FolderIcon,
  CheckCircleIcon,
  PhoneXMarkIcon,
  NoSymbolIcon
} from '@heroicons/vue/24/outline'
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption
} from '@headlessui/vue'
import { watchDebounced } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import CustomerTable from '~/components/CustomerTable.vue'
import CustomerExportModal from '~/components/CustomerExportModal.vue'
import { useLanguage } from '~/composables/useLanguage'
import { useSubSegments } from '~/composables/useSubSegments'

definePageMeta({})

const { t, tp } = useLanguage()

const isEditable = ref(true)
const isDeleteable = ref(true)
const authStore = useAuthStore()
const sources = ref([])
const api = useApi()

const { isAdmin, isUser, getCustomerFilters } = usePermissions()
const { subSegments, fetchSubSegments } = useSubSegments()

const customersStore = useCustomersStore()
const { customers: allCustomers, loading, pagination } = storeToRefs(customersStore)

const customers = computed(() => {
  return allCustomers.value.map(customer => {
    const relevantUserId = customer.relevantUserId || customer.relevant_user_id || customer.relevent_user || customer.relevantUser
    let relevantUserObj = null
    if (relevantUserId !== null && relevantUserId !== undefined) {
      relevantUserObj = typeof relevantUserId === 'object' ? relevantUserId : usersMap.value[relevantUserId]
    }
    return {
      ...customer,
      statusInfo: statusMap.value[customer.status],
      relevantUser: relevantUserObj
    }
  })
})

// ============================================================
// SEGMENT FİLTRELEME - YENİ
// ============================================================

const MAIN_SEGMENTS = {
  REACHED: 33,      // ULAŞILDI
  NOT_REACHED: 34,  // ULAŞILAMADI
  UNQUALIFIED: 35   // NİTELİKSİZ
}

const mainSegments = ref([
  {
    id: MAIN_SEGMENTS.REACHED,
    name: 'Ulaşıldı',
    description: 'İletişim kurulan müşteriler',
    icon: CheckCircleIcon,
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    iconBgActive: 'bg-green-500',
    iconColor: 'text-green-600 dark:text-green-400',
    activeClass: 'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border-green-400 dark:border-green-600',
  },
  {
    id: MAIN_SEGMENTS.NOT_REACHED,
    name: 'Ulaşılamadı',
    description: 'Henüz ulaşılamayan müşteriler',
    icon: PhoneXMarkIcon,
    iconBg: 'bg-red-100 dark:bg-red-900/30',
    iconBgActive: 'bg-red-500',
    iconColor: 'text-red-600 dark:text-red-400',
    activeClass: 'bg-gradient-to-br from-red-50 to-orange-100 dark:from-red-900/20 dark:to-orange-900/20 border-red-400 dark:border-red-600',
  },
  {
    id: MAIN_SEGMENTS.UNQUALIFIED,
    name: 'Niteliksiz',
    description: 'Niteliksiz olarak işaretlenen',
    icon: NoSymbolIcon,
    iconBg: 'bg-gray-100 dark:bg-gray-700',
    iconBgActive: 'bg-gray-500',
    iconColor: 'text-gray-600 dark:text-gray-400',
    activeClass: 'bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-800 dark:to-slate-800 border-gray-400 dark:border-gray-600',
  }
])

const selectedMainSegment = ref(null)
const selectedSubSegment = ref(null)
const segmentCounts = ref({})

// Seçili ana segmente göre alt segmentler
const currentSubSegments = computed(() => {
  if (!selectedMainSegment.value) return []
  return subSegments.value.filter(s => s.parentStatusId === selectedMainSegment.value && s.isActive).sort((a, b) => a.order - b.order)
})

// Segment sayısını getir
const getSegmentCount = (segmentId) => {
  return segmentCounts.value[segmentId] || 0
}

// Ana segment seç
const selectMainSegment = (segmentId) => {
  if (selectedMainSegment.value === segmentId) {
    selectedMainSegment.value = null
    selectedSubSegment.value = null
  } else {
    selectedMainSegment.value = segmentId
    selectedSubSegment.value = null
    // Normal status filtresini temizle
    statusFilter.value = undefined
  }
  pagination.value.page = 1
  loadCustomers(1)
}

// Alt segment seç
const selectSubSegment = (subSegmentId) => {
  if (selectedSubSegment.value === subSegmentId) {
    selectedSubSegment.value = null
  } else {
    selectedSubSegment.value = subSegmentId
  }
  pagination.value.page = 1
  loadCustomers(1)
}

// Segment filtrelerini temizle
const clearSegmentFilters = () => {
  selectedMainSegment.value = null
  selectedSubSegment.value = null
  pagination.value.page = 1
  loadCustomers(1)
}

// Segment sayılarını yükle
const loadSegmentCounts = async () => {
  try {
    const response = await api('/customers/segment-counts')
    if (response && typeof response === 'object') {
      segmentCounts.value = response
    }
  } catch (error) {
    console.error('Error loading segment counts:', error)
  }
}

// Segment dışındaki durumlar (status dropdown için)
const nonSegmentStatusOptions = computed(() => {
  const segmentIds = [MAIN_SEGMENTS.REACHED, MAIN_SEGMENTS.NOT_REACHED, MAIN_SEGMENTS.UNQUALIFIED]
  return statusOptions.value.filter(s => !segmentIds.includes(s.value))
})

// ============================================================
// FILTERS
// ============================================================
const users = ref([])
const searchTerm = ref('')
const statusFilter = ref(undefined)

// ✅ UPDATED: Changed to array for multi-select
const relevantUserFilters = ref([])

// ✅ NEW: Advanced filters 
const sourceIdFilter = ref(null);
const relatedTransactionFilter = ref('')
const checkupPackageFilter = ref('')
const startDateFilter = ref('')
const endDateFilter = ref('')

const statusOptions = ref([])
const statusMap = ref({})
const usersMap = ref({})
const userQuery = ref('')
const showExportModal = ref(false)
const exportModalRef = ref(null)
let isInitialLoad = true

// ============================================================
// COMPUTED
// ============================================================

// ✅ UPDATED: Active filter count with segment filters
const activeFilterCount = computed(() => {
  let count = 0
  if (searchTerm.value) count++
  if (statusFilter.value) count++
  if (selectedMainSegment.value) count++
  if (selectedSubSegment.value) count++
  if (relevantUserFilters.value.length > 0) count++
  if (sourceIdFilter.value) count++
  if (relatedTransactionFilter.value) count++
  if (checkupPackageFilter.value) count++
  if (startDateFilter.value) count++
  if (endDateFilter.value) count++
  return count
})

const hasActiveFilters = computed(() => activeFilterCount.value > 0)

// ✅ UPDATED: Export filters with segment support
const currentExportFilters = computed(() => {
  const filters = {}
  if (searchTerm.value) filters.search = searchTerm.value
  if (statusFilter.value) {
    filters.status = statusFilter.value
    const statusInfo = statusOptions.value.find(s => s.value === statusFilter.value)
    if (statusInfo) filters.statusName = statusInfo.label
  }

  // Segment filters
  if (selectedMainSegment.value) {
    filters.status = selectedMainSegment.value
    filters.segmentName = mainSegments.value.find(s => s.id === selectedMainSegment.value)?.name
  }
  if (selectedSubSegment.value) {
    filters.subSegmentId = selectedSubSegment.value
  }

  // ✅ UPDATED: Multi-user filter
  if (relevantUserFilters.value.length > 0) {
    filters.relevantUsers = relevantUserFilters.value.map(u => u.id)
    filters.userNames = relevantUserFilters.value.map(u => u.name).join(', ')
  }

  // ✅ NEW: Advanced filters
  if (sourceIdFilter.value) filters.source = sourceIdFilter.value
  if (relatedTransactionFilter.value) filters.relatedTransaction = relatedTransactionFilter.value
  if (checkupPackageFilter.value) filters.checkupPackage = checkupPackageFilter.value
  if (startDateFilter.value) filters.startDate = startDateFilter.value
  if (endDateFilter.value) filters.endDate = endDateFilter.value
  return filters
})

const usersList = computed(() => {
  return Object.values(usersMap.value).map(user => ({
    id: user.id,
    name: `${user.name || ''} ${user.surname || ''}`.trim(),
    email: user.email
  }))
})

const filteredUsers = computed(() => {
  if (userQuery.value === '') return usersList.value
  return usersList.value.filter(user =>
    user.name.toLowerCase().includes(userQuery.value.toLowerCase()) ||
    (user.email && user.email.toLowerCase().includes(userQuery.value.toLowerCase()))
  )
})

const visiblePages = computed(() => {
  const pages = []
  const total = pagination.value.totalPages
  const current = pagination.value.page

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    if (current <= 4) pages.push(1, 2, 3, 4, 5, '...', total)
    else if (current >= total - 3) pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total)
    else pages.push(1, '...', current - 1, current, current + 1, '...', total)
  }

  return pages
})

// ============================================================
// HELPER FUNCTIONS
// ============================================================

// ✅ NEW: Remove single user from filter
const removeUserFilter = (userToRemove) => {
  relevantUserFilters.value = relevantUserFilters.value.filter(u => u.id !== userToRemove.id)
}

// ✅ NEW: Quick date filter function
const setQuickDateFilter = (period) => {
  const today = new Date()
  const startOfDay = new Date(today.setHours(0, 0, 0, 0))

  switch (period) {
    case 'today':
      startDateFilter.value = formatDateForInput(startOfDay)
      endDateFilter.value = formatDateForInput(new Date())
      break

    case 'week':
      const startOfWeek = new Date(startOfDay)
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1)
      startDateFilter.value = formatDateForInput(startOfWeek)
      endDateFilter.value = formatDateForInput(new Date())
      break

    case 'month':
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      startDateFilter.value = formatDateForInput(startOfMonth)
      endDateFilter.value = formatDateForInput(new Date())
      break

    case 'year':
      const startOfYear = new Date(today.getFullYear(), 0, 1)
      startDateFilter.value = formatDateForInput(startOfYear)
      endDateFilter.value = formatDateForInput(new Date())
      break
  }
}

const formatDateForInput = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// ============================================================
// LOCALSTORAGE
// ============================================================

const STORAGE_KEY = 'customerFilters_v2'

// ✅ UPDATED: Load all filters from storage with segment support
const loadFiltersFromStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) {
      pagination.value.page = 1
      return
    }
    const parsed = JSON.parse(saved)

    // Basic filters
    if (parsed.searchTerm) searchTerm.value = parsed.searchTerm
    if (parsed.statusFilter) statusFilter.value = parsed.statusFilter

    // Segment filters
    if (parsed.selectedMainSegment) selectedMainSegment.value = parsed.selectedMainSegment
    if (parsed.selectedSubSegment) selectedSubSegment.value = parsed.selectedSubSegment

    // ✅ UPDATED: Multi-user filter support (backwards compatible)
    if (parsed.relevantUserFilters && Array.isArray(parsed.relevantUserFilters)) {
      relevantUserFilters.value = parsed.relevantUserFilters
    } else if (parsed.relevantUserFilter) {
      // Backwards compatibility: convert single user to array
      relevantUserFilters.value = [parsed.relevantUserFilter]
    }

    // ✅ NEW: Advanced filters
    if (parsed.sourceIdFilter) sourceIdFilter.value = parsed.sourceIdFilter
    if (parsed.relatedTransactionFilter) relatedTransactionFilter.value = parsed.relatedTransactionFilter
    if (parsed.checkupPackageFilter) checkupPackageFilter.value = parsed.checkupPackageFilter
    if (parsed.startDateFilter) startDateFilter.value = parsed.startDateFilter
    if (parsed.endDateFilter) endDateFilter.value = parsed.endDateFilter

    pagination.value.page = parsed.page && parsed.page > 0 ? parsed.page : 1
  } catch (err) {
    console.warn('Filtreler yüklenemedi:', err)
    pagination.value.page = 1
  }
}

// ✅ UPDATED: Save all filters to storage with segment support
const saveFiltersToStorage = () => {
  const data = {
    searchTerm: searchTerm.value,
    statusFilter: statusFilter.value,
    selectedMainSegment: selectedMainSegment.value,
    selectedSubSegment: selectedSubSegment.value,
    relevantUserFilters: relevantUserFilters.value,
    // ✅ NEW: Advanced filters
    sourceIdFilter: sourceIdFilter.value,
    relatedTransactionFilter: relatedTransactionFilter.value,
    checkupPackageFilter: checkupPackageFilter.value,
    startDateFilter: startDateFilter.value,
    endDateFilter: endDateFilter.value,
    page: pagination.value.page
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

// ============================================================
// MAIN FUNCTIONS
// ============================================================

// ✅ UPDATED: Load customers with segment filters
const loadCustomers = async (page = 1) => {
  const filters = getCustomerFilters()
  const customFilters = { ...filters }

  // Segment filtresi
  if (selectedMainSegment.value) {
    customFilters.status = selectedMainSegment.value
  } else if (statusFilter.value) {
    customFilters.status = statusFilter.value
  }

  // Alt segment filtresi
  if (selectedSubSegment.value) {
    customFilters.subSegmentId = selectedSubSegment.value
  }

  // ✅ UPDATED: Admin multi-user filter
  if (authStore.user?.role === 'admin' && relevantUserFilters.value.length > 0) {
    customFilters.relevantUsers = relevantUserFilters.value.map(u => u.id).join(',')
  }

  // ✅ NEW: Add all advanced filters to request
  if (sourceIdFilter.value) customFilters.source = sourceIdFilter.value
  if (relatedTransactionFilter.value) customFilters.relatedTransaction = relatedTransactionFilter.value
  if (checkupPackageFilter.value) customFilters.checkupPackage = checkupPackageFilter.value
  if (startDateFilter.value) customFilters.startDate = startDateFilter.value
  if (endDateFilter.value) customFilters.endDate = endDateFilter.value

  await customersStore.fetchCustomers({
    page,
    search: searchTerm.value || undefined,
    ...customFilters,
  })

  saveFiltersToStorage()
}

// ✅ UPDATED: Reset all filters including segments
const resetFilters = () => {
  searchTerm.value = ''
  statusFilter.value = undefined
  selectedMainSegment.value = null
  selectedSubSegment.value = null
  relevantUserFilters.value = []
  userQuery.value = ''
  // ✅ NEW: Reset advanced filters
  sourceIdFilter.value = ''
  relatedTransactionFilter.value = ''
  checkupPackageFilter.value = ''
  startDateFilter.value = ''
  endDateFilter.value = ''
  pagination.value.page = 1
  loadCustomers(1)
}

const changePage = async (page) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    pagination.value.page = page
    await loadCustomers(page)
    saveFiltersToStorage()
  }
}

// ✅ UPDATED: Export with all filters including segments
const handleExport = async ({ format, columns, scope }) => {
  const baseFilters = getCustomerFilters()
  const exportFilters = {
    ...baseFilters,
    format,
    columns: columns.join(','),
  }

  // Basic filters
  if (searchTerm.value) exportFilters.search = searchTerm.value

  // Segment filters
  if (selectedMainSegment.value) {
    exportFilters.status = selectedMainSegment.value
  } else if (statusFilter.value) {
    exportFilters.status = statusFilter.value
  }

  if (selectedSubSegment.value) {
    exportFilters.subSegmentId = selectedSubSegment.value
  }

  // ✅ UPDATED: Multi-user filter for export
  if (authStore.user?.role === 'admin' && relevantUserFilters.value.length > 0) {
    exportFilters.relevantUsers = relevantUserFilters.value.map(u => u.id).join(',')
  }

  // ✅ NEW: Add all advanced filters to export
  if (sourceIdFilter.value) exportFilters.source = sourceIdFilter.value
  if (relatedTransactionFilter.value) exportFilters.relatedTransaction = relatedTransactionFilter.value
  if (checkupPackageFilter.value) exportFilters.checkupPackage = checkupPackageFilter.value
  if (startDateFilter.value) exportFilters.startDate = startDateFilter.value
  if (endDateFilter.value) exportFilters.endDate = endDateFilter.value

  if (scope === 'currentPage') {
    exportFilters.page = pagination.value.page
    exportFilters.limit = pagination.value.limit
  } else {
    exportFilters.exportAll = true
  }

  try {
    const response = await customersStore.exportCustomers(exportFilters)
    const mimeType = format === 'excel'
      ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      : 'text/csv; charset=utf-8'

    const blob = new Blob([response], { type: mimeType })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    const scopeText = scope === 'currentPage' ? `page${pagination.value.page}` : 'all'
    link.setAttribute('download', `customers_${scopeText}_${new Date().getTime()}.${format === 'excel' ? 'xlsx' : 'csv'}`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    if (exportModalRef.value) exportModalRef.value.resetExporting()
    showExportModal.value = false
    useToast().showSuccess(t('customers.export_success', 'Müşteriler başarıyla dışa aktarıldı'))
  } catch (error) {
    console.error('Error exporting customers:', error)
    if (exportModalRef.value) exportModalRef.value.resetExporting()
    useToast().showError(t('customers.export_error', 'Müşteriler dışa aktarılırken bir hata oluştu'))
  }
}

// ============================================================
// MODALS
// ============================================================

const showDeleteModal = ref(false)
const customerToDelete = ref(null)
const showCreateModal = ref(false)
const showHistoryModal = ref(false)
const showNotesModal = ref(false)
const showDoctorModal = ref(false)
const showServicesModal = ref(false)
const showFilesModal = ref(false)
const selectedCustomer = ref(null)

const confirmDelete = (customer) => {
  customerToDelete.value = customer
  showDeleteModal.value = true
}

const showHistory = (customer) => {
  selectedCustomer.value = customer
  showHistoryModal.value = true
}

const showNotes = (customer) => {
  selectedCustomer.value = customer
  showNotesModal.value = true
}

const showDoctorAssignment = (customer) => {
  selectedCustomer.value = customer
  showDoctorModal.value = true
}

const handleDoctorAssigned = () => { }

const showServices = (customer) => {
  selectedCustomer.value = customer
  showServicesModal.value = true
}

const handleServicesSaved = () => {
  showServicesModal.value = false
}

const showFiles = (customer) => {
  selectedCustomer.value = customer
  showFilesModal.value = true
}

const handleDelete = async () => {
  if (customerToDelete.value) {
    try {
      await customersStore.deleteCustomer(customerToDelete.value.id)
      await loadCustomers(pagination.value.page)
      useToast().showSuccess(t('customers.delete_success', 'Müşteri başarıyla silindi'))
    } catch (error) {
      console.error('Error deleting customer:', error)
      useToast().showError(t('customers.delete_error', 'Müşteri silinirken bir hata oluştu'))
    }
  }
  showDeleteModal.value = false
  customerToDelete.value = null
}

const handleCustomerCreated = async () => {
  await loadCustomers(pagination.value.page)
  useToast().showSuccess(t('customers.create_success', 'Müşteri başarıyla oluşturuldu'))
}

const handleSort = () => {
  // Sort handling
}

// ============================================================
// WATCHERS
// ============================================================

// ✅ UPDATED: Watch ALL filters (excluding segment filters - they trigger loadCustomers directly)
watchDebounced(
  [
    searchTerm,
    statusFilter,
    relevantUserFilters,
    sourceIdFilter,
    relatedTransactionFilter,
    checkupPackageFilter,
    startDateFilter,
    endDateFilter
  ],
  () => {
    if (isInitialLoad) return
    loadCustomers(1)
  },
  { debounce: 500, deep: true }
)

// ============================================================
// LIFECYCLE
// ============================================================

onMounted(async () => {
  // Sub-segments yükle
  await fetchSubSegments()

  loadFiltersFromStorage()

  try {
    const sourceReponse = await api('/sources')
    sources.value = sourceReponse.data
  } catch (error) {
    console.error('Failed to load sources:', error)
  }

  try {
    const usersResponse = await api('/users')
    if (Array.isArray(usersResponse)) {
      users.value = usersResponse
      usersResponse.forEach(user => usersMap.value[user.id] = user)
    }
  } catch (usersError) {
    console.error('Failed to load users:', usersError)
  }

  try {
    const statusResponse = await api('/statuses')
    if (Array.isArray(statusResponse)) {
      statusResponse.forEach(status => {
        statusMap.value[status.id] = {
          ...status,
          isDoctor: status.isDoctor ?? status.is_doctor ?? false,
          isPricing: status.isPricing ?? status.is_pricing ?? false,
          isRemindable: status.isRemindable ?? status.is_remindable ?? false,
          isFirst: status.isFirst ?? status.is_first ?? false,
          isClosed: status.isClosed ?? status.is_closed ?? false,
          isSale: status.isSale ?? status.is_sale ?? false
        }
      })
      statusOptions.value = statusResponse
        .filter(status => status.isActive !== false)
        .map(status => ({ value: status.id, label: status.name }))
    }
  } catch (statusError) {
    console.error('Failed to load statuses:', statusError)
  }

  isEditable.value = authStore.user?.role !== 'doctor'
  isDeleteable.value = authStore.user?.role == 'admin'

  // Segment sayılarını yükle
  await loadSegmentCounts()

  await loadCustomers(pagination.value.page)
  isInitialLoad = false
})

useHead({ title: 'Müşteriler - Valdori CRM' })
</script>

<style scoped>
.filter-badge {
  @apply inline-flex relative items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400;
}

.filter-badge button {
  @apply ml-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 font-bold;
}
</style>