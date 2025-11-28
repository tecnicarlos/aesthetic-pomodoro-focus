export type ThemeId =
    | 'minimalist'
    | 'lofi'
    | 'cyberpunk'
    | 'sunset'
    | 'forest'
    | 'midnight'
    | 'cherry'
    | 'matrix'
    | 'vaporwave'
    | 'ocean'
    | 'gold'
    | 'coffee'
    | 'space'
    | 'dream'
    | 'noir'
    | 'diamond'
    | 'timegod';

export type SoundPackId = 'default' | 'retro' | 'soft' | 'futuristic' | 'nature';

export interface Theme {
    id: ThemeId;
    name: string;
    colors: {
        background: [string, string]; // Gradient colors
        text: string;
        primary: string;
        secondary: string;
        accent: string;
        surface: string; // For cards/modals
    };
    darkColors?: {
        background: [string, string];
        text: string;
        primary: string;
        secondary: string;
        accent: string;
        surface: string;
    };
    vibe: string; // Description
    soundFile?: string; // Placeholder for sound file path
    musicUrl?: string; // Background music URL
    price: number; // XP cost
    soundPack: SoundPackId;
}

export const THEMES: Record<ThemeId, Theme> = {
    minimalist: {
        id: 'minimalist',
        name: 'Minimalist White',
        colors: {
            background: ['#ffffff', '#f0f0f0'],
            text: '#333333',
            primary: '#000000',
            secondary: '#666666',
            accent: '#e0e0e0',
            surface: 'rgba(255, 255, 255, 0.9)',
        },
        darkColors: {
            background: ['#121212', '#2c2c2c'],
            text: '#ffffff',
            primary: '#ffffff',
            secondary: '#a0a0a0',
            accent: '#404040',
            surface: 'rgba(30, 30, 30, 0.9)',
        },
        vibe: 'Clean, focused, distraction-free.',
        price: 0,
        musicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3', // Lofi Chill
        soundPack: 'default',
    },
    lofi: {
        id: 'lofi',
        name: 'Lo-Fi Rain',
        colors: {
            background: ['#2b32b2', '#1488cc'],
            text: '#e0e0e0',
            primary: '#ffd700',
            secondary: '#a0a0a0',
            accent: '#4b0082',
            surface: 'rgba(0, 0, 0, 0.6)',
        },
        darkColors: {
            background: ['#1a1f71', '#0d5c8a'],
            text: '#cccccc',
            primary: '#e6c200',
            secondary: '#808080',
            accent: '#300052',
            surface: 'rgba(0, 0, 0, 0.8)',
        },
        vibe: 'Relaxing, cozy, rainy evening.',
        price: 100,
        musicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3', // Lofi Chill
        soundPack: 'soft',
    },
    cyberpunk: {
        id: 'cyberpunk',
        name: 'Cyberpunk Neon',
        colors: {
            background: ['#0f0c29', '#302b63'],
            text: '#00ffcc',
            primary: '#ff0099',
            secondary: '#cc00ff',
            accent: '#00ffcc',
            surface: 'rgba(15, 12, 41, 0.8)',
        },
        darkColors: {
            background: ['#05040e', '#181531'],
            text: '#00ccaa',
            primary: '#cc007a',
            secondary: '#9900cc',
            accent: '#00ccaa',
            surface: 'rgba(10, 8, 30, 0.9)',
        },
        vibe: 'High-tech, energetic, futuristic.',
        price: 500,
        musicUrl: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3', // Upbeat
        soundPack: 'futuristic',
    },
    sunset: {
        id: 'sunset',
        name: 'Sunset Vibes',
        colors: {
            background: ['#ff512f', '#dd2476'],
            text: '#fff',
            primary: '#ffeb3b',
            secondary: '#ffccbc',
            accent: '#ff9800',
            surface: 'rgba(255, 81, 47, 0.8)',
        },
        darkColors: {
            background: ['#8f2c1a', '#7a1441'],
            text: '#e0e0e0',
            primary: '#d4c028',
            secondary: '#cc9e8e',
            accent: '#cc7a00',
            surface: 'rgba(143, 44, 26, 0.9)',
        },
        vibe: 'Warm, energetic, evening glow.',
        price: 200,
        musicUrl: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3', // Upbeat
        soundPack: 'retro',
    },
    forest: {
        id: 'forest',
        name: 'Deep Forest',
        colors: {
            background: ['#134e5e', '#71b280'],
            text: '#e8f5e9',
            primary: '#a5d6a7',
            secondary: '#81c784',
            accent: '#2e7d32',
            surface: 'rgba(19, 78, 94, 0.8)',
        },
        darkColors: {
            background: ['#0a2b33', '#3e6146'],
            text: '#c8e6c9',
            primary: '#74a676',
            secondary: '#5a8c5d',
            accent: '#1b4d1e',
            surface: 'rgba(10, 43, 51, 0.9)',
        },
        vibe: 'Natural, calm, fresh air.',
        price: 250,
        musicUrl: 'https://cdn.pixabay.com/download/audio/2022/02/07/audio_6585440601.mp3', // Ambient
        soundPack: 'nature',
    },
    midnight: {
        id: 'midnight',
        name: 'Midnight Blue',
        colors: {
            background: ['#000428', '#004e92'],
            text: '#fff',
            primary: '#4fc3f7',
            secondary: '#0288d1',
            accent: '#b3e5fc',
            surface: 'rgba(0, 4, 40, 0.8)',
        },
        darkColors: {
            background: ['#000214', '#002749'],
            text: '#e0e0e0',
            primary: '#29b6f6',
            secondary: '#01579b',
            accent: '#81d4fa',
            surface: 'rgba(0, 2, 20, 0.9)',
        },
        vibe: 'Deep focus, silent night.',
        price: 300,
        musicUrl: 'https://cdn.pixabay.com/download/audio/2022/02/07/audio_6585440601.mp3', // Ambient
        soundPack: 'soft',
    },
    cherry: {
        id: 'cherry',
        name: 'Cherry Blossom',
        colors: {
            background: ['#fbc2eb', '#a6c1ee'],
            text: '#4a4a4a',
            primary: '#ff80ab',
            secondary: '#ff4081',
            accent: '#f50057',
            surface: 'rgba(251, 194, 235, 0.8)',
        },
        darkColors: {
            background: ['#7d6175', '#536077'],
            text: '#e0e0e0',
            primary: '#cc6689',
            secondary: '#cc3367',
            accent: '#c20045',
            surface: 'rgba(125, 97, 117, 0.9)',
        },
        vibe: 'Soft, floral, spring breeze.',
        price: 350,
        musicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3', // Lofi Chill
        soundPack: 'soft',
    },
    matrix: {
        id: 'matrix',
        name: 'The Matrix',
        colors: {
            background: ['#000000', '#0f2027'],
            text: '#00ff00',
            primary: '#00ff00',
            secondary: '#003300',
            accent: '#33ff33',
            surface: 'rgba(0, 0, 0, 0.9)',
        },
        darkColors: {
            background: ['#000000', '#050b0d'],
            text: '#00cc00',
            primary: '#00cc00',
            secondary: '#001a00',
            accent: '#29cc29',
            surface: 'rgba(0, 0, 0, 0.95)',
        },
        vibe: 'Digital, code, hacker mode.',
        price: 1000,
        musicUrl: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3', // Upbeat
        soundPack: 'futuristic',
    },
    vaporwave: {
        id: 'vaporwave',
        name: 'Vaporwave',
        colors: {
            background: ['#f79d00', '#64f38c'],
            text: '#2c3e50',
            primary: '#e74c3c',
            secondary: '#8e44ad',
            accent: '#3498db',
            surface: 'rgba(255, 255, 255, 0.7)',
        },
        darkColors: {
            background: ['#7b4e00', '#327946'],
            text: '#e0e0e0',
            primary: '#b93c30',
            secondary: '#71368a',
            accent: '#297ab0',
            surface: 'rgba(40, 40, 40, 0.8)',
        },
        vibe: 'Retro, nostalgic, glitchy.',
        price: 800,
        musicUrl: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3', // Upbeat
        soundPack: 'retro',
    },
    ocean: {
        id: 'ocean',
        name: 'Ocean Breeze',
        colors: {
            background: ['#2193b0', '#6dd5ed'],
            text: '#fff',
            primary: '#b2ebf2',
            secondary: '#4dd0e1',
            accent: '#00bcd4',
            surface: 'rgba(33, 147, 176, 0.8)',
        },
        darkColors: {
            background: ['#104958', '#366a76'],
            text: '#e0e0e0',
            primary: '#8ebcc1',
            secondary: '#3da6b4',
            accent: '#0096aa',
            surface: 'rgba(16, 73, 88, 0.9)',
        },
        vibe: 'Cool, refreshing, vast.',
        price: 400,
        musicUrl: 'https://cdn.pixabay.com/download/audio/2022/02/07/audio_6585440601.mp3', // Ambient
        soundPack: 'nature',
    },
    gold: {
        id: 'gold',
        name: 'Luxury Gold',
        colors: {
            background: ['#bf953f', '#fcf6ba'],
            text: '#4a3b00',
            primary: '#b38728',
            secondary: '#fbf5b7',
            accent: '#aa771c',
            surface: 'rgba(255, 255, 255, 0.9)',
        },
        darkColors: {
            background: ['#5f4a1f', '#7e7b5d'],
            text: '#fcf6ba',
            primary: '#d4a030',
            secondary: '#7d7a5b',
            accent: '#cc8e22',
            surface: 'rgba(95, 74, 31, 0.9)',
        },
        vibe: 'Premium, rich, exclusive.',
        price: 5000,
        musicUrl: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3', // Upbeat
        soundPack: 'default',
    },
    coffee: {
        id: 'coffee',
        name: 'Coffee Shop',
        colors: {
            background: ['#3e2723', '#5d4037'],
            text: '#d7ccc8',
            primary: '#a1887f',
            secondary: '#8d6e63',
            accent: '#795548',
            surface: 'rgba(62, 39, 35, 0.9)',
        },
        darkColors: {
            background: ['#1f1311', '#2e201b'],
            text: '#bcaaa4',
            primary: '#8d6e63',
            secondary: '#6d4c41',
            accent: '#5d4037',
            surface: 'rgba(31, 19, 17, 0.95)',
        },
        vibe: 'Warm, aromatic, productive.',
        price: 150,
        musicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3', // Lofi Chill
        soundPack: 'soft',
    },
    space: {
        id: 'space',
        name: 'Deep Space',
        colors: {
            background: ['#000428', '#000000'],
            text: '#fff',
            primary: '#90caf9',
            secondary: '#bdbdbd',
            accent: '#e0e0e0',
            surface: 'rgba(0, 0, 0, 0.8)',
        },
        darkColors: {
            background: ['#000214', '#000000'],
            text: '#e0e0e0',
            primary: '#64b5f6',
            secondary: '#9e9e9e',
            accent: '#bdbdbd',
            surface: 'rgba(0, 0, 0, 0.9)',
        },
        vibe: 'Infinite, quiet, starry.',
        price: 600,
        musicUrl: 'https://cdn.pixabay.com/download/audio/2022/02/07/audio_6585440601.mp3', // Ambient
        soundPack: 'futuristic',
    },
    dream: {
        id: 'dream',
        name: 'Sweet Dreams',
        colors: {
            background: ['#a18cd1', '#fbc2eb'],
            text: '#fff',
            primary: '#f8bbd0',
            secondary: '#e1bee7',
            accent: '#ce93d8',
            surface: 'rgba(161, 140, 209, 0.8)',
        },
        darkColors: {
            background: ['#504668', '#7d6175'],
            text: '#e0e0e0',
            primary: '#c48b9f',
            secondary: '#b08eb5',
            accent: '#9c6fa3',
            surface: 'rgba(80, 70, 104, 0.9)',
        },
        vibe: 'Soft, pastel, dreamy.',
        price: 450,
        musicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3', // Lofi Chill
        soundPack: 'soft',
    },
    noir: {
        id: 'noir',
        name: 'Film Noir',
        colors: {
            background: ['#232526', '#414345'],
            text: '#e0e0e0',
            primary: '#9e9e9e',
            secondary: '#616161',
            accent: '#bdbdbd',
            surface: 'rgba(35, 37, 38, 0.9)',
        },
        darkColors: {
            background: ['#111213', '#202122'],
            text: '#cccccc',
            primary: '#757575',
            secondary: '#424242',
            accent: '#9e9e9e',
            surface: 'rgba(17, 18, 19, 0.95)',
        },
        vibe: 'Classic, monochrome, serious.',
        price: 700,
        musicUrl: 'https://cdn.pixabay.com/download/audio/2022/02/07/audio_6585440601.mp3', // Ambient
        soundPack: 'retro',
    },
    diamond: {
        id: 'diamond',
        name: 'Diamond Elite',
        colors: {
            background: ['#E0EAFC', '#CFDEF3'],
            text: '#2c3e50',
            primary: '#b9f2ff',
            secondary: '#a0d8ef',
            accent: '#00ffff',
            surface: 'rgba(255, 255, 255, 0.8)',
        },
        darkColors: {
            background: ['#1c2a3a', '#101a26'],
            text: '#e0eafc',
            primary: '#00bcd4',
            secondary: '#0097a7',
            accent: '#00e5ff',
            surface: 'rgba(28, 42, 58, 0.9)',
        },
        vibe: 'Pure luxury, brilliance, perfection.',
        price: 10000,
        musicUrl: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3', // Upbeat
        soundPack: 'futuristic',
    },
    timegod: {
        id: 'timegod',
        name: 'Time God',
        colors: {
            background: ['#20002c', '#cbb4d4'],
            text: '#ffd700',
            primary: '#ffd700',
            secondary: '#c0c0c0',
            accent: '#ffffff',
            surface: 'rgba(32, 0, 44, 0.9)',
        },
        darkColors: {
            background: ['#100016', '#655a6a'],
            text: '#ccac00',
            primary: '#ccac00',
            secondary: '#808080',
            accent: '#e0e0e0',
            surface: 'rgba(16, 0, 22, 0.95)',
        },
        vibe: 'Master of time, celestial, omnipotent.',
        price: 50000,
        musicUrl: 'https://cdn.pixabay.com/download/audio/2022/02/07/audio_6585440601.mp3', // Ambient
        soundPack: 'futuristic',
    },
};

export const XP_PER_MINUTE = 10;
export const LEVEL_EXPONENT = 1.5;
export const BASE_XP_LEVEL = 100;
