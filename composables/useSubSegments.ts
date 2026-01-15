// composables/useSubSegments.ts
import { ref } from 'vue'
import { useApi } from './useApi'
import type { SubSegment } from '../types'


export interface CreateSubSegmentDto {
  name: string
  description?: string
  remindingDay?: number
  isManual?: boolean
  isSale?: boolean
  color?: string
  order?: number
  isActive?: boolean
  parentStatusId: number
}

export interface UpdateSubSegmentDto extends Partial<CreateSubSegmentDto> {}

export const useSubSegments = () => {
  const $api = useApi()
  const subSegments = ref<SubSegment[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const totalPages = ref(1)
  const totalItems = ref(0)

  // Helper function to normalize response
  const normalizeSubSegment = (segment: any): SubSegment => {
    return {
      ...segment,
      isManual: segment.isManual ?? segment.is_manual ?? false,
      isSale: segment.isSale ?? segment.is_sale ?? false,
      isActive: segment.isActive ?? segment.is_active ?? true,
      remindingDay: segment.remindingDay ?? segment.reminding_day ?? null,
      parentStatusId: segment.parentStatusId ?? segment.parent_status_id,
      order: segment.order ?? 0
    }
  }

  // Tüm alt segmentleri getir
  const fetchSubSegments = async (params?: { active?: boolean; parentStatusId?: number }) => {
    loading.value = true
    error.value = null
    try {
      const queryParams = new URLSearchParams()
      if (params?.active) queryParams.append('active', 'true')
      if (params?.parentStatusId) queryParams.append('parentStatusId', params.parentStatusId.toString())
      
      const queryString = queryParams.toString()
      const url = `/sub-segments${queryString ? `?${queryString}` : ''}`
      
      const response: any = await $api(url)

      if (Array.isArray(response)) {
        subSegments.value = response.map(normalizeSubSegment)
        totalPages.value = 1
        totalItems.value = response.length
        currentPage.value = 1
      } else if (response && typeof response === 'object') {
        const rawSegments = response.data || response.subSegments || []
        subSegments.value = rawSegments.map(normalizeSubSegment)
        if (response.meta) {
          currentPage.value = response.meta.current_page
          totalPages.value = response.meta.last_page
          totalItems.value = response.meta.total
        }
      } else {
        subSegments.value = []
      }

      return subSegments.value
    } catch (err: any) {
      error.value = err.message || 'Alt segmentler yüklenemedi'
      subSegments.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  // Belirli bir status'un alt segmentlerini getir
  const fetchByParentStatus = async (parentStatusId: number) => {
    return fetchSubSegments({ parentStatusId, active: true })
  }

  // Tek bir alt segment getir
  const fetchSubSegment = async (id: number): Promise<SubSegment> => {
    loading.value = true
    error.value = null
    try {
      const response: any = await $api(`/sub-segments/${id}`)
      return normalizeSubSegment(response)
    } catch (err: any) {
      error.value = err.message || 'Alt segment yüklenemedi'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Alt segment oluştur
  const createSubSegment = async (data: CreateSubSegmentDto): Promise<SubSegment> => {
    loading.value = true
    error.value = null
    try {
      const response: any = await $api('/sub-segments', {
        method: 'POST',
        body: data
      })
      
      const newSubSegment = normalizeSubSegment(response.data || response)
      subSegments.value.push(newSubSegment)
      return newSubSegment
    } catch (err: any) {
      error.value = err.message || 'Alt segment oluşturulamadı'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Alt segment güncelle
  const updateSubSegment = async (id: number, data: UpdateSubSegmentDto): Promise<SubSegment> => {
    loading.value = true
    error.value = null
    try {
      const response: any = await $api(`/sub-segments/${id}`, {
        method: 'PATCH',
        body: data
      })
      
      const updated = normalizeSubSegment(response.data || response)
      const index = subSegments.value.findIndex(s => s.id === id)
      if (index !== -1) {
        subSegments.value[index] = updated
      }
      return updated
    } catch (err: any) {
      error.value = err.message || 'Alt segment güncellenemedi'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Alt segment sil
  const deleteSubSegment = async (id: number): Promise<void> => {
    loading.value = true
    error.value = null
    try {
      await $api(`/sub-segments/${id}`, {
        method: 'DELETE'
      })
      
      subSegments.value = subSegments.value.filter(s => s.id !== id)
    } catch (err: any) {
      error.value = err.message || 'Alt segment silinemedi'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Sıralama güncelle
  const updateSubSegmentOrder = async (segments: { id: number; order: number }[]) => {
    loading.value = true
    error.value = null
    try {
      const promises = segments.map(segment =>
        $api(`/sub-segments/${segment.id}`, {
          method: 'PATCH',
          body: { order: segment.order }
        })
      )
      await Promise.all(promises)
      return true
    } catch (err: any) {
      error.value = err.message || 'Sıralama güncellenemedi'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    subSegments,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    fetchSubSegments,
    fetchByParentStatus,
    fetchSubSegment,
    createSubSegment,
    updateSubSegment,
    deleteSubSegment,
    updateSubSegmentOrder
  }
}