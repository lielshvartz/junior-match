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

// record a swipe: { fromId, toId, type: 'like'|'dislike', target: 'job'|'profile' }
router.post('/swipe', async (req, res) => {
  const { fromId, toId, type, target } = req.body;
  if (!fromId || !toId || !type) return res.status(400).json({ error: 'Missing fields' });
  const db = await readDB();
  db.matches = db.matches || [];
  // record swipe
  db.matches.push({ id: Date.now().toString(), fromId, toId, type, target, createdAt: Date.now() });
  // check mutual like
  const like = db.matches.find(m => m.fromId === toId && m.toId === fromId && m.type === 'like' && m.target === target);
  let matched = false;
  if (type === 'like' && like) {
    // create a mutual match record
    const existing = db.matches.find(m => m.mutual && ((m.a === fromId && m.b === toId) || (m.a === toId && m.b === fromId)));
    if (!existing) {
      db.matches.push({ id: Date.now().toString() + '_mutual', mutual: true, a: fromId, b: toId, target, createdAt: Date.now() });
      matched = true;
    }
  }
  await writeDB(db);
  res.json({ success: true, matched });
});

// list mutual matches for a user
router.get('/mutual/:userId', async (req, res) => {
  const db = await readDB();
  const mutuals = (db.matches || []).filter(m => m.mutual && (m.a === req.params.userId || m.b === req.params.userId));
  res.json(mutuals);
});

// get match by id
router.get('/:id', async (req, res) => {
  const db = await readDB();
  const m = (db.matches || []).find(x => x.id === req.params.id);
  if (!m) return res.status(404).json({ error: 'Not found' });
  res.json(m);
});

export default router;
