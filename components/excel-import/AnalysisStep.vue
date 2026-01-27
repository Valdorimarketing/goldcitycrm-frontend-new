<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="h-12 w-12 mx-auto border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Dosya analiz ediliyor...</p>
    </div>

    <!-- Analysis Results -->
    <template v-else-if="analysis">
      <!-- Stats Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <TableCellsIcon class="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ analysis.rowCount.toLocaleString() }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Toplam Satir</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <ViewColumnsIcon class="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ analysis.columns.length }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Sutun Sayisi</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <ClockIcon class="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatEstimatedTime(analysis.estimatedImportTime) }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Tahmini Sure</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <CheckBadgeIcon class="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ matchedColumnsCount }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Eslesen Sutun</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Validation Warnings -->
      <div v-if="analysis.validationResults.warnings.length > 0" class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
        <div class="flex gap-3">
          <ExclamationTriangleIcon class="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p class="font-medium text-amber-800 dark:text-amber-200 mb-2">Uyarilar</p>
            <ul class="list-disc list-inside space-y-1 text-sm text-amber-700 dark:text-amber-300">
              <li v-for="(warning, index) in analysis.validationResults.warnings" :key="index">{{ warning }}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Validation Errors -->
      <div v-if="analysis.validationResults.errors.length > 0" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
        <div class="flex gap-3">
          <XCircleIcon class="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p class="font-medium text-red-800 dark:text-red-200 mb-2">Hatalar</p>
            <ul class="list-disc list-inside space-y-1 text-sm text-red-700 dark:text-red-300">
              <li v-for="(error, index) in analysis.validationResults.errors" :key="index">{{ error }}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Column Mapping Table -->
      <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <div class="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <h4 class="font-medium text-gray-900 dark:text-white">Sutun Eslestirme</h4>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {{ matchedColumnsCount }} sutun eslesti, {{ skippedColumnsCount }} sutun atlanacak
          </p>
        </div>

        <div class="overflow-x-auto max-h-64 overflow-y-auto">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-gray-900 sticky top-0">
              <tr>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Excel Sutunu</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Ornek Degerler</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Veri Tipi</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Hedef Alan</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="column in analysis.columns" :key="column.name" class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td class="px-4 py-3">
                  <span class="font-medium text-gray-900 dark:text-white">{{ column.name }}</span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="(sample, idx) in column.sampleValues.slice(0, 3)"
                      :key="idx"
                      class="inline-block px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                    >
                      {{ sample.length > 20 ? sample.slice(0, 20) + '...' : sample }}
                    </span>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <span :class="['px-2 py-0.5 text-xs rounded', getDataTypeClass(column.dataType)]">
                    {{ getDataTypeLabel(column.dataType) }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <select
                    :value="columnMappings[column.name] || column.suggestedMapping || ''"
                    @change="updateMapping(column.name, ($event.target as HTMLSelectElement).value)"
                    class="w-full px-2 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">-- Atla --</option>
                    <option v-for="field in targetFields" :key="field.value" :value="field.value">
                      {{ field.label }}
                    </option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  TableCellsIcon,
  ViewColumnsIcon,
  ClockIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon,
  XCircleIcon
} from '@heroicons/vue/24/outline'

interface ColumnAnalysis {
  name: string
  sampleValues: string[]
  suggestedMapping: string | null
  dataType: 'string' | 'number' | 'date' | 'email' | 'phone'
  emptyCount: number
  uniqueCount: number
  totalCount: number
}

interface ValidationResults {
  errors: string[]
  warnings: string[]
  duplicatePhones: number
  duplicateEmails: number
  missingRequiredFields: number
  existingPhonesInDb: number
  existingEmailsInDb: number
}

interface AnalysisResult {
  success: boolean
  fileId: string
  fileName: string
  fileSize: number
  rowCount: number
  columns: ColumnAnalysis[]
  estimatedImportTime: number
  validationResults: ValidationResults
}

const props = defineProps<{
  analysis: AnalysisResult | null
  loading: boolean
  columnMappings: Record<string, string>
}>()

const emit = defineEmits<{
  (e: 'update:columnMappings', value: Record<string, string>): void
}>()

const { formatEstimatedTime, getTargetFields } = useExcelImport()

const targetFields = getTargetFields()

const matchedColumnsCount = computed(() => {
  if (!props.analysis) return 0
  return props.analysis.columns.filter(c => {
    const mapping = props.columnMappings[c.name] || c.suggestedMapping
    return mapping && mapping !== ''
  }).length
})

const skippedColumnsCount = computed(() => {
  if (!props.analysis) return 0
  return props.analysis.columns.length - matchedColumnsCount.value
})

const updateMapping = (columnName: string, value: string) => {
  const newMappings = { ...props.columnMappings, [columnName]: value }
  emit('update:columnMappings', newMappings)
}

const getDataTypeClass = (dataType: string): string => {
  const classes: Record<string, string> = {
    string: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
    number: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    date: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    email: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    phone: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  }
  return classes[dataType] || classes.string
}

const getDataTypeLabel = (dataType: string): string => {
  const labels: Record<string, string> = {
    string: 'Metin',
    number: 'Sayi',
    date: 'Tarih',
    email: 'E-posta',
    phone: 'Telefon',
  }
  return labels[dataType] || 'Metin'
}
</script>
