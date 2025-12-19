<template>
  <Teleport to="body">
    <Transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100"
      leave-active-class="duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
        <!-- BACKDROP -->
        <div class="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/80 backdrop-blur-sm" @click="close"></div>

        <!-- MODAL BOX -->
        <div class="flex min-h-screen items-center justify-center p-4">
          <Transition enter-active-class="duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100" leave-active-class="duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <div v-if="show"
              class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl transition-all sm:w-full sm:max-w-4xl">
              <!-- HEADER -->
              <div class="bg-gradient-to-r from-pink-600 to-rose-600 px-6 py-4 flex justify-between items-center">
                <div>
                  <h3 class="text-lg font-semibold text-white">
                    Operasyon Takip Sistemi
                  </h3>
                  <p class="text-sm text-cyan-100">
                    {{ customer?.name }} {{ customer?.surname }}
                  </p>
                </div>
                <button @click="close" class="rounded-lg p-2 hover:bg-white/20">
                  <XMarkIcon class="h-5 w-5 text-white" />
                </button>
              </div>

              <!-- LISTE -->
              <div v-if="view === 'list'" class="p-6 space-y-4">
                <div class="flex justify-between items-center mb-3">
                  <h4 class="text-md font-semibold text-gray-800 dark:text-gray-200">
                    Takip Listesi
                  </h4>
                  <button @click="startNew"
                    class="bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-indigo-700 transition">
                    + Yeni Ekle
                  </button>
                </div>

                <div v-if="loading" class="text-gray-500 text-sm">
                  Yükleniyor...
                </div>

                <ul v-else-if="schedules.length" class="divide-y divide-gray-200 dark:divide-gray-700">
                  <li v-for="item in schedules" :key="item.id" @click="openFollowup(item)"
                    class="p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition">
                    <div class="flex justify-between">
                      <span class="font-medium">{{ item.operationType?.name }}</span>
                      <span class="text-sm text-gray-500 dark:text-gray-300">
                        {{ formatDate(item.scheduled_at) }} - {{ formatDate2(item.scheduled_at) }}
                      </span>
                    </div>
                  </li>
                </ul>

                <div v-else class="text-sm text-gray-500 text-center py-4">
                  Henüz bir kayıt bulunamadı.
                </div>
              </div>

              <!-- DETAY -->
              <div v-else class="p-6 space-y-4">
                <div class="flex justify-between items-center">
                  <h4 class="text-md font-semibold text-gray-800 dark:text-gray-200">
                    {{ selectedItem ? 'Takip Detayı' : 'Yeni Takip Oluştur' }}
                  </h4>
                  <button @click="backToList"
                    class="text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition">
                    ← Listeye Dön
                  </button>
                </div>

                <!-- FORM -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tarih</label>
                    <input type="date" v-model="selectedDateStr"
                      class="w-full rounded-lg border px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600" />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">İşlem Tipi</label>
                    <select v-model="selectedOperationType"
                      class="w-full rounded-lg border px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600">
                      <option value="" disabled>Seçin</option>
                      <option v-for="t in operationTypes" :key="t.id" :value="t.id">
                        {{ t.name }}
                      </option>
                    </select>
                  </div>
                </div>

                <!-- GÜN / AY -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <FollowupList title="Günler" :items="dayList" kind="day" @toggle="onToggleDone" />
                  <FollowupList title="Aylar" :items="monthList" kind="month" @toggle="onToggleDone" />
                </div>

                <div class="text-xs text-gray-500 dark:text-gray-400 mt-3">
                  Not: Switch aktifse tamamlandı sayılır. Kayıt sonrası gün ve aylar hariç güncelleme yapılamaz.
                </div>

                <div class="flex justify-between mt-4">
                  <button v-if="selectedItem" @click="confirmDelete"
                    class="px-4 py-2 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-700 hover:dark:bg-red-800 text-sm font-medium">
                    Kaydı silmek istiyorum
                  </button>

                  <div class="ml-auto flex gap-2">
                    <button @click="backToList"
                      class="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm font-medium">
                      İptal
                    </button>
                    <button @click="onSave" :disabled="isSaving" v-if="!selectedItem"
                      class="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-60">
                      {{ isSaving ? 'Kaydediliyor...' : 'Kaydet' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <!-- DELETE MODAL -->
        <div v-if="showDeleteModal" class="fixed inset-0 z-50 overflow-y-auto">
          <div class="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-80"></div>

            <div
              class="inline-block transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div class="px-6 py-4">
                <div class="flex items-start space-x-3">
                  <ExclamationTriangleIcon class="h-6 w-6 text-red-600 mt-1" />
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                      Operasyon Takibini Sil
                    </h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Bu kaydı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                    </p>
                  </div>
                </div>
              </div>

              <div class="bg-gray-50 dark:bg-gray-700 px-6 py-3 sm:flex sm:flex-row-reverse">
                <button @click="handleDelete"
                  class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500 sm:ml-3 sm:w-auto">
                  Sil
                </button>
                <button @click="showDeleteModal = false"
                  class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-600 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-500 hover:bg-gray-50 sm:mt-0 sm:w-auto">
                  İptal
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useApi } from '@/composables/useApi'
import { useToast } from '@/composables/useToast'
import FollowupList from './FollowupList.vue'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)
dayjs.extend(timezone)

const { $dayjs } = useNuxtApp()

const props = defineProps({
  show: Boolean,
  customer: Object
})
const emit = defineEmits(['close', 'saved'])

const api = useApi()
const toast = useToast()

const view = ref('list')
const schedules = ref([])
const loading = ref(false)
const selectedItem = ref(null)

const selectedDateStr = ref('')
const selectedOperationType = ref('')
const operationTypes = ref([])
const isSaving = ref(false)
const showDeleteModal = ref(false)

const dayOffsets = [1, 5, 7, 10]
const monthOffsets = [1, 2, 4, 6, 8, 10, 12]

const dayList = ref([])
const monthList = ref([])

const TURKEY_TZ = 'Europe/Istanbul' 
const existingFollowups = ref([])

// --- FUNCTIONS ---
function close() {
  emit('close')
}
function backToList() {
  view.value = 'list'
  selectedItem.value = null
}
function confirmDelete() {
  showDeleteModal.value = true
}
function startNew() {
  selectedDateStr.value = formatInputDate(new Date())
  selectedOperationType.value = ''
  generateLists(new Date())
  selectedItem.value = null
  view.value = 'detail'
}
function openFollowup(item) {
  selectedItem.value = item
  selectedDateStr.value = formatInputDate(new Date(item.scheduled_at))
  selectedOperationType.value = item.operation_type_id
  existingFollowups.value = item.followups || { days: [], months: [] }
  generateLists(new Date(item.scheduled_at))
  view.value = 'detail'
}

// --- API CALLS ---
async function fetchSchedules() {
  loading.value = true
  try {
    const res = await api(`/operations/followups/${props.customer.id}`)
    schedules.value = res.data || []
  } catch {
    schedules.value = []
  } finally {
    loading.value = false
  }
}
async function fetchOperationTypes() {
  try {
    operationTypes.value = await api('/operations/types')
  } catch {
    operationTypes.value = []
  }
}
async function handleDelete() {
  if (!selectedItem.value) return
  try {
    await api(`/operations/schedule/${selectedItem.value.id}`, { method: 'DELETE' })
    toast.showSuccess('Operasyon takibi silindi')
    await fetchSchedules()
    backToList()
  } catch {
    toast.showError('Silme işlemi başarısız')
  } finally {
    showDeleteModal.value = false
  }
}


// --- SAVE ---
 

function toTRString(input) {
  // Zaten string ise ve Z ile bitiyorsa TR'ye çevir
  if (typeof input === 'string') {
    if (input.endsWith('Z')) {
      return dayjs(input).tz(TURKEY_TZ).format('YYYY-MM-DD[T]HH:mm:ssZZ')
    }
    // +03:00 içeriyorsa dokunma
    return input
  }
  // Date veya dayjs objesi ise TR string'e çevir
  return dayjs(input).tz(TURKEY_TZ).format('YYYY-MM-DD[T]HH:mm:ssZZ')
}

function normalizeFollowups(list) {
  return (list || []).map(item => ({
    ...item,
    date: toTRString(item.date) // <-- kritik
  }))
}

// --- SAVE ---
async function onSave() {
  if (!selectedOperationType.value) return

  const combined = [...dayList.value, ...monthList.value]
  const chosen = combined.find(i => i.done) || dayList.value[0]

  // Base (seçilen) tarih: her zaman TR'de 00:00:00 +03:00 olarak kaydedelim
  const baseDateStr = typeof selectedDateStr.value === 'string'
    ? selectedDateStr.value               // "YYYY-MM-DD"
    : dayjs(chosen?.date).tz(TURKEY_TZ).format('YYYY-MM-DD')

  const scheduled_at = `${baseDateStr}T00:00:00+03:00` // <-- offset sabit ve net

  // Kayıt yapısı (serialize öncesi normalize!)
  const followups = {
    days: normalizeFollowups(dayList.value),
    months: normalizeFollowups(monthList.value)
  }

  const payload = {
    customer_id: props.customer.id,
    operation_type_id: selectedOperationType.value,
    scheduled_at,        // <-- artık +03:00 içeriyor
    followups            // <-- tüm alt tarihler +03:00 string
  }

  isSaving.value = true
  try {
    const res = await api('/operations/schedule', { method: 'POST', body: payload })
    emit('saved', res)
    toast.showSuccess('Takip kaydedildi')
    await fetchSchedules()
    backToList()
  } catch (e) {
    console.error(e)
    toast.showError('Kaydetme başarısız')
  } finally {
    isSaving.value = false
  }
}


// --- TOGGLE ---
async function onToggleDone(item) {
  if (!selectedItem.value || !selectedItem.value.id) return

  try {
    await api(`/operations/followups/${selectedItem.value.id}/followup`, {
      method: 'PATCH',
      body: {
        kind: item.kind,
        offset: item.offset,
        done: item.done
      }
    })

    toast.showSuccess('Durum güncellendi')

    // Local state'i güncelle
    const list = item.kind === 'day' ? dayList.value : monthList.value
    const idx = list.findIndex(i => i.offset === item.offset)
    if (idx !== -1) list[idx].done = item.done
  } catch (e) {
    toast.showError('Durum güncellenemedi')
  }
}


// --- UTILITIES ---
function formatInputDate(d) {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}


function addDays(d, days) {
  const n = new Date(d)
  n.setDate(n.getDate() + days)
  return n
}
function addMonths(d, m) {
  const n = new Date(d)
  n.setMonth(n.getMonth() + m)
  return n
}

const generateLists = (baseDateStr) => {
  // Seçilen tarihi JS Date objesine çevir
  const baseDate = new Date(baseDateStr)

  // Yardımcı fonksiyon: TR saatine göre ISO string üret
  const toTurkeyISO = (date) => {
    // Türkiye UTC+3
    const TURKEY_OFFSET = 3 * 60 * 60 * 1000
    const local = new Date(date.getTime())
    const turkey = new Date(local.getTime() + TURKEY_OFFSET)
    const year = turkey.getUTCFullYear()
    const month = String(turkey.getUTCMonth() + 1).padStart(2, '0')
    const day = String(turkey.getUTCDate()).padStart(2, '0')
    return `${year}-${month}-${day}T00:00:00+03:00`
  }

  // Gün listesi
  dayList.value = [1, 5, 7, 10].map(offset => {
    const next = new Date(baseDate)
    next.setDate(next.getDate() + offset)
    return {
      offset,
      date: toTurkeyISO(next),
      done: false,
      kind: 'day'
    }
  })

  // Ay listesi
  monthList.value = [1, 2, 4, 6, 8, 10, 12].map(offset => {
    const next = new Date(baseDate)
    next.setMonth(next.getMonth() + offset)
    return {
      offset,
      date: toTurkeyISO(next),
      done: false,
      kind: 'month'
    }
  })
}

generateLists('2025-11-07')
console.log(dayList.value)





function formatDate(d) {
  if (!d) return '-'
  const date = dayjs(d).tz('Europe/Istanbul')
  return date.isValid() ? date.format('D MMMM') : '-'
}




function formatDate2(date) {
  return $dayjs(date).format('DD.MM.YYYY')
}

// --- WATCHERS ---
watch(selectedDateStr, v => {
  if (v) generateLists(new Date(v))
})
watch(
  () => props.show,
  v => {
    if (v && props.customer?.id) {
      fetchSchedules()
      fetchOperationTypes()
    }
  }
)

onMounted(fetchOperationTypes)
</script>
