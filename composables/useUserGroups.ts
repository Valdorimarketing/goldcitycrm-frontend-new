import { ref } from 'vue'
import type { UserGroup, CreateUserGroupDto, UpdateUserGroupDto, PaginatedResponse } from '~/types'
import { useApi } from './useApi'

export const useUserGroups = () => {
  const $api = useApi()
  const userGroups = ref<UserGroup[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const totalPages = ref(1)
  const totalItems = ref(0)

  const fetchUserGroups = async (page = 1) => {
    loading.value = true
    error.value = null
    try {
      const response: any = await $api(`/user-group?page=${page}`)

      // Response could be array or paginated object
      if (Array.isArray(response)) {
        userGroups.value = response
        totalPages.value = 1
        totalItems.value = response.length
        currentPage.value = 1
      } else if (response && typeof response === 'object') {
        const rawUserGroups = response.data || response.userGroups || []
        userGroups.value = rawUserGroups
        if (response.meta) {
          currentPage.value = response.meta.current_page
          totalPages.value = response.meta.last_page
          totalItems.value = response.meta.total
        }
      } else {
        userGroups.value = []
      }

      return response
    } catch (err: any) {
      error.value = err.message || 'Kullanıcı grupları yüklenirken hata oluştu'
      userGroups.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchUserGroup = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const response: UserGroup = await $api(`/user-group/${id}`)
      return response
    } catch (err: any) {
      error.value = err.message || 'Kullanıcı grubu yüklenirken hata oluştu'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createUserGroup = async (data: CreateUserGroupDto) => {
    loading.value = true
    error.value = null
    try {
      const response = await $api<UserGroup>('/user-group', {
        method: 'POST',
        body: data
      })
      return response
    } catch (err: any) {
      error.value = err.message || 'Kullanıcı grubu oluşturulurken hata oluştu'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateUserGroup = async (id: number, data: UpdateUserGroupDto) => {
    loading.value = true
    error.value = null
    try {
      const response = await $api<UserGroup>(`/user-group/${id}`, {
        method: 'PATCH',
        body: data
      })
      return response
    } catch (err: any) {
      error.value = err.message || 'Kullanıcı grubu güncellenirken hata oluştu'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteUserGroup = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await $api(`/user-group/${id}`, {
        method: 'DELETE'
      })
      return true
    } catch (err: any) {
      error.value = err.message || 'Kullanıcı grubu silinirken hata oluştu'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    userGroups,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    fetchUserGroups,
    fetchUserGroup,
    createUserGroup,
    updateUserGroup,
    deleteUserGroup
  }
}
