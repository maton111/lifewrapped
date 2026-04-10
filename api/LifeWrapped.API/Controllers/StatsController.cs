using LifeWrapped.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LifeWrapped.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StatsController(AppDbContext db) : ControllerBase
{
    [HttpGet("global")]
    public async Task<IActionResult> Global()
    {
        var aggregates = await db.GlobalAggregates.ToListAsync();

        var total = aggregates.FirstOrDefault(a => a.StatKey == "total_wrapped")?.Count ?? 0;
        var netflixHours = aggregates.FirstOrDefault(a => a.StatKey == "netflix_hours")?.Total ?? 0;
        var spotifyMinutes = aggregates.FirstOrDefault(a => a.StatKey == "spotify_minutes")?.Total ?? 0;

        return Ok(new
        {
            totalWrapped = total,
            totalNetflixHours = netflixHours,
            totalSpotifyMinutes = spotifyMinutes
        });
    }
}