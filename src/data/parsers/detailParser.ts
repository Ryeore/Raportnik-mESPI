import { parse } from 'node-html-parser';
import type { ParseResult } from './feedParser';

export interface DetailData {
  /** Key/value header pairs (title, legal basis, date, etc.) */
  headers: Record<string, string>;
  /**
   * Full body text of the report, line-broken for readability.
   * Source: <meta name="description"> which PAP always populates server-side.
   */
  body: string;
}

/**
 * Known Polish field prefixes used in ESPI/EBI body text.
 * We split the flat string on these to recover structure.
 */
const FIELD_PREFIXES = [
  'Podstawa prawna',
  'Określenie waluty',
  'Pozycja danych',
  'Data wyceny',
  'Wartość aktywów netto funduszu',
  'Wartość aktywów netto',
  'Treść raportu',
  'Treść komunikatu',
  'Data sporządzenia',
  'Skrócona nazwa emitenta',
  'Pełna nazwa emitenta',
  'Numer raportu',
  'Emitent',
  'Załączniki',
];

/**
 * Insert a newline before each known "Label:" occurrence so the flat body
 * text reads as structured paragraphs rather than one continuous string.
 */
function formatBody(raw: string): string {
  let result = raw.trim();
  for (const prefix of FIELD_PREFIXES) {
    // Replace " Prefix:" (with a leading space) with "\nPrefix:"
    result = result.replace(new RegExp(`\\s+(${prefix}:)`, 'g'), '\n$1');
  }
  // Collapse multiple whitespace runs to a single space within each line
  return result
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join('\n');
}

/**
 * Parses a biznes.pap.pl article detail page.
 *
 * Strategy:
 *  - Title:  <title> tag, stripped of " | Biznes PAP" suffix
 *  - Body:   <meta name="description"> content (always server-rendered by PAP)
 *
 * This is intentionally simple and immune to HTML structure changes on the page.
 */
export function parseDetailHtml(html: string): ParseResult<DetailData> {
  try {
    const root = parse(html);

    // --- Title ---
    const rawTitle =
      root.querySelector('title')?.text?.trim() ?? '';
    const title = rawTitle
      .replace(/\s*\|\s*Biznes PAP\s*$/i, '')
      .trim();

    // --- Body from meta description ---
    const descMeta = root.querySelector('meta[name="description"]');
    const rawBody = descMeta?.getAttribute('content')?.trim() ?? '';

    // Strip trailing espiebi.pap.pl URL that PAP appends
    const cleanBody = rawBody
      .replace(/\s*https?:\/\/espiebi\.pap\.pl[^\s]*/gi, '')
      .trim();

    const body = formatBody(cleanBody);

    const headers: Record<string, string> = {};
    if (title) headers['Tytuł'] = title;

    return { ok: true, data: { headers, body } };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Unknown parse error',
    };
  }
}

