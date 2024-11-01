import { View } from 'react-native';
import { useTheme } from '../ctx/ThemeContext';
import { Colors } from '@/constants/Colors';

export function ThemedView(props: React.ComponentProps<typeof View>) {
  const { theme } = useTheme();

  return (
    <View
      {...props}
      style={[
        {
          backgroundColor: Colors[theme ?? 'light'].background,
        },
        props.style,
      ]}
    />
  );
}
