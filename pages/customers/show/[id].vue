<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Breadcrumb -->
      <nav class="flex mb-6" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-3">
          <li class="inline-flex items-center">
            <NuxtLink to="/customers"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              Müşteriler
            </NuxtLink>
          </li>
          <li>
            <div class="flex items-center">
              <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"></path>
              </svg>
              <span class="text-gray-500 dark:text-gray-400 ml-1 md:ml-2">{{ customer?.name || 'Müşteri' }}</span>
            </div>
          </li>
        </ol>
      </nav>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
        <div class="text-sm text-red-700 dark:text-red-300">{{ error }}</div>
      </div>

      <!-- Customer Profile -->
      <div v-else-if="customer" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Sidebar - Profile Card -->
        <div class="lg:col-span-1">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <!-- Profile Photo -->
            <div class="bg-gradient-to-r from-indigo-600 to-purple-600 h-32"></div>
            <div class="px-6 pb-6">
              <div class="relative -mt-16 mb-4">
                <div class="inline-block rounded-full ring-4 ring-white dark:ring-gray-800">
                  <img v-if="customer.image" :src="getImageUrl(customer.image)"
                    :alt="`${customer.name} ${customer.surname}`"
                    class="h-32 w-32 rounded-full object-cover bg-gray-200 dark:bg-gray-700" />
                  <div v-else
                    class="h-32 w-32 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                    <span class="text-4xl font-bold text-indigo-600 dark:text-indigo-300">
                      {{ customer.name?.charAt(0)?.toUpperCase() }}{{ customer.surname?.charAt(0)?.toUpperCase() }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Name and Title -->
              <div class="text-center mb-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ customer.name }} {{ customer.surname }}
                </h2>
                <p v-if="customer.title" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {{ customer.title }}
                </p>
                <!-- Status Badges -->
                <div class="flex items-center justify-center gap-2 mt-3">
                  <span :class="[
                    customer.isActive
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full'
                  ]">
                    {{ customer.isActive ? 'Aktif' : 'Pasif' }}
                  </span>
                  <span v-if="customerStatus" :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                  ]">
                    {{ customerStatus.name }}
                  </span>
                </div>
              </div>

              <!-- Contact Info -->
              <div class="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                <div title="Atanan Sağlık Danışmanı" v-if="customer?.relevantUserData" class="flex items-center text-sm">
                  <UserIcon class="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" /> 
                    {{ customer?.relevantUserData }} 
                </div>
                <div v-if="customer.email" class="flex items-center text-sm">
                  <EnvelopeIcon class="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                  <a :href="`mailto:${customer.email}`"
                    class="text-indigo-600 dark:text-indigo-400 hover:underline truncate">
                    {{ customer.email }}
                  </a>
                </div>
                <div v-if="customer.phone" class="flex items-center text-sm">
                  <PhoneIcon class="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                  <a :href="`tel:${customer.phone}`" class="text-indigo-600 dark:text-indigo-400 hover:underline">
                    {{ customer.phone }}
                  </a>
                </div>
                <div v-if="customer.gender" class="flex items-center text-sm">
                  <UserIcon class="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                  <span class="text-gray-700 dark:text-gray-300">{{ getGenderText(customer.gender) }}</span>
                </div>
                <div v-if="customer.birth_date" class="flex items-center text-sm">
                  <CalendarIcon class="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                  <span class="text-gray-700 dark:text-gray-300">{{ formatBirthDate(customer.birth_date) }}</span>
                </div>
                <div v-if="customer.job" class="flex items-center text-sm">
                  <BriefcaseIcon class="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                  <span class="text-gray-700 dark:text-gray-300">{{ customer.job }}</span>
                </div>
                <div v-if="customer.address" class="flex items-start text-sm">
                  <MapPinIcon class="h-5 w-5 text-gray-400 mr-3 flex-shrink-0 mt-0.5" />
                  <span class="text-gray-700 dark:text-gray-300">{{ customer.address }}</span>
                </div>
                <div v-if="locationText" class="flex items-start text-sm">
                  <GlobeAltIcon class="h-5 w-5 text-gray-400 mr-3 flex-shrink-0 mt-0.5" />
                  <span class="text-gray-700 dark:text-gray-300">{{ locationText }}</span>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="mt-6 space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4">
                <button @click="showNotes"
                  class="w-full inline-flex items-center justify-center rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500">
                  <DocumentTextIcon class="h-5 w-5 mr-2" />
                  Notlar
                </button>
                <button @click="showDoctorAssignment"
                  class="w-full inline-flex items-center justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500">
                  <UserIcon class="h-5 w-5 mr-2" />
                  Doktor Görüşü
                </button>
                <button @click="showServices"
                  class="w-full inline-flex items-center justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500">
                  <ShoppingBagIcon class="h-5 w-5 mr-2" />
                  Hizmetler
                </button>
                <button @click="showFiles"
                  class="w-full inline-flex items-center justify-center rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500">
                  <FolderIcon class="h-5 w-5 mr-2" />
                  Dosyalar
                </button>
                <button @click="showOperationFollowUpModal"
                  class="w-full inline-flex items-center justify-center rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500">
                  <ViewfinderCircleIcon class="h-5 w-5 mr-2" />
                  Operasyon Sonrası Takip
                </button>
                <NuxtLink v-if="!isDoctor" :to="`/customers/edit/${$route.params.id}`"
                  class="w-full inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
                  <PencilIcon class="h-5 w-5 mr-2" />
                  Düzenle
                </NuxtLink>
                <button @click="goBack"
                  class="w-full inline-flex items-center justify-center rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <ArrowLeftIcon class="h-5 w-5 mr-2" />
                  Geri
                </button>
              </div>

              <!-- Additional Info -->
              <div v-if="customer.description || customer.source || customer.user || customer.createdAt"
                class="mt-6 space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Ek Bilgiler</h3>

                <div v-if="customer.source?.name" class="text-sm">
                  <span class="text-gray-500 dark:text-gray-400">Kaynak:</span>
                  <span class="ml-2 text-gray-900 dark:text-white">{{ customer.source.name }}</span>
                </div>

                <div v-if="customer.user?.name" class="text-sm">
                  <span class="text-gray-500 dark:text-gray-400">Sorumlu:</span>
                  <span class="ml-2 text-gray-900 dark:text-white">{{ customer.user.name }}</span>
                </div>

                <div v-if="customer.createdAt" class="text-sm">
                  <span class="text-gray-500 dark:text-gray-400">Kayıt:</span>
                  <span class="ml-2 text-gray-900 dark:text-white">{{ formatDate(customer.createdAt) }}</span>
                </div>

                <div v-if="customer.updatesAt" class="text-sm">
                  <span class="text-gray-500 dark:text-gray-400">Güncelleme:</span>
                  <span class="ml-2 text-gray-900 dark:text-white">{{ formatDate(customer.updatesAt) }}</span>
                </div>

                <div v-if="customer.description" class="text-sm">
                  <p class="text-gray-500 dark:text-gray-400 mb-1">Açıklama:</p>
                  <p class="text-gray-900 dark:text-white">{{ customer.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Content - History Timeline -->
        <div class="lg:col-span-2">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
            <!-- Header -->
            <div class="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4 rounded-t-lg">
              <div class="flex justify-between items-center">
                <div class="flex items-center space-x-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                    <ClockIcon class="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-white">Müşteri Geçmişi</h3>
                    <p class="text-sm text-blue-100">Tüm aktiviteler ve değişiklikler</p>
                  </div>
                </div>
                <div class="relative"> 
                    <button @click="refreshData" class="inline-flex items-center px-3 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition">
                      <ArrowPathIcon class="h-5 w-5 mr-2" />
                      Yenile 
                    </button>
                </div>
              </div>
            </div>

            <!-- Content -->
            <div class="max-h-[calc(100vh-200px)] overflow-y-auto p-6">
              <!-- Loading State -->
              <div v-if="loadingHistory" class="flex justify-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>

              <!-- History Timeline -->
              <div v-else-if="history.length > 0" class="space-y-4">
                <!-- Add Action Button -->
                <div class="relative pb-4">
                  <div class="absolute left-4 top-10 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>

                  <div class="flex items-start space-x-4">
                    <!-- Actions Dropdown Button -->
                    <div class="relative">
                      <button @click="toggleActionsDropdown"
                        class="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-500 ring-4 ring-white dark:ring-gray-800 transition-colors shadow-lg"
                        title="Hızlı İşlemler">
                        <PlusIcon class="h-4 w-4 text-white" />
                      </button>

                      <!-- Dropdown Menu -->
                      <Transition enter-active-class="transition ease-out duration-100"
                        enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                        leave-active-class="transition ease-in duration-75"
                        leave-from-class="transform opacity-100 scale-100"
                        leave-to-class="transform opacity-0 scale-95">
                        <div v-if="showActionsDropdown"
                          class="absolute left-12 top-0 w-56 rounded-lg bg-white dark:bg-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                          <div class="py-1">
                            <button @click="handleDropdownAction(showNotes)"
                              class="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                              <DocumentTextIcon class="h-5 w-5 mr-3 text-amber-600 dark:text-amber-400" />
                              Notlar
                            </button>
                            <button @click="handleDropdownAction(showDoctorAssignment)"
                              class="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                              <UserIcon class="h-5 w-5 mr-3 text-purple-600 dark:text-purple-400" />
                              Doktor Görüşü
                            </button>
                            <button @click="handleDropdownAction(showServices)"
                              class="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                              <ShoppingBagIcon class="h-5 w-5 mr-3 text-green-600 dark:text-green-400" />
                              Hizmetler
                            </button>
                            <button @click="handleDropdownAction(showFiles)"
                              class="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                              <FolderIcon class="h-5 w-5 mr-3 text-cyan-600 dark:text-cyan-400" />
                              Dosyalar
                            </button>
                            <div class="border-t border-gray-100 dark:border-gray-600"></div>
                            <button v-if="!isDoctor"
                              @click="handleDropdownAction(() => router.push(`/customers/edit/${route.params.id}`))"
                              class="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                              <PencilIcon class="h-5 w-5 mr-3 text-indigo-600 dark:text-indigo-400" />
                              Düzenle
                            </button>
                          </div>
                        </div>
                      </Transition>
                    </div>

                    <!-- Label -->
                    <div class="flex-1 flex items-center h-8">
                      <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Yeni İşlem Ekle</p>
                    </div>
                  </div>
                </div>

                <div v-for="(item, index) in history" :key="item.id" class="relative">
                  <!-- Timeline line -->
                  <div v-if="index < history.length - 1"
                    class="absolute left-4 top-10 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>

                  <!-- Timeline item -->
                  <div class="flex items-start space-x-4">
                    <!-- Icon -->
                    <div
                      class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 ring-4 ring-white dark:ring-gray-800">
                      <component :is="getActionIcon(item.action)" class="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>

                    <!-- Content -->
                    <div class="flex-1 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <div class="flex items-start justify-between">
                        <div class="flex-1">
                          <p class="text-sm font-medium text-gray-900 dark:text-white">
                            {{ item.action || 'İşlem' }}
                          </p>
                          <p v-if="item.description" class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {{ item.description }}
                          </p>
                          <!-- Request Data -->
                          <div class="relative" v-if="showStates[item.id]">
                            <div v-if="item.requestData" class="mt-2">
                              <p class="text-xs font-medium text-gray-500 dark:text-gray-400">İstek Verisi:</p>
                              <p
                                class="text-xs text-gray-600 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-800 p-1 rounded mt-1">
                                {{ item.requestData }}
                              </p>
                            </div>
                            <!-- Response Data -->
                            <div v-if="item.responseData" class="mt-2">
                              <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Yanıt Verisi:</p>
                              <p
                                class="text-xs text-gray-600 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-800 p-1 rounded mt-1">
                                {{ item.responseData }}
                              </p>
                            </div>
                          </div>
                          <button v-if="item.requestData || item.responseData" class="py-1 dark:text-white text-xs" @click="toggleShow(item.id)">{{ showStates[item.id] ? 'Gizle' : 'Göster' }}</button>

                        </div>
                        <div class="ml-4 text-right">
                          <p class="text-xs text-gray-500 dark:text-gray-400">
                            {{ formatHistoryDate(item.createdAt || item.updatesAt) }}
                          </p>
                          <p class="text-xs text-gray-400 dark:text-gray-500">
                            {{ formatTime(item.createdAt || item.updatesAt) }}
                          </p>
                          <p v-if="item.user || item.userInfo"
                            class="mt-1 text-xs font-medium text-gray-600 dark:text-gray-400">
                            <UserIcon class="inline h-3 w-3 mr-1" />
                            {{ item.user?.name || item.userInfo?.name || 'Sistem' }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Empty State -->
              <div v-else class="text-center py-12">
                <ClockIcon class="mx-auto h-12 w-12 text-gray-400" />
                <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Geçmiş Bulunamadı</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Bu müşteri için henüz geçmiş kaydı bulunmuyor.
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div class="border-t dark:border-gray-700 px-6 py-3">
              <p class="text-sm text-gray-500 dark:text-gray-400 text-center">
                Toplam <span class="font-medium">{{ history.length }}</span> kayıt
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
 

    <!-- Customer Notes Modal -->
    <CustomerNotesModal :show="showNotesModal" :customer="customer" @close="showNotesModal = false"
      @customer-updated="fetchCustomer" />

    <!-- Doctor Assignment Modal -->
    <DoctorAssignmentModal :show="showDoctorModal" :customer="customer" @close="showDoctorModal = false"
      @assigned="handleDoctorAssigned" />

    <!-- Customer Services Modal -->
    <CustomerServicesModal :show="showServicesModal" :customer="customer" @close="showServicesModal = false"
      @saved="handleServicesSaved" />

    <!-- Customer Files Modal -->
    <CustomerFilesModal :show="showFilesModal" :customer="customer" @close="showFilesModal = false" />

    <!-- Customer Files Modal -->
    <OperationFollowUpModal :show="showOperationFollowUp" :customer="customer" @close="showOperationFollowUp = false" />
  </div>
</template>

<script setup>
import {
  ClockIcon,
  DocumentTextIcon,
  UserIcon,
  ShoppingBagIcon,
  FolderIcon,
  PencilIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  BriefcaseIcon,
  GlobeAltIcon,
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ViewfinderCircleIcon
} from '@heroicons/vue/24/outline'

// definePageMeta({
//   middleware: 'auth'
// })

const route = useRoute()
const router = useRouter()

// Permissions
const { isDoctor } = usePermissions()

// Reactive state
const customer = ref(null)
const loading = ref(true)
const error = ref('')
const customerDynamicFields = ref([])
const loadingDynamicFields = ref(false)
const statuses = ref([])
const locations = ref({
  countries: [],
  states: [],
  cities: []
})
const history = ref([])
const loadingHistory = ref(false)
const showStates = ref({})

// Modal states
 
const showNotesModal = ref(false)
const showDoctorModal = ref(false)
const showServicesModal = ref(false)
const showFilesModal = ref(false)
const showActionsDropdown = ref(false)
const showOperationFollowUp = ref(false)

// Computed properties
const locationText = computed(() => {
  if (!customer.value) return ''

  const parts = []

  // Find location names from IDs
  const country = locations.value.countries.find(c => c.id === customer.value.country)
  const state = locations.value.states.find(s => s.id === customer.value.state)
  const city = locations.value.cities.find(c => c.id === customer.value.city)

  if (customer.value.district) parts.push(customer.value.district)
  if (city) parts.push(city.name)
  if (state) parts.push(state.name)
  if (country) parts.push(country.name)

  return parts.join(', ')
})

const toggleShow = (id) => {
  showStates.value[id] = !showStates.value[id]
}
 

const customerStatus = computed(() => {
  if (!customer.value || !customer.value.status) return null
  const status = statuses.value.find(s => s.id === customer.value.status)
  return status || null
})

// Methods
const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatHistoryDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatBirthDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getGenderText = (gender) => {
  const genders = {
    'male': 'Erkek',
    'female': 'Kadın',
    'other': 'Diğer'
  }
  return genders[gender] || gender
}

const getImageUrl = (imagePath) => {
  if (!imagePath) return ''
  // If the path already starts with http/https, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  // Otherwise, construct the full URL with API base
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase || 'http://localhost:3001'
  return `${baseURL}/${imagePath}`
}

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

const goBack = () => {
  router.push('/customers')
}

// Dropdown functions
const toggleActionsDropdown = () => {
  showActionsDropdown.value = !showActionsDropdown.value
}

const handleDropdownAction = (action) => {
  showActionsDropdown.value = false
  action()
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  const dropdown = event.target.closest('.relative')
  if (!dropdown && showActionsDropdown.value) {
    showActionsDropdown.value = false
  }
}
 
const showNotes = () => {
  showNotesModal.value = true
}

const showDoctorAssignment = () => {
  showDoctorModal.value = true
}

const handleDoctorAssigned = (assignment) => {
  console.log('Doctor assigned:', assignment)
  // Optionally refresh customer data or show success message
}

const showServices = () => {
  showServicesModal.value = true
}

const showOperationFollowUpModal = () => {
  showOperationFollowUp.value = true
}

const handleServicesSaved = () => {
  console.log('Services saved successfully')
  showServicesModal.value = false
}

const showFiles = () => {
  showFilesModal.value = true
}

const fetchLocations = async () => {
  try {
    const api = useApi()
    const [countriesRes, statesRes, citiesRes, statusesRes] = await Promise.all([
      api('/countries'),
      api('/states'),
      api('/cities'),
      api('/statuses').catch(() => [])
    ])

    locations.value = {
      countries: countriesRes,
      states: statesRes,
      cities: citiesRes
    }

    // Map statuses with snake_case to camelCase conversion
    const rawStatuses = statusesRes.data || statusesRes || []
    statuses.value = rawStatuses.map(status => ({
      ...status,
      isDoctor: status.isDoctor ?? status.is_doctor ?? false,
      isPricing: status.isPricing ?? status.is_pricing ?? false,
      isRemindable: status.isRemindable ?? status.is_remindable ?? false,
      isFirst: status.isFirst ?? status.is_first ?? false,
      isClosed: status.isClosed ?? status.is_closed ?? false,
      isSale: status.isSale ?? status.is_sale ?? false
    }))
  } catch (err) {
    console.error('Error fetching locations:', err)
  }
}

const fetchCustomer = async () => {
  try {
    loading.value = true
    error.value = ''

    const api = useApi()
    const response = await api(`/customers/${route.params.id}`)

    
    
    // Enrich customer with status info
    if (response.status && statuses.value.length > 0) {
      const statusInfo = statuses.value.find(s => s.id === response.status)
      if (statusInfo) {
        response.status_info = statusInfo
        response.statusInfo = statusInfo
      }
    }

    // Check if user has permission to access this customer
    // if (!canAccessCustomer(response)) {
    //   error.value = 'Bu müşteriye erişim yetkiniz bulunmamaktadır.'
    //   customer.value = null
    //   return
    // }

    customer.value = response
  } catch (err) {
    console.error('Error fetching customer:', err)
    if (err?.data?.statusCode === 404 || err?.status === 404) {
      error.value = 'Müşteri bulunamadı.'
    } else if (err?.data?.statusCode === 401 || err?.status === 401) {
      error.value = 'Oturum açmanız gerekiyor. Lütfen giriş yapın.'
    } else {
      error.value = `Müşteri bilgileri yüklenirken bir hata oluştu: ${err?.data?.message || err?.message || 'Bilinmeyen hata'}`
    }
  } finally {
    loading.value = false
  }
}

const fetchCustomerDynamicFields = async () => {
  try {
    loadingDynamicFields.value = true
    // Dynamic fields come with customer data
    if (customer.value?.dynamicFieldValues) {
      customerDynamicFields.value = customer.value.dynamicFieldValues.map(field => ({
        id: field.id,
        name: field.name,
        type: field.type,
        value: field.options_data || field.file,
        file: field.file,
        order: field.order
      }))
    }
  } catch (err) {
    console.error('Error fetching customer dynamic fields:', err)
    // Don't show error for dynamic fields, just log it
  } finally {
    loadingDynamicFields.value = false
  }
}

const fetchCustomerHistory = async () => {
  if (!customer.value?.id) return

  loadingHistory.value = true
  try {
    const customerHistoriesStore = useCustomerHistoriesStore()
    const histories = await customerHistoriesStore.fetchCustomerHistories(customer.value.id)

    // Sort by date descending (newest first)
    history.value = histories
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || a.created_at || a.updatesAt || a.updated_at || 0)
        const dateB = new Date(b.createdAt || b.created_at || b.updatesAt || b.updated_at || 0)
        return dateB - dateA
      })
  } catch (error) {
    console.error('Error fetching customer history:', error)
    history.value = []
  } finally {
    loadingHistory.value = false
  }
}

const refreshData = async () => {
  await fetchCustomer()
  await fetchCustomerDynamicFields()
  await fetchCustomerHistory()
}

// Load data on mount
onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  await fetchLocations()
  await fetchCustomer()
  await fetchCustomerDynamicFields()
  await fetchCustomerHistory()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Page title
useHead({
  title: computed(() =>
    customer.value
      ? `${customer.value.name} ${customer.value.surname} - Müşteri Detayı`
      : 'Müşteri Detayı'
  )
})
</script>