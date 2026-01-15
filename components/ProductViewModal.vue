<template>
  <div v-if="show && product" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>
      
      <div class="inline-block transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
        <div class="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 sm:mx-0 sm:h-10 sm:w-10">
              <CubeIcon class="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
              <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                Ürün Detayları
              </h3>
              <div class="mt-4 space-y-4">
                <!-- Product Name -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ürün Adı
                  </label>
                  <p class="mt-1 text-sm text-gray-900 dark:text-white font-medium">
                    {{ product.name || 'Belirtilmemiş' }}
                  </p>
                </div>

                <!-- Price -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Fiyat
                  </label>
                  <p class="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                    ₺{{ formatCurrency(product.price || 0) }}
                  </p>
                </div>

                <!-- Status -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Durum
                  </label>
                  <div class="mt-1">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      Aktif
                    </span>
                  </div>
                </div>

                <!-- Created Date -->
                <div v-if="product.createdAt">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Oluşturulma Tarihi
                  </label>
                  <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {{ formatDate(product.createdAt) }}
                  </p>
                </div>

                <!-- Updated Date -->
                <div v-if="product.updatesAt && product.updatesAt !== product.createdAt">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Son Güncelleme
                  </label>
                  <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {{ formatDate(product.updatesAt) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button
            @click="$emit('edit', product)"
            class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
          >
            Düzenle
          </button>
          <button
            @click="$emit('close')"
            class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-600 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 sm:mt-0 sm:w-auto"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { CubeIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  show: Boolean,
  product: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'edit'])

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('tr-TR').format(amount)
}

const formatDate = (dateString) => {
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
</script> 