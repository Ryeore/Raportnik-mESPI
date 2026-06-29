package pl.raportnik.domain.report;

import java.time.Instant;
import java.util.UUID;

/** Aggregate root: ESPI/EBI report. No framework dependencies. */
public record Report(
        UUID id,
        UUID companyId,
        String externalId,
        ReportType type,
        String number,
        String title,
        String body,
        Instant publishedAt) {

    public enum ReportType { ESPI, EBI }

    public boolean matchesKeyword(String kw) {
        if (kw == null || kw.isBlank()) return true;
        String k = kw.toLowerCase();
        return title.toLowerCase().contains(k) || body.toLowerCase().contains(k);
    }
}
