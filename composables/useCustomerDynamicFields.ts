import type { 
  CustomerDynamicField, 
  CustomerDynamicFieldValue,
  CreateCustomerDynamicFieldDto,
  UpdateCustomerDynamicFieldDto,
  CreateCustomerDynamicFieldValueDto,
  UpdateCustomerDynamicFieldValueDto
} from '~/types'

export const useCustomerDynamicFields = () => {
  const api = useApi()

  // Customer Dynamic Fields (Definitions)
  const getDynamicFields = async () => {
    return await api<CustomerDynamicField[]>('/customer-dynamic-fields')
  }

  const getDynamicField = async (id: number) => {
    return await api<CustomerDynamicField>(`/customer-dynamic-fields/${id}`)
  }

  const createDynamicField = async (data: CreateCustomerDynamicFieldDto) => {
    return await api<CustomerDynamicField>('/customer-dynamic-fields', {
      method: 'POST',
      body: data
    })
  }

  const updateDynamicField = async (id: number, data: UpdateCustomerDynamicFieldDto) => {
    return await api<CustomerDynamicField>(`/customer-dynamic-fields/${id}`, {
      method: 'PATCH',
      body: data
    })
  }

  const deleteDynamicField = async (id: number) => {
    return await api(`/customer-dynamic-fields/${id}`, {
      method: 'DELETE'
    })
  }

  // Customer Dynamic Field Values
  const getDynamicFieldValues = async () => {
    return await api<CustomerDynamicFieldValue[]>('/customer-dynamic-field-values')
  }

  const getDynamicFieldValue = async (id: number) => {
    return await api<CustomerDynamicFieldValue>(`/customer-dynamic-field-values/${id}`)
  }

  const getCustomerDynamicFields = async (customerId: number) => {
    return await api<CustomerDynamicFieldValue[]>(`/customer-dynamic-field-values/customer/${customerId}`)
  }

  const createDynamicFieldValue = async (data: CreateCustomerDynamicFieldValueDto) => {
    return await api<CustomerDynamicFieldValue>('/customer-dynamic-field-values', {
      method: 'POST',
      body: data
    })
  }

  const createBulkDynamicFieldValues = async (data: CreateCustomerDynamicFieldValueDto[]) => {
    return await api<CustomerDynamicFieldValue[]>('/customer-dynamic-field-values/bulk', {
      method: 'POST',
      body: data
    })
  }

  const updateDynamicFieldValue = async (id: number, data: UpdateCustomerDynamicFieldValueDto) => {
    return await api<CustomerDynamicFieldValue>(`/customer-dynamic-field-values/${id}`, {
      method: 'PATCH',
      body: data
    })
  }

  const deleteDynamicFieldValue = async (id: number) => {
    return await api(`/customer-dynamic-field-values/${id}`, {
      method: 'DELETE'
    })
  }

  const deleteCustomerDynamicFields = async (customerId: number) => {
    return await api(`/customer-dynamic-field-values/customer/${customerId}`, {
      method: 'DELETE'
    })
  }

  // Helper functions
  const getFieldTypeLabel = (type: string) => {
    const typeLabels = {
      text: 'Metin',
      number: 'Sayı',
      select: 'Seçim',
      file: 'Dosya',
      textarea: 'Uzun Metin',
      date: 'Tarih',
      email: 'E-posta',
      phone: 'Telefon',
      url: 'URL'
    }
    return typeLabels[type] || type
  }

  const getFieldTypeInput = (type: string) => {
    const typeInputs = {
      text: 'text',
      number: 'number',
      select: 'select',
      file: 'file',
      textarea: 'textarea',
      date: 'date',
      email: 'email',
      phone: 'tel',
      url: 'url'
    }
    return typeInputs[type] || 'text'
  }

  const parseOptionsData = (optionsData?: string) => {
    if (!optionsData) return []
    try {
      return JSON.parse(optionsData)
    } catch {
      return []
    }
  }

  const stringifyOptionsData = (options: any[]) => {
    return JSON.stringify(options)
  }

  return {
    // Dynamic Fields
    getDynamicFields,
    getDynamicField,
    createDynamicField,
    updateDynamicField,
    deleteDynamicField,
    
    // Dynamic Field Values
    getDynamicFieldValues,
    getDynamicFieldValue,
    getCustomerDynamicFields,
    createDynamicFieldValue,
    createBulkDynamicFieldValues,
    updateDynamicFieldValue,
    deleteDynamicFieldValue,
    deleteCustomerDynamicFields,
    
    // Helpers
    getFieldTypeLabel,
    getFieldTypeInput,
    parseOptionsData,
    stringifyOptionsData
  }
}

