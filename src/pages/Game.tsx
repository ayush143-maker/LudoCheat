import { useEffect, useReducer, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  HelpCircle,
  LogOut,
  Settings as SettingsIcon,
} from 'lucide-react';

import Board from '../components/Board';
import Dice from '../components/Dice';
import Modal from '../components/Modal';
import SettingsModal from '../components/SettingsModal';
import HowToModal from '../components/HowToModal';

import { gameReducer, initialGameState } from '../lib/ludo';
import { rollDie } from '../lib/dice';
import { useSupervisorSettings } from '../hooks/useSupervisorSettings';
import { useAppSettings } from '../hooks/useAppSettings';
import type { PlayerColor } from '../types';

function colorLabel(color: PlayerColor) {
  return color.charAt(0).toUpperCase() + color.slice(1);
}

export default function GamePage() {
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(gameReducer, null, () =>
    initialGameState()
  );

  const { settings } = useSupervisorSettings();
  const { settings: appSettings, update } = useAppSettings();

  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showExit, setShowExit] = useState(false);
  const [shakeToken, setShakeToken] = useState<string | null>(null);

  const rollTimer = useRef<number | undefined>(undefined);

  const canRoll = state.phase === 'idle' && !state.winner;

  const vibrate = (pattern: number[]) => {
    if (
      appSettings.vibration &&
      typeof navigator !== 'undefined' &&
      'vibrate' in navigator
    ) {
      navigator.vibrate(pattern);
    }
  };

  useEffect(() => {
    return () => window.clearTimeout(rollTimer.current);
  }, []);

  useEffect(() => {
    if (state.phase === 'rolled' && state.validTokenIds.length === 1) {
      const timer = window.setTimeout(() => {
        dispatch({
          type: 'MOVE_TOKEN',
          tokenId: state.validTokenIds[0] ?? 0,
        });
      }, 420);

      return () => window.clearTimeout(timer);
    }

    if (
      state.phase === 'idle' &&
      state.lastDice !== null &&
      state.validTokenIds.length === 0 &&
      state.message === 'No valid moves'
    ) {
      const timer = window.setTimeout(() => {
        dispatch({ type: 'PASS_TURN' });
      }, 950);

      return () => window.clearTimeout(timer);
    }
  }, [state.phase, state.validTokenIds, state.lastDice, state.message]);

  const handleRoll = () => {
    if (!canRoll) return;

    vibrate([12]);
    dispatch({ type: 'START_ROLL' });

    window.clearTimeout(rollTimer.current);

    rollTimer.current = window.setTimeout(() => {
      const setting = settings[state.current] ?? null;
      const dice = rollDie(setting);

      vibrate([8]);
      dispatch({ type: 'COMPLETE_ROLL', dice });
    }, 680);
  };

  const handleTokenClick = (color: PlayerColor, id: number) => {
    if (
      state.phase === 'rolled' &&
      color === state.current &&
      state.validTokenIds.includes(id)
    ) {
      vibrate([10]);
      dispatch({ type: 'MOVE_TOKEN', tokenId: id });
    }
  };

  const handleInvalidToken = (color: PlayerColor, id: number) => {
    if (color === state.current && state.phase === 'rolled') {
      vibrate([18]);
      setShakeToken(`${color}-${id}`);

      window.setTimeout(() => {
        setShakeToken(null);
      }, 520);
    }
  };

  const statusText = state.winner
    ? ''
    : state.phase === 'rolling'
      ? 'Rolling...'
      : state.phase === 'rolled' && state.validTokenIds.length > 1
        ? 'Choose a token'
        : state.message || `${colorLabel(state.current)}: tap ROLL`;

  return (
    <div className="page game-page">
      <header className="top-bar">
        <button
          className="icon-btn"
          onClick={() => setShowExit(true)}
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </button>

        <div className={`turn-pill ${state.current}`}>
          <span className="dot" />
          {colorLabel(state.current)}'s turn
        </div>

        <div className="top-actions">
          <button
            className="icon-btn"
            onClick={() => setShowHelp(true)}
            aria-label="Help"
          >
            <HelpCircle size={19} />
          </button>

          <button
            className="icon-btn"
            onClick={() => setShowSettings(true)}
            aria-label="Settings"
          >
            <SettingsIcon size={19} />
          </button>

          <button
            className="icon-btn"
            onClick={() => setShowExit(true)}
            aria-label="Exit"
          >
            <LogOut size={19} />
          </button>
        </div>
      </header>

      <div className="board-wrap">
        <Board
          state={state}
          shakeToken={shakeToken}
          onTokenClick={handleTokenClick}
          onInvalidToken={handleInvalidToken}
        />
      </div>

      <div className="controls">
        <div className="status-text" aria-live="polite">
          {statusText}
        </div>

        <div className="dice-row">
          <Dice
            value={state.lastDice}
            rolling={state.phase === 'rolling'}
            color={state.current}
          />

          <button
            className="btn btn-primary roll-btn"
            disabled={!canRoll}
            onClick={handleRoll}
          >
            {state.phase === 'rolling' ? 'ROLLING' : 'ROLL'}
          </button>
        </div>
      </div>

      <SettingsModal
        open={showSettings}
        onClose={() => setShowSettings(false)}
        settings={appSettings}
        onUpdate={update}
      />

      <HowToModal open={showHelp} onClose={() => setShowHelp(false)} />

      <Modal
        open={showExit}
        onClose={() => setShowExit(false)}
        title="Leave game?"
      >
        <p className="muted">Your current match progress will be lost.</p>

        <div className="modal-actions">
          <button
            className="btn btn-ghost"
            onClick={() => setShowExit(false)}
          >
            CANCEL
          </button>

          <button className="btn btn-danger" onClick={() => navigate('/')}>
            EXIT
          </button>
        </div>
      </Modal>

      {state.winner && (
        <div className="modal-backdrop winner-backdrop">
          <div className={`winner-card winner-${state.winner}`}>
            <div className="winner-color">
              {colorLabel(state.winner)}
            </div>

            <h2>WINS</h2>
            <p className="muted">All four tokens reached home.</p>

            <div className="winner-actions">
              <button
                className="btn btn-primary"
                onClick={() => dispatch({ type: 'RESET' })}
              >
                PLAY AGAIN
              </button>

              <button className="btn btn-ghost" onClick={() => navigate('/')}>
                EXIT
              </button>
            </div>

            <div className="confetti" aria-hidden="true">
              {Array.from({ length: 18 }).map((_, index) => (
                <span
                  key={index}
                  style={{
                    left: `${(index * 5.3) % 100}%`,
                    animationDelay: `${index * 0.08}s`,
                    background: `var(--confetti-${index % 4})`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
