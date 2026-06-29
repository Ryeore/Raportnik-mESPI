import { parseReports, RawPapItem } from "@/services/EspiParser";

describe("EspiParser", () => {
  const now = new Date("2026-06-29T12:00:00Z");

  it("maps raw items to EspiReport and normalizes ticker", () => {
    const raw: RawPapItem[] = [
      { id: 1, ticker: "kgh", company: "KGHM", number: "12/2026", date: "2026-06-28", title: "T", body: "B", link: "u" }
    ];
    const [r] = parseReports(raw, now);
    expect(r.ticker).toBe("KGH");
    expect(r.id).toBe("1");
    expect(r.companyName).toBe("KGHM");
  });

  it("drops items without id or date", () => {
    const raw: RawPapItem[] = [{ ticker: "X" }, { id: 2, date: "2026-06-28" }];
    expect(parseReports(raw, now)).toHaveLength(1);
  });

  it("filters out reports older than 30 days", () => {
    const raw: RawPapItem[] = [{ id: 3, date: "2026-01-01", ticker: "OLD" }];
    expect(parseReports(raw, now)).toHaveLength(0);
  });
});
