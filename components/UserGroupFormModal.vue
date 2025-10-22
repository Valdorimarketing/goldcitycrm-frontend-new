<template>
  <TransitionRoot as="template" :show="show">
    <Dialog as="div" class="relative z-50" @close="$emit('close')">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-80 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <form @submit.prevent="handleSubmit">
                <div class="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div class="sm:flex sm:items-start">
                    <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <DialogTitle as="h3" class="text-lg font-semibold leading-6 text-gray-900 dark:text-white mb-4">
                        {{ userGroup ? 'Kullanıcı Grubu Düzenle' : 'Yeni Kullanıcı Grubu' }}
                      </DialogTitle>

                      <div class="mt-4">
                        <div>
                          <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Grup Adı *
                          </label>
                          <input
                            id="name"
                            v-model="formData.name"
                            type="text"
                            required
                            class="form-input mt-1"
                            placeholder="Örn: Satış Temsilcileri" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="submit"
                    :disabled="saving"
                    class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 sm:ml-3 sm:w-auto"
                  >
                    {{ saving ? 'Kaydediliyor...' : 'Kaydet' }}
                  </button>
                  <button
                    type="button"
                    @click="$emit('close')"
                    class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-600 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 sm:mt-0 sm:w-auto"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'

const props = defineProps({
  show: Boolean,
  userGroup: Object
})

const emit = defineEmits(['close', 'saved'])

const { createUserGroup, updateUserGroup } = useUserGroups()
const saving = ref(false)

const formData = ref({
  name: ''
})

const handleSubmit = async () => {
  saving.value = true
  try {
    if (props.userGroup) {
      await updateUserGroup(props.userGroup.id, formData.value)
      useToast().showSuccess('Kullanıcı grubu başarıyla güncellendi')
    } else {
      await createUserGroup(formData.value)
      useToast().showSuccess('Kullanıcı grubu başarıyla eklendi')
    }
    emit('saved')
  } catch (error) {
    // Handle duplicate name error (409 Conflict)
    if (error?.status === 409 || error?.statusCode === 409) {
      alert('Bu isimde bir kullanıcı grubu zaten mevcut')
    } else {
      // Generic error message for other errors
      useToast().showError('İşlem sırasında bir hata oluştu')
    }
  } finally {
    saving.value = false
  }
}

// Watch for userGroup changes
watch(() => props.userGroup, (newVal) => {
  if (newVal) {
    formData.value = {
      name: newVal.name || ''
    }
  } else {
    formData.value = {
      name: ''
    }
  }
}, { immediate: true })
</script>
