<template>
  <div class="language-switcher">
    <select
      v-model="selectedLanguage"
      @change="handleLanguageChange"
      :disabled="isLoading"
      class="language-select"
    >
      <option v-for="lang in availableLanguages" :key="lang.code" :value="lang.code">
        {{ lang.name }}
      </option>
    </select>
    <span v-if="isLoading" class="loading-indicator">...</span>
  </div>
</template>

<script setup lang="ts">
import { useLanguage } from '~/composables/useLanguage';
const { currentLanguage, availableLanguages, isLoading, setLanguage } = useLanguage();

const selectedLanguage = ref(currentLanguage.value);

// Watch for external language changes
watch(currentLanguage, (newLang) => {
  selectedLanguage.value = newLang;
});

const handleLanguageChange = async () => {
  if (selectedLanguage.value !== currentLanguage.value) {
    await setLanguage(selectedLanguage.value);
  }
};
</script>

<style scoped>
.language-switcher {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.language-select {
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background-color: white;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.2s;
}

.language-select:hover:not(:disabled) {
  border-color: #3b82f6;
}

.language-select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-indicator {
  font-size: 12px;
  color: #666;
}
</style>