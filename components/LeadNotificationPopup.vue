<!-- components/LeadNotificationPopup.vue -->
<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog as="div" class="relative z-50" @close="handleDismiss">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <!-- Icon -->
              <div class="absolute right-0 top-0 pr-4 pt-4">
                <button
                  type="button"
                  class="rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 focus:outline-none"
                  @click="handleDismiss"
                >
                  <span class="sr-only">Close</span>
                  <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <div class="sm:flex sm:items-start">
                <!-- Lead Icon -->
                <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20 sm:mx-0 sm:h-10 sm:w-10">
                  <UserPlusIcon class="h-6 w-6 text-green-600 dark:text-green-400" aria-hidden="true" />
                </div>

                <!-- Content -->
                <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left flex-1">
                  <DialogTitle as="h3" class="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                    🎯 Yeni Lead Geldi!
                  </DialogTitle>

                  <div class="mt-4 space-y-3" v-if="lead">
                    <!-- Lead Type -->
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-500 dark:text-gray-400">Tip:</span>
                      <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        {{ lead.data.leadType }}
                      </span>
                    </div>

                    <!-- Source -->
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-500 dark:text-gray-400">Kaynak:</span>
                      <span class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ lead.data.source }}
                      </span>
                    </div>

                    <!-- Customer ID -->
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-500 dark:text-gray-400">Müşteri:</span>
                      <span class="text-sm font-medium text-gray-900 dark:text-white">
                        #{{ lead.data.customerId }}
                      </span>
                    </div>

                    <!-- Timestamp -->
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-500 dark:text-gray-400">Zaman:</span>
                      <span class="text-sm text-gray-900 dark:text-white">
                        {{ formatTime(lead.data.timestamp) }}
                      </span>
                    </div>

                    <!-- Message (if assigned) -->
                    <div v-if="lead.data.message" class="mt-3 p-3 bg-green-50 dark:bg-green-900/10 rounded-md">
                      <p class="text-sm text-green-800 dark:text-green-400">
                        {{ lead.data.message }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
                <button
                  type="button"
                  class="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:w-auto"
                  @click="handleGoToCustomer"
                >
                  <EyeIcon class="h-5 w-5 mr-2" />
                  Müşteriye Git
                </button>
                <button
                  type="button"
                  class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 sm:mt-0 sm:w-auto"
                  @click="handleDismiss"
                >
                  Kapat
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XMarkIcon, UserPlusIcon, EyeIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  lead: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['dismiss', 'goToCustomer'])

const handleDismiss = () => {
  emit('dismiss')
}

const handleGoToCustomer = () => {
  if (props.lead?.data?.customerId) {
    emit('goToCustomer', props.lead.data.customerId)
  }
}

const formatTime = (timestamp) => {
  if (!timestamp) return '-'
  
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  
  if (diffMins < 1) return 'Şimdi'
  if (diffMins < 60) return `${diffMins} dakika önce`
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)} saat önce`
  
  return date.toLocaleString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>