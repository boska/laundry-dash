import { View, ViewProps } from 'react-native';
import { useTheme } from '@/ctx/ThemeContext';

export function ThemedView(props: ViewProps) {
  const { colors } = useTheme();
  const { style, ...otherProps } = props;

  return (
    <View
      style={[
        { backgroundColor: colors.background },
        style
      ]}
      {...otherProps}
    />
  );
}
