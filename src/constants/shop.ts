export type ShopCategory = 'themes' | 'sounds' | 'timer';
export type SoundType = 'click' | 'alarm' | 'success' | 'giveup' | 'pause' | 'start';

export interface ShopItem {
    id: string;
    name: string;
    category: ShopCategory;
    price: number;
    description: string;
    // Specifics
    soundType?: SoundType;
    soundUrl?: string;
    durationMinutes?: number; // For timer durations
}

export const TIMER_DURATIONS: ShopItem[] = [
    { id: 'duration_40', name: '40 Minutes', category: 'timer', price: 500, description: 'Unlock 40 min focus session', durationMinutes: 40 },
    { id: 'duration_50', name: '50 Minutes', category: 'timer', price: 800, description: 'Unlock 50 min focus session', durationMinutes: 50 },
    { id: 'duration_60', name: '60 Minutes', category: 'timer', price: 1000, description: 'Unlock 60 min focus session', durationMinutes: 60 },
];

export const LONG_BREAKS: ShopItem[] = [
    { id: 'break_10', name: '10 Min Break', category: 'timer', price: 200, description: 'Unlock 10 min break', durationMinutes: 10 },
    { id: 'break_15', name: '15 Min Break', category: 'timer', price: 300, description: 'Unlock 15 min break', durationMinutes: 15 },
    { id: 'break_30', name: '30 Min Break', category: 'timer', price: 600, description: 'Unlock 30 min break', durationMinutes: 30 },
    { id: 'break_45', name: '45 Min Break', category: 'timer', price: 800, description: 'Unlock 45 min break', durationMinutes: 45 },
    { id: 'break_60', name: '60 Min Break', category: 'timer', price: 1000, description: 'Unlock 60 min break', durationMinutes: 60 },
];

export const SOUND_ITEMS: ShopItem[] = [
    // Clicks
    { id: 'click_default', name: 'Soft Click', category: 'sounds', price: 0, description: 'Standard soft click', soundType: 'click', soundUrl: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3' },
    { id: 'click_retro', name: 'Retro Click', category: 'sounds', price: 100, description: '8-bit click sound', soundType: 'click', soundUrl: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3' }, // Placeholder
    { id: 'click_mech', name: 'Mech Keyboard', category: 'sounds', price: 200, description: 'Mechanical switch click', soundType: 'click', soundUrl: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3' }, // Placeholder

    // Alarms
    { id: 'alarm_default', name: 'Bell Alarm', category: 'sounds', price: 0, description: 'Standard bell', soundType: 'alarm', soundUrl: 'https://assets.mixkit.co/active_storage/sfx/995/995-preview.mp3' },
    { id: 'alarm_digital', name: 'Digital Alarm', category: 'sounds', price: 150, description: 'Beep beep!', soundType: 'alarm', soundUrl: 'https://assets.mixkit.co/active_storage/sfx/995/995-preview.mp3' }, // Placeholder
    { id: 'alarm_zen', name: 'Zen Gong', category: 'sounds', price: 300, description: 'Deep meditation gong', soundType: 'alarm', soundUrl: 'https://assets.mixkit.co/active_storage/sfx/995/995-preview.mp3' }, // Placeholder

    // Start
    { id: 'start_default', name: 'Wind Up', category: 'sounds', price: 0, description: 'Timer start sound', soundType: 'start', soundUrl: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3' }, // Placeholder

    // Give Up
    { id: 'giveup_default', name: 'Failure', category: 'sounds', price: 0, description: 'Sad trombone', soundType: 'giveup', soundUrl: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3' },
];
