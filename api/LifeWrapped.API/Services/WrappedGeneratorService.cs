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

            var (value, _) = GetFieldValue(stats, template.Field);
            if (value == null || value < template.Threshold) continue;

            var phrase = template.Template
                .Replace("{value}", FormatValue(value.Value, template.Field))
                .Replace("{topic}", stats.TopSearchTopic ?? "qualcosa")
                .Replace("{igPeakDay}", ToItalianDay(stats.PeakDayOfWeek))
                .Replace("{igPeakDayCount}", (stats.PeakDayInstagramInteractions ?? 0).ToString("N0"))
                .Replace("{igPeakHour}", $"{stats.PeakHourInstagram ?? 0:00}:00")
                .Replace("{igPeakHourCount}", (stats.PeakHourInstagramInteractions ?? 0).ToString("N0"))
                .Replace("{igTopUsers}", FormatTopUsers(stats.InstagramInterestingUsers))
                .Replace("{igRangeMonths}", (stats.InstagramRangeMonths ?? 0).ToString("N0"))
                .Replace("{igRangeFrom}", FormatDate(stats.InstagramRangeStartUtc))
                .Replace("{igRangeTo}", FormatDate(stats.InstagramRangeEndUtc))
                .Replace("{igLikesRangeMonths}", (stats.InstagramLikesRangeMonths ?? 0).ToString("N0"))
                .Replace("{igLikesRangeFrom}", FormatDate(stats.InstagramLikesRangeStartUtc))
                .Replace("{igLikesRangeTo}", FormatDate(stats.InstagramLikesRangeEndUtc));

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
            "TotalSearches" => (stats.TotalSearches, "ricerche"),
            "YouTubeViews" => (stats.YouTubeViews, "video"),
            "TotalDMs" => (stats.TotalDMs, "messaggi"),
            "TotalLikes" => (stats.TotalLikes, "like"),
            "TotalStories" => (stats.TotalStories, "stories"),
            "TotalReposts" => (stats.TotalReposts, "repost"),
            "TotalStoryLikes" => (stats.TotalStoryLikes, "story likes"),
            "PeakDayInstagramInteractions" => (stats.PeakDayInstagramInteractions, "interazioni"),
            "PeakHourInstagramInteractions" => (stats.PeakHourInstagramInteractions, "interazioni"),
            "InstagramRangeMonths" => (stats.InstagramRangeMonths, "mesi"),
            "InstagramLikesRangeMonths" => (stats.InstagramLikesRangeMonths, "mesi"),
            "MinutesListened" => (stats.MsPlayed.HasValue ? stats.MsPlayed.Value / 60000.0 : null, "minuti"),
            "NightMinutes" => (stats.NightMsPlayed.HasValue ? stats.NightMsPlayed.Value / 60000.0 : null, "minuti notturni"),
            "HoursWatched" => (stats.HoursWatched, "ore"),
            "TotalSteamHours" => (stats.TotalSteamHours, "ore"),
            "TopGameHours" => (stats.TopGameHours, "ore"),
            _ => (null, "")
        };

    private static string FormatValue(double value, string field) =>
        field.Contains("Minutes") || field.Contains("Hours")
            ? ((long)value).ToString("N0")
            : ((long)value).ToString("N0");

    private static string ToItalianDay(int? dayOfWeek)
    {
        return dayOfWeek switch
        {
            0 => "domenica",
            1 => "lunedì",
            2 => "martedì",
            3 => "mercoledì",
            4 => "giovedì",
            5 => "venerdì",
            6 => "sabato",
            _ => "un giorno imprecisato"
        };
    }

    private static string FormatTopUsers(List<string>? users)
    {
        if (users == null || users.Count == 0)
            return "nessuno in particolare";

        return string.Join(", ", users.Take(3));
    }

    private static string FormatDate(DateTime? date)
    {
        return date?.ToString("dd/MM/yyyy") ?? "data non disponibile";
    }
}