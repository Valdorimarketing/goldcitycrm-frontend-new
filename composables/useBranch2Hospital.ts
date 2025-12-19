import type { Branch2Hospital } from "../types"

export const useBranch2Hospital = () => {
  const $api = useApi()
  const assignments = ref<Branch2Hospital[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchAssignments = async (hospitalId?: number, branchId?: number) => {
    loading.value = true
    error.value = null
    try {
      let url = '/branch2hospital'
      const params = []
      if (hospitalId) params.push(`hospitalId=${hospitalId}`)
      if (branchId) params.push(`branchId=${branchId}`)
      if (params.length > 0) url += `?${params.join('&')}`

      const response: any = await $api(url)

      // API returns { data: [...], meta: {...} }
      if (response && response.data && Array.isArray(response.data)) {
        assignments.value = response.data
      } else if (Array.isArray(response)) {
        assignments.value = response
      } else {
        console.warn('Unexpected branch2hospital response structure:', response)
        assignments.value = []
      }

      return assignments.value
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch assignments'
      assignments.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  const createAssignment = async (data: { hospitalId: number; branchId: number }) => {
    loading.value = true
    error.value = null
    try {
      const response = await $api('/branch2hospital', {
        method: 'POST',
        body: data
      })
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to create assignment'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteAssignment = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await $api(`/branch2hospital/${id}`, {
        method: 'DELETE'
      })
      return true
    } catch (err: any) {
      error.value = err.message || 'Failed to delete assignment'
      throw err
    } finally {
      loading.value = false
    }
  }

  const checkAssignmentExists = async (hospitalId: number, branchId: number) => {
    try {
      const response: any = await $api(`/branch2hospital/check?hospitalId=${hospitalId}&branchId=${branchId}`)
      return response.exists || false
    } catch (err: any) {
      console.error('Failed to check assignment:', err)
      return false
    }
  }

  return {
    assignments,
    loading,
    error,
    fetchAssignments,
    createAssignment,
    deleteAssignment,
    checkAssignmentExists
  }
}