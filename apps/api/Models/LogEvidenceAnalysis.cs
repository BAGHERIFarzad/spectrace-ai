namespace SpecTrace.Api.Models;

public sealed class LogEvidenceAnalysis
{
    public bool HasRelevantSignals { get; init; }
    public string RootCauseTitle { get; init; } = string.Empty;
    public string RootCauseDescription { get; init; } = string.Empty;
    public string Recommendation { get; init; } = string.Empty;
    public int Confidence { get; init; }
    public int RiskScore { get; init; }
    public string RiskLevel { get; init; } = string.Empty;
    public List<string> DetectedSignals { get; init; } = [];
}