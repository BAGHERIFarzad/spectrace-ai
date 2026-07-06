namespace SpecTrace.Api.Models;

public sealed class AiWorkerEnrichment
{
    public string Provider { get; init; } = string.Empty;
    public string Mode { get; init; } = string.Empty;
    public string ReviewerSummary { get; init; } = string.Empty;
    public string EngineeringRecommendation { get; init; } = string.Empty;
    public string ReleaseDecisionRationale { get; init; } = string.Empty;
}