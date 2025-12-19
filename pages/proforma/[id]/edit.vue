<template>
  <div class="proforma-form-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ isEditMode ? 'Proforma Düzenle' : 'Yeni Proforma Oluştur' }}
        </h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {{ isEditMode ? formData.proformaNumber : 'LIV Hospital proforma faturası bilgilerini girin' }}
        </p>
      </div>
      
      <div class="flex gap-3">
        <button @click="handleCancel" class="btn-secondary">
          İptal
        </button>
        
        <button @click="handlePreview" class="btn-secondary" v-if="isEditMode && canDownload">
          <EyeIcon class="w-5 h-5 mr-2" />
          Önizleme
        </button>
        
        <button @click="handleSave" class="btn-primary" :disabled="loading">
          <CheckIcon v-if="!loading" class="w-5 h-5 mr-2" />
          <span v-if="loading">Kaydediliyor...</span>
          <span v-else>{{ isEditMode ? 'Güncelle' : 'Kaydet' }}</span>
        </button>
      </div>
    </div>

    <!-- Form Content -->
    <div class="form-container">
      
      <!-- Date, Currency & Language -->
      <div class="form-section">
        <div class="section-header">
          <h2 class="section-title">Temel Bilgiler</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="form-label">Tarih *</label>
            <input v-model="formData.date" type="date" class="form-input" required />
          </div>

          <div>
            <label class="form-label">Para Birimi *</label>
            <select v-model="formData.currency" @change="handleCurrencyChange" class="form-select">
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="TRY">TRY (₺)</option>
            </select>
          </div>

          <div>
            <label class="form-label">Proforma Dili *</label>
            <select v-model="formData.language" class="form-select">
              <option value="tr">🇹🇷 Türkçe</option>
              <option value="en">🇬🇧 English</option>
            </select>
          </div>
        </div>
      </div>

      <!-- GENERAL INFORMATION Section -->
      <div class="form-section">
        <div class="section-header">
          <h2 class="section-title">Genel Bilgiler</h2>
          <p class="section-description">Hasta ve doktor bilgileri (Opsiyonel alanlar)</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="form-label">Hasta Adı *</label>
            <input v-model="formData.patientName" type="text" class="form-input" placeholder="MAİSON NURİ SALİH" required />
          </div>

          <!-- Hospital - Autocomplete -->
          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Hastane <span class="text-xs text-gray-500">(Opsiyonel)</span>
            </label>
            <input
              v-model="hospitalSearch"
              type="text"
              class="form-input"
              placeholder="Hastane adı yazın veya boş bırakın..."
              @focus="showHospitalDropdown = true"
              @blur="hideHospitalDropdown"
            />
            <div v-if="showHospitalDropdown && filteredHospitals.length > 0" class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
              <button
                v-for="hospital in filteredHospitals"
                :key="hospital.id"
                type="button"
                @mousedown.prevent="selectHospital(hospital)"
                class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-900 dark:text-gray-100"
              >
                {{ hospital.name }}
              </button>
            </div>
            <p v-if="formData.hospital" class="mt-1 text-xs text-green-600 dark:text-green-400">
              ✓ {{ formData.hospital }}
            </p>
          </div>

          <!-- Physician Name - Autocomplete -->
          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Doktor <span class="text-xs text-gray-500">(Opsiyonel)</span>
            </label>
            <input
              v-model="doctorSearch"
              type="text"
              class="form-input"
              :disabled="!hospitalId"
              placeholder="Önce hastane seçin veya boş bırakın..."
              @focus="showDoctorDropdown = true"
              @blur="hideDoctorDropdown"
            />
            <div v-if="showDoctorDropdown && filteredDoctorsForSearch.length > 0" class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
              <button
                v-for="doctor in filteredDoctorsForSearch"
                :key="doctor.id"
                type="button"
                @mousedown.prevent="selectDoctor(doctor)"
                class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-900 dark:text-gray-100"
              >
                {{ doctor.name }}
              </button>
            </div>
            <p v-if="formData.hospitalId && !formData.physicianName" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {{ filteredDoctors.length }} doktor mevcut
            </p>
            <p v-if="formData.physicianName" class="mt-1 text-xs text-green-600 dark:text-green-400">
              ✓ {{ formData.physicianName }}
            </p>
          </div>

          <!-- Physician Department - Autocomplete with language filter -->
          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Doktor Departmanı <span class="text-xs text-gray-500">(Opsiyonel)</span>
            </label>
            <input
              v-model="branchSearch"
              type="text"
              class="form-input"
              placeholder="Branş adı yazın veya boş bırakın..."
              @focus="showBranchDropdownList"
              @blur="hideBranchDropdown"
            />
            <div v-if="showBranchDropdown && filteredBranchForSearch.length > 0" class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
              <button
                v-for="branch in filteredBranchForSearch"
                :key="branch.id"
                type="button"
                @mousedown.prevent="selectBranch(branch)"
                class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-900 dark:text-gray-100"
              >
                {{ getBranchName(branch) }}
              </button>
            </div>
            <p v-if="formData.physicianDepartment" class="mt-1 text-xs text-green-600 dark:text-green-400">
              ✓ {{ formData.physicianDepartment }}
            </p>
          </div>

          <div>
            <label class="form-label">Yaş</label>
            <input v-model="formData.age" type="text" class="form-input" placeholder="79 years" />
          </div>

          <div>
            <label class="form-label">Ülke</label>
            <input v-model="formData.country" type="text" class="form-input" placeholder="Iraq" />
          </div>

          <div>
            <label class="form-label">COMED No</label>
            <input v-model="formData.comedNo" type="text" class="form-input" placeholder="15837004" />
          </div>
        </div>
      </div>

      <!-- PHYSICIAN'S OPINION (Optional) -->
      <div class="form-section">
        <div class="section-header">
          <h2 class="section-title">Doktor Görüşü</h2>
          <p class="section-description">Bu alan opsiyonel</p>
        </div>

        <div>
          <textarea
            v-model="formData.physicianOpinion"
            class="form-textarea"
            rows="6"
            placeholder="Doktorunuzun değerlendirmesinin ardından, belirtileriniz şu şekilde tanımlanmıştır..."
          ></textarea>
        </div>
      </div>

      <!-- TREATMENT DETAILS Section -->
      <div class="form-section">
        <div class="section-header">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="section-title">Önerilen Tedavi ve Tahmini Maliyet Bilgileri</h2>
              <p class="section-description">Tedavi prosedürleri ve maliyet detayları</p>
            </div>
            
            <button @click="addTreatmentItem" class="btn-secondary">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Tedavi Ekle
            </button>
          </div>
        </div>

        <div class="treatment-items-container">
          <div
            v-for="(item, index) in formData.treatmentItems"
            :key="item.id || index"
            class="treatment-item-card"
          >
            <div class="flex justify-between items-start mb-4">
              <h3 class="font-medium text-gray-900 dark:text-white">
                Prosedür #{{ index + 1 }}
              </h3>
              <button @click="removeTreatmentItem(index)" class="text-red-600 hover:text-red-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="form-label">Prosedür *</label>
                <input
                  v-model="item.procedure"
                  type="text"
                  class="form-input"
                  placeholder="Orthopedic Surgery examination"
                  required
                />
              </div>

              <div>
                <label class="form-label">Ziyaret Tipi *</label>
                <input
                  v-model="item.visitType"
                  type="text"
                  class="form-input"
                  placeholder="Consultation service"
                  required
                />
              </div>

              <div>
                <label class="form-label">Tahmini Maliyet *</label>
                <div class="relative">
                  <input
                    v-model="item.estimatedCost"
                    type="text"
                    class="form-input pr-16"
                    placeholder="24.000"
                    @input="handleEstimatedCostChange(index)"
                    required
                  />
                  <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                    {{ formData.currency }}
                  </span>
                </div>
              </div>

              <div>
                <label class="form-label">Notlar</label>
                <input
                  v-model="item.notes"
                  type="text"
                  class="form-input"
                  placeholder="5-7 nights (1 night in ICU)"
                />
              </div>
            </div>
          </div>

          <div v-if="formData.treatmentItems.length === 0" class="empty-treatments">
            <svg class="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="text-gray-600 dark:text-gray-400">
              Henüz tedavi prosedürü eklenmedi. "Tedavi Ekle" butonuna tıklayarak başlayın.
            </p>
          </div>
        </div>

        <!-- Grand Total with Auto-Calculate -->
        <div class="grand-total-section">
          <div class="grand-total-row">
            <span class="grand-total-label">GENEL TOPLAM:</span>
            <div class="flex items-center gap-3">
              <button
                v-if="!manualGrandTotal"
                @click="calculateGrandTotal"
                class="p-2 rounded-lg text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-900/20"
                title="Otomatik Hesapla"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </button>
              <input
                v-model.number="formData.grandTotal"
                type="number"
                min="0"
                step="0.01"
                class="form-input w-48"
                @input="manualGrandTotal = true"
                required
              />
              <span class="text-lg font-bold text-gray-900 dark:text-white">{{ formData.currency }}</span>
              <span v-if="calculatedTotal !== formData.grandTotal && manualGrandTotal" class="text-xs text-amber-600">
                (Hesaplanan: {{ calculatedTotal.toFixed(2) }})
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Services Included (Optional) -->
      <div class="form-section">
        <div class="section-header">
          <h2 class="section-title">Tedavi Planına Dahil Olan Hizmetler</h2>
          <p class="section-description">Dahil edilen servisler (opsiyonel)</p>
        </div>

        <div>
          <textarea
            v-model="servicesText"
            class="form-textarea"
            rows="6"
            placeholder="Her satıra bir servis yazın:
Initial Consultation and Pre-op Assessment
Pre-operative Tests
Anesthesia Services
..."
          ></textarea>
          <p class="text-xs text-gray-500 mt-2">Her satır bir servis olarak kaydedilecek</p>
        </div>
      </div>

      <!-- BANK INFORMATION Section - Readonly with Lock -->
      <div class="form-section">
        <div class="section-header">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="section-title">Banka Hesap Bilgileri – {{ formData.currency }}</h2>
              <p class="section-description">Eksiksiz ve doğru giriniz</p>
            </div>
            
            <button
              @click="bankFieldsUnlocked = !bankFieldsUnlocked"
              class="btn-icon-lg"
              :class="bankFieldsUnlocked ? 'text-green-600' : 'text-gray-600'"
            >
              <svg v-if="bankFieldsUnlocked" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span class="ml-2 text-sm font-medium">
                {{ bankFieldsUnlocked ? 'Kilitle' : 'Kilidi Aç' }}
              </span>
            </button>
          </div>
        </div>

        <div class="bank-info-grid">
          <div>
            <label class="form-label">Banka</label>
            <input
              v-model="formData.bankName"
              type="text"
              class="form-input"
              :readonly="!bankFieldsUnlocked"
              :class="{ 'bg-gray-100 dark:bg-gray-900': !bankFieldsUnlocked }"
            />
          </div>

          <div>
            <label class="form-label">Alıcı Adı</label>
            <input
              v-model="formData.receiverName"
              type="text"
              class="form-input"
              :readonly="!bankFieldsUnlocked"
              :class="{ 'bg-gray-100 dark:bg-gray-900': !bankFieldsUnlocked }"
            />
          </div>

          <div>
            <label class="form-label">Şube Adı</label>
            <input
              v-model="formData.branchName"
              type="text"
              class="form-input"
              :readonly="!bankFieldsUnlocked"
              :class="{ 'bg-gray-100 dark:bg-gray-900': !bankFieldsUnlocked }"
            />
          </div>

          <div>
            <label class="form-label">Şube Kodu</label>
            <input
              v-model="formData.branchCode"
              type="text"
              class="form-input"
              :readonly="!bankFieldsUnlocked"
              :class="{ 'bg-gray-100 dark:bg-gray-900': !bankFieldsUnlocked }"
            />
          </div>

          <div>
            <label class="form-label">Para Birimi</label>
            <input
              v-model="formData.bankCurrency"
              type="text"
              class="form-input"
              :readonly="!bankFieldsUnlocked"
              :class="{ 'bg-gray-100 dark:bg-gray-900': !bankFieldsUnlocked }"
            />
          </div>

          <div>
            <label class="form-label">IBAN No</label>
            <input
              v-model="formData.iban"
              type="text"
              class="form-input font-mono"
              :readonly="!bankFieldsUnlocked"
              :class="{ 'bg-gray-100 dark:bg-gray-900': !bankFieldsUnlocked }"
            />
          </div>

          <div>
            <label class="form-label">SWIFT</label>
            <input
              v-model="formData.swiftCode"
              type="text"
              class="form-input font-mono"
              :readonly="!bankFieldsUnlocked"
              :class="{ 'bg-gray-100 dark:bg-gray-900': !bankFieldsUnlocked }"
            />
          </div>
        </div>
      </div>

      <!-- Hospital Contact Information - Auto-filled from selected hospital -->
      <div class="form-section">
        <div class="section-header">
          <h2 class="section-title">Hastane İletişim Bilgileri</h2>
          <p class="section-description">İletişim bilgileri (opsiyonel)</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="md:col-span-2">
            <label class="form-label">Hastane Adresi</label>
            <textarea
              v-model="formData.hospitalAddress"
              class="form-textarea"
              rows="2"
            ></textarea>
          </div>

          <div>
            <label class="form-label">Hastane Telefon</label>
            <input v-model="formData.hospitalPhone" type="tel" class="form-input" />
          </div>

          <div>
            <label class="form-label">Hastane Email</label>
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
              {{ new Date(formData.approvedAt).toLocaleDateString('tr-TR') }} tarihinde onaylandı
            </p>
          </div>
          <button
            v-if="!formData.downloadApproved"
            @click="handleApproveDownload"
            class="btn-primary"
          >
            İndirme İznini Onayla
          </button>
          <button
            v-else
            @click="handleRevokeDownload"
            class="btn-secondary text-red-600"
          >
            İndirme İznini İptal Et
          </button>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <div v-if="showPreview" class="modal-overlay" @click="showPreview = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="text-lg font-bold">Proforma Önizleme</h3>
          <button @click="showPreview = false" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <iframe v-if="previewUrl" :src="previewUrl" class="w-full h-full border-0"></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProformaStore } from '~/stores/proforma';

import {
  EyeIcon,
  CheckIcon
} from '@heroicons/vue/24/outline'

const route = useRoute();
const router = useRouter();
const proformaStore = useProformaStore();
const { hospitals, fetchHospitals } = useHospitals()
const { fetchDoctors } = useDoctors()
const { branches, fetchBranches } = useBranches()
const { t, currentLanguage, currentLanguageInfo, availableLanguages, setLanguage } = useLanguage()

const $api = useApi()
const currentUser = ref<any>(null)

const loading = ref(false);
const showPreview = ref(false);
const previewUrl = ref('');
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

// İndirme izni kontrolü
const canDownload = computed(() => {
  if (!currentUser.value) return false
  const role = currentUser.value.role?.toLowerCase()
  
  if (role === 'admin' || role === 'doctor') return true
  if (role === 'user') return formData.value.downloadApproved === true
  
  return false
})

const userCanApproveDownload = computed(() => {
  if (!currentUser.value) return false
  const role = currentUser.value.role?.toLowerCase()
  return role === 'admin' || role === 'doctor'
})

const formData = ref({
  date: new Date().toISOString().split('T')[0],
  currency: 'USD',
  language: 'tr',
  
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

// Calculated Grand Total
const calculatedTotal = computed(() => {
  return formData.value.treatmentItems.reduce((sum: number, item: any) => {
    const cost = parseEstimatedCost(item.estimatedCost)
    return sum + cost
  }, 0)
})

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
  formData.value.bankCurrency = formData.value.currency
  
  formData.value.treatmentItems.forEach((item: any) => {
    if (item.estimatedCost) {
      const numericValue = parseEstimatedCost(item.estimatedCost)
      item.estimatedCost = `${numericValue.toLocaleString()}`
    }
  })
  
  if (!manualGrandTotal.value) {
    calculateGrandTotal()
  }
}

const getBranchName = (branch: any) => {
  if (formData.value.language === 'en' && branch.nameEn) {
    return branch.nameEn
  }
  return branch.name
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




// Sadece değiştirilen kısımlar:

// 1️⃣ onMounted içinde - branşları dile göre yükle
onMounted(async () => {
  if (isEditMode.value) {
    loading.value = true;
    const proforma = await proformaStore.fetchProforma(Number(route.params.id)) as any;
    if (proforma) {
      Object.assign(formData.value, proforma);
      
      // ✅ Proforma dilini set et
      if (proforma.language) {
        setLanguage(proforma.language)
      }
      
      if (proforma.hospital) {
        hospitalSearch.value = proforma.hospital;
        hospitalId.value = proforma.hospitalId;
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
  }

  try {
    // ✅ Branşları seçili dile göre yükle
    await Promise.all([
      fetchHospitals({ limit: 1000 }),
      fetchDoctors({ limit: 1000 }),
      fetchBranches({ 
        limit: 1000,
        languageId: currentLanguageInfo.value?.id
      }),
    ])
    
    console.log(`✅ Branşlar ${formData.value.language} diline göre yüklendi`)
  } catch (err) {
    console.error('Failed to initialize form:', err)
  }
})

// 2️⃣ Dil değiştiğinde branşları yeniden yükle
const handleLanguageChange = async () => {
  setLanguage(formData.value.language)
  
  // ✅ Branşları seçilen dile göre yeniden yükle
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

// 3️⃣ Watch - form dili değişince
watch(() => formData.value.language, async (newLanguage, oldLanguage) => {
  if (newLanguage && newLanguage !== oldLanguage) {
    await handleLanguageChange()
  }
})

// 4️⃣ Watch - global dil değişince
watch(() => currentLanguage.value, async (newLanguage, oldLanguage) => {
  if (newLanguage && newLanguage !== oldLanguage) {
    formData.value.language = newLanguage
  }
})

// 5️⃣ addTreatmentItem - Para birimi olmadan
const addTreatmentItem = () => {
  formData.value.treatmentItems.push({
    id: `temp-${Date.now()}`,
    procedure: '',
    visitType: '',
    estimatedCost: 0,
    notes: '',
  });
};

 

const filteredHospitals = computed(() => {
  if (!hospitalSearch.value) {
    return hospitals.value
  }
  const search = hospitalSearch.value.toLowerCase()
  return hospitals.value.filter(hospital =>
    hospital.name.toLowerCase().includes(search)
  )
})

const selectHospital = async (hospital:any) => {
  formData.value.hospitalId = hospital.id
  formData.value.hospital = hospital.name
  hospitalId.value = hospital.id
  hospitalSearch.value = hospital.name
  showHospitalDropdown.value = false
  
  // ✅ Hastane adres bilgisini otomatik doldur
  if (hospital.address) {
    formData.value.hospitalAddress = hospital.address
  }
  if (hospital.phone) {
    formData.value.hospitalPhone = hospital.phone
  }
  if (hospital.email) {
    formData.value.hospitalEmail = hospital.email
  }
  
  // Fetch doctors for the selected hospital
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
  return baseDoctors.filter((doctor:any) =>
    doctor.name.toLowerCase().includes(search)
  )
}) as any

const selectDoctor = (doctor:any) => {
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


const removeTreatmentItem = (index: number) => {
  formData.value.treatmentItems.splice(index, 1);
  if (!manualGrandTotal.value) {
    calculateGrandTotal()
  }
};

const handleSave = async () => {
  if (!formData.value.patientName || formData.value.patientName.trim() === '') {
    alert('Hasta adı zorunludur');
    return;
  }

  if (formData.value.treatmentItems.length === 0) {
    alert('En az bir tedavi prosedürü eklemelisiniz');
    return;
  }

  if (!formData.value.grandTotal || formData.value.grandTotal <= 0) {
    alert('Genel Toplam girilmelidir');
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
  if (confirm('Değişiklikler kaydedilmemiş olabilir. Çıkmak istediğinize emin misiniz?')) {
    router.push('/proforma/list');
  }
};

const handlePreview = async () => {
  if (isEditMode.value) {
    if (!canDownload.value) {
      alert('Bu proformayı görüntüleme yetkiniz yok. Lütfen onay bekleyin.');
      return;
    }
    
    previewUrl.value = `https://vcrmapi.mlpcare.com/proformas/${route.params.id}/preview`;
    showPreview.value = true;
  } else {
    alert('Önizleme için önce proformayı kaydetmelisiniz');
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
    
    // Reload proforma data
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
    
    // Reload proforma data
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