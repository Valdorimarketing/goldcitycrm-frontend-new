<template>
  <TransitionRoot as="template" :show="show">
    <Dialog as="div" class="relative z-50" @close="$emit('close')">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-xl">
              <!-- Header -->
              <div class="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <UserGroupIcon class="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <DialogTitle as="h3" class="text-lg font-bold text-white">
                        {{ doctor ? t('doctor_modal.title_edit', 'Doktor Düzenle') : t('doctor_modal.title_new', 'Yeni Doktor') }}
                      </DialogTitle>
                      <p class="text-sm text-emerald-100 mt-0.5">
                        {{ doctor ? 'Doktor bilgilerini güncelleyin' : 'Yeni doktor bilgilerini girin' }}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    @click="$emit('close')"
                    class="rounded-lg p-2 text-white/80 hover:text-white hover:bg-white/20 transition-colors"
                  >
                    <XMarkIcon class="h-5 w-5" />
                  </button>
                </div>
              </div>

              <!-- Form -->
              <form @submit.prevent="handleSubmit" class="p-6">
                <div class="space-y-5">
                  <!-- Doctor Name -->
                  <div>
                    <label for="name" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {{ t('doctor_modal.name_label', 'Doktor Adı') }} *
                    </label>
                    <div class="relative">
                      <UserIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                      <input
                        id="name"
                        v-model="formData.name"
                        type="text"
                        required
                        :placeholder="t('doctor_modal.name_placeholder', 'Örn: Dr. Ahmet Yılmaz')"
                        class="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <!-- Main Branch -->
                  <div>
                    <label for="branchId" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {{ t('doctor_modal.main_branch_label', 'Ana Branş') }}
                    </label>
                    <div class="relative">
                      <TagIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                      <select
                        id="branchId"
                        v-model.number="formData.branchId"
                        class="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                      >
                        <option :value="0">{{ t('doctor_modal.main_branch_placeholder', 'Seçiniz') }}</option>
                        <option v-for="branch in branches" :key="branch.id" :value="branch.id">
                          {{ branch.name }}
                        </option>
                      </select>
                      <ChevronDownIcon class="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <!-- Related Branches -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {{ t('doctor_modal.branches_label', 'İlişkili Branşlar') }}
                    </label>
                    <div class="border border-gray-200 dark:border-gray-600 rounded-xl max-h-48 overflow-y-auto bg-gray-50 dark:bg-gray-900">
                      <div v-for="branch in branches" :key="branch.id" class="px-4 py-2.5 hover:bg-white dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0">
                        <label class="flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            :value="branch.id"
                            v-model="formData.branchIds"
                            class="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0 transition-all"
                          />
                          <span class="ml-3 text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                            {{ branch.name }}
                          </span>
                        </label>
                      </div>
                      <div v-if="branches.length === 0" class="px-4 py-8 text-center">
                        <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-2">
                          <TagIcon class="h-6 w-6 text-gray-400" />
                        </div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                          {{ t('doctor_modal.branches_empty', 'Branş bulunamadı') }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Related Hospitals -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {{ t('doctor_modal.hospitals_label', 'İlişkili Hastaneler') }}
                    </label>
                    <div class="border border-gray-200 dark:border-gray-600 rounded-xl max-h-48 overflow-y-auto bg-gray-50 dark:bg-gray-900">
                      <div v-for="hospital in hospitals" :key="hospital.id" class="px-4 py-2.5 hover:bg-white dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0">
                        <label class="flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            :value="hospital.id"
                            v-model="formData.hospitalIds"
                            class="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0 transition-all"
                          />
                          <span class="ml-3 text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                            {{ hospital.name }}
                          </span>
                        </label>
                      </div>
                      <div v-if="hospitals.length === 0" class="px-4 py-8 text-center">
                        <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-2">
                          <BuildingOffice2Icon class="h-6 w-6 text-gray-400" />
                        </div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                          {{ t('doctor_modal.hospitals_empty', 'Hastane bulunamadı') }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="mt-6 flex gap-3">
                  <button
                    type="button"
                    @click="$emit('close')"
                    class="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all text-sm"
                  >
                    {{ t('doctor_modal.cancel', 'İptal') }}
                  </button>
                  <button
                    type="submit"
                    :disabled="saving"
                    class="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm shadow-lg shadow-emerald-500/25"
                  >
                    <span v-if="saving" class="flex items-center justify-center gap-2">
                      <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {{ t('doctor_modal.saving', 'Kaydediliyor...') }}
                    </span>
                    <span v-else>
                      {{ t('doctor_modal.save', 'Kaydet') }}
                    </span>
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { 
  UserGroupIcon, 
  UserIcon,
  TagIcon, 
  BuildingOffice2Icon,
  ChevronDownIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import { useLanguage } from '~/composables/useLanguage'

const { t } = useLanguage()

const props = defineProps({
  show: Boolean,
  doctor: Object
})

const emit = defineEmits(['close', 'saved'])

const { createDoctor, updateDoctor } = useDoctors()
const { branches, fetchBranches } = useBranches()
const { hospitals, fetchHospitals } = useHospitals()
const saving = ref(false)

const formData = ref({
  name: '',
  branchId: 0,
  branchIds: [],
  hospitalIds: []
})

const handleSubmit = async () => {
  saving.value = true
  try {
    // Prepare the data with proper formatting
    const dataToSend = {
      name: formData.value.name,
      branchId: formData.value.branchId > 0 ? formData.value.branchId : undefined,
      branchIds: formData.value.branchIds.length > 0 ? formData.value.branchIds : undefined,
      hospitalIds: formData.value.hospitalIds.length > 0 ? formData.value.hospitalIds : undefined
    }

    if (props.doctor) {
      await updateDoctor(props.doctor.id, dataToSend)
      useToast().showSuccess(t('doctor_modal.success_updated', 'Doktor başarıyla güncellendi'))
    } else {
      await createDoctor(dataToSend)
      useToast().showSuccess(t('doctor_modal.success_created', 'Doktor başarıyla eklendi'))
    }
    emit('saved')
    emit('close')
  } catch (error) {
    useToast().showError(t('doctor_modal.error', 'İşlem sırasında bir hata oluştu'))
  } finally {
    saving.value = false
  }
}

// Fetch branches and hospitals when modal opens
watch(() => props.show, async (newVal) => {
  if (newVal) {
    await Promise.all([
      fetchBranches(undefined, 1000, 1),  // Fetch all branches: limit=1000, page=1
      fetchHospitals(1000, 1)  // Fetch all hospitals: limit=1000, page=1
    ])
  }
})

// Watch for doctor changes
watch(() => props.doctor, (newVal) => {

  if (newVal) {
    // Extract branch IDs from doctor2Branches relationship
    const branchIds = newVal.doctor2Branches
      ? newVal.doctor2Branches.map(d2b => d2b.branchId)
      : (newVal.branchIds || [])

    // Extract hospital IDs from doctor2Hospitals relationship
    const hospitalIds = newVal.doctor2Hospitals
      ? newVal.doctor2Hospitals.map(d2h => d2h.hospitalId)
      : (newVal.hospitalIds || [])


    formData.value = {
      name: newVal.name || '',
      branchId: newVal.branchId || 0,
      branchIds: branchIds,
      hospitalIds: hospitalIds
    }

    console.log('FormData set to:', formData.value)
  } else {
    formData.value = {
      name: '',
      branchId: 0,
      branchIds: [],
      hospitalIds: []
    }
  }
}, { immediate: true })
</script>