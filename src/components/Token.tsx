import type { PlayerColor } from '../types';

const OFFSETS: [number, number][] = [
  [0, 0],
  [-34, -34],
  [34, -34],
  [-34, 34],
  [34, 34],
];

export default function Token({
  color,
  row,
  col,
  valid,
  interactive,
  finished,
  groupCount,
  groupIndex,
  shake,
  onClick,
}: {
  color: PlayerColor;
  row: number;
  col: number;
  valid: boolean;
  interactive: boolean;
  finished: boolean;
  groupCount: number;
  groupIndex: number;
  shake: boolean;
  onClick: () => void;
}) {
  const [dx, dy] = OFFSETS[Math.min(groupIndex, OFFSETS.length - 1)] ?? [0, 0];
  const scale = groupCount > 1 ? 0.78 : 1;

  return (
    <button
      type="button"
      aria-label={`${color} token`}
      className={[
        'token',
        `token-${color}`,
        valid ? 'token-valid' : '',
        shake ? 'token-shake' : '',
        finished ? 'token-finished' : '',
        interactive ? '' : 'token-locked',
      ].join(' ')}
      style={{
        top: `${(row / 15) * 100}%`,
        left: `${(col / 15) * 100}%`,
        transform: `translate(-50%, -50%) translate(${dx}%, ${dy}%) scale(${scale})`,
      }}
      onClick={() => {
        if (!interactive) return;
        onClick();
      }}
    >
      <span className="token-inner" />
    </button>
  );
}
