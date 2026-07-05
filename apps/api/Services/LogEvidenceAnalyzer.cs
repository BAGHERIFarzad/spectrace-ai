using System.Text.RegularExpressions;
using SpecTrace.Api.Models;

namespace SpecTrace.Api.Services;

public sealed class LogEvidenceAnalyzer : ILogEvidenceAnalyzer
{
    private readonly IWebHostEnvironment _environment;

    public LogEvidenceAnalyzer(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    public async Task<LogEvidenceAnalysis?> AnalyzeAsync(
        UploadedEvidenceReference evidence,
        CancellationToken cancellationToken = default)
    {
        if (!evidence.Category.Equals("log", StringComparison.OrdinalIgnoreCase))
        {
            return null;
        }

        var relativePath = evidence.StoredPath
            .Replace("/", Path.DirectorySeparatorChar.ToString())
            .Replace("\\", Path.DirectorySeparatorChar.ToString());

        if (!relativePath.StartsWith(
                $"uploads{Path.DirectorySeparatorChar}log",
                StringComparison.OrdinalIgnoreCase))
        {
            return null;
        }

        var fullPath = Path.GetFullPath(
            Path.Combine(_environment.ContentRootPath, relativePath));

        var uploadsRoot = Path.GetFullPath(
            Path.Combine(_environment.ContentRootPath, "uploads"));

        if (!fullPath.StartsWith(uploadsRoot, StringComparison.OrdinalIgnoreCase))
        {
            return null;
        }

        if (!System.IO.File.Exists(fullPath))
        {
            return null;
        }

        var content = await System.IO.File.ReadAllTextAsync(
            fullPath,
            cancellationToken);

        var safeContent = content.Length > 100_000
            ? content[..100_000]
            : content;

        var detectedSignals = new List<string>();

        var hasTypeError = Regex.IsMatch(
            safeContent,
            @"TypeError|ReferenceError|NullReferenceException|undefined",
            RegexOptions.IgnoreCase);

        var hasPaymentIntentId = Regex.IsMatch(
            safeContent,
            @"paymentIntentId",
            RegexOptions.IgnoreCase);

        var hasTransactionId = Regex.IsMatch(
            safeContent,
            @"transactionId",
            RegexOptions.IgnoreCase);

        var hasSuccessfulPayment = Regex.IsMatch(
            safeContent,
            @"POST\s+/payments/confirm.*\b(200|201)\b",
            RegexOptions.IgnoreCase);

        var hasServerError = Regex.IsMatch(
            safeContent,
            @"\b(500|502|503)\b|Internal Server Error",
            RegexOptions.IgnoreCase);

        if (hasTypeError)
        {
            detectedSignals.Add("Runtime error or undefined-property access detected.");
        }

        if (hasPaymentIntentId)
        {
            detectedSignals.Add("Legacy paymentIntentId response field referenced.");
        }

        if (hasTransactionId)
        {
            detectedSignals.Add("transactionId response field detected.");
        }

        if (hasSuccessfulPayment)
        {
            detectedSignals.Add("Successful payment-confirmation API response detected.");
        }

        if (hasServerError)
        {
            detectedSignals.Add("Server-side failure signal detected.");
        }

        if (hasPaymentIntentId && hasTransactionId && hasSuccessfulPayment)
        {
            return new LogEvidenceAnalysis
            {
                HasRelevantSignals = true,
                RootCauseTitle = "Payment response-contract mismatch detected",
                RootCauseDescription =
                    "The uploaded log references the legacy paymentIntentId property while also showing a successful payment response containing transactionId. " +
                    "This strongly indicates a frontend-to-payment-service contract mismatch after a release change.",
                Recommendation =
                    "Restore backward-compatible response mapping, validate the API contract in CI, and block deployment until the checkout confirmation regression test passes.",
                Confidence = 92,
                RiskScore = 86,
                RiskLevel = "High",
                DetectedSignals = detectedSignals
            };
        }

        if (hasServerError)
        {
            return new LogEvidenceAnalysis
            {
                HasRelevantSignals = true,
                RootCauseTitle = "Backend service failure detected",
                RootCauseDescription =
                    "The uploaded evidence contains server-side error signals. The incident likely involves a failing backend dependency or unhandled service exception.",
                Recommendation =
                    "Inspect the affected service trace, identify the failed dependency, and add a resilience test before the next release.",
                Confidence = 82,
                RiskScore = 81,
                RiskLevel = "High",
                DetectedSignals = detectedSignals
            };
        }

        if (hasTypeError)
        {
            return new LogEvidenceAnalysis
            {
                HasRelevantSignals = true,
                RootCauseTitle = "Frontend runtime regression detected",
                RootCauseDescription =
                    "The uploaded log contains a runtime error involving an undefined value or property. This suggests a client-side state, data-mapping, or response-shape regression.",
                Recommendation =
                    "Reproduce the failing flow, validate null-safe data mapping, and add a regression test for the affected user journey.",
                Confidence = 76,
                RiskScore = 74,
                RiskLevel = "High",
                DetectedSignals = detectedSignals
            };
        }

        return new LogEvidenceAnalysis
        {
            HasRelevantSignals = detectedSignals.Count > 0,
            RootCauseTitle = "Technical trace requires deeper correlation",
            RootCauseDescription =
                "The uploaded log was ingested successfully, but it does not yet contain a high-confidence known failure signature.",
            Recommendation =
                "Add a screenshot or video recording to improve multimodal correlation and validate the release change set.",
            Confidence = 58,
            RiskScore = 58,
            RiskLevel = "Medium",
            DetectedSignals = detectedSignals
        };
    }
}