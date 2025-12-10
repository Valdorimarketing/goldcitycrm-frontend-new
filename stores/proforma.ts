import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface TreatmentItem {
  id?: string;
  procedure: string;
  visitType: string;
  estimatedCost: string;
  notes: string;
}

export interface Proforma {
  id?: number;
  proformaNumber?: string;
  createdBy: any;
  date: string;
  patientId?: number;
  saleId?: number;
  
  // GENERAL INFORMATION
  patientName?: string;
  hospital: string;
  physicianName?: string;
  physicianDepartment?: string;
  age?: string;
  country?: string;
  comedNo?: string; 
  
  // Optional
  additionalInfo?: string;
  physicianOpinion?: string;
  
  // Treatment
  treatmentItems: TreatmentItem[];
  grandTotal: number;
  currency: string;
  
  // Services
  servicesIncluded?: string[];
  
  // Bank Info (with defaults)
  bankName: string;
  receiverName: string;
  branchName: string;
  branchCode: string;
  bankCurrency: string;
  iban: string;
  swiftCode: string;
  
  // Hospital Contact
  hospitalAddress?: string;
  hospitalPhone?: string;
  hospitalEmail?: string;
  
  status: string;
  pdfUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const useProformaStore = defineStore('proforma', () => {
  const $api = useApi();
  
  const proformas = ref<Proforma[]>([]);
  const currentProforma = ref<Proforma | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Fetch all proformas
   */
  const fetchProformas = async (filters?: {
    status?: string;
    patientId?: number;
    saleId?: number;
    startDate?: string;
    endDate?: string;
  }) => {
    loading.value = true;
    error.value = null;

    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.patientId) params.append('patientId', filters.patientId.toString());
      if (filters?.saleId) params.append('saleId', filters.saleId.toString());
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);

      const queryString = params.toString();
      const url = queryString ? `/proformas?${queryString}` : '/proformas';

      const response: any = await $api(url);
      proformas.value = response;
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch proformas';
      console.error('Error fetching proformas:', e);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Fetch single proforma
   */
  const fetchProforma = async (id: number) => {
    loading.value = true;
    error.value = null;

    try {
      const response: any = await $api(`/proformas/${id}`);
      currentProforma.value = response;
      return currentProforma.value;
    } catch (e: any) {
      error.value = e.message || 'Proforma not found';
      console.error('Error fetching proforma:', e);
      return null;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Create new proforma
   */
  const createProforma = async (proformaData: Partial<Proforma>) => {
    loading.value = true;
    error.value = null;

    try {
      const response: any = await $api('/proformas', {
        method: 'POST',
        body: proformaData,
      });

      proformas.value.unshift(response);
      currentProforma.value = response;
      
      return response;
    } catch (e: any) {
      error.value = e.message || 'Failed to create proforma';
      console.error('Error creating proforma:', e);
      return null;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Update proforma
   */
  const updateProforma = async (id: number, proformaData: Partial<Proforma>) => {
    loading.value = true;
    error.value = null;

    try {
      const response: any = await $api(`/proformas/${id}`, {
        method: 'PATCH',
        body: proformaData,
      });

      const index = proformas.value.findIndex(p => p.id === id);
      if (index !== -1) {
        proformas.value[index] = response;
      }
      
      if (currentProforma.value?.id === id) {
        currentProforma.value = response;
      }

      return response;
    } catch (e: any) {
      error.value = e.message || 'Failed to update proforma';
      console.error('Error updating proforma:', e);
      return null;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Delete proforma
   */
  const deleteProforma = async (id: number) => {
    loading.value = true;
    error.value = null;

    try {
      await $api(`/proformas/${id}`, {
        method: 'DELETE',
      });

      proformas.value = proformas.value.filter(p => p.id !== id);
      
      if (currentProforma.value?.id === id) {
        currentProforma.value = null;
      }

      return true;
    } catch (e: any) {
      error.value = e.message || 'Failed to delete proforma';
      console.error('Error deleting proforma:', e);
      return false;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Get proforma data from sale
   */
  const getProformaFromSale = async (saleId: number) => {
    loading.value = true;
    error.value = null;

    try {
      const response: any = await $api(`/proformas/from-sale/${saleId}`);
      return response;
    } catch (e: any) {
      error.value = e.message || 'Failed to get proforma data from sale';
      console.error('Error getting proforma from sale:', e);
      return null;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Download PDF
   */
  const downloadPDF = async (id: number, proformaNumber: string) => {
    try {
      // PDF download için native fetch kullanıyoruz çünkü blob response gerekiyor
      const response: any = await fetch(`https://vcrmapi.mlpcare.com/proformas/${id}/pdf`);
      // const response: any = await fetch(`http://localhost:3001/proformas/${id}/pdf`);
      if (!response.ok) throw new Error('Failed to generate PDF');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${proformaNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return true;
    } catch (e: any) {
      error.value = e.message || 'Failed to download PDF';
      console.error('Error downloading PDF:', e);
      return false;
    }
  };

  /**
   * Generate and save PDF
   */
  const generatePDF = async (id: number) => {
    loading.value = true;
    error.value = null;

    try {
      const response: any = await $api(`/proformas/${id}/generate-pdf`, {
        method: 'POST',
      });
      
      if (currentProforma.value?.id === id) {
        currentProforma.value.pdfUrl = response.pdfUrl;
      }

      return response;
    } catch (e: any) {
      error.value = e.message || 'Failed to generate PDF';
      console.error('Error generating PDF:', e);
      return null;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Create empty proforma template
   */
  const createEmptyProforma = (): Partial<Proforma> => {
    return {
      date: new Date().toISOString().split('T')[0],
      hospital: 'Liv Hospital Vadistanbul',
      treatmentItems: [],
      grandTotal: 0,
      currency: 'USD',
      status: 'draft',
      // Bank defaults
      bankName: 'DENİZ BANK',
      receiverName: 'Samsun Medikal Grup Özel Sağlık Hizmetleri A.Ş. Vadi Branch',
      branchName: 'AVRUPA KURUMSAL, Istanbul – Turkey',
      branchCode: '3390',
      bankCurrency: 'USD',
      iban: 'TR07 0013 4000 0033 4739 9000 78',
      swiftCode: 'DENITRIS',
      hospitalAddress: 'Ayazağa Mahallesi, Kemerburgaz Caddesi, Vadistanbul Park Etabı, 7F Blok, 34396 Sarıyer/İstanbul',
    };
  };

  return {
    // State
    proformas,
    currentProforma,
    loading,
    error,

    // Actions
    fetchProformas,
    fetchProforma,
    createProforma,
    updateProforma,
    deleteProforma,
    getProformaFromSale,
    downloadPDF,
    generatePDF,
    createEmptyProforma,
  };
});