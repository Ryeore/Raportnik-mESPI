package pl.raportnik.application.report;

import org.springframework.stereotype.Service;
import pl.raportnik.domain.report.Report;
import pl.raportnik.domain.report.ReportQuery;
import pl.raportnik.domain.report.ReportRepository;

import java.util.List;
import java.util.UUID;

/** CQRS: read side (Query). */
@Service
public class ReportQueryService {
    private final ReportRepository repo;
    public ReportQueryService(ReportRepository repo) { this.repo = repo; }

    public List<Report> feed(ReportQuery q) { return repo.feed(q); }
    public Report detail(UUID id) { return repo.findById(id); }
}
