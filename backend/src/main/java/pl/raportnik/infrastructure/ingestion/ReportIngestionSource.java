package pl.raportnik.infrastructure.ingestion;

import pl.raportnik.domain.report.Report;
import java.util.List;

/** Swappable data source: PAP scraper -> eventually official API. */
public interface ReportIngestionSource {
    List<Report> fetchLatest();
}
