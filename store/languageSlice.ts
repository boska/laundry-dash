import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Language } from '@/constants/i18n';

interface LanguageState {
    currentLanguage: Language;
}

const initialState: LanguageState = {
    currentLanguage: 'en'
};

const languageSlice = createSlice({
    name: 'language',
    initialState,
    reducers: {
        setLanguage: (state, action: PayloadAction<Language>) => {
            state.currentLanguage = action.payload;
        }
    }
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer; 