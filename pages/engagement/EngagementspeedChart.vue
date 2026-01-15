<template>
  <div class="space-y-6">
    <!-- 1. İlk Temas Hızı -->
    <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <svg class="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        1. İlk Temas Hızı (Atama → İlk Görüntüleme)
      </h4>

      <div v-if="firstTouchData.hasData">
        <div class="h-80">
          <canvas ref="firstTouchCanvas" style="height: 180px;"></canvas>
        </div>
        <div class="grid grid-cols-3 gap-2 mt-4">
          <div class="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
            <div class="text-lg font-bold text-green-600">{{ firstTouchData.fast }}</div>
            <div class="text-xs text-gray-600 dark:text-gray-400">Hızlı (0-3dk)</div>
          </div>
          <div class="text-center p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
            <div class="text-lg font-bold text-amber-600">{{ firstTouchData.normal }}</div>
            <div class="text-xs text-gray-600 dark:text-gray-400">Normal (4-10dk)</div>
          </div>
          <div class="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded">
            <div class="text-lg font-bold text-red-600">{{ firstTouchData.slow }}</div>
            <div class="text-xs text-gray-600 dark:text-gray-400">Yavaş (10dk+)</div>
          </div>
        </div>
      </div>
      <div v-else class="py-8 text-center text-sm text-gray-500">Veri yok</div>
    </div>

    <!-- 2. İlk Arama Hızı -->
    <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <svg class="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        2. İlk Arama Hızı (İlk Temas → İlk Arama)
      </h4>

      <div>
        <div class="h-80">
          <canvas ref="firstCallCanvas" style="height: 180px;"></canvas>
        </div>
        <div class="grid grid-cols-3 gap-2 mt-4">
          <div class="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
            <div class="text-lg font-bold text-green-600">{{ firstCallData.fast }}</div>
            <div class="text-xs text-gray-600 dark:text-gray-400">Hızlı (0-5dk)</div>
          </div>
          <div class="text-center p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
            <div class="text-lg font-bold text-amber-600">{{ firstCallData.normal }}</div>
            <div class="text-xs text-gray-600 dark:text-gray-400">Normal (6-15dk)</div>
          </div>
          <div class="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded">
            <div class="text-lg font-bold text-red-600">{{ firstCallData.slow }}</div>
            <div class="text-xs text-gray-600 dark:text-gray-400">Yavaş (15dk+)</div>
          </div>
        </div>
        
        <!-- Aktif Engagement -->
        <div v-if="activeEngagement && activeCallWaitTime > 0" class="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
          <span class="text-blue-600 dark:text-blue-400">
            ⏱️ Aktif: {{ activeCallWaitTime }} dk ({{ activeCallStatus }})
          </span>
        </div>
      </div>
    </div>

    <!-- 3. Kapanış Hızı -->
    <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <svg class="h-5 w-5 mr-2 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        3. Kapanış Hızı (İlk Arama → İş Bitirme)
      </h4>

      <div>
        <div class="h-80">
          <canvas ref="closingCanvas" style="height: 180px;"></canvas>
        </div>
        <div class="grid grid-cols-3 gap-2 mt-4">
          <div class="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
            <div class="text-lg font-bold text-green-600">{{ closingData.fast }}</div>
            <div class="text-xs text-gray-600 dark:text-gray-400">Hızlı (0-30dk)</div>
          </div>
          <div class="text-center p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
            <div class="text-lg font-bold text-amber-600">{{ closingData.normal }}</div>
            <div class="text-xs text-gray-600 dark:text-gray-400">Normal (31-60dk)</div>
          </div>
          <div class="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded">
            <div class="text-lg font-bold text-red-600">{{ closingData.slow }}</div>
            <div class="text-xs text-gray-600 dark:text-gray-400">Yavaş (60dk+)</div>
          </div>
        </div>
        
        <!-- Aktif Engagement -->
        <div v-if="activeEngagement && activeClosingTime > 0" class="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
          <span class="text-blue-600 dark:text-blue-400">
            ⏱️ Aktif: {{ activeClosingTime }} dk ({{ activeClosingStatus }})
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, onUnmounted } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

interface HistoryItem {
  id: number
  startDate: string
  endDate: string
  firstTouchMinutes: number
  firstCallMinutes: number
  duration: number
}

interface ActiveEngagement {
  assignedAt: string
  lastTouchAt?: string
}

const props = defineProps<{
  history: HistoryItem[]
  activeEngagement?: ActiveEngagement
}>()

const firstTouchCanvas = ref<HTMLCanvasElement | null>(null)
const firstCallCanvas = ref<HTMLCanvasElement | null>(null)
const closingCanvas = ref<HTMLCanvasElement | null>(null)

let firstTouchChart: Chart | null = null
let firstCallChart: Chart | null = null
let closingChart: Chart | null = null

const currentTime = ref(new Date())
let interval: any = null

onMounted(() => {
  interval = setInterval(() => {
    currentTime.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})

// 1. İlk Temas Hızı
const firstTouchData = computed(() => {
  if (!props.history?.length) {
    return { hasData: false, fast: 0, normal: 0, slow: 0 }
  }

  const times = props.history
    .filter(h => h.firstTouchMinutes > 0)
    .map(h => h.firstTouchMinutes)

  if (times.length === 0) {
    return { hasData: false, fast: 0, normal: 0, slow: 0 }
  }

  return {
    hasData: true,
    fast: times.filter(t => t <= 3).length,
    normal: times.filter(t => t > 3 && t <= 10).length,
    slow: times.filter(t => t > 10).length,
  }
})

// Aktif engagement için arama bekleme süresi
const activeCallWaitTime = computed(() => {
  if (!props.activeEngagement?.lastTouchAt) return 0
  return Math.floor((currentTime.value.getTime() - new Date(props.activeEngagement.lastTouchAt).getTime()) / 60000)
})

const activeCallStatus = computed(() => {
  const diff = activeCallWaitTime.value
  if (diff <= 5) return '🟢 Hızlı'
  if (diff <= 15) return '🟡 Normal'
  return '🔴 Yavaş'
})

// 2. İlk Arama Hızı
const firstCallData = computed(() => {
  const completedTimes = props.history
    ?.filter(h => h.firstTouchMinutes > 0 && h.firstCallMinutes > 0)
    .map(h => h.firstCallMinutes - h.firstTouchMinutes)
    .filter(t => t > 0) || []

  const activeTime = activeCallWaitTime.value
  const allTimes = activeTime > 0 ? [...completedTimes, activeTime] : completedTimes

  return {
    fast: allTimes.filter(t => t <= 5).length,
    normal: allTimes.filter(t => t > 5 && t <= 15).length,
    slow: allTimes.filter(t => t > 15).length,
  }
})

// Aktif engagement için kapanış süresi
const activeClosingTime = computed(() => {
  if (!props.activeEngagement?.assignedAt) return 0
  return Math.floor((currentTime.value.getTime() - new Date(props.activeEngagement.assignedAt).getTime()) / 60000)
})

const activeClosingStatus = computed(() => {
  const diff = activeClosingTime.value
  if (diff <= 30) return '🟢 Hızlı'
  if (diff <= 60) return '🟡 Normal'
  return '🔴 Yavaş'
})

// 3. Kapanış Hızı
const closingData = computed(() => {
  const completedTimes = props.history
    ?.filter(h => h.firstCallMinutes > 0 && h.duration > 0)
    .map(h => {
      const durationMinutes = h.duration > 1000 ? Math.floor(h.duration / 60) : h.duration
      return durationMinutes - h.firstCallMinutes
    })
    .filter(t => t > 0) || []

  const activeTime = activeClosingTime.value
  const allTimes = activeTime > 0 ? [...completedTimes, activeTime] : completedTimes

  return {
    fast: allTimes.filter(t => t <= 30).length,
    normal: allTimes.filter(t => t > 30 && t <= 60).length,
    slow: allTimes.filter(t => t > 60).length,
  }
})

const createChart = (canvas: HTMLCanvasElement, data: any, title: string) => {
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Hızlı', 'Normal', 'Yavaş'],
      datasets: [{
        label: 'Müşteri Sayısı',
        data: [data.fast, data.normal, data.slow],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 300
      },
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: title,
          color: '#9ca3af',
          font: { size: 12 }
        },
        tooltip: {
          backgroundColor: '#1f2937',
          callbacks: {
            label: (context) => `${context.parsed.y} müşteri`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1, color: '#9ca3af' },
          grid: { color: 'rgba(75, 85, 99, 0.2)' }
        },
        x: {
          ticks: { color: '#9ca3af' },
          grid: { display: false }
        }
      }
    }
  })
}

const updateCharts = async () => {
  await nextTick()

  if (firstTouchChart) firstTouchChart.destroy()
  if (firstCallChart) firstCallChart.destroy()
  if (closingChart) closingChart.destroy()

  if (firstTouchData.value.hasData && firstTouchCanvas.value) {
    firstTouchChart = createChart(firstTouchCanvas.value, firstTouchData.value, 'Atama → İlk Temas')
  }
  if (firstCallCanvas.value) {
    firstCallChart = createChart(firstCallCanvas.value, firstCallData.value, 'İlk Temas → İlk Arama')
  }
  if (closingCanvas.value) {
    closingChart = createChart(closingCanvas.value, closingData.value, 'İlk Arama → Kapanış')
  }
}

onMounted(() => {
  updateCharts()
})

watch(() => props.history, () => {
  updateCharts()
}, { deep: true })

watch([currentTime], () => {
  // Chart'ı sadece data değiştiğinde smooth update
  if (firstCallChart?.data?.datasets?.[0]) {
    firstCallChart.data.datasets[0].data = [firstCallData.value.fast, firstCallData.value.normal, firstCallData.value.slow]
    firstCallChart.update('none')
  }
  if (closingChart?.data?.datasets?.[0]) {
    closingChart.data.datasets[0].data = [closingData.value.fast, closingData.value.normal, closingData.value.slow]
    closingChart.update('none')
  }
})
</script>