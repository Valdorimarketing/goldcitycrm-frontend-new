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
        <div class="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-80 transition-opacity" />
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
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <form @submit.prevent="handleSubmit">
                <div class="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div class="sm:flex sm:items-start">
                    <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <DialogTitle as="h3" class="text-lg font-semibold leading-6 text-gray-900 dark:text-white mb-4">
                        {{ doctor ? 'Doktor Düzenle' : 'Yeni Doktor' }}
                      </DialogTitle>
                      
                      <div class="mt-4 space-y-4">
                        <div>
                          <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Doktor Adı *
                          </label>
                          <input
                            id="name"
                            v-model="formData.name"
                            type="text"
                            required
                            class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Örn: Dr. Ahmet Yılmaz"
                          />
                        </div>

                        <div>
                          <label for="branchId" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Ana Branş
                          </label>
                          <select
                            id="branchId"
                            v-model.number="formData.branchId"
                            class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          >
                            <option :value="0">Seçiniz</option>
                            <option v-for="branch in branches" :key="branch.id" :value="branch.id">
                              {{ branch.name }}
                            </option>
                          </select>
                        </div>

                        <div>
                          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            İlişkili Branşlar
                          </label>
                          <div class="border border-gray-300 dark:border-gray-600 rounded-md max-h-48 overflow-y-auto">
                            <div v-for="branch in branches" :key="branch.id" class="px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700">
                              <label class="flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  :value="branch.id"
                                  v-model="formData.branchIds"
                                  class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                <span class="ml-2 text-sm text-gray-900 dark:text-gray-100">{{ branch.name }}</span>
                              </label>
                            </div>
                            <div v-if="branches.length === 0" class="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                              Branş bulunamadı
                            </div>
                          </div>
                        </div>

                        <div>
                          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            İlişkili Hastaneler
                          </label>
                          <div class="border border-gray-300 dark:border-gray-600 rounded-md max-h-48 overflow-y-auto">
                            <div v-for="hospital in hospitals" :key="hospital.id" class="px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700">
                              <label class="flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  :value="hospital.id"
                                  v-model="formData.hospitalIds"
                                  class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                <span class="ml-2 text-sm text-gray-900 dark:text-gray-100">{{ hospital.name }}</span>
                              </label>
                            </div>
                            <div v-if="hospitals.length === 0" class="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                              Hastane bulunamadı
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="submit"
                    :disabled="saving"
                    class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 sm:ml-3 sm:w-auto"
                  >
                    {{ saving ? 'Kaydediliyor...' : 'Kaydet' }}
                  </button>
                  <button
                    type="button"
                    @click="$emit('close')"
                    class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-600 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 sm:mt-0 sm:w-auto"
                  >
                    İptal
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
      useToast().showSuccess('Doktor başarıyla güncellendi')
    } else {
      await createDoctor(dataToSend)
      useToast().showSuccess('Doktor başarıyla eklendi')
    }
    emit('saved')
    emit('close')
  } catch (error) {
    useToast().showError('İşlem sırasında bir hata oluştu')
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
    console.log('Branches loaded:', branches.value.length)
    console.log('Hospitals loaded:', hospitals.value.length)
  }
})

// Watch for doctor changes
watch(() => props.doctor, (newVal) => {
  console.log('Doctor prop changed in modal:', newVal)

  if (newVal) {
    // Extract branch IDs from doctor2Branches relationship
    const branchIds = newVal.doctor2Branches
      ? newVal.doctor2Branches.map(d2b => d2b.branchId)
      : (newVal.branchIds || [])

    // Extract hospital IDs from doctor2Hospitals relationship
    const hospitalIds = newVal.doctor2Hospitals
      ? newVal.doctor2Hospitals.map(d2h => d2h.hospitalId)
      : (newVal.hospitalIds || [])

    console.log('Extracted branchIds:', branchIds)
    console.log('Extracted hospitalIds:', hospitalIds)

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