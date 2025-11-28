import { Audio } from 'expo-av';
import { THEMES, ThemeId } from '../constants/theme';
import { SOUND_ITEMS, SoundType } from '../constants/shop';

// Background music tracks
const MUSIC_URLS: Record<string, string> = {
    lofi: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    upbeat: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3',
    ambient: 'https://cdn.pixabay.com/download/audio/2022/02/07/audio_6585440601.mp3',
};

class AudioService {
    private sounds: Partial<Record<string, Audio.Sound>> = {}; // Keyed by Sound ID
    private music: Audio.Sound | null = null;
    private isSoundEnabled: boolean = true;
    private isMusicEnabled: boolean = false;
    private soundVolume: number = 0.8;
    private musicVolume: number = 0.5;

    private equippedSounds: Record<string, string> = {
        click: 'click_default',
        alarm: 'alarm_default',
        start: 'start_default',
        giveup: 'giveup_default',
    };

    constructor() {
        // Lazy load sounds when needed or pre-load defaults
    }

    public updateEquippedSounds(newEquippedSounds: Record<string, string>) {
        this.equippedSounds = { ...this.equippedSounds, ...newEquippedSounds };
        // Optionally preload new sounds here
    }

    public setTheme(themeId: ThemeId) {
        this.playMusic(themeId);
    }

    public updateSettings(soundEnabled: boolean, soundVolume: number, musicEnabled: boolean, musicVolume: number) {
        this.isSoundEnabled = soundEnabled;
        this.soundVolume = soundVolume;
        this.isMusicEnabled = musicEnabled;
        this.musicVolume = musicVolume;

        // Update volumes of loaded sounds
        Object.values(this.sounds).forEach(sound => {
            sound?.setVolumeAsync(soundVolume);
        });

        if (this.music) {
            this.music.setVolumeAsync(musicVolume);
            if (!musicEnabled) {
                this.music.pauseAsync();
            } else {
                this.music.playAsync();
            }
        }
    }

    public async playSound(type: SoundType) {
        if (!this.isSoundEnabled) return;

        const soundId = this.equippedSounds[type];
        if (!soundId) return;

        try {
            // Check if sound is already loaded
            let sound = this.sounds[soundId];

            if (!sound) {
                // Find URL
                const item = SOUND_ITEMS.find(i => i.id === soundId);
                if (item && item.soundUrl) {
                    const { sound: newSound } = await Audio.Sound.createAsync(
                        { uri: item.soundUrl },
                        { shouldPlay: false, volume: this.soundVolume }
                    );
                    this.sounds[soundId] = newSound;
                    sound = newSound;
                }
            }

            if (sound) {
                await sound.replayAsync();
            }
        } catch (error) {
            console.log('Error playing sound:', error);
        }
    }

    public async playMusic(themeId: string) {
        if (!this.isMusicEnabled) return;

        const theme = THEMES[themeId as keyof typeof THEMES];
        const musicUrl = theme?.musicUrl || MUSIC_URLS.lofi;

        try {
            if (this.music) {
                await this.music.unloadAsync();
            }
            const { sound } = await Audio.Sound.createAsync(
                { uri: musicUrl },
                { shouldPlay: true, isLooping: true, volume: this.musicVolume }
            );
            this.music = sound;
        } catch (error) {
            console.log('Error playing music:', error);
        }
    }
}

export const audioService = new AudioService();
