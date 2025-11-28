import React from 'react';
import { View, StyleSheet, Platform, Dimensions, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { AppButton } from './AppButton';
import { useGamification } from '../context/GamificationContext';
import { useSettings } from '../context/SettingsContext';
import { THEMES } from '../constants/theme';
import { Home, BarChart2, ShoppingBag, User, Settings as SettingsIcon } from 'lucide-react-native';
import { audioService } from '../services/audio';

type Screen = 'Home' | 'Stats' | 'Shop' | 'Settings';

interface LayoutProps {
    children: React.ReactNode;
    currentScreen: Screen;
    onNavigate: (screen: Screen) => void;
}

import { useTranslation } from '../hooks/useTranslation';

// ...

export const Layout: React.FC<LayoutProps> = ({ children, currentScreen, onNavigate }) => {
    const { width } = useWindowDimensions();
    const isLargeScreen = width > 768;
    const { userData } = useGamification();
    const { darkMode } = useSettings();
    const currentThemeId = userData.equippedTheme || 'minimalist';
    const originalTheme = THEMES[currentThemeId as keyof typeof THEMES] || THEMES.minimalist;
    const { t } = useTranslation();

    const theme = React.useMemo(() => {
        if (currentThemeId === 'minimalist' && darkMode) {
            return {
                ...originalTheme,
                colors: {
                    ...originalTheme.colors,
                    background: ['#121212', '#2c2c2c'] as [string, string],
                    text: '#ffffff',
                    primary: '#ffffff',
                    secondary: '#a0a0a0',
                    surface: 'rgba(30, 30, 30, 0.9)',
                }
            };
        }
        return originalTheme;
    }, [currentThemeId, darkMode, originalTheme]);

    const NavItem = ({ screen, icon: Icon, label }: { screen: Screen; icon: any; label: string }) => {
        const isActive = currentScreen === screen;
        return (
            <TouchableOpacity
                style={[
                    styles.navItem,
                    isLargeScreen && styles.navItemSidebar,
                    isActive && { backgroundColor: 'rgba(255,255,255,0.1)' }
                ]}
                onPress={() => {
                    audioService.playSound('click');
                    onNavigate(screen);
                }}
            >
                <Icon size={24} color={isActive ? theme.colors.primary : theme.colors.text} />
                {isLargeScreen && (
                    <Text style={[styles.navLabel, { color: theme.colors.text, fontWeight: isActive ? 'bold' : 'normal' }]}>
                        {label}
                    </Text>
                )}
            </TouchableOpacity>
        );
    };

    if (isLargeScreen) {
        return (
            <View style={styles.containerRow}>
                {/* Sidebar */}
                <View style={[styles.sidebar, { backgroundColor: theme.colors.surface, borderRightColor: theme.colors.secondary }]}>
                    <Text style={[styles.logo, { color: theme.colors.primary }]}>APF</Text>
                    <View style={styles.navContainer}>
                        <NavItem screen="Home" icon={Home} label={t('nav.timer')} />
                        <NavItem screen="Stats" icon={BarChart2} label={t('nav.stats')} />
                        <NavItem screen="Shop" icon={ShoppingBag} label={t('nav.shop')} />
                        <NavItem screen="Settings" icon={SettingsIcon} label={t('nav.settings')} />
                    </View>
                </View>
                {/* Main Content */}
                <View style={styles.content}>
                    {children}
                </View>
            </View>
        );
    }

    return (
        <View style={styles.containerColumn}>
            <View style={styles.content}>
                {children}
            </View>
            {/* Bottom Bar */}
            <View style={[styles.bottomBar, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.secondary }]}>
                <NavItem screen="Home" icon={Home} label={t('nav.timer')} />
                <NavItem screen="Stats" icon={BarChart2} label={t('nav.stats')} />
                <NavItem screen="Shop" icon={ShoppingBag} label={t('nav.shop')} />
                <NavItem screen="Settings" icon={SettingsIcon} label={t('nav.settings')} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    containerRow: {
        flex: 1,
        flexDirection: 'row',
    },
    containerColumn: {
        flex: 1,
        flexDirection: 'column',
    },
    sidebar: {
        width: 250,
        padding: 20,
        borderRightWidth: 1,
        justifyContent: 'flex-start',
    },
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        borderTopWidth: 1,
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    content: {
        flex: 1,
    },
    logo: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 40,
        textAlign: 'center',
    },
    navContainer: {
        gap: 10,
    },
    navItem: {
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    navItemSidebar: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    navLabel: {
        marginLeft: 15,
        fontSize: 16,
    },
});
