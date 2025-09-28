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
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Yeni Ödeme</h1>
      </div>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Müşterinizden aldığınız ödemeleri buradan kayıt edebilirsiniz.
      </p>
    </div>

    <!-- Payment Form -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Customer Selection -->
      <div class="card">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">Müşteri Bilgileri</h2>
        </div>
        <div class="px-6 py-4">
          <div>
            <label for="customer" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Müşteri <span class="text-red-500">*</span>
            </label>
            <select
              id="customer"
              v-model="formData.customerId"
              class="form-input"
              required
            >
              <option value="">Müşteri Seçin</option>
              <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                {{ customer.name }} {{ customer.company ? `- ${customer.company}` : '' }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Payment Details -->
      <div class="card">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">Ödeme Detayları</h2>
        </div>
        <div class="px-6 py-4 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Amount -->
            <div>
              <label for="amount" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tutar (₺) <span class="text-red-500">*</span>
              </label>
              <input
                id="amount"
                v-model.number="formData.amount"
                type="number"
                step="0.01"
                min="0"
                class="form-input"
                placeholder="0.00"
                required
              />
            </div>

            <!-- Calculated Amount -->
            <div>
              <label for="calculatedAmount" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hesaplanan Tutar (₺) <span class="text-red-500">*</span>
              </label>
              <input
                id="calculatedAmount"
                v-model.number="formData.calculatedAmount"
                type="number"
                step="0.01"
                min="0"
                class="form-input"
                placeholder="0.00"
                required
              />
            </div>

            <!-- Payment Type -->
            <div>
              <label for="payType" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ödeme Tipi <span class="text-red-500">*</span>
              </label>
              <select
                id="payType"
                v-model="formData.payType"
                class="form-input"
                required
              >
                <option value="">Seçiniz</option>
                <option :value="1">Nakit</option>
                <option :value="2">Kredi Kartı</option>
                <option :value="3">Banka Havalesi</option>
                <option :value="4">Çek</option>
                <option :value="5">Diğer</option>
              </select>
            </div>

            <!-- Payment Date -->
            <div>
              <label for="paymentDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ödeme Tarihi
              </label>
              <input
                id="paymentDate"
                v-model="formData.paymentDate"
                type="date"
                class="form-input"
              />
            </div>
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Açıklama
            </label>
            <textarea
              id="description"
              v-model="formData.description"
              rows="3"
              class="form-input"
              placeholder="Ödeme hakkında notlar..."
            />
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex justify-between items-center">
        <NuxtLink
          to="/payments"
          class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ← İptal
        </NuxtLink>
        <div class="flex space-x-3">
          <button
            type="button"
            @click="resetForm"
            class="btn-secondary"
          >
            Temizle
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
          >
            <span v-if="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
            {{ loading ? 'Kaydediliyor...' : 'Ödeme Kaydet' }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'

const router = useRouter()

// API integration
const { createPayment, loading, error } = usePayments()

// Sample customers data (in real app, fetch from API)
const customers = ref([
  { id: 1, name: 'Ahmet Yılmaz', company: 'ABC Şirketi' },
  { id: 2, name: 'Mehmet Demir', company: 'XYZ Ltd.' },
  { id: 3, name: 'Ayşe Kaya', company: 'Tech Solutions' },
  { id: 4, name: 'Fatma Çelik', company: 'Digital Services' },
  { id: 5, name: 'Ali Öztürk', company: 'Consulting Group' }
])

// Form data
const formData = ref({
  customerId: '',
  payType: '',
  amount: '',
  calculatedAmount: '',
  description: '',
  paymentDate: new Date().toISOString().split('T')[0]
})

// Watch amount to auto-fill calculatedAmount
watch(() => formData.value.amount, (newAmount) => {
  if (newAmount && !formData.value.calculatedAmount) {
    formData.value.calculatedAmount = newAmount
  }
})

// Methods
const handleSubmit = async () => {
  try {
    // Prepare data for API
    const paymentData = {
      customerId: parseInt(formData.value.customerId),
      payType: parseInt(formData.value.payType),
      amount: parseFloat(formData.value.amount),
      calculatedAmount: parseFloat(formData.value.calculatedAmount),
      description: formData.value.description || undefined
    }

    await createPayment(paymentData)

    // Show success message (in real app, use toast/notification)
    alert('Ödeme başarıyla kaydedildi!')

    // Redirect to payments list
    router.push('/payments')
  } catch (err) {
    console.error('Error creating payment:', err)
    alert(error.value || 'Ödeme kaydedilirken bir hata oluştu')
  }
}

const resetForm = () => {
  formData.value = {
    customerId: '',
    payType: '',
    amount: '',
    calculatedAmount: '',
    description: '',
    paymentDate: new Date().toISOString().split('T')[0]
  }
}

// Page head
useHead({
  title: 'Yeni Ödeme - Valdori CRM'
})
</script>