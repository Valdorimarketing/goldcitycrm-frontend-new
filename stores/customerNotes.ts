import { defineStore } from 'pinia'
import type { CustomerNote, CreateCustomerNoteDto, UpdateCustomerNoteDto, PaginatedResponse } from '~/types'

export const useCustomerNotesStore = defineStore('customerNotes', () => {
  const customerNotes = ref<CustomerNote[]>([])
  const currentNote = ref<CustomerNote | null>(null)
  const loading = ref(false)
  const pagination = ref({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  })

  // Get all customer notes with filters
  const fetchCustomerNotes = async (page = 1, limit = 10, filters?: {
    customer?: number
    user?: number
    isReminding?: boolean
    today?: boolean
    startDate?: string
    endDate?: string
    noteType?: string
  }) => {
    loading.value = true
    try {
      const api = useApi()
      const query: any = { page, limit, ...filters }

      const response = await api('/customer-notes', {
        query
      }) as any
      
      // Eğer response direkt array ise
      if (Array.isArray(response)) {
        customerNotes.value = response
      } else if (response && response.data) {
        customerNotes.value = response.data
      } else {
        console.warn('Unexpected response format:', response)
        customerNotes.value = []
      }
      
      pagination.value = {
        total: response?.total || 0,
        page: response?.page || 1,
        limit: response?.limit || 10,
        totalPages: response?.totalPages || 1
      }
      
      return customerNotes.value
    } catch (error: any) {
      console.error('Error fetching customer notes:', error)
      console.error('Error details:', {
        message: error.message,
        data: error.data,
        statusCode: error.statusCode
      })
      customerNotes.value = []
      throw error
    } finally {
      loading.value = false
    }
  }

  // Get customer note by ID
  const fetchCustomerNote = async (id: number) => {
    loading.value = true
    try {
      const api = useApi()
      const response = await api<CustomerNote>(`/customer-notes/${id}`)
      
      currentNote.value = response
      return response
    } catch (error) {
      console.error('Error fetching customer note:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Create customer note
  const createCustomerNote = async (noteData: CreateCustomerNoteDto) => {
    loading.value = true
    try {
      const api = useApi()
      const response = await api<CustomerNote>('/customer-notes', {
        method: 'POST',
        body: noteData
      })
      
      customerNotes.value.unshift(response)
      return response
    } catch (error) {
      console.error('Error creating customer note:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Update customer note
  const updateCustomerNote = async (id: number, noteData: UpdateCustomerNoteDto) => {
    loading.value = true
    try {
      const api = useApi()
      const response = await api<CustomerNote>(`/customer-notes/${id}`, {
        method: 'PATCH',
        body: noteData
      })
      
      const index = customerNotes.value.findIndex(n => n.id === id)
      if (index !== -1) {
        customerNotes.value[index] = response
      }
      
      if (currentNote.value?.id === id) {
        currentNote.value = response
      }
      
      return response
    } catch (error) {
      console.error('Error updating customer note:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Delete customer note
  const deleteCustomerNote = async (id: number) => {
    loading.value = true
    try {
      const api = useApi()
      await api(`/customer-notes/${id}`, {
        method: 'DELETE'
      })
      
      customerNotes.value = customerNotes.value.filter(n => n.id !== id)
      
      if (currentNote.value?.id === id) {
        currentNote.value = null
      }
    } catch (error) {
      console.error('Error deleting customer note:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    customerNotes,
    currentNote,
    loading,
    pagination,
    fetchCustomerNotes,
    fetchCustomerNote,
    createCustomerNote,
    updateCustomerNote,
    deleteCustomerNote
  }
})