import React, { ReactNode } from 'react';
import {
    ScrollView,
    StyleSheet,
    ViewStyle,
    RefreshControl,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
} from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';

interface ScrollViewWrapperProps {
    children: ReactNode;
    style?: ViewStyle;
    contentContainerStyle?: ViewStyle;
    refreshing?: boolean;
    onRefresh?: () => void;
    keyboardAware?: boolean;
    bounces?: boolean;
    showsVerticalScrollIndicator?: boolean;
    edges?: Edge[];
}

export function ScrollViewWrapper({
    children,
    style,
    contentContainerStyle,
    refreshing = false,
    onRefresh,
    keyboardAware = true,
    bounces = true,
    showsVerticalScrollIndicator = false,
    edges = [],
}: ScrollViewWrapperProps) {
    const Content = (
        <ScrollView
            style={[styles.scrollView, style]}
            contentContainerStyle={[styles.scrollViewContent, contentContainerStyle]}
            showsVerticalScrollIndicator={showsVerticalScrollIndicator}
            bounces={bounces}
            refreshControl={
                onRefresh ? (
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#999999"
                    />
                ) : undefined
            }
        >
            {children}
        </ScrollView>
    );

    return (
        <SafeAreaView style={styles.safeArea} edges={edges}>
            {keyboardAware ? (
                <KeyboardAvoidingView
                    style={styles.keyboardView}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : StatusBar.currentHeight}
                >
                    {Content}
                </KeyboardAvoidingView>
            ) : (
                Content
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        paddingBottom: 24,
    },
}); 