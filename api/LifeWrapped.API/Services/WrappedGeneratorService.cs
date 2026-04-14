using System.Text.Json;
using LifeWrapped.API.Models;

namespace LifeWrapped.API.Services;

public class WrappedGeneratorService
{
    private readonly List<TemplatePhrase> _templates;
    private readonly Random _rng = new();

    public WrappedGeneratorService(IWebHostEnvironment env)
    {
        var phrasesPath = Path.Combine(env.ContentRootPath, "phrases.json");
        var json = File.ReadAllText(phrasesPath);
        _templates = JsonSerializer.Deserialize<List<TemplatePhrase>>(json,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? [];
    }

    public List<PhraseResult> GeneratePhrases(LifeStats stats, List<string> sources)
    {
        var candidates = BuildCandidates(stats, sources);

        var guaranteed = new List<(string source, double ratio, string phrase)>();
        var usedPhrases = new HashSet<string>();

        foreach (var source in sources)
        {
            var best = candidates
                .Where(c => c.source == source)
                .OrderByDescending(c => c.ratio)
                .FirstOrDefault();

            if (best == default) continue;

            guaranteed.Add(best);
            usedPhrases.Add(best.phrase);
        }

        var filler = candidates
            .Where(c => !usedPhrases.Contains(c.phrase))
            .OrderByDescending(c => c.ratio)
            .ToList();

        return guaranteed
            .Concat(filler)
            .Take(8)
            .Select(c => new PhraseResult { Source = c.source, Text = c.phrase })
            .ToList();
    }

    private List<(string source, double ratio, string phrase)> BuildCandidates(LifeStats stats, List<string> sources)
    {
        var result = new List<(string source, double ratio, string phrase)>();

        var byKey = _templates
            .Where(t => sources.Contains(t.Source, StringComparer.OrdinalIgnoreCase))
            .GroupBy(t => t.Key);

        foreach (var group in byKey)
        {
            var tiersForKey = group.ToList();
            var firstTemplate = tiersForKey.First();
            var (rawValue, _) = GetFieldValue(stats, firstTemplate.Field);

            if (rawValue == null) continue;
            double value = rawValue.Value;

            TemplatePhrase chosen;
            var reached = tiersForKey
                .Where(t => value >= t.Threshold)
                .OrderByDescending(t => t.Tier)
                .FirstOrDefault();

            chosen = reached ?? tiersForKey.OrderByDescending(t => t.Tier).First();

            if (chosen.Templates.Count == 0) continue;

            var template = chosen.Templates[_rng.Next(chosen.Templates.Count)];
            var phrase = RenderTemplate(template, stats, value, chosen.Field);
            var ratio = value / chosen.Threshold;

            result.Add((chosen.Source.ToLowerInvariant(), ratio, phrase));
        }

        return result;
    }

    private static string RenderTemplate(string template, LifeStats stats, double value, string field)
    {
        return template
            .Replace("{value}", FormatValue(value, field))
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
        ((long)value).ToString("N0");

    private static string ToItalianDay(int? dayOfWeek) =>
        dayOfWeek switch
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

    private static string FormatTopUsers(List<string>? users)
    {
        if (users == null || users.Count == 0) return "nessuno in particolare";
        return string.Join(", ", users.Take(3));
    }

    private static string FormatDate(DateTime? date) =>
        date?.ToString("dd/MM/yyyy") ?? "data non disponibile";
}