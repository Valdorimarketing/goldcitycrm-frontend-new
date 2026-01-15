<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>
    <div class="relative">
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        :required="required"
        @change="handleChange"
        class="sr-only" />
      <button
        type="button"
        @click="fileInput?.click()"
        class="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 border-dashed rounded-xl text-slate-500 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-700 dark:hover:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 flex items-center justify-center gap-2">
        <CloudArrowUpIcon class="h-5 w-5" />
        <span v-if="fileName">{{ fileName }}</span>
        <span v-else>{{ placeholder || 'Dosya seçiniz' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { CloudArrowUpIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  accept: {
    type: String,
    default: '*'
  },
  required: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['change'])

const fileInput = ref(null)
const fileName = ref('')

const handleChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    fileName.value = file.name
    emit('change', event)
  }
}
</script>