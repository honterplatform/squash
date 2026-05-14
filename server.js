import express from 'express';
import { MongoClient } from 'mongodb';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const MONGO_URL =
  process.env.MONGO_URL ||
  process.env.MONGODB_URL ||
  process.env.MONGODB_URI ||
  process.env.MONGO_PRIVATE_URL;
const DB_NAME = process.env.MONGO_DB || 'squash';
const DOC_ID = 'global';

const app = express();
app.use(express.json({ limit: '2mb' }));

let collection = null;

async function initDb() {
  if (!MONGO_URL) {
    console.log('[squash] No MONGO_URL set — running without persistence (frontend will fall back to localStorage).');
    return;
  }
  try {
    const client = new MongoClient(MONGO_URL, { serverSelectionTimeoutMS: 5000 });
    await client.connect();
    collection = client.db(DB_NAME).collection('state');
    console.log(`[squash] Connected to MongoDB (db=${DB_NAME})`);
  } catch (e) {
    console.error('[squash] MongoDB connection failed:', e.message);
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, db: !!collection });
});

app.get('/api/state', async (_req, res) => {
  if (!collection) return res.status(503).json({ error: 'no_db' });
  try {
    const doc = await collection.findOne({ _id: DOC_ID });
    res.json(doc ? doc.state : null);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/state', async (req, res) => {
  if (!collection) return res.status(503).json({ error: 'no_db' });
  const incoming = req.body;
  if (!incoming || typeof incoming !== 'object') {
    return res.status(400).json({ error: 'invalid_state' });
  }
  try {
    await collection.replaceOne(
      { _id: DOC_ID },
      { _id: DOC_ID, state: incoming, updatedAt: new Date() },
      { upsert: true }
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.use(express.static(__dirname, { extensions: ['html'] }));

await initDb();
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[squash] Listening on :${PORT}`);
});
