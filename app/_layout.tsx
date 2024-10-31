import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import { store } from '../store/store';

import { useColorScheme } from '@/hooks/useColorScheme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { LanguageSelector } from '@/components/LanguageSelector';
import { View } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Drawer>
            <Drawer.Screen
              name="(tabs)"
              options={{
                headerShown: true,
                title: 'Home',
                drawerLabel: 'Home'
              }}
            />
            <Drawer.Screen
              name="login"
              options={{
                headerShown: true,
                title: 'Login',
                drawerLabel: 'Login'
              }}
            />
            <Drawer.Screen
              name="signup"
              options={{
                headerShown: true,
                title: 'Sign Up',
                drawerLabel: 'Sign Up'
              }}
            />
            <Drawer.Screen
              name="phone-verify"
              options={{
                headerShown: true,
                title: '',
                drawerLabel: 'Phone Verification'
              }}
            />
            <Drawer.Screen
              name="chatroom"
              options={{
                headerShown: true,
                title: 'Support',
                drawerLabel: 'Support'
              }}
            />
            <Drawer.Screen
              name="+not-found"
              options={{
                headerShown: true,
                title: '404',
                drawerLabel: '404'
              }}
            />
          </Drawer>
        </GestureHandlerRootView>
      </ThemeProvider>
    </Provider>
  );
}
