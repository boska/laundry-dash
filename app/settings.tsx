import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { View } from 'react-native';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTheme } from '../ctx/ThemeContext';

export default function SettingsScreen() {
  const { theme } = useTheme();

  return (
    <ThemedView style={styles.container}>
      <View style={styles.themeContainer}>
        <ThemedText style={styles.title}>Theme Settings</ThemedText>
        <ThemeToggle />
        <ThemedText style={styles.currentTheme}>
          Current Theme: {theme || 'System Default'}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeContainer: {
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  currentTheme: {
    marginTop: 20,
    fontSize: 16,
  },
});
