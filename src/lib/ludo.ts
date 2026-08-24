import type {
  GameAction,
  GameState,
  PlayerColor,
  TokenState,
} from '../types';

export const COLORS: PlayerColor[] = ['red', 'green', 'yellow', 'blue'];
export const ORDER: PlayerColor[] = COLORS;

export const FINISH_PROGRESS = 56;

export const PATH: [number, number][] = [
  [6, 1],
  [6, 2],
  [6, 3],
  [6, 4],
  [6, 5],

  [5, 6],
  [4, 6],
  [3, 6],
  [2, 6],
  [1, 6],
  [0, 6],

  [0, 7],
  [0, 8],

  [1, 8],
  [2, 8],
  [3, 8],
  [4, 8],
  [5, 8],

  [6, 9],
  [6, 10],
  [6, 11],
  [6, 12],
  [6, 13],
  [6, 14],

  [7, 14],
  [8, 14],

  [8, 13],
  [8, 12],
  [8, 11],
  [8, 10],
  [8, 9],

  [9, 8],
  [10, 8],
  [11, 8],
  [12, 8],
  [13, 8],
  [14, 8],

  [14, 7],
  [14, 6],

  [13, 6],
  [12, 6],
  [11, 6],
  [10, 6],
  [9, 6],

  [8, 5],
  [8, 4],
  [8, 3],
  [8, 2],
  [8, 1],
  [8, 0],

  [7, 0],
  [6, 0],
];

export const SAFE_INDICES = new Set<number>([
  0,
  8,
  13,
  21,
  26,
  34,
  39,
  47,
]);

export const START_OFFSET: Record<PlayerColor, number> = {
  red: 0,
  green: 13,
  yellow: 26,
  blue: 39,
};

export const HOME_PATH: Record<PlayerColor, [number, number][]> = {
  red: [
    [7, 1],
    [7, 2],
    [7, 3],
    [7, 4],
    [7, 5],
    [7, 6],
  ],
  green: [
    [1, 7],
    [2, 7],
    [3, 7],
    [4, 7],
    [5, 7],
    [6, 7],
  ],
  yellow: [
    [7, 13],
    [7, 12],
    [7, 11],
    [7, 10],
    [7, 9],
    [7, 8],
  ],
  blue: [
    [13, 7],
    [12, 7],
    [11, 7],
    [10, 7],
    [9, 7],
    [8, 7],
  ],
};

export const BASE_SLOTS: Record<PlayerColor, [number, number][]> = {
  red: [
    [1.7, 1.7],
    [1.7, 3.8],
    [3.8, 1.7],
    [3.8, 3.8],
  ],
  green: [
    [1.7, 10.2],
    [1.7, 12.3],
    [3.8, 10.2],
    [3.8, 12.3],
  ],
  yellow: [
    [10.2, 10.2],
    [10.2, 12.3],
    [12.3, 10.2],
    [12.3, 12.3],
  ],
  blue: [
    [10.2, 1.7],
    [10.2, 3.8],
    [12.3, 1.7],
    [12.3, 3.8],
  ],
};

function createTokens(): TokenState[] {
  return [0, 1, 2, 3].map((id) => ({
    id,
    progress: -1,
  }));
}

export function initialGameState(): GameState {
  return {
    current: 'red',
    phase: 'idle',
    dice: null,
    lastDice: null,
    tokens: {
      red: createTokens(),
      green: createTokens(),
      yellow: createTokens(),
      blue: createTokens(),
    },
    winner: null,
    message: 'Roll to start',
    validTokenIds: [],
    lastCapture: false,
  };
}

export function getTokenCoordinate(
  color: PlayerColor,
  token: TokenState
): [number, number] {
  if (token.progress <= -1) {
    return BASE_SLOTS[color][token.id] ?? [7, 7];
  }

  if (token.progress >= 51) {
    const index = Math.min(token.progress - 51, HOME_PATH[color].length - 1);
    return HOME_PATH[color][index];
  }

  const globalIndex = (START_OFFSET[color] + token.progress) % PATH.length;
  return PATH[globalIndex] ?? [7, 7];
}

export function getValidMoves(
  state: GameState,
  color: PlayerColor,
  dice: number
): number[] {
  return state.tokens[color]
    .filter((token) => {
      if (token.progress === -1) {
        return dice === 6;
      }

      if (token.progress >= FINISH_PROGRESS) {
        return false;
      }

      return token.progress + dice <= FINISH_PROGRESS;
    })
    .map((token) => token.id);
}

function nextColor(color: PlayerColor): PlayerColor {
  const index = ORDER.indexOf(color);
  return ORDER[(index + 1) % ORDER.length] ?? 'red';
}

function applyMove(
  state: GameState,
  color: PlayerColor,
  tokenId: number
): GameState {
  if (state.phase !== 'rolled' || state.dice === null) {
    return state;
  }

  const dice = state.dice;
  const tokens = { ...state.tokens };

  const movingToken = tokens[color]?.find((token) => token.id === tokenId);
  if (!movingToken) {
    return state;
  }

  const newProgress =
    movingToken.progress === -1 ? 0 : movingToken.progress + dice;

  tokens[color] = tokens[color].map((token) =>
    token.id === tokenId ? { ...token, progress: newProgress } : token
  );

  let captured = false;

  if (newProgress >= 0 && newProgress < 51) {
    const globalIndex = (START_OFFSET[color] + newProgress) % PATH.length;

    if (!SAFE_INDICES.has(globalIndex)) {
      for (const otherColor of ORDER) {
        if (otherColor === color) continue;

        tokens[otherColor] = tokens[otherColor].map((token) => {
          if (token.progress >= 0 && token.progress < 51) {
            const otherGlobalIndex =
              (START_OFFSET[otherColor] + token.progress) % PATH.length;

            if (otherGlobalIndex === globalIndex) {
              captured = true;
              return {
                ...token,
                progress: -1,
              };
            }
          }

          return token;
        });
      }
    }
  }

  const finished = newProgress === FINISH_PROGRESS;

  const winner = tokens[color].every(
    (token) => token.progress === FINISH_PROGRESS
  )
    ? color
    : null;

  const extraTurn = dice === 6 || captured || finished;

  const current = winner
    ? color
    : extraTurn
      ? color
      : nextColor(color);

  let message = '';

  if (winner) {
    message = `${winner.toUpperCase()} wins`;
  } else if (captured) {
    message = 'Capture! Roll again';
  } else if (finished) {
    message = 'Token reached home! Roll again';
  } else if (dice === 6) {
    message = 'Six! Roll again';
  }

  return {
    ...state,
    tokens,
    current,
    phase: winner ? 'gameover' : 'idle',
    dice: null,
    winner,
    message,
    validTokenIds: [],
    lastCapture: captured,
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_ROLL': {
      if (state.phase !== 'idle' || state.winner) {
        return state;
      }

      return {
        ...state,
        phase: 'rolling',
        message: 'Rolling...',
        validTokenIds: [],
      };
    }

    case 'COMPLETE_ROLL': {
      if (state.phase !== 'rolling') {
        return state;
      }

      const validMoves = getValidMoves(state, state.current, action.dice);

      if (validMoves.length === 0) {
        return {
          ...state,
          phase: 'idle',
          dice: null,
          lastDice: action.dice,
          validTokenIds: [],
          message: 'No valid moves',
        };
      }

      return {
        ...state,
        phase: 'rolled',
        dice: action.dice,
        lastDice: action.dice,
        validTokenIds: validMoves,
        message: validMoves.length > 1 ? 'Choose a token' : '',
      };
    }

    case 'MOVE_TOKEN': {
      return applyMove(state, state.current, action.tokenId);
    }

    case 'PASS_TURN': {
      return {
        ...state,
        phase: 'idle',
        dice: null,
        validTokenIds: [],
        current: nextColor(state.current),
        message: '',
      };
    }

    case 'RESET': {
      return initialGameState();
    }

    default:
      return state;
  }
}
