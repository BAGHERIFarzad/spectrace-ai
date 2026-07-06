using System.Net.Http.Json;
using SpecTrace.Api.Models;

namespace SpecTrace.Api.Services;

public sealed class AiWorkerClient : IAiWorkerClient
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<AiWorkerClient> _logger;

    public AiWorkerClient(
        HttpClient httpClient,
        ILogger<AiWorkerClient> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task<AiWorkerEnrichment?> EnrichAsync(
        string investigationTitle,
        string incidentDescription,
        LogEvidenceAnalysis rootCause,
        CancellationToken cancellationToken = default)
    {
        var request = new
        {
            investigation_title = investigationTitle,
            incident_description = incidentDescription,
            root_cause_title = rootCause.RootCauseTitle,
            root_cause_description = rootCause.RootCauseDescription,
            recommendation = rootCause.Recommendation,
            confidence = rootCause.Confidence,
            risk_score = rootCause.RiskScore,
            detected_signals = rootCause.DetectedSignals
        };

        try
        {
            using var response = await _httpClient.PostAsJsonAsync(
                "api/enrich",
                request,
                cancellationToken);

            response.EnsureSuccessStatusCode();

            return await response.Content.ReadFromJsonAsync<AiWorkerEnrichment>(
                cancellationToken: cancellationToken);
        }
        catch (Exception exception)
        {
            _logger.LogWarning(
                exception,
                "SpecTrace AI worker enrichment was unavailable.");

            return null;
        }
    }
}