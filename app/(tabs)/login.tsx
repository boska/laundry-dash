import { StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useState } from 'react';
import { Link, router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SafeAreaView } from 'react-native-safe-area-context';
const LoginScreen = () => {
const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const colorScheme = useColorScheme();

  const handleSignUpPress = () => {
    router.push('/signup');
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <ThemedText type="title" style={styles.title}>Sign in to your Account</ThemedText>
      <ThemedText style={styles.subtitle}>Enter your email and password to log in</ThemedText>

      {/* Form */}
      <ThemedText style={[styles.label, emailError && styles.errorLabel]}>Email</ThemedText>
      <TextInput
        style={[
          styles.input,
          {
            color: Colors[colorScheme ?? 'light'].text,
            borderColor: emailError ? '#EF4444' : Colors[colorScheme ?? 'light'].tabIconDefault,
          }
        ]}
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setEmailError(false);
        }}
        placeholder="Enter your email"
        placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <ThemedText style={[styles.label, passwordError && styles.errorLabel]}>Password</ThemedText>
      <TextInput
        style={[
          styles.input,
          {
            color: Colors[colorScheme ?? 'light'].text,
            borderColor: passwordError ? '#EF4444' : Colors[colorScheme ?? 'light'].tabIconDefault,
          }
        ]}
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setPasswordError(false);
        }}
        placeholder="Enter your password"
        placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
        secureTextEntry
      />

      <TouchableOpacity 
        style={styles.forgotPassword}
        onPress={() => router.push('/forgot-password')}
      >
        <ThemedText style={{ color: '#3B82F6' }}>Forgot Password?</ThemedText>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity
        style={styles.loginButton}
        disabled={isLoading}
        onPress={async () => {
          setEmailError(!email.trim());
          setPasswordError(!password.trim());
          if (email.trim() && password.trim()) {
            setIsLoading(true);
            try {
              // Your login logic here
              await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated delay
              console.log('Login pressed');
            } finally {
              setIsLoading(false);
            }
          }
        }}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <ThemedText style={styles.loginButtonText}>Log In</ThemedText>
        )}
      </TouchableOpacity>

      <ThemedText style={styles.orText}>Or</ThemedText>

      {/* Social Logins */}
      <TouchableOpacity style={styles.socialButton}>
        <Image 
          source={require('@/assets/images/google.png')} 
          style={styles.socialIcon} 
        />
        <ThemedText style={styles.socialButtonText}>Continue with Google</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton}>
        <Image 
          source={require('@/assets/images/facebook.png')} 
          style={styles.socialIcon} 
        />
        <ThemedText style={styles.socialButtonText}>Continue with Facebook</ThemedText>
      </TouchableOpacity>

      {/* Sign Up Link */}
      <ThemedView style={styles.signupContainer}>
        <ThemedText>Don't have an account? </ThemedText>
        <TouchableOpacity onPress={handleSignUpPress}>
          <ThemedText style={{ color: '#3B82F6' }}>Sign Up</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 72,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#6B7280',
    marginBottom: 32,
  },
  label: {
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: '#3B82F6',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonText: {
    color: 'white',
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
    marginBottom: 16,
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
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 48,
    marginBottom: 24,
  },
  errorLabel: {
    color: '#EF4444',
  },
});

export default LoginScreen;