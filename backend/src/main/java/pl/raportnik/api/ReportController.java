package pl.raportnik.api;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import pl.raportnik.application.report.ReportQueryService;
import pl.raportnik.domain.report.Report;
import pl.raportnik.domain.report.ReportQuery;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/reports")
public class ReportController {
    private final ReportQueryService service;
    public ReportController(ReportQueryService service) { this.service = service; }

    @GetMapping
    public List<Report> feed(@RequestParam(defaultValue = "false") boolean watchedOnly,
                             @RequestParam(required = false) Report.ReportType type,
                             @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
                             @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to,
                             @RequestParam(required = false) String q,
                             @RequestParam(required = false) UUID cursor,
                             @RequestParam(defaultValue = "20") int size) {
        return service.feed(new ReportQuery(null, watchedOnly, type, from, to, q, cursor, size));
    }

    @GetMapping("/{id}")
    public Report detail(@PathVariable UUID id) { return service.detail(id); }
}
