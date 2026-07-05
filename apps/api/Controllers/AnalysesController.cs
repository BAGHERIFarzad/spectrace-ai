using Microsoft.AspNetCore.Mvc;
using SpecTrace.Api.Models;
using SpecTrace.Api.Services;

namespace SpecTrace.Api.Controllers;

[ApiController]
[Route("api/analyses")]
public sealed class AnalysesController : ControllerBase
{
    private readonly IDemoAnalysisService _demoAnalysisService;

    public AnalysesController(IDemoAnalysisService demoAnalysisService)
    {
        _demoAnalysisService = demoAnalysisService;
    }

    [HttpPost("demo")]
    [ProducesResponseType(typeof(AnalysisReport), StatusCodes.Status200OK)]
    public ActionResult<AnalysisReport> CreateDemoAnalysis()
    {
        var analysis = _demoAnalysisService.CreateCheckoutFailureDemo();

        return Ok(analysis);
    }

    [HttpPost("investigate")]
    [ProducesResponseType(typeof(AnalysisReport), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AnalysisReport>> CreateInvestigation(
        [FromBody] CreateInvestigationRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Title))
        {
            return BadRequest("An incident title is required.");
        }

        if (string.IsNullOrWhiteSpace(request.Description))
        {
            return BadRequest("An issue description is required.");
        }

        if (request.Evidence.Count == 0)
        {
            return BadRequest("Attach at least one evidence file before creating an investigation.");
        }

        var analysis = await _demoAnalysisService.CreateInvestigationAsync(
            request,
            HttpContext.RequestAborted);

        return Ok(analysis);
    }
}