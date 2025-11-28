import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { UserData, loadUserData, saveUserData, INITIAL_DATA } from '../utils/storage';
import { XP_PER_MINUTE, LEVEL_EXPONENT, BASE_XP_LEVEL, ThemeId } from '../constants/theme';
import { ACHIEVEMENTS } from '../constants/achievements';
import { audioService } from '../services/audio';
import { SoundType } from '../constants/shop';

interface GamificationContextType {
    userData: UserData;
    addProgress: (minutes: number) => void;
    resetStreak: () => void;
    unlockTheme: (themeId: ThemeId, cost: number) => boolean;
    equipTheme: (themeId: ThemeId) => void;
    updateProfile: (name: string, avatarUri: string) => void;
    isLoading: boolean;
    unlockSound: (soundId: string, cost: number) => boolean;
    equipSound: (soundType: string, soundId: string) => void;
    unlockDuration: (minutes: number, cost: number) => boolean;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userData, setUserData] = useState<UserData>(INITIAL_DATA);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await loadUserData();
        setUserData(data);
        if (data.equippedTheme) {
            audioService.setTheme(data.equippedTheme);
        }
        if (data.equippedSounds) {
            audioService.updateEquippedSounds(data.equippedSounds);
        }
        setIsLoading(false);
    };

    const addProgress = (minutes: number) => {
        const xpGained = Math.floor(minutes * XP_PER_MINUTE);

        setUserData(prev => {
            const newTotalMinutes = prev.totalMinutes + minutes;
            const newCompletedPomodoros = prev.completedPomodoros + 1;
            const newStreak = prev.streak + 1;

            const currentLifetimeXp = prev.lifetimeXp || (prev.totalMinutes * XP_PER_MINUTE);
            let newLifetimeXp = currentLifetimeXp + xpGained;

            // Check Achievements
            const newAchievements = [...prev.achievements];
            let achievementXp = 0;

            const tempUserData = { ...prev, completedPomodoros: newCompletedPomodoros, totalMinutes: newTotalMinutes, streak: newStreak };

            ACHIEVEMENTS.forEach(ach => {
                if (!newAchievements.includes(ach.id) && ach.condition(tempUserData)) {
                    newAchievements.push(ach.id);
                    achievementXp += ach.xpReward;
                    audioService.playSound('success' as SoundType);
                    Alert.alert("Achievement Unlocked!", `${ach.title}: ${ach.description}`);
                }
            });

            const totalXpGained = xpGained + achievementXp;
            const finalXp = prev.xp + totalXpGained;
            newLifetimeXp += achievementXp;

            // Calculate Level based on newLifetimeXp
            const newLevel = Math.floor(Math.pow(newLifetimeXp / BASE_XP_LEVEL, 1 / LEVEL_EXPONENT)) + 1;

            if (newLevel > prev.level) {
                audioService.playSound('levelUp' as SoundType);
            }

            const newData = {
                ...prev,
                xp: finalXp,
                level: Math.max(prev.level, newLevel),
                completedPomodoros: newCompletedPomodoros,
                totalMinutes: newTotalMinutes,
                lifetimeXp: newLifetimeXp,
                streak: newStreak,
                achievements: newAchievements,
            };

            saveUserData(newData);
            return newData;
        });
    };

    const resetStreak = () => {
        setUserData(prev => {
            const newData = { ...prev, streak: 0 };
            saveUserData(newData);
            return newData;
        });
    };

    const unlockTheme = (themeId: ThemeId, cost: number) => {
        if (userData.xp >= cost && !userData.unlockedThemes.includes(themeId)) {
            setUserData(prev => {
                const newData = {
                    ...prev,
                    xp: prev.xp - cost,
                    unlockedThemes: [...prev.unlockedThemes, themeId],
                };
                saveUserData(newData);
                return newData;
            });
            audioService.playSound('purchase' as SoundType);
            return true;
        }
        return false;
    };

    const equipTheme = (themeId: ThemeId) => {
        if (userData.unlockedThemes.includes(themeId)) {
            setUserData(prev => {
                const newData = { ...prev, equippedTheme: themeId };
                saveUserData(newData);
                return newData;
            });
            audioService.setTheme(themeId);
        }
    };

    const updateProfile = (name: string, avatarUri: string) => {
        setUserData(prev => {
            const newData = { ...prev, name, avatarUri };
            saveUserData(newData);
            return newData;
        });
    };

    const unlockSound = (soundId: string, cost: number) => {
        if (userData.xp >= cost && !userData.unlockedSounds.includes(soundId)) {
            setUserData(prev => {
                const newData = {
                    ...prev,
                    xp: prev.xp - cost,
                    unlockedSounds: [...prev.unlockedSounds, soundId],
                };
                saveUserData(newData);
                return newData;
            });
            audioService.playSound('purchase' as SoundType);
            return true;
        }
        return false;
    };

    const equipSound = (soundType: string, soundId: string) => {
        if (userData.unlockedSounds.includes(soundId)) {
            setUserData(prev => {
                const newData = {
                    ...prev,
                    equippedSounds: {
                        ...prev.equippedSounds,
                        [soundType]: soundId,
                    },
                };
                saveUserData(newData);
                audioService.updateEquippedSounds(newData.equippedSounds);
                return newData;
            });
        }
    };

    const unlockDuration = (minutes: number, cost: number) => {
        if (userData.xp >= cost && !userData.unlockedDurations.includes(minutes)) {
            setUserData(prev => {
                const newData = {
                    ...prev,
                    xp: prev.xp - cost,
                    unlockedDurations: [...prev.unlockedDurations, minutes].sort((a, b) => a - b),
                };
                saveUserData(newData);
                return newData;
            });
            audioService.playSound('purchase' as SoundType);
            return true;
        }
        return false;
    };

    return (
        <GamificationContext.Provider value={{
            userData,
            addProgress,
            resetStreak,
            unlockTheme,
            equipTheme,
            updateProfile,
            isLoading,
            unlockSound,
            equipSound,
            unlockDuration
        }}>
            {children}
        </GamificationContext.Provider>
    );
};

export const useGamification = () => {
    const context = useContext(GamificationContext);
    if (!context) {
        throw new Error('useGamification must be used within a GamificationProvider');
    }
    return context;
};
