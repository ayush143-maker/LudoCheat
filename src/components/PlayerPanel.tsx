import { UserRound } from 'lucide-react';
import type { PlayerColor } from '../types';

export default function PlayerPanel({
  color,
  active,
  finished,
}: {
  color: PlayerColor;
  active: boolean;
  finished: number;
}) {
  return (
    <div
      className={`player-panel panel-${color}${active ? ' panel-active' : ''}`}
    >
      <div className="panel-avatar">
        <UserRound size={18} strokeWidth={2.4} />
      </div>

      <div className="panel-meta">
        <span className="panel-name">{color.toUpperCase()}</span>
        <div className="panel-dots">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={`pdot${i < finished ? ' pdot-on' : ''}`} />
          ))}
        </div>
      </div>

      {active && <span className="panel-turn">TURN</span>}
    </div>
  );
}
