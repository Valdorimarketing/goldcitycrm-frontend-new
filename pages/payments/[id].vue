<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center space-x-3 mb-4">
        <NuxtLink
          to="/payments"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ArrowLeftIcon class="h-5 w-5" />
        </NuxtLink>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Ödeme Detayı</h1>
      </div>
    </div>

    <!-- Payment Details Card -->
    <div class="card mb-6">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">Ödeme Bilgileri</h2>
          <span
            class="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
          >
            Tamamlandı
          </span>
        </div>
      </div>
      <div class="px-6 py-4 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Amount -->
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Tutar</dt>
            <dd class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              ₺{{ formatCurrency(payment.amount) }}
            </dd>
          </div>

          <!-- Calculated Amount -->
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Hesaplanan Tutar</dt>
            <dd class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              ₺{{ formatCurrency(payment.calculatedAmount) }}
            </dd>
          </div>

          <!-- Date -->
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Tarih</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">
              {{ formatDate(payment.createdAt) }}
            </dd>
          </div>

          <!-- Payment Method -->
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Ödeme Yöntemi</dt>
            <dd class="mt-1 flex items-center space-x-2">
              <component
                :is="getPaymentMethodIcon(payment.payType)"
                class="h-5 w-5 text-gray-400"
              />
              <span class="text-sm text-gray-900 dark:text-white">
                {{ getPaymentMethodText(payment.payType) }}
              </span>
            </dd>
          </div>

          <!-- Transaction ID -->
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">İşlem ID</dt>
            <dd class="mt-1 text-sm font-mono text-gray-900 dark:text-white">
              #PAY-{{ String(payment.id).padStart(6, '0') }}
            </dd>
          </div>
        </div>
      </div>
    </div>

    <!-- Customer Information -->
    <div class="card mb-6">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white">Müşteri Bilgileri</h2>
      </div>
      <div class="px-6 py-4 space-y-3">
        <div>
          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Müşteri Adı</dt>
          <dd class="mt-1 text-sm text-gray-900 dark:text-white">
            {{ payment.customer?.name || 'Belirtilmemiş' }}
          </dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Firma</dt>
          <dd class="mt-1 text-sm text-gray-900 dark:text-white">
            {{ payment.customer?.company || 'Belirtilmemiş' }}
          </dd>
        </div>
      </div>
    </div>

    <!-- Description -->
    <div class="card mb-6" v-if="payment.description">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white">Açıklama</h2>
      </div>
      <div class="px-6 py-4">
        <p class="text-sm text-gray-900 dark:text-white">
          {{ payment.description }}
        </p>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-between items-center">
      <NuxtLink
        to="/payments"
        class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
      >
        ← Ödemelere Dön
      </NuxtLink>
      <div class="flex space-x-3">
        <button
          @click="editPayment"
          class="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          <ArrowPathIcon class="mr-2 h-4 w-4" />
          Düzenle
        </button>
        <button
          @click="downloadReceipt"
          class="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          <ArrowDownTrayIcon class="mr-2 h-4 w-4" />
          Makbuz İndir
        </button>
        <button
          @click="deletePayment"
          class="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
        >
          <TrashIcon class="mr-2 h-4 w-4" />
          Sil
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  CreditCardIcon,
  BanknotesIcon,
  DocumentIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()

// API integration
const { getPayment, deletePayment: deletePaymentApi } = usePayments()

// Payment data
const payment = ref({
  id: parseInt(route.params.id),
  amount: 0,
  calculatedAmount: 0,
  payType: 1,
  customerId: null,
  customer: null,
  description: '',
  createdAt: null,
  updatedAt: null
})

// Fetch payment data on mount
onMounted(async () => {
  const data = await getPayment(route.params.id)
  if (data) {
    payment.value = data
  } else {
    // If payment not found, redirect to payments list
    router.push('/payments')
  }
})

// Methods

const getPaymentMethodIcon = (payType) => {
  switch (payType) {
    case 1: return BanknotesIcon // Nakit
    case 2: return CreditCardIcon // Kredi Kartı
    case 3: return BanknotesIcon // Banka Havalesi
    case 4: return DocumentIcon // Çek
    default: return DocumentIcon
  }
}

const getPaymentMethodText = (payType) => {
  switch (payType) {
    case 1: return 'Nakit'
    case 2: return 'Kredi Kartı'
    case 3: return 'Banka Havalesi'
    case 4: return 'Çek'
    case 5: return 'Diğer'
    default: return 'Bilinmiyor'
  }
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('tr-TR').format(amount)
}

const formatDate = (dateString) => {
  if (!dateString) return 'Belirtilmemiş'
  return new Date(dateString).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const editPayment = () => {
  // Navigate to edit page (you can create an edit page or use modal)
  router.push(`/payments/edit/${payment.value.id}`)
}

const downloadReceipt = () => {
  // In real app, generate and download PDF receipt
  console.log('Downloading receipt...')
  alert('Makbuz indiriliyor...')
}

const deletePayment = async () => {
  if (confirm('Bu ödeme kaydını silmek istediğinizden emin misiniz?')) {
    try {
      await deletePaymentApi(payment.value.id)
      alert('Ödeme başarıyla silindi')
      router.push('/payments')
    } catch (error) {
      console.error('Error deleting payment:', error)
      alert('Ödeme silinirken bir hata oluştu')
    }
  }
}

// Page head
useHead({
  title: `Ödeme #${route.params.id} - Valdori CRM`
})
</script>