<template>
  <div class="proforma-list-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Proformalar
        </h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Tüm proforma faturaları görüntüleyin ve yönetin
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button @click="applyFilters()" class="btn-primary">
          <ArrowPathIcon class="w-5 h-5 mr-2" />
          Yenile
        </button>
        <NuxtLink to="/proforma/create" class="btn-primary">
          <PlusIcon class="w-5 h-5 mr-2" />
          Yeni Proforma
        </NuxtLink>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-card">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="form-label">Durum</label>
          <select v-model="filters.status" class="form-select">
            <option value="">Tümü</option>
            <option value="draft">Taslak</option>
            <option value="sent">Gönderildi</option>
            <option value="paid">Ödendi</option>
            <option value="cancelled">İptal</option>
          </select>
        </div>

        <div>
          <label class="form-label">Başlangıç Tarihi</label>
          <input v-model="filters.startDate" type="date" class="form-input" />
        </div>

        <div>
          <label class="form-label">Bitiş Tarihi</label>
          <input v-model="filters.endDate" type="date" class="form-input" />
        </div>

        <div class="flex items-end">
          <button @click="applyFilters" class="btn-secondary w-full">
            Filtrele
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Yükleniyor...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="applyFilters" class="btn-secondary">
        Tekrar Dene
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="proformas.length === 0" class="empty-state">
      <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Proforma bulunamadı
      </h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        Henüz hiç proforma oluşturulmamış
      </p>
      <NuxtLink to="/proforma/create" class="btn-primary">
        İlk Proformayı Oluştur
      </NuxtLink>
    </div>

    <!-- Proforma Table -->
    <div v-else class="table-card">
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>Proforma No</th>
              <th>Hasta</th>
              <th>Oluşturan</th>
              <th>Tarih</th>
              <th>Tutar</th>
              <th>Para Birimi</th>
              <th>Durum</th>
              <th>Durum Değiştir</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="proforma in proformas" :key="proforma.id">
              <td>
                <NuxtLink :to="`/proforma/${proforma.id}`" class="text-cyan-600 hover:text-cyan-700 font-medium">
                  {{ proforma.proformaNumber }}
                </NuxtLink>
              </td>
              <td>{{ proforma.patientName || '-' }}</td>
              <td>
                <div class="flex items-center gap-2">
                  <div v-if="proforma.createdBy?.avatar" class="w-8 h-8 rounded-full overflow-hidden">
                    <img :src="getAvatarUrl(proforma.createdBy.avatar)" alt="" class="w-full h-full object-cover" />
                  </div>
                  <div v-else class="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center">
                    <span class="text-sm font-medium text-cyan-600 dark:text-cyan-300">
                      {{ proforma.createdBy?.name?.charAt(0).toUpperCase() || '?' }}
                    </span>
                  </div>
                  <span class="text-sm">{{ proforma.createdBy?.name || 'Bilinmiyor' }}</span>
                </div>
              </td>
              <td>{{ formatDate(proforma.date) }}</td>
              <td class="font-medium">{{ formatCurrency(proforma.grandTotal) }}</td>
              <td>{{ proforma.currency }}</td>
              <td>
                <span :class="getStatusClass(proforma.status)">
                  {{ getStatusText(proforma.status) }}
                </span>
              </td>
              <td>
                <div class="flex items-center gap-2">
                  <select 
                    v-model="statusChanges[proforma.id as any]" 
                    class="form-select-sm"
                  >
                    <option value="draft">Taslak</option>
                    <option value="sent">Gönderildi</option>
                    <option value="paid">Ödendi</option>
                    <option value="cancelled">İptal</option>
                  </select>
                  <button 
                    @click="handleStatusChange(proforma)" 
                    class="btn-icon-sm text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                    :disabled="!statusChanges[proforma.id as any] || statusChanges[proforma.id as any] === proforma.status"
                    :class="{ 'opacity-50 cursor-not-allowed': !statusChanges[proforma.id as any] || statusChanges[proforma.id as any] === proforma.status }"
                    title="Durumu Güncelle"
                  >
                    <CheckIcon class="w-5 h-5" />
                  </button>
                </div>
              </td>
              <td>
                <div class="flex items-center gap-2">
                  <NuxtLink :to="`/proforma/${proforma.id}/edit`" class="btn-icon" title="Düzenle">
                     <PencilSquareIcon class="w-5 h-5" />
                  </NuxtLink>
                  

                  <button @click="handlePreview(proforma.id)" class="btn-icon" title="PDF İndir">
                    <DocumentIcon class="w-5 h-5" />
                  </button>
                  <NuxtLink :to="`http://localhost:3001/proformas/${proforma.id}/preview`" target="_blank" class="btn-icon" title="İndir">
                     <PrinterIcon class="w-5 h-5" />
                  </NuxtLink>

                  <button @click="handleDelete(proforma)"
                    class="btn-icon text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" title="Sil">
                    <TrashIcon class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>


<!-- Preview Modal -->
    <div v-if="showPreview" class="modal-overlay" @click="showPreview = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <div class="flex gap-2">
            <h3 class="text-lg font-bold">Proforma Önizleme</h3> 
          </div>
          <button @click="showPreview = false" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <iframe 
            v-if="previewUrl" 
            :src="previewUrl" 
            class="w-full h-full border-0"
          ></iframe>
        </div>
      </div>
    </div>

  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useProformaStore } from '~/stores/proforma';

import {
  PlusIcon,
  ArrowPathIcon,
  PencilSquareIcon,
  DocumentIcon,
  TrashIcon,
  CheckIcon,
  PrinterIcon
} from '@heroicons/vue/24/outline'

const proformaStore = useProformaStore();
const { proformas, loading, error } = storeToRefs(proformaStore);

const showPreview = ref(false);
const previewUrl = ref('');
const currentProformaId = ref<number | null>(null);

const filters = ref({
  status: '',
  startDate: '',
  endDate: '',
});

// Track status changes for each proforma
const statusChanges = ref<Record<number, string>>({});

onMounted(() => {
  applyFilters();
});

// Initialize status changes when proformas are loaded
watch(() => proformas.value, (newProformas) => {
  if (newProformas && newProformas.length > 0) {
    newProformas.forEach((proforma: any) => {
      if (!statusChanges.value[proforma.id as any]) {
        statusChanges.value[proforma.id as any] = proforma.status;
      }
    });
  }
}, { immediate: true });

const applyFilters = () => {
  proformaStore.fetchProformas({
    status: filters.value.status || undefined,
    startDate: filters.value.startDate || undefined,
    endDate: filters.value.endDate || undefined,
  });
};

 
const handlePreview = async (id: any) => {
  currentProformaId.value = id;
  previewUrl.value = `http://localhost:3001/proformas/${id}/preview`;
  showPreview.value = true;
};
 

const getAvatarUrl = (avatarPath: string) => {
  if (!avatarPath) return '';
  if (avatarPath.startsWith('http')) return avatarPath;
  return `http://localhost:3001/${avatarPath.replace(/^\//, '')}`;
};

const handleStatusChange = async (proforma: any) => {
  const newStatus = statusChanges.value[proforma.id as any];
  
  if (!newStatus || newStatus === proforma.status) {
    return;
  }

  if (!confirm(`${proforma.proformaNumber} proformasının durumunu "${getStatusText(newStatus)}" olarak değiştirmek istediğinizden emin misiniz?`)) {
    return;
  }

  try {
    const success = await proformaStore.updateProforma(proforma.id, { status: newStatus });
    
    if (success) {
      console.log('Status updated successfully');
      await applyFilters();
      statusChanges.value[proforma.id as any] = newStatus;
    }
  } catch (error) {
    console.error('Failed to update status:', error);
  }
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('tr-TR');
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
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

const handleDelete = async (proforma: any) => {
  if (!confirm(`${proforma.proformaNumber} numaralı proformayı silmek istediğinizden emin misiniz?`)) {
    return;
  }

  const success = await proformaStore.deleteProforma(proforma.id);

  if (success) {
    console.log('Proforma deleted successfully');
  }
};
</script>

<style scoped>
.proforma-list-page {
  @apply p-6;
}

.page-header {
  @apply flex justify-between items-start mb-6;
}

.filters-card {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6;
}

.table-card {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden;
}

.data-table {
  @apply w-full;
}

.data-table th {
  @apply px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-900;
}

.data-table td {
  @apply px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100;
}

.data-table tbody tr {
  @apply border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50;
}

.btn-primary {
  @apply inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500;
}

.btn-secondary {
  @apply inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600;
}

.btn-icon {
  @apply p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400;
}

.btn-icon-sm {
  @apply p-1.5 rounded-lg transition-colors;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1;
}

.form-input,
.form-select {
  @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white;
}

.form-select-sm {
  @apply px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white min-w-[140px];
}

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

.loading-state,
.empty-state,
.error-state {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center;
}

.spinner {
  @apply w-12 h-12 border-4 border-gray-200 dark:border-gray-700 border-t-cyan-600 rounded-full animate-spin mx-auto mb-4;
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