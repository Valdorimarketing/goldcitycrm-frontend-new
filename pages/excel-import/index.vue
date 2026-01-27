<template>
  <div class="min-h-screen">
    <!-- Header Section -->
    <div class="mb-8">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg shadow-emerald-500/25">
              <ArrowUpTrayIcon class="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                Excel Veri Aktarma
              </h1>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Excel dosyalarindan musteri ve not verilerini iceri aktarin
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stepper -->
    <div class="mb-8">
      <div class="flex items-center justify-center">
        <div v-for="(step, index) in steps" :key="step.id" class="flex items-center">
          <div class="flex flex-col items-center">
            <div :class="[
              'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all',
              currentStep > index
                ? 'bg-emerald-500 text-white'
                : currentStep === index
                  ? 'bg-rose-500 text-white ring-4 ring-rose-500/20'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            ]">
              <CheckIcon v-if="currentStep > index" class="w-5 h-5" />
              <span v-else>{{ index + 1 }}</span>
            </div>
            <span :class="[
              'mt-2 text-xs font-medium',
              currentStep >= index ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'
            ]">
              {{ step.name }}
            </span>
          </div>
          <div v-if="index < steps.length - 1" :class="[
            'w-20 h-1 mx-2 rounded',
            currentStep > index ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'
          ]"></div>
        </div>
      </div>
    </div>

    <!-- Step Content -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">

      <!-- Step 1: File Upload -->
      <div v-if="currentStep === 0" class="space-y-6">
        <div class="text-center">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Excel Dosyasi Yukle</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Musteri verilerini iceren Excel dosyanizi secin (.xlsx veya .xls)
          </p>
        </div>

        <!-- Kisiler File Upload -->
        <div class="space-y-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Kisiler Dosyasi (Zorunlu)
          </label>
          <div
            @drop.prevent="handleDrop($event, 'kisiler')"
            @dragover.prevent="dragOver = 'kisiler'"
            @dragleave="dragOver = null"
            :class="[
              'relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer',
              dragOver === 'kisiler'
                ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-rose-400 dark:hover:border-rose-500'
            ]"
            @click="triggerFileInput('kisiler')"
          >
            <input
              ref="kisilerInput"
              type="file"
              accept=".xlsx,.xls"
              class="hidden"
              @change="handleFileSelect($event, 'kisiler')"
            />

            <div v-if="!kisilerFile">
              <DocumentArrowUpIcon class="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Dosyayi suruklep birakin veya <span class="text-rose-500 font-medium">gozat</span>
              </p>
              <p class="text-xs text-gray-400 mt-1">Excel dosyalari (.xlsx, .xls) - Max 100MB</p>
            </div>

            <div v-else class="flex items-center justify-center gap-3">
              <DocumentIcon class="w-10 h-10 text-emerald-500" />
              <div class="text-left">
                <p class="font-medium text-gray-900 dark:text-white">{{ kisilerFile.name }}</p>
                <p class="text-sm text-gray-500">{{ formatFileSize(kisilerFile.size) }}</p>
              </div>
              <button
                @click.stop="kisilerFile = null; kisilerAnalysis = null"
                class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <XMarkIcon class="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        <!-- Notlar File Upload (Optional) -->
        <div class="space-y-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Notlar Dosyasi (Opsiyonel)
          </label>
          <div
            @drop.prevent="handleDrop($event, 'notlar')"
            @dragover.prevent="dragOver = 'notlar'"
            @dragleave="dragOver = null"
            :class="[
              'relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer',
              dragOver === 'notlar'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
            ]"
            @click="triggerFileInput('notlar')"
          >
            <input
              ref="notlarInput"
              type="file"
              accept=".xlsx,.xls"
              class="hidden"
              @change="handleFileSelect($event, 'notlar')"
            />

            <div v-if="!notlarFile">
              <DocumentArrowUpIcon class="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Dosyayi suruklep birakin veya <span class="text-blue-500 font-medium">gozat</span>
              </p>
              <p class="text-xs text-gray-400 mt-1">Notlar dosyasi (opsiyonel)</p>
            </div>

            <div v-else class="flex items-center justify-center gap-3">
              <DocumentIcon class="w-10 h-10 text-blue-500" />
              <div class="text-left">
                <p class="font-medium text-gray-900 dark:text-white">{{ notlarFile.name }}</p>
                <p class="text-sm text-gray-500">{{ formatFileSize(notlarFile.size) }}</p>
              </div>
              <button
                @click.stop="notlarFile = null; notlarAnalysis = null"
                class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <XMarkIcon class="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        <!-- Upload Progress -->
        <div v-if="uploading" class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400">Yukleniyor...</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ uploadProgress }}%</span>
          </div>
          <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-rose-500 to-rose-600 transition-all duration-300"
              :style="{ width: `${uploadProgress}%` }"
            ></div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-3 pt-4">
          <button
            @click="uploadAndAnalyze"
            :disabled="!kisilerFile || uploading"
            class="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl hover:from-rose-600 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
          >
            <ArrowUpTrayIcon class="w-5 h-5" />
            Yukle ve Analiz Et
          </button>
        </div>
      </div>

      <!-- Step 2: Analysis -->
      <div v-if="currentStep === 1" class="space-y-6">
        <div class="text-center">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Dosya Analizi</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Yuklenen dosyalariniz analiz edildi
          </p>
        </div>

        <!-- Kisiler Analysis -->
        <div v-if="kisilerAnalysis" class="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-gray-900 dark:text-white">Kisiler Dosyasi</h3>
            <span class="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-medium rounded-full">
              {{ kisilerAnalysis.rowCount }} satir
            </span>
          </div>

          <!-- Validation Results -->
          <div v-if="kisilerAnalysis.validationResults" class="space-y-2">
            <div v-if="kisilerAnalysis.validationResults.warnings.length > 0" class="space-y-1">
              <div v-for="warning in kisilerAnalysis.validationResults.warnings" :key="warning"
                class="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <ExclamationTriangleIcon class="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <span class="text-sm text-amber-700 dark:text-amber-400">{{ warning }}</span>
              </div>
            </div>

            <div v-if="kisilerAnalysis.validationResults.errors.length > 0" class="space-y-1">
              <div v-for="error in kisilerAnalysis.validationResults.errors" :key="error"
                class="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <XCircleIcon class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span class="text-sm text-red-700 dark:text-red-400">{{ error }}</span>
              </div>
            </div>
          </div>

          <!-- Column Mapping Preview -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Sutun Eslestirmesi</h4>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
              <div v-for="col in kisilerAnalysis.columns.slice(0, 9)" :key="col.name"
                class="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div class="w-2 h-2 rounded-full" :class="col.suggestedMapping ? 'bg-emerald-500' : 'bg-gray-300'"></div>
                <span class="text-xs text-gray-600 dark:text-gray-400 truncate">{{ col.name }}</span>
                <ArrowRightIcon class="w-3 h-3 text-gray-400 flex-shrink-0" />
                <span class="text-xs font-medium" :class="col.suggestedMapping ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'">
                  {{ col.suggestedMapping ? getFieldLabel(col.suggestedMapping) : '-' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Notlar Analysis -->
        <div v-if="notlarAnalysis" class="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-gray-900 dark:text-white">Notlar Dosyasi</h3>
            <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium rounded-full">
              {{ notlarAnalysis.rowCount }} satir
            </span>
          </div>
        </div>

        <!-- Update Existing Records Option -->
        <div class="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 space-y-4">
          <div class="flex items-start gap-3">
            <input
              id="updateExisting"
              v-model="updateExisting"
              type="checkbox"
              class="mt-1 w-4 h-4 text-rose-500 bg-gray-100 border-gray-300 rounded focus:ring-rose-500 dark:bg-gray-700 dark:border-gray-600"
            />
            <div class="flex-1">
              <label for="updateExisting" class="block font-medium text-gray-900 dark:text-white cursor-pointer">
                Mevcut kayitlari guncelle
              </label>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Telefon veya e-posta ile eslesen mevcut musterilerin secili alanlarini gunceller
              </p>
            </div>
          </div>

          <!-- Field Selection (visible when updateExisting is checked) -->
          <div v-if="updateExisting" class="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Guncellenecek Alanlar
            </h4>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              <label
                v-for="field in updatableFields"
                :key="field.value"
                class="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-rose-300 dark:hover:border-rose-600 transition-colors"
                :class="{ 'border-rose-500 dark:border-rose-500 bg-rose-50 dark:bg-rose-900/20': fieldsToUpdate.includes(field.value) }"
              >
                <input
                  type="checkbox"
                  :value="field.value"
                  v-model="fieldsToUpdate"
                  class="w-4 h-4 text-rose-500 bg-gray-100 border-gray-300 rounded focus:ring-rose-500 dark:bg-gray-700 dark:border-gray-600"
                />
                <span class="text-sm text-gray-700 dark:text-gray-300">{{ field.label }}</span>
              </label>
            </div>
            <div class="flex gap-2 mt-3">
              <button
                type="button"
                @click="selectAllFields"
                class="text-xs text-rose-500 hover:text-rose-600 font-medium"
              >
                Tumunu Sec
              </button>
              <span class="text-gray-300 dark:text-gray-600">|</span>
              <button
                type="button"
                @click="clearAllFields"
                class="text-xs text-gray-500 hover:text-gray-600 font-medium"
              >
                Temizle
              </button>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-between gap-3 pt-4">
          <button
            @click="currentStep = 0"
            class="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all font-medium"
          >
            <ArrowLeftIcon class="w-5 h-5" />
            Geri
          </button>
          <button
            @click="startImportProcess"
            :disabled="importing || (kisilerAnalysis?.validationResults?.errors?.length > 0)"
            class="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
          >
            <PlayIcon class="w-5 h-5" />
            Aktarimi Baslat
          </button>
        </div>
      </div>

      <!-- Step 3: Import Progress -->
      <div v-if="currentStep === 2" class="space-y-6">
        <div class="text-center">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {{ importStatus?.status === 'completed' ? 'Aktarim Tamamlandi' : 'Aktarim Devam Ediyor' }}
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ importStatus?.currentStep || 'Veriler aktariliyor...' }}
          </p>
        </div>

        <!-- Progress Bar -->
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400">Ilerleme</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ importStatus?.progress || 0 }}%</span>
          </div>
          <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              class="h-full transition-all duration-500"
              :class="importStatus?.status === 'completed' ? 'bg-emerald-500' : 'bg-gradient-to-r from-rose-500 to-rose-600'"
              :style="{ width: `${importStatus?.progress || 0}%` }"
            ></div>
          </div>
          <div class="flex justify-between text-xs text-gray-500">
            <span>{{ importStatus?.processedRows || 0 }} / {{ importStatus?.totalRows || 0 }} satir</span>
          </div>
        </div>

        <!-- Stats -->
        <div v-if="importStatus" class="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div class="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 text-center">
            <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ importStatus.createdCustomers }}</p>
            <p class="text-xs text-emerald-700 dark:text-emerald-300">Olusturulan</p>
          </div>
          <div class="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center">
            <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ importStatus.updatedCustomers || 0 }}</p>
            <p class="text-xs text-purple-700 dark:text-purple-300">Guncellenen</p>
          </div>
          <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
            <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ importStatus.createdNotes }}</p>
            <p class="text-xs text-blue-700 dark:text-blue-300">Olusturulan Not</p>
          </div>
          <div class="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 text-center">
            <p class="text-2xl font-bold text-amber-600 dark:text-amber-400">{{ importStatus.skippedCount }}</p>
            <p class="text-xs text-amber-700 dark:text-amber-300">Atlanan</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
            <p class="text-2xl font-bold text-gray-600 dark:text-gray-300">{{ importStatus.processedRows }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">Islenen</p>
          </div>
        </div>

        <!-- Skip Reasons -->
        <div v-if="importStatus?.skippedReasons && importStatus.skippedCount > 0"
          class="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
          <h4 class="text-sm font-medium text-amber-800 dark:text-amber-300 mb-2">Atlama Nedenleri</h4>
          <ul class="space-y-1 text-sm text-amber-700 dark:text-amber-400">
            <li v-if="importStatus.skippedReasons.noPhoneOrEmail > 0">
              Telefon/E-posta eksik: {{ importStatus.skippedReasons.noPhoneOrEmail }}
            </li>
            <li v-if="importStatus.skippedReasons.duplicatePhone > 0">
              Mukerrer telefon: {{ importStatus.skippedReasons.duplicatePhone }}
            </li>
            <li v-if="importStatus.skippedReasons.duplicateEmail > 0">
              Mukerrer e-posta: {{ importStatus.skippedReasons.duplicateEmail }}
            </li>
          </ul>
        </div>

        <!-- Errors -->
        <div v-if="importStatus?.errors?.length > 0" class="bg-red-50 dark:bg-red-900/20 rounded-xl p-4">
          <h4 class="text-sm font-medium text-red-800 dark:text-red-300 mb-2">Hatalar</h4>
          <ul class="space-y-1 text-sm text-red-700 dark:text-red-400 max-h-40 overflow-y-auto">
            <li v-for="(error, idx) in importStatus.errors.slice(0, 10)" :key="idx">{{ error }}</li>
          </ul>
        </div>

        <!-- Completion Actions -->
        <div v-if="importStatus?.status === 'completed'" class="flex justify-center gap-3 pt-4">
          <button
            @click="resetForm"
            class="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all font-medium"
          >
            <ArrowPathIcon class="w-5 h-5" />
            Yeni Aktarim
          </button>
          <NuxtLink
            to="/customers"
            class="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl hover:from-rose-600 hover:to-rose-700 transition-all font-medium"
          >
            <UsersIcon class="w-5 h-5" />
            Musterilere Git
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useExcelImport } from '~/composables/useExcelImport'
import {
  ArrowUpTrayIcon,
  DocumentArrowUpIcon,
  DocumentIcon,
  XMarkIcon,
  CheckIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  PlayIcon,
  ArrowPathIcon,
  UsersIcon,
  ExclamationTriangleIcon,
  XCircleIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const {
  uploading,
  uploadProgress,
  analyzing,
  importing,
  importProgress,
  uploadFile,
  analyzeFile,
  startImport,
  pollJobStatus,
  formatFileSize,
  getFieldLabel,
  getUpdatableFields
} = useExcelImport()

const updatableFields = getUpdatableFields()

const steps = [
  { id: 1, name: 'Dosya Yukle' },
  { id: 2, name: 'Analiz' },
  { id: 3, name: 'Aktarim' }
]

const currentStep = ref(0)
const dragOver = ref(null)
const kisilerInput = ref(null)
const notlarInput = ref(null)

const kisilerFile = ref(null)
const notlarFile = ref(null)
const kisilerFileId = ref(null)
const notlarFileId = ref(null)
const kisilerAnalysis = ref(null)
const notlarAnalysis = ref(null)
const importStatus = ref(null)
const pollInterval = ref(null)

// Update existing records options
const updateExisting = ref(false)
const fieldsToUpdate = ref<string[]>([])

const selectAllFields = () => {
  fieldsToUpdate.value = updatableFields.map(f => f.value)
}

const clearAllFields = () => {
  fieldsToUpdate.value = []
}

const triggerFileInput = (type) => {
  if (type === 'kisiler') {
    kisilerInput.value?.click()
  } else {
    notlarInput.value?.click()
  }
}

const handleFileSelect = (event, type) => {
  const file = event.target.files?.[0]
  if (file) {
    if (type === 'kisiler') {
      kisilerFile.value = file
      kisilerAnalysis.value = null
    } else {
      notlarFile.value = file
      notlarAnalysis.value = null
    }
  }
}

const handleDrop = (event, type) => {
  dragOver.value = null
  const file = event.dataTransfer?.files?.[0]
  if (file) {
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (ext === 'xlsx' || ext === 'xls') {
      if (type === 'kisiler') {
        kisilerFile.value = file
        kisilerAnalysis.value = null
      } else {
        notlarFile.value = file
        notlarAnalysis.value = null
      }
    }
  }
}

const uploadAndAnalyze = async () => {
  try {
    // Upload kisiler file
    const kisilerResult = await uploadFile(kisilerFile.value)
    kisilerFileId.value = kisilerResult.fileId

    // Analyze kisiler file
    kisilerAnalysis.value = await analyzeFile(kisilerResult.fileId)

    // Upload and analyze notlar file if exists
    if (notlarFile.value) {
      const notlarResult = await uploadFile(notlarFile.value)
      notlarFileId.value = notlarResult.fileId
      notlarAnalysis.value = await analyzeFile(notlarResult.fileId)
    }

    currentStep.value = 1
  } catch (error) {
    console.error('Upload/Analyze error:', error)
    alert(error.message || 'Dosya yuklenirken bir hata olustu')
  }
}

const startImportProcess = async () => {
  try {
    const jobId = await startImport(
      kisilerFileId.value,
      notlarFileId.value,
      updateExisting.value,
      updateExisting.value ? fieldsToUpdate.value : undefined
    )
    currentStep.value = 2

    // Poll for progress
    await pollJobStatus(jobId, (status) => {
      importStatus.value = status
    })
  } catch (error) {
    console.error('Import error:', error)
    if (importStatus.value) {
      importStatus.value.status = 'failed'
      importStatus.value.errors = [error.message]
    }
  }
}

const resetForm = () => {
  currentStep.value = 0
  kisilerFile.value = null
  notlarFile.value = null
  kisilerFileId.value = null
  notlarFileId.value = null
  kisilerAnalysis.value = null
  notlarAnalysis.value = null
  importStatus.value = null
  updateExisting.value = false
  fieldsToUpdate.value = []
}

onUnmounted(() => {
  if (pollInterval.value) {
    clearInterval(pollInterval.value)
  }
})
</script>
