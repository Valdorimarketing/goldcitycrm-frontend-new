// composables/useReports.ts
import { ref } from 'vue'
import { useApi } from './useApi'

export interface SalesPerformance {
  userId: number
  userName: string
  userEmail?: string
  totalLeads: number
  reached: number
  notReached: number
  notInterested: number
  fiveTimesNotReached: number
  wrongApplication: number
  expensive: number
  unqualified: number
  sold: number
}

export interface ReportFilters {
  userIds?: number[]
  startDate?: string
  endDate?: string
}


export interface TrendDataPoint {
  date: string
  dateLabel: string
  totalLeads: number
  reached: number
  notReached: number
  sold: number
}

export interface ReportFilters {
  userIds?: number[]
  startDate?: string
  endDate?: string
}



export const useReports = () => {
  const $api = useApi()
  const salesPerformance = ref<SalesPerformance[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const trendLoading = ref(false)
  const trendData = ref<TrendDataPoint[]>([])

  const fetchSalesPerformance = async (filters?: ReportFilters) => {
    loading.value = true
    error.value = null
    
    try {
      const queryParams = new URLSearchParams()
      
      if (filters?.userIds && filters.userIds.length > 0) {
        queryParams.append('userIds', filters.userIds.join(','))
      }
      if (filters?.startDate) {
        queryParams.append('startDate', filters.startDate)
      }
      if (filters?.endDate) {
        queryParams.append('endDate', filters.endDate)
      }

      const queryString = queryParams.toString()
      const url = `/reports/sales-performance${queryString ? `?${queryString}` : ''}`
      
      const response: any = await $api(url)
      
      salesPerformance.value = Array.isArray(response) ? response : response.data || []
      return salesPerformance.value
    } catch (err: any) {
      error.value = err.message || 'Rapor yüklenemedi'
      salesPerformance.value = []
      throw err
    } finally {
      loading.value = false
    }
  }



    const fetchSalesTrend = async (days: number = 7, userIds?: number[]) => {
    trendLoading.value = true
    
    try {
      const queryParams = new URLSearchParams()
      queryParams.append('days', days.toString())
      
      if (userIds && userIds.length > 0) {
        queryParams.append('userIds', userIds.join(','))
      }

      const url = `/reports/sales-trend?${queryParams.toString()}`
      const response: any = await $api(url)
      
      trendData.value = Array.isArray(response) ? response : []
      return trendData.value
    } catch (err: any) {
      console.error('Trend verisi yüklenemedi:', err)
      trendData.value = []
    } finally {
      trendLoading.value = false
    }
  }


  return {
    salesPerformance,
    trendData,
    loading,
    trendLoading,
    error,
    fetchSalesPerformance,
    fetchSalesTrend
  }
}