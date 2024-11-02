import { TextInput, Image, StyleSheet, Pressable, ActivityIndicator, ScrollView, KeyboardAvoidingView, View, Text, Platform } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useState } from 'react';
import { useTheme } from '@/ctx/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { getTranslation } from '@/constants/i18n';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/ctx/AuthContext';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';

interface LoginScreenProps {
    onClose?: () => void;
}

const LoginScreen = ({ onClose }: LoginScreenProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { theme: themeMode } = useTheme();
    const theme = Colors[themeMode ?? 'light'];
    const { currentLanguage } = useLanguage();
    const t = getTranslation(currentLanguage);
    const { login, loginWithGoogle, loginWithFacebook } = useAuth();

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validate = () => {
        const newErrors = { email: '', password: '' };
        let isValid = true;

        if (!email) {
            newErrors.email = t.login.emailRequired;
            isValid = false;
        } else if (!validateEmail(email)) {
            newErrors.email = t.login.invalidEmail;
            isValid = false;
        }

        if (!password) {
            newErrors.password = t.login.passwordRequired;
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleLogin = async () => {
        if (!validate()) return;

        setIsLoading(true);

        try {
            await login(email, password);
            Toast.show({
                type: 'success',
                text1: t.login.loginSuccess,
                text2: t.login.welcomeBack,
                position: 'bottom',
                visibilityTime: 3000,
            });
            onClose?.();
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: t.login.loginFailed,
                text2: t.login.loginFailedMessage,
                position: 'bottom',
                visibilityTime: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = async (provider: 'Google' | 'Facebook') => {
        setIsLoading(true);
        try {
            if (provider === 'Google') {
                await loginWithGoogle();
                onClose?.();

            } else {
                await loginWithFacebook();
                onClose?.();

            }
            Toast.show({
                type: 'success',
                text1: t.login.loginSuccess + provider,
                text2: t.login.welcomeBack,
                position: 'bottom',
                visibilityTime: 3000,
            });


            // Here you would typically navigate to the main app
            router.push('/');
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: t.login.loginFailed,
                text2: t.login.loginFailedMessage,
                position: 'bottom',
                visibilityTime: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid = email && password && !errors.email && !errors.password;

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: theme.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.handleBar} />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <ThemedText style={styles.title}>{t.login.welcomeBack}</ThemedText>
                    <ThemedText style={[styles.subtitle, { color: theme.secondary.text }]}>
                        {t.login.chooseHowToLogin}
                    </ThemedText>
                </View>

                <ThemedView style={styles.formContainer}>
                    <ThemedView style={styles.socialButtonsContainer}>
                        <Pressable
                            style={[styles.socialButton, {
                                backgroundColor: theme.cardBackground,
                                borderColor: theme.border
                            }]}
                            onPress={() => handleSocialLogin('Google')}
                            disabled={isLoading}
                        >
                            <Image
                                source={require('@/assets/images/google.png')}
                                style={styles.socialIcon}
                            />
                            <ThemedText style={styles.socialButtonText}>
                                {t.login.continueWithGoogle}
                            </ThemedText>
                        </Pressable>

                        <Pressable
                            style={[styles.socialButton, {
                                backgroundColor: theme.cardBackground,
                                borderColor: theme.border
                            }]}
                            onPress={() => handleSocialLogin('Facebook')}
                            disabled={isLoading}
                        >
                            <Image
                                source={require('@/assets/images/facebook.png')}
                                style={styles.socialIcon}
                            />
                            <ThemedText style={styles.socialButtonText}>
                                {t.login.continueWithFacebook}
                            </ThemedText>
                        </Pressable>
                    </ThemedView>

                    <ThemedView style={styles.dividerContainer}>
                        <ThemedView style={[styles.divider, { backgroundColor: theme.border }]} />
                        <ThemedText style={[styles.orText, { color: theme.secondary.text }]}>
                            {t.login.orContinueWithEmail}
                        </ThemedText>
                        <ThemedView style={[styles.divider, { backgroundColor: theme.border }]} />
                    </ThemedView>

                    <ThemedView style={styles.form}>
                        <ThemedView style={styles.inputContainer}>
                            <ThemedText style={styles.label}>{t.login.email}</ThemedText>
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        color: theme.text,
                                        backgroundColor: theme.inputBackground,
                                        borderColor: errors.email ? theme.error : theme.border,
                                    }
                                ]}
                                value={email}
                                onChangeText={(text) => {
                                    setEmail(text);
                                    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                                }}
                                placeholder={t.login.emailPlaceholder}
                                placeholderTextColor={theme.secondary.text}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                            {errors.email ? (
                                <ThemedText style={styles.errorText}>{errors.email}</ThemedText>
                            ) : null}
                        </ThemedView>

                        <ThemedView style={styles.inputContainer}>
                            <ThemedText style={styles.label}>{t.login.password}</ThemedText>
                            <ThemedView style={styles.passwordContainer}>
                                <TextInput
                                    style={[
                                        styles.passwordInput,
                                        {
                                            color: theme.text,
                                            backgroundColor: theme.inputBackground,
                                            borderColor: errors.password
                                                ? theme.error
                                                : theme.border,
                                        }
                                    ]}
                                    value={password}
                                    onChangeText={(text) => {
                                        setPassword(text);
                                        if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                                    }}
                                    placeholder={t.login.passwordPlaceholder}
                                    placeholderTextColor={theme.secondary.text}
                                    secureTextEntry={!showPassword}
                                />
                                <Pressable
                                    style={styles.eyeButton}
                                    onPress={() => setShowPassword(!showPassword)}
                                >
                                    <Ionicons
                                        name={showPassword ? 'eye-off' : 'eye'}
                                        size={24}
                                        color={theme.secondary.text}
                                    />
                                </Pressable>
                            </ThemedView>
                            {errors.password && (
                                <ThemedText style={styles.errorText}>{errors.password}</ThemedText>
                            )}
                        </ThemedView>

                        <Pressable
                            style={styles.forgotPassword}
                            onPress={() => router.push('/')}
                        >
                            <ThemedText style={[styles.link, { color: theme.tint }]}>
                                {t.login.forgotPassword}
                            </ThemedText>
                        </Pressable>

                        <Pressable
                            style={[
                                styles.button,
                                { backgroundColor: theme.tint },
                                (!isFormValid || isLoading) && {
                                    opacity: 0.5
                                }
                            ]}
                            onPress={handleLogin}
                            disabled={!isFormValid || isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color={theme.background} />
                            ) : (
                                <ThemedText style={[styles.buttonText, {
                                    color: theme.background
                                }]}>
                                    {t.login.logIn}
                                </ThemedText>
                            )}
                        </Pressable>
                    </ThemedView>

                    <ThemedView style={styles.footer}>
                        <ThemedText style={{ color: theme.text }}>
                            {t.login.noAccount}{' '}
                        </ThemedText>
                        <Pressable onPress={() => router.push('/signup')}>
                            <ThemedText style={[styles.link, { color: theme.tint }]}>
                                {t.login.signUp}
                            </ThemedText>
                        </Pressable>
                    </ThemedView>
                </ThemedView>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    handleBar: {
        width: 36,
        height: 5,
        backgroundColor: '#DEDEDE',
        borderRadius: 3,
        alignSelf: 'center',
        marginVertical: 8,
    },
    scrollContent: {
        flexGrow: 1,
    },
    formContainer: {
        flex: 1,
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
    },
    socialButtonsContainer: {
        gap: 12,
        marginBottom: 24,
    },
    socialButton: {
        height: 44,
        borderRadius: 8,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 16,
    },
    socialIcon: {
        width: 24,
        height: 24,
        marginRight: 12,
    },
    socialButtonText: {
        fontSize: 16,
        fontWeight: '500',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32,
        gap: 16,
    },
    divider: {
        flex: 1,
        height: 1,
    },
    orText: {
        fontSize: 14,
    },
    form: {
        gap: 16,
    },
    inputContainer: {
        gap: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    passwordInput: {
        height: 48,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        flex: 1,
    },
    eyeButton: {
        position: 'absolute',
        right: 12,
        height: 48,
        justifyContent: 'center',
        padding: 4,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 8,
    },
    button: {
        height: 48,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
    link: {
        fontWeight: '600',
    },
    errorText: {
        color: '#dc2626',
        fontSize: 12,
        marginTop: 4,
    },
    errorContainer: {
        backgroundColor: '#fee2e2',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        padding: 8,
        zIndex: 1,
    },
});

export default LoginScreen;