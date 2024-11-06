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
import { AuthProvider } from '@/ctx/AuthContext';
import { DrawerButton } from '@/components/navigation/DrawerButton';
import { Modal, Pressable } from 'react-native';
import LoginScreen from './login';
import { FontAwesome } from '@expo/vector-icons';

SplashScreen.preventAutoHideAsync();

const DRAWER_SCREENS = [
  {
    name: '(tabs)' as const,
    options: {
      headerShown: true,
      title: '',
      drawerLabel: 'Home',
    }
  },
  {
    name: 'blog' as const,
    options: {
      headerShown: true,
      title: 'Blog',
      drawerLabel: 'Blog',
    }
  },
  {
    name: 'chatroom' as const,
    options: {
      headerShown: true,
      title: 'Support',
      drawerLabel: 'Support'
    }
  },
  {
    name: 'order/[id]' as const,
    options: {
      headerShown: true,
      title: 'LaundryDash',
      drawerLabel: 'Orders',
    }
  },
  {
    name: 'settings' as const,
    options: {
      headerShown: true,
      title: 'Settings',
      drawerLabel: 'Settings'
    }
  },
] as const;

function NavigationContent() {
  const { colors } = useTheme();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const getDrawerItemVisibility = (routeName: string) => {
    return DRAWER_SCREENS.some(screen => screen.name === routeName) ? 'flex' : 'none';
  };

  return (
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
                color={colors.tint}
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
