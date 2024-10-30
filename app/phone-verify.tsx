import { TextInput, StyleSheet, Pressable, ActivityIndicator, Modal, FlatList } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useState } from 'react';
import { Stack, router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';

// You can expand this list as needed
const countryCodes = [
    { code: '+1', country: 'United States' },
    { code: '+44', country: 'United Kingdom' },
    { code: '+86', country: 'China' },
    { code: '+81', country: 'Japan' },
    { code: '+82', country: 'South Korea' },
    { code: '+91', country: 'India' },
    { code: '+61', country: 'Australia' },
    // Add more country codes as needed
];

const PhoneNumberScreen = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
    const [showCountryModal, setShowCountryModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const colorScheme = useColorScheme();

    const validatePhoneNumber = (number: string) => {
        return /^\d{10}$/.test(number);
    };

    const handleRequestOTP = async () => {
        if (!validatePhoneNumber(phoneNumber)) {
            setError('Please enter a valid phone number');
            return;
        }

        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log('Phone verification request:', {
                countryCode: selectedCountry.code,
                phoneNumber: phoneNumber
            });
            // Navigate to OTP verification screen or handle the next step
            // router.push('/otp-verification');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePhoneNumberChange = (text: string) => {
        // Only allow numeric characters
        const numericValue = text.replace(/[^0-9]/g, '');
        setPhoneNumber(numericValue);
        if (error) setError('');
    };

    return (
        <>
            <ThemedView style={styles.container}>
                <ThemedView style={styles.header}>
                    <ThemedText type="title" style={styles.title}>Verify Your Phone</ThemedText>
                    <ThemedText style={[styles.subtitle, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                        Enter your phone number to receive a verification code
                    </ThemedText>
                </ThemedView>

                <ThemedView style={styles.form}>
                    <ThemedView style={styles.inputContainer}>
                        <ThemedText style={styles.label}>Phone Number</ThemedText>
                        <ThemedView style={styles.phoneInputContainer}>
                            <Pressable
                                style={[styles.countryCodeButton, {
                                    borderColor: Colors[colorScheme ?? 'light'].tabIconDefault
                                }]}
                                onPress={() => setShowCountryModal(true)}
                            >
                                <ThemedText>{selectedCountry.code}</ThemedText>
                                <Ionicons
                                    name="chevron-down"
                                    size={20}
                                    color={Colors[colorScheme ?? 'light'].tabIconDefault}
                                />
                            </Pressable>
                            <TextInput
                                style={[
                                    styles.phoneInput,
                                    {
                                        color: Colors[colorScheme ?? 'light'].text,
                                        borderColor: error
                                            ? '#dc2626'
                                            : Colors[colorScheme ?? 'light'].tabIconDefault,
                                    }
                                ]}
                                value={phoneNumber}
                                onChangeText={handlePhoneNumberChange}
                                placeholder="Enter phone number"
                                placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
                                keyboardType="numeric"
                                maxLength={10}
                            />
                        </ThemedView>
                        {error ? (
                            <ThemedText style={styles.errorText}>{error}</ThemedText>
                        ) : null}
                    </ThemedView>

                    <Pressable
                        style={[
                            styles.button,
                            (!phoneNumber || isLoading) && styles.buttonDisabled
                        ]}
                        onPress={handleRequestOTP}
                        disabled={!phoneNumber || isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <ThemedText style={styles.buttonText}>Request OTP</ThemedText>
                        )}
                    </Pressable>
                </ThemedView>

                <Modal
                    visible={showCountryModal}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setShowCountryModal(false)}
                >
                    <ThemedView style={styles.modalContainer}>
                        <ThemedView style={styles.modalContent}>
                            <ThemedView style={styles.modalHeader}>
                                <ThemedText style={styles.modalTitle}>Select Country</ThemedText>
                                <Pressable onPress={() => setShowCountryModal(false)}>
                                    <Ionicons name="close" size={24} color={Colors[colorScheme ?? 'light'].text} />
                                </Pressable>
                            </ThemedView>
                            <FlatList
                                data={countryCodes}
                                keyExtractor={(item) => item.code}
                                renderItem={({ item }) => (
                                    <Pressable
                                        style={styles.countryItem}
                                        onPress={() => {
                                            setSelectedCountry(item);
                                            setShowCountryModal(false);
                                        }}
                                    >
                                        <ThemedText>{item.country}</ThemedText>
                                        <ThemedText>{item.code}</ThemedText>
                                    </Pressable>
                                )}
                            />
                        </ThemedView>
                    </ThemedView>
                </Modal>
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
    phoneInputContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    countryCodeButton: {
        height: 48,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    phoneInput: {
        flex: 1,
        height: 48,
        borderWidth: 1,
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
    buttonDisabled: {
        opacity: 0.5,
        backgroundColor: '#93c5fd',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    errorText: {
        color: '#dc2626',
        fontSize: 12,
        marginTop: 4,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 16,
        maxHeight: '70%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    countryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
});

export default PhoneNumberScreen; 