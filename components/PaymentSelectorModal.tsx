import React from 'react';
import { StyleSheet, Pressable, Modal } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const PAYMENT_OPTIONS = [
    { id: 'cash', name: 'Cash', icon: 'money' },
    { id: 'card', name: 'Credit Card', icon: 'credit-card' },
    { id: 'apple', name: 'Apple Pay', icon: 'apple' },
    { id: 'google', name: 'Google Pay', icon: 'google' },
] as const;

const CRYPTO_OPTIONS = [
    { id: 'bitcoin', name: 'Bitcoin', icon: 'bitcoin' },
    { id: 'usdt', name: 'USDT', icon: 'dollar' },
] as const;

interface PaymentSelectorModalProps {
    visible: boolean;
    onClose: () => void;
    selectedPayment: string;
    onSelectPayment: (paymentId: string) => void;
}

export const PaymentSelectorModal = ({
    visible,
    onClose,
    selectedPayment,
    onSelectPayment,
}: PaymentSelectorModalProps) => {
    const colorScheme = useColorScheme();
    const tintColor = Colors[colorScheme ?? 'light'].tint;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <ThemedView style={styles.modalContent}>
                    <ThemedView style={styles.handleBar} />

                    <ThemedText style={styles.modalTitle}>Payment Method</ThemedText>

                    <ThemedText style={styles.sectionTitle}>Standard Payment</ThemedText>
                    <ThemedView style={styles.optionsContainer}>
                        {PAYMENT_OPTIONS.map((option, index) => (
                            <Pressable
                                key={option.id}
                                style={[
                                    styles.paymentOption,
                                    index !== 0 && styles.borderTop,
                                ]}
                                onPress={() => {
                                    onSelectPayment(option.id);
                                    onClose();
                                }}
                            >
                                <ThemedView style={styles.optionLeft}>
                                    <FontAwesome
                                        name={option.icon}
                                        size={24}
                                        color={Colors[colorScheme ?? 'light'].text}
                                    />
                                    <ThemedText style={styles.optionText}>
                                        {option.name}
                                    </ThemedText>
                                </ThemedView>

                                {selectedPayment === option.id && (
                                    <FontAwesome
                                        name="check"
                                        size={20}
                                        color={tintColor}
                                    />
                                )}
                            </Pressable>
                        ))}
                    </ThemedView>

                    <ThemedText style={[styles.sectionTitle, { marginTop: 20 }]}>
                        Crypto Payment
                    </ThemedText>
                    <ThemedView style={styles.optionsContainer}>
                        {CRYPTO_OPTIONS.map((option, index) => (
                            <Pressable
                                key={option.id}
                                style={[
                                    styles.paymentOption,
                                    index !== 0 && styles.borderTop,
                                ]}
                                onPress={() => {
                                    onSelectPayment(option.id);
                                    onClose();
                                }}
                            >
                                <ThemedView style={styles.optionLeft}>
                                    <FontAwesome
                                        name={option.icon}
                                        size={24}
                                        color={Colors[colorScheme ?? 'light'].text}
                                    />
                                    <ThemedText style={styles.optionText}>
                                        {option.name}
                                    </ThemedText>
                                </ThemedView>
                            </Pressable>
                        ))}
                    </ThemedView>

                    <Pressable
                        style={styles.cancelButton}
                        onPress={onClose}
                    >
                        <ThemedText style={styles.cancelText}>Cancel</ThemedText>
                    </Pressable>
                </ThemedView>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        padding: 16,
        paddingBottom: 34,
    },
    handleBar: {
        width: 36,
        height: 5,
        borderRadius: 3,
        backgroundColor: '#636366',
        alignSelf: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 28,
        fontWeight: '600',
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 12,
        opacity: 0.6,
    },
    optionsContainer: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    borderTop: {
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    optionText: {
        fontSize: 17,
        marginLeft: 12,
    },
    cancelButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    cancelText: {
        fontSize: 17,
        fontWeight: '500',
        color: '#FF453A',
    },
}); 