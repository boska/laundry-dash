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
import { Pressable, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

SplashScreen.preventAutoHideAsync();

function NavigationContent() {
  const { theme } = useTheme();
  const { session } = useAuth();

  const DrawerButton = () => {
    const navigation = useNavigation();
    const colorScheme = useColorScheme();
    const tintColor = Colors[colorScheme ?? 'light'].tint;

    return (
      <Pressable
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        style={({ pressed }) => ({
          marginLeft: 16,
          opacity: Platform.OS === 'ios' ? (pressed ? 0.7 : 1) : 1,
          padding: 8,
        })}
        android_ripple={{
          color: `${tintColor}40`,
          borderless: true,
          radius: 20,
        }}
      >
        <FontAwesome
          name="bars"
          size={24}
          color={tintColor}
        />
      </Pressable>
    );
  };

  return (
    <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer
          screenOptions={({ route }) => ({
            headerLeft: () => <DrawerButton />,
            drawerStyle: {

            },
            //  drawerActiveTintColor: '',
            drawerItemStyle: {
              display: [
                '(tabs)',
                session ? 'phone-verify' : 'login',
                'settings',
                'login',
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
