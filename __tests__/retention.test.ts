import { isWithinRetention, retentionCutoffIso } from "@/utils/date";

describe("retention", () => {
  const now = new Date("2026-06-29T00:00:00Z");

  it("keeps reports within 30 days", () => {
    expect(isWithinRetention("2026-06-10T00:00:00Z", now)).toBe(true);
  });

  it("excludes reports older than 30 days", () => {
    expect(isWithinRetention("2026-05-01T00:00:00Z", now)).toBe(false);
  });

  it("computes a cutoff 30 days in the past", () => {
    expect(retentionCutoffIso(now)).toBe(new Date("2026-05-30T00:00:00Z").toISOString());
  });
});
