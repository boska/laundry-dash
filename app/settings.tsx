import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '../ctx/ThemeContext';
import { useLanguage } from '@/hooks/useLanguage';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { getTranslation } from '@/constants/i18n';
import { useAuth } from '@/ctx/AuthContext';

export default function SettingsScreen() {
  const { theme, themeMode, setThemeMode } = useTheme();
  const { currentLanguage, changeLanguage } = useLanguage();
  const { signOut } = useAuth();
  const t = getTranslation(currentLanguage);

  const themeOptions: { label: string; value: 'system' | 'light' | 'dark' }[] = [
    { label: t.settings.theme.system, value: 'system' },
    { label: t.settings.theme.light, value: 'light' },
    { label: t.settings.theme.dark, value: 'dark' },
  ];

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.list}>
        {/* Language Setting */}
        <TouchableOpacity
          style={styles.listItem}
          onPress={() => changeLanguage(currentLanguage === 'en' ? 'zh-TW' : 'en')}
        >
          <ThemedView style={styles.itemContent}>
            <Ionicons
              name="language"
              size={22}
              color={Colors[theme ?? 'light'].text}
              style={styles.icon}
            />
            <ThemedView>
              <ThemedText style={styles.itemLabel}>
                {t.settings.language.title}
              </ThemedText>
              <ThemedText style={styles.itemValue}>
                {currentLanguage === 'en'
                  ? t.settings.language.english
                  : t.settings.language.chinese}
              </ThemedText>
            </ThemedView>
          </ThemedView>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={Colors[theme ?? 'light'].text}
          />
        </TouchableOpacity>

        {/* Theme Setting */}
        {themeOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={styles.listItem}
            onPress={() => setThemeMode(option.value)}
          >
            <ThemedView style={styles.itemContent}>
              <Ionicons
                name={option.value === 'system' ? 'phone-portrait' : option.value === 'light' ? 'sunny' : 'moon'}
                size={22}
                color={Colors[theme ?? 'light'].text}
                style={styles.icon}
              />
              <ThemedText style={styles.itemLabel}>{option.label}</ThemedText>
            </ThemedView>
            {themeMode === option.value && (
              <Ionicons
                name="checkmark"
                size={22}
                color={Colors[theme ?? 'light'].tint}
              />
            )}
          </TouchableOpacity>
        ))}

        {/* Sign Out Button */}
        <TouchableOpacity
          style={styles.listItem}
          onPress={signOut}
        >
          <ThemedView style={styles.itemContent}>
            <Ionicons
              name="log-out"
              size={22}
              color={Colors[theme ?? 'light'].text}
              style={styles.icon}
            />
            <ThemedText style={styles.itemLabel}>{t.settings.signOut}</ThemedText>
          </ThemedView>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={Colors[theme ?? 'light'].text}
          />
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  list: {
    borderRadius: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.light.text + '20',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  itemLabel: {
    fontSize: 17,
  },
  itemValue: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 2,
  },
  signOutButton: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.light.text + '20',
  },
  signOutText: {
    fontSize: 17,
    color: Colors.red,
  },
});
