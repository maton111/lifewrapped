using System.Text.Json;
using LifeWrapped.API.Models;

namespace LifeWrapped.API.Parsers;

public class SpotifyParser : IDataParser
{
    private const long MinPlayThresholdMs = 30_000;

    public async Task<LifeStats> ParseAsync(Stream input)
    {
        var entries = await JsonSerializer.DeserializeAsync<List<JsonElement>>(input) ?? [];
        return Aggregate(entries);
    }

    public async Task<LifeStats> ParseMultipleAsync(IEnumerable<Stream> streams)
    {
        var allEntries = new List<JsonElement>();
        foreach (var stream in streams)
        {
            var entries = await JsonSerializer.DeserializeAsync<List<JsonElement>>(stream) ?? [];
            allEntries.AddRange(entries);
        }
        return Aggregate(allEntries);
    }

    private static LifeStats Aggregate(List<JsonElement> entries)
    {
        long totalMs = 0;
        long nightMs = 0;
        var artistMs = new Dictionary<string, long>(StringComparer.OrdinalIgnoreCase);

        foreach (var entry in entries)
        {
            if (!entry.TryGetProperty("ms_played", out var msProp)) continue;
            var ms = msProp.GetInt64();
            if (ms < MinPlayThresholdMs) continue;

            totalMs += ms;

            var artist = entry.TryGetProperty("master_metadata_album_artist_name", out var artistProp)
                ? artistProp.GetString()
                : null;

            if (!string.IsNullOrWhiteSpace(artist))
                artistMs[artist] = artistMs.GetValueOrDefault(artist) + ms;

            if (entry.TryGetProperty("ts", out var tsProp) &&
                DateTime.TryParse(tsProp.GetString(), out var dt))
            {
                if (dt.Hour is >= 0 and < 4)
                    nightMs += ms;
            }
        }

        var topArtist = artistMs.Count > 0 ? artistMs.MaxBy(x => x.Value).Key : null;

        return new LifeStats
        {
            MsPlayed = totalMs,
            TopArtist = topArtist,
            NightMsPlayed = nightMs
        };
    }
}