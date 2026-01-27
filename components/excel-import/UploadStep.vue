<template>
  <div class="space-y-6">
    <!-- Kisiler File Upload (Required) -->
    <div class="space-y-3">
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Kisiler Excel Dosyasi</span>
        <span class="text-xs text-red-500">*Zorunlu</span>
      </div>

      <div
        @dragover.prevent="onDragOver('kisiler')"
        @dragleave.prevent="onDragLeave('kisiler')"
        @drop.prevent="onDrop($event, 'kisiler')"
        :class="[
          'relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer',
          isDraggingKisiler
            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
            : kisilerFile
              ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
              : 'border-gray-300 dark:border-gray-600 hover:border-green-400 hover:bg-green-50/50 dark:hover:bg-green-900/10'
        ]"
        @click="triggerFileInput('kisiler')"
      >
        <input
          ref="kisilerInput"
          type="file"
          accept=".xlsx,.xls"
          class="hidden"
          @change="onFileSelect($event, 'kisiler')"
        />

        <template v-if="uploadingKisiler">
          <div class="space-y-3">
            <div class="h-12 w-12 mx-auto border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin"></div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Yukleniyor... {{ uploadProgress }}%</p>
            <div class="w-full max-w-xs mx-auto bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div class="bg-green-500 h-2 rounded-full transition-all" :style="{ width: `${uploadProgress}%` }"></div>
            </div>
          </div>
        </template>

        <template v-else-if="kisilerFile">
          <div class="space-y-2">
            <DocumentCheckIcon class="h-12 w-12 mx-auto text-green-500" />
            <p class="text-sm font-medium text-green-700 dark:text-green-400">{{ kisilerFile.name }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatFileSize(kisilerFile.size) }}</p>
            <button
              @click.stop="clearFile('kisiler')"
              class="text-xs text-red-500 hover:text-red-600 underline"
            >
              Dosyayi Kaldir
            </button>
          </div>
        </template>

        <template v-else>
          <div class="space-y-3">
            <CloudArrowUpIcon class="h-12 w-12 mx-auto text-gray-400" />
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                <span class="text-green-600 font-medium">Dosya secin</span> veya surukleyip birakin
              </p>
              <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Excel dosyasi (.xlsx, .xls)</p>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Notlar File Upload (Optional) -->
    <div class="space-y-3">
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Notlar Excel Dosyasi</span>
        <span class="text-xs text-gray-400">(Opsiyonel)</span>
      </div>

      <div
        @dragover.prevent="onDragOver('notlar')"
        @dragleave.prevent="onDragLeave('notlar')"
        @drop.prevent="onDrop($event, 'notlar')"
        :class="[
          'relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer',
          isDraggingNotlar
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : notlarFile
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10'
        ]"
        @click="triggerFileInput('notlar')"
      >
        <input
          ref="notlarInput"
          type="file"
          accept=".xlsx,.xls"
          class="hidden"
          @change="onFileSelect($event, 'notlar')"
        />

        <template v-if="uploadingNotlar">
          <div class="space-y-3">
            <div class="h-12 w-12 mx-auto border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Yukleniyor... {{ uploadProgress }}%</p>
            <div class="w-full max-w-xs mx-auto bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div class="bg-blue-500 h-2 rounded-full transition-all" :style="{ width: `${uploadProgress}%` }"></div>
            </div>
          </div>
        </template>

        <template v-else-if="notlarFile">
          <div class="space-y-2">
            <DocumentCheckIcon class="h-12 w-12 mx-auto text-blue-500" />
            <p class="text-sm font-medium text-blue-700 dark:text-blue-400">{{ notlarFile.name }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatFileSize(notlarFile.size) }}</p>
            <button
              @click.stop="clearFile('notlar')"
              class="text-xs text-red-500 hover:text-red-600 underline"
            >
              Dosyayi Kaldir
            </button>
          </div>
        </template>

        <template v-else>
          <div class="space-y-3">
            <DocumentPlusIcon class="h-12 w-12 mx-auto text-gray-400" />
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                <span class="text-blue-600 font-medium">Dosya secin</span> veya surukleyip birakin
              </p>
              <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Musteri notlari icin Excel dosyasi</p>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Info Box -->
    <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
      <div class="flex gap-3">
        <InformationCircleIcon class="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div class="text-sm text-blue-700 dark:text-blue-300">
          <p class="font-medium mb-1">Dosya Formati Hakkinda</p>
          <ul class="list-disc list-inside space-y-1 text-blue-600 dark:text-blue-400">
            <li>Kisiler dosyasi: Ad, Soyad, Telefon, Email, vb. sutunlar icermelidir</li>
            <li>Telefon veya Email sutunu zorunludur</li>
            <li>Notlar dosyasi: Kisi, Icerik, Tarih sutunlari icermelidir (opsiyonel)</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  CloudArrowUpIcon,
  DocumentCheckIcon,
  DocumentPlusIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline'

const props = defineProps<{
  kisilerFile: File | null
  notlarFile: File | null
  uploadProgress: number
  uploadingKisiler: boolean
  uploadingNotlar: boolean
}>()

const emit = defineEmits<{
  (e: 'update:kisilerFile', value: File | null): void
  (e: 'update:notlarFile', value: File | null): void
  (e: 'fileSelected', type: 'kisiler' | 'notlar', file: File): void
}>()

const kisilerInput = ref<HTMLInputElement | null>(null)
const notlarInput = ref<HTMLInputElement | null>(null)
const isDraggingKisiler = ref(false)
const isDraggingNotlar = ref(false)

const { formatFileSize } = useExcelImport()

const triggerFileInput = (type: 'kisiler' | 'notlar') => {
  if (type === 'kisiler') {
    kisilerInput.value?.click()
  } else {
    notlarInput.value?.click()
  }
}

const onFileSelect = (event: Event, type: 'kisiler' | 'notlar') => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    handleFile(file, type)
  }
}

const onDragOver = (type: 'kisiler' | 'notlar') => {
  if (type === 'kisiler') {
    isDraggingKisiler.value = true
  } else {
    isDraggingNotlar.value = true
  }
}

const onDragLeave = (type: 'kisiler' | 'notlar') => {
  if (type === 'kisiler') {
    isDraggingKisiler.value = false
  } else {
    isDraggingNotlar.value = false
  }
}

const onDrop = (event: DragEvent, type: 'kisiler' | 'notlar') => {
  isDraggingKisiler.value = false
  isDraggingNotlar.value = false

  const file = event.dataTransfer?.files[0]
  if (file) {
    handleFile(file, type)
  }
}

const handleFile = (file: File, type: 'kisiler' | 'notlar') => {
  const validExtensions = ['.xlsx', '.xls']
  const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))

  if (!validExtensions.includes(fileExtension)) {
    alert('Sadece Excel dosyalari (.xlsx, .xls) kabul edilir')
    return
  }

  if (type === 'kisiler') {
    emit('update:kisilerFile', file)
  } else {
    emit('update:notlarFile', file)
  }

  emit('fileSelected', type, file)
}

const clearFile = (type: 'kisiler' | 'notlar') => {
  if (type === 'kisiler') {
    emit('update:kisilerFile', null)
    if (kisilerInput.value) {
      kisilerInput.value.value = ''
    }
  } else {
    emit('update:notlarFile', null)
    if (notlarInput.value) {
      notlarInput.value.value = ''
    }
  }
}
</script>
