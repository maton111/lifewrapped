using System.IO.Compression;
using System.Text.Json;
using LifeWrapped.API.Models;

namespace LifeWrapped.API.Parsers;

public class InstagramParser : IDataParser
{
    private readonly string _username;

    public InstagramParser(string username = "")
    {
        _username = username;
    }

    public async Task<LifeStats> ParseAsync(Stream input)
    {
        using var zip = new ZipArchive(input, ZipArchiveMode.Read, leaveOpen: true);

        var totalDMs = 0;
        var totalLikes = 0;
        var hourCounts = new int[24];
        var dayOfWeekCounts = new int[7];

        foreach (var entry in zip.Entries)
        {
            if (entry.FullName.Contains("messages/") && entry.Name.EndsWith(".json"))
            {
                using var stream = entry.Open();
                var doc = await JsonSerializer.DeserializeAsync<JsonElement>(stream);

                if (doc.TryGetProperty("messages", out var messages))
                {
                    foreach (var msg in messages.EnumerateArray())
                    {
                        var sender = msg.TryGetProperty("sender_name", out var senderProp)
                            ? senderProp.GetString() ?? ""
                            : "";

                        if (!string.IsNullOrEmpty(_username) &&
                            sender.Equals(_username, StringComparison.OrdinalIgnoreCase))
                            totalDMs++;
                        else if (string.IsNullOrEmpty(_username))
                            totalDMs++;

                        if (msg.TryGetProperty("timestamp_ms", out var tsProp))
                        {
                            var ts = tsProp.GetInt64();
                            var dt = DateTimeOffset.FromUnixTimeMilliseconds(ts).LocalDateTime;
                            hourCounts[dt.Hour]++;
                            dayOfWeekCounts[(int)dt.DayOfWeek]++;
                        }
                    }
                }
            }

            if (entry.Name == "liked_posts.json")
            {
                using var stream = entry.Open();
                var doc = await JsonSerializer.DeserializeAsync<JsonElement>(stream);

                if (doc.TryGetProperty("likes_media_likes", out var likes))
                    totalLikes += likes.GetArrayLength();
            }
        }

        var peakHour = Array.IndexOf(hourCounts, hourCounts.Max());
        var peakDay = Array.IndexOf(dayOfWeekCounts, dayOfWeekCounts.Max());

        return new LifeStats
        {
            TotalDMs = totalDMs,
            TotalLikes = totalLikes,
            PeakHourInstagram = peakHour,
            PeakDayOfWeek = peakDay
        };
    }
}