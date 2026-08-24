import type { PlayerColor } from '../types';

const PIPS: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

export default function Dice({
  value,
  rolling,
  color,
}: {
  value: number | null;
  rolling: boolean;
  color: PlayerColor;
}) {
  const pips = value ? PIPS[value] ?? [] : [];

  return (
    <div
      className={`dice dice-${color} ${rolling ? 'dice-rolling' : ''}`}
      role="img"
      aria-label={value ? `Dice showing ${value}` : 'Dice'}
    >
      {Array.from({ length: 9 }, (_, index) => (
        <span
          key={index}
          className={`pip ${pips.includes(index) ? '' : 'pip-hidden'}`}
        />
      ))}
    </div>
  );
}
