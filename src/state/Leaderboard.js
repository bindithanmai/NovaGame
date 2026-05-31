import { db } from '../firebase.js';
import {
  collection, addDoc, getDocs, query, orderBy, limit,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const COLLECTION  = 'nova-scores';
const LOCAL_KEY   = 'nova-catch-leaderboard-v1';
const MAX_ENTRIES = 10;

// ── Helpers ───────────────────────────────────────────────────────────────────

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
    const q   = query(collection(db, COLLECTION), orderBy('score', 'desc'), limit(MAX_ENTRIES));
    const snap = await getDocs(q);
    const entries = snap.docs.map(d => d.data());
    _localSave(entries);   // keep local copy as offline cache
    return entries;
  } catch (err) {
    console.warn('[Leaderboard] Firebase read failed, using local cache:', err.message);
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

  try {
    await addDoc(collection(db, COLLECTION), clean);
  } catch (err) {
    // Firebase unavailable — fall back to localStorage only
    console.warn('[Leaderboard] Firebase write failed, saving locally:', err.message);
    const entries = _localLoad();
    entries.push(clean);
    entries.sort((a, b) => b.score - a.score);
    _localSave(entries.slice(0, MAX_ENTRIES));
  }
}

const Leaderboard = { load, save };
export default Leaderboard;
