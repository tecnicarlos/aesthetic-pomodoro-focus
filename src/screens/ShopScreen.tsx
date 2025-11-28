import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { ThemedContainer } from '../components/ThemedContainer';
import { useGamification } from '../context/GamificationContext';
import { THEMES, ThemeId } from '../constants/theme';
import { SOUND_ITEMS, TIMER_DURATIONS, LONG_BREAKS, ShopItem } from '../constants/shop';
import { Sparkles } from 'lucide-react-native';
import { useTranslation } from '../hooks/useTranslation';

type Tab = 'themes' | 'sounds' | 'timer';

export const ShopScreen = () => {
    const { userData, unlockTheme, equipTheme, unlockSound, equipSound, unlockDuration } = useGamification();
    const [activeTab, setActiveTab] = useState<Tab>('themes');
    const { t } = useTranslation();

    const currentThemeId = userData.equippedTheme || 'minimalist';
    const theme = THEMES[currentThemeId as keyof typeof THEMES] || THEMES.minimalist;

    const handleUnlockTheme = (themeId: ThemeId, name: string, cost: number) => {
        confirmAction(t('shop.purchaseConfirm', { name, price: cost }), () => {
            const success = unlockTheme(themeId, cost);
            if (!success) alertNotEnoughXP();
        });
    };

    const handleUnlockSound = (item: ShopItem) => {
        confirmAction(t('shop.purchaseConfirm', { name: item.name, price: item.price }), () => {
            const success = unlockSound(item.id, item.price);
            if (!success) alertNotEnoughXP();
        });
    };

    const handleUnlockDuration = (item: ShopItem) => {
        confirmAction(t('shop.purchaseConfirm', { name: item.name, price: item.price }), () => {
            const success = unlockDuration(item.durationMinutes!, item.price);
            if (!success) alertNotEnoughXP();
        });
    };

    const confirmAction = (message: string, onConfirm: () => void) => {
        if (Platform.OS === 'web') {
            if (window.confirm(message)) onConfirm();
        } else {
            Alert.alert(t('common.confirm'), message, [
                { text: t('common.cancel'), style: 'cancel' },
                { text: t('shop.unlock'), onPress: onConfirm }
            ]);
        }
    };

    const alertNotEnoughXP = () => {
        const msg = t('shop.insufficientXp');
        if (Platform.OS === 'web') window.alert(msg);
        else Alert.alert(t('common.error'), msg);
    };

    const renderTabs = () => (
        <View style={styles.tabContainer}>
            {(['themes', 'sounds', 'timer'] as Tab[]).map(tab => (
                <TouchableOpacity
                    key={tab}
                    style={[styles.tab, activeTab === tab && { borderBottomColor: theme.colors.primary }]}
                    onPress={() => setActiveTab(tab)}
                >
                    <Text style={[
                        styles.tabText,
                        { color: activeTab === tab ? theme.colors.primary : theme.colors.text }
                    ]}>
                        {t(`shop.${tab}`).toUpperCase()}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    const renderThemeCard = (item: typeof THEMES['minimalist']) => {
        const isUnlocked = userData.unlockedThemes.includes(item.id);
        const isEquipped = userData.equippedTheme === item.id;

        return (
            <View key={item.id} style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                <View style={[styles.preview, { backgroundColor: item.colors.background[0] }]} />
                <View style={styles.info}>
                    <Text style={[styles.name, { color: theme.colors.text }]}>{item.name}</Text>
                    <Text style={[styles.vibe, { color: theme.colors.secondary }]}>{item.vibe}</Text>
                    <Text style={[styles.price, { color: theme.colors.accent }]}>
                        {isUnlocked ? (isEquipped ? t('shop.equipped').toUpperCase() : t('shop.owned')) : `${item.price} XP`}
                    </Text>
                </View>
                <TouchableOpacity
                    style={[
                        styles.button,
                        { backgroundColor: isUnlocked ? (isEquipped ? theme.colors.secondary : theme.colors.primary) : theme.colors.accent }
                    ]}
                    onPress={() => {
                        if (isUnlocked) equipTheme(item.id);
                        else handleUnlockTheme(item.id, item.name, item.price);
                    }}
                    disabled={isEquipped}
                >
                    <Text style={styles.buttonText}>
                        {isUnlocked ? (isEquipped ? t('shop.active') : t('shop.equip')) : t('shop.buy')}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    const renderSoundCard = (item: ShopItem) => {
        const isUnlocked = userData.unlockedSounds.includes(item.id);
        const isEquipped = userData.equippedSounds[item.soundType!] === item.id;

        return (
            <View key={item.id} style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.info}>
                    <Text style={[styles.name, { color: theme.colors.text }]}>{item.name}</Text>
                    <Text style={[styles.vibe, { color: theme.colors.secondary }]}>{item.description}</Text>
                    <Text style={[styles.price, { color: theme.colors.accent }]}>
                        {isUnlocked ? (isEquipped ? t('shop.equipped').toUpperCase() : t('shop.owned')) : `${item.price} XP`}
                    </Text>
                </View>
                <TouchableOpacity
                    style={[
                        styles.button,
                        { backgroundColor: isUnlocked ? (isEquipped ? theme.colors.secondary : theme.colors.primary) : theme.colors.accent }
                    ]}
                    onPress={() => {
                        if (isUnlocked) equipSound(item.soundType!, item.id);
                        else handleUnlockSound(item);
                    }}
                    disabled={isEquipped}
                >
                    <Text style={styles.buttonText}>
                        {isUnlocked ? (isEquipped ? t('shop.active') : t('shop.equip')) : t('shop.buy')}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    const renderTimerCard = (item: ShopItem) => {
        const isUnlocked = userData.unlockedDurations.includes(item.durationMinutes!);

        return (
            <View key={item.id} style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.info}>
                    <Text style={[styles.name, { color: theme.colors.text }]}>{item.name}</Text>
                    <Text style={[styles.vibe, { color: theme.colors.secondary }]}>{item.description}</Text>
                    <Text style={[styles.price, { color: theme.colors.accent }]}>
                        {isUnlocked ? t('shop.owned') : `${item.price} XP`}
                    </Text>
                </View>
                <TouchableOpacity
                    style={[
                        styles.button,
                        { backgroundColor: isUnlocked ? theme.colors.secondary : theme.colors.accent }
                    ]}
                    onPress={() => {
                        if (!isUnlocked) handleUnlockDuration(item);
                    }}
                    disabled={isUnlocked}
                >
                    <Text style={styles.buttonText}>
                        {isUnlocked ? t('shop.unlock') : t('shop.buy')}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <ThemedContainer style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.colors.text }]}>{t('shop.title')}</Text>
                <View style={styles.balanceContainer}>
                    <Sparkles size={20} color={theme.colors.primary} />
                    <Text style={[styles.balance, { color: theme.colors.primary }]}>{userData.xp} {t('home.xp')}</Text>
                </View>
            </View>

            {renderTabs()}

            <ScrollView contentContainerStyle={styles.content}>
                {activeTab === 'themes' && Object.values(THEMES).sort((a, b) => a.price - b.price).map(renderThemeCard)}

                {activeTab === 'sounds' && (
                    <>
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Clicks</Text>
                        {SOUND_ITEMS.filter(i => i.soundType === 'click').map(renderSoundCard)}

                        <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 20 }]}>Alarms</Text>
                        {SOUND_ITEMS.filter(i => i.soundType === 'alarm').map(renderSoundCard)}

                        <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 20 }]}>Start Sounds</Text>
                        {SOUND_ITEMS.filter(i => i.soundType === 'start').map(renderSoundCard)}
                    </>
                )}

                {activeTab === 'timer' && (
                    <>
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Focus Durations</Text>
                        {TIMER_DURATIONS.map(renderTimerCard)}

                        <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 20 }]}>Long Breaks</Text>
                        {LONG_BREAKS.map(renderTimerCard)}
                    </>
                )}
            </ScrollView>
        </ThemedContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    balanceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 8,
        borderRadius: 20,
    },
    balance: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    tab: {
        marginRight: 20,
        paddingBottom: 5,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 15,
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    preview: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    vibe: {
        fontSize: 14,
        marginBottom: 4,
        fontStyle: 'italic',
    },
    price: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        minWidth: 80,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
});
