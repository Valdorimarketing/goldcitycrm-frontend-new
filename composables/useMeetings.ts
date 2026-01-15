import { ref } from 'vue'
import { useApi } from './useApi'

export interface Meeting {
  // Ana alanlar
  id: number
  customer: number
  customerData: any
  hospitalId?: number
  hospital?: {
    id: number
    name: string
    code: string
    address?: string
  }
  doctorId?: number
  doctor?: {
    id: number
    name: string
    branchId?: number
  }

  // Tarih/Saat alanları
  remindingAt?: Date | string
  startTime?: Date | string
  endTime?: Date | string

  // Durum ve açıklama
  user: number
  meetingStatus: number
  description?: string

  // Satış bağlantısı
  salesProductId?: number
  salesProduct?: {
    id: number
    // ... diğer alanlar
  }

  // Sistem alanları
  createdAt: Date | string
  updatesAt: Date | string
}

export interface MeetingFilters {
  customer?: number
  user?: number
  status?: number
  salesProductId?: number
}

export const useMeetings = () => {
  const $api = useApi()
  const meetings = ref<Meeting[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const meta = ref({
    page: 1,
    limit: 20,
    total: 0
  })

  const fetchMeetings = async (filters?: MeetingFilters & {
    page?: number
    limit?: number
  }) => {
    loading.value = true
    error.value = null
    try {
      // Build query parameters
      const queryParams = new URLSearchParams()
      if (filters?.page) queryParams.append('page', filters.page.toString())
      if (filters?.limit) queryParams.append('limit', filters.limit.toString())
      if (filters?.customer) queryParams.append('customer', filters.customer.toString())
      if (filters?.user) queryParams.append('user', filters.user.toString())
      if (filters?.status) queryParams.append('status', filters.status.toString())
      if (filters?.salesProductId) queryParams.append('salesProductId', filters.salesProductId.toString())

      const url = `/meetings${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      const response: any = await $api(url)

      // Handle different response formats
      if (response && response.data && Array.isArray(response.data)) {
        meetings.value = response.data
        if (response.meta) {
          meta.value = {
            page: response.meta.page || 1,
            limit: response.meta.limit || 20,
            total: response.meta.total || 0
          }
        }
      } else if (Array.isArray(response)) {
        meetings.value = response
        meta.value = {
          page: 1,
          limit: response.length,
          total: response.length
        }
      } else {
        console.warn('Unexpected response structure:', response)
        meetings.value = []
      }

      return { data: meetings.value, meta: meta.value }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch meetings'
      meetings.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchMeeting = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await $api(`/meetings/${id}`)
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch meeting'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createMeeting = async (data: Partial<Meeting>) => {
    loading.value = true
    error.value = null
    try {
      const response = await $api('/meetings', {
        method: 'POST',
        body: data
      })
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to create meeting'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateMeeting = async (id: number, data: Partial<Meeting>) => {
    loading.value = true
    error.value = null
    try {
      const response = await $api(`/meetings/${id}`, {
        method: 'PATCH',
        body: data
      })
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to update meeting'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteMeeting = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await $api(`/meetings/${id}`, {
        method: 'DELETE'
      })
      return true
    } catch (err: any) {
      error.value = err.message || 'Failed to delete meeting'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    meetings,
    loading,
    error,
    meta,
    fetchMeetings,
    fetchMeeting,
    createMeeting,
    updateMeeting,
    deleteMeeting
  }
}
