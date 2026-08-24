import {
  ArrowLeft,
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
        <ArrowLeft size={16} />
      </button>

      <div className="header-spacer" />

      <button className="gbtn" onClick={onHelp} aria-label="Help">
        <HelpCircle size={15} />
      </button>

      <button className="gbtn" onClick={onSettings} aria-label="Settings">
        <Settings size={15} />
      </button>

      <button className="gbtn" onClick={onExit} aria-label="Exit">
        <LogOut size={15} />
      </button>
    </header>
  );
}
