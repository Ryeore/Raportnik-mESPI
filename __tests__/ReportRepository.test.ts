jest.mock("expo-sqlite", () => {
  const reports: any[] = [];
  return {
    openDatabaseSync: () => ({
      execSync: jest.fn(),
      runSync: jest.fn(),
      withTransactionSync: (fn: () => void) => fn(),
      prepareSync: () => ({
        executeSync: (a: any[]) => {
          const exists = reports.find((r) => r.id === a[0]);
          if (exists) return { changes: 0 };
          reports.push({ id: a[0] });
          return { changes: 1 };
        },
        finalizeSync: jest.fn()
      })
    })
  };
});

import { ReportRepository } from "@/database/ReportRepository";
import { EspiReport } from "@/types";

const make = (id: string): EspiReport => ({
  id, ticker: "X", companyName: "C", reportNumber: "1", title: "T", content: "B",
  publishDate: new Date().toISOString(), url: "u"
});

describe("ReportRepository.upsertMany", () => {
  it("ignores duplicate ids", () => {
    expect(ReportRepository.upsertMany([make("1"), make("2")])).toEqual(["1", "2"]);
    expect(ReportRepository.upsertMany([make("1"), make("3")])).toEqual(["3"]);
  });
});
