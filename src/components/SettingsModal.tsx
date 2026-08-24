import Modal from './Modal';
import Toggle from './Toggle';
import type { AppSettings } from '../types';

export default function SettingsModal({
  open,
  onClose,
  settings,
  onUpdate,
}: {
  open: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdate: (patch: Partial<AppSettings>) => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title="Settings">
      <Toggle
        label="Sound"
        checked={settings.sound}
        onChange={(value) => onUpdate({ sound: value })}
      />

      <Toggle
        label="Vibration"
        checked={settings.vibration}
        onChange={(value) => onUpdate({ vibration: value })}
      />

      <Toggle
        label="Animations"
        checked={settings.animations}
        onChange={(value) => onUpdate({ animations: value })}
      />

      <p className="muted small">Settings are saved on this device.</p>
    </Modal>
  );
}
