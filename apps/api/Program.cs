using SpecTrace.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddSingleton<IDemoAnalysisService, DemoAnalysisService>();
builder.Services.AddSingleton<ILogEvidenceAnalyzer, LogEvidenceAnalyzer>();
builder.Services.AddHttpClient<IAiWorkerClient, AiWorkerClient>(client =>
{
    client.BaseAddress = new Uri("http://localhost:8000/");
    client.Timeout = TimeSpan.FromSeconds(30);
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:3000",
            "https://spectrace-ai.vercel.app")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("Frontend");

app.MapControllers();

app.MapGet("/healthz", () =>
{
    return Results.Ok(new
    {
        status = "ok",
        service = "spectrace-api",
        timestampUtc = DateTimeOffset.UtcNow
    });
});

app.Run();