using LifeWrapped.API.Data;
using LifeWrapped.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace LifeWrapped.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WrappedController(AppDbContext db) : ControllerBase
{
    [HttpPost("save")]
    public async Task<IActionResult> Save([FromBody] SaveWrappedRequest request)
    {
        var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(9))
            .Replace("+", "-").Replace("/", "_").Replace("=", "");

        var result = new WrappedResult
        {
            Token = token,
            Stats = request.Stats,
            Phrases = request.Phrases,
            Sources = request.Sources
        };

        db.WrappedResults.Add(result);

        await UpdateGlobalAggregates(db, request.Stats);
        await db.SaveChangesAsync();

        return Ok(new { token });
    }

    [HttpGet("{token}")]
    public async Task<IActionResult> Get(string token)
    {
        var result = await db.WrappedResults
            .FirstOrDefaultAsync(r => r.Token == token);

        if (result == null)
            return NotFound(new { error = "Wrapped not found." });

        return Ok(result);
    }

    private static async Task UpdateGlobalAggregates(AppDbContext db, LifeStats stats)
    {
        await UpsertAggregate(db, "total_wrapped", 1);

        if (stats.HoursWatched.HasValue)
            await UpsertAggregate(db, "netflix_hours", (long)stats.HoursWatched.Value);

        if (stats.MsPlayed.HasValue)
            await UpsertAggregate(db, "spotify_minutes", stats.MsPlayed.Value / 60000);
    }

    private static async Task UpsertAggregate(AppDbContext db, string key, long value)
    {
        var agg = await db.GlobalAggregates.FindAsync(key);
        if (agg == null)
        {
            db.GlobalAggregates.Add(new GlobalAggregate
            {
                StatKey = key,
                Total = value,
                Count = 1,
                UpdatedAt = DateTime.UtcNow
            });
        }
        else
        {
            agg.Total += value;
            agg.Count++;
            agg.UpdatedAt = DateTime.UtcNow;
        }
    }
}

public class SaveWrappedRequest
{
    public LifeStats Stats { get; set; } = new();
    public List<string> Phrases { get; set; } = [];
    public List<string> Sources { get; set; } = [];
}