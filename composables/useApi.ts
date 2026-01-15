export const useApi = () => {
  const config = useRuntimeConfig()
  
  const api = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      // Get token from localStorage first (more reliable in production), then fall back to cookie
      const token = (import.meta.client ? localStorage.getItem('auth-token') : null) ||
                   useCookie('auth-token').value

      if (token) {
        // Add Authorization header
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`
        }
      }
    },
    onResponseError({ response }) {
      // Handle 401 Unauthorized
      if (response.status === 401) {
        console.error('Unauthorized - Token may be expired')

        // Clear auth and redirect to login
        if (import.meta.client) {
          const authStore = useAuthStore()
          authStore.logout()

          // Redirect to login page
          navigateTo('/login')
        }
      }
    }
  })
  
  return api
}