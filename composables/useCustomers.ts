 

export const useCustomers = () => {
  const $api = useApi()
  const customers = ref<[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const meta = ref({
    page: 1,
    limit: 20,
    total: 0
  })

  const fetchCustomers = async (params?: {
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

      const url = `/customers?${queryParams.toString()}`
      const response: any = await $api(url) as any

      // API returns { data: [...], meta: {...} }
      if (response && response.data && Array.isArray(response.data)) {
        customers.value = response.data
        if (response.meta) {
          meta.value = {
            page: response.meta.page || 1,
            limit: response.meta.limit || 20,
            total: response.meta.total || 0
          }
        }
      } else if (Array.isArray(response)) {
        customers.value = response
        // If response is just an array, assume all data is loaded
        meta.value = {
          page: 1,
          limit: response.length,
          total: response.length
        }
      } else {
        console.warn('Unexpected branch response structure:', response)
        customers.value = []
      }

      return { data: customers.value, meta: meta.value }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch customers'
      customers.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchCustomer = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await $api(`/customers/${id}`)
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch branch'
      throw err
    } finally {
      loading.value = false
    }
  }

    

  return {
    customers,
    loading,
    error,
    meta,
    fetchCustomers,
    fetchCustomer
  }
}