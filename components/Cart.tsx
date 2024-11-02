import React from 'react';
import { StyleSheet, ScrollView, Pressable } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateQuantity } from '@/store/cartSlice';
import { router } from 'expo-router';
import { PaymentSelectorModal } from './PaymentSelectorModal';

// Map of item types to icons
const itemIcons: { [key: string]: keyof typeof FontAwesome.glyphMap } = {
    pants: 'black-tie',
    jacket: 'user-secret',
    dress: 'female',
    suit: 'briefcase',
    animal: 'paw',
    default: 'shopping-bag'
};

// Add these constants at the top of the file
const DELIVERY_FEE = 5.99;
const ESTIMATED_TIME = '45-60';

// Add payment options
const PAYMENT_OPTIONS = [
    { id: 'cash', name: 'Cash', icon: 'money' },
    { id: 'card', name: 'Credit Card', icon: 'credit-card' },
    { id: 'apple', name: 'Apple Pay', icon: 'apple' },
    { id: 'google', name: 'Google Pay', icon: 'google' },
] as const;

// Add this type definition
type MockOrder = {
    id: string;
    status: 'pick-up';
    items: Array<{
        id: string;
        name: string;
        type: string;
        serviceType: string;
        quantity: number;
        price: number;
    }>;
    total: number;
    paymentMethod: string;
    createdAt: Date;
    estimatedDelivery: Date;
};

export const Cart = () => {
    const dispatch = useAppDispatch();
    const colorScheme = useColorScheme();
    const { items, total } = useAppSelector(state => state.cart);
    const tintColor = Colors[colorScheme ?? 'light'].tint;
    const [selectedPayment, setSelectedPayment] = React.useState<string>('cash');
    const [isPaymentModalVisible, setIsPaymentModalVisible] = React.useState(false);
    const [isCreatingOrder, setIsCreatingOrder] = React.useState(false);

    const handleQuantityUpdate = (itemId: string, serviceType: string, currentQuantity: number) => {
        dispatch(updateQuantity({
            id: itemId,
            serviceType,
            quantity: currentQuantity + 1
        }));
    };

    const borderColor = Colors[colorScheme ?? 'light'].border;

    const handleCheckout = async () => {
        try {
            setIsCreatingOrder(true);

            const mockOrder: MockOrder = {
                id: Math.random().toString(36).substring(2, 9),
                status: 'pick-up',
                items: items,
                total: total,
                paymentMethod: selectedPayment,
                createdAt: new Date(),
                estimatedDelivery: new Date(Date.now() + 2 * 60 * 60 * 1000),
            };

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // In real app: await createOrder(mockOrder);

            // Clear cart (assuming you have a clearCart action)
            // dispatch(clearCart());

            router.push({
                pathname: `/order/${mockOrder.id}`,
                params: {
                    total: mockOrder.total.toString(),
                    estimatedDelivery: mockOrder.estimatedDelivery.toISOString(),
                }
            });
        } catch (error) {
            // Handle error
            console.error('Failed to create order:', error);
            // Show error message to user
        } finally {
            setIsCreatingOrder(false);
        }
    };

    if (items.length === 0) {
        return (
            <ThemedView style={styles.emptyContainer}>
                <FontAwesome
                    name="shopping-basket"
                    size={64}
                    color={Colors[colorScheme ?? 'light'].tabIconDefault}
                />
                <ThemedText style={styles.emptyText}>Your cart is empty</ThemedText>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={[styles.container]}>
            <ScrollView style={styles.itemList}>
                {items.map((item) => (
                    <Pressable
                        key={`${item.id}-${item.serviceType}`}
                        style={({ pressed }) => [
                            styles.itemCard,
                            { borderColor },
                            pressed && styles.itemCardPressed
                        ]}
                        onPress={() => handleQuantityUpdate(item.id, item.serviceType, item.quantity)}
                    >
                        <ThemedView style={styles.itemLeftSection}>
                            <ThemedView style={[styles.iconContainer, { backgroundColor: `${tintColor}10` }]}>
                                <FontAwesome
                                    name={itemIcons[item.type] || itemIcons.default}
                                    size={24}
                                    color={tintColor}
                                />
                            </ThemedView>
                            <ThemedView>
                                <ThemedText style={styles.itemName}>{item.name}</ThemedText>
                                <ThemedText style={styles.itemService}>
                                    {item.serviceType.charAt(0).toUpperCase() + item.serviceType.slice(1)}
                                </ThemedText>
                            </ThemedView>
                        </ThemedView>

                        <ThemedView style={styles.itemDetails}>
                            <ThemedView style={[styles.quantityBadge, { backgroundColor: `${tintColor}20` }]}>
                                <ThemedText style={[styles.itemQuantity, { color: tintColor }]}>
                                    x{item.quantity}
                                </ThemedText>
                            </ThemedView>
                            <ThemedText style={styles.itemPrice}>
                                ${(item.price * item.quantity).toFixed(2)}
                            </ThemedText>
                        </ThemedView>
                    </Pressable>
                ))}
            </ScrollView>

            <ThemedView style={[styles.footer, { borderTopColor: borderColor }]}>
                <ThemedView style={styles.summaryContainer}>
                    <ThemedView style={styles.deliveryInfoContainer}>
                        <FontAwesome
                            name="truck"
                            size={20}
                            color={tintColor}
                        />
                        <ThemedView>
                            <ThemedText style={styles.deliveryLabel}>Estimated Delivery</ThemedText>
                            <ThemedText style={styles.deliveryTime}>
                                Today, {new Date().getHours() + 1}:00 - {new Date().getHours() + 2}:00
                            </ThemedText>
                        </ThemedView>
                    </ThemedView>

                    <ThemedView style={[styles.divider, { backgroundColor: borderColor }]} />

                    <Pressable
                        style={styles.paymentRow}
                        onPress={() => setIsPaymentModalVisible(true)}
                    >
                        <ThemedView style={styles.paymentLeft}>
                            <FontAwesome
                                name={PAYMENT_OPTIONS.find(opt => opt.id === selectedPayment)?.icon || 'money'}
                                size={20}
                                color={tintColor}
                            />
                            <ThemedText style={styles.paymentLabel}>
                                {PAYMENT_OPTIONS.find(opt => opt.id === selectedPayment)?.name || 'Select Payment'}
                            </ThemedText>
                        </ThemedView>
                        <FontAwesome name="angle-right" size={20} color={Colors[colorScheme ?? 'light'].text} />
                    </Pressable>
                </ThemedView>

                <Pressable
                    style={[
                        styles.checkoutButton,
                        { backgroundColor: tintColor },
                        isCreatingOrder && styles.checkoutButtonDisabled
                    ]}
                    onPress={handleCheckout}
                    disabled={isCreatingOrder}
                >
                    <ThemedText style={styles.checkoutButtonText}>
                        {isCreatingOrder ? 'Creating Order...' : `Confirm Order · $${total.toFixed(2)}`}
                    </ThemedText>
                </Pressable>
            </ThemedView>

            <PaymentSelectorModal
                visible={isPaymentModalVisible}
                onClose={() => setIsPaymentModalVisible(false)}
                selectedPayment={selectedPayment}
                onSelectPayment={setSelectedPayment}
            />
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    emptyText: {
        fontSize: 18,
        opacity: 0.7,
    },
    itemList: {
        flex: 1,
        padding: 16,
    },
    itemCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
        borderWidth: 1,
    },
    itemLeftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
    },
    itemService: {
        fontSize: 14,
        opacity: 0.7,
    },
    itemDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    itemQuantity: {
        fontSize: 14,
        opacity: 0.7,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        gap: 16,
    },
    summaryContainer: {
        gap: 12,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: 16,
        opacity: 0.7,
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        marginVertical: 12,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: '600',
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: '700',
    },
    estimatedTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: Colors.light.border,
    },
    estimatedTimeText: {
        fontSize: 14,
        opacity: 0.7,
    },
    checkoutButton: {
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    checkoutButtonText: {
        color: Colors.light.background,
        fontSize: 16,
        fontWeight: '600',
    },
    itemCardPressed: {
        opacity: 0.7,
        transform: [{ scale: 0.98 }],
    },
    quantityBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        minWidth: 32,
        alignItems: 'center',
    },
    paymentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    paymentLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    paymentLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
    deliveryInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 8,
    },
    deliveryLabel: {
        fontSize: 14,
        opacity: 0.7,
    },
    deliveryTime: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 2,
    },
    checkoutButtonDisabled: {
        opacity: 0.7,
    },
}); 