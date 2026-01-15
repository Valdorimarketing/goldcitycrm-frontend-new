<template>
  <div class="p-4 md:p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
    <div class="max-w-5xl mx-auto">
      
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Google Sheets Ayarları</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">OAuth ayarları ve spreadsheet yönetimi</p>
      </div>

      <!-- Tabs -->
      <div class="flex gap-2 mb-6">
        <button 
          @click="activeTab = 'oauth'"
          :class="activeTab === 'oauth' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'"
          class="px-4 py-2 rounded-lg font-medium transition-colors"
        >
          OAuth Ayarları
        </button>
        <button 
          @click="activeTab = 'spreadsheets'"
          :class="activeTab === 'spreadsheets' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'"
          class="px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Spreadsheet'ler
        </button>
      </div>

      <!-- OAuth Tab -->
      <div v-if="activeTab === 'oauth'">
        <!-- Status Card -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Durum</h2>
            <button 
              @click="loadStatus" 
              :disabled="loading"
              class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <ArrowPathIcon class="w-5 h-5" :class="{ 'animate-spin': loading }" />
            </button>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <!-- OAuth Status -->
            <div class="p-4 rounded-lg" :class="status.isInitialized ? 'bg-green-50 dark:bg-green-900/30' : 'bg-red-50 dark:bg-red-900/30'">
              <div class="flex items-center gap-2 mb-1">
                <span class="w-2 h-2 rounded-full" :class="status.isInitialized ? 'bg-green-500' : 'bg-red-500'"></span>
                <span class="text-sm font-medium text-gray-600 dark:text-gray-300">OAuth</span>
              </div>
              <div class="text-lg font-bold" :class="status.isInitialized ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                {{ status.isInitialized ? 'Aktif' : 'Pasif' }}
              </div>
            </div>

            <!-- Configured Status -->
            <div class="p-4 rounded-lg" :class="status.isConfigured ? 'bg-green-50 dark:bg-green-900/30' : 'bg-yellow-50 dark:bg-yellow-900/30'">
              <div class="flex items-center gap-2 mb-1">
                <span class="w-2 h-2 rounded-full" :class="status.isConfigured ? 'bg-green-500' : 'bg-yellow-500'"></span>
                <span class="text-sm font-medium text-gray-600 dark:text-gray-300">Yapılandırma</span>
              </div>
              <div class="text-lg font-bold" :class="status.isConfigured ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'">
                {{ status.isConfigured ? 'Tamam' : 'Eksik' }}
              </div>
            </div>

            <!-- Last Sync -->
            <div class="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30">
              <div class="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Son Sync</div>
              <div class="text-sm font-bold text-blue-600 dark:text-blue-400">
                {{ status.lastSync ? formatDate(status.lastSync) : 'Henüz yok' }}
              </div>
            </div>

            <!-- Last Token Refresh -->
            <div class="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/30">
              <div class="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Token Yenileme</div>
              <div class="text-sm font-bold text-purple-600 dark:text-purple-400">
                {{ status.lastTokenRefresh ? formatDate(status.lastTokenRefresh) : 'Henüz yok' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Settings Card -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">OAuth Ayarları</h2>

          <div class="space-y-4">
            <!-- Client ID -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client ID</label>
              <input 
                v-model="settings.clientId" 
                type="text"
                placeholder="xxxxx.apps.googleusercontent.com"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <!-- Client Secret -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Secret</label>
              <div class="relative">
                <input 
                  v-model="settings.clientSecret" 
                  :type="showSecret ? 'text' : 'password'"
                  placeholder="GOCSPX-xxxxx"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                />
                <button 
                  @click="showSecret = !showSecret"
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400"
                >
                  <EyeIcon class="w-5 h-5" v-if="showSecret" />
                  <EyeSlashIcon class="w-5 h-5" v-else />
                </button>
              </div>
              <p v-if="settings.clientSecretSet && !settings.clientSecret" class="text-xs text-green-600 dark:text-green-400 mt-1">
                ✓ Secret ayarlanmış (değiştirmek için yeni değer girin)
              </p>
            </div>

            <!-- Redirect URI -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Redirect URI</label>
              <input 
                v-model="settings.redirectUri" 
                type="text"
                placeholder="https://example.com/auth/google/callback"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <!-- Refresh Token Status -->
            <div class="p-4 rounded-lg" :class="settings.refreshTokenSet ? 'bg-green-50 dark:bg-green-900/30' : 'bg-yellow-50 dark:bg-yellow-900/30'">
              <div class="flex items-center justify-between">
                <div>
                  <div class="font-medium" :class="settings.refreshTokenSet ? 'text-green-700 dark:text-green-400' : 'text-yellow-700 dark:text-yellow-400'">
                    Refresh Token: {{ settings.refreshTokenSet ? '✓ Ayarlanmış' : '✗ Ayarlanmamış' }}
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {{ settings.refreshTokenSet ? 'Token otomatik olarak yenilenecek' : 'Google ile yetkilendirme yapın' }}
                  </p>
                </div>
                <button 
                  @click="startOAuth"
                  :disabled="!settings.clientId || loading"
                  class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LinkIcon class="w-5 h-5 inline-block mr-2" />
                  Google ile Yetkilendir
                </button>
              </div>
            </div>
          </div>

          <!-- Save Button -->
          <div class="mt-6 flex gap-3">
            <button 
              @click="saveSettings"
              :disabled="saving"
              class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50"
            >
              <CheckIcon class="w-5 h-5 inline-block mr-2" />
              {{ saving ? 'Kaydediliyor...' : 'Ayarları Kaydet' }}
            </button>
            
            <button 
              @click="reinitialize"
              :disabled="loading"
              class="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium disabled:opacity-50"
            >
              <ArrowPathIcon class="w-5 h-5 inline-block mr-2" />
              Yeniden Başlat
            </button>
          </div>
        </div>

        <!-- Actions Card -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Hızlı İşlemler</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Manual Sync -->
            <button 
              @click="triggerSync"
              :disabled="!status.isInitialized || syncing"
              class="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-left"
            >
              <ArrowUpOnSquareIcon class="w-8 h-8 text-blue-500 mb-2" :class="{ 'animate-bounce': syncing }" />
              <div class="font-medium text-gray-800 dark:text-white">Manuel Sync</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">CRM verilerini Google Sheets'e senkronize et</div>
            </button>

            <!-- Test Connection -->
            <button 
              @click="testConnection"
              :disabled="!status.isConfigured || testing"
              class="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-left"
            >
              <WifiIcon class="w-8 h-8 text-green-500 mb-2" :class="{ 'animate-pulse': testing }" />
              <div class="font-medium text-gray-800 dark:text-white">Bağlantı Testi</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Google Sheets API bağlantısını test et</div>
            </button>
          </div>
        </div>
      </div>

      <!-- Spreadsheets Tab -->
      <div v-if="activeTab === 'spreadsheets'">
        <!-- Add New Spreadsheet -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Yeni Spreadsheet Ekle</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Key (Benzersiz)</label>
              <input 
                v-model="newSpreadsheet.key" 
                type="text"
                placeholder="inventory, reports, etc."
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ad</label>
              <input 
                v-model="newSpreadsheet.name" 
                type="text"
                placeholder="Envanter Takip"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Spreadsheet ID</label>
              <input 
                v-model="newSpreadsheet.spreadsheetId" 
                type="text"
                placeholder="Google Sheets URL'inden ID"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Açıklama</label>
              <input 
                v-model="newSpreadsheet.description" 
                type="text"
                placeholder="Bu spreadsheet ne için kullanılıyor?"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              />
            </div>
            <div class="flex items-center gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="newSpreadsheet.isReadOnly" type="checkbox" class="w-4 h-4 rounded" />
                <span class="text-sm text-gray-700 dark:text-gray-300">Sadece Okuma</span>
              </label>
            </div>
            <div class="flex justify-end">
              <button 
                @click="addSpreadsheet"
                :disabled="!newSpreadsheet.key || !newSpreadsheet.spreadsheetId || !newSpreadsheet.name"
                class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50"
              >
                <PlusIcon class="w-5 h-5 inline-block mr-2" />
                Ekle
              </button>
            </div>
          </div>
        </div>

        <!-- Spreadsheets List -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Kayıtlı Spreadsheet'ler</h2>
            <button 
              @click="loadSpreadsheets" 
              :disabled="loading"
              class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400"
            >
              <ArrowPathIcon class="w-5 h-5" :class="{ 'animate-spin': loading }" />
            </button>
          </div>

          <div v-if="spreadsheets.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
            Henüz spreadsheet eklenmemiş
          </div>

          <div v-else class="space-y-4">
            <div 
              v-for="sheet in spreadsheets" 
              :key="sheet.id"
              class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <span class="font-semibold text-gray-800 dark:text-white">{{ sheet.name }}</span>
                    <span class="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                      {{ sheet.key }}
                    </span>
                    <span 
                      v-if="sheet.isReadOnly" 
                      class="px-2 py-0.5 text-xs rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                    >
                      Sadece Okuma
                    </span>
                    <span 
                      :class="sheet.isActive ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'"
                      class="px-2 py-0.5 text-xs rounded-full"
                    >
                      {{ sheet.isActive ? 'Aktif' : 'Pasif' }}
                    </span>
                  </div>
                  <p v-if="sheet.description" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {{ sheet.description }}
                  </p>
                  <div class="text-xs text-gray-400 dark:text-gray-500 mt-2 font-mono">
                    ID: {{ sheet.spreadsheetId }}
                  </div>
                  <div v-if="sheet.lastSync" class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Son sync: {{ formatDate(sheet.lastSync) }}
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <a 
                    :href="`https://docs.google.com/spreadsheets/d/${sheet.spreadsheetId}/edit`"
                    target="_blank"
                    class="p-2 text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg"
                    title="Google Sheets'te Aç"
                  >
                    <ArrowTopRightOnSquareIcon class="w-5 h-5" />
                  </a>
                  <NuxtLink 
                    :to="`/spreadsheet-viewer?key=${sheet.key}`"
                    class="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg"
                    title="İçeriği Görüntüle"
                  >
                    <TableCellsIcon class="w-5 h-5" />
                  </NuxtLink>
                  <button 
                    @click="toggleSpreadsheetStatus(sheet)"
                    class="p-2 rounded-lg"
                    :class="sheet.isActive ? 'text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/30' : 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30'"
                    :title="sheet.isActive ? 'Pasif Yap' : 'Aktif Yap'"
                  >
                    <PauseCircleIcon class="w-5 h-5" v-if="sheet.isActive" />
                    <PlayCircleIcon class="w-5 h-5" v-else />
                  </button>
                  <button 
                    @click="deleteSpreadsheet(sheet)"
                    class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
                    title="Sil"
                  >
                    <TrashIcon class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Message -->
      <div v-if="message" class="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg" :class="messageType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'">
        {{ message }}
      </div>

    </div>
  </div>
</template>

<script setup>
import { ArrowPathIcon, ArrowTopRightOnSquareIcon, ArrowUpOnSquareIcon, CheckBadgeIcon, CheckIcon, EyeIcon, EyeSlashIcon, LinkIcon, PauseCircleIcon, PlayCircleIcon, PlusIcon, TableCellsIcon, TrashIcon, WifiIcon } from '@heroicons/vue/24/outline'
import { ref, onMounted } from 'vue'

const api = useApi()

// State
const activeTab = ref('oauth')
const loading = ref(false)
const saving = ref(false)
const syncing = ref(false)
const testing = ref(false)
const showSecret = ref(false)
const message = ref('')
const messageType = ref('success')

const status = ref({
  isInitialized: false,
  isConfigured: false,
  lastSync: null,
  lastTokenRefresh: null,
})

const settings = ref({
  clientId: '',
  clientSecret: '',
  clientSecretSet: false,
  redirectUri: '',
  refreshTokenSet: false,
})

const spreadsheets = ref([])

const newSpreadsheet = ref({
  key: '',
  name: '',
  spreadsheetId: '',
  description: '',
  isReadOnly: true,
})

// OAuth Methods
async function loadStatus() {
  loading.value = true
  try {
    const response = await api(`/sales-sheet-sync/status`)
    if (response?.success) {
      status.value = {
        isInitialized: response.data.isInitialized,
        isConfigured: response.data.isConfigured,
        lastSync: response.data.lastSync,
        lastTokenRefresh: response.data.lastTokenRefresh,
      }
    }
  } catch (error) {
    showMessage('Durum yüklenemedi: ' + error.message, 'error')
  } finally {
    loading.value = false
  }
}

async function loadSettings() {
  try {
    const response = await api(`/sales-sheet-sync/settings`)
    if (response?.success) {
      settings.value = {
        clientId: response.data.clientId || '',
        clientSecret: '',
        clientSecretSet: response.data.clientSecretSet,
        redirectUri: response.data.redirectUri || '',
        refreshTokenSet: response.data.refreshTokenSet,
      }
    }
  } catch (error) {
    showMessage('Ayarlar yüklenemedi: ' + error.message, 'error')
  }
}

async function saveSettings() {
  saving.value = true
  try {
    const payload = {
      clientId: settings.value.clientId,
      redirectUri: settings.value.redirectUri,
    }
    
    if (settings.value.clientSecret) {
      payload.clientSecret = settings.value.clientSecret
    }

    const response = await api(`/sales-sheet-sync/settings`, {
      method: 'PUT',
      body: payload,
    })
    
    if (response?.success) {
      showMessage('Ayarlar kaydedildi', 'success')
      settings.value.clientSecret = ''
      await loadStatus()
      await loadSettings()
    } else {
      showMessage('Kaydetme hatası: ' + response?.message, 'error')
    }
  } catch (error) {
    showMessage('Kaydetme hatası: ' + error.message, 'error')
  } finally {
    saving.value = false
  }
}

async function reinitialize() {
  loading.value = true
  try {
    const response = await api(`/sales-sheet-sync/reinitialize`, { method: 'POST' })
    showMessage(response?.message || 'Yeniden başlatıldı', response?.success ? 'success' : 'error')
    await loadStatus()
  } catch (error) {
    showMessage('Yeniden başlatma hatası: ' + error.message, 'error')
  } finally {
    loading.value = false
  }
}

async function startOAuth() {
  try {
    const response = await api(`/sales-sheet-sync/auth-url`)
    if (response?.success && response.url) {
      window.open(response.url, '_blank')
      showMessage('Google yetkilendirme sayfası açıldı. Tamamladıktan sonra sayfayı yenileyin.', 'success')
    } else {
      showMessage('OAuth URL alınamadı: ' + (response?.error || 'Bilinmeyen hata'), 'error')
    }
  } catch (error) {
    showMessage('OAuth başlatma hatası: ' + error.message, 'error')
  }
}

async function triggerSync() {
  syncing.value = true
  try {
    const response = await api(`/sales-sheet-sync/sync`, { method: 'GET' })
    showMessage(response?.message || 'Sync tamamlandı', response?.success ? 'success' : 'error')
    await loadStatus()
  } catch (error) {
    showMessage('Sync hatası: ' + error.message, 'error')
  } finally {
    syncing.value = false
  }
}

async function testConnection() {
  testing.value = true
  try {
    const response = await api(`/sales-sheet-sync/test-connection`)
    if (response?.success) {
      showMessage(`Bağlantı başarılı! Toplam satış: $${response.sampleData?.totalSalesUsd || 0}`, 'success')
    } else {
      showMessage('Bağlantı hatası: ' + response?.error, 'error')
    }
  } catch (error) {
    showMessage('Test hatası: ' + error.message, 'error')
  } finally {
    testing.value = false
  }
}

// Spreadsheet Methods
async function loadSpreadsheets() {
  loading.value = true
  try {
    const response = await api(`/spreadsheets`)
    if (response?.success) {
      spreadsheets.value = response.data || []
    }
  } catch (error) {
    showMessage('Spreadsheet\'ler yüklenemedi: ' + error.message, 'error')
  } finally {
    loading.value = false
  }
}

async function addSpreadsheet() {
  try {
    const response = await api(`/spreadsheets`, {
      method: 'POST',
      body: newSpreadsheet.value,
    })
    
    if (response?.success) {
      showMessage('Spreadsheet eklendi', 'success')
      newSpreadsheet.value = { key: '', name: '', spreadsheetId: '', description: '', isReadOnly: true }
      await loadSpreadsheets()
    } else {
      showMessage('Ekleme hatası: ' + response?.error, 'error')
    }
  } catch (error) {
    showMessage('Ekleme hatası: ' + error.message, 'error')
  }
}

async function toggleSpreadsheetStatus(sheet) {
  try {
    const response = await api(`/spreadsheets/${sheet.id}`, {
      method: 'PUT',
      body: { isActive: !sheet.isActive },
    })
    
    if (response?.success) {
      showMessage('Durum güncellendi', 'success')
      await loadSpreadsheets()
    }
  } catch (error) {
    showMessage('Güncelleme hatası: ' + error.message, 'error')
  }
}

async function deleteSpreadsheet(sheet) {
  if (!confirm(`"${sheet.name}" spreadsheet'ini silmek istediğinize emin misiniz?`)) return
  
  try {
    const response = await api(`/spreadsheets/${sheet.id}`, { method: 'DELETE' })
    if (response?.success) {
      showMessage('Spreadsheet silindi', 'success')
      await loadSpreadsheets()
    }
  } catch (error) {
    showMessage('Silme hatası: ' + error.message, 'error')
  }
}

// Helpers
function showMessage(msg, type = 'success') {
  message.value = msg
  messageType.value = type
  setTimeout(() => { message.value = '' }, 4000)
}

function formatDate(dateString) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString('tr-TR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

// Lifecycle
onMounted(async () => {
  await loadStatus()
  await loadSettings()
  await loadSpreadsheets()
})
</script>