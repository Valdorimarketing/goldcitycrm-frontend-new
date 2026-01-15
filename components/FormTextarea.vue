<template>
  <div :data-field="name || label">
    <label v-if="label" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>
    <div class="relative">
      <textarea
        ref="textareaRef"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :rows="rows"
        :name="name"
        class="w-full px-4 py-3 bg-white dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 disabled:bg-slate-100 dark:disabled:bg-slate-900 disabled:text-slate-500 dark:disabled:text-slate-500 disabled:cursor-not-allowed resize-none"
        :class="[
          error 
            ? 'border-red-500 ring-2 ring-red-500/20 focus:ring-red-500' 
            : 'border-slate-200 dark:border-slate-700 focus:ring-emerald-500'
        ]"></textarea>
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
    
    <!-- Hint -->
    <p v-if="hint && !error" class="mt-2 text-sm text-slate-500 dark:text-slate-400">
      {{ hint }}
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  hint: {
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
  rows: {
    type: [String, Number],
    default: 3
  },
  name: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue', 'focus', 'blur'])

const textareaRef = ref(null)

defineExpose({
  focus: () => textareaRef.value?.focus(),
  textareaRef
})
</script>