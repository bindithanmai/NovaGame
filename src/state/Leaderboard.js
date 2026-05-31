const KEY = 'nova-catch-leaderboard-v1';
const MAX_ENTRIES = 10;

let inMemoryEntries = null; // fallback when localStorage unavailable

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.entries)) {
      console.warn('[Leaderboard] Schema mismatch — resetting leaderboard');
      return [];
    }
    return parsed.entries;
  } catch (err) {
    console.warn('[Leaderboard] Failed to load:', err.message);
    return inMemoryEntries || [];
  }
}

function save(entry) {
  const entries = load();
  entries.push({
    name: String(entry.name || 'Nova Fan').slice(0, 12),
    score: Number(entry.score) || 0,
    level: Number(entry.level) || 1,
    date: entry.date || Date.now(),
  });
  entries.sort((a, b) => b.score - a.score);
  const capped = entries.slice(0, MAX_ENTRIES);

  try {
    localStorage.setItem(KEY, JSON.stringify({ version: 1, entries: capped }));
    inMemoryEntries = null;
  } catch (err) {
    if (err.name === 'QuotaExceededError' || err.code === 22) {
      console.warn('[Leaderboard] Storage quota exceeded — using in-memory fallback');
      inMemoryEntries = capped;
    } else {
      console.warn('[Leaderboard] Failed to save:', err.message);
      inMemoryEntries = capped;
    }
  }
}

function isInMemoryOnly() {
  return inMemoryEntries !== null;
}

const Leaderboard = { load, save, isInMemoryOnly };
export default Leaderboard;
