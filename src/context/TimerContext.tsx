import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import * as Notifications from 'expo-notifications';
import { audioService } from '../services/audio';

// Configure notifications
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
    }),
});

interface TimerContextType {
    timeLeft: number; // in seconds
    isActive: boolean;
    isPaused: boolean;
    duration: number; // in seconds
    startTimer: (minutes: number) => void;
    pauseTimer: () => void;
    resumeTimer: () => void;
    stopTimer: () => void; // Give up
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode; onComplete: (minutes: number) => void }> = ({ children, onComplete }) => {
    const [timeLeft, setTimeLeft] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [duration, setDuration] = useState(0);

    const endTimeRef = useRef<number | null>(null);
    const pausedTimeRef = useRef<number | null>(null);
    const appState = useRef(AppState.currentState);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', handleAppStateChange);
        const interval = setInterval(tick, 1000);

        return () => {
            subscription.remove();
            clearInterval(interval);
        };
    }, [isActive, isPaused]);

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
        if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
            // Coming to foreground
            if (isActive && !isPaused && endTimeRef.current) {
                const now = Date.now();
                const remaining = Math.max(0, Math.ceil((endTimeRef.current - now) / 1000));
                setTimeLeft(remaining);
            }
        }
        appState.current = nextAppState;
    };

    const tick = () => {
        if (!isActive || isPaused) return;

        if (endTimeRef.current) {
            const now = Date.now();
            const remaining = Math.max(0, Math.ceil((endTimeRef.current - now) / 1000));
            setTimeLeft(remaining);

            // Send IPC to Electron
            if (window.require) {
                try {
                    const { ipcRenderer } = window.require('electron');
                    const progress = duration > 0 ? remaining / duration : 0;
                    ipcRenderer.send('update-timer', { timeLeft: remaining, progress });
                } catch (e) {
                    // Not in Electron
                }
            }

            if (remaining <= 0) {
                completeTimer();
            }
        }
    };

    const startTimer = async (minutes: number) => {
        const seconds = minutes * 60;
        setDuration(seconds);
        setTimeLeft(seconds);
        setIsActive(true);
        setIsPaused(false);
        endTimeRef.current = Date.now() + seconds * 1000;

        // Play sound
        await audioService.playSound('click');

        // Schedule notification
        await scheduleNotification(seconds);
    };

    const pauseTimer = async () => {
        if (!isActive) return;
        setIsPaused(true);
        pausedTimeRef.current = Date.now();
        await audioService.playSound('click');
        await Notifications.cancelAllScheduledNotificationsAsync();
    };

    const resumeTimer = async () => {
        if (!isActive || !isPaused || !pausedTimeRef.current || !endTimeRef.current) return;

        const now = Date.now();
        const pausedDuration = now - pausedTimeRef.current;
        endTimeRef.current += pausedDuration; // Shift end time

        setIsPaused(false);
        pausedTimeRef.current = null;

        await audioService.playSound('click');

        // Reschedule notification
        await scheduleNotification(timeLeft);
    };

    const stopTimer = async () => {
        setIsActive(false);
        setIsPaused(false);
        setTimeLeft(0);
        endTimeRef.current = null;
        await audioService.playSound('giveup');
        await Notifications.cancelAllScheduledNotificationsAsync();

        // Reset Electron Taskbar/Tray
        if (window.require) {
            try {
                const { ipcRenderer } = window.require('electron');
                ipcRenderer.send('update-timer', { timeLeft: 0, progress: 0 });
            } catch (e) { }
        }
    };

    const completeTimer = async () => {
        setIsActive(false);
        setIsPaused(false);
        setTimeLeft(0);
        endTimeRef.current = null;
        await audioService.playSound('alarm');
        onComplete(duration / 60);
    };

    const scheduleNotification = async (seconds: number) => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Focus Session Complete! 🎉",
                body: "Time to take a break or start a new session.",
                sound: true,
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: seconds,
                repeats: false,
            },
        });
    };

    return (
        <TimerContext.Provider value={{ timeLeft, isActive, isPaused, duration, startTimer, pauseTimer, resumeTimer, stopTimer }}>
            {children}
        </TimerContext.Provider>
    );
};

export const useTimer = () => {
    const context = useContext(TimerContext);
    if (!context) {
        throw new Error('useTimer must be used within a TimerProvider');
    }
    return context;
};
