import { EspiReport } from "@/types";
import { isWithinRetention } from "@/utils/date";
import { SOURCE_BASE_URL } from "@/utils/constants";

/**
 * Parses the espiebi.pap.pl search listing HTML into domain reports. The site
 * has no public API, so we scrape the `wyszukiwarka` results page. Logic mirrors
 * https://github.com/wegar-2/pyespiebipapapi (li.news -> badge / hour / anchor).
 *
 * Kept pure and source-shape-specific so it can be unit tested in isolation.
 */
const NEWS_ITEM = /<li[^>]*class="[^"]*\bnews\b[^"]*"[^>]*>([\s\S]*?)<\/li>/gi;
const BADGE = /class="[^"]*\bbadge\b[^"]*"[^>]*>([\s\S]*?)<\/[^>]+>/i;
const HOUR = /class="[^"]*\bhour\b[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;
const ANCHOR = /<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i;

function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function fullUrl(node: string): string {
  if (!node) return "";
  if (/^https?:\/\//.test(node)) return node;
  return `${SOURCE_BASE_URL}/${node.replace(/^\//, "")}`;
}

/** Title commonly looks like "KGHM Polska Miedz: ...". Derive a company name. */
function companyFromTitle(title: string): string {
  const colon = title.indexOf(":");
  return colon > 0 ? title.slice(0, colon).trim() : "";
}

/**
 * Parses one search-results page for a given date (YYYY-MM-DD). Each `li.news`
 * yields source (ESPI/EBI), a time, a news id, a title and a node URL.
 */
export function parseListHtml(html: string, dateIso: string, now: Date = new Date()): EspiReport[] {
  const reports: EspiReport[] = [];
  let match: RegExpExecArray | null;
  NEWS_ITEM.lastIndex = 0;

  while ((match = NEWS_ITEM.exec(html)) !== null) {
    const block = match[1];

    const badge = BADGE.exec(block);
    const source = badge ? stripTags(badge[1]).toUpperCase() : "";

    HOUR.lastIndex = 0;
    const hours: string[] = [];
    let h: RegExpExecArray | null;
    while ((h = HOUR.exec(block)) !== null) hours.push(stripTags(h[1]));
    const time = hours[0] ?? "00:00";
    const newsId = hours[1] ?? "";

    const anchor = ANCHOR.exec(block);
    const url = fullUrl(anchor?.[1] ?? "");
    const title = anchor ? stripTags(anchor[2]) : "";

    // The node URL (/node/12345) is the stable numeric id; the second .hour
    // holds the human report number (e.g. "12/2026").
    const nodeId = url.match(/\/node\/(\d+)/)?.[1] ?? "";
    const id = nodeId || newsId;
    if (!id || !title) continue;

    reports.push({
      id,
      companyName: companyFromTitle(title),
      ticker: "",
      reportNumber: newsId,
      publishDate: new Date(`${dateIso}T${time}:00`).toISOString(),
      title,
      content: source,
      url
    });
  }

  return reports.filter((r) => isWithinRetention(r.publishDate, now));
}

/**
 * Extracts the readable report body from a node page. Prefers the "Tresc
 * raportu" section; falls back to the main content area. Returns plain text.
 */
export function parseNodeContent(html: string): string {
  const sheets = html.match(/<div[^>]*class="[^"]*\barkusz\b[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi);
  const source = sheets && sheets.length ? sheets.join("\n") : html;

  let text = source
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<\/(p|div|tr|li|br|td)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const marker = text.search(/Tre[sś][cć] raportu/i);
  if (marker >= 0) text = text.slice(marker).replace(/^Tre[sś][cć] raportu:?\s*/i, "").trim();

  return text;
}

