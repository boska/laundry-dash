import { Text, TextProps } from 'react-native';
import { useTheme } from '@/ctx/ThemeContext';

export function ThemedText(props: TextProps) {
  const { colors } = useTheme();
  const { style, ...otherProps } = props;

  return (
    <Text
      style={[
        { color: colors.text },
        style
      ]}
      {...otherProps}
    />
  );
}
