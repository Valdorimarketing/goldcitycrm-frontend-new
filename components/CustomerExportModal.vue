<template>
  <div v-if="isopen" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black/50 transition-opacity" @click="close"></div>

    <!-- Modal -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Excel/CSV Dışa Aktar</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Dışa aktarılacak sütunları seçin</p>
          </div>
          <button @click="close" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>

        <!-- Body -->
        <div class="px-6 py-4 overflow-y-auto max-h-[50vh]">
          <!-- Toplu Seçim -->
          <div class="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center gap-3">
              <button
                @click="selectAll"
                class="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              >
                Tümünü Seç
              </button>
              <button
                @click="deselectAll"
                class="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Tümünü Kaldır
              </button>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ selectedColumns.length }} / {{ availableColumns.length }} sütun seçildi
              </span>
            </div>
          </div>

          <!-- Sütun Listesi -->
          <div class="grid grid-cols-2 gap-3">
            <div
              v-for="column in availableColumns"
              :key="column.key"
              class="flex items-center"
            >
              <input
                :id="column.key"
                type="checkbox"
                :value="column.key"
                v-model="selectedColumns"
                class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label
                :for="column.key"
                class="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                {{ column.label }}
              </label>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            Format seçin:
          </div>
          <div class="flex items-center gap-3">
            <button
              @click="exportData('csv')"
              :disabled="selectedColumns.length === 0"
              class="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
            >
              <DocumentTextIcon class="h-4 w-4" />
              CSV İndir
            </button>
            <button
              @click="exportData('excel')"
              :disabled="selectedColumns.length === 0"
              class="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
            >
              <DocumentChartBarIcon class="h-4 w-4" />
              Excel İndir
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { XMarkIcon, DocumentTextIcon, DocumentChartBarIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  isopen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'export'])

const availableColumns = ref([
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Ad' },
  { key: 'surname', label: 'Soyad' },
  { key: 'title', label: 'Unvan' },
  { key: 'email', label: 'E-posta' },
  { key: 'gender', label: 'Cinsiyet' },
  { key: 'birthDate', label: 'Doğum Tarihi' },
  { key: 'patient', label: 'Hastalık' },
  { key: 'phone', label: 'Telefon' },
  { key: 'source', label: 'Kaynak' },
  { key: 'job', label: 'Meslek' },
  { key: 'identityNumber', label: 'TC Kimlik No' },
  { key: 'referanceCustomer', label: 'Referans Müşteri' },
  { key: 'status', label: 'Durum' },
  { key: 'website', label: 'Web Sitesi' },
  { key: 'country', label: 'Ülke' },
  { key: 'state', label: 'İl' },
  { key: 'city', label: 'İlçe' },
  { key: 'district', label: 'Mahalle' },
  { key: 'postalCode', label: 'Posta Kodu' },
  { key: 'address', label: 'Adres' },
  { key: 'url', label: 'URL' },
  { key: 'checkupPackage', label: 'Checkup Paketi' },
  { key: 'relevantUser', label: 'Atanan Kullanıcı' },
  { key: 'description', label: 'Açıklama' },
  { key: 'relatedTransaction', label: 'İlgilenilen Konu' },
  { key: 'remindingDate', label: 'Hatırlatma Tarihi' },
  { key: 'isActive', label: 'Aktif' },
  { key: 'createdAt', label: 'Eklenme Tarihi' },
  { key: 'updatedAt', label: 'Güncellenme Tarihi' },
])

const selectedColumns = ref([
  'id', 'name', 'surname', 'phone', 'email', 'source', 'status', 
  'relevantUser', 'isActive', 'createdAt'
])

const selectAll = () => {
  selectedColumns.value = availableColumns.value.map(col => col.key)
}

const deselectAll = () => {
  selectedColumns.value = []
}

const exportData = (format) => {
  if (selectedColumns.value.length === 0) {
    return
  }
  
  emit('export', {
    format,
    columns: selectedColumns.value
  })
}

const close = () => {
  emit('close')
}

// Modal açıldığında body scroll'u kapat
watch(() => props.isopen, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>