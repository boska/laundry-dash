import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setLanguage } from '@/store/languageSlice';
import { Language } from '@/constants/i18n';

export function useLanguage() {
    const dispatch = useAppDispatch();
    const currentLanguage = useAppSelector(state => state.language.currentLanguage);

    const changeLanguage = (language: Language) => {
        dispatch(setLanguage(language));
    };

    return {
        currentLanguage,
        changeLanguage,
    };
} 