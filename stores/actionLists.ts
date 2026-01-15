import { defineStore } from 'pinia'
import type { ActionList, CreateActionListDto, UpdateActionListDto, PaginatedResponse } from '~/types'

export const useActionListsStore = defineStore('actionLists', () => {
  const actionLists = ref<ActionList[]>([])
  const currentActionList = ref<ActionList | null>(null)
  const loading = ref(false)
  const pagination = ref({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  })

  // Get all action lists
  const fetchActionLists = async (page = 1, limit = 10, productId?: string) => {
    loading.value = true
    try {
      const $api = useApi()
      const query: any = { page, limit }
      if (productId) {
        query.productId = productId
      }

      const response = await $api<PaginatedResponse<ActionList>>('/action-list', {
        query
      })
      
      // Eğer response direkt array ise
      if (Array.isArray(response)) {
        actionLists.value = response
      } else if (response.data) {
        actionLists.value = response.data
      }
      
      pagination.value = {
        total: response.total || 0,
        page: response.page || 1,
        limit: response.limit || 100,
        totalPages: response.totalPages || 1
      }
    } catch (error) {
      console.error('Error fetching action lists:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Get action list by ID
  const fetchActionList = async (id: number) => {
    loading.value = true
    try {
      const $api = useApi()
      const response = await $api<ActionList>(`/action-list/${id}`)
      
      currentActionList.value = response
      return response
    } catch (error) {
      console.error('Error fetching action list:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Create action list
  const createActionList = async (actionListData: CreateActionListDto) => {
    loading.value = true
    try {
      const $api = useApi()
      const response = await $api<ActionList>('/action-list', {
        method: 'POST',
        body: actionListData
      })
      
      actionLists.value.unshift(response)
      return response
    } catch (error) {
      console.error('Error creating action list:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Update action list
  const updateActionList = async (id: number, actionListData: UpdateActionListDto) => {
    loading.value = true
    try {
      const $api = useApi()
      const response = await $api<ActionList>(`/action-list/${id}`, {
        method: 'PATCH',
        body: actionListData
      })
      
      const index = actionLists.value.findIndex(a => a.id === id)
      if (index !== -1) {
        actionLists.value[index] = response
      }
      
      if (currentActionList.value?.id === id) {
        currentActionList.value = response
      }
      
      return response
    } catch (error) {
      console.error('Error updating action list:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Delete action list
  const deleteActionList = async (id: number) => {
    loading.value = true
    try {
      const $api = useApi()
      await $api(`/action-list/${id}`, {
        method: 'DELETE'
      })
      
      actionLists.value = actionLists.value.filter(a => a.id !== id)
      
      if (currentActionList.value?.id === id) {
        currentActionList.value = null
      }
    } catch (error) {
      console.error('Error deleting action list:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    actionLists,
    currentActionList,
    loading,
    pagination,
    fetchActionLists,
    fetchActionList,
    createActionList,
    updateActionList,
    deleteActionList
  }
})