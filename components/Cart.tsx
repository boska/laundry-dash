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

// Map of item types to icons
const itemIcons: { [key: string]: keyof typeof FontAwesome.glyphMap } = {
    pants: 'black-tie',
    jacket: 'user-secret',
    dress: 'female',
    suit: 'briefcase',
    animal: 'paw',
    default: 'shopping-bag'
};

export const Cart = () => {
    const dispatch = useAppDispatch();
    const colorScheme = useColorScheme();
    const { items, total } = useAppSelector(state => state.cart);
    const tintColor = Colors[colorScheme ?? 'light'].tint;

    const handleQuantityUpdate = (itemId: string, serviceType: string, currentQuantity: number) => {
        dispatch(updateQuantity({
            id: itemId,
            serviceType,
            quantity: currentQuantity + 1
        }));
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
        <ThemedView style={styles.container}>
            <ScrollView style={styles.itemList}>
                {items.map((item) => (
                    <Pressable
                        key={`${item.id}-${item.serviceType}`}
                        style={({ pressed }) => [
                            styles.itemCard,
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

            <ThemedView style={styles.footer}>
                <ThemedView style={styles.totalContainer}>
                    <ThemedText style={styles.totalLabel}>Total</ThemedText>
                    <ThemedText style={styles.totalAmount}>${total.toFixed(2)}</ThemedText>
                </ThemedView>

                <Pressable
                    style={[styles.checkoutButton, { backgroundColor: tintColor }]}
                    onPress={() => router.push('/checkout')}
                >
                    <ThemedText style={styles.checkoutButtonText}>Checkout</ThemedText>
                </Pressable>
            </ThemedView>
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
        borderColor: '#e0e0e0',
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
        borderTopColor: '#e0e0e0',
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: '600',
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: '600',
    },
    checkoutButton: {
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    checkoutButtonText: {
        color: 'white',
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
    itemQuantity: {
        fontSize: 14,
        fontWeight: '600',
    },
}); 