import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
    soundEnabled: boolean;
    soundVolume: number; // 0.0 to 1.0
    musicEnabled: boolean;
    musicVolume: number; // 0.0 to 1.0
    notificationsEnabled: boolean;
    darkMode: boolean; // System Theme override

    language: 'en' | 'pt';
    setLanguage: (lang: 'en' | 'pt') => void;

    toggleSound: () => void;
    setSoundVolume: (val: number) => void;
    toggleMusic: () => void;
    setMusicVolume: (val: number) => void;
    toggleNotifications: () => void;
    toggleDarkMode: () => void;
}

export const useSettings = create<SettingsState>()(
    persist(
        (set) => ({
            soundEnabled: true,
            soundVolume: 0.8,
            musicEnabled: false,
            musicVolume: 0.5,
            notificationsEnabled: true,
            darkMode: true,
            language: 'pt', // Default to Portuguese as requested

            setLanguage: (lang) => set({ language: lang }),
            toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
            setSoundVolume: (val) => set({ soundVolume: val }),
            toggleMusic: () => set((state) => ({ musicEnabled: !state.musicEnabled })),
            setMusicVolume: (val) => set({ musicVolume: val }),
            toggleNotifications: () => set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),
            toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
        }),
        {
            name: 'app-settings',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
