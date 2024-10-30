import { Tabs } from 'expo-router';
import { usePathname } from 'expo-router';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { LaundryDash } from '@/components/LaundryDash';

export default function TabLayout2() {
  const colorScheme = useColorScheme();
  return (
    <>
      <LaundryDash colorScheme={colorScheme as 'light' | 'dark' | null} />
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
