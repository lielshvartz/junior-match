import express from 'express';
import cors from 'cors';
import profilesRouter from './routes/profiles.js';
import uploadsRouter from './routes/uploads.js';
import jobsRouter from './routes/jobs.js';
import matchesRouter from './routes/matches.js';
import messagesRouter from './routes/messages.js';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// serve uploaded files statically
app.use('/uploads', express.static(path.join(process.cwd(), 'server', 'uploads')));

app.use('/api/profiles', profilesRouter);
app.use('/api/uploads', uploadsRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/matches', matchesRouter);
app.use('/api/messages', messagesRouter);

app.get('/', (req, res) => {
  res.json({ status: 'JuniorMatch API', version: '0.1' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
