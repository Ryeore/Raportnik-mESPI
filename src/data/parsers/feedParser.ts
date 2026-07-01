import { parse } from 'node-html-parser';
import { ReportType, type FinancialReport } from '../../domain/models/FinancialReport';

const BASE_URL = 'https://biznes.pap.pl';

export type ParseResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

/**
 * Extract the relative path (e.g. "wiadomosci/firmy/slug") from an href like
 * "/wiadomosci/firmy/slug" — strips the leading slash.
 */
function hrefToPath(href: string): string | null {
  if (!href || !href.startsWith('/wiadomosci/')) return null;
  return href.replace(/^\//, '');
}

/**
 * The title anchor text is formatted as "COMPANY NAME (NUMBER) Announcement subject".
 * Strip the "COMPANY NAME (NUMBER) " prefix to get just the subject.
 */
function extractTitle(anchorText: string, reportNumber: string): string {
  const prefix = `(${reportNumber}) `;
  const idx = anchorText.indexOf(prefix);
  if (idx !== -1) return anchorText.slice(idx + prefix.length).trim();
  return anchorText.trim();
}

/**
 * Parses the AJAX HTML fragment returned by biznes.pap.pl.
 *
 * HTML structure:
 * <table class="table">
 *   <tbody>
 *     <tr><td colspan="5" class="day">2026.07.01 – Środa</td></tr>  ← skip
 *     <tr>
 *       <td class="text-right">20:14</td>          ← [0] time HH:MM
 *       <td class="text-left">16/2026</td>          ← [1] report number
 *       <td class="text-left"><a ...>PZU TFI</a></td>  ← [2] company
 *       <td><a href="/wiadomosci/firmy/slug">COMPANY (16/2026) Title</a></td>  ← [3]
 *     </tr>
 *   </tbody>
 * </table>
 */
export function parseFeedHtml(
  html: string,
  date: string,       // YYYY-MM-DD
  reportType: ReportType,
): ParseResult<FinancialReport[]> {
  try {
    const root = parse(html);
    const rows = root.querySelectorAll('table.table tbody tr');

    if (rows.length === 0) {
      return { ok: true, data: [] };
    }

    const reports: FinancialReport[] = [];

    for (const row of rows) {
      try {
        // Skip day-separator rows (they have a single td with class "day")
        if (row.querySelector('td.day')) continue;

        const cells = row.querySelectorAll('td');
        if (cells.length < 4) continue;

        const timeStr = cells[0].text.trim();          // "20:14"
        const reportNumber = cells[1].text.trim();     // "16/2026"
        const companyAnchor = cells[2].querySelector('a');
        const titleAnchor = cells[3].querySelector('a');

        if (!companyAnchor || !titleAnchor) continue;

        const companyName = companyAnchor.text.trim();
        const href = titleAnchor.getAttribute('href') ?? '';
        const anchorText = titleAnchor.text.trim();

        const path = hrefToPath(href);
        if (!path) continue;

        const sourceUrl = `${BASE_URL}/${path}`;

        // Build publication datetime
        const [hours, minutes] = timeStr.split(':').map(Number);
        if (isNaN(hours) || isNaN(minutes)) continue;
        const dateTime = new Date(
          `${date}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`,
        );

        const title = extractTitle(anchorText, reportNumber);

        reports.push({
          id: path,         // e.g. "wiadomosci/firmy/pzu-tfi-162026-..."
          companyName,
          ticker: null,
          reportType,
          reportNumber,
          title,
          dateTime,
          sourceUrl,
        });
      } catch {
        continue;
      }
    }

    return { ok: true, data: reports };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Unknown parse error',
    };
  }
}

