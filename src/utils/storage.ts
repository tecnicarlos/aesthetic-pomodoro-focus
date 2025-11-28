import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeId } from '../constants/theme';

const STORAGE_KEY = '@aesthetic_pomodoro_data_v1';

export interface UserData {
    xp: number;
    level: number;
    completedPomodoros: number;
    totalMinutes: number;
    unlockedThemes: ThemeId[];
    achievements: string[]; // Achievement IDs
    streak: number;
    equippedTheme?: ThemeId;
    lifetimeXp?: number;
    name?: string;
    avatarUri?: string;
    // Phase 7: New Shop Items
    unlockedSounds: string[]; // IDs of unlocked sounds
    equippedSounds: Record<string, string>; // soundType -> soundId
    unlockedDurations: number[]; // Minutes
}

export const INITIAL_DATA: UserData = {
    xp: 0,
    level: 1,
    completedPomodoros: 0,
    totalMinutes: 0,
    unlockedThemes: ['minimalist'],
    achievements: [],
    streak: 0,
    equippedTheme: 'minimalist',
    lifetimeXp: 0,
    name: 'Focus Master',
    avatarUri: '',
    unlockedSounds: ['click_default', 'alarm_default', 'start_default', 'giveup_default'],
    equippedSounds: {
        click: 'click_default',
        alarm: 'alarm_default',
        start: 'start_default',
        giveup: 'giveup_default',
    },
    unlockedDurations: [25], // Default 25 min
};

export const saveUserData = async (data: UserData) => {
    try {
        const jsonValue = JSON.stringify(data);
        await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
        console.error('Failed to save user data', e);
    }
};

export const loadUserData = async (): Promise<UserData> => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        return jsonValue != null ? { ...INITIAL_DATA, ...JSON.parse(jsonValue) } : INITIAL_DATA;
    } catch (e) {
        console.error('Failed to load user data', e);
        return INITIAL_DATA;
    }
};
