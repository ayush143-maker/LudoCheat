import { UserRound, ArrowLeft, ArrowRight } from 'lucide-react';
import type { PlayerColor } from '../types';
import Dice from './Dice';

export interface CornerDice {
  value: number | null;
  rolling: boolean;
  canRoll: boolean;
  onRoll: () => void;
}

export default function CornerBadge({
  side,
  color,
  active,
  dice,
}: {
  side: 'left' | 'right';
  color: PlayerColor;
  active: boolean;
  dice?: CornerDice;
}) {
  const showDice = active && !!dice;
  const Arrow = side === 'left' ? ArrowLeft : ArrowRight;

  const pin = (
    <span className={`corner-pin corner-pin-${color}`}>
      <UserRound size={16} strokeWidth={2.6} />
    </span>
  );

  const box = showDice ? (
    <button
      type="button"
      className="corner-box corner-box-dice"
      onClick={dice!.onRoll}
      disabled={!dice!.canRoll}
      aria-label="Tap to roll"
    >
      <Dice value={dice!.value} rolling={dice!.rolling} color={color} />
    </button>
  ) : (
    <span className="corner-box" aria-hidden="true" />
  );

  return (
    <div
      className={`corner-badge corner-side-${side}${
        active ? ' corner-badge-active' : ''
      }`}
    >
      {side === 'left' ? (
        <>
          {pin}
          {box}
        </>
      ) : (
        <>
          {box}
          {pin}
        </>
      )}

      {showDice && (
        <span className="corner-arrow" aria-hidden="true">
          <Arrow size={16} strokeWidth={3} />
        </span>
      )}
    </div>
  );
}
