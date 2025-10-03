import { defineStore } from 'pinia'
import type { Customer, ApiResponse, PaginatedResponse } from '~/types'

export const useCustomersStore = defineStore('customers', () => {
  const customers = ref<Customer[]>([])
  const currentCustomer = ref<Customer | null>(null)
  const loading = ref(false)
  const pagination = ref({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  })

  // Get all customers
  const fetchCustomers = async (page = 1, limit = 10, filters: any = {}) => {
    console.log('[Store] fetchCustomers called with:', { page, limit, filters })
    loading.value = true
    try {
      console.log('[Store] Getting config...')
      const config = useRuntimeConfig()
      console.log('[Store] Config apiBase:', config.public.apiBase)

      const queryParams: any = { page, limit, ...filters }
      console.log('[Store] Query params:', queryParams)

      const token = useCookie('auth-token').value
      console.log('[Store] Token exists:', !!token)

      console.log('[Store] Calling API...')
      const response = await $fetch<any>('/customers', {
        baseURL: config.public.apiBase,
        query: queryParams,
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      console.log('[Store] Customers API Response:', response)

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
        // Response has data property
        customers.value = response.data
        pagination.value = {
          total: response.total || response.data.length,
          page: response.page || page,
          limit: response.limit || limit,
          totalPages: response.totalPages || Math.ceil((response.total || response.data.length) / limit)
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
      const config = useRuntimeConfig()
      const response = await $fetch<Customer>(`/customers/${id}`, {
        baseURL: config.public.apiBase,
        headers: {
          Authorization: `Bearer ${useCookie('auth-token').value}`
        }
      })
      
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
      const config = useRuntimeConfig()
      const response = await $fetch<Customer>('/customers', {
        method: 'POST',
        baseURL: config.public.apiBase,
        body: customerData,
        headers: {
          Authorization: `Bearer ${useCookie('auth-token').value}`
        }
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
      const config = useRuntimeConfig()
      const response = await $fetch<Customer>(`/customers/${id}`, {
        method: 'PATCH',
        baseURL: config.public.apiBase,
        body: customerData,
        headers: {
          Authorization: `Bearer ${useCookie('auth-token').value}`
        }
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
      const config = useRuntimeConfig()
      await $fetch(`/customers/${id}`, {
        method: 'DELETE',
        baseURL: config.public.apiBase,
        headers: {
          Authorization: `Bearer ${useCookie('auth-token').value}`
        }
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