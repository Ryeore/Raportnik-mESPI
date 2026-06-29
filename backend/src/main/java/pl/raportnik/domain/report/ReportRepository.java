package pl.raportnik.domain.report;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/** Port (application). Implementation in infrastructure. */
public interface ReportRepository {
    void saveIfAbsent(Report report);
    Report findById(UUID id);
    List<Report> feed(ReportQuery query);
}
