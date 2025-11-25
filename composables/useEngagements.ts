export const useEngagements = () => {
  const api = useApi()

  // Dashboard KPI
  const fetchDashboardKpi = async () => {
    try {
      const response = await api('/customer-engagements/dashboard/kpi')
      return response
    } catch (error) {
      console.error('Error fetching dashboard KPI:', error)
      throw error
    }
  }

  // User Performance List
  const fetchUserPerformanceList = async (period: 'week' | 'month' = 'week') => {
    try {
      const response = await api('/customer-engagements/dashboard/users', {
        params: { period }
      })
      return response
    } catch (error) {
      console.error('Error fetching user performance list:', error)
      throw error
    }
  }

  // User History
  const fetchUserHistory = async (userId: number, limit: number = 20) => {
    try {
      const response = await api(`/customer-engagements/users/${userId}/history`, {
        params: { limit }
      })
      return response
    } catch (error) {
      console.error('Error fetching user history:', error)
      throw error
    }
  }

  // Engagement Timeline
  const fetchEngagementTimeline = async (engagementId: number) => {
    try {
      const response = await api(`/customer-engagements/${engagementId}/timeline`)
      return response
    } catch (error) {
      console.error('Error fetching engagement timeline:', error)
      throw error
    }
  }

  return {
    fetchDashboardKpi,
    fetchUserPerformanceList,
    fetchUserHistory,
    fetchEngagementTimeline
  }
}