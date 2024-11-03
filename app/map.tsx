import React from 'react';
import { StyleSheet } from 'react-native';
import MapView from '@/components/MapView';
import { ThemedView } from '@/components/ThemedView';
import { Stack } from 'expo-router';

export default function Map() {
    return (
        <>
            <Stack.Screen options={{
                title: 'Track Order',
                headerShadowVisible: false,
            }} />
            <ThemedView style={styles.container}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: 37.78825,
                        longitude: -122.4324,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
            </ThemedView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
});
