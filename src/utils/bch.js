// Placeholder BCH utils.
// Replace with real bch-js logic when ready.

export function generateTimerAddressMock(blockDelay) {
  return `bitcoincash:timer_${Date.now().toString(36)}_${Math.floor(Math.random() * 10000)}`;
}