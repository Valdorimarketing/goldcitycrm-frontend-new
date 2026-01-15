<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" @click.self="closeModal">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
        @click="closeModal"></div>

      <!-- Modal panel -->
      <div
        class="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white dark:bg-gray-800 rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ user ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle' }}
          </h3>
          <button @click="closeModal"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-4">

          <!-- Avatar -->
          <div v-if="user">
            <label class="form-label">Profil Fotoğrafı</label>
            <div class="flex items-center space-x-4">
              <div
                class="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                <img v-if="previewAvatar" :src="previewAvatar" alt="Avatar" class="object-cover w-full h-full" />
                <div v-else
                  class="flex items-center justify-center w-full h-full text-gray-400 dark:text-gray-500 text-sm">
                  Yok
                </div>
              </div>
              <input type="file" accept="image/*" @change="onAvatarChange"
                class="text-sm text-gray-700 dark:text-gray-300" />
            </div>
            <p v-if="errors.avatar" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.avatar }}</p>
          </div>

          <!-- Name -->
          <div>
            <label for="name" class="form-label">Ad Soyad *</label>
            <input id="name" v-model="form.name" type="text" class="form-input"
              placeholder="Kullanıcının tam adını girin" required />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.name }}</p>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="form-label">E-posta *</label>
            <input id="email" v-model="form.email" type="email" class="form-input" placeholder="kullanici@example.com"
              required />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.email }}</p>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="form-label">Şifre {{ user ? '' : '*' }}</label>
            <input id="password" v-model="form.password" type="password" class="form-input"
              :placeholder="user ? 'Boş bırakırsanız değişmez' : 'Güvenli bir şifre girin'" :required="!user"
              minlength="6" />
            <p v-if="errors.password" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.password }}</p>
          </div>

          <!-- Role -->
          <div>
            <label for="role" class="form-label">Rol *</label>
            <select id="role" v-model="form.role" class="form-input" required>
              <option value="">Rol seçin</option>
              <option value="admin">Admin</option>
              <option value="user">Kullanıcı</option>
              <option value="doctor">Doktor</option>
              <option value="pricing">Fiyatlandırma</option>
            </select>
            <p v-if="errors.role" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.role }}</p>
          </div>

          <!-- User Group -->
          <div>
            <label for="userGroupId" class="form-label">Kullanıcı Grubu</label>
            <select id="userGroupId" v-model="form.userGroupId" class="form-input">
              <option :value="null">Grup seçin (opsiyonel)</option>
              <option v-for="group in userGroups" :key="group.id" :value="group.id">
                {{ group.name }}
              </option>
            </select>
          </div>

          <!-- User Team -->
          <div>
            <label for="userGroupId" class="form-label">Kullanıcı Takımı</label>
            <select id="userGroupId" v-model="form.userTeamId" class="form-input">
              <option :value="null">Takım seçin (opsiyonel)</option>
              <option v-for="team in userTeams" :key="team.id" :value="team.id">
                {{ team.name }}
              </option>
            </select>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage"
            class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p class="text-sm text-red-800 dark:text-red-400">{{ errorMessage }}</p>
          </div>

          <!-- Success Message -->
          <div v-if="successMessage"
            class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p class="text-sm text-green-800 dark:text-green-400">{{ successMessage }}</p>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-3 pt-4">
            <button type="button" @click="closeModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              :disabled="loading">
              İptal
            </button>
            <button type="submit" class="btn-primary" :disabled="loading">
              <span v-if="loading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                {{ user ? 'Güncelleniyor...' : 'Ekleniyor...' }}
              </span>
              <span v-else>{{ user ? 'Güncelle' : 'Kullanıcı Ekle' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { useUserGroups } from '~/composables/useUserGroups'
import { useApi } from '#imports'

const config = useRuntimeConfig()

const props = defineProps({
  isOpen: Boolean,
  user: Object
})
const emit = defineEmits(['close', 'created', 'updated'])

const { userGroups, fetchUserGroups } = useUserGroups()
const { userTeams, fetchUserTeams } = useUserTeams()

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const previewAvatar = ref(null)

const path = config.public.apiBase

const form = reactive({
  name: '',
  email: '',
  password: '',
  role: '',
  userGroupId: null,
  userTeamId: null,
  avatar: null
})

const errors = reactive({
  name: '',
  email: '',
  password: '',
  role: '',
  userGroupId: '',
  userTeamId: '',
  avatar: ''
})

const resetForm = () => {
  Object.keys(form).forEach(k => form[k] = k === 'userGroupId' ? null : '')
  previewAvatar.value = null
  Object.keys(errors).forEach(k => errors[k] = '')
  errorMessage.value = ''
  successMessage.value = ''
}

const populateForm = () => {
  if (props.user) {
    form.name = props.user.name || ''
    form.email = props.user.email || ''
    form.role = props.user.role || ''
    form.userGroupId = props.user.userGroupId || null
    form.userTeamId = props.user.userTeamId || null
    previewAvatar.value = props.user.avatar ? path + props.user.avatar : null
  }
}

const onAvatarChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    form.avatar = file
    previewAvatar.value = URL.createObjectURL(file)
  }
}

const validateForm = () => {
  let isValid = true
  Object.keys(errors).forEach(k => errors[k] = '')
  if (!form.name.trim()) { errors.name = 'Ad soyad gereklidir'; isValid = false }
  if (!form.email.trim()) { errors.email = 'E-posta gereklidir'; isValid = false }
  if (!props.user && !form.password) { errors.password = 'Şifre gereklidir'; isValid = false }
  if (!form.role) { errors.role = 'Rol seçimi gereklidir'; isValid = false }
  return isValid
}
const handleSubmit = async () => {
  if (!validateForm()) return
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const api = useApi()

    const userData = {
      name: form.name,
      email: form.email,
      role: form.role,
      userGroupId: form.userGroupId,
      userTeamId: form.userTeamId,
      password: form.password || undefined,
    }

    let result
    if (props.user) {
      // 🟢 JSON gönderiyoruz, FormData değil
      result = await api(`/users/${props.user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      })

      // Avatar ayrıca gönderiliyor
      if (form.avatar instanceof File) {
        const avatarData = new FormData()
        avatarData.append('avatar', form.avatar)
        await api(`/users/${props.user.id}/avatar`, {
          method: 'POST',
          body: avatarData,
        })
      }

      successMessage.value = 'Kullanıcı başarıyla güncellendi!'
      emit('updated', result)
    } else {
      // Yeni kullanıcı için - JSON gönderiyoruz
      const payload = { ...userData }

      // Eğer avatar varsa ayrı endpoint ile gönderebilirsin
      result = await api('/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      successMessage.value = 'Kullanıcı başarıyla oluşturuldu!'
      emit('created', result)
    }


    setTimeout(() => closeModal(), 1500)
  } catch (e) {
    errorMessage.value = e.message || 'Bir hata oluştu'
  } finally {
    loading.value = false
  }
}


const closeModal = () => {
  if (!loading.value) {
    resetForm()
    emit('close')
  }
}

watch(() => props.isOpen, (v) => v ? (fetchUserGroups(), fetchUserTeams(), populateForm()) : resetForm())
</script>
