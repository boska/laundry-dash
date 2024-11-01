import { TextInput, StyleSheet, Pressable, ActivityIndicator, Image, ScrollView, KeyboardAvoidingView, Platform, View, Text } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useState } from 'react';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

const createToastConfig = (colorScheme: string) => ({
    error: (props: any) => (
        <View style={{
            width: '90%',
            backgroundColor: Colors[colorScheme ?? 'light'].error || '#ff5f5f',
            borderRadius: 12,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            minHeight: 64,
        }}>
            <Ionicons
                name="alert-circle"
                size={24}
                color="white"
                style={{ marginRight: 12 }}
            />
            <View style={{ flex: 1 }}>
                <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: 4,
                }}>
                    {props.text1}
                </Text>
                {props.text2 && (
                    <Text style={{
                        fontSize: 14,
                        color: 'white',
                        opacity: 0.9,
                    }}>
                        {props.text2}
                    </Text>
                )}
            </View>
        </View>
    ),
    success: (props: any) => (
        <View style={{
            width: '90%',
            backgroundColor: Colors[colorScheme ?? 'light'].success || '#22c55e',
            borderRadius: 12,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            minHeight: 64,
        }}>
            <Ionicons
                name="checkmark-circle"
                size={24}
                color="white"
                style={{ marginRight: 12 }}
            />
            <View style={{ flex: 1 }}>
                <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: 4,
                }}>
                    {props.text1}
                </Text>
                {props.text2 && (
                    <Text style={{
                        fontSize: 14,
                        color: 'white',
                        opacity: 0.9,
                    }}>
                        {props.text2}
                    </Text>
                )}
            </View>
        </View>
    ),
});

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validate = () => {
        const newErrors = { email: '', password: '' };
        let isValid = true;

        if (!email) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!validateEmail(email)) {
            newErrors.email = 'Please enter a valid email';
            isValid = false;
        }

        if (!password) {
            newErrors.password = 'Password is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleLogin = async () => {
        if (!validate()) return;

        setIsLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            Toast.show({
                type: 'error',
                text1: 'Login Failed',
                text2: 'Invalid email or password. Please try again.',
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
            <ScrollView
                contentContainerStyle={[styles.scrollContent, { backgroundColor: theme.background }]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <ThemedView style={styles.formContainer}>
                    <ThemedView style={styles.header}>
                        <ThemedText style={styles.title}>Welcome back!</ThemedText>
                        <ThemedText style={[styles.subtitle, { color: theme.secondary.text }]}>
                            Choose how you want to log in
                        </ThemedText>
                    </ThemedView>

                    <ThemedView style={styles.socialButtonsContainer}>
                        <Pressable style={[styles.socialButton, {
                            backgroundColor: theme.cardBackground,
                            borderColor: theme.border
                        }]}>
                            <Image
                                source={require('@/assets/images/google.png')}
                                style={styles.socialIcon}
                            />
                            <ThemedText style={styles.socialButtonText}>Continue with Google</ThemedText>
                        </Pressable>

                        <Pressable style={[styles.socialButton, {
                            backgroundColor: theme.cardBackground,
                            borderColor: theme.border
                        }]}>
                            <Image
                                source={require('@/assets/images/facebook.png')}
                                style={styles.socialIcon}
                            />
                            <ThemedText style={styles.socialButtonText}>Continue with Facebook</ThemedText>
                        </Pressable>
                    </ThemedView>

                    <ThemedView style={styles.dividerContainer}>
                        <ThemedView style={[styles.divider, { backgroundColor: theme.border }]} />
                        <ThemedText style={[styles.orText, { color: theme.secondary.text }]}>
                            Or continue with email
                        </ThemedText>
                        <ThemedView style={[styles.divider, { backgroundColor: theme.border }]} />
                    </ThemedView>

                    <ThemedView style={styles.form}>
                        <ThemedView style={styles.inputContainer}>
                            <ThemedText style={styles.label}>Email</ThemedText>
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
                                placeholder="Enter your email"
                                placeholderTextColor={theme.secondary.text}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                            {errors.email ? (
                                <ThemedText style={styles.errorText}>{errors.email}</ThemedText>
                            ) : null}
                        </ThemedView>

                        <ThemedView style={styles.inputContainer}>
                            <ThemedText style={styles.label}>Password</ThemedText>
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
                                    placeholder="Enter your password"
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
                                Forgot Password?
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
                                    Log In
                                </ThemedText>
                            )}
                        </Pressable>
                    </ThemedView>

                    <ThemedView style={styles.footer}>
                        <ThemedText style={{ color: theme.text }}>
                            Don't have an account?{' '}
                        </ThemedText>
                        <Pressable onPress={() => router.push('/signup')}>
                            <ThemedText style={[styles.link, { color: theme.tint }]}>
                                Sign Up
                            </ThemedText>
                        </Pressable>
                    </ThemedView>
                </ThemedView>
            </ScrollView>
            <Toast
                config={createToastConfig(colorScheme ?? 'light')}
                topOffset={50}
                bottomOffset={40}
            />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    formContainer: {
        flex: 1,
        padding: 24,
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
    socialButtonsContainer: {
        gap: 16,
        marginBottom: 32,
    },
    socialButton: {
        height: 48,
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
});

export default LoginScreen;