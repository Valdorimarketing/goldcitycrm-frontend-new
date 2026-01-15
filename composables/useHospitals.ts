export interface Hospital {
  id: number
  name: string
  code: string
  address?: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

export const useHospitals = () => {
  const $api = useApi()
  const hospitals = ref<Hospital[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const meta = ref({
    page: 1,
    limit: 20,
    total: 0
  })

  const fetchHospitals = async (params?: {
    page?: number
    limit?: number
    search?: string
    order?: 'ASC' | 'DESC'
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

      const url = `/hospitals?${queryParams.toString()}`
      const response: any = await $api(url)

      // API returns { data: [...], meta: {...} }
      if (response && response.data && Array.isArray(response.data)) {
        hospitals.value = response.data
        if (response.meta) {
          meta.value = {
            page: response.meta.page || 1,
            limit: response.meta.limit || 20,
            total: response.meta.total || 0
          }
        }
      } else if (Array.isArray(response)) {
        hospitals.value = response
        // If response is just an array, assume all data is loaded
        meta.value = {
          page: 1,
          limit: response.length,
          total: response.length
        }
      } else {
        console.warn('Unexpected response structure:', response)
        hospitals.value = []
      }

      return { data: hospitals.value, meta: meta.value }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch hospitals'
      hospitals.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchHospital = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await $api(`/hospitals/${id}`)
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch hospital'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createHospital = async (data: Partial<Hospital>) => {
    loading.value = true
    error.value = null
    try {
      const response = await $api('/hospitals', {
        method: 'POST',
        body: data
      })
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to create hospital'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateHospital = async (id: number, data: Partial<Hospital>) => {
    loading.value = true
    error.value = null
    try {
      const response = await $api(`/hospitals/${id}`, {
        method: 'PATCH',
        body: data
      })
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to update hospital'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteHospital = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await $api(`/hospitals/${id}`, {
        method: 'DELETE'
      })
      return true
    } catch (err: any) {
      error.value = err.message || 'Failed to delete hospital'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    hospitals,
    loading,
    error,
    meta,
    fetchHospitals,
    fetchHospital,
    createHospital,
    updateHospital,
    deleteHospital
  }
}