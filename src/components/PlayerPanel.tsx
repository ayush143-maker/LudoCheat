import { UserRound, ArrowLeft, ArrowRight } from 'lucide-react';
import type { PlayerColor } from '../types';
import Dice from './Dice';

type Corner = 'tl' | 'tr' | 'bl' | 'br';

const RIGHT_SIDE: Record<Corner, boolean> = {
  tl: false,
  tr: true,
  bl: false,
  br: true,
};

export default function PlayerPanel({
  corner,
  color,
  active,
  finished,
  dice,
}: {
  corner: Corner;
  color: PlayerColor;
  active: boolean;
  finished: number;
  dice?: {
    value: number | null;
    rolling: boolean;
    canRoll: boolean;
    onRoll: () => void;
  };
}) {
  const rightSide = RIGHT_SIDE[corner];
  const showDice = active && !!dice;
  const Arrow = rightSide ? ArrowRight : ArrowLeft;

  return (
    <div
      className={`corner-panel corner-${corner} panel-${color}${
        rightSide ? ' corner-flip' : ''
      }`}
    >
      <div className="corner-pin">
        <UserRound size={16} strokeWidth={2.6} />
        <div className="corner-dots">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={`pdot${i < finished ? ' pdot-on' : ''}`} />
          ))}
        </div>
      </div>

      {showDice ? (
        <button
          type="button"
          className="corner-box corner-box-dice panel-active"
          onClick={dice!.onRoll}
          disabled={!dice!.canRoll}
          aria-label="Tap to roll"
        >
          <Dice value={dice!.value} rolling={dice!.rolling} color={color} />
        </button>
      ) : (
        <div className={`corner-box${active ? ' panel-active' : ''}`} />
      )}

      {showDice && (
        <span className="corner-arrow" aria-hidden="true">
          <Arrow size={18} strokeWidth={3} />
        </span>
      )}
    </div>
  );
}
