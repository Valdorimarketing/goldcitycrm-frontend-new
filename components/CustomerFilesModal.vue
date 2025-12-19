<template>
  <Teleport to="body">
    <Transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100"
      leave-active-class="duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>

        <!-- Modal -->
        <div class="flex min-h-screen items-center justify-center p-4">
          <Transition enter-active-class="duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100" leave-active-class="duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <div v-if="show"
              class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-2xl transition-all sm:w-full sm:max-w-4xl">
              
              <!-- Header -->
              <div class="relative bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 px-6 py-5">
                <div class="absolute inset-0 bg-grid-white/10"></div>
                <div class="relative flex items-center justify-between">
                  <div class="flex items-center space-x-4">
                    <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm ring-1 ring-white/30">
                      <FolderIcon class="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 class="text-xl font-bold text-white">{{ t('files_modal.title', 'Müşteri Dosyaları') }}</h3>
                      <p class="text-sm text-purple-200">{{ customer?.name }} {{ customer?.surname }}</p>
                    </div>
                  </div>
                  <button @click="$emit('close')" 
                    class="rounded-xl p-2.5 bg-white/10 hover:bg-white/20 transition-all duration-200 ring-1 ring-white/20">
                    <XMarkIcon class="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>

              <!-- Upload Section -->
              <div class="border-b border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/50 p-5">
                <!-- Drag & Drop Zone -->
                <div
                  ref="dropZone"
                  @dragenter.prevent="handleDragEnter"
                  @dragover.prevent="handleDragOver"
                  @dragleave.prevent="handleDragLeave"
                  @drop.prevent="handleDrop"
                  :class="[
                    'relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer',
                    isDragging 
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 scale-[1.02]' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-900/10',
                    selectedFile ? 'bg-green-50 dark:bg-green-900/20 border-green-400' : ''
                  ]"
                  @click="triggerFileInput"
                >
                  <input 
                    ref="fileInput" 
                    type="file" 
                    accept=".pdf,.png,.jpg,.jpeg,.zip,.rar,.mp4,.mov,.avi,.mkv,.doc,.docx,.xls,.xlsx"
                    @change="handleFileSelect"
                    class="hidden"
                  />
                  
                  <div class="p-8 text-center">
                    <!-- Drag Overlay -->
                    <Transition
                      enter-active-class="duration-200 ease-out"
                      enter-from-class="opacity-0 scale-95"
                      enter-to-class="opacity-100 scale-100"
                      leave-active-class="duration-150 ease-in"
                      leave-from-class="opacity-100 scale-100"
                      leave-to-class="opacity-0 scale-95"
                    >
                      <div v-if="isDragging" class="absolute inset-0 flex items-center justify-center bg-purple-500/10 rounded-2xl backdrop-blur-sm">
                        <div class="text-center">
                          <ArrowDownTrayIcon class="mx-auto h-16 w-16 text-purple-500 animate-bounce" />
                          <p class="mt-2 text-lg font-semibold text-purple-600 dark:text-purple-400">
                            {{ t('files_modal.drop_here', 'Dosyayı buraya bırakın') }}
                          </p>
                        </div>
                      </div>
                    </Transition>

                    <!-- Selected File Preview -->
                    <div v-if="selectedFile && !isDragging" class="space-y-3">
                      <div class="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                        <CheckIcon class="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <p class="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-md mx-auto">
                          {{ selectedFile.name }}
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {{ formatFileSize(selectedFile.size) }}
                        </p>
                      </div>
                      <button 
                        @click.stop="clearSelectedFile"
                        class="text-xs text-red-500 hover:text-red-600 font-medium"
                      >
                        {{ t('files_modal.remove_file', 'Dosyayı Kaldır') }}
                      </button>
                    </div>

                    <!-- Default Upload UI -->
                    <div v-else-if="!isDragging" class="space-y-3">
                      <div class="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                        <CloudArrowUpIcon class="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <p class="text-base font-semibold text-gray-900 dark:text-white">
                          {{ t('files_modal.drag_drop', 'Dosya yüklemek için sürükleyin veya tıklayın') }}
                        </p>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {{ t('files_modal.supported_formats', 'PDF, PNG, JPG, ZIP, RAR, Video, Word, Excel') }}
                        </p>
                        <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {{ t('files_modal.max_file_size', 'Maksimum dosya boyutu:') }} <span class="font-semibold">3 GB</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Description Input & Upload Button -->
                <div v-if="selectedFile" class="mt-4 space-y-3">
                  <div class="relative">
                    <textarea 
                      v-model="newFile.description" 
                      rows="2"
                      class="block w-full rounded-xl border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-500 dark:bg-gray-800 text-sm resize-none"
                      :placeholder="t('files_modal.description_placeholder', 'Dosya açıklaması ekleyin (opsiyonel)...')"
                    ></textarea>
                  </div>

                  <!-- Upload Progress -->
                  <div v-if="isUploading" class="space-y-2">
                    <div class="flex items-center justify-between text-sm">
                      <span class="text-gray-600 dark:text-gray-400">{{ t('files_modal.uploading', 'Yükleniyor...') }}</span>
                      <span class="font-semibold text-purple-600 dark:text-purple-400">{{ uploadProgress }}%</span>
                    </div>
                    <div class="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        class="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-300 ease-out"
                        :style="{ width: uploadProgress + '%' }"
                      ></div>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 text-center">
                      {{ formatFileSize(uploadedBytes) }} / {{ formatFileSize(selectedFile?.size || 0) }}
                    </p>
                  </div>

                  <!-- Upload Button -->
                  <button 
                    @click="uploadFile" 
                    :disabled="isUploading"
                    :class="[
                      'w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2',
                      isUploading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 hover:scale-[1.02]'
                    ]"
                  >
                    <ArrowUpTrayIcon v-if="!isUploading" class="h-5 w-5" />
                    <svg v-else class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ isUploading ? t('files_modal.uploading', 'Yükleniyor...') : t('files_modal.upload_file', 'Dosyayı Yükle') }}
                  </button>
                </div>
              </div>

              <!-- Files List -->
              <div class="max-h-[40vh] overflow-y-auto">
                <!-- Loading State -->
                <div v-if="loading" class="flex flex-col items-center justify-center py-12">
                  <div class="w-12 h-12 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin"></div>
                  <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">{{ t('files_modal.loading_files', 'Dosyalar yükleniyor...') }}</p>
                </div>

                <!-- Files Grid -->
                <div v-else-if="files.length > 0" class="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div 
                    v-for="file in files" 
                    :key="file.id"
                    class="group relative bg-white dark:bg-gray-800 rounded-xl p-4 ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-purple-300 dark:hover:ring-purple-600 hover:shadow-lg transition-all duration-200"
                  >
                    <div class="flex items-start gap-3">
                      <!-- File Icon -->
                      <div :class="[
                        'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center',
                        getFileIconClass(file.file)
                      ]">
                        <component :is="getFileIcon(file.file)" class="h-6 w-6 text-white" />
                      </div>
                      
                      <!-- File Info -->
                      <div class="flex-1 min-w-0">
                        <button 
                          @click="openFile(file)"
                          class="text-sm font-medium text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors truncate block w-full text-left"
                        >
                          {{ getFileName(file.file) }}
                        </button>
                        <p v-if="file.description" class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                          {{ file.description }}
                        </p>
                        <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {{ formatDate(file.createdAt) }}
                        </p>
                      </div>

                      <!-- Actions -->
                      <div class="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          @click="downloadFile(file)"
                          class="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                          :title="t('files_modal.download_tooltip', 'İndir')"
                        >
                          <ArrowDownTrayIcon class="h-4 w-4" />
                        </button>
                        <button 
                          @click="deleteFile(file)"
                          class="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-900/50 text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          :title="t('files_modal.delete_tooltip', 'Sil')"
                        >
                          <TrashIcon class="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Empty State -->
                <div v-else class="text-center py-12 px-6">
                  <div class="mx-auto w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <FolderIcon class="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 class="mt-4 text-base font-semibold text-gray-900 dark:text-white">
                    {{ t('files_modal.empty.title', 'Henüz dosya yok') }}
                  </h3>
                  <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {{ t('files_modal.empty.description', 'Bu müşteri için henüz dosya yüklenmemiş.') }}
                  </p>
                </div>
              </div>

              <!-- Footer -->
              <div class="border-t border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/50 px-6 py-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/50">
                      <DocumentIcon class="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span class="text-sm text-gray-600 dark:text-gray-400">
                      {{ tp('files_modal.total_files', { count: files.length }, 'Toplam {count} dosya') }}
                    </span>
                  </div>
                  <button 
                    @click="$emit('close')"
                    class="px-5 py-2.5 rounded-xl bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 ring-1 ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    {{ t('files_modal.close', 'Kapat') }}
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import {
  XMarkIcon,
  FolderIcon,
  DocumentIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  CloudArrowUpIcon,
  CheckIcon,
  DocumentTextIcon,
  PhotoIcon,
  FilmIcon,
  ArchiveBoxIcon
} from '@heroicons/vue/24/outline'
import axios from 'axios'
import { useLanguage } from '~/composables/useLanguage'

const { t, tp } = useLanguage()

const props = defineProps({
  show: Boolean,
  customer: Object
})

const emit = defineEmits(['close'])

// State
const loading = ref(false)
const files = ref([])
const selectedFile = ref(null)
const fileInput = ref(null)
const dropZone = ref(null)
const isDragging = ref(false)
const dragCounter = ref(0)

const uploadProgress = ref(0)
const uploadedBytes = ref(0)
const isUploading = ref(false)

// New file form
const newFile = reactive({
  description: ''
})

// Drag & Drop handlers
const handleDragEnter = (e) => {
  dragCounter.value++
  isDragging.value = true
}

const handleDragOver = (e) => {
  e.dataTransfer.dropEffect = 'copy'
}

const handleDragLeave = (e) => {
  dragCounter.value--
  if (dragCounter.value === 0) {
    isDragging.value = false
  }
}

const handleDrop = (e) => {
  isDragging.value = false
  dragCounter.value = 0
  
  const droppedFiles = e.dataTransfer.files
  if (droppedFiles.length > 0) {
    processFile(droppedFiles[0])
  }
}

const triggerFileInput = () => {
  if (!selectedFile.value) {
    fileInput.value?.click()
  }
}

// File processing
const processFile = (file) => {
  const allowedExtensions = ['.pdf', '.png', '.jpg', '.jpeg', '.zip', '.rar', '.mp4', '.mov', '.avi', '.mkv', '.doc', '.docx', '.xls', '.xlsx']
  const fileExtension = '.' + file.name.split('.').pop().toLowerCase()

  if (!allowedExtensions.includes(fileExtension)) {
    alert(t('files_modal.errors.unsupported_type', 'Bu dosya türü desteklenmiyor. Desteklenen türler: PDF, PNG, JPG, ZIP, RAR, Video, Word, Excel'))
    return
  }

  // 3GB limit kontrolü
  const maxSize = 3 * 1024 * 1024 * 1024 // 3GB
  if (file.size > maxSize) {
    alert(t('files_modal.errors.file_too_large', 'Dosya boyutu 3GB\'dan büyük olamaz.'))
    return
  }

  selectedFile.value = file
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    processFile(file)
  }
}

const clearSelectedFile = () => {
  selectedFile.value = null
  newFile.description = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Fetch customer files
const fetchFiles = async () => {
  if (!props.customer?.id) return

  loading.value = true
  try {
    const api = useApi()
    const response = await api(`/customer-files?customer=${props.customer.id}`)
    files.value = Array.isArray(response) ? response : []
  } catch (error) {
    console.error('Error fetching customer files:', error)
    files.value = []
  } finally {
    loading.value = false
  }
}

// Upload file
const uploadFile = async () => {
  if (!selectedFile.value || !props.customer?.id) {
    alert(t('files_modal.errors.select_file', 'Lütfen bir dosya seçin.'))
    return
  }

  isUploading.value = true
  uploadProgress.value = 0
  uploadedBytes.value = 0

  try {
    const config = useRuntimeConfig()
    const authStore = useAuthStore()

    const formData = new FormData()
    formData.append('file', selectedFile.value)
    formData.append('customer', String(props.customer.id))

    if (newFile.description) {
      formData.append('description', newFile.description)
    }

    await axios.post(
      `${config.public.apiBase}/customer-files`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          'Content-Type': 'multipart/form-data',
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            uploadProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            uploadedBytes.value = progressEvent.loaded
          }
        },
      }
    )

    // Reset form
    clearSelectedFile()
    
    // Refresh list
    await fetchFiles()
  } catch (error) {
    console.error('Dosya yükleme hatası:', error)
    const message = error.response?.data?.message || error.message || t('files_modal.errors.upload_error', 'Dosya yüklenirken bir hata oluştu.')
    alert(message)
  } finally {
    isUploading.value = false
    uploadProgress.value = 0
    uploadedBytes.value = 0
  }
}

// File helpers
const getFileIcon = (filePath) => {
  const ext = filePath?.split('.').pop()?.toLowerCase()
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return PhotoIcon
  if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext)) return FilmIcon
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return ArchiveBoxIcon
  if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt'].includes(ext)) return DocumentTextIcon
  return DocumentIcon
}

const getFileIconClass = (filePath) => {
  const ext = filePath?.split('.').pop()?.toLowerCase()
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'bg-gradient-to-br from-pink-500 to-rose-500'
  if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext)) return 'bg-gradient-to-br from-purple-500 to-indigo-500'
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return 'bg-gradient-to-br from-amber-500 to-orange-500'
  if (['pdf'].includes(ext)) return 'bg-gradient-to-br from-red-500 to-rose-600'
  if (['doc', 'docx'].includes(ext)) return 'bg-gradient-to-br from-blue-500 to-indigo-500'
  if (['xls', 'xlsx'].includes(ext)) return 'bg-gradient-to-br from-green-500 to-emerald-500'
  return 'bg-gradient-to-br from-gray-500 to-slate-500'
}

const getFileName = (filePath) => {
  if (!filePath) return t('files_modal.unknown_file', 'Bilinmeyen dosya')
  return filePath.split('/').pop() || filePath
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// File actions
const openFile = (file) => {
  if (file.file) {
    const config = useRuntimeConfig()
    const fileUrl = file.file.startsWith('http') ? file.file : `${config.public.apiBase}/${file.file}`
    window.open(fileUrl, '_blank')
  }
}

const downloadFile = (file) => {
  if (file.file) {
    const config = useRuntimeConfig()
    const fileUrl = file.file.startsWith('http') ? file.file : `${config.public.apiBase}/${file.file}`
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = getFileName(file.file)
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

const deleteFile = async (file) => {
  if (!confirm(t('files_modal.confirm.delete_file', 'Bu dosyayı silmek istediğinizden emin misiniz?'))) return

  try {
    const api = useApi()
    await api(`/customer-files/${file.id}`, { method: 'DELETE' })
    await fetchFiles()
  } catch (error) {
    console.error('Error deleting file:', error)
    alert(t('files_modal.errors.delete_error', 'Dosya silinirken bir hata oluştu.'))
  }
}

// Watch for modal open
watch(() => props.show, (newValue) => {
  if (newValue) {
    fetchFiles()
  } else {
    files.value = []
    clearSelectedFile()
  }
})
</script>

<style scoped>
.bg-grid-white\/10 {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.1)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
}
</style>