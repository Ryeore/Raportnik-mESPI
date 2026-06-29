package pl.raportnik.infrastructure.persistence;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;
import pl.raportnik.domain.report.Report;
import pl.raportnik.domain.report.ReportQuery;
import pl.raportnik.domain.report.ReportRepository;

import java.util.List;
import java.util.UUID;

@Repository
public class JpaReportRepositoryAdapter implements ReportRepository {
    private final JpaReportRepository jpa;
    public JpaReportRepositoryAdapter(JpaReportRepository jpa) { this.jpa = jpa; }

    @Override public void saveIfAbsent(Report r) {
        if (jpa.existsByExternalId(r.externalId())) return;
        jpa.save(new ReportEntity(r.id(), r.companyId(), r.externalId(), r.type().name(),
                r.number(), r.title(), r.body(), r.publishedAt()));
    }

    @Override public Report findById(UUID id) {
        return jpa.findById(id).map(this::toDomain).orElseThrow();
    }

    @Override public List<Report> feed(ReportQuery q) {
        return jpa.findAll(PageRequest.of(0, q.size())).stream().map(this::toDomain).toList();
    }

    private Report toDomain(ReportEntity e) {
        return new Report(e.getId(), e.getCompanyId(), e.getExternalId(),
                Report.ReportType.valueOf(e.getType()), e.getNumber(), e.getTitle(), e.getBody(), e.getPublishedAt());
    }
}
