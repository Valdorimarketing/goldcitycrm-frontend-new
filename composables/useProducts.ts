import type { Product } from '~/types'

export const useProducts = () => {
  const $api = useApi()
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const meta = ref({
    page: 1,
    limit: 20,
    total: 0
  })

  const fetchProducts = async (params?: {
    page?: number
    limit?: number
    search?: string
    minPrice?: number
    maxPrice?: number
    order?: 'ASC' | 'DESC'
  }) => {
    loading.value = true
    error.value = null
    try {
      // Build query parameters
      const queryParams = new URLSearchParams()
      queryParams.append('page', (params?.page || 1).toString())
      queryParams.append('limit', (params?.limit || 20).toString())
      if (params?.search) {
        queryParams.append('search', params.search)
      }
      if (params?.minPrice !== undefined) {
        queryParams.append('minPrice', params.minPrice.toString())
      }
      if (params?.maxPrice !== undefined) {
        queryParams.append('maxPrice', params.maxPrice.toString())
      }
      if (params?.order) {
        queryParams.append('order', params.order)
      }

      const url = `/products?${queryParams.toString()}`
      const response: any = await $api(url)

      // API returns { data: [...], meta: {...} }
      if (response && response.data && Array.isArray(response.data)) {
        products.value = response.data
        if (response.meta) {
          meta.value = {
            page: response.meta.page || 1,
            limit: response.meta.limit || 20,
            total: response.meta.total || 0
          }
        }
      } else if (Array.isArray(response)) {
        products.value = response
        // If response is just an array, assume all data is loaded
        meta.value = {
          page: 1,
          limit: response.length,
          total: response.length
        }
      } else {
        console.warn('Unexpected products response structure:', response)
        products.value = []
      }

      return { data: products.value, meta: meta.value }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch products'
      products.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchProduct = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await $api(`/products/${id}`)
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch product'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createProduct = async (data: Partial<Product>) => {
    loading.value = true
    error.value = null
    try {
      const response = await $api('/products', {
        method: 'POST',
        body: data
      })
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to create product'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateProduct = async (id: number, data: Partial<Product>) => {
    loading.value = true
    error.value = null
    try {
      const response = await $api(`/products/${id}`, {
        method: 'PATCH',
        body: data
      })
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to update product'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteProduct = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await $api(`/products/${id}`, {
        method: 'DELETE'
      })
      return true
    } catch (err: any) {
      error.value = err.message || 'Failed to delete product'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    loading,
    error,
    meta,
    fetchProducts,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct
  }
}
