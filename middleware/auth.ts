export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  // Check if user is logged in
  if (!authStore.isLoggedIn) {
    // Redirect to login page if not authenticated
    return navigateTo('/login')
  }
})
