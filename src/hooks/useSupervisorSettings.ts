import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { PlayerColor, SupervisorSetting } from '../types';

type SettingsMap = Record<PlayerColor, SupervisorSetting | null>;

const initialSettings: SettingsMap = {
  red: null,
  green: null,
  yellow: null,
  blue: null,
};

export function useSupervisorSettings() {
  const [settings, setSettings] = useState<SettingsMap>(initialSettings);
  const [loading, setLoading] = useState(Boolean(supabase));

  const load = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('supervisor_settings')
        .select('*');

      if (error) {
        throw error;
      }

      const next: SettingsMap = {
        red: null,
        green: null,
        yellow: null,
        blue: null,
      };

      (data ?? []).forEach((row: any) => {
        if (row?.color && row.color in next) {
          next[row.color as PlayerColor] = row as SupervisorSetting;
        }
      });

      setSettings(next);
    } catch (error) {
      console.error('Failed to load supervisor settings', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();

    const client = supabase;

    if (!client) {
      return;
    }

    const channel = client
      .channel('supervisor-settings-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'supervisor_settings',
        },
        () => {
          load();
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [load]);

  return {
    settings,
    loading,
  };
}
