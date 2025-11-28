import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Alert, Platform, ScrollView } from 'react-native';
import { ThemedContainer } from '../components/ThemedContainer';
import { CircularTimer } from '../components/CircularTimer';
import { AppButton } from '../components/AppButton';
import { useTimer } from '../context/TimerContext';
import { useGamification } from '../context/GamificationContext';
import * as Haptics from 'expo-haptics';

import { useTranslation } from '../hooks/useTranslation';

export const HomeScreen: React.FC = () => {
    const { timeLeft, isActive, isPaused, duration, startTimer, pauseTimer, resumeTimer, stopTimer } = useTimer();
    const { userData } = useGamification();
    const { t } = useTranslation();

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = duration > 0 ? timeLeft / duration : 1;

    const handleStart = (durationMinutes: number) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        startTimer(durationMinutes);
    };

    const handleGiveUp = () => {
        if (Platform.OS === 'web') {
            if (window.confirm(t('home.giveUpMessage'))) {
                stopTimer();
            }
        } else {
            Alert.alert(
                t('home.giveUpTitle'),
                t('home.giveUpMessage'),
                [
                    { text: t('common.cancel'), style: "cancel" },
                    {
                        text: t('home.giveUp'),
                        style: "destructive",
                        onPress: () => {
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                            stopTimer();
                        }
                    }
                ]
            );
        }
    };

    return (
        <ThemedContainer>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.levelText}>{t('home.level')} {userData.level}</Text>
                    <Text style={styles.xpText}>{userData.xp} {t('home.xp')}</Text>
                </View>

                <View style={styles.timerContainer}>
                    <CircularTimer
                        progress={progress}
                        timeLeftString={formatTime(timeLeft)}
                    />
                </View>

                <View style={styles.controls}>
                    {!isActive ? (
                        <View>
                            <Text style={{ color: '#888', marginBottom: 10, fontWeight: 'bold' }}>{t('home.selectDuration')}</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.durationScroll}>
                                {userData.unlockedDurations.map((mins) => (
                                    <AppButton
                                        key={mins}
                                        title={`${mins}m`}
                                        onPress={() => handleStart(mins)}
                                        style={{ marginRight: 10, minWidth: 80 }}
                                        variant="secondary"
                                    />
                                ))}
                            </ScrollView>
                        </View>
                    ) : (
                        <>
                            {isPaused ? (
                                <AppButton title={t('home.resume')} onPress={resumeTimer} />
                            ) : (
                                <AppButton title={t('home.pause')} onPress={pauseTimer} variant="secondary" />
                            )}
                            <View style={{ height: 16 }} />
                            <AppButton title={t('home.giveUp')} onPress={handleGiveUp} variant="outline" />
                        </>
                    )}
                </View>
            </View>
        </ThemedContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-between',
        maxWidth: 600, // Limit width on web
        width: '100%',
        alignSelf: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        zIndex: 10, // Ensure header is above
    },
    levelText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#888',
    },
    xpText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#888',
    },
    timerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        zIndex: 1,
    },
    controls: {
        marginBottom: 40,
        width: '100%',
        zIndex: 10, // Ensure controls are clickable
    },
    startButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    durationScroll: {
        flexDirection: 'row',
        marginBottom: 10,
    },
});
