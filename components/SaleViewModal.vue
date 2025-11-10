<template>
  <div v-if="show && sale" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>

      <div
        class="inline-block transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:align-middle">
        <div class="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div
              class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900 sm:mx-0 sm:h-10 sm:w-10">
              <ShoppingBagIcon class="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
              <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                Satış Detayları
              </h3>
              <div class="mt-4 space-y-4">
                <!-- Customer -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Müşteri
                  </label>
                  <p class="mt-1 text-sm text-gray-900 dark:text-white font-medium">
                    {{ sale.customer?.name || 'Bilinmeyen Müşteri' }}
                  </p>
                  <p v-if="sale.customer?.company" class="text-xs text-gray-500 dark:text-gray-400">
                    {{ sale.customer.company }}
                  </p>
                </div>

                <!-- Description -->
                <div v-if="sale.description && sale.description !== '-'">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Açıklama
                  </label>
                  <p class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ sale.description }}
                  </p>
                </div>

                <!-- Products -->
                <div v-if="sale.products && sale.products.length > 0">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ürünler
                  </label>
                  <div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead class="bg-gray-50 dark:bg-gray-900">
                        <tr>
                          <th
                            class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                            Ürün
                          </th>
                          <th
                            class="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                            Fiyat
                          </th>
                        </tr>
                      </thead>
                      <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        <tr v-for="product in sale.products" :key="product.id">
                          <td class="px-3 py-2 text-sm text-gray-900 dark:text-white">
                            {{ product.productDetails?.name || product.name || 'Ürün' }}
                          </td>
                          <td class="px-3 py-2 text-sm text-gray-900 dark:text-white text-right font-medium">
                            {{ product.productDetails?.currency?.code || 'TRY' }} {{ formatCurrency(product.offer ||
                            product.price || 0) }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Total Amount -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Toplam Tutar
                  </label>
                  <p class="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">
                    {{ currentCurrency }} {{ formatCurrency(sale.amount) }}
                  </p>
                </div>

                <!-- Date -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Satış Tarihi
                  </label>
                  <p class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ formatDate(sale.date) }}
                  </p>
                </div>

             

                <!-- Users -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div v-if="sale.user">
                    <label class="block text-xs font-medium text-gray-500 dark:text-gray-400">
                      Satış Yapan
                    </label>
                    <p class="mt-1 text-sm text-gray-900 dark:text-white">
                      {{ sale.user.name || '-' }}
                    </p>
                  </div>
                  <div v-if="sale.responsibleUser">
                    <label class="block text-xs font-medium text-gray-500 dark:text-gray-400">
                      Sorumlu
                    </label>
                    <p class="mt-1 text-sm text-gray-900 dark:text-white">
                      {{ sale.responsibleUser.name || '-' }}
                    </p>
                  </div>
                  <div v-if="sale.followerUser">
                    <label class="block text-xs font-medium text-gray-500 dark:text-gray-400">
                      Takipçi
                    </label>
                    <p class="mt-1 text-sm text-gray-900 dark:text-white">
                      {{ sale.followerUser.name || '-' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button @click="$emit('close')"
            class="inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-600 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 sm:w-auto">
            Kapat
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ShoppingBagIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  show: Boolean,
  sale: {
    type: Object,
    default: null
  }
})

const currentCurrency = ref({ code: 'TRY' })
const emit = defineEmits(['close'])

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('tr-TR').format(amount)
}



const formatDate = (dateString) => {
  if (!dateString) return '-'
  try {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return 'Geçersiz tarih'
  }
}
 

watch(
  () => props.show,
  (newSale) => {
    currentCurrency.value = props.sale?.products?.[0]?.productDetails?.currency?.code || 'TRY'
  }
);


</script>
