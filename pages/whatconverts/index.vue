<template>
  <div class="min-h-screen">
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <div class="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
            <ChartBarIcon class="h-8 w-8 text-white" />
          </div>
          WhatConverts
        </h1>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Lead Entegrasyonu Yönetimi
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
      <div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
        <div class="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <UsersIcon class="h-6 w-6 text-white" />
            </div>
            <span class="text-xs font-medium text-indigo-100 bg-white/20 px-2 py-1 rounded-full">
              Son {{ statsDays }} gün
            </span>
          </div>
          <p class="text-indigo-100 text-sm font-medium mb-1">Toplam Lead</p>
          <p class="text-3xl font-bold text-white mb-2">{{ stats.total || 0 }}</p>
        </div>
      </div>

      <!-- Başarılı -->
      <div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
        <div class="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <CheckCircleIcon class="h-6 w-6 text-white" />
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
              <XCircleIcon class="h-6 w-6 text-white" />
            </div>
          </div>
          <p class="text-white dark:text-red-100 text-sm font-medium mb-1">Hatalı</p>
          <p class="text-3xl font-bold text-white mb-2">{{ getStatByStatus('error') }}</p>
        </div>
      </div>

      <!-- Atlanan -->
      <div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
        <div class="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <ForwardIcon class="h-6 w-6 text-white" />
            </div>
          </div>
          <p class="text-amber-100 text-sm font-medium mb-1">Atlanan</p>
          <p class="text-3xl font-bold text-white mb-2">{{ skippedCount }}</p>
          <div class="flex items-center text-amber-100 text-xs">
            <span>Spam: {{ getStatByStatus('spam') }} | Duplicate: {{ getStatByStatus('duplicate') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Lead Tiplerine Göre -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
        <div class="flex items-center gap-3 mb-6">
          <div class="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
            <PhoneIcon class="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Lead Tiplerine Göre</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Kaynak dağılımı</p>
          </div>
        </div>

        <div v-if="stats.byType && stats.byType.length > 0" class="space-y-4">
          <div v-for="item in stats.byType" :key="item.leadType" class="group">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <span class="text-lg">{{ getLeadTypeIcon(item.leadType) }}</span>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ formatLeadType(item.leadType) }}
                </span>
              </div>
              <span class="text-sm font-bold text-gray-900 dark:text-white">{{ item.count }}</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                class="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full transition-all duration-1000"
                :style="{ width: getBarWidth(item.count, stats.byType) + '%' }"
              ></div>
            </div>
          </div>
        </div>
        <div v-else class="flex flex-col items-center justify-center py-8 text-gray-400">
          <ChartBarIcon class="h-12 w-12 mb-2" />
          <p>Veri yok</p>
        </div>
      </div>

      <!-- Kaynaklara Göre -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
        <div class="flex items-center gap-3 mb-6">
          <div class="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl">
            <GlobeAltIcon class="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Kaynaklara Göre</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Trafik kaynakları</p>
          </div>
        </div>

        <div v-if="stats.bySource && stats.bySource.length > 0" class="space-y-4">
          <div v-for="item in stats.bySource" :key="item.source" class="group">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ item.source || 'Bilinmiyor' }}
              </span>
              <span class="text-sm font-bold text-gray-900 dark:text-white">{{ item.count }}</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                class="bg-gradient-to-r from-emerald-500 to-teal-500 h-2.5 rounded-full transition-all duration-1000"
                :style="{ width: getBarWidth(item.count, stats.bySource) + '%' }"
              ></div>
            </div>
          </div>
        </div>
        <div v-else class="flex flex-col items-center justify-center py-8 text-gray-400">
          <GlobeAltIcon class="h-12 w-12 mb-2" />
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
            <div class="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-xl">
              <ClipboardDocumentListIcon class="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Webhook Logları</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Gelen lead kayıtları</p>
            </div>
          </div>

          <!-- Filters -->
          <div class="flex  gap-3">
            <select v-model="filters.status" @change="fetchLogs" class="form-select text-sm">
              <option value="">Tüm Durumlar</option>
              <option value="success">Başarılı</option>
              <option value="error">Hatalı</option>
              <option value="skipped">Atlanan</option>
              <option value="duplicate">Duplicate</option>
              <option value="spam">Spam</option>
            </select>
            <select v-model="filters.leadType" @change="fetchLogs" class="form-select text-sm">
              <option value="">Tüm Tipler</option>
              <option value="phone_call">Telefon</option>
              <option value="web_form">Form</option>
              <option value="email">Email</option>
              <option value="chat">Chat</option>
              <option value="text_message">SMS</option>
            </select>
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
          <div class="w-16 h-16 border-4 border-indigo-200 dark:border-indigo-900 rounded-full animate-spin"></div>
          <div class="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
        <p class="mt-4 text-gray-600 dark:text-gray-400 animate-pulse">Veriler yükleniyor...</p>
      </div>

      <!-- Logs Table -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">ID</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Lead ID</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Tip</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Durum</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">İletişim</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Kaynak</th>
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
                <span class="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono text-gray-700 dark:text-gray-300">
                  {{ log.leadId }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  {{ getLeadTypeIcon(log.leadType) }}
                  {{ formatLeadType(log.leadType) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                  :class="getStatusClass(log.status)"
                >
                  {{ formatStatus(log.status) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="max-w-[180px]">
                  <p v-if="log.contactName" class="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {{ log.contactName }}
                  </p>
                  <p v-if="log.contactPhone" class="text-xs text-gray-500 dark:text-gray-400">
                    📞 {{ log.contactPhone }}
                  </p>
                  <p v-if="log.contactEmail" class="text-xs text-gray-500 dark:text-gray-400 truncate">
                    ✉️ {{ log.contactEmail }}
                  </p>
                </div>
              </td>
              <td class="px-6 py-4">
                <div>
                  <p v-if="log.leadSource" class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ log.leadSource }}
                    <span v-if="log.leadMedium" class="text-gray-400">/ {{ log.leadMedium }}</span>
                  </p>
                  <p v-if="log.leadCampaign" class="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                    {{ log.leadCampaign }}
                  </p>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <NuxtLink 
                  v-if="log.customerId" 
                  :to="`/customers/show/${log.customerId}`"
                  class="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
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
                    @click="retryWebhook(log.id)"
                    :disabled="retrying === log.id"
                    class="p-2 text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg transition-colors disabled:opacity-50"
                    title="Yeniden Dene"
                  >
                    <ArrowPathIcon v-if="retrying !== log.id" class="h-5 w-5" />
                    <div v-else class="h-5 w-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                  </button>
                  <button
                    @click="showLogDetail(log)"
                    class="p-2 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                    title="Detay"
                  >
                    <EyeIcon class="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="logs.length === 0">
              <td colspan="9" class="text-center py-16">
                <div class="flex flex-col items-center">
                  <div class="p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                    <InboxIcon class="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Log bulunamadı</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Henüz webhook kaydı yok veya filtrelere uygun sonuç bulunamadı.
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
                <Cog6ToothIcon class="h-6 w-6 text-indigo-500" />
                Entegrasyon Ayarları
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
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Yeni lead'lere atanacak durum</p>
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
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Yeni lead'lere atanacak kaynak</p>
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
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Lead'lerin otomatik atanacağı kullanıcı</p>
              </div>

              <div class="space-y-3 pt-2">
                <label class="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" v-model="config.skipSpam" class="form-checkbox" />
                  <span class="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    Spam lead'leri atla
                  </span>
                </label>

                <label class="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" v-model="config.skipDuplicates" class="form-checkbox" />
                  <span class="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    Duplicate lead'leri atla
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
                  <code class="flex-1 text-sm text-indigo-600 dark:text-indigo-400 truncate">
                    {{ webhookUrl }}
                  </code>
                  <button 
                    @click="copyWebhookUrl"
                    class="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <ClipboardIcon v-if="!copied" class="h-5 w-5" />
                    <CheckIcon v-else class="h-5 w-5 text-emerald-500" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button @click="showConfigModal = false" class="btn-secondary">
                İptal
              </button>
              <button @click="saveConfig" :disabled="savingConfig" class="btn-primary">
                <ArrowPathIcon v-if="savingConfig" class="h-5 w-5 animate-spin" />
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
          
          <div class="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <!-- Modal Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                Log Detayı #{{ selectedLog.id }}
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
                  <p class="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Lead ID</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedLog.leadId }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Account ID</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedLog.accountId || '-' }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Profile ID</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedLog.profileId || '-' }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Lead Tipi</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ formatLeadType(selectedLog.leadType) }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Event Tipi</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedLog.eventType || '-' }}</p>
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
                    class="text-sm font-medium text-indigo-600 dark:text-indigo-400"
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

              <!-- Message -->
              <div v-if="selectedLog.message">
                <p class="text-xs text-gray-500 dark:text-gray-400 uppercase mb-2">Mesaj</p>
                <p class="text-sm text-gray-700 dark:text-gray-300 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  {{ selectedLog.message }}
                </p>
              </div>

              <!-- Error Detail -->
              <div v-if="selectedLog.errorDetail">
                <p class="text-xs text-red-500 uppercase mb-2">Hata Detayı</p>
                <pre class="text-sm text-red-600 dark:text-red-400 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg overflow-x-auto">{{ selectedLog.errorDetail }}</pre>
              </div>

              <!-- Raw Payload -->
              <div v-if="selectedLog.rawPayload">
                <p class="text-xs text-gray-500 dark:text-gray-400 uppercase mb-2">Ham Veri (Raw Payload)</p>
                <pre class="text-xs text-gray-300 p-4 bg-gray-900 dark:bg-gray-950 rounded-lg overflow-x-auto max-h-64">{{ JSON.stringify(selectedLog.rawPayload, null, 2) }}</pre>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button 
                v-if="selectedLog.status === 'error'"
                @click="retryWebhook(selectedLog.id); selectedLog = null"
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
  ChartBarIcon,
  UsersIcon,
  CheckCircleIcon,
  XCircleIcon,
  ForwardIcon,
  PhoneIcon,
  GlobeAltIcon,
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
  leadType: '',
  startDate: '',
  endDate: ''
})
const config = ref({
  defaultStatusId: 1,
  defaultSourceId: 1,
  defaultUserId: null,
  autoAssign: false,
  skipSpam: true,
  skipDuplicates: true
})
const showConfigModal = ref(false)
const selectedLog = ref(null)
const retrying = ref(null)
const savingConfig = ref(false)
const copied = ref(false)

// Computed
const webhookUrl = computed(() => {
  if (process.client) {
    const baseUrl = window.location.origin
    return `${baseUrl.replace(':3000', ':3001')}/whatconverts/webhook`
  }
  return '/whatconverts/webhook'
})

const successRate = computed(() => {
  if (!stats.value.total) return 0
  const success = getStatByStatus('success')
  return Math.round((success / stats.value.total) * 100)
})

const skippedCount = computed(() => {
  return getStatByStatus('skipped') + getStatByStatus('duplicate') + getStatByStatus('spam')
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

function formatLeadType(type) {
  const types = {
    'phone_call': 'Telefon',
    'web_form': 'Form',
    'email': 'Email',
    'chat': 'Chat',
    'text_message': 'SMS',
    'event': 'Event',
    'transaction': 'İşlem',
    'appointment': 'Randevu',
    'other': 'Diğer'
  }
  return types[type] || type || 'Bilinmiyor'
}

function getLeadTypeIcon(type) {
  const icons = {
    'phone_call': '📞',
    'web_form': '📝',
    'email': '✉️',
    'chat': '💬',
    'text_message': '📱',
    'event': '🎯',
    'transaction': '💳',
    'appointment': '📅',
    'other': '📌'
  }
  return icons[type] || '📌'
}

function formatStatus(status) {
  const statuses = {
    'success': 'Başarılı',
    'error': 'Hata',
    'skipped': 'Atlandı',
    'duplicate': 'Duplicate',
    'spam': 'Spam'
  }
  return statuses[status] || status
}

function getStatusClass(status) {
  const classes = {
    'success': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
    'error': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    'skipped': 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
    'duplicate': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
    'spam': 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
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
    const response = await api(`/whatconverts/stats?days=${statsDays.value}`)
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
    if (filters.value.leadType) params.append('leadType', filters.value.leadType)
    if (filters.value.startDate) params.append('startDate', filters.value.startDate)
    if (filters.value.endDate) params.append('endDate', filters.value.endDate)

    const response = await api(`/whatconverts/logs?${params}`)
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
    const response = await api('/whatconverts/config')
    config.value = { ...config.value, ...response }
  } catch (error) {
    console.error('Config fetch error:', error)
  }
}

async function saveConfig() {
  savingConfig.value = true
  try {
    await api('/whatconverts/config', {
      method: 'PATCH',
      body: config.value
    })
    showConfigModal.value = false
  } catch (error) {
    console.error('Config save error:', error)
  } finally {
    savingConfig.value = false
  }
}

async function retryWebhook(logId) {
  retrying.value = logId
  try {
    await api(`/whatconverts/logs/${logId}/retry`, { method: 'POST' })
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

// Lifecycle
onMounted(() => {
  fetchStats()
  fetchLogs()
  fetchConfig()
})

useHead({
  title: 'WhatConverts - Valdori CRM'
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