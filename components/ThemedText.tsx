import { Text } from 'react-native';
import { useTheme } from '../ctx/ThemeContext';
import { Colors } from '@/constants/Colors';

export function ThemedText(props: React.ComponentProps<typeof Text>) {
  const { theme } = useTheme();

  return (
    <Text
      {...props}
      style={[
        {
          color: Colors[theme ?? 'light'].text,
        },
        props.style,
      ]}
    />
  );
}
