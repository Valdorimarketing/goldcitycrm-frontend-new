// Layout Analysis Types
export interface TemplateConstraints {
  templateType: 'liv-blue' | 'medical-red' | 'istinye-blue'
  pageHeight: number
  pageWidth: number
  margins: {
    top: number
    bottom: number
    left: number
    right: number
  }
  sections: {
    generalInfo: SectionConstraint
    opinion: SectionConstraint
    treatments: TreatmentSectionConstraint
    services: SectionConstraint
    financial: SectionConstraint
    bank: SectionConstraint
  }
}

export interface SectionConstraint {
  maxHeight: number
  minHeight: number
  required: boolean
  pageBreakBefore?: boolean
  pageBreakAfter?: boolean
}

export interface TreatmentSectionConstraint extends SectionConstraint {
  rowHeight: number
  headerHeight: number
  footerHeight: number
  itemsPerPage: number
  maxItemsBeforeWarning: number
}

export interface PageContent {
  pageNumber: number
  sections: PageSection[]
  estimatedHeight: number
  hasOverflow: boolean
}

export interface PageSection {
  type: 'cover' | 'info' | 'opinion' | 'treatments' | 'services' | 'financial' | 'bank' | 'closing'
  content: any
  height: number
  itemRange?: { start: number; end: number }
}

export interface LayoutAnalysis {
  totalPages: number
  pages: PageContent[]
  warnings: LayoutWarning[]
  recommendations: string[]
  isValid: boolean
}

export interface LayoutWarning {
  severity: 'info' | 'warning' | 'error'
  section: string
  message: string
  suggestion?: string
}

// Preview State
export interface PreviewState {
  currentPage: number
  zoom: number
  loading: boolean
  error: string | null
}