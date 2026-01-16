<template>
  <div class="proforma-form-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ t(isEditMode ? 'proforma.page_title_edit' : 'proforma.page_title_create') }}
        </h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {{ isEditMode ? formData.proformaNumber : t('proforma.page_subtitle') }}
        </p>
      </div>

      <div class="flex gap-3">
        <button @click="handleCancel" class="btn-secondary">
          {{ t('proforma.button_cancel') }}
        </button>


        <button @click="handleSave" class="btn-primary" :disabled="loading">
          <CheckIcon v-if="!loading" class="w-5 h-5 mr-2" />
          <span>{{ loading ? t('proforma.button_saving') : t(isEditMode ? 'proforma.button_update' :
            'proforma.button_save') }}</span>
        </button>
      </div>
    </div>

    <!-- Form Content -->
    <div class="form-container">

      <!-- Date, Currency & Language -->
      <div class="form-section">
        <div class="section-header">
          <h2 class="section-title">{{ t('proforma.section_basic_info') }}</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label class="form-label">{{ t('proforma.label_date') }} *</label>
            <input v-model="formData.date" type="date" class="form-input" required />
          </div>

          <div>
            <label class="form-label">{{ t('proforma.label_currency') }} *</label>
            <select v-model="formData.currency" @change="handleCurrencyChange" class="form-select">
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="TRY">TRY (₺)</option>
            </select>
          </div>

          <div>
            <label class="form-label">{{ t('proforma.label_language') }} *</label>
            <select v-model="formData.language" @change="handleLanguageChange" class="form-select">
              <option v-for="lang in availableLanguages" :key="lang.code" :value="lang.code">
                {{ lang.code }} {{ lang.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="form-label">{{ t('proforma.label_choose_template', 'Template Tipi') }} *</label>
            <select v-model="formData.templateType" class="form-select">
              <option v-for="temp in availableTemplates" :key="temp.type" :value="temp.type">
                {{ temp.name }}
              </option>
            </select>
          </div>

        </div>
      </div>

      <!-- GENERAL INFORMATION Section -->
      <div class="form-section">
        <div class="section-header">
          <h2 class="section-title">{{ t('proforma.section_general_info') }}</h2>
          <p class="section-description">{{ t('proforma.section_general_info_desc') }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="form-label">{{ t('proforma.label_patient_name') }} *</label>
            <input v-model="formData.patientName" type="text" class="form-input" placeholder="MAİSON NURİ SALİH"
              required />
          </div>

          <!-- Hospital - Autocomplete -->
          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('proforma.label_hospital') }} <span class="text-xs text-gray-500">{{
                t('proforma.label_hospital_optional') }}</span>
            </label>
            <input v-model="hospitalSearch" type="text" class="form-input"
              :placeholder="t('proforma.placeholder_hospital')" @focus="showHospitalDropdown = true"
              @blur="hideHospitalDropdown" />
            <div v-if="showHospitalDropdown && filteredHospitals.length > 0"
              class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
              <button v-for="hospital in filteredHospitals" :key="hospital.id" type="button"
                @mousedown.prevent="selectHospital(hospital)"
                class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-900 dark:text-gray-100">
                {{ hospital.name }}
              </button>
            </div>
            <p v-if="formData.hospital" class="mt-1 text-xs text-green-600 dark:text-green-400">
              {{ t('proforma.selected_marker') }} {{ formData.hospital }}
            </p>
          </div>

          <!-- Physician Name - Autocomplete -->
          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('proforma.label_physician_name') }} <span class="text-xs text-gray-500">{{
                t('proforma.label_hospital_optional') }}</span>
            </label>
            <input v-model="doctorSearch" type="text" class="form-input" :disabled="!hospitalId"
              :placeholder="t('proforma.placeholder_physician')" @focus="showDoctorDropdown = true"
              @blur="hideDoctorDropdown" />
            <div v-if="showDoctorDropdown && filteredDoctorsForSearch.length > 0"
              class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
              <button v-for="doctor in filteredDoctorsForSearch" :key="doctor.id" type="button"
                @mousedown.prevent="selectDoctor(doctor)"
                class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-900 dark:text-gray-100">
                {{ doctor.name }}
              </button>
            </div>
            <p v-if="formData.hospitalId && !formData.physicianName"
              class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {{ filteredDoctors.length }} {{ t('proforma.doctors_available') }}
            </p>
            <p v-if="formData.physicianName" class="mt-1 text-xs text-green-600 dark:text-green-400">
              {{ t('proforma.selected_marker') }} {{ formData.physicianName }}
            </p>
          </div>

          <!-- Physician Department - Autocomplete with language filter -->
          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('proforma.label_physician_department') }} <span class="text-xs text-gray-500">{{
                t('proforma.label_hospital_optional') }}</span>
            </label>
            <input v-model="branchSearch" type="text" class="form-input"
              :placeholder="t('proforma.placeholder_department')" @focus="showBranchDropdownList"
              @blur="hideBranchDropdown" />
            <div v-if="showBranchDropdown && filteredBranchForSearch.length > 0"
              class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
              <button v-for="branch in filteredBranchForSearch" :key="branch.id" type="button"
                @mousedown.prevent="selectBranch(branch)"
                class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-900 dark:text-gray-100">
                {{ getBranchName(branch) }}
              </button>
            </div>
            <p v-if="formData.physicianDepartment" class="mt-1 text-xs text-green-600 dark:text-green-400">
              {{ t('proforma.selected_marker') }} {{ formData.physicianDepartment }}
            </p>
          </div>

          <div>
            <label class="form-label">{{ t('proforma.label_age') }}</label>
            <input v-model="formData.age" type="text" class="form-input" :placeholder="t('proforma.placeholder_age')" />
          </div>

          <div>
            <label class="form-label">{{ t('proforma.label_country') }}</label>
            <input v-model="formData.country" type="text" class="form-input"
              :placeholder="t('proforma.placeholder_country')" />
          </div>

          <div>
            <label class="form-label">{{ t('proforma.label_comed_no') }}</label>
            <input v-model="formData.comedNo" type="text" class="form-input" placeholder="15837004" />
          </div>
        </div>
      </div>

      <!-- PHYSICIAN'S OPINION (Optional) -->
      <div class="form-section">
        <div class="section-header">
          <h2 class="section-title">{{ t('proforma.section_physician_opinion') }}</h2>
          <p class="section-description">{{ t('proforma.section_physician_opinion_desc') }}</p>
        </div>

        <div>
          <textarea v-model="formData.physicianOpinion" class="form-textarea" rows="6"
            :placeholder="t('proforma.placeholder_physician_opinion')"></textarea>
        </div>
      </div>

      <!-- TREATMENT DETAILS Section -->



      <div class="form-section">
        <div class="section-header">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="section-title">{{ t('proforma.section_treatment_details') }}</h2>
              <p class="section-description">{{ t('proforma.section_treatment_details_desc') }}</p>
            </div>

            <button @click="addTreatmentItem" class="btn-secondary">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              {{ t('proforma.button_add_treatment') }}
            </button>
          </div>
        </div>

        <div class="treatment-items-container">
          <div v-for="(item, index) in formData.treatmentItems" :key="item.id || index" class="treatment-item-card">
            <div class="flex justify-between items-start mb-4">
              <h3 class="font-medium text-gray-900 dark:text-white">
                {{ t('proforma.treatment_procedure_title') }} #{{ Number(index) + 1 }}
              </h3>
              <button @click="removeTreatmentItem(Number(index))" class="text-red-600 hover:text-red-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- ✅ SADECE İstinye-Blue için özel layout -->
            <div v-if="formData.templateType === 'istinye-blue'" class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- İstinye Blue: Unit Price, Quantity, Total yapısı -->
              <div class="md:col-span-3">
                <label class="form-label">{{ t('proforma.label_procedure') }} *</label>
                <input v-model="item.procedure" type="text" class="form-input"
                  :placeholder="t('proforma.placeholder_procedure')" required />
              </div>

              <div class="md:col-span-3">
                <label class="form-label">{{ t('proforma.label_visit_type') }} *</label>
                <input v-model="item.visitType" type="text" class="form-input"
                  :placeholder="t('proforma.placeholder_visit_type')" required />
              </div>

              <div>
                <label class="form-label">{{ t('proforma.label_unit_price', 'Birim Fiyat') }} *</label>
                <div class="relative">
                  <input v-model="item.estimatedCost" type="text" class="form-input pr-16" placeholder="750.00"
                    @input="handleEstimatedCostChange(Number(index))" required />
                  <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                    {{ formData.currency }}
                  </span>
                </div>
              </div>

              <div>
                <label class="form-label">{{ t('proforma.label_quantity', 'Adet') }} *</label>
                <input v-model.number="item.quantity" type="number" min="1" step="1" class="form-input" placeholder="1"
                  @input="handleEstimatedCostChange(Number(index))" required />
              </div>

              <div>
                <label class="form-label">{{ t('proforma.label_total', 'Toplam') }}</label>
                <div class="relative">
                  <input :value="calculateItemTotal(item)" type="text"
                    class="form-input pr-16 bg-gray-100 dark:bg-gray-900" readonly />
                  <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                    {{ formData.currency }}
                  </span>
                </div>
              </div>

              <div class="md:col-span-3">
                <label class="form-label">{{ t('proforma.label_notes') }}</label>
                <input v-model="item.notes" type="text" class="form-input"
                  :placeholder="t('proforma.placeholder_notes')" />
              </div>
            </div>

            <!-- ✅ Liv-Blue ve Medical-Red için standart layout (quantity YOK) -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="form-label">{{ t('proforma.label_procedure') }} *</label>
                <input v-model="item.procedure" type="text" class="form-input"
                  :placeholder="t('proforma.placeholder_procedure')" required />
              </div>

              <div>
                <label class="form-label">{{ t('proforma.label_visit_type') }} *</label>
                <input v-model="item.visitType" type="text" class="form-input"
                  :placeholder="t('proforma.placeholder_visit_type')" required />
              </div>

              <div>
                <label class="form-label">{{ t('proforma.label_estimated_cost') }} *</label>
                <div class="relative">
                  <input v-model="item.estimatedCost" type="text" class="form-input pr-16"
                    :placeholder="t('proforma.placeholder_estimated_cost')"
                    @input="handleEstimatedCostChange(Number(index))" required />
                  <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                    {{ formData.currency }}
                  </span>
                </div>
              </div>

              <div>
                <label class="form-label">{{ t('proforma.label_notes') }}</label>
                <input v-model="item.notes" type="text" class="form-input"
                  :placeholder="t('proforma.placeholder_notes')" />
              </div>
            </div>
          </div>

          <div v-if="formData.treatmentItems.length === 0" class="empty-treatments">
            <svg class="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="text-gray-600 dark:text-gray-400">
              {{ t('proforma.empty_treatments') }}
            </p>
          </div>
        </div>

        <!-- Grand Total with Auto-Calculate -->
        <div class="grand-total-section">
          <div class="grand-total-row">
            <span class="grand-total-label">{{ t('proforma.label_grand_total').toUpperCase() }}:</span>
            <div class="flex items-center gap-3">
              <button v-if="!manualGrandTotal" @click="calculateGrandTotal"
                class="p-2 rounded-lg text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-900/20"
                title="Otomatik Hesapla">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </button>
              <input v-model.number="formData.grandTotal" type="number" min="0" step="0.01" class="form-input w-48"
                @input="manualGrandTotal = true" required />
              <span class="text-lg font-bold text-gray-900 dark:text-white">{{ formData.currency }}</span>
              <span v-if="calculatedTotal !== formData.grandTotal && manualGrandTotal" class="text-xs text-rose-600">
                ({{ t('proforma.label_estimated_cost') }}: {{ formatCurrency(calculatedTotal, formData.currency) }})
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Services Included (Optional) -->
      <div class="form-section">
        <div class="section-header">
          <h2 class="section-title">{{ t('proforma.section_services_included') }}</h2>
          <p class="section-description">{{ t('proforma.section_services_included_desc') }}</p>
        </div>

        <div>
          <textarea v-model="servicesText" class="form-textarea" rows="6"
            :placeholder="t('proforma.placeholder_services')"></textarea>
          <p class="text-xs text-gray-500 mt-2">{{ t('proforma.services_note') }}</p>
        </div>
      </div>

      <!-- BANK INFORMATION Section - Readonly with Lock -->
      <div class="form-section">
        <div class="section-header">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="section-title">{{ t('proforma.section_bank_info') }} – {{ formData.currency }}</h2>
              <p class="section-description">{{ t('proforma.section_bank_info_desc') }}</p>
            </div>

            <button @click="bankFieldsUnlocked = !bankFieldsUnlocked" class="btn-icon-lg"
              :class="bankFieldsUnlocked ? 'text-green-600' : 'text-gray-600'">
              <svg v-if="bankFieldsUnlocked" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span class="ml-2 text-sm font-medium">
                {{ t(bankFieldsUnlocked ? 'proforma.button_lock' : 'proforma.button_unlock') }}
              </span>
            </button>
          </div>
        </div>

        <div class="bank-info-grid">
          <div>
            <label class="form-label">{{ t('proforma.label_bank_name') }}</label>
            <input v-model="formData.bankName" type="text" class="form-input" :readonly="!bankFieldsUnlocked"
              :class="{ 'bg-gray-100 dark:bg-gray-900': !bankFieldsUnlocked }" />
          </div>

          <div>
            <label class="form-label">{{ t('proforma.label_receiver_name') }}</label>
            <input v-model="formData.receiverName" type="text" class="form-input" :readonly="!bankFieldsUnlocked"
              :class="{ 'bg-gray-100 dark:bg-gray-900': !bankFieldsUnlocked }" />
          </div>

          <div>
            <label class="form-label">{{ t('proforma.label_branch_name') }}</label>
            <input v-model="formData.branchName" type="text" class="form-input" :readonly="!bankFieldsUnlocked"
              :class="{ 'bg-gray-100 dark:bg-gray-900': !bankFieldsUnlocked }" />
          </div>

          <div>
            <label class="form-label">{{ t('proforma.label_branch_code') }}</label>
            <input v-model="formData.branchCode" type="text" class="form-input" :readonly="!bankFieldsUnlocked"
              :class="{ 'bg-gray-100 dark:bg-gray-900': !bankFieldsUnlocked }" />
          </div>

          <div>
            <label class="form-label">{{ t('proforma.label_currency') }}</label>
            <input v-model="formData.bankCurrency" type="text" class="form-input" :readonly="!bankFieldsUnlocked"
              :class="{ 'bg-gray-100 dark:bg-gray-900': !bankFieldsUnlocked }" />
          </div>

          <!-- Bank Information Section'ında IBAN alanına ekle -->
          <div>
            <label class="form-label">
              {{ t('proforma.label_iban') }}
              <span v-if="formData.hospitalId" class="ml-2 text-xs text-green-600 dark:text-green-400">
                ✓ {{ formData.hospital }} - {{ formData.currency }}
              </span>
            </label>
            <input v-model="formData.iban" type="text" class="form-input font-mono" :readonly="!bankFieldsUnlocked"
              :class="{
                'bg-gray-100 dark:bg-gray-900': !bankFieldsUnlocked,
                'border-green-500 dark:border-green-400': formData.hospitalId && formData.iban
              }" />
            <p v-if="formData.hospitalId && formData.iban" class="mt-1 text-xs text-gray-500">
              {{ t('proforma.iban_auto_set', 'IBAN otomatik olarak seçildi') }}
            </p>
          </div>

          <div>
            <label class="form-label">{{ t('proforma.label_swift') }}</label>
            <input v-model="formData.swiftCode" type="text" class="form-input font-mono" :readonly="!bankFieldsUnlocked"
              :class="{ 'bg-gray-100 dark:bg-gray-900': !bankFieldsUnlocked }" />
          </div>
        </div>
      </div>

      <!-- Hospital Contact Information - Auto-filled from selected hospital -->
      <div class="form-section">
        <div class="section-header">
          <h2 class="section-title">{{ t('proforma.section_hospital_contact') }}</h2>
          <p class="section-description">{{ t('proforma.section_hospital_contact_desc') }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="md:col-span-2">
            <label class="form-label">{{ t('proforma.label_hospital_address') }}</label>
            <textarea v-model="formData.hospitalAddress" class="form-textarea" rows="2"></textarea>
          </div>

          <div>
            <label class="form-label">{{ t('proforma.label_hospital_phone') }}</label>
            <input v-model="formData.hospitalPhone" type="tel" class="form-input" />
          </div>

          <div>
            <label class="form-label">{{ t('proforma.label_hospital_email') }}</label>
            <input v-model="formData.hospitalEmail" type="email" class="form-input" />
          </div>
        </div>
      </div>

      <!-- Download Approval Section (Only for Admin/Doctor) -->
      <div v-if="isEditMode && userCanApproveDownload" class="form-section">
        <div class="section-header">
          <h2 class="section-title">İndirme Onayı</h2>
          <p class="section-description">Bu proforma için indirme izni ver/kaldır</p>
        </div>

        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-700 dark:text-gray-300">
              İndirme Durumu:
              <span :class="formData.downloadApproved ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'">
                {{ formData.downloadApproved ? '✓ Onaylandı' : '✗ Onaylanmadı' }}
              </span>
            </p>
            <p v-if="formData.downloadApproved && formData.approvedAt" class="text-xs text-gray-500 mt-1">
              {{ formatDate(formData.approvedAt) }} tarihinde onaylandı
            </p>
          </div>
          <button v-if="!formData.downloadApproved" @click="handleApproveDownload" class="btn-primary">
            İndirme İznini Onayla
          </button>
          <button v-else @click="handleRevokeDownload" class="btn-secondary text-red-600">
            İndirme İznini İptal Et
          </button>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProformaStore } from '~/stores/proforma';

import {
  EyeIcon,
  CheckIcon
} from '@heroicons/vue/24/outline'

const route = useRoute();
const router = useRouter();
const proformaStore = useProformaStore();
const authStore = useAuthStore()
const { hospitals, fetchHospitals } = useHospitals()
const { fetchDoctors } = useDoctors()
const { branches, fetchBranches } = useBranches()
const { t, currentLanguage, currentLanguageInfo, availableLanguages, setLanguage } = useLanguage()


const $api = useApi()

const loading = ref(false);

const bankFieldsUnlocked = ref(false);
const servicesText = ref('');
const manualGrandTotal = ref(false);

// Autocomplete için state'ler
const hospitalSearch = ref('')
const showHospitalDropdown = ref(false)
const hospitalDoctors = ref([])
const hospitalId = ref(null)

const doctorSearch = ref('')
const showDoctorDropdown = ref(false)

const branchSearch = ref('')
const showBranchDropdown = ref(false)

const isEditMode = computed(() => !!route.params.id);

// ✅ İndirme izni kontrolü - authStore kullanarak
const canDownload = computed(() => {
  if (!authStore.user) return false
  const role = authStore.user.role?.toLowerCase()

  if (role === 'admin' || role === 'doctor') return true
  if (role === 'user') return formData.value.downloadApproved === true

  return false
})

const userCanApproveDownload = computed(() => {
  if (!authStore.user) return false
  const role = authStore.user.role?.toLowerCase()
  return role === 'admin' || role === 'doctor'
})

const formData = ref({
  date: new Date().toISOString().split('T')[0],
  currency: 'USD',
  language: currentLanguage.value,
  templateType: 'liv-blue',

  // General Information
  patientName: '',
  hospitalId: null,
  hospital: '',
  doctorId: null,
  physicianName: '',
  branchId: null,
  physicianDepartment: '',
  age: '',
  country: '',
  comedNo: '',

  // Optional
  additionalInfo: '',
  physicianOpinion: '',

  // Treatment
  treatmentItems: [],
  grandTotal: 0,

  // Bank Information (with defaults)
  bankName: 'DENİZ BANK',
  receiverName: 'Samsun Medikal Grup Özel Sağlık Hizmetleri A.Ş. Vadi Branch',
  branchName: 'AVRUPA KURUMSAL, Istanbul – Turkey',
  branchCode: '3390',
  bankCurrency: 'USD',
  iban: 'TR07 0013 4000 0033 4739 9000 78',
  swiftCode: 'DENITRIS',

  // Hospital Contact
  hospitalAddress: 'Ayazağa Mahallesi, Kemerburgaz Caddesi, Vadistanbul Park Etabı, 7F Blok, 34396 Sarıyer/İstanbul',
  hospitalPhone: '',
  hospitalEmail: '',

  status: 'draft',
  proformaNumber: '',
  downloadApproved: false,
  approvedBy: null,
  approvedAt: null,
}) as any;

const templateTypes = ref([
  { type: 'liv-blue', name: 'Liv - Mavi' },
  { type: 'medical-red', name: 'Medikal - Kırmızı' },
  { type: 'istinye-blue', name: 'İstinye Dental - Mavi' },
])

const availableTemplates = computed(() => {
  return templateTypes.value
});


// ✅ Helper Functions
const formatCurrency = (amount: number, currency: string): string => {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    TRY: '₺'
  }

  return `${symbols[currency] || currency} ${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
}

const formatDate = (dateString: string | Date): string => {
  if (!dateString) return ''

  const date = new Date(dateString)
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}



// Calculated Grand Total
const calculatedTotal = computed(() => {
  return formData.value.treatmentItems.reduce((sum: number, item: any) => {
    const unitPrice = parseEstimatedCost(item.estimatedCost);

    // ✅ Sadece istinye-blue'da quantity kullan
    if (formData.value.templateType === 'istinye-blue') {
      const quantity = item.quantity || 1;
      return sum + (unitPrice * quantity);
    } else {
      // Liv-blue ve medical-red için direkt cost
      return sum + unitPrice;
    }
  }, 0);
});

const parseEstimatedCost = (costString: string): number => {
  if (!costString) return 0
  const cleaned = costString
    .replace(/[A-Z₺$€£]/gi, '')
    .replace(/\./g, '')
    .replace(/,/g, '.')
    .trim()
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}

const calculateGrandTotal = () => {
  formData.value.grandTotal = calculatedTotal.value
  manualGrandTotal.value = false
}

const handleEstimatedCostChange = (index: number) => {
  if (!manualGrandTotal.value) {
    calculateGrandTotal()
  }
}

const handleCurrencyChange = () => {
  // ✅ IBAN'ı güncelle
  updateBankInfo()

  // Treatment costs'ları formatla
  formData.value.treatmentItems.forEach((item: any) => {
    if (item.estimatedCost) {
      const numericValue = parseEstimatedCost(item.estimatedCost)
      item.estimatedCost = `${numericValue.toLocaleString()}`
    }
  })

  // Grand total'i yeniden hesapla
  if (!manualGrandTotal.value) {
    calculateGrandTotal()
  }
}

// ✅ Dil değiştiğinde branşları yeniden yükle
const handleLanguageChange = async () => {
  setLanguage(formData.value.language)

  // Branşları seçilen dile göre yeniden yükle
  try {

    await fetchBranches({
      limit: 1000,
      languageId: currentLanguageInfo.value?.id
    })

    console.log(`✅ Branşlar ${formData.value.language} diline göre yüklendi`)
  } catch (err) {
    console.error('Failed to reload branches for language:', err)
  }
}

// ✅ Branş adını seçilen dile göre getir
const getBranchName = (branch: any) => {
  // Eğer branch.name zaten doğru dil ile geliyorsa direkt kullan
  if (branch.name) {
    return branch.name
  }

  // Fallback: translations array'inden bul
  if (branch.translations && Array.isArray(branch.translations)) {
    const languageIdMap: Record<string, number> = {
      'tr': 1,
      'en': 2,
    }

    const targetLanguageId = languageIdMap[formData.value.language] || 1
    const translation = branch.translations.find((t: any) => t.languageId === targetLanguageId)

    if (translation && translation.name) {
      return translation.name
    }
  }

  // Final fallback: code kullan
  return branch.code || 'N/A'
}

const filteredBranch = computed(() => {
  return branches.value
})

const filteredBranchForSearch = computed(() => {
  const baseBranch = filteredBranch.value

  if (!branchSearch.value) {
    return baseBranch
  }

  const search = branchSearch.value.toLowerCase()
  return baseBranch.filter((branch: any) => {
    const name = getBranchName(branch).toLowerCase()
    return name.includes(search)
  })
})

// ✅ Dil değiştiğinde branşları otomatik yeniden yükle (watch ile)
watch(() => formData.value.language, async (newLanguage, oldLanguage) => {
  if (newLanguage && newLanguage !== oldLanguage) {
    await handleLanguageChange()
  }
})

watch(() => currentLanguage.value, async (newLanguage, oldLanguage) => {
  if (newLanguage && newLanguage !== oldLanguage) {
    formData.value.language = newLanguage
  }
})



onMounted(async () => {
  if (isEditMode.value) {
    loading.value = true;
    const proforma = await proformaStore.fetchProforma(Number(route.params.id)) as any;
    if (proforma) {
      Object.assign(formData.value, proforma);

      if (proforma.language) {
        setLanguage(proforma.language)
      }

      if (proforma.hospital) {
        hospitalSearch.value = proforma.hospital;
        hospitalId.value = proforma.hospitalId;
        updateBankInfo()
      }
      
      if (proforma.physicianName) {
        doctorSearch.value = proforma.physicianName;
      }
      
      if (proforma.physicianDepartment) {
        branchSearch.value = proforma.physicianDepartment;
      }

      if (proforma.servicesIncluded && Array.isArray(proforma.servicesIncluded)) {
        servicesText.value = proforma.servicesIncluded.join('\n');
      }

      // ✅ YENİ: İstinye-blue template'i için quantity field'ı ekle
      if (formData.value.templateType === 'istinye-blue' && formData.value.treatmentItems) {
        formData.value.treatmentItems = formData.value.treatmentItems.map((item: any) => {
          // Eğer quantity yoksa, default olarak 1 ekle
          if (!item.quantity || item.quantity === undefined) {
            return { ...item, quantity: 1 };
          }
          return item;
        });
      }

      if (proforma.hospitalId) {
        try {
          const response = await $api(`/hospitals/${proforma.hospitalId}/doctors`) as any
          hospitalDoctors.value = Array.isArray(response) ? response : (response.data || [])
        } catch (err) {
          console.error('Failed to fetch hospital doctors:', err)
        }
      }
    }
    loading.value = false;
  } else {
    // Yeni proforma oluşturulurken default olarak LİV VADİ bilgilerini set et
    updateBankInfo()
  }

  try {
    const languageIdMap: Record<string, number> = {
      'tr': 1,
      'en': 2,
    }

    const initialLanguageId = languageIdMap[formData.value.language] || 1

    await Promise.all([
      fetchHospitals({ limit: 1000 }),
      fetchDoctors({ limit: 1000 }),
      fetchBranches({ limit: 1000, languageId: initialLanguageId }),
    ])

    console.log(`✅ İlk yükleme: Branşlar ${formData.value.language} diline göre yüklendi`)
  } catch (err) {
    console.error('Failed to initialize form:', err)
  }
})



const filteredHospitals = computed(() => {
  if (!hospitalSearch.value) {
    return hospitals.value
  }
  const search = hospitalSearch.value.toLowerCase()
  return hospitals.value.filter(hospital =>
    hospital.name.toLowerCase().includes(search)
  )
})



// ✅ IBAN ve Banka Bilgileri Mapping
const bankInfoMapping: Record<string, {
  bankName: string
  receiverName: string
  branchName: string
  branchCode: string
  swiftCode: string
  ibans: {
    USD: string
    EUR: string
    TRY: string
  }
}> = {
  // LİV VADİ
  'liv': {
    bankName: 'AKBANK',
    receiverName: 'MLP Sağlık Hizmetleri',
    branchName: 'PLAZA KURUMSAL',
    branchCode: '1123',
    swiftCode: 'AKBKTRISXXX',
    ibans: {
      USD: 'TR07 0013 4000 0033 4739 9000 78',
      EUR: 'TR88 0013 4000 0033 4739 9000 75',
      TRY: 'TR18 0013 4000 0333 4739 9000 74'
    }
  },
  // LİV ULUS
  'ulus': {
    bankName: 'DENİZ BANK',
    receiverName: 'Samsun Medikal Grup Özel Sağlık Hizmetleri A.Ş. Vadi Branch',
    branchName: 'AVRUPA KURUMSAL Istanbul - Turkey',
    branchCode: '3390',
    swiftCode: 'DENITRIS',
    ibans: {
      USD: 'TR79 0004 6011 2300 1000 0121 08',
      EUR: 'TR36 0013 4000 0024 5965 7012 19',
      TRY: 'TR14 0004 6011 2388 8000 1476 32'
    }
  }
}

// ✅ Hastane adından key çıkar
const getHospitalKey = (hospitalName: string): string => {
  if (!hospitalName) return ''

  const name = hospitalName.toLowerCase()

  if (name.includes('vadi') || name.includes('vadistanbul')) {
    return 'liv'
  }

  if (name.includes('ulus')) {
    return 'ulus'
  }

  // Default: LİV VADİ
  return 'liv'
}

// ✅ IBAN ve banka bilgilerini güncelle
const updateBankInfo = () => {
  const hospitalKey = getHospitalKey(formData.value.hospital)
  const bankInfo = bankInfoMapping[hospitalKey]

  if (!bankInfo) {
    console.warn('Hospital bank info not found:', formData.value.hospital)
    return
  }

  // Currency'yi normalize et (TRY yerine TL gelebilir)
  const currency = formData.value.currency === 'TRY' ? 'TRY' : formData.value.currency

  // Banka bilgilerini set et
  formData.value.bankName = bankInfo.bankName
  formData.value.receiverName = bankInfo.receiverName
  formData.value.branchName = bankInfo.branchName
  formData.value.branchCode = bankInfo.branchCode
  formData.value.swiftCode = bankInfo.swiftCode
  formData.value.bankCurrency = currency

  // IBAN'ı currency'e göre set et
  const iban = bankInfo.ibans[currency as 'USD' | 'EUR' | 'TRY']

  if (iban) {
    formData.value.iban = iban
    console.log(`✅ IBAN updated: ${currency} - ${iban}`)
  } else {
    console.warn('IBAN not found for currency:', currency)
  }
}

const selectHospital = async (hospital: any) => {
  formData.value.hospitalId = hospital.id
  formData.value.hospital = hospital.name
  hospitalId.value = hospital.id
  hospitalSearch.value = hospital.name
  showHospitalDropdown.value = false

  // Hospital contact bilgilerini set et
  if (hospital.address) {
    formData.value.hospitalAddress = hospital.address
  }
  if (hospital.phone) {
    formData.value.hospitalPhone = hospital.phone
  }
  if (hospital.email) {
    formData.value.hospitalEmail = hospital.email
  }

  // ✅ Banka bilgilerini ve IBAN'ı güncelle
  updateBankInfo()

  // Doktorları yükle
  try {
    const response = await $api(`/hospitals/${hospital.id}/doctors`) as any
    hospitalDoctors.value = Array.isArray(response) ? response : (response.data || [])
  } catch (err) {
    console.error('Failed to fetch hospital doctors:', err)
    hospitalDoctors.value = []
  }
}

const hideHospitalDropdown = () => {
  setTimeout(() => {
    showHospitalDropdown.value = false
  }, 200)
}

const filteredDoctors = computed(() => {
  return hospitalDoctors.value
})

const filteredDoctorsForSearch = computed(() => {
  const baseDoctors = filteredDoctors.value as any

  if (!doctorSearch.value) {
    return baseDoctors
  }

  const search = doctorSearch.value.toLowerCase()
  return baseDoctors.filter((doctor: any) =>
    doctor.name.toLowerCase().includes(search)
  )
}) as any

const selectDoctor = (doctor: any) => {
  formData.value.doctorId = doctor.id
  formData.value.physicianName = doctor.name
  doctorSearch.value = doctor.name
  showDoctorDropdown.value = false
}

const hideDoctorDropdown = () => {
  setTimeout(() => {
    showDoctorDropdown.value = false
  }, 200)
}

const selectBranch = (item: any) => {
  formData.value.branchId = item.id
  formData.value.physicianDepartment = getBranchName(item)
  branchSearch.value = getBranchName(item)
  showBranchDropdown.value = false
}

const showBranchDropdownList = () => {
  showBranchDropdown.value = true
}

const hideBranchDropdown = () => {
  setTimeout(() => {
    showBranchDropdown.value = false
  }, 200)
}

const addTreatmentItem = () => {
  const newItem: any = {
    id: `temp-${Date.now()}`,
    procedure: '',
    visitType: '', // ✅ Tüm template'lerde var
    estimatedCost: 0,
    notes: '',
  };

  // ✅ SADECE istinye-blue için quantity ekle
  if (formData.value.templateType === 'istinye-blue') {
    newItem.quantity = 1; // Default quantity
  }

  formData.value.treatmentItems.push(newItem);
};

// ✅ Item total hesaplama (sadece istinye-blue için kullanılacak):
const calculateItemTotal = (item: any): string => {
  const unitPrice = parseEstimatedCost(item.estimatedCost);
  const quantity = item.quantity || 1;
  const total = unitPrice * quantity;

  return total.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const removeTreatmentItem = (index: number) => {
  formData.value.treatmentItems.splice(index, 1);
  if (!manualGrandTotal.value) {
    calculateGrandTotal()
  }
};

const handleSave = async () => {
  if (!formData.value.patientName || formData.value.patientName.trim() === '') {
    alert(t('proforma.validation_patient_name_required'));
    return;
  }

  if (formData.value.treatmentItems.length === 0) {
    alert(t('proforma.validation_treatment_required'));
    return;
  }

  if (!formData.value.grandTotal || formData.value.grandTotal <= 0) {
    alert(t('proforma.validation_grand_total_required'));
    return;
  }

  loading.value = true;

  const servicesIncluded = servicesText.value
    .split('\n')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  const dataToSave = {
    ...formData.value,
    servicesIncluded: servicesIncluded.length > 0 ? servicesIncluded : null,
  };

  let result;
  if (isEditMode.value) {
    result = await proformaStore.updateProforma(Number(route.params.id), dataToSave);
  } else {
    result = await proformaStore.createProforma(dataToSave);
  }

  loading.value = false;

  if (result) {
    router.push('/proforma/list');
  }
};

const handleCancel = () => {
  if (confirm(t('proforma.confirm_cancel'))) {
    router.push('/proforma/list');
  }
};



const handleApproveDownload = async () => {
  if (!confirm('Bu proforma için indirme iznini onaylamak istediğinizden emin misiniz?')) {
    return
  }

  try {
    await $api(`/proformas/${route.params.id}/approve-download`, {
      method: 'PATCH'
    })

    const proforma = await proformaStore.fetchProforma(Number(route.params.id)) as any
    Object.assign(formData.value, proforma)

    alert('İndirme izni başarıyla onaylandı')
  } catch (err) {
    console.error('Failed to approve download:', err)
    alert('İndirme izni onaylanırken hata oluştu')
  }
}

const handleRevokeDownload = async () => {
  if (!confirm('Bu proforma için indirme iznini iptal etmek istediğinizden emin misiniz?')) {
    return
  }

  try {
    await $api(`/proformas/${route.params.id}/revoke-download`, {
      method: 'PATCH'
    })

    const proforma = await proformaStore.fetchProforma(Number(route.params.id)) as any
    Object.assign(formData.value, proforma)

    alert('İndirme izni başarıyla iptal edildi')
  } catch (err) {
    console.error('Failed to revoke download:', err)
    alert('İndirme izni iptal edilirken hata oluştu')
  }
}
</script>

<style scoped>
.proforma-form-page {
  @apply p-6;
}

.page-header {
  @apply flex justify-between items-start mb-6;
}

.form-container {
  @apply space-y-6;
  @apply max-w-[1000px];
  @apply mx-auto;
}

.form-section {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6;
}

.section-header {
  @apply mb-6 pb-4 border-b border-gray-200 dark:border-gray-700;
}

.section-title {
  @apply text-lg font-semibold text-gray-900 dark:text-white;
}

.section-description {
  @apply text-sm text-gray-600 dark:text-gray-400 mt-1;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1;
}

.form-input,
.form-select,
.form-textarea {
  @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white;
}

.treatment-items-container {
  @apply space-y-4;
}

.treatment-item-card {
  @apply bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700;
}

.empty-treatments {
  @apply text-center py-12;
}

.grand-total-section {
  @apply mt-6 p-6 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border-2 border-cyan-600;
}

.grand-total-row {
  @apply flex justify-between items-center;
}

.grand-total-label {
  @apply text-2xl font-bold text-cyan-600 dark:text-cyan-400;
}

.bank-info-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-4;
}

.btn-primary {
  @apply inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600;
}

.btn-icon-lg {
  @apply inline-flex items-center px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors;
}

.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4;
}

.modal-content {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col;
}

.modal-header {
  @apply flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700;
}

.modal-body {
  @apply flex-1 overflow-hidden;
}
</style>