<template>
  <div class="overflow-x-auto">
    <table class="min-w-full">
      <thead>
        <tr class="bg-gray-50 dark:bg-gray-900/50">
          <th class="w-12 px-4 py-3"></th>
          <template v-for="col in columns" :key="col.key">
            <th v-if="col.isVisible" @click="sortBy(col.key)"
              class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              <div class="flex items-center gap-1.5">
                {{ t(col.labelKey, col.label) }}
                <span v-if="sortColumn === col.key" class="text-indigo-600 dark:text-indigo-400">
                  <ChevronUpIcon v-if="sortDirection === 'asc'" class="w-4 h-4" />
                  <ChevronDownIcon v-else class="w-4 h-4" />
                </span>
              </div>
            </th>
          </template>
        </tr>
      </thead>

      <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
        <tr v-for="customer in filteredAndSorted" :key="customer.id"
          class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
          <!-- Actions -->
          <td class="px-4 py-4">
            <button @click="toggleShow(customer.id)"
              class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all">
              <EllipsisHorizontalIcon class="h-5 w-5" />
            </button>
          </td>

          <!-- Customer Info -->
          <td class="px-4 py-4">
            <div class="flex items-center gap-3">
              <div class="relative">
                <div
                  class="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                  <span class="text-sm font-bold text-white">
                    {{ customer.name?.charAt(0)?.toUpperCase() || '?' }}
                  </span>
                </div>
                <!-- Active indicator -->
                <div :class="[
                  'absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-800',
                  customer.isActive ? 'bg-emerald-500' : 'bg-gray-400'
                ]"></div>
              </div>
              <div>
                <NuxtLink :to="`/customers/show/${customer.id}`"
                  class="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {{ customer.name }}
                </NuxtLink>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  ID: {{ customer.id }}
                </p>
              </div>
            </div>
          </td>

          <!-- Status -->
          <td class="px-4 py-4">
            <StatusBadge :name="customer.statusData?.name" :color="customer.statusData?.color" />
          </td>

          <!-- Source (Admin) -->
          <td v-if="isAdmin" class="px-4 py-4">
            <span class="text-sm text-gray-600 dark:text-gray-300">{{ customer.source || '-' }}</span>
          </td>

          <!-- Contact - ✅ GÜNCELLENMIŞ: Bayrak ile -->
          <td class="px-6 py-4">
            <div class="space-y-1">
              <div v-if="customer.phone || customer.email" class="space-y-1">
                <p class="text-sm text-gray-600 dark:text-gray-300">{{ customer.email || '-' }}</p>
                <div v-if="customer.phone" class="flex items-center gap-2">
                  <!-- ✅ Ülke Bayrağı -->
                  <span class="text-lg" :title="getCountryName(customer.phone)">
                    {{ getCountryFlag(customer.phone) }}
                  </span>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    <template v-if="isAdmin">{{ customer.phone }}</template>
                    <template v-else>{{ customer.phone.substring(0, 5) }}****</template>
                  </p>
                </div>
              </div>
              <span v-if="!customer.email && !customer.phone" class="text-sm text-gray-400">-</span>
            </div>
          </td>

          <!-- Related Transaction -->
          <td class="px-4 py-4">
            <span class="text-sm text-gray-600 dark:text-gray-300">{{ customer.relatedTransaction || '-' }}</span>
          </td>

          <!-- Patient -->
          <td class="px-4 py-4">
            <span class="text-sm text-gray-600 dark:text-gray-300">{{ customer.patient || '-' }}</span>
          </td>

          <!-- Checkup Package -->
          <td class="px-4 py-4">
            <span class="text-sm text-gray-600 dark:text-gray-300">{{ customer.checkup_package || '-' }}</span>
          </td>

          <!-- Assigned User (Admin) -->
          <td v-if="isAdmin" class="px-4 py-4">
            <NuxtLink v-if="customer.relevantUserData" :to="`/profile/${customer.relevantUserData?.id}`"
              class="flex items-center gap-2 group/user">
              <div v-if="customer.relevantUserData.avatar"
                class="h-7 w-7 rounded-full overflow-hidden ring-2 ring-white dark:ring-gray-800 shadow">
                <img :src="path + customer.relevantUserData.avatar" alt="Avatar" class="h-full w-full object-cover" />
              </div>
              <div v-else
                class="h-7 w-7 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white text-xs font-medium shadow">
                {{ customer.relevantUserData?.name?.charAt(0) || 'A' }}
              </div>
              <div class="flex-1">
                <p
                  class="text-sm text-gray-700 dark:text-gray-300 group-hover/user:text-indigo-600 dark:group-hover/user:text-indigo-400 transition-colors">
                  {{ customer.relevantUserData?.name }}
                </p>
                <p v-if="customer.relevantUserData?.lastActiveTime"
                  class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full"
                    :class="isOnline(customer.relevantUserData?.lastActiveTime) ? 'bg-emerald-500' : 'bg-gray-400'"></span>
                  {{ getLastSeen(customer.relevantUserData?.lastActiveTime) }}
                </p>
              </div>
            </NuxtLink>
            <span v-else class="text-sm text-gray-400">{{ t('pool.unassigned', 'Atanmamış') }}</span>
          </td>

          <!-- Created Date -->
          <td class="px-4 py-4">
            <span class="text-sm text-gray-600 dark:text-gray-300">{{ formatDate(customer.createdAt) }}</span>
          </td>

          <!-- Updated Date -->
          <td class="px-4 py-4">
            <span class="text-sm text-gray-600 dark:text-gray-300">{{ formatDate(customer.updatesAt) }}</span>
          </td>
        </tr>

        <!-- Empty State -->
        <tr v-if="filteredAndSorted.length === 0">
          <td :colspan="columns.filter(c => c.isVisible).length + 1" class="px-4 py-16 text-center">
            <div class="flex flex-col items-center">
              <div class="p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                <UsersIcon class="h-8 w-8 text-gray-400" />
              </div>
              <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-1">
                {{ t('table.empty.title', 'Müşteri bulunamadı') }}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ t('table.empty.description', 'Arama kriterlerinizi değiştirmeyi deneyin.') }}
              </p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Action Modal -->
    <Teleport to="body">
      <Transition enter-active-class="transition-all duration-300" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition-all duration-200" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="showStates.activeId"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          @click.self="showStates.activeId = null">
          <Transition enter-active-class="transition-all duration-300" enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100" leave-active-class="transition-all duration-200"
            leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
            <div v-if="showStates.activeId"
              class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
              <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                <h3 class="font-semibold text-gray-900 dark:text-white">
                  {{ t('pool.modal.actions', 'İşlemler') }}
                </h3>
                <button @click="showStates.activeId = null"
                  class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                  <XMarkIcon class="h-5 w-5" />
                </button>
              </div>

              <div class="p-4 grid grid-cols-3 gap-2">
                <NuxtLink :to="`/customers/show/${showStates.activeId}`"
                  class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                  <div class="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                    <EyeIcon class="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span class="text-xs text-gray-600 dark:text-gray-300">{{ t('pool.actions.view', 'Görüntüle') }}</span>
                </NuxtLink>

                <button @click="emitAction('show-history')"
                  class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                  <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <ClockIcon class="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span class="text-xs text-gray-600 dark:text-gray-300">{{ t('pool.actions.history', 'Geçmiş') }}</span>
                </button>

                <button @click="emitAction('show-notes')"
                  class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                  <div class="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <DocumentTextIcon class="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <span class="text-xs text-gray-600 dark:text-gray-300">{{ t('pool.actions.notes', 'Notlar') }}</span>
                </button>

                <button @click="emitAction('show-doctor')"
                  class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                  <div class="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <UsersIcon class="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span class="text-xs text-gray-600 dark:text-gray-300">{{ t('pool.actions.doctor', 'Doktor') }}</span>
                </button>

                <button @click="emitAction('show-services')"
                  class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                  <div class="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <ShoppingBagIcon class="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span class="text-xs text-gray-600 dark:text-gray-300">{{ t('pool.actions.services', 'Hizmetler') }}</span>
                </button>

                <button @click="emitAction('show-files')"
                  class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                  <div class="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                    <FolderIcon class="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <span class="text-xs text-gray-600 dark:text-gray-300">{{ t('pool.actions.files', 'Dosyalar') }}</span>
                </button>

                <NuxtLink v-if="isEditable" :to="`/customers/edit/${showStates.activeId}`"
                  class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                  <div class="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <PencilIcon class="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <span class="text-xs text-gray-600 dark:text-gray-300">{{ t('pool.actions.edit', 'Düzenle') }}</span>
                </NuxtLink>

                <button v-if="isDeleteable" @click="emitAction('confirm-delete')"
                  class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 transition-all">
                  <div class="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <TrashIcon class="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <span class="text-xs text-red-600 dark:text-red-400">{{ t('pool.actions.delete', 'Sil') }}</span>
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import {
  ClockIcon,
  DocumentTextIcon,
  EllipsisHorizontalIcon,
  EyeIcon,
  FolderIcon,
  PencilIcon,
  ShoppingBagIcon,
  TrashIcon,
  UsersIcon,
  XMarkIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  PhoneIcon
} from '@heroicons/vue/24/outline'
import { useLanguage } from '~/composables/useLanguage'

const { t } = useLanguage()

const props = defineProps({
  isAdmin: { type: Boolean, default: false },
  isUser: { type: Boolean, default: false },
  data: { type: Array, default: () => [] },
  isEditable: { type: Boolean, default: false },
  isDeleteable: { type: Boolean, default: false }
})

const { $dayjs } = useNuxtApp()
const config = useRuntimeConfig()
const path = config.public.apiBase

const showStates = ref({ activeId: null })
const sortColumn = ref('')
const sortDirection = ref('asc')

const emit = defineEmits([
  'confirm-delete',
  'show-history',
  'show-notes',
  'show-doctor',
  'show-services',
  'show-files'
])

// ============================================================
// ✅ ÜLKE KODU VE BAYRAK FONKSİYONLARI
// ============================================================

/**
 * Telefon numarasından ülke kodunu çıkarır
 */
const getCountryCode = (phone) => {
  if (!phone) return null
  
  // Telefon numarasını temizle (boşluk, tire, parantez vb.)
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '')
  
  // 00 ile başlıyorsa + ile değiştir
  let normalized = cleaned
  if (cleaned.startsWith('00')) {
    normalized = '+' + cleaned.substring(2)
  }
  
  // + ile başlamıyorsa başına ekle
  if (!normalized.startsWith('+')) {
    normalized = '+' + normalized
  }
  
  // Ülke kodlarını kontrol et (uzundan kısaya doğru)
  // 4 haneli kodlar
  if (normalized.startsWith('+9715')) return '971' // UAE
  if (normalized.startsWith('+9665')) return '966' // Saudi Arabia
  if (normalized.startsWith('+9745')) return '974' // Qatar
  
  // 3 haneli kodlar
  if (normalized.startsWith('+971')) return '971' // UAE
  if (normalized.startsWith('+966')) return '966' // Saudi Arabia
  if (normalized.startsWith('+974')) return '974' // Qatar
  if (normalized.startsWith('+965')) return '965' // Kuwait
  if (normalized.startsWith('+962')) return '962' // Jordan
  if (normalized.startsWith('+963')) return '963' // Syria
  if (normalized.startsWith('+961')) return '961' // Lebanon
  if (normalized.startsWith('+964')) return '964' // Iraq
  if (normalized.startsWith('+212')) return '212' // Morocco
  if (normalized.startsWith('+213')) return '213' // Algeria
  if (normalized.startsWith('+216')) return '216' // Tunisia
  if (normalized.startsWith('+218')) return '218' // Libya
  if (normalized.startsWith('+967')) return '967' // Yemen
  if (normalized.startsWith('+968')) return '968' // Oman
  if (normalized.startsWith('+973')) return '973' // Bahrain
  
  // 2 haneli kodlar
  if (normalized.startsWith('+90')) return '90'   // Turkey
  if (normalized.startsWith('+44')) return '44'   // UK
  if (normalized.startsWith('+49')) return '49'   // Germany
  if (normalized.startsWith('+33')) return '33'   // France
  if (normalized.startsWith('+39')) return '39'   // Italy
  if (normalized.startsWith('+34')) return '34'   // Spain
  if (normalized.startsWith('+86')) return '86'   // China
  if (normalized.startsWith('+91')) return '91'   // India
  if (normalized.startsWith('+81')) return '81'   // Japan
  if (normalized.startsWith('+82')) return '82'   // South Korea
  if (normalized.startsWith('+20')) return '20'   // Egypt
  if (normalized.startsWith('+98')) return '98'   // Iran
  if (normalized.startsWith('+92')) return '92'   // Pakistan
  if (normalized.startsWith('+93')) return '93'   // Afghanistan
  if (normalized.startsWith('+95')) return '95'   // Myanmar
  if (normalized.startsWith('+60')) return '60'   // Malaysia
  if (normalized.startsWith('+62')) return '62'   // Indonesia
  if (normalized.startsWith('+63')) return '63'   // Philippines
  if (normalized.startsWith('+64')) return '64'   // New Zealand
  if (normalized.startsWith('+65')) return '65'   // Singapore
  if (normalized.startsWith('+66')) return '66'   // Thailand
  if (normalized.startsWith('+84')) return '84'   // Vietnam
  if (normalized.startsWith('+30')) return '30'   // Greece
  if (normalized.startsWith('+31')) return '31'   // Netherlands
  if (normalized.startsWith('+32')) return '32'   // Belgium
  if (normalized.startsWith('+41')) return '41'   // Switzerland
  if (normalized.startsWith('+43')) return '43'   // Austria
  if (normalized.startsWith('+45')) return '45'   // Denmark
  if (normalized.startsWith('+46')) return '46'   // Sweden
  if (normalized.startsWith('+47')) return '47'   // Norway
  if (normalized.startsWith('+48')) return '48'   // Poland
  if (normalized.startsWith('+51')) return '51'   // Peru
  if (normalized.startsWith('+52')) return '52'   // Mexico
  if (normalized.startsWith('+53')) return '53'   // Cuba
  if (normalized.startsWith('+54')) return '54'   // Argentina
  if (normalized.startsWith('+55')) return '55'   // Brazil
  if (normalized.startsWith('+56')) return '56'   // Chile
  if (normalized.startsWith('+57')) return '57'   // Colombia
  if (normalized.startsWith('+58')) return '58'   // Venezuela
  if (normalized.startsWith('+27')) return '27'   // South Africa
  
  // 1 haneli kodlar
  if (normalized.startsWith('+1')) return '1'     // USA/Canada
  if (normalized.startsWith('+7')) return '7'     // Russia/Kazakhstan
  
  return null
}

/**
 * Ülke koduna göre bayrak emoji döndürür
 */
const countryFlags = {
  '90': '🇹🇷',   // Turkey
  '1': '🇺🇸',     // USA/Canada
  '44': '🇬🇧',   // UK
  '49': '🇩🇪',   // Germany
  '33': '🇫🇷',   // France
  '39': '🇮🇹',   // Italy
  '34': '🇪🇸',   // Spain
  '86': '🇨🇳',   // China
  '91': '🇮🇳',   // India
  '81': '🇯🇵',   // Japan
  '82': '🇰🇷',   // South Korea
  '7': '🇷🇺',     // Russia
  '966': '🇸🇦',  // Saudi Arabia
  '971': '🇦🇪',  // UAE
  '974': '🇶🇦',  // Qatar
  '965': '🇰🇼',  // Kuwait
  '962': '🇯🇴',  // Jordan
  '963': '🇸🇾',  // Syria
  '961': '🇱🇧',  // Lebanon
  '964': '🇮🇶',  // Iraq
  '20': '🇪🇬',   // Egypt
  '212': '🇲🇦',  // Morocco
  '213': '🇩🇿',  // Algeria
  '216': '🇹🇳',  // Tunisia
  '218': '🇱🇾',  // Libya
  '967': '🇾🇪',  // Yemen
  '968': '🇴🇲',  // Oman
  '973': '🇧🇭',  // Bahrain
  '98': '🇮🇷',   // Iran
  '92': '🇵🇰',   // Pakistan
  '93': '🇦🇫',   // Afghanistan
  '95': '🇲🇲',   // Myanmar
  '60': '🇲🇾',   // Malaysia
  '62': '🇮🇩',   // Indonesia
  '63': '🇵🇭',   // Philippines
  '64': '🇳🇿',   // New Zealand
  '65': '🇸🇬',   // Singapore
  '66': '🇹🇭',   // Thailand
  '84': '🇻🇳',   // Vietnam
  '30': '🇬🇷',   // Greece
  '31': '🇳🇱',   // Netherlands
  '32': '🇧🇪',   // Belgium
  '41': '🇨🇭',   // Switzerland
  '43': '🇦🇹',   // Austria
  '45': '🇩🇰',   // Denmark
  '46': '🇸🇪',   // Sweden
  '47': '🇳🇴',   // Norway
  '48': '🇵🇱',   // Poland
  '51': '🇵🇪',   // Peru
  '52': '🇲🇽',   // Mexico
  '53': '🇨🇺',   // Cuba
  '54': '🇦🇷',   // Argentina
  '55': '🇧🇷',   // Brazil
  '56': '🇨🇱',   // Chile
  '57': '🇨🇴',   // Colombia
  '58': '🇻🇪',   // Venezuela
  '27': '🇿🇦',   // South Africa
}

/**
 * Ülke koduna göre ülke ismi döndürür
 */
const countryNames = {
  '90': 'Türkiye',
  '1': 'ABD/Kanada',
  '44': 'İngiltere',
  '49': 'Almanya',
  '33': 'Fransa',
  '39': 'İtalya',
  '34': 'İspanya',
  '86': 'Çin',
  '91': 'Hindistan',
  '81': 'Japonya',
  '82': 'Güney Kore',
  '7': 'Rusya',
  '966': 'Suudi Arabistan',
  '971': 'BAE',
  '974': 'Katar',
  '965': 'Kuveyt',
  '962': 'Ürdün',
  '963': 'Suriye',
  '961': 'Lübnan',
  '964': 'Irak',
  '20': 'Mısır',
  '212': 'Fas',
  '213': 'Cezayir',
  '216': 'Tunus',
  '218': 'Libya',
  '967': 'Yemen',
  '968': 'Umman',
  '973': 'Bahreyn',
  '98': 'İran',
  '92': 'Pakistan',
  '93': 'Afganistan',
  '95': 'Myanmar',
  '60': 'Malezya',
  '62': 'Endonezya',
  '63': 'Filipinler',
  '64': 'Yeni Zelanda',
  '65': 'Singapur',
  '66': 'Tayland',
  '84': 'Vietnam',
  '30': 'Yunanistan',
  '31': 'Hollanda',
  '32': 'Belçika',
  '41': 'İsviçre',
  '43': 'Avusturya',
  '45': 'Danimarka',
  '46': 'İsveç',
  '47': 'Norveç',
  '48': 'Polonya',
  '51': 'Peru',
  '52': 'Meksika',
  '53': 'Küba',
  '54': 'Arjantin',
  '55': 'Brezilya',
  '56': 'Şili',
  '57': 'Kolombiya',
  '58': 'Venezuela',
  '27': 'Güney Afrika',
}

/**
 * Telefon numarasına göre bayrak emoji döndürür
 */
const getCountryFlag = (phone) => {
  const code = getCountryCode(phone)
  return code ? (countryFlags[code] || '🌍') : '🌍'
}

/**
 * Telefon numarasına göre ülke ismi döndürür
 */
const getCountryName = (phone) => {
  const code = getCountryCode(phone)
  return code ? (countryNames[code] || 'Bilinmeyen') : 'Bilinmeyen'
}

// ============================================================
// MEVCUT FONKSİYONLAR
// ============================================================

const columns = computed(() => [
  { labelKey: 'table.columns.name', label: 'İsim', key: 'name', isVisible: props.isAdmin || props.isUser },
  { labelKey: 'table.columns.status', label: 'Durum', key: 'statusData', isVisible: props.isAdmin || props.isUser },
  { labelKey: 'table.columns.source', label: 'Kaynak', key: 'source', isVisible: props.isAdmin },
  { labelKey: 'table.columns.phone', label: 'Telefon', key: 'phone', isVisible: props.isAdmin || props.isUser },
  { labelKey: 'table.columns.related_transaction', label: 'İlgilenilen Konu', key: 'relatedTransaction', isVisible: props.isAdmin || props.isUser },
  { labelKey: 'table.columns.disease', label: 'Hastalık', key: 'patient', isVisible: props.isAdmin || props.isUser },
  { labelKey: 'table.columns.checkup_package', label: 'Checkup Paketi', key: 'checkup_package', isVisible: props.isAdmin || props.isUser },
  { labelKey: 'table.columns.assigned', label: 'Atanan', key: 'relevantUserData', isVisible: props.isAdmin },
  { labelKey: 'table.columns.created', label: 'Eklenme', key: 'createdAt', isVisible: props.isAdmin || props.isUser },
  { labelKey: 'table.columns.updated', label: 'Güncelleme', key: 'updatesAt', isVisible: props.isAdmin || props.isUser }
])

const toggleShow = (id) => {
  showStates.value.activeId = showStates.value.activeId === id ? null : id
}

const emitAction = (action) => {
  const customer = props.data.find(c => c.id === showStates.activeId)
  if (customer) {
    emit(action, customer)
    showStates.value.activeId = null
  }
}

const getLastSeen = (lastActiveTime) => $dayjs(lastActiveTime).fromNow()

const isOnline = (lastActiveTime) => {
  if (!lastActiveTime) return false
  const diff = Date.now() - new Date(lastActiveTime).getTime()
  return diff < 5 * 60 * 1000
}

const sortBy = (key) => {
  if (sortColumn.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = key
    sortDirection.value = 'asc'
  }
}

const customers = computed(() => props.data)

const filteredAndSorted = computed(() => {
  let result = customers.value

  if (sortColumn.value) {
    result = result.slice().sort((a, b) => {
      const aVal = getValueByPath(a, sortColumn.value)
      const bVal = getValueByPath(b, sortColumn.value)
      if (aVal === bVal) return 0
      if (!aVal) return 1
      if (!bVal) return -1
      return sortDirection.value === 'asc'
        ? aVal.toString().localeCompare(bVal.toString())
        : bVal.toString().localeCompare(aVal.toString())
    })
  }

  return result
})

function getValueByPath(obj, path) {
  return path.split('.').reduce((o, key) => (o ? o[key] : null), obj)
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
</script>