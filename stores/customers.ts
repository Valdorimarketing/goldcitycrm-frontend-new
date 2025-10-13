import { defineStore } from 'pinia'
import type { Customer, ApiResponse, PaginatedResponse } from '~/types'

export const useCustomersStore = defineStore('customers', () => {
  const customers = ref<Customer[]>([])
  const currentCustomer = ref<Customer | null>(null)
  const loading = ref(false)
  const pagination = ref({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0
  })

  // Get all customers
  const fetchCustomers = async (pageOrParams?: number | {
    page?: number
    limit?: number
    search?: string
    status?: number
    isActive?: boolean
    order?: 'ASC' | 'DESC'
    relevantUser?: number
    statusType?: string
    isFirst?: boolean
    [key: string]: any
  }, limitParam?: number, filtersParam?: any) => {
    loading.value = true

    // Define page and limit at function scope so they're available in catch block
    let page = 1
    let limit = 20

    try {
      const api = useApi()

      // Build query parameters - support both old and new API
      let queryParams: any

      if (typeof pageOrParams === 'number') {
        // Old API: fetchCustomers(page, limit, filters)
        page = pageOrParams || 1
        limit = limitParam || 20
        queryParams = {
          page,
          limit,
          ...(filtersParam || {})
        }
      } else if (typeof pageOrParams === 'object' && pageOrParams !== null) {
        // New API: fetchCustomers({ page, limit, search, ... })
        page = pageOrParams.page || 1
        limit = pageOrParams.limit || 20

        queryParams = { page, limit }
        if (pageOrParams.search) {
          queryParams.search = pageOrParams.search
        }
        if (pageOrParams.status !== undefined) {
          queryParams.status = pageOrParams.status
        }
        if (pageOrParams.isActive !== undefined) {
          queryParams.isActive = pageOrParams.isActive
        }
        if (pageOrParams.order) {
          queryParams.order = pageOrParams.order
        }
        if (pageOrParams.relevantUser !== undefined) {
          queryParams.relevantUser = pageOrParams.relevantUser
        }
        if (pageOrParams.statusType) {
          queryParams.statusType = pageOrParams.statusType
        }
        if (pageOrParams.isFirst !== undefined) {
          queryParams.isFirst = pageOrParams.isFirst
        }
        // Add any other custom filter parameters
        Object.keys(pageOrParams).forEach(key => {
          if (!['page', 'limit', 'search', 'status', 'isActive', 'order', 'relevantUser', 'statusType', 'isFirst'].includes(key)) {
            queryParams[key] = pageOrParams[key]
          }
        })
      } else {
        // No params, use defaults
        queryParams = { page: 1, limit: 20 }
      }

      const response = await api<any>('/customers', {
        query: queryParams
      })

      // Handle different response formats
      if (Array.isArray(response)) {
        // Response is directly an array
        customers.value = response
        pagination.value = {
          total: response.length,
          page: page,
          limit: limit,
          totalPages: 1
        }
      } else if (response.data && Array.isArray(response.data)) {
        // Response has data property with meta
        customers.value = response.data
        if (response.meta) {
          pagination.value = {
            total: response.meta.total || 0,
            page: response.meta.page || page,
            limit: response.meta.limit || limit,
            totalPages: Math.ceil((response.meta.total || 0) / (response.meta.limit || limit))
          }
        } else {
          pagination.value = {
            total: response.total || response.data.length,
            page: response.page || page,
            limit: response.limit || limit,
            totalPages: response.totalPages || Math.ceil((response.total || response.data.length) / limit)
          }
        }
      } else {
        // Unknown format
        customers.value = []
        pagination.value = {
          total: 0,
          page: page,
          limit: limit,
          totalPages: 0
        }
      }
    } catch (error: any) {
      console.error('Error fetching customers:', error)
      console.error('Error details:', error?.data, error?.statusCode, error?.message)

      // Set empty values on error
      customers.value = []
      pagination.value = {
        total: 0,
        page: page,
        limit: limit,
        totalPages: 0
      }
      // Don't throw, just log the error
    } finally {
      loading.value = false
    }
  }

  // Get customer by ID
  const fetchCustomer = async (id: number) => {
    loading.value = true
    try {
      const api = useApi()
      const response = await api<Customer>(`/customers/${id}`)

      currentCustomer.value = response
      return response
    } catch (error) {
      console.error('Error fetching customer:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Create customer
  const createCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    loading.value = true
    try {
      const api = useApi()
      const response = await api<Customer>('/customers', {
        method: 'POST',
        body: customerData
      })

      customers.value.unshift(response)
      return response
    } catch (error) {
      console.error('Error creating customer:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Update customer
  const updateCustomer = async (id: number, customerData: Partial<Customer>) => {
    loading.value = true
    try {
      const api = useApi()
      const response = await api<Customer>(`/customers/${id}`, {
        method: 'PATCH',
        body: customerData
      })

      const index = customers.value.findIndex(c => c.id === id)
      if (index !== -1) {
        customers.value[index] = response
      }

      if (currentCustomer.value?.id === id) {
        currentCustomer.value = response
      }

      return response
    } catch (error) {
      console.error('Error updating customer:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Delete customer
  const deleteCustomer = async (id: number) => {
    loading.value = true
    try {
      const api = useApi()
      await api(`/customers/${id}`, {
        method: 'DELETE'
      })

      customers.value = customers.value.filter(c => c.id !== id)

      if (currentCustomer.value?.id === id) {
        currentCustomer.value = null
      }
    } catch (error) {
      console.error('Error deleting customer:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    customers: readonly(customers),
    currentCustomer: readonly(currentCustomer),
    loading: readonly(loading),
    pagination: readonly(pagination),
    fetchCustomers,
    fetchCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer
  }
}) 