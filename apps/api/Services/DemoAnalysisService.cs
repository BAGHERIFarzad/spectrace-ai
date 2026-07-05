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

            GeneratedAssets =
            [
                new GeneratedAsset
                {
                    Type = "Playwright Test",
                    Title = "checkout-confirms-order-after-successful-payment",
                    ContentPreview =
                        "Expect the confirmation page to appear when the payment API returns a successful transactionId.",
                    Status = "Ready for export"
                },
                new GeneratedAsset
                {
                    Type = "GitHub Issue",
                    Title = "Regression: checkout confirmation fails after successful payment",
                    ContentPreview =
                        "High-priority production regression with linked video, browser-log, and API-trace evidence.",
                    Status = "Draft"
                },
                new GeneratedAsset
                {
                    Type = "Acceptance Criteria",
                    Title = "Payment confirmation contract",
                    ContentPreview =
                        "The checkout must support the approved transactionId response contract and show an order confirmation.",
                    Status = "Ready for review"
                }
            ],

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
}