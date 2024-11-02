import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { ThemeProvider as ThemeContextProvider, useTheme } from '../ctx/ThemeContext';
import Toast from 'react-native-toast-message';
import { AuthProvider, useAuth } from '@/ctx/AuthContext';
import { DrawerButton } from '@/components/navigation/DrawerButton';
import { Modal, Pressable } from 'react-native';
import LoginScreen from './login';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

SplashScreen.preventAutoHideAsync();

const DRAWER_SCREENS = [
  {
    name: '(tabs)',
    options: {
      headerShown: true,
      title: 'LaundryDash',
      drawerLabel: 'Home',
    }
  },
  {
    name: 'settings',
    options: {
      headerShown: true,
      title: 'Settings',
      drawerLabel: 'Settings'
    }
  },
  {
    name: 'chatroom',
    options: {
      headerShown: true,
      title: 'Support',
      drawerLabel: 'Support'
    }
  }
] as const;

function NavigationContent() {
  const { theme } = useTheme();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const getDrawerItemVisibility = (routeName: string) => {
    const visibleRoutes = [
      '(tabs)',
      'settings',
      'chatroom',
    ];
    return visibleRoutes.includes(routeName) ? 'flex' : 'none';
  };

  return (
    <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer
          screenOptions={({ route }) => ({
            headerLeft: () => <DrawerButton />,
            headerRight: () => (
              <Pressable
                onPress={() => setShowLoginModal(true)}
                style={{ marginRight: 16 }}
              >
                <FontAwesome
                  name="user"
                  size={24}
                  color={Colors[theme ?? 'light'].tint}
                />
              </Pressable>
            ),
            drawerItemStyle: {
              display: getDrawerItemVisibility(route.name)
            }
          })}
        >
          {DRAWER_SCREENS.map((screen) => (
            <Drawer.Screen
              key={screen.name}
              name={screen.name}
              options={screen.options}
            />
          ))}
        </Drawer>

        <Modal
          visible={showLoginModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowLoginModal(false)}
        >
          <LoginScreen onClose={() => setShowLoginModal(false)} />
        </Modal>
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
