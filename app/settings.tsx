import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTheme } from '../ctx/ThemeContext';
import { useLanguage } from '@/hooks/useLanguage';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { getTranslation } from '@/constants/i18n';

export default function SettingsScreen() {
  const { theme } = useTheme();
  const { currentLanguage, changeLanguage } = useLanguage();
  const t = getTranslation(currentLanguage);

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
        <ThemedView style={styles.listItem}>
          <ThemedView style={styles.itemContent}>
            <Ionicons
              name="moon"
              size={22}
              color={Colors[theme ?? 'light'].text}
              style={styles.icon}
            />
            <ThemedText style={styles.itemLabel}>
              {t.settings.theme.title}
            </ThemedText>
          </ThemedView>
          <ThemeToggle />
        </ThemedView>
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
});
