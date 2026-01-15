import { defineStore } from 'pinia'

export interface CustomerHistory {
  id: number
  customer: number
  action: string
  description?: string
  changes?: any
  user?: number
  userInfo?: {
    id: number
    name: string
  }
  createdAt?: string
  created_at?: string
  updatedAt?: string
  updated_at?: string
}

export const useCustomerHistoriesStore = defineStore('customerHistories', () => {
  const histories = ref<CustomerHistory[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Fetch customer histories
  const fetchCustomerHistories = async (customerId: number) => {
    loading.value = true
    error.value = null
    
    try {
      const config = useRuntimeConfig()
      const response = await $fetch(`/customer-history`, {
        baseURL: config.public.apiBase,
        query: { customer: customerId },
        headers: {
          Authorization: `Bearer ${useCookie('auth-token').value}`
        }
      })
      
      
      if (Array.isArray(response)) {
        histories.value = response
      } else if (response && response.data) {
        histories.value = response.data
      } else {
        histories.value = []
      }
      
      return histories.value
    } catch (err: any) {
      console.error('Error fetching customer histories:', err)
      error.value = err.message || 'Failed to fetch customer histories'
      histories.value = []
      
      // If endpoint doesn't exist, return empty array
      if (err.statusCode === 404) {
        console.info('Customer history endpoint not found. This feature may not be implemented in the backend yet.')
        return []
      }
      
      throw err
    } finally {
      loading.value = false
    }
  }

  // Create customer history entry
  const createCustomerHistory = async (historyData: {
    customer: number
    action: string
    description?: string
    changes?: any
    user?: number
  }) => {
    loading.value = true
    error.value = null
    
    try {
      const config = useRuntimeConfig()
      const response = await $fetch<CustomerHistory>('/customer-history', {
        method: 'POST',
        baseURL: config.public.apiBase,
        body: historyData,
        headers: {
          Authorization: `Bearer ${useCookie('auth-token').value}`
        }
      })
      
      histories.value.unshift(response)
      return response
    } catch (err: any) {
      console.error('Error creating customer history:', err)
      error.value = err.message || 'Failed to create customer history'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Clear histories
  const clearHistories = () => {
    histories.value = []
    error.value = null
  }

  return {
    histories,
    loading,
    error,
    fetchCustomerHistories,
    createCustomerHistory,
    clearHistories
  }
})