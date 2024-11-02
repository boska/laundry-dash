import { Tabs } from 'expo-router';
import { usePathname } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as Localization from 'expo-localization';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { LaundryDash } from '@/components/LaundryDash';
import { Language } from '@/constants/i18n';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setLanguage } from '@/store/languageSlice';
import PostListScreen from '../news';
import { Cart } from '@/components/Cart';

export default function TabLayout2() {
  const colorScheme = useColorScheme();
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector(state => state.language.currentLanguage);

  useEffect(() => {
    // Get device locale on mount
    const locale = Localization.locale;
    const deviceLanguage = locale.startsWith('zh') ? 'zh-TW' : 'en';
    dispatch(setLanguage(deviceLanguage as Language));
  }, []);

  return (
    <>
      <Cart />
    </>
  );
}

function TabLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();

  // Hide tab bar on the login screen (index route)
  const hideTabBar = true;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarStyle: hideTabBar ? { display: 'none' } : undefined,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="hello"
        options={{
          title: 'Hello',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
