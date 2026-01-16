<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="relative w-full max-w-lg transform overflow-visible rounded-3xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-2xl transition-all">
              <!-- Header with gradient background -->
              <div class="relative overflow-hidden rounded-t-3xl bg-gradient-to-r to-rose-400 to-rose-500 px-8 py-6">
                <div class="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
                <div class="relative">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                        <PlusCircleIcon class="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <DialogTitle as="h3" class="text-xl font-bold text-white">
                          Yeni Aksiyon Ekle
                        </DialogTitle>
                        <p class="mt-1 text-sm text-rose-100">
                          Ürününüz için planlı bir aksiyon oluşturun
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      @click="closeModal"
                      class="rounded-xl bg-white/20 p-2 backdrop-blur-sm transition-all hover:bg-white/30"
                    >
                      <XMarkIcon class="h-5 w-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              <form @submit.prevent="handleSubmit" class="p-8 space-y-6">
                <!-- Planned Date with enhanced styling -->
                <div class="space-y-3">
                  <div class="flex items-center space-x-2">
                    <CalendarDaysIcon class="h-5 w-5 text-rose-600" />
                    <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      Planlanan Tarih
                    </label>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div class="relative">
                      <select
                        v-model="form.dateType"
                        class="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 text-sm font-medium text-gray-700 transition-all hover:border-rose-400 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                        required
                      >
                        <option value="before">📅 Önce</option>
                        <option value="after">📅 Sonra</option>
                      </select>
                      <ChevronDownIcon class="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    </div>
                    <div class="relative">
                      <input
                        v-model.number="form.days"
                        type="number"
                        min="1"
                        placeholder="Gün sayısı"
                        class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-all hover:border-rose-400 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                        required
                      />
                      <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">gün</span>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2 rounded-xl bg-rose-50 dark:bg-rose-900/20 p-3">
                    <InformationCircleIcon class="h-4 w-4 text-rose-600 dark:text-rose-400" />
                    <p class="text-xs text-rose-600 dark:text-rose-400">
                      Aksiyon {{ form.dateType === 'before' ? 'öncesinde' : 'sonrasında' }} {{ form.days }} gün {{ form.dateType === 'before' ? 'önce' : 'sonra' }} tetiklenecek
                    </p>
                  </div>
                </div>

                <!-- Name with enhanced styling -->
                <div class="space-y-3">
                  <div class="flex items-center space-x-2">
                    <DocumentTextIcon class="h-5 w-5 text-rose-600" />
                    <label for="name" class="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      Aksiyon Adı
                    </label>
                  </div>
                  <div class="relative">
                    <input
                      id="name"
                      v-model="form.name"
                      type="text"
                      required
                      class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pl-12 text-sm font-medium text-gray-700 transition-all hover:border-rose-400 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                      placeholder="Örn: Müşteri ile görüşme"
                    />
                    <TagIcon class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <!-- Description with enhanced styling -->
                <div class="space-y-3">
                  <div class="flex items-center space-x-2">
                    <ChatBubbleBottomCenterTextIcon class="h-5 w-5 text-rose-600" />
                    <label for="description" class="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      Açıklama
                    </label>
                  </div>
                  <div class="relative">
                    <textarea
                      id="description"
                      v-model="form.description"
                      rows="4"
                      required
                      class="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-all hover:border-rose-400 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                      placeholder="Bu aksiyonun detaylarını ve amacını açıklayın..."
                    />
                    <div class="absolute bottom-2 right-2 text-xs text-gray-400">
                      {{ form.description.length }}/500
                    </div>
                  </div>
                </div>

                <!-- Error Message with enhanced styling -->
                <Transition
                  enter-active-class="transition ease-out duration-200"
                  enter-from-class="transform opacity-0 scale-95"
                  enter-to-class="transform opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-150"
                  leave-from-class="transform opacity-100 scale-100"
                  leave-to-class="transform opacity-0 scale-95"
                >
                  <div v-if="error" class="flex items-start space-x-3 rounded-xl border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 p-4">
                    <ExclamationCircleIcon class="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
                    <p class="text-sm font-medium text-red-800 dark:text-red-400">{{ error }}</p>
                  </div>
                </Transition>

                <!-- Buttons with enhanced styling -->
                <div class="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-6">
                  <div class="flex items-center space-x-2 text-xs text-gray-500">
                    <SparklesIcon class="h-4 w-4" />
                    <span>Otomatik hatırlatıcı oluşturulacak</span>
                  </div>
                  <div class="flex space-x-3">
                    <button
                      type="button"
                      @click="closeModal"
                      class="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <XMarkIcon class="mr-2 h-4 w-4" />
                      İptal
                    </button>
                    <button
                      type="submit"
                      :disabled="loading || !form.name || !form.description"
                      class="inline-flex items-center justify-center rounded-xl bg-gradient-to-r to-rose-400 to-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:from-rose-700 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span v-if="loading" class="flex items-center">
                        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Kaydediliyor...
                      </span>
                      <span v-else class="flex items-center">
                        <CheckIcon class="mr-2 h-4 w-4" />
                        Aksiyon Oluştur
                      </span>
                    </button>
                  </div>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'
import {
  PlusCircleIcon,
  XMarkIcon,
  CalendarDaysIcon,
  ChevronDownIcon,
  InformationCircleIcon,
  DocumentTextIcon,
  TagIcon,
  ChatBubbleBottomCenterTextIcon,
  ExclamationCircleIcon,
  SparklesIcon,
  CheckIcon
} from '@heroicons/vue/24/outline'
import type { CreateActionListDto } from '~/types'

const props = defineProps<{
  isOpen: boolean
  productId: string
}>()

const emit = defineEmits<{
  close: []
  created: [action: any]
}>()

const actionListsStore = useActionListsStore()
const authStore = useAuthStore()

const form = ref({
  dateType: 'after' as 'before' | 'after',
  days: 1,
  name: '',
  description: ''
})

const loading = ref(false)
const error = ref('')

const closeModal = () => {
  form.value = {
    dateType: 'after',
    days: 1,
    name: '',
    description: ''
  }
  error.value = ''
  emit('close')
}

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    const plannedDate = form.value.dateType === 'before' 
      ? -form.value.days 
      : form.value.days

    const actionData: CreateActionListDto = {
      user: authStore.user?.id || 0,
      product: parseInt(props.productId),
      plannedDate,
      name: form.value.name,
      description: form.value.description
    }

    const newAction = await actionListsStore.createActionList(actionData)
    emit('created', newAction)
    closeModal()
  } catch (err: any) {
    error.value = err.data?.message || 'Aksiyon eklenirken bir hata oluştu'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.bg-grid-white\/10 {
  background-image: url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%23ffffff' fill-opacity='0.1'%3e%3cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e");
}
</style>