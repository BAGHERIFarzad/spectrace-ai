namespace SpecTrace.Api.Models;

public sealed class AnalysisReport
{
    public string AnalysisId { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public string Status { get; init; } = string.Empty;
    public int RiskScore { get; init; }
    public string RiskLevel { get; init; } = string.Empty;
    public string ExecutiveSummary { get; init; } = string.Empty;
    public RootCauseHypothesis RootCause { get; init; } = new();
    public List<TimelineEvent> Timeline { get; init; } = [];
    public List<EvidenceItem> Evidence { get; init; } = [];
    public List<GeneratedAsset> GeneratedAssets { get; init; } = [];
    public HumanApproval HumanApproval { get; init; } = new();
    public AmdProcessingInfo AmdProcessing { get; init; } = new();
    public AiEnrichmentInfo AiEnrichment { get; init; } = new();
    public DateTimeOffset CreatedAtUtc { get; init; }
}

public sealed class RootCauseHypothesis
{
    public string Title { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public int Confidence { get; init; }
    public string Recommendation { get; init; } = string.Empty;
}

public sealed class TimelineEvent
{
    public string Timestamp { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string Severity { get; init; } = string.Empty;
}

public sealed class EvidenceItem
{
    public string Id { get; init; } = string.Empty;
    public string SourceType { get; init; } = string.Empty;
    public string SourceReference { get; init; } = string.Empty;
    public string Summary { get; init; } = string.Empty;
    public string Severity { get; init; } = string.Empty;
}

public sealed class GeneratedAsset
{
    public string Type { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public string ContentPreview { get; init; } = string.Empty;
    public string Status { get; init; } = string.Empty;
}

public sealed class HumanApproval
{
    public bool Required { get; init; }
    public string Reason { get; init; } = string.Empty;
    public string Status { get; init; } = string.Empty;
}

public sealed class AmdProcessingInfo
{
    public string Status { get; init; } = string.Empty;
    public string Runtime { get; init; } = string.Empty;
    public string Pipeline { get; init; } = string.Empty;
}