import { useLanguageStore } from '~/stores/language';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const store = useLanguageStore();

  // Eğer store initialize edilmemişse, bekle
  if (!store.initialized) {
    await store.initialize();
  }

  // Query parametresinden dil kontrolü
  if (to.query.lang && typeof to.query.lang === 'string') {
    const requestedLang = to.query.lang;

    // Eğer mevcut dil farklıysa, değiştir
    if (store.currentLanguageCode !== requestedLang) {
      try {
        await store.setLanguage(requestedLang);
      } catch (error) {
        console.error('Failed to set language from query:', error);
      }
    }
  }
});