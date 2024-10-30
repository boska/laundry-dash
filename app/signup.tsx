import { TextInput, StyleSheet, Pressable, Animated, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Stack } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';

const SignupScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const colorScheme = useColorScheme();

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

    const isFormValid = email && password && passwordStrength.strength !== 'weak' &&
        !errors.email && !errors.password;

    return (
        <>
            <ThemedView style={styles.container}>
                <ThemedView style={styles.header}>
                    <ThemedText type="title" style={styles.title}>Create your Account</ThemedText>
                    <ThemedText style={[styles.subtitle, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                        Enter your email and password to sign up
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
                            placeholder="Enter your email"
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
                                placeholder="Enter your password"
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
                        ) : password.length > 0 && (
                            <ThemedView style={styles.strengthIndicatorContainer}>
                                <ThemedView
                                    style={[
                                        styles.strengthBar,
                                        {
                                            width: password.length === 0 ? 0 :
                                                passwordStrength.strength === 'weak' ? '33%' :
                                                    passwordStrength.strength === 'medium' ? '66%' : '100%',
                                            backgroundColor: passwordStrength.color
                                        }
                                    ]}
                                />
                                <ThemedText style={[styles.strengthText, { color: passwordStrength.color }]}>
                                    {passwordStrength.message}
                                </ThemedText>
                            </ThemedView>
                        )}
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
                            <ThemedText style={styles.buttonText}>Sign Up</ThemedText>
                        )}
                    </Pressable>

                    <ThemedView style={styles.footer}>
                        <ThemedText>Already have an account? </ThemedText>
                        <Link href="/login" asChild>
                            <Pressable>
                                <ThemedText style={styles.link}>Log In</ThemedText>
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
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    button: {
        height: 48,
        backgroundColor: '#3b82f6',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
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
    strengthIndicatorContainer: {
        marginTop: 6,
        gap: 4,
    },
    strengthBar: {
        height: 4,
        borderRadius: 2,
        backgroundColor: '#dc2626',
    },
    strengthText: {
        fontSize: 12,
        alignSelf: 'flex-end',
    },
    buttonDisabled: {
        opacity: 0.5,
        backgroundColor: '#93c5fd',
    },
    errorText: {
        color: '#dc2626',
        fontSize: 12,
        marginTop: 4,
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
});

export default SignupScreen;

