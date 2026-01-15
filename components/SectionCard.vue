<template>
  <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
    <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-slate-900 dark:bg-white rounded-xl">
          <component :is="iconComponent" class="h-5 w-5 text-white dark:text-slate-900" />
        </div>
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white">{{ title }}</h3>
      </div>
    </div>
    <div class="p-6">
      <slot />
    </div>
  </div>
</template>

<script setup>
import {
  UserIcon,
  PhoneIcon,
  BriefcaseIcon,
  MapPinIcon,
  FlagIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'UserIcon'
  }
})

const iconMap = {
  UserIcon,
  PhoneIcon,
  BriefcaseIcon,
  MapPinIcon,
  FlagIcon,
  AdjustmentsHorizontalIcon
}

const iconComponent = computed(() => iconMap[props.icon] || UserIcon)
</script>