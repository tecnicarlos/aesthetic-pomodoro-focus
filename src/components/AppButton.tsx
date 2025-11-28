import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useGamification } from '../context/GamificationContext';
import { THEMES } from '../constants/theme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'text';
    style?: ViewStyle;
    textStyle?: TextStyle;
    disabled?: boolean;
}

export const AppButton: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    style,
    textStyle,
    disabled
}) => {
    const { userData } = useGamification();
    const currentThemeId = (userData as any).equippedTheme || 'minimalist';
    const theme = THEMES[currentThemeId as keyof typeof THEMES] || THEMES.minimalist;

    const getBackgroundColor = () => {
        if (disabled) return '#888';
        if (variant === 'primary') return theme.colors.primary;
        if (variant === 'secondary') return theme.colors.secondary;
        if (variant === 'text') return 'transparent';
        return 'transparent';
    };

    const getTextColor = () => {
        if (disabled) return '#ccc';
        if (variant === 'outline') return theme.colors.primary;
        if (variant === 'text') return theme.colors.primary;
        if (variant === 'secondary') return theme.colors.text;
        return theme.colors.background[0];
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            style={[
                styles.button,
                {
                    backgroundColor: getBackgroundColor(),
                    borderColor: variant === 'outline' ? theme.colors.primary : 'transparent',
                    borderWidth: variant === 'outline' ? 2 : 0,
                    elevation: variant === 'text' ? 0 : 5,
                    shadowOpacity: variant === 'text' ? 0 : 0.25,
                },
                style
            ]}
        >
            <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
});
