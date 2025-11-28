import { computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

export type UserRole = 'admin' | 'user' | 'doctor' | 'pricing'

export const usePermissions = () => {
  const authStore = useAuthStore()

  const userRole = computed<UserRole>(() => {
    return (authStore.user?.role as UserRole) || 'user'
  })

  const userId = computed(() => authStore.user?.id)

  const isAdmin = computed(() => userRole.value === 'admin')
  const isUser = computed(() => userRole.value === 'user')
  const isDoctor = computed(() => userRole.value === 'doctor')
  const isPricing = computed(() => userRole.value === 'pricing')

  // Menü görünürlük kuralları
  const canViewMenu = (menuName: string) => {
   

    // Admin diğer tüm menüleri görür
    if (isAdmin.value) return true

    // User rolü için
    if (isUser.value) {
      const allowedMenus = [
        'Dashboard',
        'Müşteriler',
        'Kişiler',
        'Yeni Kişiler',
        'Dinamik Arama',
        'Hatırlatmalar',
        'Satışlar',
        'Randevular',
        'Ödemeler',
        // Doktor Dönüşü - tek menü
        'Doktor Dönüşü',
        // Fiyatlandırmalar - tek menü
        'Fiyatlandırmalar'
      ]
      return allowedMenus.includes(menuName)
    }

    // Doctor rolü için
    if (isDoctor.value) {
      const allowedMenus = [
        'Müşteriler',
        'Kişiler',
        'Yeni Kişiler',
        'Dinamik Arama',
        'Hatırlatmalar',
        'Havuz Verileri',
        // Doktor Dönüşü - tek menü
        'Doktor Dönüşü'
      ]
      return allowedMenus.includes(menuName)
    }

    // Pricing rolü için
    if (isPricing.value) {
      const allowedMenus = [
        'Müşteriler',
        'Kişiler',
        'Yeni Kişiler',
        'Dinamik Arama',
        'Hatırlatmalar',
        'Havuz Verileri',
        // Fiyatlandırmalar - tek menü
        'Fiyatlandırmalar'
      ]
      return allowedMenus.includes(menuName)
    }

    return false
  }

  // Customer filtreleme kuralları
  const getCustomerFilters = () => {
    // Admin tüm customerları görür
    if (isAdmin.value) {
      return {}
    }

    // User sadece kendine ait customerları görür (relevantUser field'ına göre)
    if (isUser.value) {
      return {
        relevantUser: userId.value
      }
    }

    // Pricing sadece is_pricing statuslu customerları görür
    if (isPricing.value) {
      return {
        isPricing: true
      }
    }

    return {}
  }

  // Data erişim kontrolü
  const canAccessCustomer = (customer: any) => {
    // Admin tüm customerları görebilir
    if (isAdmin.value) {
      return true
    }

    // User sadece relevantUser field'ı kendine ait customerları görebilir
    if (isUser.value) {
      const relevantUserValue = customer.relevantUser || customer.relevent_user || customer.relevantUserId || customer.relevant_user_id
      const customerUserId = typeof relevantUserValue === 'object' ? relevantUserValue?.id : relevantUserValue
      const hasAccess = customerUserId === userId.value || customerUserId === String(userId.value) || String(customerUserId) === String(userId.value)
      return hasAccess
    }

    // Doctor sadece is_doctor statuslu customerları görebilir
    if (isDoctor.value) {
      return customer.status_info?.isDoctor === true || customer.statusInfo?.isDoctor === true
    }

    // Pricing sadece is_pricing statuslu customerları görebilir
    if (isPricing.value) {
      return customer.status_info?.isPricing === true || customer.statusInfo?.isPricing === true
    }

    return false
  }

  // Dashboard istatistik filtreleme
  const getDashboardFilters = () => {
    if (isAdmin.value) {
      return {}
    }

    if (isUser.value) {
      return {
        user_id: userId.value
      }
    }

    return null
  }

  // Satışlar, randevular, ödemeler filtreleme
  const getRelatedDataFilters = () => {
    if (isAdmin.value) {
      return {}
    }

    if (isUser.value) {
      return {
        user_id: userId.value
      }
    }

    return null
  }

  return {
    userRole,
    userId,
    isAdmin,
    isUser,
    isDoctor,
    isPricing,
    canViewMenu,
    getCustomerFilters,
    canAccessCustomer,
    getDashboardFilters,
    getRelatedDataFilters
  }
}