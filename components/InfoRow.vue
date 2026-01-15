<template>
  <div class="flex items-start gap-3 group">
    <div class="h-9 w-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 transition-colors">
      <component :is="icon" class="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
    </div>
    <div class="flex-1 min-w-0">
      <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">{{ label }}</p>
      <slot name="value">
        <p class="text-sm font-medium text-gray-900 dark:text-white break-words" :class="{ 'font-mono': mono }">
          {{ value }}
        </p>
      </slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  icon: {
    type: Object,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  value: {
    type: String,
    default: ''
  },
  mono: {
    type: Boolean,
    default: false
  }
})
</script>