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
        var totalStories = 0;
        var totalReposts = 0;
        var totalStoryLikes = 0;
        var hourCounts = new int[24];
        var dayOfWeekCounts = new int[7];
        var userMentions = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);

        DateTimeOffset? igMin = null;
        DateTimeOffset? igMax = null;
        DateTimeOffset? likesMin = null;
        DateTimeOffset? likesMax = null;

        foreach (var entry in zip.Entries)
        {
            if (entry.FullName.Contains("messages/inbox/") && entry.Name.EndsWith(".json"))
            {
                using var stream = entry.Open();
                var doc = await JsonSerializer.DeserializeAsync<JsonElement>(stream);

                if (doc.ValueKind is JsonValueKind.Undefined or JsonValueKind.Null)
                    continue;

                CollectTimestampRange(doc, ref igMin, ref igMax);

                var messages = doc.ValueKind == JsonValueKind.Array
                    ? doc
                    : doc.TryGetProperty("messages", out var msgProp) ? msgProp : (JsonElement?)null;

                if (messages is JsonElement messagesArray && messagesArray.ValueKind == JsonValueKind.Array)
                {
                    foreach (var msg in messagesArray.EnumerateArray())
                    {
                        var sender = msg.TryGetProperty("sender_name", out var senderProp)
                            ? senderProp.GetString() ?? ""
                            : "";

                        if (string.IsNullOrEmpty(_username) ||
                            sender.Equals(_username, StringComparison.OrdinalIgnoreCase))
                            totalDMs++;

                        if (msg.TryGetProperty("timestamp_ms", out var tsProp) &&
                            tsProp.ValueKind == JsonValueKind.Number &&
                            tsProp.TryGetInt64(out var ts))
                        {
                            var dt = DateTimeOffset.FromUnixTimeMilliseconds(ts).LocalDateTime;
                            hourCounts[dt.Hour]++;
                            dayOfWeekCounts[(int)dt.DayOfWeek]++;
                        }
                    }
                }
            }

            if (entry.FullName.Contains("likes/liked_posts.json"))
            {
                using var stream = entry.Open();
                var doc = await JsonSerializer.DeserializeAsync<JsonElement>(stream);

                if (doc.ValueKind is JsonValueKind.Undefined or JsonValueKind.Null)
                    continue;

                CollectTimestampRange(doc, ref igMin, ref igMax);
                CollectTimestampRange(doc, ref likesMin, ref likesMax);

                totalLikes += doc.ValueKind == JsonValueKind.Array
                    ? doc.GetArrayLength()
                    : doc.TryGetProperty("likes_media_likes", out var likes) && likes.ValueKind == JsonValueKind.Array
                        ? likes.GetArrayLength()
                        : 0;
            }

            if (entry.FullName.Contains("likes/liked_comments.json"))
            {
                using var stream = entry.Open();
                var doc = await JsonSerializer.DeserializeAsync<JsonElement>(stream);

                if (doc.ValueKind is JsonValueKind.Undefined or JsonValueKind.Null)
                    continue;

                CollectTimestampRange(doc, ref igMin, ref igMax);
                CollectTimestampRange(doc, ref likesMin, ref likesMax);

                totalLikes += doc.ValueKind == JsonValueKind.Array
                    ? doc.GetArrayLength()
                    : doc.TryGetProperty("likes_comments_likes", out var likes) && likes.ValueKind == JsonValueKind.Array
                        ? likes.GetArrayLength()
                        : 0;
            }

            if (entry.FullName.Contains("media/stories.json"))
            {
                using var stream = entry.Open();
                var doc = await JsonSerializer.DeserializeAsync<JsonElement>(stream);

                if (doc.ValueKind is JsonValueKind.Undefined or JsonValueKind.Null)
                    continue;

                CollectTimestampRange(doc, ref igMin, ref igMax);

                totalStories += CountInstagramItems(doc, "ig_stories");
                AccumulateInterestingUsers(doc, userMentions);
            }

            if (entry.FullName.Contains("media/reposts.json"))
            {
                using var stream = entry.Open();
                var doc = await JsonSerializer.DeserializeAsync<JsonElement>(stream);

                if (doc.ValueKind is JsonValueKind.Undefined or JsonValueKind.Null)
                    continue;

                CollectTimestampRange(doc, ref igMin, ref igMax);

                totalReposts += CountInstagramItems(doc, "ig_reposts");
                AccumulateInterestingUsers(doc, userMentions);
            }

            if (entry.FullName.Contains("story_interactions/story_likes.json"))
            {
                using var stream = entry.Open();
                var doc = await JsonSerializer.DeserializeAsync<JsonElement>(stream);

                if (doc.ValueKind is JsonValueKind.Undefined or JsonValueKind.Null)
                    continue;

                CollectTimestampRange(doc, ref igMin, ref igMax);
                CollectTimestampRange(doc, ref likesMin, ref likesMax);

                totalStoryLikes += CountInstagramItems(doc, "story_activities_story_likes");
                AccumulateInterestingUsers(doc, userMentions);
            }
        }

        var peakHour = Array.IndexOf(hourCounts, hourCounts.Max());
        var peakDay = Array.IndexOf(dayOfWeekCounts, dayOfWeekCounts.Max());
        var peakHourInteractions = hourCounts[peakHour];
        var peakDayInteractions = dayOfWeekCounts[peakDay];

        var interestingUsers = userMentions
            .OrderByDescending(x => x.Value)
            .ThenBy(x => x.Key)
            .Take(10)
            .Select(x => x.Key)
            .ToList();

        return new LifeStats
        {
            TotalDMs = totalDMs,
            TotalLikes = totalLikes,
            PeakHourInstagram = peakHour,
            PeakDayOfWeek = peakDay,
            PeakHourInstagramInteractions = peakHourInteractions,
            PeakDayInstagramInteractions = peakDayInteractions,
            TotalStories = totalStories,
            TotalReposts = totalReposts,
            TotalStoryLikes = totalStoryLikes,
            InstagramInterestingUsers = interestingUsers,
            InstagramRangeStartUtc = igMin?.UtcDateTime,
            InstagramRangeEndUtc = igMax?.UtcDateTime,
            InstagramRangeMonths = GetRangeMonths(igMin, igMax),
            InstagramLikesRangeStartUtc = likesMin?.UtcDateTime,
            InstagramLikesRangeEndUtc = likesMax?.UtcDateTime,
            InstagramLikesRangeMonths = GetRangeMonths(likesMin, likesMax)
        };
    }

    private static int CountInstagramItems(JsonElement doc, string rootProperty)
    {
        if (doc.ValueKind == JsonValueKind.Array)
            return doc.GetArrayLength();

        if (doc.ValueKind == JsonValueKind.Object &&
            doc.TryGetProperty(rootProperty, out var arr) &&
            arr.ValueKind == JsonValueKind.Array)
            return arr.GetArrayLength();

        return 0;
    }

    private static int? GetRangeMonths(DateTimeOffset? min, DateTimeOffset? max)
    {
        if (!min.HasValue || !max.HasValue)
            return null;

        var months = (max.Value.Year - min.Value.Year) * 12 + max.Value.Month - min.Value.Month + 1;
        return Math.Max(1, months);
    }

    private static void CollectTimestampRange(JsonElement root, ref DateTimeOffset? min, ref DateTimeOffset? max)
    {
        switch (root.ValueKind)
        {
            case JsonValueKind.Object:
                foreach (var prop in root.EnumerateObject())
                {
                    if (prop.Name.Contains("timestamp", StringComparison.OrdinalIgnoreCase) &&
                        TryReadUnixTimestamp(prop.Value, out var ts))
                    {
                        if (!min.HasValue || ts < min.Value) min = ts;
                        if (!max.HasValue || ts > max.Value) max = ts;
                    }

                    CollectTimestampRange(prop.Value, ref min, ref max);
                }
                break;
            case JsonValueKind.Array:
                foreach (var item in root.EnumerateArray())
                    CollectTimestampRange(item, ref min, ref max);
                break;
        }
    }

    private static bool TryReadUnixTimestamp(JsonElement element, out DateTimeOffset timestamp)
    {
        timestamp = default;

        long raw;
        if (element.ValueKind == JsonValueKind.Number)
        {
            if (!element.TryGetInt64(out raw))
                return false;
        }
        else if (element.ValueKind == JsonValueKind.String &&
                 long.TryParse(element.GetString(), out var parsed))
        {
            raw = parsed;
        }
        else
        {
            return false;
        }

        try
        {
            timestamp = raw >= 1_000_000_000_000
                ? DateTimeOffset.FromUnixTimeMilliseconds(raw)
                : DateTimeOffset.FromUnixTimeSeconds(raw);
            return true;
        }
        catch
        {
            return false;
        }
    }

    private static void AccumulateInterestingUsers(JsonElement root, Dictionary<string, int> userMentions)
    {
        switch (root.ValueKind)
        {
            case JsonValueKind.Object:
                foreach (var prop in root.EnumerateObject())
                    AccumulateInterestingUsers(prop.Value, userMentions);
                break;
            case JsonValueKind.Array:
                foreach (var item in root.EnumerateArray())
                    AccumulateInterestingUsers(item, userMentions);
                break;
            case JsonValueKind.String:
                var value = root.GetString();
                if (string.IsNullOrWhiteSpace(value))
                    return;

                if (TryExtractInstagramUser(value, out var user))
                {
                    if (userMentions.TryGetValue(user, out var current))
                        userMentions[user] = current + 1;
                    else
                        userMentions[user] = 1;
                }
                break;
        }
    }

    private static bool TryExtractInstagramUser(string input, out string user)
    {
        user = string.Empty;
        var value = input.Trim();

        if (value.StartsWith("@") && value.Length > 1)
        {
            user = value[1..].Trim();
            return user.Length > 0;
        }

        if (Uri.TryCreate(value, UriKind.Absolute, out var uri) &&
            (uri.Host.Contains("instagram.com", StringComparison.OrdinalIgnoreCase) ||
             uri.Host.Contains("instagr.am", StringComparison.OrdinalIgnoreCase)))
        {
            var segments = uri.AbsolutePath
                .Split('/', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

            if (segments.Length > 0)
            {
                user = segments[0];
                if (!string.IsNullOrWhiteSpace(user) &&
                    !user.Equals("stories", StringComparison.OrdinalIgnoreCase) &&
                    !user.Equals("p", StringComparison.OrdinalIgnoreCase) &&
                    !user.Equals("reel", StringComparison.OrdinalIgnoreCase))
                    return true;
            }
        }

        return false;
    }
}