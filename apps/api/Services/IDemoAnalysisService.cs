using SpecTrace.Api.Models;

namespace SpecTrace.Api.Services;

public interface IDemoAnalysisService
{
    AnalysisReport CreateCheckoutFailureDemo();
}