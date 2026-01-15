import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User, PaginatedResponse } from '~/types'

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const loading = ref(false)
  const pagination = ref({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  })

  // Get all users
  const fetchUsers = async (page = 1, limit = 10, filters: any = {}) => {
    loading.value = true
    try {
      const config = useRuntimeConfig()
      const queryParams: any = { page, limit, ...filters }

      const token = useCookie('auth-token').value

      const response = await $fetch<any>('/users', {
        baseURL: config.public.apiBase,
        query: queryParams,
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      // Handle different response formats
      if (Array.isArray(response)) {
        // Response is directly an array
        users.value = response
        pagination.value = {
          total: response.length,
          page: page,
          limit: limit,
          totalPages: 1
        }
      } else if (response.data && Array.isArray(response.data)) {
        // Response has data property
        users.value = response.data
        pagination.value = {
          total: response.total || response.data.length,
          page: response.page || page,
          limit: response.limit || limit,
          totalPages: response.totalPages || Math.ceil((response.total || response.data.length) / limit)
        }
      } else {
        // Unknown format
        users.value = []
        pagination.value = {
          total: 0,
          page: page,
          limit: limit,
          totalPages: 0
        }
      }
    } catch (error: any) {
      console.error('Error fetching users:', error)
      console.error('Error details:', error?.data, error?.statusCode, error?.message)

      // Set empty values on error
      users.value = []
      pagination.value = {
        total: 0,
        page: page,
        limit: limit,
        totalPages: 0
      }
    } finally {
      loading.value = false
    }
  }

  return {
    users,
    loading,
    pagination,
    fetchUsers
  }
}) 