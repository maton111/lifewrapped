using System.Text.Json;
using LifeWrapped.API.Models;

namespace LifeWrapped.API.Services;

public class WrappedGeneratorService
{
    private readonly List<TemplatePhrase> _templates;

    public WrappedGeneratorService(IWebHostEnvironment env)
    {
        var phrasesPath = Path.Combine(env.ContentRootPath, "phrases.json");
        var json = File.ReadAllText(phrasesPath);
        _templates = JsonSerializer.Deserialize<List<TemplatePhrase>>(json,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? [];
    }

    public List<string> GeneratePhrases(LifeStats stats, List<string> sources)
    {
        var result = new List<(double score, string phrase)>();

        foreach (var template in _templates)
        {
            if (!sources.Contains(template.Source, StringComparer.OrdinalIgnoreCase))
                continue;

            var (value, label) = GetFieldValue(stats, template.Field);
            if (value == null || value < template.Threshold) continue;

            var phrase = template.Template
                .Replace("{value}", FormatValue(value.Value, template.Field))
                .Replace("{topic}", stats.TopSearchTopic ?? "qualcosa");

            result.Add((value.Value, phrase));
        }

        return result
            .OrderByDescending(x => x.score)
            .Take(8)
            .Select(x => x.phrase)
            .ToList();
    }

    private static (double? value, string label) GetFieldValue(LifeStats stats, string field) =>
        field switch
        {
            "TotalSearches"   => (stats.TotalSearches, "ricerche"),
            "YouTubeViews"    => (stats.YouTubeViews, "video"),
            "TotalDMs"        => (stats.TotalDMs, "messaggi"),
            "TotalLikes"      => (stats.TotalLikes, "like"),
            "MinutesListened" => (stats.MsPlayed.HasValue ? stats.MsPlayed.Value / 60000.0 : null, "minuti"),
            "NightMinutes"    => (stats.NightMsPlayed.HasValue ? stats.NightMsPlayed.Value / 60000.0 : null, "minuti notturni"),
            "HoursWatched"    => (stats.HoursWatched, "ore"),
            "TotalSteamHours" => (stats.TotalSteamHours, "ore"),
            "TopGameHours"    => (stats.TopGameHours, "ore"),
            _ => (null, "")
        };

    private static string FormatValue(double value, string field) =>
        field.Contains("Minutes") || field.Contains("Hours")
            ? ((long)value).ToString("N0")
            : ((long)value).ToString("N0");
}