<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-80 transition-opacity" @click="close"></div>

      <div class="inline-block transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:align-middle">
        <div class="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
              <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-white mb-4">
                {{ t('doctor_modal.title', 'Doktor Görüşüne Gönder') }} - {{ customer?.name }}
              </h3>

              <div v-if="loading" class="flex justify-center py-12">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
              </div>

              <div v-else class="space-y-6">
                <!-- Mevcut doktor ataması -->
                <div v-if="existingAssignment" class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h4 class="font-medium text-blue-900 dark:text-blue-300 mb-2">
                    {{ t('doctor_modal.current_assignment', 'Mevcut Doktor Ataması') }}
                  </h4>
                  <div class="space-y-2 text-sm">
                    <p class="text-gray-700 dark:text-gray-300">
                      <span class="font-medium">{{ t('doctor_modal.doctor', 'Doktor:') }}</span> {{ existingAssignment.doctor?.name || '-' }}
                    </p>
                    <p class="text-gray-700 dark:text-gray-300">
                      <span class="font-medium">{{ t('doctor_modal.branch', 'Branş:') }}</span> {{ existingAssignment.doctor?.branch?.name || '-' }}
                    </p>
                    <div v-if="existingAssignment.doctor?.doctor2Hospitals?.length" class="text-gray-700 dark:text-gray-300">
                      <span class="font-medium">{{ t('doctor_modal.hospitals', 'Hastane') }}{{ existingAssignment.doctor.doctor2Hospitals.length > 1 ? t('doctor_modal.hospitals_plural', 'ler') : '' }}:</span>
                      <ul class="ml-4 mt-1 space-y-1">
                        <li v-for="d2h in existingAssignment.doctor.doctor2Hospitals" :key="d2h.id">
                          • {{ d2h.hospital?.name || '-' }}
                        </li>
                      </ul>
                    </div>
                    <p v-else class="text-gray-700 dark:text-gray-300">
                      <span class="font-medium">{{ t('doctor_modal.hospital', 'Hastane:') }}</span> -
                    </p>
                    <div v-if="existingAssignment.doctor?.doctor2Branches?.length > 1" class="text-gray-700 dark:text-gray-300">
                      <span class="font-medium">{{ t('doctor_modal.additional_branches', 'Ek Branşlar:') }}</span>
                      <ul class="ml-4 mt-1 space-y-1">
                        <li v-for="d2b in existingAssignment.doctor.doctor2Branches" :key="d2b.id">
                          • {{ d2b.branch?.name || '-' }}
                        </li>
                      </ul>
                    </div>
                    <p class="text-gray-700 dark:text-gray-300">
                      <span class="font-medium">{{ t('doctor_modal.note', 'Not:') }}</span> {{ existingAssignment.note || '-' }}
                    </p>
                  </div>

                  <!-- Doktor yorumu - sadece doctor rolü görebilir -->
                  <div v-if="isDoctor" class="mt-4">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {{ t('doctor_modal.doctor_comment', 'Doktor Yorumu') }}
                    </label>
                    <textarea
                      v-model="doctorComment"
                      rows="3"
                      class="form-input"
                      :placeholder="t('doctor_modal.doctor_comment_placeholder', 'Doktor yorumunu girin...')"
                    ></textarea>
                    <button
                      @click="updateDoctorComment"
                      :disabled="updatingComment"
                      class="mt-2 btn-primary"
                    >
                      {{ updatingComment ? t('doctor_modal.saving_comment', 'Kaydediliyor...') : t('doctor_modal.save_comment', 'Yorumu Kaydet') }}
                    </button>
                  </div>
                </div>

                <!-- Doktor atama formu -->
                <div class="border-t dark:border-gray-700 pt-4">
                  <h4 class="font-medium text-gray-900 dark:text-white mb-4">
                    {{ existingAssignment ? t('doctor_modal.assign_new_doctor', 'Yeni Doktor Ata') : t('doctor_modal.assign_doctor', 'Doktor Ata') }}
                  </h4>

                  <!-- Branş seçimi -->
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {{ t('doctor_modal.select_branch', 'Branş Seçin') }}
                    </label>
                    <select
                      v-model="selectedBranch"
                      @change="onBranchChange"
                      class="form-input"
                    >
                      <option value="">{{ t('doctor_modal.select_branch_placeholder', 'Branş seçin...') }}</option>
                      <option v-for="branch in branches" :key="branch.id" :value="branch.id">
                        {{ branch.name }}
                      </option>
                    </select>
                  </div>

                  <!-- Hastane seçimi -->
                  <div v-if="selectedBranch" class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {{ t('doctor_modal.select_hospital', 'Hastane Seçin') }}
                    </label>
                    <select
                      v-model="selectedHospital"
                      @change="onHospitalChange"
                      class="form-input"
                      :disabled="!hospitals.length"
                    >
                      <option value="">{{ t('doctor_modal.select_hospital_placeholder', 'Hastane seçin...') }}</option>
                      <option v-for="hospital in hospitals" :key="hospital.id" :value="hospital.id">
                        {{ hospital.name }}
                      </option>
                    </select>
                    <p v-if="!hospitals.length" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {{ t('doctor_modal.no_hospitals', 'Bu branşta hastane bulunamadı') }}
                    </p>
                  </div>

                  <!-- Doktor seçimi -->
                  <div v-if="selectedHospital" class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {{ t('doctor_modal.select_doctor', 'Doktor Seçin') }}
                    </label>
                    <select
                      v-model="selectedDoctor"
                      class="form-input"
                      :disabled="!doctors.length"
                    >
                      <option value="">{{ t('doctor_modal.select_doctor_placeholder', 'Doktor seçin...') }}</option>
                      <option v-for="doctor in doctors" :key="doctor.id" :value="doctor.id">
                        {{ doctor.name }}
                      </option>
                    </select>
                    <p v-if="!doctors.length" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {{ t('doctor_modal.no_doctors', 'Bu hastane ve branşta doktor bulunamadı') }}
                    </p>
                  </div>

                  <!-- Not -->
                  <div v-if="selectedDoctor" class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {{ t('doctor_modal.note', 'Not') }}
                    </label>
                    <textarea
                      v-model="assignmentNote"
                      rows="3"
                      class="form-input"
                      :placeholder="t('doctor_modal.assignment_note_placeholder', 'Atama notu girin...')"
                    ></textarea>
                  </div>

                  <!-- Kaydet butonu -->
                  <div v-if="selectedDoctor" class="flex justify-end">
                    <button
                      @click="assignDoctor"
                      :disabled="savingAssignment"
                      class="btn-primary"
                    >
                      {{ savingAssignment ? t('doctor_modal.saving', 'Kaydediliyor...') : t('doctor_modal.assign_button', 'Doktor Ata') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button
            @click="close"
            class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-600 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 sm:mt-0 sm:w-auto"
          >
            {{ t('notes_modal.close', 'Kapat') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLanguage } from '~/composables/useLanguage'

const { t } = useLanguage()

const props = defineProps({
  show: Boolean,
  customer: Object
})

const emit = defineEmits(['close', 'assigned'])

const api = useApi()
const { isDoctor } = usePermissions()

// State
const loading = ref(false)
const existingAssignment = ref(null)
const doctorComment = ref('')
const updatingComment = ref(false)

// Form state
const selectedBranch = ref('')
const selectedHospital = ref('')
const selectedDoctor = ref('')
const assignmentNote = ref('')
const savingAssignment = ref(false)

// Lists
const branches = ref([])
const hospitals = ref([])
const doctors = ref([])

// Load existing assignment
const loadExistingAssignment = async () => {
  if (!props.customer?.id) return

  loading.value = true
  try {
    const response = await api(`/customer2doctor/customer/${props.customer.id}`)
    console.log('Existing assignment response:', response)

    // Handle different response formats
    let assignment = null
    if (Array.isArray(response) && response.length > 0) {
      assignment = response[0]
    } else if (response && !Array.isArray(response)) {
      assignment = response
    }

    if (assignment) {
      existingAssignment.value = assignment
      doctorComment.value = assignment.doctorComment || ''

      // Try to load doctor details if not included or if hospital/branch relations are missing
      if (assignment.doctorId && (!assignment.doctor || !assignment.doctor.branch || !assignment.doctor.doctor2Hospitals)) {
        try {
          const doctorDetails = await api(`/doctors/${assignment.doctorId}`)
          existingAssignment.value.doctor = doctorDetails
          console.log('Loaded doctor details from /doctors endpoint:', doctorDetails)
        } catch (err) {
          console.error('Error loading doctor details:', err)
        }
      }
    }
  } catch (error) {
    console.error('Error loading existing assignment:', error)
    existingAssignment.value = null
  } finally {
    loading.value = false
  }
}

// Load branches
const loadBranches = async () => {
  try {
    // Load all branches with high limit
    const response = await api('/branches?limit=5000&page=1')
    console.log('Branches response:', response)

    // Handle different response structures
    if (response && response.data && Array.isArray(response.data)) {
      branches.value = response.data
    } else if (Array.isArray(response)) {
      branches.value = response
    } else {
      console.warn('Unexpected branches response structure:', response)
      branches.value = []
    }

    console.log('Loaded branches:', branches.value)
  } catch (error) {
    console.error('Error loading branches:', error)
    branches.value = []
  }
}

// Update doctor comment
const updateDoctorComment = async () => {
  if (!existingAssignment.value?.id) return

  updatingComment.value = true
  try {
    await api(`/customer2doctor/${existingAssignment.value.id}`, {
      method: 'PATCH',
      body: {
        doctorComment: doctorComment.value
      }
    })
    existingAssignment.value.doctorComment = doctorComment.value
    alert(t('doctor_modal.comment_updated', 'Doktor yorumu güncellendi'))
  } catch (error) {
    console.error('Error updating doctor comment:', error)
    alert(t('doctor_modal.comment_update_error', 'Yorum güncellenirken hata oluştu'))
  } finally {
    updatingComment.value = false
  }
}

// Branch change handler
const onBranchChange = async () => {
  selectedHospital.value = ''
  selectedDoctor.value = ''
  hospitals.value = []
  doctors.value = []

  if (!selectedBranch.value) return

  try {
    // Simply fetch all hospitals - filtering will be done when selecting doctors
    const allHospitals = await api('/hospitals?limit=5000&page=1')
    console.log('Hospitals response:', allHospitals)

    // Handle different response structures
    if (allHospitals && allHospitals.data && Array.isArray(allHospitals.data)) {
      hospitals.value = allHospitals.data
    } else if (Array.isArray(allHospitals)) {
      hospitals.value = allHospitals
    } else {
      console.warn('Unexpected hospitals response structure:', allHospitals)
      hospitals.value = []
    }

    console.log('Loaded hospitals:', hospitals.value)
  } catch (error) {
    console.error('Error loading hospitals:', error)
    hospitals.value = []
  }
}

// Hospital change handler
const onHospitalChange = async () => {
  selectedDoctor.value = ''
  doctors.value = []

  if (!selectedHospital.value || !selectedBranch.value) return

  try {
    const response = await api(`/doctors/by-hospital-and-branch?hospitalId=${selectedHospital.value}&branchId=${selectedBranch.value}`)
    console.log('Doctors response:', response)

    // Handle different response structures
    if (Array.isArray(response)) {
      doctors.value = response
    } else if (response && response.data && Array.isArray(response.data)) {
      doctors.value = response.data
    } else {
      console.warn('Unexpected doctors response structure:', response)
      doctors.value = []
    }

    console.log('Loaded doctors:', doctors.value)
  } catch (error) {
    console.error('Error loading doctors:', error)
    alert(t('doctor_modal.doctors_load_error', 'Doktorlar yüklenirken hata oluştu. Lütfen backend\'deki /doctors/by-hospital-and-branch endpoint\'ini kontrol edin.'))
    doctors.value = []
  }
}

// Assign doctor
const assignDoctor = async () => {
  if (!selectedDoctor.value || !props.customer?.id) return

  savingAssignment.value = true
  try {
    const response = await api('/customer2doctor', {
      method: 'POST',
      body: {
        doctorId: selectedDoctor.value,
        customerId: props.customer.id,
        note: assignmentNote.value,
        doctorComment: ''
      }
    })

    alert(t('doctor_modal.assignment_success', 'Doktor ataması başarıyla yapıldı'))
    emit('assigned', response)

    // Reset form
    selectedBranch.value = ''
    selectedHospital.value = ''
    selectedDoctor.value = ''
    assignmentNote.value = ''
    hospitals.value = []
    doctors.value = []

    // Reload existing assignment
    await loadExistingAssignment()
  } catch (error) {
    console.error('Error assigning doctor:', error)
    alert(t('doctor_modal.assignment_error', 'Doktor ataması yapılırken hata oluştu'))
  } finally {
    savingAssignment.value = false
  }
}

// Close modal
const close = () => {
  emit('close')
}

// Watch for modal open
watch(() => props.show, async (newVal) => {
  if (newVal) {
    await Promise.all([
      loadExistingAssignment(),
      loadBranches()
    ])
  } else {
    // Reset state
    existingAssignment.value = null
    doctorComment.value = ''
    selectedBranch.value = ''
    selectedHospital.value = ''
    selectedDoctor.value = ''
    assignmentNote.value = ''
    hospitals.value = []
    doctors.value = []
  }
})
</script>