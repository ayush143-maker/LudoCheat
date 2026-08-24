export type PlayerColor = 'red' | 'green' | 'yellow' | 'blue';

export interface SupervisorSetting {
  id?: string;
  color: PlayerColor;
  enabled: boolean;
  target_number: number;
  target_probability: number;
  updated_at?: string;
}

export interface TokenState {
  id: number;
  progress: number;
}

export type Phase = 'idle' | 'rolling' | 'rolled' | 'moving' | 'gameover';

export interface GameState {
  current: PlayerColor;
  phase: Phase;
  dice: number | null;
  lastDice: number | null;
  tokens: Record<PlayerColor, TokenState[]>;
  winner: PlayerColor | null;
  message: string;
  validTokenIds: number[];
  lastCapture: boolean;
}

export type GameAction =
  | { type: 'START_ROLL' }
  | { type: 'COMPLETE_ROLL'; dice: number }
  | { type: 'MOVE_TOKEN'; tokenId: number }
  | { type: 'PASS_TURN' }
  | { type: 'RESET' };

export interface AppSettings {
  sound: boolean;
  vibration: boolean;
  animations: boolean;
}
