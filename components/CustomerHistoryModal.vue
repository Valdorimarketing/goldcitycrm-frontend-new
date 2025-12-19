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
      <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
        <!-- Backdrop -->
        <div 
          class="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/80 backdrop-blur-sm transition-opacity" 
          @click="$emit('close')"
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
            <div v-if="show" class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl transition-all sm:w-full sm:max-w-4xl">
              <!-- Header -->
              <div class="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                      <ClockIcon class="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-white">{{ t('customer_show.history.title', 'Müşteri Geçmişi') }}</h3>
                      <p class="text-sm text-blue-100">{{ customer?.name }} {{ customer?.surname }}</p>
                    </div>
                  </div>
                  <button
                    @click="$emit('close')"
                    class="rounded-lg p-2 hover:bg-white/20 transition-colors"
                  >
                    <XMarkIcon class="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>

              <!-- Content -->
              <div class="max-h-[60vh] overflow-y-auto p-6">
                <!-- Loading State -->
                <div v-if="loading" class="flex justify-center py-8">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>

                <!-- History Timeline -->
                <div v-else-if="history.length > 0" class="space-y-4">
                  <div v-for="(item, index) in history" :key="item.id" class="relative">
                    <!-- Timeline line -->
                    <div v-if="index < history.length - 1" class="absolute left-4 top-10 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                    
                    <!-- Timeline item -->
                    <div class="flex items-start space-x-4">
                      <!-- Icon -->
                      <div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 ring-4 ring-white dark:ring-gray-800">
                        <component 
                          :is="getActionIcon(item.action)" 
                          class="h-4 w-4 text-blue-600 dark:text-blue-400"
                        />
                      </div>
                      
                      <!-- Content -->
                      <div class="flex-1 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                        <div class="flex items-start justify-between">
                          <div class="flex-1">
                            <p class="text-sm font-medium text-gray-900 dark:text-white">
                              {{ item.action || t('history_modal.action', 'İşlem') }}
                            </p>
                            <p v-if="item.description" class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                              {{ item.description }}
                            </p>
                           
                          </div>
                          <div class="ml-4 text-right">
                            <p class="text-xs text-gray-500 dark:text-gray-400">
                              {{ formatDate(item.createdAt || item.updatesAt) }}
                            </p>
                            <p class="text-xs text-gray-400 dark:text-gray-500">
                              {{ formatTime(item.createdAt || item.updatesAt) }}
                            </p>
                            <p v-if="item.user || item.userInfo" class="mt-1 text-xs font-medium text-gray-600 dark:text-gray-400">
                              <UserIcon class="inline h-3 w-3 mr-1" />
                              {{ item.user?.name || item.userInfo?.name || t('customer_show.history.system', 'Sistem') }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Empty State -->
                <div v-else class="text-center py-8">
                  <ClockIcon class="mx-auto h-12 w-12 text-gray-400" />
                  <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    {{ t('history_modal.empty.title', 'Geçmiş Bulunamadı') }}
                  </h3>
                  <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {{ t('history_modal.empty.description', 'Bu müşteri için henüz geçmiş kaydı bulunmuyor.') }}
                  </p>
                </div>
              </div>

              <!-- Footer -->
              <div class="border-t dark:border-gray-700 px-6 py-4">
                <div class="flex justify-between items-center">
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ tp('history_modal.total_count', { total_count: history.length }, 'Toplam {total_count} kayıt') }}
                  </p>
                  <button
                    @click="$emit('close')"
                    class="inline-flex items-center rounded-lg bg-gray-100 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {{ t('history_modal.close', 'Kapat') }}
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
import { 
  XMarkIcon, 
  ClockIcon,
  UserIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/outline'
import { useLanguage } from '~/composables/useLanguage'

const props = defineProps({
  show: Boolean,
  customer: Object
})
const { t, tp } = useLanguage()

const emit = defineEmits(['close'])

// Store
const customerHistoriesStore = useCustomerHistoriesStore()

// State
const loading = ref(false)
const history = ref([])

// Fetch customer history
const fetchHistory = async () => {
  if (!props.customer?.id) return
  
  loading.value = true
  try {
    const histories = await customerHistoriesStore.fetchCustomerHistories(props.customer.id)
    
    // Sort by date descending (newest first)
    history.value = histories
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || a.created_at || a.updatesAt || a.updated_at || 0)
        const dateB = new Date(b.createdAt || b.created_at || b.updatesAt || b.updated_at || 0)
        return dateB - dateA
      })
    
    
    // If no history exists, you might want to create an initial entry
    if (history.value.length === 0) {
      console.info('No history found for this customer. History tracking may not be implemented yet.')
    }
  } catch (error) {
    console.error('Error fetching customer history:', error)
    history.value = []
  } finally {
    loading.value = false
  }
}

// Get action icon
const getActionIcon = (action) => {
  switch (action) {
    case 'created':
      return PlusIcon
    case 'updated':
      return PencilIcon
    case 'deleted':
      return TrashIcon
    case 'status_changed':
      return ArrowPathIcon
    case 'email_sent':
      return EnvelopeIcon
    case 'phone_called':
      return PhoneIcon
    case 'address_changed':
      return MapPinIcon
    case 'activated':
      return CheckCircleIcon
    case 'deactivated':
      return XCircleIcon
    default:
      return ClockIcon
  }
}

// Get action text (Bu fonksiyon artık kullanılmıyor çünkü item.action zaten çevrilmiş geliyor)
const getActionText = (action) => {
  const actionMap = {
    'created': t('history_modal.actions.created', 'Müşteri oluşturuldu'),
    'updated': t('history_modal.actions.updated', 'Bilgiler güncellendi'),
    'deleted': t('history_modal.actions.deleted', 'Müşteri silindi'),
    'status_changed': t('history_modal.actions.status_changed', 'Durum değiştirildi'),
    'email_sent': t('history_modal.actions.email_sent', 'E-posta gönderildi'),
    'phone_called': t('history_modal.actions.phone_called', 'Telefon görüşmesi yapıldı'),
    'address_changed': t('history_modal.actions.address_changed', 'Adres güncellendi'),
    'activated': t('history_modal.actions.activated', 'Müşteri aktif edildi'),
    'deactivated': t('history_modal.actions.deactivated', 'Müşteri pasif edildi'),
  }
  return actionMap[action] || t('history_modal.actions.default', 'İşlem yapıldı')
}

// Get field label
const getFieldLabel = (field) => {
  const fieldMap = {
    'name': t('history_modal.fields.name', 'Ad'),
    'surname': t('history_modal.fields.surname', 'Soyad'),
    'email': t('history_modal.fields.email', 'E-posta'),
    'phone': t('history_modal.fields.phone', 'Telefon'),
    'status': t('history_modal.fields.status', 'Durum'),
    'address': t('history_modal.fields.address', 'Adres'),
    'city': t('history_modal.fields.city', 'Şehir'),
    'country': t('history_modal.fields.country', 'Ülke'),
    'title': t('history_modal.fields.title', 'Ünvan'),
    'company': t('history_modal.fields.company', 'Şirket'),
  }
  return fieldMap[field] || field
}

// Format date
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Format time
const formatTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Watch for modal open
watch(() => props.show, (newValue) => {
  if (newValue) {
    fetchHistory()
  } else {
    history.value = []
  }
})
</script>