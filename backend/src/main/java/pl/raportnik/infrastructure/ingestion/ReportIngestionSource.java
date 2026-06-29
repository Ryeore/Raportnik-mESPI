package pl.raportnik.infrastructure.ingestion;

import pl.raportnik.domain.report.Report;
import java.util.List;

/** Wymienialne źródło danych: scraper PAP -> docelowo oficjalne API. */
public interface ReportIngestionSource {
    List<Report> fetchLatest();
}
