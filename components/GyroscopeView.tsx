import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Gyroscope } from 'expo-sensors';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { useTheme } from '@/ctx/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export const GyroscopeView = () => {
    const [{ x, y, z }, setData] = useState({
        x: 0,
        y: 0,
        z: 0,
    });
    const [subscription, setSubscription] = useState(null);
    const { colors } = useTheme();

    const _subscribe = () => {
        setSubscription(
            Gyroscope.addListener(gyroscopeData => {
                setData(gyroscopeData);
            })
        );
    };

    const _unsubscribe = () => {
        subscription && subscription.remove();
        setSubscription(null);
    };

    useEffect(() => {
        _subscribe();
        return () => _unsubscribe();
    }, []);

    // Visual indicator size based on gyroscope values
    const indicatorSize = Math.abs((x + y + z) * 20) + 100;

    return (
        <ThemedView style={styles.container}>
            <View style={styles.dataContainer}>
                <ThemedText style={styles.title}>Gyroscope Values</ThemedText>
                <ThemedText style={styles.value}>x: {x.toFixed(2)}</ThemedText>
                <ThemedText style={styles.value}>y: {y.toFixed(2)}</ThemedText>
                <ThemedText style={styles.value}>z: {z.toFixed(2)}</ThemedText>
            </View>

            <View style={styles.visualContainer}>
                <View
                    style={[
                        styles.indicator,
                        {
                            width: indicatorSize,
                            height: indicatorSize,
                            backgroundColor: colors.tint,
                            transform: [
                                { rotateX: `${x * 90}deg` },
                                { rotateY: `${y * 90}deg` },
                                { rotateZ: `${z * 90}deg` },
                            ],
                        },
                    ]}
                >
                    <Ionicons
                        name="compass-outline"
                        size={indicatorSize / 2}
                        color={colors.background}
                    />
                </View>
            </View>

            <TouchableOpacity
                onPress={subscription ? _unsubscribe : _subscribe}
                style={[styles.button, { backgroundColor: colors.tint }]}
            >
                <ThemedText style={styles.buttonText}>
                    {subscription ? 'Stop' : 'Start'} Gyroscope
                </ThemedText>
            </TouchableOpacity>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 20,
    },
    dataContainer: {
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    value: {
        fontSize: 18,
        marginVertical: 5,
    },
    visualContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    indicator: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        opacity: 0.8,
    },
    button: {
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
}); 