<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="onDismiss"></div>
        
        <!-- Modal -->
        <div class="flex min-h-full items-center justify-center p-4">
          <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              v-if="isOpen"
              class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
            >
              <!-- Header with warning icon -->
              <div class="bg-amber-50 dark:bg-amber-900/20 px-4 pb-4 pt-5 sm:p-6">
                <div class="flex items-start">
                  <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/50 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon class="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div class="ml-3 mt-0 text-left">
                    <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                      ⚠️ Yeni Fraud Alert!
                    </h3>
                    <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Sistem bir dolandırıcılık girişimi tespit etti. Lütfen kontrol edin.
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Alert message content -->
              <div class="bg-white dark:bg-gray-800 px-4 pb-4 pt-3 sm:px-6">
                <div class="fraud-alert-message p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-md">
                  <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {{ alert?.message || 'Fraud alert içeriği yüklenemedi.' }}
                  </p>
                </div>
                
                <!-- Alert metadata -->
                <div v-if="alert" class="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Alert ID: #{{ alert.id }}</span>
                  <span>{{ formatTime(alert.createdAt) }}</span>
                </div>
              </div>
              
              <!-- Action buttons -->
              <div class="bg-gray-50 dark:bg-gray-900 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2">
                <button
                  @click="onCheck"
                  :disabled="loading"
                  class="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto"
                >
                  <CheckCircleIcon v-if="!loading" class="mr-2 h-4 w-4" />
                  <span v-if="loading">İşleniyor...</span>
                  <span v-else>Kontrol Edildi ✓</span>
                </button>
                <button
                  @click="onDismiss"
                  :disabled="loading"
                  class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed sm:mt-0 sm:w-auto"
                >
                  <ClockIcon class="mr-2 h-4 w-4" />
                  Sonra Hatırlat
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ExclamationTriangleIcon, CheckCircleIcon, ClockIcon } from '@heroicons/vue/24/outline'

interface FraudAlert {
  id: number
  message: string
  isRead: boolean
  isChecked: boolean
  createdAt: string
  updatedAt: string
}

interface Props {
  isOpen: boolean
  alert: FraudAlert | null
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  dismiss: []
  check: []
}>()

const onDismiss = () => {
  if (!props.loading) {
    emit('dismiss')
  }
}

const onCheck = () => {
  if (!props.loading) {
    emit('check')
  }
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.fraud-alert-message {
  animation: pulse-border 2s infinite;
}

@keyframes pulse-border {
  0% {
    border-color: rgb(251 191 36);
  }
  50% {
    border-color: rgb(245 158 11);
  }
  100% {
    border-color: rgb(251 191 36);
  }
}
</style>