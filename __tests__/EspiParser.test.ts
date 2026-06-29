import { parseListHtml } from "@/services/EspiParser";

describe("EspiParser.parseListHtml", () => {
  const now = new Date("2026-06-29T12:00:00Z");

  const item = (id: string, time: string, title: string, badge = "ESPI") => `
    <li class="news">
      <div class="badge">${badge}</div>
      <div class="hour">${time}</div>
      <div class="hour">${id}</div>
      <a href="/node/${id}">${title}</a>
    </li>`;

  it("parses news items into reports with id, time, title and url", () => {
    const html = `<ul>${item("715032", "14:30", "KGHM: raport biezacy")}</ul>`;
    const [r] = parseListHtml(html, "2026-06-28", now);
    expect(r.id).toBe("715032");
    expect(r.title).toBe("KGHM: raport biezacy");
    expect(r.companyName).toBe("KGHM");
    expect(r.url).toBe("https://espiebi.pap.pl/node/715032");
    expect(r.content).toBe("ESPI");
  });

  it("ignores items without id or anchor", () => {
    const html = `<ul><li class="news"><div class="badge">ESPI</div></li></ul>`;
    expect(parseListHtml(html, "2026-06-28", now)).toHaveLength(0);
  });

  it("filters out reports older than 30 days", () => {
    const html = `<ul>${item("1", "10:00", "OLD: x")}</ul>`;
    expect(parseListHtml(html, "2026-01-01", now)).toHaveLength(0);
  });
});
