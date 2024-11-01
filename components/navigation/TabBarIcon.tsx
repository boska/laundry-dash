import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../ctx/ThemeContext';
import { Colors } from '@/constants/Colors';

export function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  const { theme } = useTheme();

  return (
    <FontAwesome
      size={28}
      style={{ marginBottom: -3 }}
      {...props}
      color={Colors[theme ?? 'light'].text}
    />
  );
}
