using SpecTrace.Api.Models;

namespace SpecTrace.Api.Services;

public interface IDemoAnalysisService
{
    AnalysisReport CreateCheckoutFailureDemo();

    Task<AnalysisReport> CreateInvestigationAsync(
        CreateInvestigationRequest request,
        CancellationToken cancellationToken = default);
}