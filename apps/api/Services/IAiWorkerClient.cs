using SpecTrace.Api.Models;

namespace SpecTrace.Api.Services;

public interface IAiWorkerClient
{
    Task<AiWorkerEnrichment?> EnrichAsync(
        string investigationTitle,
        string incidentDescription,
        LogEvidenceAnalysis rootCause,
        CancellationToken cancellationToken = default);
}