import { TextInput, StyleSheet, Pressable, ActivityIndicator, Image } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useState } from 'react';
import { Link, router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const colorScheme = useColorScheme();

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
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log('Login credentials:', {
                email: email.trim(),
                password: password
            });

            router.push('/chatroom');
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid = email && password && !errors.email && !errors.password;

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.header}>
                <ThemedText type="title" style={styles.title}>Ohahhaha!</ThemedText>
                <ThemedText style={[styles.subtitle, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                    Enter your email and password to log in
                </ThemedText>
            </ThemedView>

            <ThemedView style={styles.form}>
                <ThemedView style={styles.inputContainer}>
                    <ThemedText style={styles.label}>Email</ThemedText>
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
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                        }}
                        placeholder="Enter your email"
                        placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
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
                                    color: Colors[colorScheme ?? 'light'].text,
                                    borderColor: errors.password
                                        ? '#dc2626'
                                        : Colors[colorScheme ?? 'light'].tabIconDefault,
                                }
                            ]}
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                            }}
                            placeholder="Enter your password"
                            placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
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
                    {errors.password && (
                        <ThemedText style={styles.errorText}>{errors.password}</ThemedText>
                    )}
                </ThemedView>

                <Pressable
                    style={styles.forgotPassword}
                    onPress={() => router.push('/avatar')}
                >
                    <ThemedText style={styles.link}>Forgot Password?</ThemedText>
                </Pressable>

                <Pressable
                    style={[
                        styles.button,
                        (!isFormValid || isLoading) && styles.buttonDisabled
                    ]}
                    onPress={handleLogin}
                    disabled={!isFormValid || isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <ThemedText style={styles.buttonText}>Log In</ThemedText>
                    )}
                </Pressable>

                <ThemedText style={styles.orText}>Or</ThemedText>

                <Pressable style={styles.socialButton}>
                    <Image
                        source={require('@/assets/images/google.png')}
                        style={styles.socialIcon}
                    />
                    <ThemedText style={styles.socialButtonText}>Continue with Google</ThemedText>
                </Pressable>

                <Pressable style={styles.socialButton}>
                    <Image
                        source={require('@/assets/images/facebook.png')}
                        style={styles.socialIcon}
                    />
                    <ThemedText style={styles.socialButtonText}>Continue with Facebook</ThemedText>
                </Pressable>

                <ThemedView style={styles.footer}>
                    <ThemedText>Don't have an account? </ThemedText>
                    <Pressable onPress={() => router.push('/(tabs)/signup')}>
                        <ThemedText style={styles.link}>Sign Up</ThemedText>
                    </Pressable>
                </ThemedView>
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },
    header: {
        marginTop: 40,
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
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
        backgroundColor: '#3b82f6',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    buttonDisabled: {
        opacity: 0.5,
        backgroundColor: '#93c5fd',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    orText: {
        textAlign: 'center',
        marginVertical: 16,
        color: '#6B7280',
    },
    socialButton: {
        height: 48,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    socialIcon: {
        width: 24,
        height: 24,
        marginRight: 12,
    },
    socialButtonText: {
        fontSize: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
    link: {
        color: '#3b82f6',
        fontWeight: '600',
    },
    errorText: {
        color: '#dc2626',
        fontSize: 12,
        marginTop: 4,
    },
});

export default LoginScreen;