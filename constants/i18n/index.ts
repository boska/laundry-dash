import en from './en';
import zhTW from './zh-TW';

export const translations = {
    en,
    'zh-TW': zhTW
} as const;

export type Language = keyof typeof translations;
export type TranslationKeys = typeof translations['en'];

export const defaultLanguage: Language = 'en';

export function getTranslation(lang: Language = defaultLanguage) {
    return translations[lang] ?? translations[defaultLanguage];
} 