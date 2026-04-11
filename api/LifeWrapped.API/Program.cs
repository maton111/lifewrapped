using LifeWrapped.API.Data;
using LifeWrapped.API.Services;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using System.Threading.RateLimiting;

DotNetEnv.Env.Load();

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// Database
var connectionString = builder.Configuration["DATABASE_URL"]
    ?? builder.Configuration.GetConnectionString("DefaultConnection");

if (!string.IsNullOrEmpty(connectionString))
{
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseNpgsql(connectionString));
}

// HTTP clients
builder.Services.AddHttpClient("Steam");

// Services
builder.Services.AddScoped<AggregatorService>();
builder.Services.AddScoped<WrappedGeneratorService>();
builder.Services.AddScoped<SteamService>();

// CORS
var allowedOrigins = builder.Configuration["ALLOWED_ORIGINS"]?.Split(',')
    ?? ["http://localhost:3000"];

builder.Services.AddCors(options =>
{
    options.AddPolicy("Default", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .WithMethods("GET", "POST")
              .WithHeaders("Content-Type", "Authorization");
    });
});

// Rate limiting
builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("upload", o =>
    {
        o.PermitLimit = 10;
        o.Window = TimeSpan.FromMinutes(1);
        o.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        o.QueueLimit = 2;
    });
});

// File upload size limit (50MB)
builder.Services.Configure<Microsoft.AspNetCore.Http.Features.FormOptions>(o =>
{
    o.MultipartBodyLengthLimit = 50 * 1024 * 1024;
});

var app = builder.Build();

// Auto-migrate on startup
if (!string.IsNullOrEmpty(connectionString))
{
    if (app.Environment.IsDevelopment())
        EnsurePostgresDockerRunning();

    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    context.Database.Migrate();
}

if (app.Environment.IsDevelopment())
    app.MapOpenApi();

app.UseRateLimiter();
app.UseCors("Default");
app.MapControllers();

// Health check for Railway
app.MapGet("/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }));

app.Run();


static void EnsurePostgresDockerRunning()
{
    const string containerName = "lifewrapped-pg";

    try
    {
        // Tenta di avviare il container se esiste già (anche se è fermo)
        if (RunDocker($"start {containerName}").ExitCode == 0)
        {
            Console.WriteLine("[Dev] Container PostgreSQL avviato.");
            Thread.Sleep(1000);
            return;
        }

        // Il container non esiste ancora: crealo
        Console.WriteLine("[Dev] Creazione container PostgreSQL...");
        RunDocker($"run -d --name {containerName} " +
                  "-e POSTGRES_PASSWORD=postgres " +
                  "-e POSTGRES_DB=lifewrapped " +
                  "-p 5432:5432 postgres:16");

        // Attendi l'inizializzazione di PostgreSQL
        Console.WriteLine("[Dev] Attendo che PostgreSQL sia pronto...");
        Thread.Sleep(3000);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[Dev] Impossibile avviare Docker automaticamente: {ex.Message}");
    }
}

static (int ExitCode, string Output) RunDocker(string arguments)
{
    var psi = new ProcessStartInfo("docker", arguments)
    {
        RedirectStandardOutput = true,
        RedirectStandardError = true,
        UseShellExecute = false
    };

    using var process = Process.Start(psi)!;
    var output = process.StandardOutput.ReadToEnd();
    process.WaitForExit();
    return (process.ExitCode, output);
}