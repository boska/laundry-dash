import { Pressable, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export const DrawerButton = () => {
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