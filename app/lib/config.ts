/** Flip to `false` when we're ready to open sales. */
export const HIDE_PRICES = true;

/**
 * Read from env var PRELAUNCH_MODE ("true"/"false").
 * Defaults to TRUE when unset so pre-launch is the safe default.
 */
export function isPrelaunchMode(env: Env): boolean {
  return (env.PRELAUNCH_MODE ?? 'true') !== 'false';
}
