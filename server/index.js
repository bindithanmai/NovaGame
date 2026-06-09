'use strict';

const express  = require('express');
const Database = require('better-sqlite3');
const path     = require('path');
const fs       = require('fs');

// ── Config ────────────────────────────────────────────────────────────────────
const PORT    = parseInt(process.env.PORT || '3000', 10);
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../data/scores.db');

// ── Database setup ────────────────────────────────────────────────────────────
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS scores (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    name  TEXT    NOT NULL,
    score INTEGER NOT NULL,
    level INTEGER NOT NULL,
    date  INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_scores_score ON scores (score DESC);
`);

// Prepared statements (created once, reused on every request)
const stmtTop   = db.prepare('SELECT name, score, level, date FROM scores ORDER BY score DESC LIMIT ?');
const stmtInsert = db.prepare('INSERT INTO scores (name, score, level, date) VALUES (?, ?, ?, ?)');

// ── Express app ───────────────────────────────────────────────────────────────
const app = express();
app.use(express.json());

// CORS — allows the game to call the API from any origin (local network, etc.)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Serve the game's static files from the project root
app.use(express.static(path.join(__dirname, '..')));

// ── API routes ────────────────────────────────────────────────────────────────

// GET /api/scores?limit=10
app.get('/api/scores', (req, res) => {
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
  try {
    res.json(stmtTop.all(limit));
  } catch (err) {
    console.error('[scores GET]', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/scores  { name, score, level, date? }
app.post('/api/scores', (req, res) => {
  const { name, score, level, date } = req.body || {};

  if (typeof name  !== 'string'  ||
      typeof score !== 'number'  ||
      typeof level !== 'number') {
    return res.status(400).json({ error: 'name (string), score (number), level (number) required' });
  }

  const clean = {
    name:  String(name).slice(0, 12).trim() || 'Nova Fan',
    score: Math.floor(Math.max(0, score)),
    level: Math.floor(Math.max(1, level)),
    date:  Number.isFinite(date) ? Math.floor(date) : Date.now(),
  };

  try {
    stmtInsert.run(clean.name, clean.score, clean.level, clean.date);
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error('[scores POST]', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// Health-check (used by Docker healthcheck + any uptime monitor)
app.get('/health', (_req, res) => res.json({ ok: true, uptime: process.uptime() }));

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Nova Game server  →  http://0.0.0.0:${PORT}`);
  console.log(`SQLite DB         →  ${DB_PATH}`);
});
