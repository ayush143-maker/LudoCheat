export default function GameControls({
  status,
  canRoll,
  onRoll,
}: {
  status: string;
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
          className="roll-button"
          onClick={onRoll}
          disabled={!canRoll}
        >
          ROLL
        </button>
      </div>
    </div>
  );
}
