import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { LogOut, RefreshCcw, Save } from 'lucide-react';

import { supabase } from '../lib/supabase';
import { useSupervisorSettings } from '../hooks/useSupervisorSettings';
import { PROB_MIN, PROB_MAX } from '../lib/dice';
import type { PlayerColor } from '../types';
import Logo from '../components/Logo';

const COLORS: PlayerColor[] = ['red', 'green', 'yellow', 'blue'];
const NUMBERS = [1, 2, 3, 4, 5, 6];

export default function SupervisorPage() {
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [color, setColor] = useState<PlayerColor>('blue');
  const [targetNumber, setTargetNumber] = useState(6);
  const [probability, setProbability] = useState(25);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const { settings } = useSupervisorSettings();
  const current = settings[color] ?? null;

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (current) {
      setTargetNumber(current.target_number);
      setProbability(Number(current.target_probability));
    }
  }, [color, current]);

  if (!supabase) {
    return (
      <div className="page supervisor-page">
        <div className="card supervisor-card">
          <h1>Supervisor</h1>
          <p className="muted">
            Supabase is not configured. Add these environment variables:
          </p>
          <p className="muted small">
            VITE_SUPABASE_URL
            <br />
            VITE_SUPABASE_ANON_KEY
          </p>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="page supervisor-page">
        <div className="card supervisor-card center">
          <Logo size={64} />
          <p className="muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    const handleLogin = async (event: FormEvent) => {
      event.preventDefault();

      if (!supabase) return;

      setAuthLoading(true);
      setAuthError('');

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      setAuthLoading(false);

      if (error) {
        setAuthError(error.message);
      }
    };

    return (
      <div className="page supervisor-page">
        <div className="card supervisor-card">
          <h1>Supervisor</h1>
          <p className="muted">Sign in to control dice probability.</p>

          <form onSubmit={handleLogin} className="field">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            <button className="btn btn-primary" type="submit">
              SIGN IN
            </button>

            {authError && <p className="auth-error">{authError}</p>}
          </form>
        </div>
      </div>
    );
  }

  const apply = async (enabled: boolean) => {
    if (!supabase) return;

    setSaving(true);
    setMessage('');

    const safeProbability = Math.min(
      Math.max(probability, PROB_MIN),
      PROB_MAX
    );

    const { error } = await supabase.from('supervisor_settings').upsert(
      {
        color,
        enabled,
        target_number: targetNumber,
        target_probability: safeProbability,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'color',
      }
    );

    setSaving(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage(enabled ? 'Override applied.' : 'Override disabled.');
  };

  const active = current?.enabled ?? false;

  const status = active
    ? `Override Active: ${current?.target_number} → ${current?.target_probability}%`
    : 'Normal Random';

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  return (
    <div className="page supervisor-page">
      <div className="card supervisor-card">
        <div className="supervisor-head">
          <div>
            <h1>Supervisor</h1>
            <p className="muted small">Dice probability control</p>
          </div>

          <button
            className="icon-btn"
            onClick={handleSignOut}
            aria-label="Sign out"
          >
            <LogOut size={18} />
          </button>
        </div>

        <label className="field-label">Select Player</label>

        <div className="color-select">
          {COLORS.map((item) => (
            <button
              key={item}
              type="button"
              className={`color-chip chip-${item} ${
                color === item ? 'active' : ''
              }`}
              onClick={() => setColor(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="status-pill">{status}</div>

        <label className="field-label">Dice Number</label>

        <div className="number-grid">
          {NUMBERS.map((num) => (
            <button
              key={num}
              type="button"
              className={`number-chip ${targetNumber === num ? 'active' : ''}`}
              onClick={() => setTargetNumber(num)}
            >
              {num}
            </button>
          ))}
        </div>

        <label className="field-label">Target Probability</label>

        <div className="range-row">
          <input
            type="range"
            min={PROB_MIN}
            max={PROB_MAX}
            step={1}
            value={probability}
            onChange={(event) => setProbability(Number(event.target.value))}
          />

          <div className="range-value">{probability}%</div>
        </div>

        <p className="muted small">
          The remaining probability is automatically distributed across the
          other five dice numbers.
        </p>

        <div className="modal-actions">
          <button
            className="btn btn-primary"
            disabled={saving}
            onClick={() => apply(true)}
          >
            <Save size={18} />
            Apply
          </button>

          <button
            className="btn btn-ghost"
            disabled={saving}
            onClick={() => apply(false)}
          >
            <RefreshCcw size={18} />
            Reset to Normal
          </button>
        </div>

        {message && <p className="muted small">{message}</p>}
      </div>
    </div>
  );
}
