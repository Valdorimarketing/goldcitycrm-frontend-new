<template>
  <Teleport to="body">
    <Transition
      enter-active-class="duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isOpen && reminder" class="fixed inset-0 z-[9999] overflow-y-auto">
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/80 backdrop-blur-sm transition-opacity"
          @click="$emit('dismiss')"
        ></div>

        <!-- Modal -->
        <div class="flex min-h-screen items-center justify-center p-4">
          <Transition
            enter-active-class="duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div v-if="isOpen && reminder" class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl transition-all sm:w-full sm:max-w-lg">
              <!-- Header with gradient -->
              <div class="bg-gradient-to-r from-rose-500 to-orange-600 px-6 py-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur animate-pulse">
                      <BellIcon class="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-white">⏰ Hatırlatma Zamanı!</h3>
                      <p class="text-sm text-rose-100">{{ timeRemaining }}</p>
                    </div>
                  </div>
                  <button
                    @click="$emit('dismiss')"
                    class="rounded-lg p-2 hover:bg-white/20 transition-colors"
                  >
                    <XMarkIcon class="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>

              <!-- Content -->
              <div class="p-6">
                <!-- Customer Info -->
                <div class="mb-4 pb-4 border-b dark:border-gray-700">
                  <div class="flex items-center space-x-3">
                    <UserIcon class="h-5 w-5 text-rose-600" />
                    <div>
                      <h4 class="font-semibold text-gray-900 dark:text-white">
                        {{ customerName }}
                      </h4>
                      <p class="text-sm text-gray-500 dark:text-gray-400">Müşteri</p>
                    </div>
                  </div>
                </div>

                <!-- Note Content -->
                <div class="bg-rose-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
                  <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ reminder.note }}</p>
                </div>

                <!-- Date Time -->
                <div class="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <ClockIcon class="h-4 w-4" />
                  <span>{{ formattedDateTime }}</span>
                </div>
              </div>

              <!-- Actions -->
              <div class="bg-gray-50 dark:bg-gray-900/50 px-6 py-4">
                <div class="flex justify-end space-x-3">
                  <button
                    @click="$emit('dismiss')"
                    class="inline-flex items-center rounded-lg bg-gray-100 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <ClockIcon class="mr-2 h-4 w-4" />
                    Sonra Hatırlat
                  </button>
                  <button
                    @click="$emit('complete')"
                    :disabled="loading"
                    class="inline-flex items-center rounded-lg bg-gradient-to-r from-rose-500 to-orange-600 px-4 py-2 text-sm font-medium text-white hover:from-rose-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-rose-500/25"
                  >
                    <CheckIcon class="mr-2 h-4 w-4" />
                    {{ loading ? 'İşleniyor...' : 'Tamamlandı' }}
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import {
  BellIcon,
  UserIcon,
  ClockIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  reminder: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['dismiss', 'complete'])

const customerName = computed(() => {
  if (!props.reminder) return ''
  if (props.reminder.customerInfo) {
    return `${props.reminder.customerInfo.name} ${props.reminder.customerInfo.surname}`
  }
  return `Müşteri #${props.reminder.customer}`
})

const formattedDateTime = computed(() => {
  if (!props.reminder?.remindingAt) return ''
  return new Date(props.reminder.remindingAt).toLocaleString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

const timeRemaining = computed(() => {
  if (!props.reminder?.remindingAt) return ''

  const now = new Date()
  const reminderDate = new Date(props.reminder.remindingAt)
  const diff = reminderDate.getTime() - now.getTime()

  if (diff <= 0) {
    return 'Zamanı geldi!'
  } else {
    const minutes = Math.ceil(diff / 60000)
    if (minutes < 60) {
      return `${minutes} dakika kaldı`
    } else {
      const hours = Math.ceil(minutes / 60)
      return `${hours} saat kaldı`
    }
  }
})
</script>