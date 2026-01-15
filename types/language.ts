export interface Language {
  id: number;
  code: string;
  name: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TranslationKey {
  id: number;
  keyName: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Translation {
  id: number;
  languageId: number;
  translationKeyId: number;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export interface TranslationsResponse {
  language: {
    code: string;
    name: string;
  };
  translations: Record<string, string>;
}

export interface BulkTranslationItem {
  keyName: string;
  description?: string;
  translations: Record<string, string>;
}

export interface CreateLanguageDto {
  code: string;
  name: string;
  isDefault?: boolean;
  isActive?: boolean;
}

export interface UpdateLanguageDto {
  name?: string;
  isDefault?: boolean;
  isActive?: boolean;
}