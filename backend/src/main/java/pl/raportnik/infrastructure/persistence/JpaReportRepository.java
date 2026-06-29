package pl.raportnik.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface JpaReportRepository extends JpaRepository<ReportEntity, UUID> {
    boolean existsByExternalId(String externalId);
}
