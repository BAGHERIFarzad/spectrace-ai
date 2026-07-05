namespace SpecTrace.Api.Models;

public sealed class CreateInvestigationRequest
{
    public string Title { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string Environment { get; init; } = string.Empty;
    public string ReleaseVersion { get; init; } = string.Empty;
    public List<UploadedEvidenceReference> Evidence { get; init; } = [];
}

public sealed class UploadedEvidenceReference
{
    public string FileName { get; init; } = string.Empty;
    public string Category { get; init; } = string.Empty;
    public string StoredPath { get; init; } = string.Empty;
    public long SizeBytes { get; init; }
}