export const usePayments = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase

  const payments = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchPayments = async (customerId?: number, filters?: any) => {
    loading.value = true
    error.value = null

    try {
      const query: any = { ...filters }
      if (customerId) {
        query.customerId = customerId
      }

      const data = await $fetch(`${baseURL}/payments`, {
        method: 'GET',
        query,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      })
      payments.value = data || []
    } catch (err) {
      console.error('Error fetching payments:', err)
      error.value = err.message || 'Ödemeler yüklenirken bir hata oluştu'
      payments.value = []
    } finally {
      loading.value = false
    }
  }

  const getPayment = async (id: string | number) => {
    loading.value = true
    error.value = null

    try {
      const data = await $fetch(`${baseURL}/payments/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      })
      return data
    } catch (err) {
      console.error('Error fetching payment:', err)
      error.value = err.message || 'Ödeme detayları yüklenirken bir hata oluştu'
      return null
    } finally {
      loading.value = false
    }
  }

  const createPayment = async (paymentData: any) => {
    loading.value = true
    error.value = null

    try {
      const data = await $fetch(`${baseURL}/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          'Content-Type': 'application/json'
        },
        body: paymentData
      })
      await fetchPayments()
      return data
    } catch (err) {
      console.error('Error creating payment:', err)
      error.value = err.message || 'Ödeme oluşturulurken bir hata oluştu'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updatePayment = async (id: string | number, paymentData: any) => {
    loading.value = true
    error.value = null

    try {
      const data = await $fetch(`${baseURL}/payments/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          'Content-Type': 'application/json'
        },
        body: paymentData
      })
      await fetchPayments()
      return data
    } catch (err) {
      console.error('Error updating payment:', err)
      error.value = err.message || 'Ödeme güncellenirken bir hata oluştu'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deletePayment = async (id: string | number) => {
    loading.value = true
    error.value = null

    try {
      const data = await $fetch(`${baseURL}/payments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      })
      await fetchPayments()
      return data
    } catch (err) {
      console.error('Error deleting payment:', err)
      error.value = err.message || 'Ödeme silinirken bir hata oluştu'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Refund endpoint may not exist in backend yet, keeping for future use
  const refundPayment = async (id: string | number) => {
    loading.value = true
    error.value = null

    try {
      const data = await $fetch(`${baseURL}/payments/${id}/refund`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      })
      await fetchPayments()
      return data
    } catch (err) {
      console.error('Error refunding payment:', err)
      error.value = err.message || 'Ödeme iadesi yapılırken bir hata oluştu'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    payments,
    loading,
    error,
    fetchPayments,
    getPayment,
    createPayment,
    updatePayment,
    deletePayment,
    refundPayment
  }
}