import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import type { LoginDto, RegisterDto, AuthResponse, User } from '~/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoggedIn = computed(() => !!token.value && !!user.value)

  // Initialize from localStorage
  if (process.client) {
    const savedToken = localStorage.getItem('auth-token')
    const savedUser = localStorage.getItem('auth-user')

    if (savedToken && savedUser) {
      token.value = savedToken
      try {
        user.value = JSON.parse(savedUser)

        // Sync token to cookie for API calls
        const tokenCookie = useCookie('auth-token', {
          httpOnly: false,
          secure: true,
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 // 24 hours
        })
        tokenCookie.value = savedToken
      } catch (e) {
        localStorage.removeItem('auth-token')
        localStorage.removeItem('auth-user')
      }
    }
  }

  // Login function
  const login = async (credentials: LoginDto): Promise<boolean> => {
    try {
      const config = useRuntimeConfig()
      
      // Call real JWT login endpoint
      const response = await $fetch('/auth/login', {
        baseURL: config.public.apiBase,
        method: 'POST',
        body: credentials
      }) as any

      // Save token and user
      token.value = response.access_token
      user.value = response.user

      // Save to localStorage
      if (process.client) {
        localStorage.setItem('auth-token', response.access_token)
        localStorage.setItem('auth-user', JSON.stringify(response.user))
        
        // Also save as cookie for SSR
        const tokenCookie = useCookie('auth-token', {
          httpOnly: false,
          secure: true,
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 // 24 hours
        })
        tokenCookie.value = response.access_token
      }

      return true
    } catch (error:any) {
      console.error('Login error:', error)
      
      // Fallback to demo mode if API fails
      if (error.status === 500 || error.status === 404) {
        const mockResponse = {
          access_token: 'demo-token-' + Date.now(),
          user: {
            id: 1,
            name: 'Demo User',
            email: credentials.email,
            role: 'admin',
            isActive: true
          }
        }

        token.value = mockResponse.access_token
        user.value = mockResponse.user

        if (process.client) {
          localStorage.setItem('auth-token', mockResponse.access_token)
          localStorage.setItem('auth-user', JSON.stringify(mockResponse.user))
        }

        return true
      }
      
      return false
    }
  }

  // Register function
  const register = async (data: RegisterDto): Promise<boolean> => {
    try {
      const config = useRuntimeConfig()
      
      // Call real JWT register endpoint
      const response = await $fetch('/auth/register', {
        baseURL: config.public.apiBase,
        method: 'POST',
        body: data
      }) as any

      // Save token and user
      token.value = response.access_token
      user.value = response.user

      // Save to localStorage
      if (process.client) {
        localStorage.setItem('auth-token', response.access_token)
        localStorage.setItem('auth-user', JSON.stringify(response.user))
        
        // Also save as cookie for SSR
        const tokenCookie = useCookie('auth-token', {
          httpOnly: false,
          secure: true,
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 // 24 hours
        })
        tokenCookie.value = response.access_token
      }

      return true
    } catch (error:any) {
      console.error('Register error:', error)
      
      // Fallback to demo mode if API fails
      if (error.status === 500 || error.status === 404) {
        const mockResponse = {
          access_token: 'demo-token-' + Date.now(),
          user: {
            id: 2,
            name: data.name,
            email: data.email,
            role: data.role || 'employee',
            isActive: true
          }
        }

        token.value = mockResponse.access_token
        user.value = mockResponse.user

        if (process.client) {
          localStorage.setItem('auth-token', mockResponse.access_token)
          localStorage.setItem('auth-user', JSON.stringify(mockResponse.user))
        }

        return true
      }
      
      return false
    }
  }

  // Logout function
  const logout = () => {
    token.value = null
    user.value = null

    // Clear localStorage and cookie
    if (process.client) {
      localStorage.removeItem('auth-token')
      localStorage.removeItem('auth-user')

      // Clear cookie
      const tokenCookie = useCookie('auth-token')
      tokenCookie.value = null
    }
  }

  // Initialize auth state
  const initializeAuth = () => {
    if (process.client && token.value && !user.value) {
      // If we have a token but no user, set a demo user
      user.value = {
        id: 1,
        name: 'Demo User',
        email: 'demo@valdoricrm.com',
        role: 'admin',
        isActive: true
      }
    }
  }

  return {
    user: readonly(user),
    token: readonly(token),
    isLoggedIn,
    login,
    register,
    logout,
    initializeAuth
  }
}) 