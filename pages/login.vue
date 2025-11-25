<template>
  <div class="login-container flex items-center justify-center px-4 py-8">
    <div class="w-full max-w-md">
      <div class="login-card">
        <!-- Logo/Title -->
        <div class="text-center mb-8">
          <div class="flex items-center justify-center mb-4">
            <div class="flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-xl">
              <span class="text-white font-bold text-xl">V</span>
            </div>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Valdori CRM</h1>
          <p class="text-gray-600 dark:text-gray-400">Hesabınıza giriş yapın</p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email Input -->
          <div>
            <label for="email" class="form-label">
              E-posta
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="form-input"
              placeholder="ornek@email.com"
              :disabled="loading"
            />
            <p v-if="errors.email" class="mt-2 text-sm text-red-600 dark:text-red-400">
              {{ errors.email }}
            </p>
          </div>

          <!-- Password Input -->
          <div>
            <label for="password" class="form-label">
              Şifre
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="form-input pr-10"
                placeholder="Şifrenizi girin"
                :disabled="loading"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                :disabled="loading"
              >
                <EyeIcon v-if="!showPassword" class="h-5 w-5" />
                <EyeSlashIcon v-else class="h-5 w-5" />
              </button>
            </div>
            <p v-if="errors.password" class="mt-2 text-sm text-red-600 dark:text-red-400">
              {{ errors.password }}
            </p>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p class="text-sm text-red-800 dark:text-red-400">{{ errorMessage }}</p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Giriş yapılıyor...
            </span>
            <span v-else>Giriş Yap</span>
          </button>
        </form>
 
        <!-- Register Link -->
        <div class="mt-8 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Hesabınız yok mu?
            <NuxtLink to="/register" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium transition-colors">
              Kayıt olun
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAuthStore } from '~/stores/auth'
import {
  EyeIcon,
  EyeSlashIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: false
})

// Reactive form data
const form = reactive({
  email: '',
  password: ''
})

// Form validation errors
const errors = reactive({
  email: '',
  password: ''
})

// Auth store
const authStore = useAuthStore()

// Loading state and error message
const loading = ref(false)
const errorMessage = ref('')
const showPassword = ref(false)

// Validate form
const validateForm = () => {
  errors.email = ''
  errors.password = ''
  
  if (!form.email) {
    errors.email = 'E-posta adresi gereklidir'
    return false
  }
  
  if (!form.email.includes('@')) {
    errors.email = 'Geçerli bir e-posta adresi girin'
    return false
  }
  
  if (!form.password) {
    errors.password = 'Şifre gereklidir'
    return false
  }
  
  if (form.password.length < 6) {
    errors.password = 'Şifre en az 6 karakter olmalıdır'
    return false
  }
  
  return true
}

// Handle login
const handleLogin = async () => {
  if (!validateForm()) return
  
  loading.value = true
  errorMessage.value = ''
  
  try {
    const success = await authStore.login({
      email: form.email,
      password: form.password
    })
    
    if (success) {
      // Doctor ve pricing rolündeki kullanıcıları Kişiler sayfasına yönlendir
      if (authStore.user?.role === 'doctor' || authStore.user?.role === 'pricing') {
        await navigateTo('/customers')
      } else {
        await navigateTo('/dashboard')
      }
    } else {
      errorMessage.value = 'Giriş başarısız. E-posta ve şifrenizi kontrol edin.'
    }
  } catch (error) {
    console.error('Login error:', error)
    errorMessage.value = 'Bir hata oluştu. Lütfen tekrar deneyin.'
  } finally {
    loading.value = false
  }
}

// Check if already logged in
onMounted(() => {
  if (authStore.isLoggedIn) {
    // Doctor ve pricing rolündeki kullanıcıları Kişiler sayfasına yönlendir
    if (authStore.user?.role === 'doctor' || authStore.user?.role === 'pricing') {
      navigateTo('/customers')
    } else {
      navigateTo('/dashboard')
    }
  }
})
</script> 