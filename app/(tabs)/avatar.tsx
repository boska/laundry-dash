import { StyleSheet, Pressable, Image } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { ScrollViewWrapper } from '@/components/ScrollViewWrapper';

export default function AvatarScreen() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled) {
                setSelectedImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
        }
    };

    const takePhoto = async () => {
        try {
            const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();

            if (cameraPermission.status !== 'granted') {
                alert('Sorry, we need camera permissions to make this work!');
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled) {
                setSelectedImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error taking photo:', error);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        // Your refresh logic here
        await new Promise(resolve => setTimeout(resolve, 2000));
        setRefreshing(false);
    };

    return (
        <ScrollViewWrapper
            refreshing={refreshing}
            onRefresh={handleRefresh}
            keyboardAware={true}
            contentContainerStyle={styles.contentContainer}
        >
            <ThemedView style={styles.container}>
                <ThemedView style={styles.header}>
                    <ThemedText type="title" style={styles.title}>Take a selfie</ThemedText>
                    <ThemedText style={styles.subtitle}>
                        Take a photo or pick from gallery
                    </ThemedText>
                </ThemedView>

                <ThemedView style={styles.imageContainer}>
                    {selectedImage ? (
                        <Image
                            source={{ uri: selectedImage }}
                            style={styles.image}
                        />
                    ) : (
                        <ThemedView style={[styles.image, styles.placeholderContainer]}>
                            <Ionicons name="person" size={80} color="#CBD5E1" />
                        </ThemedView>
                    )}
                </ThemedView>

                <ThemedView style={styles.buttonContainer}>
                    <Pressable
                        style={[styles.button, styles.cameraButton]}
                        onPress={takePhoto}
                    >
                        <Ionicons name="camera" size={24} color="white" />
                        <ThemedText style={styles.buttonText}>Camera</ThemedText>
                    </Pressable>

                    <Pressable
                        style={[styles.button, styles.galleryButton]}
                        onPress={pickImage}
                    >
                        <Ionicons name="images" size={24} color="white" />
                        <ThemedText style={styles.buttonText}>Gallery</ThemedText>
                    </Pressable>
                </ThemedView>
            </ThemedView>
        </ScrollViewWrapper>
    );
}

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
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    button: {
        flex: 1,
        height: 48,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    cameraButton: {
        backgroundColor: '#3b82f6',
    },
    galleryButton: {
        backgroundColor: '#8b5cf6',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 3,
        borderColor: '#3b82f6',
    },
    placeholderContainer: {
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        flexGrow: 1,
    },
}); 