import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';

export default function ExploreScreen() {
  const colorScheme = useColorScheme();

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
        onPress={() => {
          // Note: useColorScheme from react-native doesn't allow setting the theme
          console.log('Current theme:', colorScheme);
        }}
      >
        <ThemedText style={styles.buttonText}>
          Current Theme: {colorScheme}
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    padding: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
