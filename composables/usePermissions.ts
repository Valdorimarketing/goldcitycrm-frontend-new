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
    // Admin her şeyi görür
    if (isAdmin.value) return true

    // User rolü için
    if (isUser.value) {
      const allowedMenus = [
        'menu.dashboard',
        'menu.pool_data',
        'section.customer_management',
        'menu.customers',
        'menu.customers.people',
        'menu.customers.new_people',
        'menu.customers.dynamic_search',
        'menu.customers.reminders',
        'menu.doctor_review',
        'menu.proforma',
        'menu.pricing',
        'section.sales_appointments',
        'menu.sales',
        'menu.sales_without_appointment',
        'menu.appointments'
      ]
      return allowedMenus.includes(menuName)
    }

    // Doctor rolü için
    if (isDoctor.value) {
      const allowedMenus = [
        'menu.pool_data',
        'section.customer_management',
        'menu.customers',
        'menu.customers.people',
        'menu.customers.new_people',
        'menu.customers.dynamic_search',
        'menu.customers.reminders',
        'menu.doctor_review'
      ]
      return allowedMenus.includes(menuName)
    }

    // Pricing rolü için
    if (isPricing.value) {
      const allowedMenus = [
        'menu.pool_data',
        'section.customer_management',
        'menu.customers',
        'menu.customers.people',
        'menu.customers.new_people',
        'menu.customers.dynamic_search',
        'menu.customers.reminders',
        'menu.proforma',
        'menu.pricing'
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