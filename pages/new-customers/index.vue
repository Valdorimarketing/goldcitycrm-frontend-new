<template>
  <div class="min-h-screen">
    <!-- Header Section -->
    <div class="mb-8">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/25">
            <UserPlusIcon class="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Yeni Kişiler</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Yeni durumundaki kişileri görüntüleyin ve yönetin
            </p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-3">
          <button @click="fetchData"
            class="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-sm font-medium">
            <ArrowPathIcon class="h-5 w-5" :class="{ 'animate-spin': loading }" />
            Yenile
          </button>
          <button v-if="authStore.user?.role !== 'user'" @click="showCreateModal = true"
            class="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all text-sm font-medium shadow-lg shadow-blue-500/25">
            <PlusIcon class="h-5 w-5" />
            Yeni Müşteri
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div
        class="group bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Toplam</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ customersData.length }}</p>
          </div>
          <div
            class="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
            <UsersIcon class="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div class="h-1 w-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-4 opacity-60"></div>
      </div>

      <div
        class="group bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Aktif</p>
            <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{{ activeCount }}</p>
          </div>
          <div
            class="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
            <CheckCircleIcon class="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
        <div class="h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mt-4 opacity-60"></div>
      </div>

      <div
        class="group bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Bugün Eklenen</p>
            <p class="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{{ todayCount }}</p>
          </div>
          <div
            class="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
            <CalendarIcon class="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <div class="h-1 w-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-4 opacity-60"></div>
      </div>

      <div
        class="group bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Filtre Sonucu</p>
            <p class="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mt-1">{{ filteredCustomers.length }}</p>
          </div>
          <div
            class="h-12 w-12 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FunnelIcon class="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
          </div>
        </div>
        <div class="h-1 w-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mt-4 opacity-60"></div>
      </div>
    </div>

    <!-- Filters Card -->
    <div
      class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6 overflow-hidden">
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
        <div class="flex items-center gap-2">
          <FunnelIcon class="h-5 w-5 text-gray-400" />
          <span class="font-medium text-gray-700 dark:text-gray-300">Filtreler</span>
        </div>
        <button v-if="searchTerm || statusFilter" @click="resetFilters"
          class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium">
          Temizle
        </button>
      </div>

      <div class="p-5">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Search -->
          <div class="lg:col-span-2">
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
              Ara
            </label>
            <div class="relative">
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input v-model="searchTerm" type="text"
                class="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="İsim, email, telefon veya kaynak..." />
            </div>
          </div>

          <!-- Status Filter -->
          <div>
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
              Durum
            </label>
            <select v-model="statusFilter"
              class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer">
              <option value="">Tüm Durumlar</option>
              <option v-for="status in statusOptions" :key="status.value" :value="status.value">
                {{ status.label }}
              </option>
            </select>
          </div>

          <!-- Reset Button -->
          <div class="flex items-end">
            <button @click="resetFilters"
              class="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all text-sm font-medium">
              Filtreleri Temizle
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-16">
      <div class="relative">
        <div class="w-14 h-14 rounded-full border-4 border-blue-100 dark:border-blue-900"></div>
        <div
          class="absolute top-0 left-0 w-14 h-14 rounded-full border-4 border-transparent border-t-blue-600 animate-spin">
        </div>
      </div>
      <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">Yükleniyor...</p>
    </div>

    <!-- Customers Table -->
    <div v-else
      class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <!-- Table Header -->
      <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UsersIcon class="h-5 w-5 text-gray-400" />
            <span class="font-medium text-gray-700 dark:text-gray-300">Kişi Listesi</span>
            <span
              class="px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
              {{ filteredCustomers.length }}
            </span>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="bg-gray-50 dark:bg-gray-900/50">
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Kişi
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Durum
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                İletişim
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Kaynak
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Atanan
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Tarih
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
            <tr v-for="customer in filteredCustomers" :key="customer.id"
              class="group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <!-- Customer Info -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="relative">
                    <div
                      class="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                      <span class="text-sm font-bold text-white">
                        {{ customer.name?.charAt(0)?.toUpperCase() || '?' }}
                      </span>
                    </div>
                    <!-- Active indicator -->
                    <div :class="[
                      'absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-800',
                      customer.isActive ? 'bg-emerald-500' : 'bg-gray-400'
                    ]"></div>
                  </div>
                  <div>
                    <NuxtLink :to="`/customers/show/${customer.id}`"
                      class="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {{ customer.name }}
                    </NuxtLink>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      ID: {{ customer.id }}
                    </p>
                  </div>
                </div>
              </td>

              <!-- Status -->
              <td class="px-6 py-4">
                <StatusBadge :name="customer.statusData?.name" :color="customer.statusData?.color" />
              </td>

              <!-- Contact -->
              <td class="px-6 py-4">
                <div class="space-y-1">
                  <div v-if="customer.phone" class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <PhoneIcon class="h-4 w-4 text-gray-400" />
                    <div class="space-y-1">
                      <p class="text-sm text-gray-600 dark:text-gray-300">{{ customer.email || '-' }}</p>
                      <p v-if="customer.phone" class="text-xs text-gray-500 dark:text-gray-400">
                        <template v-if="isAdmin">{{ customer.phone }}</template>
                        <template v-else>{{ customer.phone.substring(0, 5) }}****</template>
                      </p>
                    </div>
                  </div>
                  <span v-if="!customer.email && !customer.phone" class="text-sm text-gray-400">-</span>
                </div>
              </td>

              <!-- Source -->
              <td class="px-6 py-4">
                <span v-if="customer.source && customer.source !== '-'"
                  class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  {{ customer.source }}
                </span>
                <span v-else class="text-sm text-gray-400">-</span>
              </td>

              <!-- Assigned User -->
              <td class="px-6 py-4">
                <div v-if="customer.relevantUser" class="flex items-center gap-2">
                  <img v-if="customer.relevantUser?.avatar" :src="path + customer.relevantUser?.avatar" alt="Avatar"
                    class="object-cover h-7 w-7 rounded-lg" />
                  <div v-else
                    class="h-7 w-7 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <span class="text-xs font-medium text-purple-600 dark:text-purple-400">
                      {{ customer.relevantUser?.name?.charAt(0)?.toUpperCase() }}
                    </span>
                  </div>
                  <span class="text-sm text-gray-600 dark:text-gray-300">
                    {{ customer.relevantUser?.name }}
                  </span>
                </div>
                <span v-else class="text-sm text-gray-400">-</span>
              </td>

              <!-- Date -->
              <td class="px-6 py-4">
                <div class="text-sm text-gray-600 dark:text-gray-300">
                  {{ formatDate(customer.createdAt) }}
                </div>
                <div class="text-xs text-gray-400 mt-0.5">
                  {{ formatTime(customer.createdAt) }}
                </div>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4">
                <div class="flex items-center justify-center">
                  <button @click="toggleShow(customer.id)"
                    class="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-all">
                    <EllipsisHorizontalIcon class="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="filteredCustomers.length === 0">
              <td colspan="7" class="px-6 py-16 text-center">
                <div class="flex flex-col items-center">
                  <div class="h-16 w-16 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                    <UserPlusIcon class="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {{ searchTerm || statusFilter ? 'Sonuç bulunamadı' : 'Yeni kişi yok' }}
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                    {{ searchTerm || statusFilter ? 'Arama kriterlerinize uygun kişi bulunamadı.' : 'Henüz yeni durumunda kişi bulunmuyor.' }}
                  </p>
                  <button v-if="authStore.user?.role !== 'user'" @click="showCreateModal = true"
                    class="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-sm font-medium">
                    <PlusIcon class="h-4 w-4" />
                    Yeni Müşteri Ekle
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="px-6 py-4 border-t border-gray-100 dark:border-gray-700">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            <span class="font-medium text-gray-700 dark:text-gray-300">{{ ((pagination.page - 1) * pagination.limit) + 1
              }}</span>
            -
            <span class="font-medium text-gray-700 dark:text-gray-300">{{ Math.min(pagination.page * pagination.limit,
              pagination.total) }}</span>
            arası, toplam
            <span class="font-medium text-gray-700 dark:text-gray-300">{{ pagination.total }}</span>
            kayıt
          </p>

          <div class="flex items-center gap-2">
            <button @click="changePage(pagination.page - 1)" :disabled="pagination.page === 1"
              class="p-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              <ChevronLeftIcon class="h-5 w-5" />
            </button>

            <div class="flex items-center gap-1">
              <button v-for="page in visiblePages" :key="page" @click="changePage(page)" :class="[
                'min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-all',
                pagination.page === page
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              ]">
                {{ page }}
              </button>
            </div>

            <button @click="changePage(pagination.page + 1)" :disabled="pagination.page >= pagination.totalPages"
              class="p-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              <ChevronRightIcon class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions Modal -->
    <Teleport to="body">
      <Transition enter-active-class="transition-all duration-300" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition-all duration-200" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="showStates.activeId"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          @click.self="showStates.activeId = null">
          <Transition enter-active-class="transition-all duration-300" enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100" leave-active-class="transition-all duration-200"
            leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
            <div v-if="showStates.activeId"
              class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <!-- Modal Header -->
              <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                <div class="flex items-center gap-3">
                  <div
                    class="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span class="text-sm font-bold text-white">
                      {{ getActiveCustomer?.name?.charAt(0)?.toUpperCase() }}
                    </span>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white">{{ getActiveCustomer?.name }}</h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400">İşlem seçin</p>
                  </div>
                </div>
                <button @click="showStates.activeId = null"
                  class="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                  <XMarkIcon class="h-5 w-5" />
                </button>
              </div>

              <!-- Actions Grid -->
              <div class="p-4 grid grid-cols-3 gap-3">
                <NuxtLink :to="`/customers/show/${showStates.activeId}`"
                  class="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all group">
                  <div
                    class="h-12 w-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <EyeIcon class="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span class="text-xs font-medium text-gray-700 dark:text-gray-300">Görüntüle</span>
                </NuxtLink>

                <button @click="showHistory(getActiveCustomer)"
                  class="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all group">
                  <div
                    class="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ClockIcon class="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span class="text-xs font-medium text-gray-700 dark:text-gray-300">Geçmiş</span>
                </button>

                <button @click="showNotes(getActiveCustomer)"
                  class="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all group">
                  <div
                    class="h-12 w-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <DocumentTextIcon class="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <span class="text-xs font-medium text-gray-700 dark:text-gray-300">Notlar</span>
                </button>

                <button @click="showDoctorAssignment(getActiveCustomer)"
                  class="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all group">
                  <div
                    class="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UsersIcon class="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span class="text-xs font-medium text-gray-700 dark:text-gray-300">Doktor</span>
                </button>

                <button @click="showServices(getActiveCustomer)"
                  class="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all group">
                  <div
                    class="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ShoppingBagIcon class="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span class="text-xs font-medium text-gray-700 dark:text-gray-300">Hizmetler</span>
                </button>

                <button @click="showFiles(getActiveCustomer)"
                  class="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all group">
                  <div
                    class="h-12 w-12 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FolderIcon class="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <span class="text-xs font-medium text-gray-700 dark:text-gray-300">Dosyalar</span>
                </button>

                <NuxtLink v-if="isEditable" :to="`/customers/edit/${showStates.activeId}`"
                  class="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all group">
                  <div
                    class="h-12 w-12 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PencilIcon class="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <span class="text-xs font-medium text-gray-700 dark:text-gray-300">Düzenle</span>
                </NuxtLink>

                <button v-if="isDeleteable" @click="confirmDelete(getActiveCustomer)"
                  class="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group">
                  <div
                    class="h-12 w-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <TrashIcon class="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <span class="text-xs font-medium text-red-600 dark:text-red-400">Sil</span>
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <Transition enter-active-class="transition-all duration-300" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition-all duration-200" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="showDeleteModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Transition enter-active-class="transition-all duration-300" enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100" leave-active-class="transition-all duration-200"
            leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
            <div v-if="showDeleteModal"
              class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div class="p-6 text-center">
                <div
                  class="mx-auto w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                  <ExclamationTriangleIcon class="h-7 w-7 text-red-600 dark:text-red-400" />
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Kişiyi Sil
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <strong class="text-gray-700 dark:text-gray-300">{{ customerToDelete?.name }}</strong> adlı kişiyi
                  silmek
                  istediğinize emin misiniz?
                </p>
                <p class="text-xs text-red-600 dark:text-red-400">
                  Bu işlem geri alınamaz.
                </p>
              </div>
              <div class="flex gap-3 px-6 pb-6">
                <button @click="showDeleteModal = false"
                  class="flex-1 py-2.5 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                  İptal
                </button>
                <button @click="handleDelete"
                  class="flex-1 py-2.5 px-4 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all">
                  Sil
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>

    <!-- Customer Create Modal -->
    <CustomerCreateModal :show="showCreateModal" @close="showCreateModal = false" @created="handleCustomerCreated" />

    <!-- Customer History Modal -->
    <CustomerHistoryModal :show="showHistoryModal" :customer="selectedCustomer" @close="showHistoryModal = false" />

    <!-- Customer Notes Modal -->
    <CustomerNotesModal :show="showNotesModal" :customer="selectedCustomer" @close="showNotesModal = false"
      @customer-updated="() => fetchData()" />

    <!-- Doctor Assignment Modal -->
    <DoctorAssignmentModal :show="showDoctorModal" :customer="selectedCustomer" @close="showDoctorModal = false"
      @assigned="handleDoctorAssigned" />

    <!-- Customer Services Modal -->
    <CustomerServicesModal :show="showServicesModal" :customer="selectedCustomer" @close="showServicesModal = false"
      @saved="handleServicesSaved" />

    <!-- Customer Files Modal -->
    <CustomerFilesModal :show="showFilesModal" :customer="selectedCustomer" @close="showFilesModal = false" />
  </div>
</template>

<script setup>
import {
  PlusIcon,
  UsersIcon,
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
  XMarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  UserPlusIcon,
  CheckCircleIcon,
  CalendarIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  // middleware: 'auth'
})

const authStore = useAuthStore()

const loading = ref(true)
const pagination = ref({
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0
})

const customersData = ref([])
const showStates = ref({ activeId: null })

// Search and filters
const searchTerm = ref('')
const statusFilter = ref('')
const statusOptions = ref([])
const statusMap = ref({})
const usersMap = ref({})

// Users
const users = ref([])

// Modals
const showDeleteModal = ref(false)
const customerToDelete = ref(null)
const showCreateModal = ref(false)
const showHistoryModal = ref(false)
const showNotesModal = ref(false)
const showDoctorModal = ref(false)
const showServicesModal = ref(false)
const showFilesModal = ref(false)
const selectedCustomer = ref(null)

const isEditable = ref(true)
const isDeleteable = ref(true)

// Computed
const activeCount = computed(() => customersData.value.filter(c => c.isActive).length)

const todayCount = computed(() => {
  const today = new Date().toDateString()
  return customersData.value.filter(c =>
    new Date(c.createdAt).toDateString() === today
  ).length
})

const getActiveCustomer = computed(() => {
  return customersData.value.find(c => c.id === showStates.value.activeId)
})

const filteredCustomers = computed(() => {
  let filtered = customersData.value

  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(customer =>
      customer.name?.toLowerCase().includes(search) ||
      customer.email?.toLowerCase().includes(search) ||
      customer.phone?.toLowerCase().includes(search) ||
      customer.source?.toLowerCase().includes(search)
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(customer => customer.status === statusFilter.value)
  }

  return filtered
})

const visiblePages = computed(() => {
  const pages = []
  const total = pagination.value.totalPages
  const current = pagination.value.page

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
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

// Methods
const toggleShow = (id) => {
  showStates.value.activeId = showStates.value.activeId === id ? null : id
}

const resetFilters = () => {
  searchTerm.value = ''
  statusFilter.value = ''
}

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    fetchData(page)
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const formatTime = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit'
  })
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
  // Refresh if needed
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
      const customerId = customerToDelete.value.id
      customersData.value = customersData.value.filter(c => c.id !== customerId)
      await api(`/customers/${customerId}`, { method: 'DELETE' })
    } catch (error) {
      console.error('Error deleting customer:', error)
    }
  }
  showDeleteModal.value = false
  customerToDelete.value = null
}

const handleCustomerCreated = (customer) => {
  customersData.value.unshift({
    ...customer,
    name: `${customer.name || ''} ${customer.surname || ''}`.trim() || 'İsimsiz',
    status: customer.status || 'new',
    source: customer.source || '-',
    isActive: customer.isActive !== undefined ? customer.isActive : true
  })
}

const fetchData = async (page = 1) => {
  loading.value = true
  try {
    const api = useApi()
    const { getCustomerFilters, canAccessCustomer } = usePermissions()

    // Load users
    try {
      const usersResponse = await api('/users')
      if (Array.isArray(usersResponse)) {
        users.value = usersResponse
        usersResponse.forEach(user => {
          usersMap.value[user.id] = user
        })
      }
    } catch (usersError) {
      console.error('Failed to load users:', usersError)
    }

    isEditable.value = authStore.user?.role !== 'doctor'
    isDeleteable.value = authStore.user?.role !== 'doctor'

    // Load statuses
    try {
      const statusResponse = await api('/statuses')
      if (Array.isArray(statusResponse)) {
        statusResponse.forEach(status => {
          statusMap.value[status.id] = status
        })
        statusOptions.value = statusResponse
          .filter(status => status.isActive !== false && status.isFirst === true)
          .map(status => ({
            value: status.id,
            label: status.name
          }))
      }
    } catch (statusError) {
      console.error('Failed to load statuses:', statusError)
    }

    // Load customers
    const filters = getCustomerFilters()
    const response = await api('/customers', {
      query: {
        ...filters,
        isFirst: true,
        page,
        limit: pagination.value.limit
      }
    })

    const customersArray = Array.isArray(response) ? response : (response.data || [])

    customersData.value = customersArray.map(customer => {
      const userId = customer.userId || customer.user_id || customer.user
      const relevantUserId = customer.relevantUserId || customer.relevant_user_id || customer.relevent_user || customer.relevantUser

      return {
        ...customer,
        name: `${customer.name || ''} ${customer.surname || ''}`.trim() || 'İsimsiz',
        status: customer.statusId || customer.status,
        statusData: statusMap.value[customer.statusId || customer.status],
        source: customer.source || '-',
        isActive: customer.isActive !== undefined ? customer.isActive : true,
        user: usersMap.value[userId] || customer.user,
        relevantUser: usersMap.value[relevantUserId] || customer.relevantUser
      }
    }).filter(customer => canAccessCustomer(customer))

    if (response.meta) {
      pagination.value = {
        total: response.meta.total,
        page: response.meta.page,
        limit: response.meta.limit,
        totalPages: response.meta.totalPages
      }
    }
  } catch (error) {
    console.error('Failed to load data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})

useHead({
  title: 'Yeni Kişiler - Valdori CRM'
})
</script>