namespace SpecTrace.Api.Models;

public sealed class AiEnrichmentInfo
{
    public bool Available { get; init; }
    public string Provider { get; init; } = string.Empty;
    public string Mode { get; init; } = string.Empty;
    public string ReviewerSummary { get; init; } = string.Empty;
    public string EngineeringRecommendation { get; init; } = string.Empty;
    public string ReleaseDecisionRationale { get; init; } = string.Empty;
}