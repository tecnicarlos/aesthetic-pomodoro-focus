import React from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGamification } from '../context/GamificationContext';
import { useSettings } from '../context/SettingsContext';
import { THEMES } from '../constants/theme';

interface ThemedContainerProps {
    children: React.ReactNode;
    activeThemeId?: string; // Optional override
    style?: ViewStyle;
}

export const ThemedContainer: React.FC<ThemedContainerProps> = ({ children, activeThemeId, style }) => {
    const { userData } = useGamification();
    const { darkMode } = useSettings();

    // Use the equipped theme from user data or fallback
    const currentThemeId = activeThemeId || (userData as any).equippedTheme || 'minimalist';
    const originalTheme = THEMES[currentThemeId as keyof typeof THEMES] || THEMES.minimalist;

    // Apply Dark Mode override
    const theme = React.useMemo(() => {
        if (darkMode && originalTheme.darkColors) {
            return {
                ...originalTheme,
                colors: originalTheme.darkColors,
            };
        }
        return originalTheme;
    }, [currentThemeId, darkMode, originalTheme]);

    return (
        <LinearGradient
            colors={theme.colors.background}
            style={[styles.container, style]}
        >
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.safeArea}>
                {children}
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
});
