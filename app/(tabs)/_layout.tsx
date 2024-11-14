import { useEffect } from 'react';
import * as Localization from 'expo-localization';
import { Language } from '@/constants/i18n';
import { useAppDispatch } from '@/store/hooks';
import { setLanguage } from '@/store/languageSlice';
import { GyroscopeView } from '@/components/GyroscopeView';

export default function TabLayout2() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Get device locale on mount
    const locale = Localization.locale;
    const deviceLanguage = locale.startsWith('zh') ? 'zh-TW' : 'en';
    dispatch(setLanguage(deviceLanguage as Language));
  }, []);

  return (
    <>
      <GyroscopeView />
    </>
  );
}