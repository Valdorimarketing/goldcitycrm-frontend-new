<template>
  <div class="card">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Aylık Takvim</h3>
      <div class="flex items-center gap-2">
        <button
          @click="previousMonth"
          class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ChevronLeftIcon class="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
        <span class="text-sm font-medium text-gray-900 dark:text-white min-w-[120px] text-center">
          {{ monthYearLabel }}
        </span>
        <button
          @click="nextMonth"
          class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ChevronRightIcon class="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>

    <!-- Calendar Grid -->
    <div v-else>
      <!-- Day Headers -->
      <div class="grid grid-cols-7 gap-1 mb-2">
        <div
          v-for="day in dayHeaders"
          :key="day"
          class="text-center text-xs font-semibold text-gray-600 dark:text-gray-400 py-2"
        >
          {{ day }}
        </div>
      </div>

      <!-- Calendar Days -->
      <div class="grid grid-cols-7 gap-1">
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          :class="[
            'min-h-[80px] p-2 rounded-lg border transition-colors',
            day.isCurrentMonth
              ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              : 'bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800',
            day.isToday
              ? 'ring-2 ring-indigo-500'
              : ''
          ]"
        >
          <div class="flex flex-col h-full">
            <div
              :class="[
                'text-sm font-medium mb-1',
                day.isCurrentMonth
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-400 dark:text-gray-600',
                day.isToday
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                  : ''
              ]"
            >
              {{ day.date }}
            </div>

            <div v-if="day.isCurrentMonth && (day.customersCount > 0 || day.meetingsCount > 0)" class="space-y-1 text-xs">
              <div v-if="day.customersCount > 0" class="flex items-center gap-1">
                <UsersIcon class="h-3 w-3 text-blue-600 dark:text-blue-400" />
                <span class="text-gray-700 dark:text-gray-300">{{ day.customersCount }}</span>
              </div>
              <div v-if="day.meetingsCount > 0" class="flex items-center gap-1">
                <CalendarIcon class="h-3 w-3 text-green-600 dark:text-green-400" />
                <span class="text-gray-700 dark:text-gray-300">{{ day.meetingsCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Legend -->
      <div class="mt-4 flex items-center justify-center gap-4 text-xs text-gray-600 dark:text-gray-400">
        <div class="flex items-center gap-1">
          <UsersIcon class="h-3 w-3 text-blue-600 dark:text-blue-400" />
          <span>Müşteri</span>
        </div>
        <div class="flex items-center gap-1">
          <CalendarIcon class="h-3 w-3 text-green-600 dark:text-green-400" />
          <span>Randevu</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon, UsersIcon, CalendarIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  customersData: Array<any>
  meetingsData: Array<any>
}>()

const loading = ref(false)
const currentDate = ref(new Date())

const dayHeaders = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']

const monthYearLabel = computed(() => {
  const months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ]
  return `${months[currentDate.value.getMonth()]} ${currentDate.value.getFullYear()}`
})

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  // Get day of week (0 = Sunday, 1 = Monday, etc.) - adjust for Monday start
  let firstDayOfWeek = firstDay.getDay()
  firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1 // Convert to Monday = 0

  const days = []

  // Previous month days
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    days.push({
      date: prevMonthLastDay - i,
      isCurrentMonth: false,
      isToday: false,
      customersCount: 0,
      meetingsCount: 0
    })
  }

  // Current month days
  const today = new Date()
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const currentDayDate = new Date(year, month, i)
    const isToday =
      today.getDate() === i &&
      today.getMonth() === month &&
      today.getFullYear() === year

    days.push({
      date: i,
      isCurrentMonth: true,
      isToday,
      customersCount: getCustomersCountForDay(currentDayDate),
      meetingsCount: getMeetingsCountForDay(currentDayDate)
    })
  }

  // Next month days
  const remainingDays = 42 - days.length // 6 weeks * 7 days
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: i,
      isCurrentMonth: false,
      isToday: false,
      customersCount: 0,
      meetingsCount: 0
    })
  }

  return days
})

const getCustomersCountForDay = (date: Date) => {
  if (!props.customersData) return 0

  return props.customersData.filter(customer => {
    if (!customer.createdAt) return false
    const customerDate = new Date(customer.createdAt)
    return (
      customerDate.getDate() === date.getDate() &&
      customerDate.getMonth() === date.getMonth() &&
      customerDate.getFullYear() === date.getFullYear()
    )
  }).length
}

const getMeetingsCountForDay = (date: Date) => {
  if (!props.meetingsData) return 0

  return props.meetingsData.filter(meeting => {
    if (!meeting.startTime) return false
    const meetingDate = new Date(meeting.startTime)
    return (
      meetingDate.getDate() === date.getDate() &&
      meetingDate.getMonth() === date.getMonth() &&
      meetingDate.getFullYear() === date.getFullYear()
    )
  }).length
}

const previousMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1
  )
}

const nextMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  )
}
</script>
