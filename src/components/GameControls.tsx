import Dice from './Dice';
import type { PlayerColor } from '../types';

export default function GameControls({
  status,
  diceValue,
  rolling,
  color,
  canRoll,
  onRoll,
}: {
  status: string;
  diceValue: number | null;
  rolling: boolean;
  color: PlayerColor;
  canRoll: boolean;
  onRoll: () => void;
}) {
  return (
    <div className="game-controls">
      <div className="status-pill" aria-live="polite">
        {status}
      </div>

      <div className="controls-row">
        <button
          className="dice-tap"
          onClick={onRoll}
          disabled={!canRoll}
          aria-label="Tap dice to roll"
        >
          <Dice value={diceValue} rolling={rolling} color={color} />
        </button>

        <button
          className="roll-button"
          onClick={onRoll}
          disabled={!canRoll}
        >
          {rolling ? 'ROLLING' : 'ROLL'}
        </button>
      </div>
    </div>
  );
}
