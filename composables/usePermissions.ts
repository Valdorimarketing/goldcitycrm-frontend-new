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
    // Yeni Kişiler menüsü özel durumu: sadece user rolü görebilir
    if (menuName === 'Yeni Kişiler') {
      return isUser.value
    }

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
        'Ödemeler'
      ]
      return allowedMenus.includes(menuName)
    }

    // Doctor ve Pricing sadece müşteriler ve kişiler menusunu görür
    if (isDoctor.value || isPricing.value) {
      const allowedMenus = [
        'Müşteriler',
        'Kişiler',
        'Dinamik Arama',
        'Hatırlatmalar',
        'Havuz Verileri'
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
        relevantUser: userId.value  // Backend'de field ismi camelCase: relevantUser
      }
    }

    // Doctor sadece is_doctor statuslu customerları görür
    // if (isDoctor.value) {
    //   return {
    //     isDoctor: true // Backend'de isDoctor=true query parametresi
    //   }
    // }

    // Pricing sadece is_pricing statuslu customerları görür
    if (isPricing.value) {
      return {
        isPricing: true // Backend'de isPricing=true query parametresi
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
      // relevantUser field'ı obje veya ID olabilir, tüm varyasyonları kontrol et
      const relevantUserValue = customer.relevantUser || customer.relevent_user || customer.relevantUserId || customer.relevant_user_id

      // Eğer obje ise id'sini al, değilse direkt kullan
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
    // Admin tüm dataları görür
    if (isAdmin.value) {
      return {}
    }

    // User sadece kendine ait dataları görür
    if (isUser.value) {
      return {
        user_id: userId.value
      }
    }

    // Doctor ve Pricing dashboard göremez
    return null
  }

  // Satışlar, randevular, ödemeler filtreleme
  const getRelatedDataFilters = () => {
    // Admin tüm dataları görür
    if (isAdmin.value) {
      return {}
    }

    // User sadece kendine ait customerlarla ilgili dataları görür
    if (isUser.value) {
      return {
        user_id: userId.value
      }
    }

    // Doctor ve Pricing bu sayfaları göremez
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
