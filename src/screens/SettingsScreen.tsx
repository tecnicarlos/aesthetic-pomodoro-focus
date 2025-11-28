import React from 'react';
import { View, Text, StyleSheet, Switch, Platform } from 'react-native';
import Slider from '@react-native-community/slider';
import { ThemedContainer } from '../components/ThemedContainer';
import { AppButton } from '../components/AppButton';
import { useSettings } from '../context/SettingsContext';
import { useGamification } from '../context/GamificationContext';
import { THEMES } from '../constants/theme';
import { audioService } from '../services/audio';

import { useTranslation } from '../hooks/useTranslation';

export const SettingsScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const {
        soundEnabled, toggleSound, soundVolume, setSoundVolume,
        musicEnabled, toggleMusic, musicVolume, setMusicVolume,
        notificationsEnabled, toggleNotifications,
        darkMode, toggleDarkMode,
        language, setLanguage
    } = useSettings();
    const { t } = useTranslation();

    // Sync with AudioService
    React.useEffect(() => {
        audioService.updateSettings(soundEnabled, soundVolume, musicEnabled, musicVolume);
    }, [soundEnabled, soundVolume, musicEnabled, musicVolume]);

    const { userData } = useGamification();
    const currentThemeId = userData.equippedTheme || 'minimalist';
    const theme = THEMES[currentThemeId as keyof typeof THEMES] || THEMES.minimalist;

    const renderSection = (title: string, children: React.ReactNode) => (
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>{title}</Text>
            {children}
        </View>
    );

    const renderToggle = (label: string, value: boolean, onValueChange: () => void) => (
        <View style={styles.row}>
            <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{ false: '#767577', true: theme.colors.primary }}
                thumbColor={value ? '#fff' : '#f4f3f4'}
            />
        </View>
    );

    const renderSlider = (label: string, value: number, onValueChange: (val: number) => void, enabled: boolean) => (
        <View style={styles.sliderContainer}>
            <View style={styles.row}>
                <Text style={[styles.label, { color: enabled ? theme.colors.text : '#888' }]}>{label}</Text>
                <Text style={[styles.value, { color: theme.colors.secondary }]}>{Math.round(value * 100)}%</Text>
            </View>
            <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={0}
                maximumValue={1}
                value={value}
                onValueChange={onValueChange}
                minimumTrackTintColor={theme.colors.primary}
                maximumTrackTintColor="#000000"
                disabled={!enabled}
            />
        </View>
    );

    return (
        <ThemedContainer>
            <View style={styles.header}>
                <AppButton title={t('settings.back')} onPress={onBack} variant="secondary" style={{ alignSelf: 'flex-start' }} />
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{t('settings.title')}</Text>
            </View>

            <View style={styles.content}>
                {renderSection(t('settings.sound'), (
                    <>
                        {renderToggle(t('settings.sound'), soundEnabled, toggleSound)}
                        {renderSlider(t('settings.volume'), soundVolume, setSoundVolume, soundEnabled)}

                        <View style={styles.divider} />

                        {renderToggle(t('settings.music'), musicEnabled, toggleMusic)}
                        {renderSlider(t('settings.volume'), musicVolume, setMusicVolume, musicEnabled)}
                    </>
                ))}

                {renderSection(t('settings.preferences'), (
                    <>
                        {renderToggle(t('settings.notifications'), notificationsEnabled, toggleNotifications)}
                        {renderToggle(t('settings.darkMode'), darkMode, toggleDarkMode)}

                        <View style={styles.divider} />

                        <View style={styles.row}>
                            <Text style={[styles.label, { color: theme.colors.text }]}>{t('settings.language')}</Text>
                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                <AppButton
                                    title="EN"
                                    onPress={() => setLanguage('en')}
                                    variant={language === 'en' ? 'primary' : 'outline'}
                                    style={{ paddingHorizontal: 15, paddingVertical: 5 }}
                                />
                                <AppButton
                                    title="PT"
                                    onPress={() => setLanguage('pt')}
                                    variant={language === 'pt' ? 'primary' : 'outline'}
                                    style={{ paddingHorizontal: 15, paddingVertical: 5 }}
                                />
                            </View>
                        </View>
                    </>
                ))}

                <Text style={styles.version}>Version 1.0.0 (Beta)</Text>
            </View>
        </ThemedContainer>
    );
};

const styles = StyleSheet.create({
    header: {
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginRight: 20,
    },
    content: {
        padding: 20,
        maxWidth: 600,
        width: '100%',
        alignSelf: 'center',
    },
    section: {
        padding: 20,
        borderRadius: 15,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
    },
    value: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    sliderContainer: {
        marginBottom: 15,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginVertical: 15,
    },
    version: {
        textAlign: 'center',
        color: '#666',
        marginTop: 20,
    },
});
