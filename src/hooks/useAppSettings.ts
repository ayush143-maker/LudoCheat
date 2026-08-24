import { useEffect, useState } from 'react';
import type { AppSettings } from '../types';

const STORAGE_KEY = 'ludo-nova-settings';

const fallbackSettings: AppSettings = {
  sound: true,
  vibration: true,
  animations: true,
};

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return fallbackSettings;

      return {
        ...fallbackSettings,
        ...JSON.parse(raw),
      };
    } catch {
      return fallbackSettings;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Ignore storage errors.
    }

    document.body.classList.toggle('no-animations', !settings.animations);
  }, [settings]);

  const update = (patch: Partial<AppSettings>) => {
    setSettings((current) => ({
      ...current,
      ...patch,
    }));
  };

  return {
    settings,
    update,
  };
}
