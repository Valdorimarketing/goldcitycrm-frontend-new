// services/languageApi.ts
import type { Language, TranslationsResponse, TranslationKey, BulkTranslationItem } from '~/types/language';

/**
 * ✅ Get base API URL safely
 */
const getBaseURL = (): string => {

  // return 'http://localhost:3001';
    return 'https://api1.goldcitycrm.com';
};
 
/**
 * ✅ Safe API fetch with SSL bypass for development
 */
const safeFetch = async (endpoint: string, options: any = {}) => {
  const baseURL = getBaseURL();
  const url = `${baseURL}${endpoint}`;

  try {
    // ✅ Client-side: Use browser fetch
    if (import.meta.client) {
      const response = await fetch(url, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    }

    // ✅ Server-side: Use undici with SSL bypass
    if (import.meta.server) {
      const { Agent, fetch: undiciFetch } = await import('undici');

      const agent = new Agent({
        connect: {
          rejectUnauthorized: false
        }
      });

      const response = await undiciFetch(url, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
        dispatcher: agent,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    }

    throw new Error('Unable to determine runtime environment');
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
};

export const languageApi = {
  /**
   * Get all languages
   */
  async getLanguages(activeOnly: boolean = false): Promise<Language[]> {
    try {
      const params = activeOnly ? '?activeOnly=true' : '';
      const response = await safeFetch(`/languages${params}`);
      return response || [];
    } catch (error) {
      console.error('Failed to fetch languages:', error);
      return [];
    }
  },

  /**
   * Get language by code
   */
  async getLanguageByCode(code: string): Promise<Language> {
    try {
      const response = await safeFetch(`/languages/code/${code}`);
      return response;
    } catch (error) {
      console.error(`Failed to fetch language by code ${code}:`, error);
      throw error;
    }
  },

  /**
   * Get language by ID
   */
  async getLanguageById(id: number): Promise<Language> {
    try {
      const response = await safeFetch(`/languages/${id}`);
      return response;
    } catch (error) {
      console.error(`Failed to fetch language by id ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get default language
   */
  async getDefaultLanguage(): Promise<Language> {
    try {
      const response = await safeFetch('/languages/default');
      return response;
    } catch (error) {
      console.error('Failed to fetch default language:', error);
      throw error;
    }
  },

  /**
   * Get translations by language code
   */
  async getTranslationsByLanguage(languageCode: string): Promise<TranslationsResponse> {
    try {
      const response = await safeFetch(`/languages/translations/language/${languageCode}`);
      return response || { translations: {} };
    } catch (error) {
      console.error(`Failed to fetch translations for ${languageCode}:`, error);
      return { language: { code: 'tr', name: 'Turkish' }, translations: {} };
    }
  },

  /**
   * Get all translation keys
   */
  async getTranslationKeys(): Promise<TranslationKey[]> {
    try {
      const response = await safeFetch('/languages/translations/keys');
      return response || [];
    } catch (error) {
      console.error('Failed to fetch translation keys:', error);
      return [];
    }
  },

  /**
   * Get all translations (all keys with all language values)
   */
  async getAllTranslations(): Promise<any[]> {
    try {
      const response = await safeFetch('/languages/translations/all');
      return response || [];
    } catch (error) {
      console.error('Failed to fetch all translations:', error);
      return [];
    }
  },

  /**
   * Get all translations formatted
   */
  async getAllTranslationsFormatted(): Promise<Record<string, Record<string, string>>> {
    try {
      const response = await safeFetch('/languages/translations/all');
      return response || {};
    } catch (error) {
      console.error('Failed to fetch all translations formatted:', error);
      return {};
    }
  },

  /**
   * Create a new language
   */
  async createLanguage(data: { code: string; name: string; isDefault?: boolean; isActive?: boolean }): Promise<Language> {
    return await safeFetch('/languages', {
      method: 'POST',
      body: data,
    });
  },

  /**
   * Update an existing language
   */
  async updateLanguage(id: number, data: Partial<Language>): Promise<Language> {
    return await safeFetch(`/languages/${id}`, {
      method: 'PUT',
      body: data,
    });
  },

  /**
   * Delete a language
   */
  async deleteLanguage(id: number): Promise<void> {
    await safeFetch(`/languages/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Create a new translation key
   */
  async createTranslationKey(data: { keyName: string; description?: string }): Promise<TranslationKey> {
    return await safeFetch('/languages/keys', {
      method: 'POST',
      body: data,
    });
  },

  /**
   * Create a single translation
   */
  async createTranslation(data: {
    languageId: number;
    translationKeyId: number;
    value: string;
  }): Promise<any> {
    return await safeFetch('/languages/translations', {
      method: 'POST',
      body: data,
    });
  },

  /**
   * Update a translation value for a specific language
   */
  async updateTranslation(languageId: number, translationKeyId: number, data: {
    value?: string;
  }): Promise<any> {
    return await safeFetch(`/languages/translations/${languageId}/${translationKeyId}`, {
      method: 'PUT',
      body: data,
    });
  },

  /**
   * Delete a translation key (removes from all languages)
   */
  async deleteTranslation(languageId: number, translationKeyId: number): Promise<void> {
    await safeFetch(`/languages/translations/${languageId}/${translationKeyId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Bulk import/create translations
   * Format: { items: [{ keyName, description, translations: { tr: "...", en: "..." } }] }
   */
  async bulkImportTranslations(data: {
    items: Array<{
      keyName: string;
      description?: string;
      translations: Record<string, string>;
    }>;
  }): Promise<any> {
    return await safeFetch('/languages/translations/bulk', {
      method: 'POST',
      body: data,
    });
  },

  /**
   * Alias for bulkImportTranslations (for compatibility)
   */
  // languageApi.ts

  async bulkCreateTranslations(items: BulkTranslationItem[]): Promise<any> {
    // ✅ items array'ini wrapper'a sar
    const payload = { items }

    console.log('📤 API Payload:', JSON.stringify(payload, null, 2))
    console.log('📤 Is array?', Array.isArray(items))

    return await safeFetch('/languages/translations/bulk', {
      method: 'POST',
      body: payload,
    })
  },

  /**
   * Export translations for a language as JSON
   */
  async exportTranslations(languageCode: string): Promise<Record<string, string>> {
    try {
      const response = await safeFetch(`/languages/translations/export/${languageCode}`);
      return response.translations || {};
    } catch (error) {
      console.error(`Failed to export translations for ${languageCode}:`, error);
      return {};
    }
  },

  /**
   * Search translations by key or value
   */
  async searchTranslations(query: string, languageCode?: string): Promise<any[]> {
    try {
      const params = new URLSearchParams({ query });
      if (languageCode) {
        params.append('languageCode', languageCode);
      }
      const response = await safeFetch(`/languages/translations/search?${params.toString()}`);
      return response || [];
    } catch (error) {
      console.error('Failed to search translations:', error);
      return [];
    }
  },

  /**
   * Get translations with filters
   */
  async getTranslations(data: {
    languageCode?: string;
    keys?: string[];
  }): Promise<TranslationsResponse> {
    try {
      const response = await safeFetch('/languages/translations/get', {
        method: 'POST',
        body: data,
      });
      return response;
    } catch (error) {
      console.error('Failed to get translations:', error);
      return { language: { code: 'tr', name: 'Turkish' }, translations: {} };
    }
  },
};