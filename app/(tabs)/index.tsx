import { StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useState } from 'react';
import { Link, router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SafeAreaView } from 'react-native-safe-area-context';

import LoginScreen from '../login';
import ChatRoom from '../chatroom';

export default function Index() {
    return <Link href="/posts/boska@laundry-dash">Posts</Link>;
}