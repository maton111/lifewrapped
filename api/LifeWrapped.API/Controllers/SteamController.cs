using LifeWrapped.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace LifeWrapped.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SteamController(SteamService steamService) : ControllerBase
{
    [HttpGet("{steamId}")]
    public async Task<IActionResult> Get(string steamId)
    {
        try
        {
            var stats = await steamService.GetStatsAsync(steamId);
            return Ok(stats);
        }
        catch (SteamProfilePrivateException)
        {
            return BadRequest(new
            {
                error = "PRIVATE_PROFILE",
                helpUrl = "https://help.steampowered.com/en/faqs/view/588C-C67D-0251-C276"
            });
        }
        catch (SteamApiException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}