import { StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useState } from 'react';
import { Link } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <ThemedView style={styles.container}>
          {/* Header */}
          <ThemedText type="title" style={styles.title}>Sign in to your Account</ThemedText>
          <ThemedText style={styles.subtitle}>Enter your email and password to log in</ThemedText>

          {/* Form */}
          <ThemedText style={styles.label}>Email</ThemedText>
          <TextInput
            style={[
              styles.input,
              { 
                color: Colors[colorScheme ?? 'light'].text,
                borderColor: Colors[colorScheme ?? 'light'].tabIconDefault,
              }
            ]}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <ThemedText style={styles.label}>Password</ThemedText>
          <TextInput
            style={[
              styles.input,
              { 
                color: Colors[colorScheme ?? 'light'].text,
                borderColor: Colors[colorScheme ?? 'light'].tabIconDefault,
              }
            ]}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
            secureTextEntry
          />

          <Link href="/forgot-password" style={styles.forgotPassword}>
            <ThemedText style={{ color: '#3B82F6' }}>Forgot Password?</ThemedText>
          </Link>

          {/* Login Button */}
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => console.log('Login pressed')}
          >
            <ThemedText style={styles.loginButtonText}>Log In</ThemedText>
          </TouchableOpacity>

          <ThemedText style={styles.orText}>Or</ThemedText>

          {/* Social Logins */}
          <TouchableOpacity style={styles.socialButton}>
            <ThemedText style={styles.socialButtonText}>Continue with Google</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton}>
            <ThemedText style={styles.socialButtonText}>Continue with Facebook</ThemedText>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <ThemedView style={styles.signupContainer}>
            <ThemedText>Don't have an account? </ThemedText>
            <Link href="/signup">
              <ThemedText style={{ color: '#3B82F6' }}>Sign Up</ThemedText>
            </Link>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 48,
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
});
