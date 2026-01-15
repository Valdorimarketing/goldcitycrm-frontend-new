<template>
  <div 
    class="p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group"
    @click="$emit('click')"
  >
    <div class="flex items-start gap-3">
      <!-- Avatar -->
      <div class="flex-shrink-0">
        <div 
          class="w-9 h-9 rounded-full flex items-center justify-center"
          :class="avatarClass"
        >
          <span class="text-xs font-semibold" :class="avatarTextClass">
            {{ getInitials(customer.name) }}
          </span>
        </div>
      </div>
      
      <!-- Info -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between gap-2">
          <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
            {{ customer.name }} {{ customer.surname }}
          </p>
          
          <!-- Action Buttons -->
          <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              v-if="showPrev"
              @click.stop="$emit('move-prev')"
              class="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
              title="Önceki aşamaya geri al"
            >
              <ArrowLeftIcon class="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
            </button>
            <button 
              v-if="showNext"
              @click.stop="$emit('move-next')"
              class="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
              title="Sonraki aşamaya aktar"
            >
              <ArrowRightIcon class="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
        
        <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
          {{ customer.email || customer.phone || '-' }}
        </p>
        
        <!-- Dates -->
        <div class="flex items-center gap-3 mt-1.5 text-[10px] text-gray-400 dark:text-gray-500">
          <span class="flex items-center gap-1">
            <CalendarIcon class="w-3 h-3" />
            {{ formatDate(customer.createdAt) }}
          </span>
          <span class="flex items-center gap-1" v-if="customer.updatedAt">
            <ClockIcon class="w-3 h-3" />
            {{ formatDate(customer.updatedAt) }}
          </span>
        </div>

        <!-- Price Info (if exists) -->
        <div 
          v-if="showPrice && customer.priceInfo" 
          class="mt-2 p-2 rounded text-xs"
          :class="priceInfoClass"
        >
          <div class="flex items-center justify-between">
            <span class="font-medium">Teklif:</span>
            <span class="font-bold">
              {{ formatCurrency(customer.priceInfo.offer, customer.priceInfo.currency) }}
            </span>
          </div>
          <div v-if="customer.priceInfo.product" class="mt-1 text-[10px] opacity-75">
            {{ customer.priceInfo.product }}
          </div>
        </div>

        <!-- Product Tags -->
        <div v-if="customer.products?.length" class="flex flex-wrap gap-1 mt-2">
          <span 
            v-for="product in customer.products.slice(0, 2)" 
            :key="product.id"
            class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
          >
            {{ product.name }}
          </span>
          <span 
            v-if="customer.products.length > 2"
            class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
          >
            +{{ customer.products.length - 2 }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  CalendarIcon,
  ClockIcon,
  ArrowLeftIcon,
  ArrowRightIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  customer: {
    type: Object,
    required: true
  },
  color: {
    type: String,
    default: 'gray',
    validator: (value) => ['purple', 'emerald', 'blue', 'amber', 'gray'].includes(value)
  },
  showPrev: {
    type: Boolean,
    default: false
  },
  showNext: {
    type: Boolean,
    default: false
  },
  showPrice: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click', 'move-prev', 'move-next'])

// Color mappings
const colorClasses = {
  purple: {
    avatar: 'bg-purple-100 dark:bg-purple-900/50',
    avatarText: 'text-purple-600 dark:text-purple-400',
    priceInfo: 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
  },
  emerald: {
    avatar: 'bg-emerald-100 dark:bg-emerald-900/50',
    avatarText: 'text-emerald-600 dark:text-emerald-400',
    priceInfo: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
  },
  blue: {
    avatar: 'bg-blue-100 dark:bg-blue-900/50',
    avatarText: 'text-blue-600 dark:text-blue-400',
    priceInfo: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
  },
  amber: {
    avatar: 'bg-amber-100 dark:bg-amber-900/50',
    avatarText: 'text-amber-600 dark:text-amber-400',
    priceInfo: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
  },
  gray: {
    avatar: 'bg-gray-100 dark:bg-gray-700',
    avatarText: 'text-gray-600 dark:text-gray-400',
    priceInfo: 'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300'
  }
}

const avatarClass = computed(() => colorClasses[props.color]?.avatar || colorClasses.gray.avatar)
const avatarTextClass = computed(() => colorClasses[props.color]?.avatarText || colorClasses.gray.avatarText)
const priceInfoClass = computed(() => colorClasses[props.color]?.priceInfo || colorClasses.gray.priceInfo)

// Helpers
const getInitials = (name) => {
  if (!name) return '?'
  return name.charAt(0).toUpperCase()
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit'
  })
}

const formatCurrency = (amount, currency = 'TRY') => {
  if (!amount) return '-'
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: currency
  }).format(amount)
}
</script>