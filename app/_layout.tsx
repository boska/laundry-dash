import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { ThemeProvider as ThemeContextProvider, useTheme } from '../ctx/ThemeContext';
import Toast from 'react-native-toast-message';
import { AuthProvider, useAuth } from '@/ctx/AuthContext';
import { ThemedText } from '@/components/ThemedText';

SplashScreen.preventAutoHideAsync();

function NavigationContent() {
  const { theme } = useTheme();
  const { session } = useAuth();

  return (
    <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer
          screenOptions={({ route }) => ({
            drawerItemStyle: {
              display: [
                '(tabs)',
                session ? 'phone-verify' : 'login',
                'settings',
                'login',
                'news',
                'chatroom',
                '+not-found',
              ].includes(route.name) ? 'flex' : 'none'
            }
          })}
        >
          <Drawer.Screen
            name="(tabs)"
            options={{
              headerShown: true,
              title: 'Home',
              drawerLabel: 'Home',
            }}
          />
          <Drawer.Screen
            name="login"
            options={{
              headerShown: true,
              title: '',
              drawerLabel: 'Login'
            }}
          />
          <Drawer.Screen
            name="settings"
            options={{
              headerShown: true,
              title: 'Settings',
              drawerLabel: 'Settings'
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
  );
}

export default function RootLayout() {
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
    <ThemeContextProvider>
      <Provider store={store}>
        <AuthProvider>
          <NavigationContent />
        </AuthProvider>
      </Provider>
      <Toast />
    </ThemeContextProvider>
  );
}
