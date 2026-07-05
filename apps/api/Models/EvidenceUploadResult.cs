namespace SpecTrace.Api.Models;

public sealed class EvidenceUploadResult
{
    public string UploadId { get; init; } = string.Empty;
    public string FileName { get; init; } = string.Empty;
    public string ContentType { get; init; } = string.Empty;
    public long SizeBytes { get; init; }
    public string Category { get; init; } = string.Empty;
    public string StoredPath { get; init; } = string.Empty;
    public DateTimeOffset UploadedAtUtc { get; init; }
}