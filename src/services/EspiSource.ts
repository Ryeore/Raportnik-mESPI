import { EspiReport } from "@/types";

/**
 * Abstraction over the data source. Implement this to swap espiebi.pap.pl for
 * any other provider without touching the rest of the app.
 */
export interface EspiSource {
  fetchLatest(): Promise<EspiReport[]>;
}
