<template>
  <div class="border border-gray-200 dark:border-slate-700 rounded-lg p-3">
    <div class="flex items-center justify-between mb-3">
      <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{ title }}</h4>
    </div>

    <ul class="space-y-2">
      <li
        v-for="item in items"
        :key="item.offset"
        class="flex items-center justify-between rounded-md p-2 hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <div>
          <div class="text-sm font-medium text-gray-700 dark:text-gray-200">
            {{ formatDate(item.date) }}
          </div>
          <div class="text-xs text-gray-500">
            {{ item.offset }} {{ kind === 'day' ? 'gün' : 'ay' }} sonra
          </div>
        </div>

        <label class="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            class="sr-only"
            v-model="item.done"
            @change="$emit('toggle', item)"
          />
          <span
            :class="[
              'w-11 h-6 rounded-full relative transition-colors',
              item.done ? 'bg-emerald-500' : 'bg-gray-300'
            ]"
          >
            <span
              :class="[
                'block w-5 h-5 bg-white rounded-full shadow transform transition-transform absolute top-0.5',
                item.done ? 'translate-x-5' : 'translate-x-0'
              ]"
            ></span>
          </span>
        </label>
      </li>
    </ul>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import 'dayjs/locale/tr'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('tr')

const props = defineProps({
  title: String,
  items: Array,
  kind: String
})

function formatDate(d) { 
  if (!d) return '-'

  try {
    const date = dayjs(d).tz('Europe/Istanbul')
    if (!date.isValid()) {
      console.warn('Geçersiz tarih:', d)
      return '-'
    }

    return date.format('D MMMM') // örnek: 7 Kasım
  } catch (e) {
    console.error('Tarih formatlama hatası:', e)
    return '-'
  }
}
</script>
