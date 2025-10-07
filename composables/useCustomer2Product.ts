import { ref } from 'vue'
import { useApi } from './useApi'

export interface Product {
  id: number
  name: string
  description?: string
}

export interface Customer2Product {
  id: number
  product: Product
  customer: {
    id: number
    firstName: string
    lastName: string
  }
  price: number
  discount: number
  offer: number
  note?: string
  isSold: boolean
  saleId?: number | null
}

export interface ConvertToSaleRequest {
  customerId: number
  customer2ProductIds: number[]
  userId: number
  title?: string
  description?: string
  responsibleUser?: number
  followerUser?: number
  maturityDate?: string
}

export interface ConvertToSaleResponse {
  id: number
  customer: number
  user: number
  title: string
  description?: string
  responsibleUser?: number
  followerUser?: number
  maturityDate?: string
  createdAt: string
  updatedAt: string
}

export const useCustomer2Product = () => {
  const $api = useApi()
  const loading = ref(false)
  const error = ref<string | null>(null)
  const unsoldProducts = ref<Customer2Product[]>([])

  /**
   * Müşterinin satılmamış ürünlerini getirir
   * @param customerId Müşteri ID
   */
  const fetchUnsoldProducts = async (customerId: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await $api<Customer2Product[]>(
        `/customer2product/customer/${customerId}/unsold`
      )
      unsoldProducts.value = response
      return response
    } catch (err: any) {
      error.value = err?.data?.message || 'Satılmamış ürünler yüklenirken hata oluştu'
      unsoldProducts.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Seçili ürünleri satışa çevirir
   * @param data Convert to sale request data
   */
  const convertToSale = async (data: ConvertToSaleRequest) => {
    loading.value = true
    error.value = null
    try {
      const response = await $api<ConvertToSaleResponse>(
        '/customer2product/convert-to-sale',
        {
          method: 'POST',
          body: data
        }
      )
      return response
    } catch (err: any) {
      error.value = err?.data?.message || 'Satışa çevirme işlemi başarısız oldu'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    unsoldProducts,
    fetchUnsoldProducts,
    convertToSale
  }
}
