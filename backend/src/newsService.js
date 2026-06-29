import axios from 'axios';
import * as cheerio from 'cheerio';
import { sampleArticles } from './sampleNews.js';

const SOURCE_URL = 'https://espiebi.pap.pl/wyszukiwarka';
const BASE_URL = 'https://espiebi.pap.pl';
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

function makeId(url, title, index) {
  const base = url || `${title}-${index}`;
  return Buffer.from(base).toString('base64url').slice(0, 24);
}

// Scrape the public listing. Returns [] if structure not found.
function parseListing(html) {
  const $ = cheerio.load(html);
  const articles = [];

  $('li.news').each((index, el) => {
    const node = $(el);
    const titleAnchor = node.find('a').first();
    const title = titleAnchor.text().trim();
    const href = titleAnchor.attr('href') || '';
    const url = href.startsWith('http') ? href : `${BASE_URL}${href}`;
    const time = node.find('.hour').first().text().trim();

    if (!title) return;

    articles.push({
      id: makeId(url, title, index),
      title,
      url,
      publishedAt: time || new Date().toISOString(),
      summary: undefined,
    });
  });

  return articles;
}

export async function fetchArticles() {
  try {
    const { data } = await axios.get(SOURCE_URL, {
      timeout: 8000,
      headers: { 'User-Agent': USER_AGENT, Accept: 'text/html' },
    });
    const articles = parseListing(data);
    if (articles.length > 0) return articles;
    throw new Error('No articles parsed (source likely bot-protected)');
  } catch (err) {
    console.warn('[news] live fetch failed, serving sample data:', err.message);
    return sampleArticles;
  }
}
