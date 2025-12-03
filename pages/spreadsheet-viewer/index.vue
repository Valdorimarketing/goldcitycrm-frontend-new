<template>
  <div class="p-4 md:p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
    <div class="max-w-7xl mx-auto">
      
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <div class="flex items-center gap-3">
            <NuxtLink 
              to="/sheets-sync" 
              class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
            >
              <ArrowLeftIcon class="h-5 w-5" />
            </NuxtLink>
            <div>
              <h1 class="text-2xl font-bold text-gray-800 dark:text-white">
                {{ spreadsheetInfo?.name || 'Spreadsheet Viewer' }}
              </h1>
              <p class="text-gray-600 dark:text-gray-400 text-sm">
                {{ spreadsheetInfo?.description || 'Google Sheets içeriğini görüntüle' }}
              </p>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <a 
            v-if="spreadsheetInfo?.spreadsheetId"
            :href="`https://docs.google.com/spreadsheets/d/${spreadsheetInfo.spreadsheetId}/edit`"
            target="_blank"
            class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium"
          >
            <i class="i-lucide-external-link mr-2"></i>
            Google'da Aç
          </a>
          <button 
            @click="loadSheetData"
            :disabled="loading"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50"
          >
            <i class="i-lucide-refresh-cw mr-2" :class="{ 'animate-spin': loading }"></i>
            Yenile
          </button>
        </div>
      </div>

      <!-- Spreadsheet Selector (if no key provided) -->
      <div v-if="!selectedKey" class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Spreadsheet Seçin</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            v-for="sheet in spreadsheets" 
            :key="sheet.key"
            @click="selectSpreadsheet(sheet.key)"
            class="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-all text-left"
          >
            <div class="font-semibold text-gray-800 dark:text-white">{{ sheet.name }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">{{ sheet.key }}</div>
          </button>
        </div>
      </div>

      <!-- Sheet Tabs -->
      <div v-if="selectedKey && sheets.length > 0" class="bg-white dark:bg-gray-800 rounded-t-xl shadow-md">
        <div class="flex items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          <button 
            v-for="sheet in sheets" 
            :key="sheet.sheetId"
            @click="selectSheet(sheet.title)"
            :class="selectedSheet === sheet.title 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
            class="px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors"
          >
            {{ sheet.title }}
            <span class="ml-1 text-xs opacity-70">({{ sheet.rowCount }})</span>
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="bg-white dark:bg-gray-800 rounded-b-xl shadow-md p-12">
        <div class="flex flex-col items-center justify-center">
          <i class="i-lucide-loader-2 text-4xl text-blue-500 animate-spin mb-4"></i>
          <p class="text-gray-500 dark:text-gray-400">Veriler yükleniyor...</p>
        </div>
      </div>

      <!-- Data Table -->
      <div v-else-if="selectedKey && selectedSheet && sheetData" class="bg-white dark:bg-gray-800 rounded-b-xl shadow-md">
        <!-- Table Info -->
        <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ sheetData.rowCount }} satır, {{ sheetData.columnCount }} sütun
          </div>
          <div class="flex items-center gap-2">
            <!-- Search -->
            <div class="relative">
              <input 
                v-model="searchQuery"
                type="text"
                placeholder="Ara..."
                class="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm w-64"
              />
              <i class="i-lucide-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>
            <!-- Export -->
            <button 
              @click="exportToCSV"
              class="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
            >
              <i class="i-lucide-download mr-1"></i>
              CSV
            </button>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-12">
                  #
                </th>
                <th 
                  v-for="(header, index) in sheetData.headers" 
                  :key="index"
                  class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  @click="sortBy(index)"
                >
                  <div class="flex items-center gap-1">
                    {{ header || `Sütun ${index + 1}` }}
                    <i 
                      v-if="sortColumn === index"
                      :class="sortDirection === 'asc' ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                      class="text-blue-500"
                    ></i>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr 
                v-for="(row, rowIndex) in paginatedRows" 
                :key="rowIndex"
                class="hover:bg-gray-50 dark:hover:bg-gray-700/30"
              >
                <td class="px-4 py-3 text-sm text-gray-400 dark:text-gray-500">
                  {{ (currentPage - 1) * pageSize + rowIndex + 1 }}
                </td>
                <td 
                  v-for="(cell, cellIndex) in row" 
                  :key="cellIndex"
                  class="px-4 py-3 text-sm text-gray-800 dark:text-gray-200"
                >
                  <span 
                    v-if="cell && cell.length > 100" 
                    :title="cell"
                    class="cursor-help"
                  >
                    {{ cell.substring(0, 100) }}...
                  </span>
                  <span v-else>{{ cell || '-' }}</span>
                </td>
              </tr>
              <tr v-if="filteredRows.length === 0">
                <td :colspan="sheetData.headers.length + 1" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  {{ searchQuery ? 'Sonuç bulunamadı' : 'Veri yok' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, filteredRows.length) }} / {{ filteredRows.length }}
          </div>
          <div class="flex items-center gap-2">
            <button 
              @click="currentPage = 1"
              :disabled="currentPage === 1"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              <i class="i-lucide-chevrons-left"></i>
            </button>
            <button 
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              <i class="i-lucide-chevron-left"></i>
            </button>
            <span class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
              {{ currentPage }} / {{ totalPages }}
            </span>
            <button 
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              <i class="i-lucide-chevron-right"></i>
            </button>
            <button 
              @click="currentPage = totalPages"
              :disabled="currentPage === totalPages"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              <i class="i-lucide-chevrons-right"></i>
            </button>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500 dark:text-gray-400">Sayfa başına:</span>
            <select 
              v-model="pageSize"
              @change="currentPage = 1"
              class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
            >
              <option :value="25">25</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
              <option :value="500">500</option>
            </select>
          </div>
        </div>
      </div>

      <!-- No Sheet Selected -->
      <div v-else-if="selectedKey && !loading && sheets.length === 0" class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12">
        <div class="text-center text-gray-500 dark:text-gray-400">
          <i class="i-lucide-file-spreadsheet text-4xl mb-4 opacity-50"></i>
          <p>Bu spreadsheet'te sayfa bulunamadı</p>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-lg mt-4">
        {{ error }}
      </div>

    </div>
  </div>
</template>

<script setup>
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const api = useApi()

// State
const loading = ref(false)
const error = ref('')
const spreadsheets = ref([])
const selectedKey = ref('')
const spreadsheetInfo = ref(null)
const sheets = ref([])
const selectedSheet = ref('')
const sheetData = ref(null)

// Table State
const searchQuery = ref('')
const sortColumn = ref(-1)
const sortDirection = ref('asc')
const currentPage = ref(1)
const pageSize = ref(50)

// Computed
const filteredRows = computed(() => {
  if (!sheetData.value?.rows) return []
  
  let rows = [...sheetData.value.rows]
  
  // Search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    rows = rows.filter(row => 
      row.some(cell => cell?.toString().toLowerCase().includes(query))
    )
  }
  
  // Sort
  if (sortColumn.value >= 0) {
    rows.sort((a, b) => {
      const aVal = a[sortColumn.value] || ''
      const bVal = b[sortColumn.value] || ''
      
      // Try numeric sort
      const aNum = parseFloat(aVal)
      const bNum = parseFloat(bVal)
      
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return sortDirection.value === 'asc' ? aNum - bNum : bNum - aNum
      }
      
      // String sort
      return sortDirection.value === 'asc' 
        ? aVal.toString().localeCompare(bVal.toString())
        : bVal.toString().localeCompare(aVal.toString())
    })
  }
  
  return rows
})

const totalPages = computed(() => Math.ceil(filteredRows.value.length / pageSize.value))

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredRows.value.slice(start, start + pageSize.value)
})

// Methods
async function loadSpreadsheets() {
  try {
    const response = await api(`/spreadsheets/active`)
    if (response?.success) {
      spreadsheets.value = response.data || []
    }
  } catch (err) {
    error.value = 'Spreadsheet listesi yüklenemedi'
  }
}

async function selectSpreadsheet(key) {
  selectedKey.value = key
  router.replace({ query: { key } })
  await loadSpreadsheetInfo()
}

async function loadSpreadsheetInfo() {
  if (!selectedKey.value) return
  
  loading.value = true
  error.value = ''
  
  try {
    // Get spreadsheet record
    const recordRes = await api(`/spreadsheets/by-key/${selectedKey.value}`)
    if (recordRes?.success) {
      spreadsheetInfo.value = recordRes.data
    }
    
    // Get sheets from Google
    const infoRes = await api(`/spreadsheets/by-key/${selectedKey.value}/info`)
    if (infoRes?.success) {
      sheets.value = infoRes.data.sheets || []
      
      // Auto-select first sheet
      if (sheets.value.length > 0 && !selectedSheet.value) {
        selectedSheet.value = sheets.value[0].title
        await loadSheetData()
      }
    } else {
      error.value = infoRes?.error || 'Spreadsheet bilgileri alınamadı'
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

async function selectSheet(sheetName) {
  selectedSheet.value = sheetName
  currentPage.value = 1
  searchQuery.value = ''
  sortColumn.value = -1
  await loadSheetData()
}

async function loadSheetData() {
  if (!selectedKey.value || !selectedSheet.value) return
  
  loading.value = true
  error.value = ''
  
  try {
    const response = await api(`/spreadsheets/by-key/${selectedKey.value}/sheet/${encodeURIComponent(selectedSheet.value)}`)
    
    if (response?.success) {
      sheetData.value = response.data
    } else {
      error.value = response?.error || 'Sayfa verileri alınamadı'
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

function sortBy(columnIndex) {
  if (sortColumn.value === columnIndex) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = columnIndex
    sortDirection.value = 'asc'
  }
  currentPage.value = 1
}

function exportToCSV() {
  if (!sheetData.value) return
  
  const headers = sheetData.value.headers.join(',')
  const rows = filteredRows.value.map(row => 
    row.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join(',')
  ).join('\n')
  
  const csv = `${headers}\n${rows}`
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${selectedSheet.value || 'export'}.csv`
  link.click()
}

// Watch search to reset page
watch(searchQuery, () => {
  currentPage.value = 1
})

// Lifecycle
onMounted(async () => {
  await loadSpreadsheets()
  
  // Check URL for key
  if (route.query.key) {
    selectedKey.value = route.query.key
    await loadSpreadsheetInfo()
  }
})
</script>