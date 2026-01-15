<template>
  <div :data-field="name || label">
    <label v-if="label" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>
    <div class="relative">
      <select
        ref="selectRef"
        :value="modelValue"
        @change="handleChange($event)"
        @focus="$emit('focus', $event)"
        :disabled="disabled"
        :required="required"
        :name="name"
        class="w-full px-4 py-3 bg-white dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 disabled:bg-slate-100 dark:disabled:bg-slate-900 disabled:text-slate-500 dark:disabled:text-slate-500 disabled:cursor-not-allowed pr-10"
        :class="[
          error 
            ? 'border-red-500 ring-2 ring-red-500/20 focus:ring-red-500' 
            : 'border-slate-200 dark:border-slate-700 focus:ring-emerald-500'
        ]">
        <option value="">{{ placeholder }}</option>
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      
      <!-- Dropdown Arrow -->
      <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <ChevronDownIcon class="h-5 w-5 text-slate-400" />
      </div>
    </div>
    
    <!-- Error Message -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1">
      <p v-if="error" class="mt-2 text-sm text-red-600 dark:text-red-400">
        {{ error }}
      </p>
    </Transition>
  </div>
</template>

<script setup>
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'Seçiniz'
  },
  error: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'focus'])

const handleChange = (event) => {
  const value = event.target.value
  emit('update:modelValue', value)
  // Use nextTick to prevent reactive loop
  nextTick(() => {
    emit('change', event)
  })
}

const selectRef = ref(null)

defineExpose({
  focus: () => selectRef.value?.focus(),
  selectRef
})
</script>