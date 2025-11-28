import { useSettings } from '../context/SettingsContext';
import { translations, Language } from '../i18n';

export const useTranslation = () => {
    const { language } = useSettings();

    // Helper to get nested properties safely
    const t = (key: string, params?: Record<string, string | number>) => {
        const keys = key.split('.');
        let value: any = translations[language];

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return key; // Fallback to key if not found
            }
        }

        if (params && typeof value === 'string') {
            return value.replace(/\{(\w+)\}/g, (_, k) => params[k]?.toString() || `{${k}}`);
        }

        return value as string;
    };

    return { t, language };
};
