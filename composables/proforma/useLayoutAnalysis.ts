import { ref, computed, watch } from 'vue'
import type { LayoutAnalysis } from './types'


interface WarningCounts {
  info: number
  warning: number
  error: number
}


export const useLayoutAnalysis = () => {
  const $api = useApi()
  
  const layoutAnalysis = ref<LayoutAnalysis | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Analyze existing proforma layout
   */
  const analyzeProforma = async (proformaId: number) => {
    loading.value = true
    error.value = null

    try {
      const response = await $api(`/proformas/${proformaId}/layout-analysis`)
      layoutAnalysis.value = response as LayoutAnalysis
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to analyze layout'
      console.error('Layout analysis error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Preview layout analysis without saving (for form)
   */
  const previewLayout = async (formData: any) => {
    loading.value = true
    error.value = null

    try {
      const response = await $api('/proformas/preview/layout-analysis', {
        method: 'POST',
        body: formData,
      })
      layoutAnalysis.value = response as LayoutAnalysis
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to preview layout'
      console.error('Layout preview error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Computed: Has warnings
   */
  const hasWarnings = computed(() => {
    if (!layoutAnalysis.value) return false
    return layoutAnalysis.value.warnings.length > 0
  })

  /**
   * Computed: Has errors
   */
  const hasErrors = computed(() => {
    if (!layoutAnalysis.value) return false
    return layoutAnalysis.value.warnings.some(w => w.severity === 'error')
  })

  /**
   * Computed: Warning count by severity
   */
const warningCounts = computed<WarningCounts>(() => {
  if (!layoutAnalysis.value) {
    return { info: 0, warning: 0, error: 0 }
  }

  return layoutAnalysis.value.warnings.reduce(
    (acc, w) => {
      acc[w.severity]++
      return acc
    },
    { info: 0, warning: 0, error: 0 }
  )
})

  /**
   * Computed: Treatment pages info
   */
  const treatmentPagesInfo = computed(() => {
    if (!layoutAnalysis.value) return null

    const treatmentPages = layoutAnalysis.value.pages.filter(p =>
      p.sections.some(s => s.type === 'treatments')
    )

    if (treatmentPages.length === 0) return null

    return {
      pageCount: treatmentPages.length,
      totalItems: treatmentPages.reduce((sum, page) => {
        const treatmentSection = page.sections.find(s => s.type === 'treatments')
        if (treatmentSection?.itemRange) {
          return sum + (treatmentSection.itemRange.end - treatmentSection.itemRange.start)
        }
        return sum
      }, 0),
    }
  })

  /**
   * Get page by number
   */
  const getPage = (pageNumber: number) => {
    if (!layoutAnalysis.value) return null
    return layoutAnalysis.value.pages.find(p => p.pageNumber === pageNumber)
  }

  /**
   * Reset analysis
   */
  const reset = () => {
    layoutAnalysis.value = null
    error.value = null
  }

  return {
    // State
    layoutAnalysis,
    loading,
    error,

    // Computed
    hasWarnings,
    hasErrors,
    warningCounts,
    treatmentPagesInfo,

    // Methods
    analyzeProforma,
    previewLayout,
    getPage,
    reset,
  }
}