const state = {
  _currentLevel: 1,
  score: 0,
  lives: 3,
  catches: 0,
  muted: false,
};

// Load muted preference from localStorage
try {
  const savedMute = localStorage.getItem('nova-muted');
  if (savedMute !== null) state.muted = savedMute === 'true';
} catch (_) {}

const GameState = {
  get currentLevel() { return state._currentLevel; },
  get score()        { return state.score; },
  get lives()        { return state.lives; },
  get catches()      { return state.catches; },
  get muted()        { return state.muted; },

  reset() {
    state._currentLevel = 1;
    state.score = 0;
    state.lives = 3;
    state.catches = 0;
  },

  nextLevel() {
    state._currentLevel = Math.min(state._currentLevel + 1, 10);
    state.catches = 0;
  },

  loseLife() {
    state.lives = Math.max(0, state.lives - 1);
    state.catches = 0;
  },

  addCatch(points = 10) {
    state.catches += 1;
    state.score += points;
  },

  // QA-only: jump to a specific level
  setLevelDirectly(n) {
    state._currentLevel = Math.max(1, Math.min(10, parseInt(n, 10) || 1));
    state.catches = 0;
  },

  toggleMute() {
    state.muted = !state.muted;
    try { localStorage.setItem('nova-muted', String(state.muted)); } catch (_) {}
  },

  setMuted(val) {
    state.muted = val;
    try { localStorage.setItem('nova-muted', String(val)); } catch (_) {}
  },
};

export default GameState;
