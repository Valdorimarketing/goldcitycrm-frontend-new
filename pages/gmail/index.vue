<template>
  <div class="min-h-screen">
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <div class="p-2 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl shadow-lg">
            <EnvelopeIcon class="h-8 w-8 text-white" />
          </div>
          Gmail Integration
        </h1>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Gmail Lead Entegrasyonu Yönetimi
        </p>
      </div>

      <div class="flex gap-3 mt-4 sm:mt-0">
        <button @click="refreshData" :disabled="loading"
          class="btn-secondary flex items-center gap-2 hover:scale-105 transition-transform">
          <ArrowPathIcon class="h-5 w-5" :class="{ 'animate-spin': loading }" />
          Yenile
        </button>
        <button @click="showConfigModal = true"
          class="btn-primary flex items-center gap-2 hover:scale-105 transition-transform">
          <Cog6ToothIcon class="h-5 w-5" />
          Ayarlar
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Toplam Lead -->
      <div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
        <div class="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <UsersIcon class="h-7 w-7 text-white" />
            </div>
            <span class="text-xs font-medium text-rose-100 bg-white/20 px-2 py-1 rounded-full">
              Son {{ statsDays }} gün
            </span>
          </div>
          <p class="text-rose-100 text-sm font-medium mb-1">Toplam Email</p>
          <p class="text-3xl font-bold text-white mb-2">{{ stats.total || 0 }}</p>
        </div>
      </div>

      <!-- Başarılı -->
      <div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
        <div class="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <CheckCircleIcon class="h-7 w-7 text-white" />
            </div>
            <span class="text-xs font-medium text-emerald-100 bg-white/20 px-2 py-1 rounded-full">
              %{{ successRate }}
            </span>
          </div>
          <p class="text-emerald-100 text-sm font-medium mb-1">Başarılı</p>
          <p class="text-3xl font-bold text-white mb-2">{{ getStatByStatus('success') }}</p>
          <div class="w-full bg-white/20 rounded-full h-2 mt-3">
            <div 
              class="bg-white rounded-full h-2 transition-all duration-1000 ease-out"
              :style="{ width: successRate + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Hatalı -->
      <div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
        <div class="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <XCircleIcon class="h-7 w-7 text-white" />
            </div>
          </div>
          <p class="text-white text-sm font-medium mb-1">Hatalı</p>
          <p class="text-3xl font-bold text-white mb-2">{{ getStatByStatus('error') }}</p>
        </div>
      </div>

      <!-- Atlanan -->
      <div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
        <div class="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <ForwardIcon class="h-7 w-7 text-white" />
            </div>
          </div>
          <p class="text-amber-100 text-sm font-medium mb-1">Atlanan</p>
          <p class="text-3xl font-bold text-white mb-2">{{ skippedCount }}</p>
          <div class="flex items-center text-amber-100 text-xs">
            <span>Spam: {{ getStatByStatus('skipped') }} | Duplicate: {{ getStatByStatus('duplicate') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- En Çok Gönderen -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
        <div class="flex items-center gap-3 mb-6">
          <div class="p-2 bg-red-100 dark:bg-red-900/50 rounded-xl">
            <UserIcon class="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">En Çok Gönderenler</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Email gönderen listesi</p>
          </div>
        </div>

        <div v-if="stats.topSenders && stats.topSenders.length > 0" class="space-y-4">
          <div v-for="item in stats.topSenders" :key="item.email" class="group">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <span class="text-lg">📧</span>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
                  {{ item.email }}
                </span>
              </div>
              <span class="text-sm font-bold text-gray-900 dark:text-white">{{ item.count }}</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                class="bg-gradient-to-r from-red-500 to-rose-600 h-2.5 rounded-full transition-all duration-1000"
                :style="{ width: getBarWidth(item.count, stats.topSenders) + '%' }"
              ></div>
            </div>
          </div>
        </div>
        <div v-else class="flex flex-col items-center justify-center py-8 text-gray-400">
          <UserIcon class="h-12 w-12 mb-2" />
          <p>Veri yok</p>
        </div>
      </div>

      <!-- Duruma Göre -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
        <div class="flex items-center gap-3 mb-6">
          <div class="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl">
            <ChartPieIcon class="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Duruma Göre</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">İşlem durumları</p>
          </div>
        </div>

        <div v-if="stats.byStatus && stats.byStatus.length > 0" class="space-y-4">
          <div v-for="item in stats.byStatus" :key="item.status" class="group">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <span class="text-lg">{{ getStatusIcon(item.status) }}</span>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ formatStatus(item.status) }}
                </span>
              </div>
              <span class="text-sm font-bold text-gray-900 dark:text-white">{{ item.count }}</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                class="h-2.5 rounded-full transition-all duration-1000"
                :class="getStatusBarColor(item.status)"
                :style="{ width: getBarWidth(item.count, stats.byStatus) + '%' }"
              ></div>
            </div>
          </div>
        </div>
        <div v-else class="flex flex-col items-center justify-center py-8 text-gray-400">
          <ChartPieIcon class="h-12 w-12 mb-2" />
          <p>Veri yok</p>
        </div>
      </div>
    </div>

    <!-- Logs Section -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      <!-- Logs Header -->
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-red-100 dark:bg-red-900/50 rounded-xl">
              <ClipboardDocumentListIcon class="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Gmail Logları</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Gelen email kayıtları</p>
            </div>
          </div>

          <!-- Filters -->
          <div class="flex flex-wrap gap-3">
            <select v-model="filters.status" @change="fetchLogs" class="form-select text-sm">
              <option value="">Tüm Durumlar</option>
              <option value="success">Başarılı</option>
              <option value="error">Hatalı</option>
              <option value="skipped">Atlanan</option>
              <option value="duplicate">Duplicate</option>
            </select>
            <input 
              v-model="filters.fromEmail"
              @input="debouncedFetchLogs"
              type="text" 
              placeholder="Email ara..."
              class="form-input text-sm"
            />
            <input 
              type="date" 
              v-model="filters.startDate" 
              @change="fetchLogs"
              class="form-input text-sm"
            />
            <input 
              type="date" 
              v-model="filters.endDate" 
              @change="fetchLogs"
              class="form-input text-sm"
            />
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-16">
        <div class="relative">
          <div class="w-16 h-16 border-4 border-red-200 dark:border-red-900 rounded-full animate-spin"></div>
          <div class="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-red-600 rounded-full animate-spin"></div>
        </div>
        <p class="mt-4 text-gray-600 dark:text-gray-400 animate-pulse">Veriler yükleniyor...</p>
      </div>

      <!-- Logs Table -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">ID</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Message ID</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Gönderen</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Konu</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Durum</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Müşteri</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Tarih</th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">İşlem</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr 
              v-for="(log, index) in logs" 
              :key="log.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              :style="{ animationDelay: index * 50 + 'ms' }"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-500 dark:text-gray-400">#{{ log.id }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono text-gray-700 dark:text-gray-300 truncate max-w-[120px] inline-block">
                  {{ log.messageId }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="max-w-[200px]">
                  <p v-if="log.fromName" class="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {{ log.fromName }}
                  </p>
                  <p v-if="log.fromEmail" class="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {{ log.fromEmail }}
                  </p>
                </div>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm text-gray-900 dark:text-white truncate max-w-[250px]">
                  {{ log.subject || '-' }}
                </p>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                  :class="getStatusClass(log.status)"
                >
                  {{ formatStatus(log.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <NuxtLink 
                  v-if="log.customerId" 
                  :to="`/customers/show/${log.customerId}`"
                  class="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                >
                  #{{ log.customerId }}
                </NuxtLink>
                <span v-else class="text-gray-400">-</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <p class="text-sm text-gray-900 dark:text-gray-100">{{ formatDate(log.createdAt) }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatTime(log.createdAt) }}</p>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    v-if="log.status === 'error'"
                    @click="retryLog(log.id)"
                    :disabled="retrying === log.id"
                    class="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                    title="Yeniden Dene"
                  >
                    <ArrowPathIcon v-if="retrying !== log.id" class="h-5 w-5" />
                    <div v-else class="h-5 w-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                  </button>
                  <button
                    @click="showLogDetail(log)"
                    class="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    title="Detay"
                  >
                    <EyeIcon class="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="logs.length === 0">
              <td colspan="8" class="text-center py-16">
                <div class="flex flex-col items-center">
                  <div class="p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                    <InboxIcon class="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Log bulunamadı</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Henüz email kaydı yok veya filtrelere uygun sonuç bulunamadı.
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
        class="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-6 py-4"
      >
        <p class="text-sm text-gray-700 dark:text-gray-300">
          Sayfa <span class="font-medium">{{ pagination.page }}</span> / 
          <span class="font-medium">{{ pagination.totalPages }}</span>
          <span class="text-gray-500 dark:text-gray-400 ml-2">({{ pagination.total }} kayıt)</span>
        </p>
        <nav class="isolate inline-flex -space-x-px rounded-lg shadow-sm">
          <button
            :disabled="pagination.page === 1"
            @click="goToPage(pagination.page - 1)"
            class="relative inline-flex items-center rounded-l-lg px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            <ChevronLeftIcon class="h-5 w-5" />
          </button>
          <button
            :disabled="pagination.page === pagination.totalPages"
            @click="goToPage(pagination.page + 1)"
            class="relative inline-flex items-center rounded-r-lg px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            <ChevronRightIcon class="h-5 w-5" />
          </button>
        </nav>
      </div>
    </div>

    <!-- Config Modal -->
    <Teleport to="body">
      <div v-if="showConfigModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="showConfigModal = false"></div>
          
          <div class="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl">
            <!-- Modal Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Cog6ToothIcon class="h-6 w-6 text-red-500" />
                Gmail Ayarları
              </h2>
              <button 
                @click="showConfigModal = false"
                class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <XMarkIcon class="h-6 w-6" />
              </button>
            </div>

            <!-- Modal Body -->
            <div class="p-6 space-y-5">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Varsayılan Status ID
                </label>
                <input 
                  type="number" 
                  v-model.number="config.defaultStatusId"
                  class="form-input"
                />
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Yeni müşterilere atanacak durum</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Varsayılan Source ID
                </label>
                <input 
                  type="number" 
                  v-model.number="config.defaultSourceId"
                  class="form-input"
                />
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Yeni müşterilere atanacak kaynak</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Varsayılan Kullanıcı ID (Opsiyonel)
                </label>
                <input 
                  type="number" 
                  v-model.number="config.defaultUserId"
                  class="form-input"
                  placeholder="Boş bırakılabilir"
                />
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Müşterilerin otomatik atanacağı kullanıcı</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Internal Domain'ler
                </label>
                <input 
                  type="text" 
                  v-model="config.internalDomains"
                  class="form-input"
                  placeholder="example.com, company.com"
                />
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Virgülle ayırarak girin, bu domainlerden gelen emailler atlanır</p>
              </div>

              <div class="space-y-3 pt-2">
                <label class="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" v-model="config.skipDuplicates" class="form-checkbox" />
                  <span class="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    Duplicate emaillerı atla
                  </span>
                </label>

                <label class="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" v-model="config.skipInternal" class="form-checkbox" />
                  <span class="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    Internal emaillerı atla
                  </span>
                </label>

                <label class="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" v-model="config.autoAssign" class="form-checkbox" />
                  <span class="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    Otomatik kullanıcı ataması
                  </span>
                </label>
              </div>

              <!-- Webhook URL -->
              <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Webhook URL
                </label>
                <div class="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <code class="flex-1 text-sm text-red-600 dark:text-red-400 truncate">
                    {{ webhookUrl }}
                  </code>
                  <button 
                    @click="copyWebhookUrl"
                    class="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <ClipboardIcon v-if="!copied" class="h-5 w-5" />
                    <CheckIcon v-else class="h-5 w-5 text-emerald-500" />
                  </button>
                </div>
              </div>

              <!-- Gmail Watch Info -->
              <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between mb-3">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Gmail Watch Durumu
                  </label>
                  <span 
                    class="px-2.5 py-1 rounded-full text-xs font-semibold"
                    :class="watchStatus.active ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'"
                  >
                    {{ watchStatus.active ? 'Aktif' : 'Pasif' }}
                  </span>
                </div>
                <div class="flex gap-2">
                  <button 
                    v-if="!watchStatus.active"
                    @click="startWatch"
                    :disabled="startingWatch"
                    class="btn-primary flex-1"
                  >
                    <ArrowPathIcon v-if="startingWatch" class="h-5 w-5 animate-spin mr-2" />
                    Watch Başlat
                  </button>
                  <button 
                    v-else
                    @click="stopWatch"
                    :disabled="stoppingWatch"
                    class="btn-secondary flex-1"
                  >
                    <ArrowPathIcon v-if="stoppingWatch" class="h-5 w-5 animate-spin mr-2" />
                    Watch Durdur
                  </button>
                </div>
                <p v-if="watchStatus.expiration" class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Bitiş: {{ formatDate(watchStatus.expiration) }} {{ formatTime(watchStatus.expiration) }}
                </p>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button @click="showConfigModal = false" class="btn-secondary">
                İptal
              </button>
              <button @click="saveConfig" :disabled="savingConfig" class="btn-primary">
                <ArrowPathIcon v-if="savingConfig" class="h-5 w-5 animate-spin mr-2" />
                {{ savingConfig ? 'Kaydediliyor...' : 'Kaydet' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Log Detail Modal -->
    <Teleport to="body">
      <div v-if="selectedLog" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="selectedLog = null"></div>
          
          <div class="relative w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <!-- Modal Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                Email Log Detayı #{{ selectedLog.id }}
              </h2>
              <button 
                @click="selectedLog = null"
                class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <XMarkIcon class="h-6 w-6" />
              </button>
            </div>

            <!-- Modal Body -->
            <div class="p-6 overflow-y-auto flex-1 space-y-6">
              <!-- Info Grid -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Message ID</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white font-mono">{{ selectedLog.messageId }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Thread ID</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white font-mono">{{ selectedLog.threadId || '-' }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">History ID</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedLog.historyId || '-' }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Durum</p>
                  <span :class="getStatusClass(selectedLog.status)" class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold">
                    {{ formatStatus(selectedLog.status) }}
                  </span>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Müşteri ID</p>
                  <NuxtLink 
                    v-if="selectedLog.customerId" 
                    :to="`/customers/show/${selectedLog.customerId}`"
                    class="text-sm font-medium text-red-600 dark:text-red-400"
                  >
                    #{{ selectedLog.customerId }}
                  </NuxtLink>
                  <span v-else class="text-sm text-gray-500">-</span>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">İşlem Süresi</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedLog.processingTimeMs || 0 }} ms</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Webhook IP</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedLog.webhookIp || '-' }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Retry Sayısı</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedLog.retryCount || 0 }}</p>
                </div>
              </div>

              <!-- Email Info -->
              <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Email Bilgileri</h3>
                <div class="space-y-3">
                  <div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Gönderen</p>
                    <p class="text-sm text-gray-700 dark:text-gray-300">
                      <span class="font-medium">{{ selectedLog.fromName }}</span>
                      <span class="text-gray-500"> &lt;{{ selectedLog.fromEmail }}&gt;</span>
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Alıcı</p>
                    <p class="text-sm text-gray-700 dark:text-gray-300">{{ selectedLog.toEmail }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Konu</p>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedLog.subject }}</p>
                  </div>
                  <div v-if="selectedLog.snippet">
                    <p class="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Snippet</p>
                    <p class="text-sm text-gray-700 dark:text-gray-300">{{ selectedLog.snippet }}</p>
                  </div>
                  <div v-if="selectedLog.labels && selectedLog.labels.length > 0">
                    <p class="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Etiketler</p>
                    <div class="flex flex-wrap gap-2">
                      <span 
                        v-for="label in selectedLog.labels" 
                        :key="label"
                        class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-700 dark:text-gray-300"
                      >
                        {{ label }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Message -->
              <div v-if="selectedLog.message" class="border-t border-gray-200 dark:border-gray-700 pt-4">
                <p class="text-xs text-gray-500 dark:text-gray-400 uppercase mb-2">Mesaj</p>
                <p class="text-sm text-gray-700 dark:text-gray-300 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  {{ selectedLog.message }}
                </p>
              </div>

              <!-- Error Detail -->
              <div v-if="selectedLog.errorDetail" class="border-t border-gray-200 dark:border-gray-700 pt-4">
                <p class="text-xs text-red-500 uppercase mb-2">Hata Detayı</p>
                <pre class="text-sm text-red-600 dark:text-red-400 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg overflow-x-auto">{{ selectedLog.errorDetail }}</pre>
              </div>

              <!-- Body Content -->
              <div v-if="selectedLog.body" class="border-t border-gray-200 dark:border-gray-700 pt-4">
                <p class="text-xs text-gray-500 dark:text-gray-400 uppercase mb-2">Email İçeriği</p>
                <pre class="text-sm text-gray-700 dark:text-gray-300 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto max-h-64 whitespace-pre-wrap">{{ selectedLog.body }}</pre>
              </div>

              <!-- Raw Payload -->
              <div v-if="selectedLog.rawPubsubPayload" class="border-t border-gray-200 dark:border-gray-700 pt-4">
                <p class="text-xs text-gray-500 dark:text-gray-400 uppercase mb-2">Ham Veri (Pub/Sub Payload)</p>
                <pre class="text-xs text-gray-300 p-4 bg-gray-900 dark:bg-gray-950 rounded-lg overflow-x-auto max-h-64">{{ JSON.stringify(selectedLog.rawPubsubPayload, null, 2) }}</pre>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button 
                v-if="selectedLog.status === 'error'"
                @click="retryLog(selectedLog.id); selectedLog = null"
                class="btn-warning"
              >
                <ArrowPathIcon class="h-5 w-5 mr-2" />
                Yeniden Dene
              </button>
              <button @click="selectedLog = null" class="btn-secondary">
                Kapat
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import {
  EnvelopeIcon,
  UsersIcon,
  CheckCircleIcon,
  XCircleIcon,
  ForwardIcon,
  UserIcon,
  ChartPieIcon,
  ClipboardDocumentListIcon,
  ArrowPathIcon,
  Cog6ToothIcon,
  EyeIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  InboxIcon,
  ClipboardIcon,
  CheckIcon
} from '@heroicons/vue/24/outline'

import { useApi } from '~/composables/useApi'

const api = useApi()

// State
const loading = ref(false)
const stats = ref({})
const statsDays = ref(7)
const logs = ref([])
const pagination = ref({
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0
})
const filters = ref({
  status: '',
  fromEmail: '',
  startDate: '',
  endDate: ''
})
const config = ref({
  defaultStatusId: 1,
  defaultSourceId: 10,
  defaultUserId: null,
  autoAssign: false,
  skipDuplicates: true,
  skipInternal: true,
  internalDomains: ''
})
const watchStatus = ref({
  active: false,
  expiration: null
})
const showConfigModal = ref(false)
const selectedLog = ref(null)
const retrying = ref(null)
const savingConfig = ref(false)
const startingWatch = ref(false)
const stoppingWatch = ref(false)
const copied = ref(false)

// Computed
const webhookUrl = computed(() => {
  if (process.client) {
    const baseUrl = window.location.origin
    return `${baseUrl.replace(':3000', ':3001')}/gmail/webhook?secret=YOUR_SECRET`
  }
  return '/gmail/webhook?secret=YOUR_SECRET'
})

const successRate = computed(() => {
  if (!stats.value.total) return 0
  const success = getStatByStatus('success')
  return Math.round((success / stats.value.total) * 100)
})

const skippedCount = computed(() => {
  return getStatByStatus('skipped') + getStatByStatus('duplicate')
})

// Methods
function getStatByStatus(status) {
  if (!stats.value.byStatus) return 0
  const found = stats.value.byStatus.find(s => s.status === status)
  return found ? parseInt(found.count) : 0
}

function getBarWidth(count, items) {
  if (!items || items.length === 0) return 0
  const max = Math.max(...items.map(i => parseInt(i.count)))
  return max > 0 ? (parseInt(count) / max) * 100 : 0
}

function formatStatus(status) {
  const statuses = {
    'success': 'Başarılı',
    'error': 'Hata',
    'skipped': 'Atlandı',
    'duplicate': 'Duplicate',
    'processing': 'İşleniyor'
  }
  return statuses[status] || status
}

function getStatusIcon(status) {
  const icons = {
    'success': '✅',
    'error': '❌',
    'skipped': '⏭️',
    'duplicate': '🔄',
    'processing': '⏳'
  }
  return icons[status] || '📌'
}

function getStatusClass(status) {
  const classes = {
    'success': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
    'error': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    'skipped': 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
    'duplicate': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
    'processing': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

function getStatusBarColor(status) {
  const colors = {
    'success': 'bg-gradient-to-r from-emerald-500 to-emerald-600',
    'error': 'bg-gradient-to-r from-red-500 to-rose-600',
    'skipped': 'bg-gradient-to-r from-amber-500 to-orange-500',
    'duplicate': 'bg-gradient-to-r from-orange-500 to-amber-500',
    'processing': 'bg-gradient-to-r from-blue-500 to-indigo-500'
  }
  return colors[status] || 'bg-gray-500'
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('tr-TR')
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
}

async function fetchStats() {
  try {
    const response = await api(`/gmail/stats?days=${statsDays.value}`)
    stats.value = response || {}
  } catch (error) {
    console.error('Stats fetch error:', error)
  }
}

async function fetchLogs() {
  loading.value = true
  try {
    const params = new URLSearchParams({
      page: pagination.value.page,
      limit: pagination.value.limit
    })

    if (filters.value.status) params.append('status', filters.value.status)
    if (filters.value.fromEmail) params.append('fromEmail', filters.value.fromEmail)
    if (filters.value.startDate) params.append('startDate', filters.value.startDate)
    if (filters.value.endDate) params.append('endDate', filters.value.endDate)

    const response = await api(`/gmail/logs?${params}`)
    logs.value = response?.data || []
    pagination.value = {
      page: response?.page || 1,
      limit: response?.limit || 20,
      total: response?.total || 0,
      totalPages: response?.totalPages || 0
    }
  } catch (error) {
    console.error('Logs fetch error:', error)
  } finally {
    loading.value = false
  }
}

async function fetchConfig() {
  try {
    const response = await api('/gmail/config')
    config.value = { 
      ...config.value, 
      ...response,
      internalDomains: response.internalDomains?.join(', ') || ''
    }
  } catch (error) {
    console.error('Config fetch error:', error)
  }
}

async function saveConfig() {
  savingConfig.value = true
  try {
    const payload = {
      ...config.value,
      internalDomains: config.value.internalDomains.split(',').map(d => d.trim()).filter(Boolean)
    }
    await api('/gmail/config', {
      method: 'PATCH',
      body: payload
    })
    showConfigModal.value = false
  } catch (error) {
    console.error('Config save error:', error)
  } finally {
    savingConfig.value = false
  }
}

async function startWatch() {
  startingWatch.value = true
  try {
    const response = await api('/gmail/watch/start', {
      method: 'POST',
      body: {
        topicName: 'projects/valdoricrmtr1/topics/gmail-notifications',
        labelIds: ['INBOX']
      }
    })
    watchStatus.value = {
      active: true,
      expiration: response.expiration
    }
  } catch (error) {
    console.error('Watch start error:', error)
  } finally {
    startingWatch.value = false
  }
}

async function stopWatch() {
  stoppingWatch.value = true
  try {
    await api('/gmail/watch/stop', { method: 'POST' })
    watchStatus.value = {
      active: false,
      expiration: null
    }
  } catch (error) {
    console.error('Watch stop error:', error)
  } finally {
    stoppingWatch.value = false
  }
}

async function retryLog(logId) {
  retrying.value = logId
  try {
    await api(`/gmail/logs/${logId}/retry`, { method: 'POST' })
    await fetchLogs()
    await fetchStats()
  } catch (error) {
    console.error('Retry error:', error)
  } finally {
    retrying.value = null
  }
}

function goToPage(page) {
  pagination.value.page = page
  fetchLogs()
}

function showLogDetail(log) {
  selectedLog.value = log
}

function refreshData() {
  fetchStats()
  fetchLogs()
}

function copyWebhookUrl() {
  navigator.clipboard.writeText(webhookUrl.value)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

// Debounce for search
let debounceTimer
function debouncedFetchLogs() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    pagination.value.page = 1
    fetchLogs()
  }, 500)
}

// Lifecycle
onMounted(() => {
  fetchStats()
  fetchLogs()
  fetchConfig()
})

useHead({
  title: 'Gmail Integration - Valdori CRM'
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