<template>
  <div class="proforma-detail-page">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Yükleniyor...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error || !proforma" class="error-state">
      <p>Proforma bulunamadı</p>
      <NuxtLink to="/proformas" class="btn-secondary">
        Listeye Dön
      </NuxtLink>
    </div>

    <!-- Detail Content -->
    <template v-else>
      <!-- Header -->
      <div class="page-header">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <NuxtLink to="/proforma/list"
              class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              <ArrowLeftIcon class="w-5 h-5" />
            </NuxtLink>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ proforma.proformaNumber }}
            </h1>
            <span :class="getStatusClass(proforma.status)">
              {{ getStatusText(proforma.status) }}
            </span>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Oluşturulma: {{ formatDate(proforma.createdAt) }}
          </p>
        </div>

        <div class="flex gap-3">

          <NuxtLink :to="`https://vcrm.mlpcare.com/proformas/${proforma.id}/preview`" target="_blank" class="btn-primary"
            title="İndir">
            <PrinterIcon class="w-5 h-5 mr-2" />
            PDF İndir
          </NuxtLink>
<!-- 
          <NuxtLink :to="`http://localhost:3001/proformas/${proforma.id}/preview`" target="_blank" class="btn-primary"
            title="İndir">
            <PrinterIcon class="w-5 h-5 mr-2" />
            PDF İndir
          </NuxtLink> -->

          <NuxtLink :to="`/proforma/${proforma.id}/edit`" class="btn-secondary">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Düzenle
          </NuxtLink>
 
        </div>
      </div>

      <!-- Content Grid -->
      <div class="content-grid">
        <!-- Left Column - Details -->
        <div class="details-column">
          <!-- General Information -->
          <div class="info-card">
            <h2 class="info-card-title">GENERAL INFORMATION</h2>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Patient Name:</span>
                <span class="info-value">{{ proforma.patientName || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Hospital:</span>
                <span class="info-value">{{ proforma.hospital || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Physician's Name:</span>
                <span class="info-value">{{ proforma.physicianName || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Physician's Department:</span>
                <span class="info-value">{{ proforma.physicianDepartment || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Age:</span>
                <span class="info-value">{{ proforma.age || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Country:</span>
                <span class="info-value">{{ proforma.country || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">COMED No:</span>
                <span class="info-value">{{ proforma.comedNo || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Date:</span>
                <span class="info-value">{{ formatDate(proforma.date) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Currency:</span>
                <span class="info-value">{{ proforma.currency }}</span>
              </div>
            </div>
          </div>

          <!-- Physician's Opinion -->
          <div v-if="proforma.physicianOpinion" class="info-card">
            <h2 class="info-card-title">PHYSICIAN'S OPINION</h2>
            <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {{ proforma.physicianOpinion }}
            </p>
          </div>

          <!-- Services Included -->
          <div v-if="hasServices" class="info-card">
            <h2 class="info-card-title">Services Included in the Treatment Plan</h2>
            <ul class="services-list">
              <li v-for="(service, index) in proforma.servicesIncluded" :key="index">
                {{ service }}
              </li>
            </ul>
          </div>

          <!-- Bank Information -->
          <div class="info-card bank-info-card">
            <h2 class="info-card-title">BANK ACCOUNT INFORMATION – {{ proforma.bankCurrency || proforma.currency }}</h2>
            <div class="bank-info-grid">
              <div class="bank-info-item">
                <span class="bank-label">Bank:</span>
                <span class="bank-value">{{ proforma.bankName }}</span>
              </div>
              <div class="bank-info-item">
                <span class="bank-label">Receiver Name:</span>
                <span class="bank-value">{{ proforma.receiverName }}</span>
              </div>
              <div class="bank-info-item">
                <span class="bank-label">Branch Name:</span>
                <span class="bank-value">{{ proforma.branchName }}</span>
              </div>
              <div class="bank-info-item">
                <span class="bank-label">Branch code:</span>
                <span class="bank-value">{{ proforma.branchCode }}</span>
              </div>
              <div class="bank-info-item">
                <span class="bank-label">Currency:</span>
                <span class="bank-value">{{ proforma.bankCurrency }}</span>
              </div>
              <div class="bank-info-item">
                <span class="bank-label">IBAN No:</span>
                <span class="bank-value font-mono">{{ proforma.iban }}</span>
              </div>
              <div class="bank-info-item">
                <span class="bank-label">SWIFT:</span>
                <span class="bank-value font-mono">{{ proforma.swiftCode }}</span>
              </div>
            </div>
          </div>

          <!-- Hospital Contact -->
          <div v-if="hasHospitalContact" class="info-card">
            <h2 class="info-card-title">Hospital Contact Information</h2>
            <div class="info-grid">
              <div v-if="proforma.hospitalAddress" class="info-item full-width">
                <span class="info-label">Address:</span>
                <span class="info-value">{{ proforma.hospitalAddress }}</span>
              </div>
              <div v-if="proforma.hospitalPhone" class="info-item">
                <span class="info-label">Phone:</span>
                <span class="info-value">{{ proforma.hospitalPhone }}</span>
              </div>
              <div v-if="proforma.hospitalEmail" class="info-item">
                <span class="info-label">Email:</span>
                <span class="info-value">{{ proforma.hospitalEmail }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Treatment Items & Totals -->
        <div class="treatment-column">
          <!-- Treatment Items -->
          <div class="info-card">
            <h2 class="info-card-title">RECOMMENDED TREATMENT & ESTIMATED COST DETAILS</h2>

            <div class="treatment-table-wrapper">
              <table class="treatment-table">
                <thead>
                  <tr>
                    <th>Procedure</th>
                    <th>Visit Type</th>
                    <th>Estimated Cost</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in proforma.treatmentItems" :key="item.id || index">
                    <td>{{ item.procedure }}</td>
                    <td>{{ item.visitType }}</td>
                    <td class="text-center">{{ item.estimatedCost }}</td>
                    <td>{{ item.notes || '-' }}</td>
                  </tr>
                  <tr v-if="!proforma.treatmentItems || proforma.treatmentItems.length === 0">
                    <td colspan="4" class="text-center text-gray-500">No treatment items</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Grand Total -->
            <div class="grand-total-section">
              <div class="grand-total-row">
                <span class="grand-total-label">GRAND TOTAL:</span>
                <span class="grand-total-value">{{ proforma.currency }} {{ formatMoney(proforma.grandTotal) }}</span>
              </div>
            </div>
          </div>

          <!-- Additional Information -->
          <div v-if="proforma.additionalInfo" class="info-card">
            <h2 class="info-card-title">ADDITIONAL INFORMATION</h2>
            <p class="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
              {{ proforma.additionalInfo }}
            </p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useProformaStore } from '~/stores/proforma';
import { storeToRefs } from 'pinia';


import {
  ArrowLeftIcon,
  PrinterIcon
} from '@heroicons/vue/24/outline'


const route = useRoute();
const proformaStore = useProformaStore();
const { currentProforma: proforma, loading, error } = storeToRefs(proformaStore);


onMounted(async () => {
  await proformaStore.fetchProforma(Number(route.params.id));
});

const hasServices = computed(() => {
  return proforma.value?.servicesIncluded &&
    Array.isArray(proforma.value.servicesIncluded) &&
    proforma.value.servicesIncluded.length > 0;
});

const hasHospitalContact = computed(() => {
  if (!proforma.value) return false;
  return !!(
    proforma.value.hospitalAddress ||
    proforma.value.hospitalPhone ||
    proforma.value.hospitalEmail
  );
});

const formatDate = (date: any) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatMoney = (amount: any) => {
  const num = parseFloat(amount) || 0;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

const getStatusClass = (status: string) => {
  const classes = {
    draft: 'badge badge-gray',
    sent: 'badge badge-blue',
    paid: 'badge badge-green',
    cancelled: 'badge badge-red',
  };
  return classes[status as keyof typeof classes] || 'badge badge-gray';
};

const getStatusText = (status: string) => {
  const texts = {
    draft: 'Taslak',
    sent: 'Gönderildi',
    paid: 'Ödendi',
    cancelled: 'İptal',
  };
  return texts[status as keyof typeof texts] || status;
};


 
</script>

<style scoped>
.proforma-detail-page {
  @apply p-6;
}

.page-header {
  @apply flex justify-between items-start mb-6;
}

.content-grid {
  @apply grid grid-cols-1 lg:grid-cols-2 gap-6;
}

.details-column,
.treatment-column {
  @apply space-y-6;
}

.info-card {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6;
}

.info-card-title {
  @apply text-lg font-semibold text-cyan-600 dark:text-cyan-400 mb-4 pb-3 border-b-2 border-cyan-600 dark:border-cyan-400;
}

.info-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-4;
}

.info-item {
  @apply flex flex-col;
}

.info-item.full-width {
  @apply md:col-span-2;
}

.info-label {
  @apply text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1;
}

.info-value {
  @apply text-sm text-gray-900 dark:text-white;
}

/* Bank Information Card */
.bank-info-card {
  @apply bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-l-4 border-amber-500;
}

.bank-info-grid {
  @apply space-y-3;
}

.bank-info-item {
  @apply flex justify-between items-center pb-3 border-b border-amber-200 dark:border-amber-800/50 last:border-0;
}

.bank-label {
  @apply text-sm font-semibold text-amber-900 dark:text-amber-200;
}

.bank-value {
  @apply text-sm text-amber-800 dark:text-amber-100;
}

/* Services List */
.services-list {
  @apply space-y-2 pl-5;
}

.services-list li {
  @apply text-sm text-gray-700 dark:text-gray-300 list-disc;
}

/* Treatment Table */
.treatment-table-wrapper {
  @apply overflow-x-auto -mx-6 px-6;
}

.treatment-table {
  @apply w-full border-collapse;
}

.treatment-table th {
  @apply px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700;
}

.treatment-table td {
  @apply px-4 py-3 text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700;
}

/* Grand Total */
.grand-total-section {
  @apply mt-6 pt-4 border-t-2 border-cyan-600 dark:border-cyan-400;
}

.grand-total-row {
  @apply flex justify-between items-center;
}

.grand-total-label {
  @apply text-xl font-bold text-cyan-600 dark:text-cyan-400;
}

.grand-total-value {
  @apply text-2xl font-bold text-cyan-600 dark:text-cyan-400;
}

/* Badges */
.badge {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
}

.badge-gray {
  @apply bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300;
}

.badge-blue {
  @apply bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400;
}

.badge-green {
  @apply bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400;
}

.badge-red {
  @apply bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400;
}

/* Buttons */
.btn-primary {
  @apply inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed;
}
.btn-icon {
  @apply p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400;
}
/* Loading/Error States */
.loading-state,
.error-state {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center;
}

.spinner {
  @apply w-12 h-12 border-4 border-gray-200 dark:border-gray-700 border-t-cyan-600 rounded-full animate-spin mx-auto mb-4;
}
</style>