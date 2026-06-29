package pl.raportnik;

import org.junit.jupiter.api.Test;
import pl.raportnik.domain.report.Report;

import java.time.Instant;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class ReportTest {
    @Test void matchesKeywordInBody() {
        var r = new Report(UUID.randomUUID(), UUID.randomUUID(), "x", Report.ReportType.ESPI,
                "1/2025", "Tytul", "Zarzad rekomenduje dywidenda", Instant.now());
        assertTrue(r.matchesKeyword("dywidenda"));
        assertFalse(r.matchesKeyword("przejecie"));
    }
}
