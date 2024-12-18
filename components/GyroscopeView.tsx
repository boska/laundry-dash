import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { useTheme } from '@/ctx/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { throttle } from 'lodash';

export const GyroscopeView = () => {
    const [{ x, y, z }, setData] = useState({ x: 0, y: 0, z: 0 });
    const [iconPosition, setIconPosition] = useState({ x: 0, y: 0 });
    const [subscription, setSubscription] = useState(null);
    const { colors } = useTheme();

    // Get screen dimensions
    const { width, height } = Dimensions.get('window');
    const centerX = width / 2;
    const centerY = height / 2;

    // Increase smoothing factor (closer to 1 = more smooth)
    const alpha = 0.8;  // Changed from 0.8 to 0.95
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
    }, 32); // ~60fps

    // Update position based on accelerometer data with reduced sensitivity
    const updatePosition = throttle((data) => {
        // Reduce sensitivity by dividing the input values
        const sensitivity = 0.5;  // Adjust this value (lower = less sensitive)

        setIconPosition(prev => {
            // Apply smoothing to the position updates
            const newX = smoothValue(centerX * data.x * sensitivity, prev.x);
            const newY = smoothValue(centerY * -data.y * sensitivity, prev.y);

            return {
                x: Math.max(-centerX, Math.min(centerX, newX)),
                y: Math.max(-centerY, Math.min(centerY, newY))
            };
        });
    }, 32);  // Increased throttle time for smoother updates

    const _subscribe = () => {
        Accelerometer.setUpdateInterval(32);  // Reduced update frequency

        setSubscription(
            Accelerometer.addListener(accelData => {
                // Increased threshold to ignore more tiny movements
                const threshold = 0.01;  // Increased from 0.05
                const filteredData = {
                    x: Math.abs(accelData.x) < threshold ? 0 : accelData.x,
                    y: Math.abs(accelData.y) < threshold ? 0 : accelData.y,
                    z: Math.abs(accelData.z) < threshold ? 0 : accelData.z,
                };

                updateData(filteredData);
                updatePosition(filteredData);
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

    // Calculate movement intensity from position changes
    const calculateMovementIntensity = () => {
        const positionChange = Math.sqrt(
            Math.pow(iconPosition.x, 2) +
            Math.pow(iconPosition.y, 2)
        );
        // Normalize the value between 0 and 1
        return Math.min(positionChange / 100, 1);
    };

    // Smooth out the size changes with more dramatic effect
    const baseSize = 80;  // Increased base size
    const maxSizeChange = 120;  // Increased max size change
    const movement = Math.abs(x + y + z) + calculateMovementIntensity();
    const indicatorSize = baseSize;  //+ Math.min(movement * 40, maxSizeChange);

    return (
        <ThemedView style={styles.container}>
            <View style={styles.visualContainer}>
                <View style={styles.dataDisplay}>
                    <ThemedText style={styles.valueText}>
                        Gyro X: {x.toFixed(3)}
                    </ThemedText>
                    <ThemedText style={styles.valueText}>
                        Gyro Y: {y.toFixed(3)}
                    </ThemedText>
                    <ThemedText style={styles.valueText}>
                        Gyro Z: {z.toFixed(3)}
                    </ThemedText>
                    <ThemedText style={styles.valueText}>
                        Position: {iconPosition.x.toFixed(0)}, {iconPosition.y.toFixed(0)}
                    </ThemedText>
                </View>

                <View
                    style={[
                        styles.indicator,
                        {
                            width: indicatorSize,
                            height: indicatorSize,
                            backgroundColor: 'transparent',
                            transform: [
                                { translateX: iconPosition.x },
                                { translateY: iconPosition.y },
                            ],
                        },
                    ]}
                >
                    <Ionicons
                        name="heart"
                        size={indicatorSize / 1.2}
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
    dataDisplay: {
        position: 'absolute',
        top: 40,
        left: 20,
        backgroundColor: 'rgba(0,0,0,0.1)',
        padding: 10,
        borderRadius: 10,
        zIndex: 1,
    },
    valueText: {
        fontSize: 14,
        marginVertical: 2,
        fontFamily: 'monospace',  // For better number alignment
    },
}); 