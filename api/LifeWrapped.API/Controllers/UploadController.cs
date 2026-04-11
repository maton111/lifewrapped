using LifeWrapped.API.Models;
using LifeWrapped.API.Parsers;
using LifeWrapped.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace LifeWrapped.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[EnableRateLimiting("upload")]
[RequestSizeLimit(50 * 1024 * 1024)]
public class UploadController(
    AggregatorService aggregator,
    WrappedGeneratorService generator) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Upload([FromForm] UploadRequest request)
    {
        var sourceStats = new Dictionary<string, LifeStats>(StringComparer.OrdinalIgnoreCase);

        if (request.Google != null)
        {
            var parser = new GoogleActivityParser();
            sourceStats["google"] = await parser.ParseAsync(request.Google.OpenReadStream());
        }

        if (request.Instagram != null)
        {
            var parser = new InstagramParser();
            sourceStats["instagram"] = await parser.ParseAsync(request.Instagram.OpenReadStream());
        }

        if (request.Spotify != null && request.Spotify.Count > 0)
        {
            var parser = new SpotifyParser();
            var streams = request.Spotify.Select(f => f.OpenReadStream());
            sourceStats["spotify"] = await parser.ParseMultipleAsync(streams);
        }

        if (request.Netflix != null)
        {
            var parser = new NetflixParser();
            sourceStats["netflix"] = await parser.ParseAsync(request.Netflix.OpenReadStream());
        }

        if (sourceStats.Count == 0)
            return BadRequest(new { error = "No valid data sources provided." });

        var merged = aggregator.Merge(sourceStats);
        var sources = sourceStats.Keys.ToList();
        var phrases = generator.GeneratePhrases(merged, sources);

        return Ok(new
        {
            stats = merged,
            phrases,
            sources
        });
    }
}

public class UploadRequest
{
    public IFormFile? Google { get; set; }
    public IFormFile? Instagram { get; set; }
    public List<IFormFile>? Spotify { get; set; }
    public IFormFile? Netflix { get; set; }
}