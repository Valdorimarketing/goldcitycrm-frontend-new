export interface Doctor {
  id: number
  name: string
  branchId?: number
  branch?: {
    id: number
    name: string
    code: string
    description?: string
    translations?: Array<{
      id: number
      languageId: number
      name: string
      language?: {
        id: number
        code: string
        name: string
      }
    }>
  }
  doctor2Branches?: Array<{
    id: number
    doctorId: number
    branchId: number
    branch: {
      id: number
      name: string
      code: string
      translations?: Array<{
        id: number
        languageId: number
        name: string
        language?: {
          id: number
          code: string
          name: string
        }
      }>
    }
  }>
  doctor2Hospitals?: Array<{
    id: number
    doctorId: number
    hospitalId: number
    hospital: {
      id: number
      name: string
      code: string
      address?: string
    }
  }>
  branchIds?: number[]
  hospitalIds?: number[]
  createdAt: Date
  updatedAt: Date
}

export interface DoctorFetchParams {
  page?: number
  limit?: number
  search?: string
  branchId?: number
  sortBy?: 'name' | 'createdAt' | 'updatedAt'
  sortOrder?: 'ASC' | 'DESC'
  order?: 'ASC' | 'DESC' // Backward compatibility
}

export const useDoctors = () => {
  const $api = useApi()
  const doctors = ref<Doctor[]>([])
  const allDoctors = ref<Doctor[]>([]) // Store all doctors for search
  const loading = ref(false)
  const error = ref<string | null>(null)
  const meta = ref({
    page: 1,
    limit: 20,
    total: 0
  })

  const fetchDoctors = async (params?: DoctorFetchParams) => {
    loading.value = true
    error.value = null
    try {
      // Build query parameters
      const queryParams = new URLSearchParams()
      
      // Pagination
      queryParams.append('page', (params?.page || 1).toString())
      queryParams.append('limit', (params?.limit || 20).toString())
      
      // Search
      if (params?.search) {
        queryParams.append('search', params.search)
      }
      
      // Branch filter
      if (params?.branchId) {
        queryParams.append('branchId', params.branchId.toString())
      }
      
      // Sorting
      if (params?.sortBy) {
        queryParams.append('sortBy', params.sortBy)
      }
      
      // Sort order (handle both sortOrder and order for backward compatibility)
      const sortOrder = params?.sortOrder || params?.order
      if (sortOrder) {
        queryParams.append('sortOrder', sortOrder)
      }

      const url = `/doctors?${queryParams.toString()}`
      const response: any = await $api(url)

      // API returns { data: [...], meta: {...} }
      if (response && response.data && Array.isArray(response.data)) {
        doctors.value = response.data
        allDoctors.value = response.data
        if (response.meta) {
          meta.value = {
            page: response.meta.page || 1,
            limit: response.meta.limit || 20,
            total: response.meta.total || 0
          }
        }
      } else if (Array.isArray(response)) {
        doctors.value = response
        allDoctors.value = response
        // If response is just an array, assume all data is loaded
        meta.value = {
          page: 1,
          limit: response.length,
          total: response.length
        }
      } else {
        console.warn('Unexpected doctors response structure:', response)
        allDoctors.value = []
        doctors.value = []
      }

      return { data: doctors.value, meta: meta.value }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch doctors'
      allDoctors.value = []
      doctors.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchDoctor = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await $api(`/doctors/${id}`)
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch doctor'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createDoctor = async (data: Partial<Doctor>) => {
    loading.value = true
    error.value = null
    try {
      // Clean up undefined values from the request body
      const requestBody = Object.entries(data).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value
        }
        return acc
      }, {} as any)

      const response = await $api('/doctors', {
        method: 'POST',
        body: requestBody
      })
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to create doctor'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateDoctor = async (id: number, data: Partial<Doctor>) => {
    loading.value = true
    error.value = null
    try {
      // Clean up undefined values from the request body
      const requestBody = Object.entries(data).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value
        }
        return acc
      }, {} as any)

      const response = await $api(`/doctors/${id}`, {
        method: 'PATCH',
        body: requestBody
      })
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to update doctor'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteDoctor = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await $api(`/doctors/${id}`, {
        method: 'DELETE'
      })
      return true
    } catch (err: any) {
      error.value = err.message || 'Failed to delete doctor'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    doctors,
    allDoctors,
    loading,
    error,
    meta,
    fetchDoctors,
    fetchDoctor,
    createDoctor,
    updateDoctor,
    deleteDoctor
  }
}