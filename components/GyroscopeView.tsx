import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Gyroscope } from 'expo-sensors';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { useTheme } from '@/ctx/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { throttle } from 'lodash';

export const GyroscopeView = () => {
    const [{ x, y, z }, setData] = useState({
        x: 0,
        y: 0,
        z: 0,
    });
    const [subscription, setSubscription] = useState(null);
    const { colors } = useTheme();

    // Add smoothing factor
    const alpha = 0.9; // Adjust between 0 and 1 (higher = smoother but more latency)
    const prevValues = useRef({ x: 0, y: 0, z: 0 });

    // Smooth the values using exponential moving average
    const smoothValue = (newValue: number, prevValue: number) => {
        return alpha * prevValue + (1 - alpha) * newValue;
    };

    // Throttle the update function
    const updateData = throttle((data) => {
        const smoothedData = {
            x: smoothValue(data.x, prevValues.current.x),
            y: smoothValue(data.y, prevValues.current.y),
            z: smoothValue(data.z, prevValues.current.z),
        };

        prevValues.current = smoothedData;
        setData(smoothedData);
    }, 16); // ~60fps

    const _subscribe = () => {
        setSubscription(
            Gyroscope.addListener(gyroscopeData => {
                // Ignore tiny movements
                const threshold = 0.1;
                const filteredData = {
                    x: Math.abs(gyroscopeData.x) < threshold ? 0 : gyroscopeData.x,
                    y: Math.abs(gyroscopeData.y) < threshold ? 0 : gyroscopeData.y,
                    z: Math.abs(gyroscopeData.z) < threshold ? 0 : gyroscopeData.z,
                };

                updateData(filteredData);
            })
        );
    };

    const _unsubscribe = () => {
        subscription && subscription.remove();
        setSubscription(null);
        updateData.cancel(); // Clean up throttle
    };

    useEffect(() => {
        _subscribe();
        return () => _unsubscribe();
    }, []);

    // Smooth out the size changes
    const baseSize = 120;
    const maxSizeChange = 40;
    const movement = Math.abs(x + y + z);
    const indicatorSize = baseSize + Math.min(movement * 20, maxSizeChange);

    return (
        <ThemedView style={styles.container}>
            <View style={styles.visualContainer}>
                <View
                    style={[
                        styles.indicator,
                        {
                            width: indicatorSize,
                            height: indicatorSize,
                            backgroundColor: 'transparent',
                            transform: [
                                { rotateX: `${x * 90}deg` },
                                { rotateY: `${y * 90}deg` },
                                { rotateZ: `${z * 90}deg` },
                            ],
                        },
                    ]}
                >
                    <Ionicons
                        name="heart"
                        size={indicatorSize / 1.5}
                        color="#ff0000"
                    />
                </View>
            </View>
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