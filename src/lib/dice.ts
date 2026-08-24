import type { SupervisorSetting } from '../types';

export const PROB_MIN = 5;
export const PROB_MAX = 30;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function rollDie(setting?: SupervisorSetting | null): number {
  if (!setting?.enabled) {
    return 1 + Math.floor(Math.random() * 6);
  }

  const targetNumber = Math.min(6, Math.max(1, Math.round(setting.target_number)));
  const targetProbability = clamp(
    Number(setting.target_probability) || 16.67,
    PROB_MIN,
    PROB_MAX
  );

  const weights = Array.from({ length: 6 }, (_, index) => {
    const face = index + 1;
    return face === targetNumber
      ? targetProbability
      : (100 - targetProbability) / 5;
  });

  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < weights.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return i + 1;
    }
  }

  return 6;
}
