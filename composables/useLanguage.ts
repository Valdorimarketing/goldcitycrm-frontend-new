import { useLanguageStore } from '~/stores/language';

// Global flag to prevent concurrent language changes
let isChangingLanguage = false;

export const useLanguage = () => {
  const store = useLanguageStore();

  // Kısa kullanım için alias
  const t = (key: string, fallback?: string): string => {
    return store.getTranslation(key, fallback);
  };

  // Parametreli çeviri
  const tp = (key: string, params: Record<string, string | number>, fallback?: string): string => {
    return store.getTranslationWithParams(key, params, fallback);
  };

  // Dil değiştir - with debounce protection
  const setLanguage = async (languageCode: string) => {
    // ✅ Prevent concurrent calls
    if (isChangingLanguage) {
      console.warn('⚠️ Language change already in progress, skipping:', languageCode);
      return false;
    }

    // ✅ Check if already selected
    if (store.currentLanguageCode === languageCode) {
      return true;
    }

    try {
      isChangingLanguage = true;
      
      await store.setLanguage(languageCode);
      
      return true;
    } catch (error) {
      console.error('❌ Language change failed:', error);
      return false;
    } finally {
      isChangingLanguage = false;
    }
  };

  // Mevcut dil kodu
  const currentLanguage = computed(() => store.currentLanguageCode);

  // Mevcut dil objesi
  const currentLanguageInfo = computed(() => store.currentLanguage);

  // Mevcut diller
  const availableLanguages = computed(() => store.availableLanguages);

  // Yükleniyor mu?
  const isLoading = computed(() => store.loading);

  // Yüklendi mi?
  const isLoaded = computed(() => store.isLanguageLoaded);

  // Çeviriler
  const translations = computed(() => store.translations);

  // Çevirileri yeniden yükle
  const reloadTranslations = async () => {
    await store.reloadTranslations();
  };

  // Dilleri yenile
  const refreshLanguages = async () => {
    await store.refreshLanguages();
  };

  return {
    // Getters
    currentLanguage,
    currentLanguageInfo,
    availableLanguages,
    isLoading,
    isLoaded,
    translations,

    // Methods
    t,
    tp,
    setLanguage,
    reloadTranslations,
    refreshLanguages,
  };
};