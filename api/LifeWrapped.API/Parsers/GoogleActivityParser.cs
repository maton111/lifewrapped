using System.Text.Json;
using LifeWrapped.API.Models;

namespace LifeWrapped.API.Parsers;

public class GoogleActivityParser : IDataParser
{
    public async Task<LifeStats> ParseAsync(Stream input)
    {
        var activities = await JsonSerializer.DeserializeAsync<List<JsonElement>>(input)
                         ?? [];

        var totalSearches = 0;
        var youTubeViews = 0;
        var hourCounts = new int[24];
        var topicCounts = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);

        foreach (var item in activities)
        {
            var title = item.TryGetProperty("title", out var titleProp) ? titleProp.GetString() ?? "" : "";
            var titleUrl = item.TryGetProperty("titleUrl", out var urlProp) ? urlProp.GetString() ?? "" : "";

            if (title.StartsWith("Hai cercato", StringComparison.OrdinalIgnoreCase) ||
                title.StartsWith("Searched for", StringComparison.OrdinalIgnoreCase))
            {
                totalSearches++;
                var topic = title.Contains("Hai cercato ")
                    ? title["Hai cercato ".Length..].Trim().Trim('"')
                    : title["Searched for ".Length..].Trim().Trim('"');

                if (!string.IsNullOrWhiteSpace(topic))
                    topicCounts[topic] = topicCounts.GetValueOrDefault(topic) + 1;
            }

            if (titleUrl.Contains("youtube.com", StringComparison.OrdinalIgnoreCase))
                youTubeViews++;

            if (item.TryGetProperty("time", out var timeProp) &&
                DateTime.TryParse(timeProp.GetString(), out var dt))
            {
                hourCounts[dt.Hour]++;
            }
        }

        var peakHour = Array.IndexOf(hourCounts, hourCounts.Max());
        var topTopic = topicCounts.Count > 0
            ? topicCounts.MaxBy(x => x.Value).Key
            : null;

        return new LifeStats
        {
            TotalSearches = totalSearches,
            PeakHour = peakHour,
            TopSearchTopic = topTopic,
            YouTubeViews = youTubeViews
        };
    }
}