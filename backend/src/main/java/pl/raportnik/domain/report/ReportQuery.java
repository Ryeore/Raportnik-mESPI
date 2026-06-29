package pl.raportnik.domain.report;

import java.time.Instant;
import java.util.UUID;

public record ReportQuery(
        UUID userId,
        boolean watchedOnly,
        Report.ReportType type,
        Instant from,
        Instant to,
        String keyword,
        UUID cursor,
        int size) {}
