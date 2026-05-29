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

// GET /api/jobs?tech=React&location=Tel%20Aviv&type=fulltime
router.get('/', async (req, res) => {
  const db = await readDB();
  let jobs = db.jobs || [];
  const { tech, location, type, q } = req.query;
  if (tech) jobs = jobs.filter(j => (j.tech || []).includes(tech));
  if (location) jobs = jobs.filter(j => j.location === location);
  if (type) jobs = jobs.filter(j => j.type === type);
  if (q) {
    const ql = q.toLowerCase();
    jobs = jobs.filter(j => (j.title + ' ' + (j.description||'')).toLowerCase().includes(ql));
  }
  res.json(jobs);
});

router.post('/', async (req, res) => {
  const db = await readDB();
  const jobs = db.jobs || [];
  const newJob = { ...req.body, id: Date.now().toString() };
  jobs.push(newJob);
  db.jobs = jobs;
  await writeDB(db);
  res.status(201).json(newJob);
});

router.put('/:id', async (req, res) => {
  const db = await readDB();
  const jobs = db.jobs || [];
  const idx = jobs.findIndex(j => j.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  jobs[idx] = { ...jobs[idx], ...req.body };
  db.jobs = jobs;
  await writeDB(db);
  res.json(jobs[idx]);
});

router.delete('/:id', async (req, res) => {
  const db = await readDB();
  const jobs = db.jobs || [];
  const idx = jobs.findIndex(j => j.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  jobs.splice(idx, 1);
  db.jobs = jobs;
  await writeDB(db);
  res.json({ success: true });
});

export default router;
