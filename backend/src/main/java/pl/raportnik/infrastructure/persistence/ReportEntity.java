package pl.raportnik.infrastructure.persistence;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "reports")
public class ReportEntity {
    @Id private UUID id;
    @Column(name = "company_id") private UUID companyId;
    @Column(name = "external_id", unique = true) private String externalId;
    private String type;
    private String number;
    private String title;
    @Column(columnDefinition = "text") private String body;
    @Column(name = "published_at") private Instant publishedAt;

    protected ReportEntity() {}
    public ReportEntity(UUID id, UUID companyId, String externalId, String type, String number,
                        String title, String body, Instant publishedAt) {
        this.id = id; this.companyId = companyId; this.externalId = externalId; this.type = type;
        this.number = number; this.title = title; this.body = body; this.publishedAt = publishedAt;
    }
    public UUID getId() { return id; }
    public UUID getCompanyId() { return companyId; }
    public String getExternalId() { return externalId; }
    public String getType() { return type; }
    public String getNumber() { return number; }
    public String getTitle() { return title; }
    public String getBody() { return body; }
    public Instant getPublishedAt() { return publishedAt; }
}
