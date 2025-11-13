import { ref } from 'vue'
import type { UserGroup, CreateUserGroupDto, UpdateUserGroupDto, PaginatedResponse } from '~/types'
import { useApi } from './useApi'

export const useUserTeams = () => {
  const $api = useApi()
  const userTeams = ref<UserGroup[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const totalPages = ref(1)
  const totalItems = ref(0)

  const fetchUserTeams = async (page = 1) => {
    loading.value = true
    error.value = null
    try {
      const response: any = await $api(`/teams?page=${page}`)

      // Response could be array or paginated object
      if (Array.isArray(response)) {
        userTeams.value = response
        totalPages.value = 1
        totalItems.value = response.length
        currentPage.value = 1
      } else if (response && typeof response === 'object') {
        const rawUserTeams = response.data || response.userTeams || []
        userTeams.value = rawUserTeams
        if (response.meta) {
          currentPage.value = response.meta.current_page
          totalPages.value = response.meta.last_page
          totalItems.value = response.meta.total
        }
      } else {
        userTeams.value = []
      }

      return response
    } catch (err: any) {
      error.value = err.message || 'Kullanıcı grupları yüklenirken hata oluştu'
      userTeams.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchUserTeam = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const response: UserGroup = await $api(`/teams/${id}`)
      return response
    } catch (err: any) {
      error.value = err.message || 'Takım yüklenirken hata oluştu'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createUserTeam = async (data: CreateUserGroupDto) => {
    loading.value = true
    error.value = null
    try {
      const response = await $api<UserGroup>('/teams', {
        method: 'POST',
        body: data
      })
      return response
    } catch (err: any) {
      error.value = err.message || 'Takım oluşturulurken hata oluştu'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateUserTeam = async (id: number, data: UpdateUserGroupDto) => {
    loading.value = true
    error.value = null
    try {
      const response = await $api<UserGroup>(`/teams/${id}`, {
        method: 'PATCH',
        body: data
      })
      return response
    } catch (err: any) {
      error.value = err.message || 'Takım güncellenirken hata oluştu'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteUserTeam = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await $api(`/teams/${id}`, {
        method: 'DELETE'
      })
      return true
    } catch (err: any) {
      error.value = err.message || 'Takım silinirken hata oluştu'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    userTeams,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    fetchUserTeams,
    fetchUserTeam,
    createUserTeam,
    updateUserTeam,
    deleteUserTeam
  }
}
