import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product } from '~/types'

export const useProductsStore = defineStore('products', () => {
  // State
  const products = ref<Product[]>([])
  const loading = ref(false)
  const pagination = ref({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  })

  return {
    products,
    loading,
    pagination
  }
}) 