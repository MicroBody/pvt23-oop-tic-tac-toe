// call with await to pause/sleep for a number of milliseconds
export default function sleep(ms) {
  if (globalThis.mockMinimalSleep) { return; }
  return new Promise(resolve => setTimeout(resolve, ms));
}