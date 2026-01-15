<template>
  <div class="mb-6">
    <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
      <svg class="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
      İlk Temas Hızı Performansı
    </h4>
    
    <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div v-if="hasData" class="space-y-4">
        <!-- Chart.js Canvas -->
        <div class="mb-4">
          <canvas ref="chartCanvas" style="height: 200px;"></canvas>
        </div>

        <!-- Stats Summary -->
        <div class="grid grid-cols-3 gap-4">
          <div class="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ fastCount }}</div>
            <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">Hızlı (0-3dk)</div>
            <div class="text-xs text-green-600 dark:text-green-400 font-medium">{{ fastPercentage }}%</div>
          </div>
          <div class="text-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <div class="text-2xl font-bold text-amber-600 dark:text-amber-400">{{ normalCount }}</div>
            <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">Normal (4-10dk)</div>
            <div class="text-xs text-amber-600 dark:text-amber-400 font-medium">{{ normalPercentage }}%</div>
          </div>
          <div class="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div class="text-2xl font-bold text-red-600 dark:text-red-400">{{ slowCount }}</div>
            <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">Yavaş (10dk+)</div>
            <div class="text-xs text-red-600 dark:text-red-400 font-medium">{{ slowPercentage }}%</div>
          </div>
        </div>
      </div>

      <!-- Boş Durum -->
      <div v-else class="py-8 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Henüz yeterli veri yok
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch, toRaw } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

interface UserPerformance {
  id: number
  name: string
  stats: {
    totalCustomers: number
    avgFirstTouchMinutes: number
  }
}

const props = defineProps<{
  userPerformances: UserPerformance
}>()

const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

const hasData = computed(() => {
  return props.userPerformances.stats.totalCustomers > 0
})

const fastCount = computed(() => {
  const avg = props.userPerformances.stats.avgFirstTouchMinutes
  const total = props.userPerformances.stats.totalCustomers
  
  if (avg <= 3) return total // 0-3 dakika
  if (avg > 10) return 0
  return Math.round(total * 0.2)
})

const normalCount = computed(() => {
  const avg = props.userPerformances.stats.avgFirstTouchMinutes
  const total = props.userPerformances.stats.totalCustomers
  
  if (avg > 3 && avg <= 10) return total // 4-10 dakika
  if (avg <= 3) return 0
  if (avg > 10) return 0
  return Math.round(total * 0.3)
})

const slowCount = computed(() => {
  const avg = props.userPerformances.stats.avgFirstTouchMinutes
  const total = props.userPerformances.stats.totalCustomers
  
  if (avg > 10) return total // 10+ dakika
  return total - fastCount.value - normalCount.value
})

const fastPercentage = computed(() => {
  const total = props.userPerformances.stats.totalCustomers
  return total > 0 ? Math.round((fastCount.value / total) * 100) : 0
})

const normalPercentage = computed(() => {
  const total = props.userPerformances.stats.totalCustomers
  return total > 0 ? Math.round((normalCount.value / total) * 100) : 0
})

const slowPercentage = computed(() => {
  const total = props.userPerformances.stats.totalCustomers
  return total > 0 ? Math.round((slowCount.value / total) * 100) : 0
})

const createChart = () => {
  if (!chartCanvas.value || !hasData.value) return

  if (chartInstance) {
    chartInstance.destroy()
  }

  const ctx = chartCanvas.value.getContext('2d')
  if (!ctx) return

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Hızlı', 'Normal', 'Yavaş'],
      datasets: [{
        label: 'Müşteri Sayısı',
        data: [fastCount.value, normalCount.value, slowCount.value],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        pointBackgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        pointBorderColor: ['#10b981', '#f59e0b', '#ef4444'],
        pointRadius: 8,
        pointHoverRadius: 10,
        pointStyle: 'circle',
        tension: 0.4,
        fill: true,
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 750,
        easing: 'easeInOutQuart'
      },
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'İlk Temas Hızı Dağılımı',
          color: '#9ca3af',
          font: {
            size: 14,
            weight: 'normal'
          },
          padding: {
            bottom: 20
          }
        },
        tooltip: {
          backgroundColor: '#1f2937',
          titleColor: '#f9fafb',
          bodyColor: '#f9fafb',
          borderColor: '#374151',
          borderWidth: 1,
          padding: 12,
          displayColors: true,
          callbacks: {
            label: (context) => {
              const value = context.parsed.y || 0
              const total = props.userPerformances.stats.totalCustomers
              const percentage = total > 0 ? Math.round((value / total) * 100) : 0
              return `${value} müşteri (${percentage}%)`
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            color: '#9ca3af',
            font: {
              size: 12
            }
          },
          grid: {
            color: 'rgba(75, 85, 99, 0.2)',
          }
        },
        x: {
          ticks: {
            color: '#9ca3af',
            font: {
              size: 12
            }
          },
          grid: {
            display: false
          }
        }
      }
    }
  })
}

// Chart'ı sadece totalCustomers değiştiğinde güncelle
const totalCustomers = computed(() => props.userPerformances.stats.totalCustomers)

onMounted(() => {
  if (hasData.value) {
    createChart()
  }
})

watch(totalCustomers, () => {
  if (hasData.value) {
    createChart()
  }
})
</script>