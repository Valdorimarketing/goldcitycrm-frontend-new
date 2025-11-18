<template>
  <span
    :class="[
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      textColorClass
    ]"
    :style="{ backgroundColor: (color || '#6366f1') + '20', color: color || '#6366f1' }"
  >
    <span
      v-if="showDot"
      class="w-2 h-2 rounded-full mr-1.5"
      :style="{ backgroundColor: color || '#6366f1' }"
    />
    {{ name ? name : 'Durumsuz' }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  name: string
  color: string
  showDot?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showDot: true
})

const textColorClass = computed(() => {
  const isLightColor = (color: string) => {
    if (!color) return true
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000
    return brightness > 155
  }

  const colorToUse = props.color || '#6366f1'
  return isLightColor(colorToUse) ? 'text-gray-900' : 'text-white'
})
</script>