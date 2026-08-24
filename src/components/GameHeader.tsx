import {
  ArrowLeft,
  Coins,
  HelpCircle,
  LogOut,
  Settings,
} from 'lucide-react';

export default function GameHeader({
  onBack,
  onHelp,
  onSettings,
  onExit,
}: {
  onBack: () => void;
  onHelp: () => void;
  onSettings: () => void;
  onExit: () => void;
}) {
  return (
    <header className="game-header">
      <button className="gbtn" onClick={onBack} aria-label="Back">
        <ArrowLeft size={20} />
      </button>

      <div className="coin-chip">
        <Coins size={16} />
        <span>2,500</span>
      </div>

      <div className="header-spacer" />

      <button className="gbtn" onClick={onHelp} aria-label="Help">
        <HelpCircle size={19} />
      </button>

      <button className="gbtn" onClick={onSettings} aria-label="Settings">
        <Settings size={19} />
      </button>

      <button className="gbtn" onClick={onExit} aria-label="Exit">
        <LogOut size={19} />
      </button>
    </header>
  );
}
