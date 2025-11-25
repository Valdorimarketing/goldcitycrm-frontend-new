import { ref } from 'vue'
import { useApi } from '@/composables/useApi'

export interface InteractionSession {
  id: number
  customerId: number
  userId: number
  actorType: 'LEAD_OWNER' | 'DOCTOR' | 'SALES'
  startedAt: string
  endedAt?: string | null
  durationSeconds?: number | null
  meta?: any
}

export interface InteractionSummary {
  customerId: number
  firstInteractionAt: string | null
  firstInteractionUserId: number | null
  totalLeadOwnerDurationSeconds: number
  doctorTotalDurationAfterAssignedSeconds: number
  salesFirstInteractionAfterDoctorAt: string | null
  sessions: InteractionSession[]
}

export interface DailyActivity {
  userId: number
  date: string
  totalActiveSeconds: number
}

export interface ConversionSpeedStats {
  fastUsersAvgSeconds: number
  slowUsersAvgSeconds: number
  fastUserIds: number[]
  slowUserIds: number[]
}

export const useInteractions = () => {
  const $api = useApi()

  const loading = ref(false)
  const error = ref<string | null>(null)

  const currentSession = ref<InteractionSession | null>(null)
  const customerSummary = ref<InteractionSummary | null>(null)
  const dailyActivity = ref<DailyActivity | null>(null)
  const conversionStats = ref<ConversionSpeedStats | null>(null)

  // ---------------------
  // START SESSION
  // ---------------------
  const startSession = async (data: {
    customerId: number
    actorType: 'LEAD_OWNER' | 'DOCTOR' | 'SALES'
    meta?: any
  }) => {
    loading.value = true
    error.value = null
    try {
      const response = await $api('/customer-interaction/start', {
        method: 'POST',
        body: data
      }) as any
      currentSession.value = response
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to start session'
      throw err
    } finally {
      loading.value = false
    }
  }

  // ---------------------
  // END SESSION
  // ---------------------
  const endSession = async (sessionId: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await $api('/customer-interaction/end', {
        method: 'POST',
        body: { sessionId }
      })
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to end session'
      throw err
    } finally {
      loading.value = false
    }
  }

  // ---------------------
  // CUSTOMER SUMMARY
  // ---------------------
  const fetchCustomerSummary = async (customerId: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await $api(`/customer-interaction/customer/${customerId}/summary`) as any
      customerSummary.value = response
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch customer interaction summary'
      throw err
    } finally {
      loading.value = false
    }
  }

  // ---------------------
  // DAILY ACTIVITY
  // ---------------------
  const fetchDailyActivity = async (userId: number, date: string) => {
    loading.value = true
    error.value = null
    try {
      const url = `/customer-interaction/users/${userId}/daily-activity?date=${date}`
      const response = await $api(url) as any
      dailyActivity.value = response
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch daily activity'
      throw err
    } finally {
      loading.value = false
    }
  }

  // ---------------------
  // CONVERSION STATS
  // ---------------------
  const fetchConversionSpeedStats = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await $api('/customer-interaction/analytics/conversion-speed') as any
      conversionStats.value = response
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch conversion speed stats'
      throw err
    } finally {
      loading.value = false
    }
  }

   const registerPhoneView = async (customerId: number) => {
    try {
      await $api(`/customers/${customerId}/view-phone`, {
        method: 'POST'
      })
    } catch (error) {
      console.error('Error registering phone view:', error)
    }
  }

  return {
    loading,
    error,

    currentSession,
    customerSummary,
    dailyActivity,
    conversionStats,

    registerPhoneView,
    startSession,
    endSession,
    fetchCustomerSummary,
    fetchDailyActivity,
    fetchConversionSpeedStats,
  }
}
