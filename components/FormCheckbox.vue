<template>
  <label class="inline-flex items-center gap-3 cursor-pointer group">
    <div class="relative">
      <input
        type="checkbox"
        :checked="modelValue"
        @change="$emit('update:modelValue', $event.target.checked)"
        class="sr-only peer" />
      <div class="w-6 h-6 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-all duration-200 group-hover:border-slate-400 dark:group-hover:border-slate-500">
        <CheckIcon class="h-4 w-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 transition-opacity" />
      </div>
      <CheckIcon class="h-4 w-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity" 
        :class="{ 'opacity-100': modelValue }" />
    </div>
    <span class="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
      {{ label }}
    </span>
  </label>
</template>

<script setup>
import { CheckIcon } from '@heroicons/vue/24/solid'

defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])
</script>