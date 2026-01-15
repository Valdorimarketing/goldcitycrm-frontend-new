import { ref, computed, watch } from 'vue'
import type { PreviewState } from './types'
import { debounce } from 'lodash-es'
import { useLayoutAnalysis } from './useLayoutAnalysis'

export const useLivePreview = () => {
  const previewState = ref<PreviewState>({
    currentPage: 1,
    zoom: 0.6,
    loading: false,
    error: null,
  })

  const previewHtml = ref<string>('')
  const { previewLayout } = useLayoutAnalysis()

  /**
   * Generate live preview HTML from form data
   */
  const generatePreview = async (formData: any) => {
    previewState.value.loading = true
    previewState.value.error = null

    try {
      // Get layout analysis
      const analysis = await previewLayout(formData)

      if (!analysis) {
        throw new Error('Failed to analyze layout')
      }

      // Generate HTML preview (simplified version)
      const html = await generatePreviewHTML(formData, analysis)
      previewHtml.value = html

      return html
    } catch (err: any) {
      previewState.value.error = err.message
      console.error('Preview generation error:', err)
      return null
    } finally {
      previewState.value.loading = false
    }
  }

  /**
   * Debounced preview update
   */
  const debouncedPreview = debounce((formData: any) => {
    generatePreview(formData)
  }, 500)

  /**
   * Navigate to page
   */
  const goToPage = (pageNumber: number) => {
    previewState.value.currentPage = pageNumber
  }

  /**
   * Zoom controls
   */
  const zoomIn = () => {
    previewState.value.zoom = Math.min(previewState.value.zoom + 0.1, 1.5)
  }

  const zoomOut = () => {
    previewState.value.zoom = Math.max(previewState.value.zoom - 0.1, 0.3)
  }

  const resetZoom = () => {
    previewState.value.zoom = 0.6
  }

  return {
    // State
    previewState,
    previewHtml,

    // Methods
    generatePreview,
    debouncedPreview,
    goToPage,
    zoomIn,
    zoomOut,
    resetZoom,
  }
}

/**
 * Helper: Generate preview HTML
 */
async function generatePreviewHTML(formData: any, analysis: any): Promise<string> {
  // This will generate a simplified HTML preview
  // For now, return a placeholder that shows page structure
  const pages = analysis.pages.map((page: any, index: number) => {
    const sectionsHtml = page.sections.map((section: any) => {
      return `
        <div class="preview-section" data-type="${section.type}">
          <div class="section-badge">${section.type}</div>
          <div class="section-height">${section.height}mm</div>
        </div>
      `
    }).join('')

    return `
      <div class="preview-page" data-page="${page.pageNumber}">
        <div class="page-header">
          <span>Page ${page.pageNumber}</span>
          <span>${page.estimatedHeight}mm</span>
          ${page.hasOverflow ? '<span class="overflow-badge">⚠️ Overflow</span>' : ''}
        </div>
        <div class="page-content">
          ${sectionsHtml}
        </div>
      </div>
    `
  }).join('')

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: 'Inter', sans-serif;
            background: #f5f5f5;
            padding: 20px;
            margin: 0;
          }
          .preview-page {
            width: 210mm;
            min-height: 297mm;
            background: white;
            margin: 20px auto;
            padding: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border-radius: 8px;
            page-break-after: always;
          }
          .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 10px;
            border-bottom: 2px solid #0891b2;
            margin-bottom: 20px;
            font-weight: 600;
          }
          .overflow-badge {
            background: #f59e0b;
            color: white;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
          }
          .preview-section {
            margin: 15px 0;
            padding: 15px;
            border: 1px solid #e5e7eb;
            border-radius: 4px;
            background: #f9fafb;
            position: relative;
          }
          .section-badge {
            display: inline-block;
            background: #0891b2;
            color: white;
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
          }
          .section-height {
            float: right;
            color: #6b7280;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        ${pages}
      </body>
    </html>
  `
}