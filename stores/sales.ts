import { defineStore } from 'pinia'
import type { Sale, Customer, ApiResponse, PaginatedResponse } from '~/types'

export const useSalesStore = defineStore('sales', () => {
  const sales = ref<Sale[]>([])
  const currentSale = ref<Sale | null>(null)
  const loading = ref(false)
  const pagination = ref({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  })

  // Get all sales
  const fetchSales = async (page = 1, limit = 10, filters: any = {}) => {
    loading.value = true
    try {
      const config = useRuntimeConfig()
      const queryParams: any = { page, limit, ...filters }

      const response = await $fetch<PaginatedResponse<Sale>>('/sales', {
        baseURL: config.public.apiBase,
        query: queryParams,
        headers: {
          Authorization: `Bearer ${useCookie('auth-token').value}`
        }
      })

      sales.value = response.data
      pagination.value = {
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages
      }
    } catch (error) {
      console.error('Error fetching sales:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Get sale by ID
  const fetchSale = async (id: number) => {
    loading.value = true
    try {
      const config = useRuntimeConfig()
      const response = await $fetch<Sale>(`/sales/${id}`, {
        baseURL: config.public.apiBase,
        headers: {
          Authorization: `Bearer ${useCookie('auth-token').value}`
        }
      })
      
      currentSale.value = response
      return response
    } catch (error) {
      console.error('Error fetching sale:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Create sale
  const createSale = async (saleData: Omit<Sale, 'id' | 'createdAt' | 'updatedAt'>) => {
    loading.value = true
    try {
      const config = useRuntimeConfig()
      const response = await $fetch<Sale>('/sales', {
        method: 'POST',
        baseURL: config.public.apiBase,
        body: saleData,
        headers: {
          Authorization: `Bearer ${useCookie('auth-token').value}`
        }
      })
      
      sales.value.unshift(response)
      return response
    } catch (error) {
      console.error('Error creating sale:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Update sale
  const updateSale = async (id: number, saleData: Partial<Sale>) => {
    loading.value = true
    try {
      const config = useRuntimeConfig()
      const response = await $fetch<Sale>(`/sales/${id}`, {
        method: 'PATCH',
        baseURL: config.public.apiBase,
        body: saleData,
        headers: {
          Authorization: `Bearer ${useCookie('auth-token').value}`
        }
      })
      
      const index = sales.value.findIndex(s => s.id === id)
      if (index !== -1) {
        sales.value[index] = response
      }
      
      if (currentSale.value?.id === id) {
        currentSale.value = response
      }
      
      return response
    } catch (error) {
      console.error('Error updating sale:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Delete sale
  const deleteSale = async (id: number) => {
    loading.value = true
    try {
      const config = useRuntimeConfig()
      await $fetch(`/sales/${id}`, {
        method: 'DELETE',
        baseURL: config.public.apiBase,
        headers: {
          Authorization: `Bearer ${useCookie('auth-token').value}`
        }
      })
      
      sales.value = sales.value.filter(s => s.id !== id)
      
      if (currentSale.value?.id === id) {
        currentSale.value = null
      }
    } catch (error) {
      console.error('Error deleting sale:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    sales: readonly(sales),
    currentSale: readonly(currentSale),
    loading: readonly(loading),
    pagination: readonly(pagination),
    fetchSales,
    fetchSale,
    createSale,
    updateSale,
    deleteSale
  }
}) 