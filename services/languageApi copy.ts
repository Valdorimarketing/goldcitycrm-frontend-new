import type {
  Language,
  TranslationKey,
  Translation,
  TranslationsResponse,
  BulkTranslationItem,
  CreateLanguageDto,
  UpdateLanguageDto,
} from '~/types/language';

// API fetch helper with auth
const apiFetch = async <T>(url: string, options: any = {}): Promise<T> => {
  const config = useRuntimeConfig()
  // const baseURL = config.public.apiBase || 'http://localhost:3001'
   const baseURL = config.public.apiBase || 'https://vcrmapi.mlpcare.com'
  
  // Get token from localStorage (client-side only)
  let token: string | null = null
  if (process.client) {
    token = localStorage.getItem('auth-token')
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  // Add auth token if available
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const response = await $fetch<T>(url, {
      baseURL,
      ...options,
      headers,
      credentials: 'include',
    })
    return response
  } catch (error: any) {
    console.error(`API Error [${options.method || 'GET'}] ${url}:`, error)
    throw new Error(`API Request Failed: ${error.message || 'Unknown error'}`)
  }
}

export const languageApi = {
  // ==================== LANGUAGE ENDPOINTS ====================

  async getLanguages(activeOnly: boolean = false): Promise<Language[]> {
    try {
      return await apiFetch<Language[]>('/languages', {
        params: { activeOnly },
      })
    } catch (error) {
      console.error('Failed to fetch languages:', error)
      // Return default fallback
      return [
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
      ]
    }
  },

  async getDefaultLanguage(): Promise<Language> {
    try {
      return await apiFetch<Language>('/languages/default')
    } catch (error) {
      console.error('Failed to fetch default language:', error)
      // Return Turkish as default
      return {
        id: 2,
        code: 'tr',
        name: 'Türkçe',
        isDefault: true,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    }
  },

  async getLanguageById(id: number): Promise<Language> {
    return await apiFetch<Language>(`/languages/${id}`)
  },

  async getLanguageByCode(code: string): Promise<Language> {
    return await apiFetch<Language>(`/languages/code/${code}`)
  },

  async createLanguage(dto: CreateLanguageDto): Promise<Language> {
    return await apiFetch<Language>('/languages', {
      method: 'POST',
      body: dto,
    })
  },

  async updateLanguage(id: number, dto: UpdateLanguageDto): Promise<Language> {
    return await apiFetch<Language>(`/languages/${id}`, {
      method: 'PUT',
      body: dto,
    })
  },

  async deleteLanguage(id: number): Promise<void> {
    await apiFetch(`/languages/${id}`, {
      method: 'DELETE',
    })
  },

  // ==================== TRANSLATION KEY ENDPOINTS ====================

  async getTranslationKeys(): Promise<TranslationKey[]> {
    return await apiFetch<TranslationKey[]>('/languages/keys/all')
  },

  async createTranslationKey(keyName: string, description?: string): Promise<TranslationKey> {
    return await apiFetch<TranslationKey>('/languages/keys', {
      method: 'POST',
      body: { keyName, description },
    })
  },

  async deleteTranslationKey(id: number): Promise<void> {
    await apiFetch(`/languages/keys/${id}`, {
      method: 'DELETE',
    })
  },

  // ==================== TRANSLATION ENDPOINTS ====================

  async createTranslation(
    languageId: number,
    translationKeyId: number,
    value: string,
  ): Promise<Translation> {
    return await apiFetch<Translation>('/languages/translations', {
      method: 'POST',
      body: { languageId, translationKeyId, value },
    })
  },

  async updateTranslation(
    languageId: number,
    translationKeyId: number,
    value: string,
  ): Promise<Translation> {
    return await apiFetch<Translation>(
      `/languages/translations/${languageId}/${translationKeyId}`,
      {
        method: 'PUT',
        body: { value },
      },
    )
  },

  async deleteTranslation(languageId: number, translationKeyId: number): Promise<void> {
    await apiFetch(`/languages/translations/${languageId}/${translationKeyId}`, {
      method: 'DELETE',
    })
  },

  // ==================== BULK OPERATIONS ====================

  async bulkCreateTranslations(items: BulkTranslationItem[]): Promise<any> {
    return await apiFetch('/languages/translations/bulk', {
      method: 'POST',
      body: { items },
    })
  },

  // ==================== GET TRANSLATIONS ====================

  async getTranslations(languageCode?: string, keys?: string[]): Promise<TranslationsResponse> {
    try {
      const response = await apiFetch<any>('/languages/translations/get', {
        method: 'POST',
        body: { languageCode, keys },
      })

      // Transform response to match TranslationsResponse type
      return {
        language: {
          code: response.language || languageCode || 'tr',
          name: response.languageName || 'Unknown',
        },
        translations: response.translations || {},
      }
    } catch (error) {
      console.error('Failed to fetch translations:', error)
      // Return empty translations with proper structure
      return {
        language: {
          code: languageCode || 'tr',
          name: 'Unknown',
        },
        translations: {},
      }
    }
  },

  async getAllTranslationsFormatted(): Promise<Record<string, Record<string, string>>> {
    try {
      return await apiFetch<Record<string, Record<string, string>>>('/languages/translations/all')
    } catch (error) {
      console.error('Failed to fetch all translations:', error)
      // Return empty object
      return {}
    }
  },

  async getTranslationsByLanguage(languageCode: string): Promise<TranslationsResponse> {
    try {
      const response = await apiFetch<any>(`/languages/translations/language/${languageCode}`)

      // Transform response to match TranslationsResponse type
      return {
        language: {
          code: response.language?.code || response.languageCode || languageCode,
          name: response.language?.name || response.languageName || 'Unknown',
        },
        translations: response.translations || {},
      }
    } catch (error) {
      console.error(`Failed to fetch translations for ${languageCode}:`, error)
      // Return empty translations with proper structure
      return {
        language: {
          code: languageCode,
          name: 'Unknown',
        },
        translations: {},
      }
    }
  },
}