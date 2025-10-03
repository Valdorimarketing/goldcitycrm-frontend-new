<template>
  <Teleport to="body">
    <Transition
      enter-active-class="duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/80 backdrop-blur-sm transition-opacity"
          @click="$emit('close')"
        ></div>

        <!-- Modal -->
        <div class="flex min-h-screen items-center justify-center p-4">
          <Transition
            enter-active-class="duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div v-if="show" class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl transition-all sm:w-full sm:max-w-4xl">
              <!-- Header -->
              <div class="bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                      <FolderIcon class="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-white">Müşteri Dosyaları</h3>
                      <p class="text-sm text-cyan-100">{{ customer?.name }} {{ customer?.surname }}</p>
                    </div>
                  </div>
                  <button
                    @click="$emit('close')"
                    class="rounded-lg p-2 hover:bg-white/20 transition-colors"
                  >
                    <XMarkIcon class="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>

              <!-- Upload Section -->
              <div class="border-b dark:border-gray-700 p-4">
                <div class="flex items-start space-x-3">
                  <div class="flex-1">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Yeni Dosya Yükle
                    </label>
                    <input
                      ref="fileInput"
                      type="file"
                      @change="handleFileSelect"
                      class="block w-full text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 focus:outline-none"
                    />

                    <textarea
                      v-model="newFile.description"
                      rows="2"
                      class="mt-3 block w-full rounded-lg border-0 px-4 py-2 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 dark:bg-gray-700 text-sm"
                      placeholder="Dosya açıklaması (opsiyonel)..."
                    ></textarea>

                    <div class="mt-3 flex items-center justify-end">
                      <button
                        @click="uploadFile"
                        :disabled="!selectedFile || uploading"
                        class="inline-flex items-center rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ArrowUpTrayIcon class="mr-2 h-4 w-4" />
                        {{ uploading ? 'Yükleniyor...' : 'Dosya Yükle' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Content -->
              <div class="max-h-[50vh] overflow-y-auto p-6">
                <!-- Loading State -->
                <div v-if="loading" class="flex justify-center py-8">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
                </div>

                <!-- Files List -->
                <div v-else-if="files.length > 0" class="space-y-3">
                  <div
                    v-for="file in files"
                    :key="file.id"
                    class="group relative bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:shadow-md transition-all"
                  >
                    <div class="flex items-start justify-between">
                      <div class="flex items-start space-x-3 flex-1">
                        <div class="flex-shrink-0">
                          <DocumentIcon class="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
                        </div>
                        <div class="flex-1 min-w-0">
                          <button
                            @click="openFile(file)"
                            class="text-sm font-medium text-gray-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors break-all text-left"
                          >
                            {{ getFileName(file.file) }}
                          </button>
                          <p v-if="file.description" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {{ file.description }}
                          </p>
                          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {{ formatDate(file.createdAt) }}
                          </p>
                        </div>
                      </div>

                      <!-- Actions -->
                      <div class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          @click="downloadFile(file)"
                          class="text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                          title="İndir"
                        >
                          <ArrowDownTrayIcon class="h-4 w-4" />
                        </button>
                        <button
                          @click="deleteFile(file)"
                          class="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          title="Sil"
                        >
                          <TrashIcon class="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Empty State -->
                <div v-else class="text-center py-8">
                  <FolderIcon class="mx-auto h-12 w-12 text-gray-400" />
                  <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Dosya Bulunamadı</h3>
                  <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Bu müşteri için henüz dosya yüklenmemiş.
                  </p>
                </div>
              </div>

              <!-- Footer -->
              <div class="border-t dark:border-gray-700 px-6 py-4">
                <div class="flex justify-between items-center">
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Toplam <span class="font-medium">{{ files.length }}</span> dosya
                  </p>
                  <button
                    @click="$emit('close')"
                    class="inline-flex items-center rounded-lg bg-gray-100 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Kapat
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
  TrashIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  show: Boolean,
  customer: Object
})

const emit = defineEmits(['close'])

// State
const loading = ref(false)
const files = ref([])
const uploading = ref(false)
const selectedFile = ref(null)
const fileInput = ref(null)

// New file form
const newFile = reactive({
  description: ''
})

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

// Handle file selection
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
  }
}

// Upload file
const uploadFile = async () => {
  if (!selectedFile.value || !props.customer?.id) return

  // Check file size (10MB limit)
  const maxSize = 10 * 1024 * 1024 // 10MB in bytes
  if (selectedFile.value.size > maxSize) {
    alert('Dosya boyutu 10MB\'dan büyük olamaz.')
    return
  }

  uploading.value = true
  try {
    const config = useRuntimeConfig()
    const authStore = useAuthStore()
    const token = authStore.token

    const formData = new FormData()
    formData.append('file', selectedFile.value)
    formData.append('customer', String(props.customer.id))
    if (newFile.description) {
      formData.append('description', newFile.description)
    }

    console.log('Uploading file:', {
      fileName: selectedFile.value.name,
      fileSize: selectedFile.value.size,
      fileType: selectedFile.value.type,
      customerId: props.customer.id,
      description: newFile.description
    })

    const response = await fetch(`${config.public.apiBase}/customer-files`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Do NOT add Content-Type - let browser set it with boundary
      },
      body: formData
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Upload error response:', errorText)
      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { message: errorText }
      }
      throw new Error(Array.isArray(errorData.message) ? errorData.message.join(', ') : errorData.message || 'Upload failed')
    }

    const result = await response.json()
    console.log('Upload successful:', result)

    // Reset form
    newFile.description = ''
    selectedFile.value = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }

    // Refresh files
    await fetchFiles()
  } catch (error) {
    console.error('Error uploading file:', error)
    alert(`Dosya yüklenirken bir hata oluştu: ${error.message}`)
  } finally {
    uploading.value = false
  }
}

// Open/Download file
const openFile = (file) => {
  if (file.file) {
    const config = useRuntimeConfig()
    // Construct full URL if path is relative
    const fileUrl = file.file.startsWith('http')
      ? file.file
      : `${config.public.apiBase}/${file.file}`
    window.open(fileUrl, '_blank')
  }
}

// Download file
const downloadFile = (file) => {
  if (file.file) {
    const config = useRuntimeConfig()
    const fileUrl = file.file.startsWith('http')
      ? file.file
      : `${config.public.apiBase}/${file.file}`

    const link = document.createElement('a')
    link.href = fileUrl
    link.download = getFileName(file.file)
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

// Delete file
const deleteFile = async (file) => {
  if (!confirm('Bu dosyayı silmek istediğinizden emin misiniz?')) return

  try {
    const api = useApi()
    await api(`/customer-files/${file.id}`, {
      method: 'DELETE'
    })

    // Refresh files
    await fetchFiles()
  } catch (error) {
    console.error('Error deleting file:', error)
    alert('Dosya silinirken bir hata oluştu.')
  }
}

// Get file name from path
const getFileName = (filePath) => {
  if (!filePath) return 'Bilinmeyen dosya'
  return filePath.split('/').pop() || filePath
}

// Format date
const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Watch for modal open
watch(() => props.show, (newValue) => {
  if (newValue) {
    fetchFiles()
  } else {
    files.value = []
    newFile.description = ''
    selectedFile.value = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
})
</script>