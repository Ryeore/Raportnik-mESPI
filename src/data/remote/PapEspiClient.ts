const BASE_URL = 'https://biznes.pap.pl';

export class NetworkError extends Error {
  constructor(
    public readonly status: number,
    url: string,
  ) {
    super(`HTTP ${status} from ${url}`);
    this.name = 'NetworkError';
  }
}

/** Convert ISO date "2026-07-01" → "2026/7/1" for the PAP URL path */
function dateToPath(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return `${y}/${m}/${d}`;
}

/**
 * The endpoint returns a Drupal AJAX command array.
 * We extract the HTML from the first element's `data` field.
 */
async function fetchAjaxHtml(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json, */*; q=0.01',
      'X-Requested-With': 'XMLHttpRequest',
      'User-Agent':
        'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/124.0.0.0 Mobile Safari/537.36',
      Referer: BASE_URL,
    },
  });
  if (!response.ok) {
    throw new NetworkError(response.status, url);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const json = (await response.json()) as Array<{ data?: string }>;
  const html = json[0]?.data;
  if (!html) throw new Error('Empty AJAX response from ' + url);
  return html;
}

async function getPlainHtml(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      Accept: 'text/html',
      'User-Agent':
        'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/124.0.0.0 Mobile Safari/537.36',
    },
  });
  if (!response.ok) {
    throw new NetworkError(response.status, url);
  }
  return response.text();
}

export const PapEspiClient = {
  /**
   * Fetches one page of the ESPI or EBI feed for the given date (YYYY-MM-DD).
   * Page numbering starts at 0.
   */
  getFeedHtml(type: 'espi' | 'ebi', date: string, page: number): Promise<string> {
    const datePath = dateToPath(date);
    const url =
      `${BASE_URL}/articles/${type}/${datePath}` +
      `?limit=25&page=${page}&company&selectCompany&selectDay=true`;
    return fetchAjaxHtml(url);
  },

  /**
   * Fetches the detail page HTML for a report.
   * @param path  Relative path, e.g. "wiadomosci/firmy/company-slug"
   */
  getDetailHtml(path: string): Promise<string> {
    return getPlainHtml(`${BASE_URL}/${path}`);
  },

  getDetailUrl(path: string): string {
    return `${BASE_URL}/${path}`;
  },
};

