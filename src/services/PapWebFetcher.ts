/**
 * Singleton bridge to a hidden WebView. espiebi.pap.pl is behind Incapsula bot
 * protection, so plain HTTP returns a JS challenge instead of HTML. A real
 * WebView runs that challenge, gets a session cookie, and returns rendered HTML.
 *
 * The UI mounts <PapBrowser /> once; this module hands it URLs to load and
 * resolves with the resulting page HTML.
 */
type PendingRequest = {
  url: string;
  resolve: (html: string) => void;
  reject: (err: Error) => void;
};

type Driver = {
  load: (url: string) => void;
};

const QUEUE: PendingRequest[] = [];
let active: PendingRequest | null = null;
let driver: Driver | null = null;
const TIMEOUT_MS = 20000;
let timer: ReturnType<typeof setTimeout> | null = null;

function next() {
  if (active || QUEUE.length === 0 || !driver) return;
  active = QUEUE.shift()!;
  timer = setTimeout(() => settle(null, new Error("WebView fetch timeout")), TIMEOUT_MS);
  driver.load(active.url);
}

function settle(html: string | null, err: Error | null) {
  if (timer) clearTimeout(timer);
  timer = null;
  const cur = active;
  active = null;
  if (cur) {
    if (err) cur.reject(err);
    else cur.resolve(html ?? "");
  }
  next();
}

/** Registered by <PapBrowser />. */
export function registerDriver(d: Driver | null) {
  driver = d;
  if (d) next();
}

/** Called by <PapBrowser /> when a page finishes loading. */
export function deliverHtml(html: string) {
  settle(html, null);
}

/** The URL the WebView should currently load, or null if idle. */
export function activeUrl(): string | null {
  return active?.url ?? null;
}

/** Fetch a page's HTML through the WebView. */
export function fetchHtml(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    QUEUE.push({ url, resolve, reject });
    next();
  });
}
