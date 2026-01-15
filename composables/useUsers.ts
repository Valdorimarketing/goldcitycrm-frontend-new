// composables/useUsers.ts
import { ref } from 'vue'
import { useApi } from './useApi'

export interface User {
  id: number
  name: string
  email?: string
  role?: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export const useUsers = () => {
  const $api = useApi()
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchUsers = async (params?: { role?: string; active?: boolean }) => {
    loading.value = true
    error.value = null
    
    try {
      const queryParams = new URLSearchParams()
      if (params?.role) queryParams.append('role', params.role)
      if (params?.active !== undefined) queryParams.append('active', params.active.toString())
      
      const queryString = queryParams.toString()
      const url = `/users${queryString ? `?${queryString}` : ''}`
      
      const response: any = await $api(url)
      
      if (Array.isArray(response)) {
        users.value = response
      } else if (response?.data) {
        users.value = response.data
      } else {
        users.value = []
      }
      
      return users.value
    } catch (err: any) {
      error.value = err.message || 'Kullanıcılar yüklenemedi'
      users.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  // Sadece satışçıları getir
  const fetchSalesUsers = async () => {
    return fetchUsers({ role: 'user', active: true })
  }

  return {
    users,
    loading,
    error,
    fetchUsers,
    fetchSalesUsers
  }
}