using System.Text.Json;
using LifeWrapped.API.Models;

namespace LifeWrapped.API.Services;

public class SteamService(IHttpClientFactory httpClientFactory, IConfiguration config)
{
    private readonly string _apiKey = config["STEAM_API_KEY"] ?? throw new InvalidOperationException("STEAM_API_KEY not configured");

    public async Task<LifeStats> GetStatsAsync(string steamInput)
    {
        var client = httpClientFactory.CreateClient("Steam");

        var steamId = await ResolveSteamIdAsync(client, steamInput);

        var url = $"https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key={_apiKey}&steamid={steamId}&include_appinfo=true&format=json";
        var response = await client.GetAsync(url);

        if (!response.IsSuccessStatusCode)
            throw new SteamApiException("Failed to fetch Steam games.");

        var body = await response.Content.ReadAsStringAsync();
        var doc = JsonDocument.Parse(body);
        var root = doc.RootElement.GetProperty("response");

        if (!root.TryGetProperty("games", out var games))
            throw new SteamProfilePrivateException();

        double totalMinutes = 0;
        string? topGame = null;
        double topGameMinutes = 0;

        foreach (var game in games.EnumerateArray())
        {
            var minutes = game.TryGetProperty("playtime_forever", out var pt) ? pt.GetDouble() : 0;
            totalMinutes += minutes;

            if (minutes > topGameMinutes)
            {
                topGameMinutes = minutes;
                topGame = game.TryGetProperty("name", out var nameProp) ? nameProp.GetString() : null;
            }
        }

        return new LifeStats
        {
            TotalSteamHours = Math.Round(totalMinutes / 60, 1),
            TopGame = topGame,
            TopGameHours = Math.Round(topGameMinutes / 60, 1)
        };
    }

    private async Task<string> ResolveSteamIdAsync(HttpClient client, string input)
    {
        input = input.Trim();

        // Extract vanity from full URL
        if (input.Contains("steamcommunity.com/id/"))
        {
            var uri = new Uri(input.StartsWith("http") ? input : "https://" + input);
            var segments = uri.AbsolutePath.Split('/', StringSplitOptions.RemoveEmptyEntries);
            var idIdx = Array.IndexOf(segments, "id");
            if (idIdx >= 0 && idIdx + 1 < segments.Length)
                input = segments[idIdx + 1];
        }

        // Numeric Steam ID (17 digits)
        if (input.All(char.IsDigit) && input.Length == 17)
            return input;

        // Vanity URL resolve
        var url = $"https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key={_apiKey}&vanityurl={input}";
        var response = await client.GetAsync(url);
        response.EnsureSuccessStatusCode();

        var body = await response.Content.ReadAsStringAsync();
        var doc = JsonDocument.Parse(body);
        var result = doc.RootElement.GetProperty("response");

        if (result.GetProperty("success").GetInt32() != 1)
            throw new SteamApiException($"Could not resolve Steam vanity URL: {input}");

        return result.GetProperty("steamid").GetString()!;
    }
}

public class SteamProfilePrivateException()
    : Exception("PRIVATE_PROFILE");

public class SteamApiException(string message)
    : Exception(message);