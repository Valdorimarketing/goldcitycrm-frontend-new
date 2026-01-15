<template>
  <div class="relative">
    <button
      @click="toggleDropdown"
      class="relative p-2.5 rounded-xl text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:text-slate-400 dark:hover:text-indigo-400 dark:hover:bg-indigo-900/20 transition-all group"
      :title="t('header.language.title', 'Dil Seçimi')"
    >
      <LanguageIcon class="w-5 h-5" />
      
      <!-- Current Language Badge -->
      <span
        v-if="currentLanguageInfo"
        class="absolute -top-1 -right-1 px-1.5 py-0.5 bg-indigo-500 text-white text-[10px] font-bold rounded uppercase"
      >
        {{ currentLanguageInfo.code }}
      </span>

      <!-- Tooltip -->
      <span
        class="absolute -bottom-8 whitespace-nowrap px-2 py-1 bg-gray-900 dark:bg-slate-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        :class="isRTL ? 'right-1/2 translate-x-1/2' : 'left-1/2 -translate-x-1/2'"
      >
        {{ currentLanguageInfo?.name || t('header.language.title', 'Dil') }}
      </span>
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95 -translate-y-2"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 -translate-y-2"
    >
      <div
        v-if="dropdownOpen"
        class="absolute mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl ring-1 ring-black/5 dark:ring-white/10 overflow-hidden z-50"
        :class="isRTL ? 'left-0' : 'right-0'"
      >
        <!-- Header -->
        <div class="px-4 py-3 border-b border-gray-100 dark:border-slate-700">
          <p class="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">
            {{ t('header.language.select', 'Dil Seçin') }}
          </p>
        </div>

        <!-- Language List -->
        <div class="p-2 max-h-80 overflow-y-auto">
          <button
            v-for="language in availableLanguages"
            :key="language.code"
            @click="handleLanguageChange(language.code)"
            :disabled="isChanging || language.code === currentLanguage"
            :class="[
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all',
              language.code === currentLanguage
                ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700',
              (isChanging || language.code === currentLanguage) && 'cursor-not-allowed opacity-50',
              isRTL && 'flex-row-reverse'
            ]"
          >
            <!-- Language Flag/Icon -->
            <div
              :class="[
                'w-8 h-8 rounded-lg flex items-center justify-center text-lg',
                language.code === currentLanguage
                  ? 'bg-indigo-100 dark:bg-indigo-900/50'
                  : 'bg-gray-100 dark:bg-slate-700'
              ]"
            >
              {{ getLanguageFlag(language.code) }}
            </div>

            <!-- Language Name -->
            <div class="flex-1" :class="isRTL ? 'text-right' : 'text-left'">
              <p class="text-sm font-medium">{{ language.name }}</p>
              <p class="text-xs text-gray-500 dark:text-slate-400">
                {{ language.code.toUpperCase() }}
              </p>
            </div>

            <!-- Active Indicator -->
            <div
              v-if="language.code === currentLanguage"
              class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"
            ></div>

            <!-- Loading Indicator -->
            <div
              v-if="isChanging && changingTo === language.code"
              class="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"
            ></div>
          </button>
        </div>

        <!-- Footer Info -->
        <div class="px-4 py-2 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
          <p class="text-xs text-gray-500 dark:text-slate-400 text-center">
            {{ availableLanguages.length }} {{ t('header.language.available', 'dil mevcut') }}
          </p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { LanguageIcon } from '@heroicons/vue/24/outline';

const { 
  t, 
  setLanguage, 
  currentLanguage, 
  currentLanguageInfo,
  availableLanguages,
} = useLanguage();

// RTL diller listesi
const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];
const isRTL = computed(() => RTL_LANGUAGES.includes(currentLanguage.value));

// Dropdown state
const dropdownOpen = ref(false);
const isChanging = ref(false);
const changingTo = ref<string | null>(null);

// Toggle dropdown
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

// Close dropdown on outside click
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (dropdownOpen.value && !target.closest('.relative')) {
    dropdownOpen.value = false;
  }
};

// Language change handler with debounce protection
const handleLanguageChange = async (languageCode: string) => {
  // ✅ Prevent multiple calls
  if (isChanging.value) {
    console.warn('⚠️ Language change already in progress, ignoring request');
    return;
  }

  // ✅ Don't change if already selected
  if (languageCode === currentLanguage.value) {
    console.log('ℹ️ Language already selected:', languageCode);
    dropdownOpen.value = false;
    return;
  }

  try {
    isChanging.value = true;
    changingTo.value = languageCode;
    
    console.log('🔄 Changing language to:', languageCode);
    
    // ✅ Single API call
    await setLanguage(languageCode);
    
    console.log('✅ Language changed successfully to:', languageCode);
    
    // Close dropdown after successful change
    dropdownOpen.value = false;
  } catch (error) {
    console.error('❌ Failed to change language:', error);
  } finally {
    isChanging.value = false;
    changingTo.value = null;
  }
};

// Get language flag emoji
const getLanguageFlag = (code: string): string => {
  const flags: Record<string, string> = {
    'tr': '🇹🇷',
    'en': '🇬🇧',
    'ar': '🇸🇦',
    'de': '🇩🇪',
    'fr': '🇫🇷',
    'es': '🇪🇸',
    'ru': '🇷🇺',
    'zh': '🇨🇳',
    'ja': '🇯🇵',
    'ko': '🇰🇷',
    'he': '🇮🇱',
    'fa': '🇮🇷',
    'ur': '🇵🇰',
  };
  
  return flags[code] || '🌐';
};

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* Custom scrollbar for language list */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgb(203, 213, 225);
  border-radius: 3px;
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgb(51, 65, 85);
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgb(148, 163, 184);
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgb(71, 85, 105);
}
</style>