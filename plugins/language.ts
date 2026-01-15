// plugins/language.ts
export default defineNuxtPlugin({
  name: 'language',
  dependsOn: ['pinia'], // ✅ Pinia'dan sonra çalış
  async setup() {
    const languageStore = useLanguageStore();
    
    // ✅ Sadece client-side'da initialize et
    if (import.meta.client) {
      await languageStore.initialize();
    }
  }
});