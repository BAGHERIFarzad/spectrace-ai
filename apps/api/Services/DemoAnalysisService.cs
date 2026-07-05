using SpecTrace.Api.Models;

namespace SpecTrace.Api.Services;

public sealed class DemoAnalysisService : IDemoAnalysisService
{
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
                Runtime = "AMD GPU / ROCm worker will be connected at hackathon kickoff",
                Pipeline = "Video frames → multimodal evidence extraction → root-cause reasoning → QA asset generation"
            },

            CreatedAtUtc = DateTimeOffset.UtcNow
        };
    }

    public AnalysisReport CreateInvestigation(CreateInvestigationRequest request)
    {
        var evidence = request.Evidence
            .Select((item, index) => new EvidenceItem
            {
                Id = $"EV-{index + 1:000}",
                SourceType = GetSourceType(item.Category),
                SourceReference = item.FileName,
                Summary = GetEvidenceSummary(item),
                Severity = item.Category.Equals("log", StringComparison.OrdinalIgnoreCase)
                    ? "Critical"
                    : "High"
            })
            .ToList();

        var analysisId = $"ST-INV-{DateTime.UtcNow:yyyyMMdd}-{Random.Shared.Next(100, 999)}";

        return new AnalysisReport
        {
            AnalysisId = analysisId,
            Title = request.Title,
            Status = "Human Approval Required",
            RiskScore = 78,
            RiskLevel = "High",
            ExecutiveSummary =
                $"SpecTrace created an evidence-linked investigation for {request.Title}. " +
                $"{evidence.Count} source{(evidence.Count == 1 ? "" : "s")} were attached for the " +
                $"{request.Environment} environment, release {request.ReleaseVersion}. " +
                $"The investigation is ready for AI-assisted evidence extraction and human review.",

            RootCause = new RootCauseHypothesis
            {
                Title = "Investigation pending multimodal evidence analysis",
                Description =
                    $"The uploaded evidence suggests a potential regression related to: {request.Description}. " +
                    "SpecTrace has created a traceable investigation and will correlate visual, textual, and technical signals.",
                Confidence = 68,
                Recommendation =
                    "Review the uploaded evidence, validate the release change set, and run the generated regression checks before approval."
            },

            Timeline =
            [
                new TimelineEvent
                {
                    Timestamp = "00:00",
                    Title = "Investigation created",
                    Description = $"Incident registered for {request.Environment}, release {request.ReleaseVersion}.",
                    Severity = "Info"
                },
                new TimelineEvent
                {
                    Timestamp = "00:04",
                    Title = "Evidence attached",
                    Description = $"{evidence.Count} evidence source{(evidence.Count == 1 ? "" : "s")} added to the investigation.",
                    Severity = "Info"
                },
                new TimelineEvent
                {
                    Timestamp = "00:08",
                    Title = "Cross-source correlation queued",
                    Description = "SpecTrace prepared the evidence set for multimodal analysis and trace generation.",
                    Severity = "High"
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
                Status = "Evidence pipeline queued",
                Runtime = "AMD GPU / ROCm multimodal worker",
                Pipeline = "Evidence ingestion → frame extraction → log interpretation → multimodal correlation → QA asset generation"
            },

            CreatedAtUtc = DateTimeOffset.UtcNow
        };
    }

    private static List<GeneratedAsset> CreateGeneratedAssets()
    {
        return
        [
            new GeneratedAsset
            {
                Type = "Playwright Test",
                Title = "generated-regression-check",
                ContentPreview =
                    "A browser regression test will validate the primary journey described by the investigation.",
                Status = "Ready for review"
            },
            new GeneratedAsset
            {
                Type = "GitHub Issue",
                Title = "Evidence-linked product investigation",
                ContentPreview =
                    "A structured engineering issue with linked evidence, risk context, and recommended next actions.",
                Status = "Draft"
            },
            new GeneratedAsset
            {
                Type = "Acceptance Criteria",
                Title = "Release safety criteria",
                ContentPreview =
                    "Clear validation criteria generated from the incident description and evidence sources.",
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

    private static string GetEvidenceSummary(UploadedEvidenceReference evidence)
    {
        return evidence.Category.ToLowerInvariant() switch
        {
            "video" => "Screen recording attached for visual journey and interaction analysis.",
            "screenshot" => "Visual product evidence attached for UI-state and error-context analysis.",
            "log" => "Technical trace attached for exception, API, and runtime correlation.",
            _ => "Evidence file attached to the investigation."
        };
    }
}