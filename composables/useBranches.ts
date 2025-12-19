export interface Branch {
  id: number
  hospitalId: number
  name: string
  code: string
  address?: string
  phone?: string
  email?: string
  description?: string
  createdAt: Date
  updatedAt: Date
  hospital?: any
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

  const fetchBranches = async (params?: {
    page?: number
    limit?: number
    search?: string
    order?: 'ASC' | 'DESC'
    hospitalId?: number
  }) => {
    loading.value = true
    error.value = null
    try {
      // Build query parameters
      const queryParams = new URLSearchParams()
      queryParams.append('page', (params?.page || 1).toString())
      queryParams.append('limit', (params?.limit || 20).toString())
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

  const fetchBranch = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await $api(`/branches/${id}`)
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch branch'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createBranch = async (data: Partial<Branch>) => {
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

  const updateBranch = async (id: number, data: Partial<Branch>) => {
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