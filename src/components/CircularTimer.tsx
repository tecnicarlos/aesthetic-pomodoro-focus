import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useGamification } from '../context/GamificationContext';
import { THEMES } from '../constants/theme';

interface CircularTimerProps {
    size?: number;
    strokeWidth?: number;
    progress: number; // 0 to 1
    timeLeftString: string;
}

const { width } = Dimensions.get('window');

export const CircularTimer: React.FC<CircularTimerProps> = ({
    size = width * 0.7,
    strokeWidth = 15,
    progress,
    timeLeftString
}) => {
    const { userData } = useGamification();
    const currentThemeId = (userData as any).equippedTheme || 'minimalist';
    const theme = THEMES[currentThemeId as keyof typeof THEMES] || THEMES.minimalist;

    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - progress * circumference;

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Svg width={size} height={size}>
                {/* Background Circle */}
                <Circle
                    stroke={theme.colors.secondary}
                    fill="none"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    strokeOpacity={0.3}
                />
                {/* Progress Circle */}
                <Circle
                    stroke={theme.colors.primary}
                    fill="none"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
            </Svg>
            <View style={styles.textContainer}>
                <Text style={[styles.timerText, { color: theme.colors.text }]}>
                    {timeLeftString}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    timerText: {
        fontSize: 64,
        fontWeight: '200',
        fontVariant: ['tabular-nums'],
    },
});
