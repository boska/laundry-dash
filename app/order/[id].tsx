import React from 'react';
import { StyleSheet, ScrollView, Pressable } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateOrderStatus } from '@/store/orderSlice';
import { useTheme } from '@/ctx/ThemeContext';
import type { OrderStatus } from '@/store/orderSlice';
import { Cart } from '@/components/Cart';

const ORDER_STEPS = [
    {
        status: 'pick-up',
        label: 'Pick-up',
        icon: 'shopping-bag',
        description: 'Driver is picking up your laundry'
    },
    {
        status: 'on-the-way-to-laundry',
        label: 'On the way',
        icon: 'truck',
        description: 'Your clothes are being transported'
    },
    {
        status: 'laundrying',
        label: 'Washing',
        icon: 'tint',
        description: 'Your clothes are being washed'
    },
    {
        status: 'drying',
        label: 'Drying',
        icon: 'sun-o',
        description: 'Your clothes are being dried'
    },
    {
        status: 'on-the-way-to-user',
        label: 'Delivery',
        icon: 'truck',
        description: 'Your clean clothes are on the way'
    },
    {
        status: 'completed',
        label: 'Completed',
        icon: 'check-circle',
        description: 'Order completed'
    }
] as const;

export default function OrderDetail() {
    const { id } = useLocalSearchParams();
    const dispatch = useAppDispatch();
    const order = useAppSelector(state => state.order.currentOrder);
    const { colors } = useTheme();

    const currentStep = ORDER_STEPS.findIndex(step => step.status === order?.status);

    const handleStepPress = (newStatus: OrderStatus) => {
        dispatch(updateOrderStatus(newStatus));
    };

    if (!order) {
        return (
            <Cart />
        );
    }

    return (
        <>
            <Stack.Screen options={{ title: '' }} />
            <ScrollView style={styles.container}>
                <ThemedView style={styles.header}>
                    <ThemedText style={styles.orderId}>Order #{order.id}</ThemedText>
                    <ThemedText style={styles.estimatedTime}>
                        Estimated delivery: {new Date(order.estimatedDelivery).toLocaleTimeString()}
                    </ThemedText>
                </ThemedView>

                <ThemedView style={styles.timeline}>
                    {ORDER_STEPS.map((step, index) => {
                        const isCurrentStep = index === currentStep;
                        const isCompleted = index <= currentStep;

                        return (
                            <Pressable
                                key={step.status}
                                onPress={() => handleStepPress(step.status)}
                            >
                                <ThemedView
                                    style={[
                                        styles.step,
                                        isCurrentStep && {
                                            backgroundColor: colors.background,
                                        }
                                    ]}
                                >
                                    <ThemedView style={styles.stepIconContainer}>
                                        <ThemedView
                                            style={[
                                                styles.stepIcon,
                                                {
                                                    backgroundColor: isCompleted ? colors.tint : 'transparent',
                                                    borderColor: colors.border,
                                                    borderWidth: isCompleted ? 0 : 1,
                                                }
                                            ]}
                                        >
                                            <FontAwesome
                                                name={step.icon}
                                                size={20}
                                                color={isCompleted ? '#fff' : colors.text}
                                            />
                                        </ThemedView>
                                    </ThemedView>
                                    <ThemedView style={styles.stepContent}>
                                        <ThemedText
                                            style={[
                                                styles.stepLabel,
                                                !isCurrentStep && { opacity: 0.5 }
                                            ]}
                                        >
                                            {step.label}
                                        </ThemedText>
                                        <ThemedText style={styles.stepDescription}>
                                            {step.description}
                                        </ThemedText>
                                    </ThemedView>
                                </ThemedView>
                            </Pressable>
                        );
                    })}
                </ThemedView>

                <ThemedView style={[styles.itemsContainer, { borderColor: colors.border }]}>
                    <ThemedText style={styles.itemsTitle}>Order Items</ThemedText>
                    {order.items.map((item, index) => (
                        <ThemedView key={index} style={styles.itemRow}>
                            <ThemedText>{item.name} × {item.quantity}</ThemedText>
                            <ThemedText>${(item.price * item.quantity).toFixed(2)}</ThemedText>
                        </ThemedView>
                    ))}
                    <ThemedView style={[styles.totalRow, { borderTopColor: colors.border }]}>
                        <ThemedText style={styles.totalLabel}>Total</ThemedText>
                        <ThemedText style={styles.totalAmount}>${order.total}</ThemedText>
                    </ThemedView>
                </ThemedView>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 16,
        gap: 8,
    },
    orderId: {
        fontSize: 20,
        fontWeight: '600',
    },
    estimatedTime: {
        fontSize: 16,
        opacity: 0.7,
    },
    timeline: {
        padding: 16,
        gap: 24,
    },
    step: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    stepIconContainer: {
        alignItems: 'center',
        width: 40,
    },
    stepIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepLine: {
        width: 2,
        flex: 1,
        marginTop: 12,
    },
    stepContent: {
        flex: 1,
        paddingTop: 8,
    },
    stepLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    stepDescription: {
        fontSize: 14,
        opacity: 0.7,
    },
    itemsContainer: {
        margin: 16,
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
    },
    itemsTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 12,
        marginTop: 12,
        borderTopWidth: 1,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '600',
    },
    totalAmount: {
        fontSize: 16,
        fontWeight: '600',
    },
}); 