import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { ThemedContainer } from '../components/ThemedContainer';
import { useGamification } from '../context/GamificationContext';
import { ACHIEVEMENTS } from '../constants/achievements';
import { THEMES } from '../constants/theme';
import { AppButton } from '../components/AppButton';

import { useTranslation } from '../hooks/useTranslation';

export const StatsScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { userData } = useGamification();
    const currentThemeId = userData.equippedTheme || 'minimalist';
    const theme = THEMES[currentThemeId as keyof typeof THEMES] || THEMES.minimalist;
    const { t } = useTranslation();

    const renderAchievement = ({ item }: { item: typeof ACHIEVEMENTS[0] }) => {
        const isUnlocked = userData.achievements.includes(item.id);
        return (
            <View style={[styles.achievementCard, {
                backgroundColor: isUnlocked ? theme.colors.surface : 'rgba(0,0,0,0.2)',
                borderColor: isUnlocked ? theme.colors.primary : 'transparent',
                borderWidth: 1
            }]}>
                <Text style={[styles.achievementTitle, { color: isUnlocked ? theme.colors.primary : '#888' }]}>
                    {item.title} {isUnlocked ? '✓' : '🔒'}
                </Text>
                <Text style={[styles.achievementDesc, { color: theme.colors.text }]}>
                    {item.description}
                </Text>
                <Text style={[styles.achievementXp, { color: theme.colors.secondary }]}>
                    +{item.xpReward} {t('home.xp')}
                </Text>
            </View>
        );
    };

    return (
        <ThemedContainer>
            <View style={styles.header}>
                <AppButton title={t('settings.back')} onPress={onBack} variant="secondary" style={{ alignSelf: 'flex-start' }} />
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{t('stats.title')}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.statLabel, { color: theme.colors.secondary }]}>{t('home.level')}</Text>
                    <Text style={[styles.statValue, { color: theme.colors.primary }]}>{userData.level}</Text>
                </View>

                <View style={styles.row}>
                    <View style={[styles.statCard, { backgroundColor: theme.colors.surface, flex: 1, marginRight: 8 }]}>
                        <Text style={[styles.statLabel, { color: theme.colors.secondary }]}>Total XP</Text>
                        <Text style={[styles.statValue, { color: theme.colors.text }]}>{userData.xp}</Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: theme.colors.surface, flex: 1, marginLeft: 8 }]}>
                        <Text style={[styles.statLabel, { color: theme.colors.secondary }]}>{t('stats.streak')}</Text>
                        <Text style={[styles.statValue, { color: theme.colors.text }]}>{userData.streak} 🔥</Text>
                    </View>
                </View>

                <View style={[styles.statCard, { backgroundColor: theme.colors.surface, marginTop: 16 }]}>
                    <Text style={[styles.statLabel, { color: theme.colors.secondary }]}>{t('stats.totalTime')}</Text>
                    <Text style={[styles.statValue, { color: theme.colors.text }]}>{userData.totalMinutes} min</Text>
                </View>

                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Achievements</Text>
                {ACHIEVEMENTS.map(item => (
                    <View key={item.id} style={{ marginBottom: 10 }}>
                        {renderAchievement({ item })}
                    </View>
                ))}
            </ScrollView>
        </ThemedContainer>
    );
};

const styles = StyleSheet.create({
    header: {
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 20,
    },
    content: {
        padding: 20,
        paddingTop: 0,
    },
    statCard: {
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statLabel: {
        fontSize: 14,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    statValue: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    achievementCard: {
        padding: 15,
        borderRadius: 10,
    },
    achievementTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    achievementDesc: {
        fontSize: 14,
        marginBottom: 4,
    },
    achievementXp: {
        fontSize: 12,
        fontWeight: '600',
    },
});
