import { ref } from 'vue'
import { useApi } from './useApi'

export interface MeetingStatus {
  id: number
  name: string
  color?: string
  description?: string
  order?: number
  createdAt?: string
  updatesAt?: string
}

export const useMeetingStatuses = () => {
  const $api = useApi()
  const statuses = ref<MeetingStatus[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchMeetingStatuses = async () => {
    loading.value = true
    error.value = null
    try {
      const response: any = await $api('/meeting-statuses')

      // Handle different response formats
      if (Array.isArray(response)) {
        statuses.value = response
      } else if (response && response.data) {
        statuses.value = response.data
      } else {
        statuses.value = []
      }

      return statuses.value
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch meeting statuses'
      statuses.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    statuses,
    loading,
    error,
    fetchMeetingStatuses
  }
}
