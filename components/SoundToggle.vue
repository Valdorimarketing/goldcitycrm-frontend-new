<!-- components/SoundToggle.vue -->
<template>
  <div class="flex items-center space-x-2">
    <label class="flex items-center cursor-pointer">
      <input type="checkbox" v-model="soundEnabled" class="hidden" />
      <div class="w-10 h-5 bg-gray-300 rounded-full relative transition" :class="{ 'bg-green-500': soundEnabled }">
        <div class="absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full shadow transition-transform"
          :class="{ 'translate-x-5': soundEnabled }"></div>
      </div>
      <transition name="fade">
        <span v-if="sidebarOpen" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
          Bildirim sesi {{ soundEnabled ? 'açık' : 'kapalı' }}
        </span>
      </transition>
    </label>
  </div>
</template>

<script setup lang="ts">
import { useSoundSettings } from '~/composables/useSoundSettings'
const { soundEnabled } = useSoundSettings()


const props = defineProps({
  sidebarOpen: Boolean
})

</script>
