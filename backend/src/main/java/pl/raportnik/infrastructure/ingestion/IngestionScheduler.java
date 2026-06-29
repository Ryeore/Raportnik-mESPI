package pl.raportnik.infrastructure.ingestion;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import pl.raportnik.domain.report.Report;
import pl.raportnik.domain.report.ReportRepository;

@Component
public class IngestionScheduler {
    private final ReportIngestionSource source;
    private final ReportRepository repo;
    public IngestionScheduler(ReportIngestionSource source, ReportRepository repo) {
        this.source = source; this.repo = repo;
    }

    @Scheduled(cron = "${ingestion.pap.cron}")
    public void run() {
        for (Report r : source.fetchLatest()) {
            repo.saveIfAbsent(r); // idempotent by external_id
        }
    }
}
