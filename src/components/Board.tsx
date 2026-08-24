import type { GameState, PlayerColor } from '../types';
import {
  BASE_SLOTS,
  COLORS,
  HOME_PATH,
  PATH,
  SAFE_INDICES,
  getTokenCoordinate,
} from '../lib/ludo';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Star,
} from 'lucide-react';
import Token from './Token';

const CELL = 100 / 15;

function cellStyle([row, col]: [number, number]) {
  return {
    top: `${row * CELL}%`,
    left: `${col * CELL}%`,
    width: `${CELL}%`,
    height: `${CELL}%`,
  };
}

function pointStyle([row, col]: [number, number]) {
  return {
    top: `${row * CELL}%`,
    left: `${col * CELL}%`,
  };
}

const START_CELL_COLOR: Record<number, PlayerColor> = {
  0: 'red',
  13: 'green',
  26: 'yellow',
  39: 'blue',
};

const START_ARROW: Record<number, typeof ArrowUp> = {
  0: ArrowRight,
  13: ArrowDown,
  26: ArrowLeft,
  39: ArrowUp,
};

interface BoardProps {
  state: GameState;
  shakeToken: string | null;
  onTokenClick: (color: PlayerColor, id: number) => void;
  onInvalidToken: (color: PlayerColor, id: number) => void;
}

export default function Board({
  state,
  shakeToken,
  onTokenClick,
  onInvalidToken,
}: BoardProps) {
  type RenderToken = {
    color: PlayerColor;
    id: number;
    coord: [number, number];
    progress: number;
  };

  const groups = new Map<string, RenderToken[]>();

  for (const color of COLORS) {
    for (const token of state.tokens[color]) {
      const coord = getTokenCoordinate(color, token);
      const key = `${coord[0]}:${coord[1]}`;

      const arr = groups.get(key) ?? [];
      arr.push({ color, id: token.id, coord, progress: token.progress });
      groups.set(key, arr);
    }
  }

  return (
    <div className="board">
      <div className="board-frame">
        <div className="base base-red" />
        <div className="base base-green" />
        <div className="base base-yellow" />
        <div className="base base-blue" />

        <span className="quad-label quad-label-red">RED</span>
        <span className="quad-label quad-label-green">GREEN</span>
        <span className="quad-label quad-label-yellow">YELLOW</span>
        <span className="quad-label quad-label-blue">BLUE</span>

        <div className="center">
          <div className="center-red" />
          <div className="center-green" />
          <div className="center-yellow" />
          <div className="center-blue" />
        </div>

        {PATH.map((coord, index) => {
          const startColor = START_CELL_COLOR[index];
          const Arrow = startColor ? START_ARROW[index] : null;

          return (
            <div
              key={`path-${index}`}
              className={`cell ${startColor ? `cell-start cell-${startColor}` : ''} ${
                SAFE_INDICES.has(index) ? 'cell-safe' : ''
              }`}
              style={cellStyle(coord)}
            >
              {Arrow ? (
                <span className="start-arrow">
                  <Arrow strokeWidth={3.2} />
                </span>
              ) : SAFE_INDICES.has(index) ? (
                <span className="safe-star">
                  <Star strokeWidth={1.6} />
                </span>
              ) : null}
            </div>
          );
        })}

        {COLORS.flatMap((color) =>
          HOME_PATH[color]
            .slice(0, 5)
            .map((coord, index) => (
              <div
                key={`home-${color}-${index}`}
                className={`cell home-cell cell-${color}`}
                style={cellStyle(coord)}
              />
            ))
        )}

        {COLORS.flatMap((color) =>
          BASE_SLOTS[color].map((coord, index) => (
            <div
              key={`slot-${color}-${index}`}
              className={`base-slot base-slot-${color}`}
              style={pointStyle(coord)}
            />
          ))
        )}

        {Array.from(groups.entries()).flatMap(([_, group]) =>
          group.map((item, index) => {
            const interactive =
              item.color === state.current &&
              state.phase === 'rolled' &&
              !state.winner;

            const valid = interactive && state.validTokenIds.includes(item.id);

            return (
              <Token
                key={`${item.color}-${item.id}`}
                color={item.color}
                row={item.coord[0]}
                col={item.coord[1]}
                valid={valid}
                interactive={interactive}
                finished={item.progress >= 56}
                groupCount={group.length}
                groupIndex={index}
                shake={shakeToken === `${item.color}-${item.id}`}
                onClick={() => {
                  if (valid) {
                    onTokenClick(item.color, item.id);
                  } else if (interactive) {
                    onInvalidToken(item.color, item.id);
                  }
                }}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
