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
}