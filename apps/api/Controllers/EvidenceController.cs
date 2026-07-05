using Microsoft.AspNetCore.Mvc;
using SpecTrace.Api.Models;

namespace SpecTrace.Api.Controllers;

[ApiController]
[Route("api/evidence")]
public sealed class EvidenceController : ControllerBase
{
    private readonly IWebHostEnvironment _environment;

    public EvidenceController(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    [HttpPost("upload")]
    [RequestSizeLimit(100_000_000)]
    [ProducesResponseType(typeof(EvidenceUploadResult), StatusCodes.Status200OK)]
    public async Task<ActionResult<EvidenceUploadResult>> Upload(
        IFormFile file,
        [FromForm] string category)
    {
        if (file.Length == 0)
        {
            return BadRequest("The uploaded file is empty.");
        }

        var allowedCategories = new[] { "video", "screenshot", "log" };

        if (!allowedCategories.Contains(category.ToLowerInvariant()))
        {
            return BadRequest("Category must be video, screenshot, or log.");
        }

        var uploadRoot = Path.Combine(
            _environment.ContentRootPath,
            "uploads",
            category.ToLowerInvariant());

        Directory.CreateDirectory(uploadRoot);

        var safeFileName =
            $"{Guid.NewGuid():N}_{Path.GetFileName(file.FileName)}";

        var fullPath = Path.Combine(uploadRoot, safeFileName);

        await using var stream = System.IO.File.Create(fullPath);
        await file.CopyToAsync(stream);

        return Ok(new EvidenceUploadResult
        {
            UploadId = Guid.NewGuid().ToString("N"),
            FileName = file.FileName,
            ContentType = file.ContentType,
            SizeBytes = file.Length,
            Category = category,
            StoredPath = $"uploads/{category}/{safeFileName}",
            UploadedAtUtc = DateTimeOffset.UtcNow
        });
    }
}