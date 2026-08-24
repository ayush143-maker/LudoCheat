import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, Play, Settings as SettingsIcon } from 'lucide-react';
import Logo from '../components/Logo';
import SettingsModal from '../components/SettingsModal';
import HowToModal from '../components/HowToModal';
import { useAppSettings } from '../hooks/useAppSettings';

export default function Home() {
  const navigate = useNavigate();
  const { settings, update } = useAppSettings();

  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="page home-page">
      <div className="home-hero">
        <div className="home-logo-badge">
          <Logo size={92} />
        </div>
        <h1 className="app-title">LUDO NOVA</h1>
        <p className="app-sub">Classic 4-color race</p>
      </div>

      <button
        className="btn btn-gold btn-play"
        onClick={() => navigate('/game')}
      >
        <Play size={22} fill="currentColor" />
        PLAY
      </button>

      <div className="home-actions">
        <button className="btn btn-blue" onClick={() => setShowHelp(true)}>
          <HelpCircle size={18} />
          HOW TO PLAY
        </button>

        <button className="btn btn-blue" onClick={() => setShowSettings(true)}>
          <SettingsIcon size={18} />
          SETTINGS
        </button>
      </div>

      <SettingsModal
        open={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onUpdate={update}
      />

      <HowToModal open={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}
