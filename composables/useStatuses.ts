import { ref } from 'vue'
import { useApi } from './useApi'

export interface Status {
  id: number
  name: string
  color: string
  description?: string
  order: number
  isRemindable: boolean
  isFirst: boolean
  isClosed: boolean
  isSale: boolean
  remindingDay?: number | null
  isDoctor?: boolean
  isPricing?: boolean
  created_at?: string
  updated_at?: string
}

export interface StatusesResponse {
  data: Status[]
  links?: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
  meta?: {
    current_page: number
    from: number
    last_page: number
    path: string
    per_page: number
    to: number
    total: number
  }
}

export const useStatuses = () => {
  const $api = useApi()
  const statuses = ref<Status[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const totalPages = ref(1)
  const totalItems = ref(0)

  const fetchStatuses = async (page = 1) => {
    loading.value = true
    error.value = null
    try {
      const response: any = await $api(`/statuses?page=${page}`)

      // Helper function to map camelCase to snake_case
      const convertBooleans = (status: any) => {
        return {
          ...status,
          // Map camelCase fields from API to snake_case
          is_remindable: status.isRemindable ?? status.is_remindable ?? false,
          is_first: status.isFirst ?? status.is_first ?? false,
          is_closed: status.isClosed ?? status.is_closed ?? false,
          is_sale: status.isSale ?? status.is_sale ?? false,
          remindingDay: status.remindingDay ?? status.reminding_day ?? null,
          isDoctor: status.isDoctor ?? status.is_doctor ?? false,
          isPricing: status.isPricing ?? status.is_pricing ?? false,
          order: status.order ?? 0
        }
      }

      // Response doğrudan array olarak geliyor
      if (Array.isArray(response)) {
        statuses.value = response.map(convertBooleans)
        totalPages.value = 1
        totalItems.value = response.length
        currentPage.value = 1
      } else if (response && typeof response === 'object') {
        const rawStatuses = response.data || response.statuses || []
        statuses.value = rawStatuses.map(convertBooleans)
        if (response.meta) {
          currentPage.value = response.meta.current_page
          totalPages.value = response.meta.last_page
          totalItems.value = response.meta.total
        }
      } else {
        statuses.value = []
      }

      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch statuses'
      statuses.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchStatus = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const response: any = await $api(`/statuses/${id}`)
      // API returns the status directly, not wrapped in data
      const status = response

      return {
        ...status,
        // Map camelCase fields from API to snake_case
        is_remindable: status.isRemindable ?? status.is_remindable ?? false,
        is_first: status.isFirst ?? status.is_first ?? false,
        is_closed: status.isClosed ?? status.is_closed ?? false,
        is_sale: status.isSale ?? status.is_sale ?? false,
        remindingDay: status.remindingDay ?? status.reminding_day ?? null,
        isDoctor: status.isDoctor ?? status.is_doctor ?? false,
        isPricing: status.isPricing ?? status.is_pricing ?? false,
        order: status.order ?? 0
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch status'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createStatus = async (data: Partial<Status>) => {
    loading.value = true
    error.value = null
    try {
      const response = await $api<{ data: Status }>('/statuses', {
        method: 'POST',
        body: data
      })
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to create status'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateStatus = async (id: number, data: Partial<Status>) => {
    loading.value = true
    error.value = null
    try {
      const response = await $api<{ data: Status }>(`/statuses/${id}`, {
        method: 'PATCH',
        body: data
      })
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to update status'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteStatus = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await $api(`/statuses/${id}`, {
        method: 'DELETE'
      })
      return true
    } catch (err: any) {
      error.value = err.message || 'Failed to delete status'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateStatusOrder = async (statuses: { id: number; order: number }[]) => {
    loading.value = true
    error.value = null
    try {
      const promises = statuses.map(status =>
        $api(`/statuses/${status.id}`, {
          method: 'PATCH',
          body: { order: status.order }
        })
      )
      await Promise.all(promises)
      return true
    } catch (err: any) {
      error.value = err.message || 'Failed to update status order'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    statuses,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    fetchStatuses,
    fetchStatus,
    createStatus,
    updateStatus,
    deleteStatus,
    updateStatusOrder
  }
}