import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

async function readDB() {
  const raw = await fs.readFile(DB_PATH, 'utf8');
  return JSON.parse(raw);
}

async function writeDB(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

// POST /api/messages - { matchId, fromId, toId, text }
router.post('/', async (req, res) => {
  const { matchId, fromId, toId, text } = req.body;
  if (!matchId || !fromId || !toId || !text) return res.status(400).json({ error: 'Missing fields' });
  const db = await readDB();
  db.messages = db.messages || [];
  const msg = { id: Date.now().toString(), matchId, fromId, toId, text, createdAt: Date.now() };
  db.messages.push(msg);
  await writeDB(db);
  res.status(201).json(msg);
});

// GET /api/messages/:matchId
router.get('/:matchId', async (req, res) => {
  const db = await readDB();
  const msgs = (db.messages || []).filter(m => m.matchId === req.params.matchId);
  res.json(msgs);
});

export default router;
