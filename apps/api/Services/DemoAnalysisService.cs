using SpecTrace.Api.Models;

namespace SpecTrace.Api.Services;

public sealed class DemoAnalysisService : IDemoAnalysisService
{
    private readonly ILogEvidenceAnalyzer _logEvidenceAnalyzer;
    private readonly IAiWorkerClient _aiWorkerClient;

    public DemoAnalysisService(
        ILogEvidenceAnalyzer logEvidenceAnalyzer,
        IAiWorkerClient aiWorkerClient)
    {
        _logEvidenceAnalyzer = logEvidenceAnalyzer;
        _aiWorkerClient = aiWorkerClient;
    }

    public AnalysisReport CreateCheckoutFailureDemo()
    {
        return new AnalysisReport
        {
            AnalysisId = "ST-CHK-2026-001",
            Title = "Checkout Failure After Release",
            Status = "Human Approval Required",
            RiskScore = 86,
            RiskLevel = "High",
            ExecutiveSummary =
                "SpecTrace identified a high-confidence checkout regression. " +
                "The payment confirmation flow fails after the payment provider returns a successful response, " +
                "leaving customers on the processing screen without an order confirmation.",

            RootCause = new RootCauseHypothesis
            {
                Title = "Payment API response-handling regression",
                Description =
                    "The frontend expects a legacy response property named paymentIntentId, " +
                    "while the deployed payment service returns transactionId. " +
                    "The successful response is therefore not mapped to the confirmation workflow.",
                Confidence = 92,
                Recommendation =
                    "Restore backward-compatible response mapping, add contract validation, " +
                    "and block release until the generated regression test passes."
            },

            Timeline =
            [
                new TimelineEvent
                {
                    Timestamp = "00:00",
                    Title = "Checkout journey begins",
                    Description = "Customer adds a laptop to the basket and proceeds to checkout.",
                    Severity = "Info"
                },
                new TimelineEvent
                {
                    Timestamp = "00:14",
                    Title = "Payment details submitted",
                    Description = "The payment form submits successfully and the checkout enters processing state.",
                    Severity = "Info"
                },
                new TimelineEvent
                {
                    Timestamp = "00:27",
                    Title = "Confirmation flow stalls",
                    Description = "The customer remains on the processing screen after a successful provider response.",
                    Severity = "High"
                },
                new TimelineEvent
                {
                    Timestamp = "00:31",
                    Title = "Console error detected",
                    Description = "Undefined property access occurs while mapping the payment API response.",
                    Severity = "Critical"
                }
            ],

            Evidence =
            [
                new EvidenceItem
                {
                    Id = "EV-001",
                    SourceType = "Video",
                    SourceReference = "checkout-session.mp4 · 00:27",
                    Summary = "Processing indicator remains visible and no order confirmation is displayed.",
                    Severity = "High"
                },
                new EvidenceItem
                {
                    Id = "EV-002",
                    SourceType = "Browser Log",
                    SourceReference = "console.log · line 184",
                    Summary = "TypeError: Cannot read properties of undefined (reading 'paymentIntentId').",
                    Severity = "Critical"
                },
                new EvidenceItem
                {
                    Id = "EV-003",
                    SourceType = "API Trace",
                    SourceReference = "POST /payments/confirm · 200 OK",
                    Summary = "Payment provider returned a successful response containing transactionId.",
                    Severity = "High"
                },
                new EvidenceItem
                {
                    Id = "EV-004",
                    SourceType = "Support Message",
                    SourceReference = "Ticket #4821",
                    Summary = "Customer reports a successful bank charge but no confirmation email or order record.",
                    Severity = "High"
                }
            ],

            GeneratedAssets = CreateGeneratedAssets(),

            HumanApproval = new HumanApproval
            {
                Required = true,
                Reason =
                    "The analysis affects customer payments and release safety. " +
                    "A human reviewer must verify the recommended fix before export.",
                Status = "Pending reviewer decision"
            },

            AmdProcessing = new AmdProcessingInfo
            {
                Status = "Demo mode",
                Runtime = "Demo evidence dataset",
                Pipeline =
                    "Video frames → multimodal evidence extraction → root-cause reasoning → QA asset generation"
            },

            AiEnrichment = new AiEnrichmentInfo
            {
                Available = false,
                Provider = "Demo dataset",
                Mode = "demo",
                ReviewerSummary =
                    "Load an uploaded evidence investigation to generate an AI-enriched reviewer summary.",
                EngineeringRecommendation =
                    "Run the live evidence workflow to generate a release-specific engineering action plan.",
                ReleaseDecisionRationale =
                    "Demo mode does not call the AI worker."
            },

            CreatedAtUtc = DateTimeOffset.UtcNow
        };
    }

    public async Task<AnalysisReport> CreateInvestigationAsync(
        CreateInvestigationRequest request,
        CancellationToken cancellationToken = default)
    {
        var logEvidence = request.Evidence
            .Where(item => item.Category.Equals("log", StringComparison.OrdinalIgnoreCase))
            .ToList();

        LogEvidenceAnalysis? logAnalysis = null;

        foreach (var log in logEvidence)
        {
            var result = await _logEvidenceAnalyzer.AnalyzeAsync(
                log,
                cancellationToken);

            if (result is not null)
            {
                logAnalysis = result;
                break;
            }
        }

        var evidence = request.Evidence
            .Select((item, index) => new EvidenceItem
            {
                Id = $"EV-{index + 1:000}",
                SourceType = GetSourceType(item.Category),
                SourceReference = item.FileName,
                Summary = GetEvidenceSummary(item, logAnalysis),
                Severity = GetEvidenceSeverity(item, logAnalysis)
            })
            .ToList();

        var analysisId =
            $"ST-INV-{DateTime.UtcNow:yyyyMMdd}-{Random.Shared.Next(100, 999)}";

        var rootCause = logAnalysis ?? new LogEvidenceAnalysis
        {
            RootCauseTitle = "Investigation pending multimodal evidence analysis",
            RootCauseDescription =
                $"The uploaded evidence suggests a potential regression related to: {request.Description}. " +
                "SpecTrace has created a traceable investigation and will correlate visual, textual, and technical signals.",
            Recommendation =
                "Review the uploaded evidence, validate the release change set, and run the generated regression checks before approval.",
            Confidence = 68,
            RiskScore = 78,
            RiskLevel = "High"
        };

        var detectedSignalText = logAnalysis?.DetectedSignals.Count > 0
            ? $" Detected signals: {string.Join(" ", logAnalysis.DetectedSignals)}"
            : string.Empty;

        AiWorkerEnrichment? enrichment = null;

        if (logAnalysis is not null)
        {
            try
            {
                enrichment = await _aiWorkerClient.EnrichAsync(
                    request.Title,
                    request.Description,
                    logAnalysis,
                    cancellationToken);
            }
            catch
            {
                enrichment = null;
            }
        }

        var aiEnrichment = enrichment is not null
            ? CreateRemoteAiEnrichment(enrichment)
            : CreateFallbackEnrichment(rootCause, logAnalysis);

        return new AnalysisReport
        {
            AnalysisId = analysisId,
            Title = request.Title,
            Status = "Human Approval Required",
            RiskScore = rootCause.RiskScore,
            RiskLevel = rootCause.RiskLevel,

            ExecutiveSummary =
                !string.IsNullOrWhiteSpace(aiEnrichment.ReviewerSummary) &&
                aiEnrichment.Available
                    ? aiEnrichment.ReviewerSummary
                    : $"SpecTrace analyzed {evidence.Count} uploaded evidence source{(evidence.Count == 1 ? "" : "s")} " +
                      $"for {request.Environment}, release {request.ReleaseVersion}. " +
                      $"{rootCause.RootCauseTitle}.{detectedSignalText}",

            RootCause = new RootCauseHypothesis
            {
                Title = rootCause.RootCauseTitle,
                Description = rootCause.RootCauseDescription,
                Confidence = rootCause.Confidence,
                Recommendation = string.IsNullOrWhiteSpace(aiEnrichment.EngineeringRecommendation)
                    ? rootCause.Recommendation
                    : aiEnrichment.EngineeringRecommendation
            },

            Timeline =
            [
                new TimelineEvent
                {
                    Timestamp = "00:00",
                    Title = "Investigation created",
                    Description =
                        $"Incident registered for {request.Environment}, release {request.ReleaseVersion}.",
                    Severity = "Info"
                },
                new TimelineEvent
                {
                    Timestamp = "00:04",
                    Title = "Evidence ingested",
                    Description =
                        $"{evidence.Count} evidence source{(evidence.Count == 1 ? "" : "s")} attached to the investigation.",
                    Severity = "Info"
                },
                new TimelineEvent
                {
                    Timestamp = "00:08",
                    Title = logAnalysis is null
                        ? "Multimodal correlation queued"
                        : "Technical failure signals detected",
                    Description = logAnalysis is null
                        ? "SpecTrace prepared the evidence set for multimodal analysis and trace generation."
                        : string.Join(" ", logAnalysis.DetectedSignals),
                    Severity = logAnalysis is null ? "High" : "Critical"
                },
                new TimelineEvent
                {
                    Timestamp = "00:12",
                    Title = aiEnrichment.Available
                        ? "AI reasoning completed"
                        : "Fallback reasoning completed",
                    Description = aiEnrichment.Available
                        ? $"Remote enrichment completed through {aiEnrichment.Provider}."
                        : "SpecTrace used deterministic fallback reasoning because remote AI enrichment was unavailable.",
                    Severity = aiEnrichment.Available ? "Info" : "High"
                }
            ],

            Evidence = evidence,
            GeneratedAssets = CreateGeneratedAssets(),

            HumanApproval = new HumanApproval
            {
                Required = true,
                Reason =
                    "This investigation may affect release quality and customer experience. " +
                    "A human reviewer must validate the findings before export.",
                Status = "Pending reviewer decision"
            },

            AmdProcessing = new AmdProcessingInfo
            {
                Status = aiEnrichment.Available
                    ? $"AI enrichment completed · {aiEnrichment.Provider}"
                    : "Deterministic fallback completed · AI worker unavailable",

                Runtime = aiEnrichment.Available
                    ? aiEnrichment.Mode.Equals("mock", StringComparison.OrdinalIgnoreCase)
                        ? "Local FastAPI AI worker · AMD/Gemma-ready"
                        : "Remote AI runtime · AMD/Gemma-compatible architecture"
                    : "Local .NET evidence analyzer · fallback-safe runtime",

                Pipeline =
                    "Evidence ingestion → log signal extraction → AI enrichment/fallback → multimodal correlation → root-cause reasoning → QA asset generation"
            },

            AiEnrichment = aiEnrichment,

            CreatedAtUtc = DateTimeOffset.UtcNow
        };
    }

    private static AiEnrichmentInfo CreateRemoteAiEnrichment(
        AiWorkerEnrichment enrichment)
    {
        return new AiEnrichmentInfo
        {
            Available = true,
            Provider = string.IsNullOrWhiteSpace(enrichment.Provider)
                ? "Remote AI worker"
                : enrichment.Provider,
            Mode = string.IsNullOrWhiteSpace(enrichment.Mode)
                ? "remote"
                : enrichment.Mode,
            ReviewerSummary = string.IsNullOrWhiteSpace(enrichment.ReviewerSummary)
                ? "SpecTrace completed remote AI enrichment, but the provider returned an empty reviewer summary."
                : enrichment.ReviewerSummary,
            EngineeringRecommendation = string.IsNullOrWhiteSpace(enrichment.EngineeringRecommendation)
                ? "Review the extracted evidence, validate the root-cause hypothesis, and run regression checks before changing the release decision."
                : enrichment.EngineeringRecommendation,
            ReleaseDecisionRationale = string.IsNullOrWhiteSpace(enrichment.ReleaseDecisionRationale)
                ? "A reviewer should validate the AI-enriched investigation before approving, requesting changes, or blocking the release."
                : enrichment.ReleaseDecisionRationale
        };
    }

    private static AiEnrichmentInfo CreateFallbackEnrichment(
        LogEvidenceAnalysis rootCause,
        LogEvidenceAnalysis? logAnalysis)
    {
        var detectedSignals = logAnalysis?.DetectedSignals.Count > 0
            ? string.Join(" ", logAnalysis.DetectedSignals)
            : "the uploaded evidence";

        return new AiEnrichmentInfo
        {
            Available = false,
            Provider = "SpecTrace deterministic fallback",
            Mode = "local-fallback",
            ReviewerSummary =
                "SpecTrace completed the investigation using deterministic evidence analysis because the remote AI worker was unavailable. " +
                $"The investigation still identified a likely release risk from {detectedSignals}",
            EngineeringRecommendation = string.IsNullOrWhiteSpace(rootCause.Recommendation)
                ? "Review the extracted evidence, validate the release change set, and run the generated regression checks before approval."
                : rootCause.Recommendation,
            ReleaseDecisionRationale =
                "A human reviewer should validate the evidence before approving the release. " +
                "Because the issue may affect release quality and customer experience, the release should not proceed until the regression is verified and the recommended fix is tested."
        };
    }

    private static List<GeneratedAsset> CreateGeneratedAssets()
    {
        return
        [
            new GeneratedAsset
            {
                Type = "Playwright Test",
                Title = "checkout-confirmation-regression.spec.ts",
                ContentPreview =
                    "End-to-end regression test covering successful payment response, transactionId mapping, confirmation page visibility, and removal of the processing state.",
                Status = "Ready for review"
            },
            new GeneratedAsset
            {
                Type = "GitHub Issue",
                Title = "Block release: checkout confirmation fails after payment",
                ContentPreview =
                    "Engineering issue with severity, customer impact, evidence links, root-cause hypothesis, fix plan, and release-blocking checklist.",
                Status = "Draft"
            },
            new GeneratedAsset
            {
                Type = "Acceptance Criteria",
                Title = "Checkout release safety criteria",
                ContentPreview =
                    "Given/When/Then release criteria covering payment confirmation, response-contract compatibility, regression testing, and human approval.",
                Status = "Ready for review"
            }
        ];
    }

    private static string GetSourceType(string category)
    {
        return category.ToLowerInvariant() switch
        {
            "video" => "Video",
            "screenshot" => "Screenshot",
            "log" => "Application Log",
            _ => "Evidence File"
        };
    }

    private static string GetEvidenceSummary(
        UploadedEvidenceReference evidence,
        LogEvidenceAnalysis? logAnalysis)
    {
        if (evidence.Category.Equals("log", StringComparison.OrdinalIgnoreCase) &&
            logAnalysis?.DetectedSignals.Count > 0)
        {
            return string.Join(" ", logAnalysis.DetectedSignals);
        }

        return evidence.Category.ToLowerInvariant() switch
        {
            "video" => "Screen recording attached for visual journey and interaction analysis.",
            "screenshot" => "Visual product evidence attached for UI-state and error-context analysis.",
            "log" => "Technical trace attached for exception, API, and runtime correlation.",
            _ => "Evidence file attached to the investigation."
        };
    }

    private static string GetEvidenceSeverity(
        UploadedEvidenceReference evidence,
        LogEvidenceAnalysis? logAnalysis)
    {
        if (evidence.Category.Equals("log", StringComparison.OrdinalIgnoreCase) &&
            logAnalysis is not null)
        {
            return logAnalysis.RiskLevel.Equals(
                "High",
                StringComparison.OrdinalIgnoreCase)
                ? "Critical"
                : "High";
        }

        return evidence.Category.Equals("log", StringComparison.OrdinalIgnoreCase)
            ? "Critical"
            : "High";
    }
}
