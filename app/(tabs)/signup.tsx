import { TextInput, StyleSheet, Pressable, Animated, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Stack } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const SignupScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const colorScheme = useColorScheme();

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

  const handleSignUp = async () => {
    setIsLoading(true);
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Sign up pressed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Sign Up',
          headerShown: false,
        }} 
      />
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
                  borderColor: Colors[colorScheme ?? 'light'].tabIconDefault,
                }
              ]}
              placeholder="Enter your email"
              placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </ThemedView>

          <ThemedView style={styles.inputContainer}>
            <ThemedText style={styles.label}>Password</ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  color: Colors[colorScheme ?? 'light'].text,
                  borderColor: Colors[colorScheme ?? 'light'].tabIconDefault,
                }
              ]}
              placeholder="Enter your password"
              placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            {password.length > 0 && (
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
            style={[styles.button, isLoading && styles.buttonDisabled]} 
            onPress={handleSignUp}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.buttonText}>Sign Up</ThemedText>
            )}
          </Pressable>

          <ThemedView style={styles.footer}>
            <ThemedText>Already have an account? </ThemedText>
            <Link href="/" asChild>
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
    opacity: 0.7,
  },
});

export default SignupScreen;

