import { TextInput, StyleSheet, Pressable, Animated, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Stack } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { getTranslation } from '@/constants/i18n';
import { useLanguage } from '@/hooks/useLanguage';

const SignupScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const colorScheme = useColorScheme();
    const { currentLanguage } = useLanguage();
    const t = getTranslation(currentLanguage);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const getPasswordStrength = (pass: string): {
        strength: 'weak' | 'medium' | 'strong',
        message: string,
        color: string
    } => {
        if (pass.length === 0) return { strength: 'weak', message: '', color: '#dc2626' };
        if (pass.length < 6) return { strength: 'weak', message: 'Too weak', color: '#dc2626' };

        const hasLetter = /[a-zA-Z]/.test(pass);
        const hasNumber = /[0-9]/.test(pass);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);

        if (hasLetter && hasNumber && hasSpecial && pass.length >= 8) {
            return { strength: 'strong', message: 'Strong password', color: '#16a34a' };
        } else if ((hasLetter && hasNumber) || (hasLetter && hasSpecial) || (hasNumber && hasSpecial)) {
            return { strength: 'medium', message: 'Could be stronger', color: '#ca8a04' };
        }
        return { strength: 'weak', message: 'Too weak', color: '#dc2626' };
    };

    const passwordStrength = getPasswordStrength(password);

    const validate = () => {
        const newErrors = { email: '', password: '' };
        let isValid = true;

        // Email validation
        if (!email) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!validateEmail(email)) {
            newErrors.email = 'Please enter a valid email';
            isValid = false;
        }

        // Password validation
        if (!password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (passwordStrength.strength === 'weak') {
            newErrors.password = 'Password is too weak';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSignUp = async () => {
        if (!validate()) return;

        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log('Sign up credentials:', {
                email: email.trim(),
                password: password,
                passwordStrength: passwordStrength.strength
            });
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid = email && password && !errors.email && !errors.password;

    return (
        <>
            <ThemedView style={styles.container}>
                <ThemedView style={styles.header}>
                    <ThemedText type="title" style={styles.title}>{t.signup.createAccount}</ThemedText>
                    <ThemedText style={[styles.subtitle, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                        {t.signup.enterEmailAndPassword}
                    </ThemedText>
                </ThemedView>

                <ThemedView style={styles.form}>
                    <ThemedView style={styles.inputContainer}>
                        <ThemedText style={styles.label}>{t.signup.email}</ThemedText>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    color: Colors[colorScheme ?? 'light'].text,
                                    borderColor: errors.email
                                        ? '#dc2626'
                                        : Colors[colorScheme ?? 'light'].tabIconDefault,
                                }
                            ]}
                            placeholder={t.signup.emailPlaceholder}
                            placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                            }}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        {errors.email ? (
                            <ThemedText style={styles.errorText}>{errors.email}</ThemedText>
                        ) : null}
                    </ThemedView>

                    <ThemedView style={styles.inputContainer}>
                        <ThemedText style={styles.label}>{t.signup.password}</ThemedText>
                        <ThemedView style={styles.passwordContainer}>
                            <TextInput
                                style={[
                                    styles.passwordInput,
                                    {
                                        color: Colors[colorScheme ?? 'light'].text,
                                        borderColor: errors.password
                                            ? '#dc2626'
                                            : Colors[colorScheme ?? 'light'].tabIconDefault,
                                    }
                                ]}
                                placeholder={t.signup.passwordPlaceholder}
                                placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text);
                                    if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                                }}
                                secureTextEntry={!showPassword}
                            />
                            <Pressable
                                style={styles.eyeButton}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Ionicons
                                    name={showPassword ? 'eye-off' : 'eye'}
                                    size={24}
                                    color={Colors[colorScheme ?? 'light'].tabIconDefault}
                                />
                            </Pressable>
                        </ThemedView>
                        {errors.password ? (
                            <ThemedText style={styles.errorText}>{errors.password}</ThemedText>
                        ) : null}
                    </ThemedView>

                    <Pressable
                        style={[
                            styles.button,
                            (!isFormValid || isLoading) && styles.buttonDisabled
                        ]}
                        onPress={handleSignUp}
                        disabled={!isFormValid || isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <ThemedText style={styles.buttonText}>{t.signup.signUp}</ThemedText>
                        )}
                    </Pressable>

                    <ThemedView style={styles.footer}>
                        <ThemedText>{t.signup.alreadyHaveAccount} </ThemedText>
                        <Link href="/login" asChild>
                            <Pressable>
                                <ThemedText style={styles.link}>{t.signup.logIn}</ThemedText>
                            </Pressable>
                        </Link>
                    </ThemedView>
                </ThemedView>
            </ThemedView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        marginTop: 32,
        marginBottom: 32,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
    },
    form: {
        padding: 24,
    },
    inputContainer: {
        marginBottom: 16,
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
        color: '#fff',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
    link: {
        fontWeight: '600',
        color: '#007AFF',
    },
    errorText: {
        color: '#dc2626',
        fontSize: 12,
        marginTop: 4,
    },
});

export default SignupScreen;

