<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Yeni Randevu Oluştur</h1>
      <p class="mt-2 text-sm text-gray-700">
        Yeni bir randevu planlamak için aşağıdaki formu doldurun.
      </p>
    </div>

    <!-- Form -->
    <div class="card">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Customer -->
        <div>
          <label for="customer" class="block text-sm font-medium text-gray-700 mb-2">
            Müşteri
          </label>
          <select
            id="customer"
            v-model="form.customer"
            class="form-input"
          >
            <option :value="undefined">Müşteri Seçin</option>
            <option v-for="customer in customers" :key="customer.id" :value="customer.id">
              {{ customer.name }} {{ customer.surname }}
            </option>
          </select>
        </div>

        <!-- Sales Product -->
        <div>
          <label for="salesProduct" class="block text-sm font-medium text-gray-700 mb-2">
            İlgili Satış Ürünü (Opsiyonel)
          </label>
          <select
            id="salesProduct"
            v-model="form.salesProductId"
            class="form-input"
          >
            <option :value="undefined">Ürün Seçin</option>
            <option v-for="product in salesProducts" :key="product.id" :value="product.id">
              {{ product.name }} - ₺{{ formatCurrency(product.price) }}
            </option>
          </select>
        </div>

        <!-- Meeting Location -->
        <div>
          <label for="meetingLocation" class="block text-sm font-medium text-gray-700 mb-2">
            Randevu Konumu
          </label>
          <select
            id="meetingLocation"
            v-model="form.meetingLocation"
            class="form-input"
          >
            <option :value="undefined">Konum Seçin</option>
            <option v-for="location in meetingLocations" :key="location.id" :value="location.id">
              {{ location.name }}
            </option>
          </select>
        </div>

        <!-- Date Time Fields -->
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <!-- Start Time -->
          <div>
            <label for="startTime" class="block text-sm font-medium text-gray-700 mb-2">
              Başlangıç Zamanı
            </label>
            <input
              id="startTime"
              v-model="form.startTime"
              type="datetime-local"
              required
              class="form-input"
            />
          </div>

          <!-- End Time -->
          <div>
            <label for="endTime" class="block text-sm font-medium text-gray-700 mb-2">
              Bitiş Zamanı
            </label>
            <input
              id="endTime"
              v-model="form.endTime"
              type="datetime-local"
              required
              class="form-input"
            />
          </div>
        </div>

        <!-- Reminding At -->
        <div>
          <label for="remindingAt" class="block text-sm font-medium text-gray-700 mb-2">
            Hatırlatma Zamanı
          </label>
          <input
            id="remindingAt"
            v-model="form.remindingAt"
            type="datetime-local"
            class="form-input"
          />
        </div>

        <!-- User -->
        <div>
          <label for="user" class="block text-sm font-medium text-gray-700 mb-2">
            Sorumlu Kullanıcı
          </label>
          <select
            id="user"
            v-model="form.user"
            class="form-input"
          >
            <option :value="undefined">Kullanıcı Seçin</option>
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.name }}
            </option>
          </select>
        </div>

        <!-- Meeting Status -->
        <div>
          <label for="meetingStatus" class="block text-sm font-medium text-gray-700 mb-2">
            Durum
          </label>
          <select
            id="meetingStatus"
            v-model="form.meetingStatus"
            class="form-input"
          >
            <option :value="undefined">Durum Seçin</option>
            <option v-for="status in meetingStatuses" :key="status.id" :value="status.id">
              {{ status.name }}
            </option>
          </select>
        </div>

        <!-- Description -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
            Açıklama
          </label>
          <textarea
            id="description"
            v-model="form.description"
            rows="4"
            class="form-input"
            placeholder="Randevu hakkında notlar..."
          />
        </div>

        <!-- Form Actions -->
        <div class="flex justify-end space-x-3">
          <NuxtLink
            to="/meetings"
            class="btn-secondary"
          >
            İptal
          </NuxtLink>
          <button
            type="submit"
            :disabled="loading"
            class="btn-primary"
          >
            <span v-if="loading">Kaydediliyor...</span>
            <span v-else>Randevu Oluştur</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CreateMeetingDto, Customer, User, SalesProduct, MeetingLocation, MeetingStatus } from '~/types'

const router = useRouter()
const meetingsStore = useMeetingsStore()
const customersStore = useCustomersStore()
const usersStore = useUsersStore()
const salesProductsStore = useSalesProductsStore()

const loading = ref(false)

// Form data
const form = ref<CreateMeetingDto>({
  customer: undefined,
  salesProductId: undefined,
  meetingLocation: undefined,
  remindingAt: undefined,
  startTime: undefined,
  endTime: undefined,
  user: undefined,
  meetingStatus: undefined,
  description: ''
})

// Reference data
const customers = ref<Customer[]>([])
const users = ref<User[]>([])
const salesProducts = ref<SalesProduct[]>([])
const meetingLocations = ref<MeetingLocation[]>([])
const meetingStatuses = ref<MeetingStatus[]>([])

// Load reference data
onMounted(async () => {
  try {
    // Load customers
    await customersStore.fetchCustomers(1, 100)
    customers.value = customersStore.customers

    // Load users
    await usersStore.fetchUsers(1, 100)
    users.value = usersStore.users

    // Load sales products
    await salesProductsStore.fetchSalesProducts(1, 100)
    salesProducts.value = salesProductsStore.salesProducts

    // TODO: Load meeting locations and statuses from API
    // For now, use demo data
    meetingLocations.value = [
      { id: 1, name: 'Ofis - Toplantı Salonu A' },
      { id: 2, name: 'Ofis - Toplantı Salonu B' },
      { id: 3, name: 'Online - Zoom' },
      { id: 4, name: 'Online - Teams' },
      { id: 5, name: 'Müşteri Ofisi' }
    ]

    meetingStatuses.value = [
      { id: 1, name: 'Planlandı' },
      { id: 2, name: 'Onaylandı' },
      { id: 3, name: 'Tamamlandı' },
      { id: 4, name: 'İptal Edildi' }
    ]
  } catch (error) {
    console.error('Failed to load reference data:', error)
  }
})

// Handle form submission
const handleSubmit = async () => {
  loading.value = true
  
  try {
    await meetingsStore.createMeeting(form.value)
    router.push('/meetings')
  } catch (error) {
    console.error('Failed to create meeting:', error)
    alert('Randevu oluşturulurken bir hata oluştu!')
  } finally {
    loading.value = false
  }
}

// Helper functions
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('tr-TR').format(amount)
}

// Page head
useHead({
  title: 'Yeni Randevu - Valdori CRM'
})
</script>