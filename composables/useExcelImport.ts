import axios from 'axios'

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

interface ImportProgress {
  status: 'pending' | 'analyzing' | 'importing' | 'completed' | 'failed'
  progress: number
  currentStep: string
  processedRows: number
  totalRows: number
  errors: string[]
  createdCustomers: number
  updatedCustomers: number
  createdNotes: number
  skippedCount: number
  skippedReasons: {
    noPhoneOrEmail: number
    duplicatePhone: number
    duplicateEmail: number
  }
}

interface UploadResult {
  success: boolean
  fileId: string
  fileName: string
  fileSize: number
  filePath: string
}

export const useExcelImport = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  // State
  const uploading = ref(false)
  const uploadProgress = ref(0)
  const analyzing = ref(false)
  const importing = ref(false)
  const importProgress = ref(0)

  // Get auth token
  const getToken = () => {
    return import.meta.client ? localStorage.getItem('auth-token') : null
  }

  /**
   * Upload an Excel file
   */
  const uploadFile = async (file: File): Promise<UploadResult> => {
    uploading.value = true
    uploadProgress.value = 0

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await axios.post<UploadResult>(
        `${config.public.apiBase}/excel-sync/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'multipart/form-data',
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              uploadProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            }
          },
        }
      )

      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Dosya yüklenemedi'
      throw new Error(message)
    } finally {
      uploading.value = false
    }
  }

  /**
   * Analyze an uploaded Excel file
   */
  const analyzeFile = async (fileId: string): Promise<AnalysisResult> => {
    analyzing.value = true

    try {
      const api = useApi()
      const result = await api<AnalysisResult>('/excel-sync/analyze', {
        method: 'POST',
        body: { fileId },
      })

      return result
    } catch (error: any) {
      const message = error.data?.message || error.message || 'Dosya analiz edilemedi'
      throw new Error(message)
    } finally {
      analyzing.value = false
    }
  }

  /**
   * Start the import process
   */
  const startImport = async (
    kisilerFileId: string,
    notlarFileId?: string,
    updateExisting?: boolean,
    fieldsToUpdate?: string[]
  ): Promise<string> => {
    importing.value = true
    importProgress.value = 0

    try {
      const api = useApi()
      const result = await api<{ success: boolean; jobId: string; message: string }>(
        '/excel-sync/import',
        {
          method: 'POST',
          body: {
            kisilerFileId,
            notlarFileId,
            updateExisting,
            fieldsToUpdate,
          },
        }
      )

      return result.jobId
    } catch (error: any) {
      const message = error.data?.message || error.message || 'İçe aktarma başlatılamadı'
      importing.value = false
      throw new Error(message)
    }
  }

  /**
   * Get the status of an import job
   */
  const getJobStatus = async (jobId: string): Promise<ImportProgress> => {
    try {
      const api = useApi()
      const result = await api<ImportProgress>(`/excel-sync/job/${jobId}`)
      return result
    } catch (error: any) {
      throw error
    }
  }

  /**
   * Poll job status until completion
   */
  const pollJobStatus = async (
    jobId: string,
    onProgress: (progress: ImportProgress) => void,
    intervalMs: number = 1000
  ): Promise<ImportProgress> => {
    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const status = await getJobStatus(jobId)
          onProgress(status)
          importProgress.value = status.progress

          if (status.status === 'completed') {
            importing.value = false
            resolve(status)
          } else if (status.status === 'failed') {
            importing.value = false
            const errorMsg = status.errors[0] || 'İçe aktarma başarısız'
            reject(new Error(errorMsg))
          } else {
            setTimeout(poll, intervalMs)
          }
        } catch (error) {
          importing.value = false
          reject(error)
        }
      }

      poll()
    })
  }

  /**
   * Format file size for display
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  /**
   * Format estimated time for display
   */
  const formatEstimatedTime = (seconds: number): string => {
    if (seconds < 60) {
      return `~${seconds} saniye`
    }
    const minutes = Math.ceil(seconds / 60)
    return `~${minutes} dakika`
  }

  /**
   * Get field label for display
   */
  const getFieldLabel = (field: string): string => {
    const labels: Record<string, string> = {
      name: 'Ad',
      surname: 'Soyad',
      email: 'E-posta',
      phone: 'Telefon',
      birthDate: 'Dogum Tarihi',
      identityNumber: 'TC Kimlik No',
      address: 'Adres',
      city: 'Sehir',
      description: 'Aciklama',
      segment: 'Segment',
      source: 'Kaynak',
      assignedUser: 'Atanan Kullanici',
      createdAt: 'Kayit Tarihi',
    }
    return labels[field] || field
  }

  /**
   * Get available target fields for mapping
   */
  const getTargetFields = () => [
    { value: 'name', label: 'Ad' },
    { value: 'surname', label: 'Soyad' },
    { value: 'email', label: 'E-posta' },
    { value: 'phone', label: 'Telefon' },
    { value: 'birthDate', label: 'Dogum Tarihi' },
    { value: 'identityNumber', label: 'TC Kimlik No' },
    { value: 'address', label: 'Adres' },
    { value: 'city', label: 'Sehir' },
    { value: 'description', label: 'Aciklama' },
    { value: 'segment', label: 'Segment/Durum' },
    { value: 'source', label: 'Kaynak' },
    { value: 'assignedUser', label: 'Atanan Kullanici' },
    { value: 'createdAt', label: 'Kayit Tarihi' },
  ]

  /**
   * Get fields that can be updated during import
   */
  const getUpdatableFields = () => [
    { value: 'name', label: 'Ad' },
    { value: 'surname', label: 'Soyad' },
    { value: 'email', label: 'E-posta' },
    { value: 'phone', label: 'Telefon' },
    { value: 'birthDate', label: 'Dogum Tarihi' },
    { value: 'identityNumber', label: 'TC Kimlik No' },
    { value: 'address', label: 'Adres' },
    { value: 'status', label: 'Durum' },
    { value: 'sourceId', label: 'Kaynak' },
    { value: 'relevantUser', label: 'Atanan Kullanici' },
  ]

  return {
    // State
    uploading,
    uploadProgress,
    analyzing,
    importing,
    importProgress,

    // Methods
    uploadFile,
    analyzeFile,
    startImport,
    getJobStatus,
    pollJobStatus,

    // Utilities
    formatFileSize,
    formatEstimatedTime,
    getFieldLabel,
    getTargetFields,
    getUpdatableFields,
  }
}
