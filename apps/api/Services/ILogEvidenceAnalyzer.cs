using SpecTrace.Api.Models;

namespace SpecTrace.Api.Services;

public interface ILogEvidenceAnalyzer
{
    Task<LogEvidenceAnalysis?> AnalyzeAsync(
        UploadedEvidenceReference evidence,
        CancellationToken cancellationToken = default);
}