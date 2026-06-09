// Leaderboard — talks to the local REST API (Express + SQLite in Docker).
// Falls back to localStorage when the API is unreachable
// (e.g. when the game is served from GitHub Pages without the Pi running).

const API_BASE    = '/api';
const LOCAL_KEY   = 'nova-catch-leaderboard-v1';
const MAX_ENTRIES = 10;

// ── localStorage helpers ──────────────────────────────────────────────────────

function _localLoad() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.entries)) return [];
    return parsed.entries;
  } catch { return []; }
}

function _localSave(entries) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify({ version: 1, entries }));
  } catch { /* quota exceeded — ignore */ }
}

// ── Public API (async) ────────────────────────────────────────────────────────

async function load() {
  try {
    const res = await fetch(`${API_BASE}/scores?limit=${MAX_ENTRIES}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const entries = await res.json();
    _localSave(entries);        // keep a local copy as offline cache
    return entries;
  } catch (err) {
    console.warn('[Leaderboard] API read failed, using local cache:', err.message);
    return _localLoad();
  }
}

async function save(entry) {
  const clean = {
    name:  String(entry.name  || 'Nova Fan').slice(0, 12),
    score: Number(entry.score || 0),
    level: Number(entry.level || 1),
    date:  entry.date || Date.now(),
  };

  // Optimistic local update so the UI feels instant regardless of API outcome
  const cached = _localLoad();
  cached.push(clean);
  cached.sort((a, b) => b.score - a.score);
  _localSave(cached.slice(0, MAX_ENTRIES));

  try {
    const res = await fetch(`${API_BASE}/scores`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(clean),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  } catch (err) {
    console.warn('[Leaderboard] API write failed, score saved locally only:', err.message);
  }
}

const Leaderboard = { load, save };
export default Leaderboard;
