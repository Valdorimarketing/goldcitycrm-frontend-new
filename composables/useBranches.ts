import type { Branch2Hospital } from "../types"

export interface BranchTranslation {
  id: number
  branchId: number
  languageId: number
  name: string
  language?: {
    id: number
    code: string
    name: string
    flag?: string
    isDefault: boolean
  }
}
 

export interface Branch {
  id: number
  code: string
  description?: string
  createdAt: Date
  updatedAt: Date
  translations?: BranchTranslation[]
  branch2Hospitals?: Branch2Hospital[]
  // Virtual property populated from translations
  name?: string
}

export const useBranches = () => {
  const $api = useApi()
  const branches = ref<Branch[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const meta = ref({
    page: 1,
    limit: 20,
    total: 0
  })

  // Get current language ID helper
  const getCurrentLanguageId = () => {
    try {
      const { currentLanguage } = useLanguage()
      const langValue = currentLanguage?.value as any
      
      // If currentLanguage is an object with id property
      if (langValue && typeof langValue === 'object' && 'id' in langValue) {
        return langValue.id
      }
      // If currentLanguage is directly a number
      if (typeof langValue === 'number') {
        return langValue
      }
    } catch (e) {
      console.warn('Could not get current language, defaulting to 1', e)
    }
    // Default to Turkish (id: 1)
    return 1
  }

  const fetchBranches = async (params?: {
    page?: number
    limit?: number
    search?: string
    order?: 'ASC' | 'DESC'
    hospitalId?: number
    languageId?: number
  }) => {
    loading.value = true
    error.value = null
    try {
      // Build query parameters
      const queryParams = new URLSearchParams()
      queryParams.append('page', (params?.page || 1).toString())
      queryParams.append('limit', (params?.limit || 20).toString())
      queryParams.append('languageId', (params?.languageId || getCurrentLanguageId()).toString())
      
      if (params?.search) {
        queryParams.append('search', params.search)
      }
      if (params?.order) {
        queryParams.append('order', params.order)
      }
      if (params?.hospitalId) {
        queryParams.append('hospitalId', params.hospitalId.toString())
      }

      const url = `/branches?${queryParams.toString()}`
      const response: any = await $api(url)

      // API returns { data: [...], meta: {...} }
      if (response && response.data && Array.isArray(response.data)) {
        branches.value = response.data
        if (response.meta) {
          meta.value = {
            page: response.meta.page || 1,
            limit: response.meta.limit || 20,
            total: response.meta.total || 0
          }
        }
      } else if (Array.isArray(response)) {
        branches.value = response
        // If response is just an array, assume all data is loaded
        meta.value = {
          page: 1,
          limit: response.length,
          total: response.length
        }
      } else {
        console.warn('Unexpected branch response structure:', response)
        branches.value = []
      }

      return { data: branches.value, meta: meta.value }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch branches'
      branches.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchBranch = async (id: number, languageId?: number) => {
    loading.value = true
    error.value = null
    try {
      const queryParams = new URLSearchParams()
      queryParams.append('languageId', (languageId || getCurrentLanguageId()).toString())
      
      const response = await $api(`/branches/${id}?${queryParams.toString()}`)
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch branch'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createBranch = async (data: {
    code: string
    description?: string
    translations: Array<{
      languageId: number
      name: string
    }>
    hospitalIds?: number[]
  }) => {
    loading.value = true
    error.value = null
    try {
      const response = await $api('/branches', {
        method: 'POST',
        body: data
      })
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to create branch'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateBranch = async (id: number, data: {
    code?: string
    description?: string
    translations?: Array<{
      languageId: number
      name: string
    }>
    hospitalIds?: number[]
  }) => {
    loading.value = true
    error.value = null
    try {
      const response = await $api(`/branches/${id}`, {
        method: 'PATCH',
        body: data
      })
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to update branch'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteBranch = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await $api(`/branches/${id}`, {
        method: 'DELETE'
      })
      return true
    } catch (err: any) {
      error.value = err.message || 'Failed to delete branch'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    branches,
    loading,
    error,
    meta,
    fetchBranches,
    fetchBranch,
    createBranch,
    updateBranch,
    deleteBranch
  }
}