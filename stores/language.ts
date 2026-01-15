// stores/language.ts
import { defineStore } from 'pinia';
import { languageApi } from '~/services/languageApi';
import type { Language, TranslationsResponse } from '~/types/language';

// ✅ Global initialization flag to prevent race conditions
let isInitializing = false;

export const useLanguageStore = defineStore('language', {
  state: () => ({
    languages: [] as Language[],
    currentLanguage: null as Language | null,
    translations: {} as Record<string, string>,
    loading: false,
    error: null as string | null,
    isLanguageLoaded: false,
    isChangingLanguage: false,
    lastChangeTimestamp: 0,
  }),

  getters: {
    activeLanguages: (state) => state.languages.filter((lang) => lang.isActive),
    availableLanguages: (state) => state.languages.filter((lang) => lang.isActive),
    defaultLanguage: (state) => {
      const defaultLang = state.languages.find((lang) => lang.isDefault);
      return defaultLang || state.languages[0] || null;
    },
    currentLanguageCode: (state) => state.currentLanguage?.code || 'tr',
  },

  actions: {
    async initialize() {
      // ✅ Guard 1: Check if already initialized
      if (this.isLanguageLoaded) {
        // ✅ Client-side'da localStorage'dan yükle
        if (import.meta.client) {
          const savedCode = this.getSavedLanguageCode();
          if (savedCode && this.currentLanguage?.code !== savedCode) {
            const savedLanguage = this.languages.find((lang) => lang.code === savedCode);
            if (savedLanguage) {
              this.currentLanguage = savedLanguage;
              await this.loadTranslations(savedLanguage.code);
            }
          }
        }
        return true;
      }

      // ✅ Guard 2: Check if initialization in progress
      if (isInitializing) {
        while (isInitializing) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        return true;
      }

      try {
        isInitializing = true;
        this.loading = true;
        this.error = null;

        const languages = await languageApi.getLanguages(true);
        
        if (!languages || languages.length === 0) {
          this.setFallbackData();
          return true;
        }

        this.languages = languages;

        // Load saved language or default
        const savedLanguageCode = this.getSavedLanguageCode();
        
        if (savedLanguageCode) {
          const savedLanguage = this.languages.find((lang) => lang.code === savedLanguageCode);
          if (savedLanguage) {
            this.currentLanguage = savedLanguage;
          }
        }

        if (!this.currentLanguage) {
          const defaultLang = this.languages.find((lang) => lang.isDefault);
          this.currentLanguage = defaultLang || this.languages[0] || null;
        }

        // Load translations for current language
        if (this.currentLanguage) {
          await this.loadTranslations(this.currentLanguage.code);
        }

        this.isLanguageLoaded = true;
        this.loading = false;
        return true;
      } catch (error: any) {
        this.error = error.message || 'Failed to initialize languages';
        this.loading = false;
        this.setFallbackData();
        return true;
      } finally {
        isInitializing = false;
      }
    },

    setFallbackData() {
      this.languages = [
        {
          id: 1,
          code: 'en',
          name: 'English',
          isDefault: false,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 2,
          code: 'tr',
          name: 'Türkçe',
          isDefault: true,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 3,
          code: 'ar',
          name: 'العربية',
          isDefault: false,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      const savedCode = this.getSavedLanguageCode();
      const savedLanguage = savedCode 
        ? this.languages.find(l => l.code === savedCode)
        : null;

      // ✅ TypeScript fix: garantili Language | null ataması
      this.currentLanguage = savedLanguage ?? this.languages[1] ?? null;
      this.translations = {};
      this.isLanguageLoaded = true;
    },

    getSavedLanguageCode(): string | null {
      if (import.meta.client) {
        try {
          return localStorage.getItem('language-code');
        } catch (e) {
          return null;
        }
      }
      return null;
    },

    saveLanguageCode(code: string) {
      if (import.meta.client) {
        try {
          localStorage.setItem('language-code', code);
        } catch (e) {
          // Silent error
        }
      }
    },

    async setLanguage(languageCode: string) {
      return await this.changeLanguage(languageCode);
    },

    async changeLanguage(languageCode: string) {
      if (this.isChangingLanguage) {
        return false;
      }

      if (this.currentLanguage?.code === languageCode) {
        return true;
      }

      const now = Date.now();
      if (now - this.lastChangeTimestamp < 500) {
        return false;
      }

      try {
        this.isChangingLanguage = true;
        this.lastChangeTimestamp = now;

        const language = this.languages.find((lang) => lang.code === languageCode);
        
        if (!language) {
          throw new Error(`Language not found: ${languageCode}`);
        }

        this.currentLanguage = language;
        this.saveLanguageCode(languageCode);
        await this.loadTranslations(languageCode);

        return true;
      } catch (error: any) {
        this.error = error.message;
        return false;
      } finally {
        this.isChangingLanguage = false;
      }
    },

    async loadTranslations(languageCode: string) {
      try {
        const response: TranslationsResponse = await languageApi.getTranslationsByLanguage(languageCode);
        
        if (response && response.translations) {
          this.translations = response.translations;
        } else {
          this.translations = {};
        }
      } catch (error: any) {
        if (Object.keys(this.translations).length === 0) {
          this.translations = {};
        }
      }
    },

    async reloadTranslations() {
      if (this.currentLanguage) {
        await this.loadTranslations(this.currentLanguage.code);
      }
    },

    async refreshLanguages() {
      try {
        const languages = await languageApi.getLanguages(true);
        this.languages = languages;
        return true;
      } catch (error: any) {
        return false;
      }
    },

    getTranslation(key: string, fallback?: string): string {
      return this.translate(key, fallback);
    },

    translate(key: string, fallback?: string): string {
      const translation = this.translations[key];
      
      if (translation) {
        return translation;
      }

      if (fallback !== undefined) {
        return fallback;
      }

      return key;
    },

    getTranslationWithParams(key: string, params: Record<string, string | number>, fallback?: string): string {
      let translation = this.translate(key, fallback);

      Object.keys(params).forEach((paramKey) => {
        const regex = new RegExp(`\\{${paramKey}\\}`, 'g');
        translation = translation.replace(regex, String(params[paramKey]));
      });

      return translation;
    },

    async createLanguage(data: { code: string; name: string; isDefault?: boolean }) {
      try {
        const newLanguage = await languageApi.createLanguage(data);
        this.languages.push(newLanguage);
        return newLanguage;
      } catch (error: any) {
        throw error;
      }
    },

    async updateLanguage(id: number, data: Partial<Language>) {
      try {
        const updatedLanguage = await languageApi.updateLanguage(id, data);
        const index = this.languages.findIndex((lang) => lang.id === id);
        
        if (index !== -1) {
          this.languages[index] = updatedLanguage;
        }
        
        return updatedLanguage;
      } catch (error: any) {
        throw error;
      }
    },

    async deleteLanguage(id: number) {
      try {
        await languageApi.deleteLanguage(id);
        this.languages = this.languages.filter((lang) => lang.id !== id);
        return true;
      } catch (error: any) {
        throw error;
      }
    },
  },
});