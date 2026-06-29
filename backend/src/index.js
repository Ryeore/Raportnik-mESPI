import express from 'express';
import cors from 'cors';
import { fetchArticles } from './newsService.js';

const PORT = process.env.PORT || 4000;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const app = express();
app.use(cors());

let cache = { articles: [], ts: 0 };

app.get('/api/news', async (req, res) => {
  try {
    const fresh = Date.now() - cache.ts < CACHE_TTL_MS;
    if (!fresh || cache.articles.length === 0) {
      cache = { articles: await fetchArticles(), ts: Date.now() };
    }
    res.json({ source: 'espiebi.pap.pl', articles: cache.articles });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load news' });
  }
});

app.get('/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Raportnik backend on http://localhost:${PORT}`));
