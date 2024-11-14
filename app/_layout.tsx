import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { Stack } from 'expo-router';
import { ThemeProvider as ThemeContextProvider } from '../ctx/ThemeContext';
import Toast from 'react-native-toast-message';
import { AuthProvider } from '@/ctx/AuthContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    // Add any custom fonts here if needed
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <Provider store={store}>
      <ThemeContextProvider>
        <AuthProvider>
          <Stack>
            <Stack.Screen
              name="(tabs)"
              options={{ headerShown: false }}
            />
          </Stack>
          <Toast />
        </AuthProvider>
      </ThemeContextProvider>
    </Provider>
  );
}
