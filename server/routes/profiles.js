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

// GET /api/profiles
router.get('/', async (req, res) => {
  const db = await readDB();
  res.json(db.profiles || []);
});

// GET /api/profiles/:id
router.get('/:id', async (req, res) => {
  const db = await readDB();
  const profile = (db.profiles || []).find(p => p.id === req.params.id);
  if (!profile) return res.status(404).json({ error: 'Not found' });
  res.json(profile);
});

// POST /api/profiles
router.post('/', async (req, res) => {
  const db = await readDB();
  const profiles = db.profiles || [];
  const newProfile = { ...req.body, id: Date.now().toString() };
  profiles.push(newProfile);
  db.profiles = profiles;
  await writeDB(db);
  res.status(201).json(newProfile);
});

// PUT /api/profiles/:id
router.put('/:id', async (req, res) => {
  const db = await readDB();
  const profiles = db.profiles || [];
  const idx = profiles.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const updated = { ...profiles[idx], ...req.body };
  profiles[idx] = updated;
  db.profiles = profiles;
  await writeDB(db);
  res.json(updated);
});

// DELETE /api/profiles/:id
router.delete('/:id', async (req, res) => {
  const db = await readDB();
  const profiles = db.profiles || [];
  const idx = profiles.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  profiles.splice(idx, 1);
  db.profiles = profiles;
  await writeDB(db);
  res.json({ success: true });
});

export default router;
