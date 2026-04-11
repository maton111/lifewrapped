using LifeWrapped.API.Models;

namespace LifeWrapped.API.Services;

public class AggregatorService
{
    public LifeStats Merge(Dictionary<string, LifeStats> sourceStats)
    {
        var merged = new LifeStats();

        if (sourceStats.TryGetValue("google", out var google))
        {
            merged.TotalSearches = google.TotalSearches;
            merged.PeakHour = google.PeakHour;
            merged.TopSearchTopic = google.TopSearchTopic;
            merged.YouTubeViews = google.YouTubeViews;
        }

        if (sourceStats.TryGetValue("instagram", out var instagram))
        {
            merged.TotalDMs = instagram.TotalDMs;
            merged.TotalLikes = instagram.TotalLikes;
            merged.PeakDayOfWeek = instagram.PeakDayOfWeek;
            merged.PeakHourInstagram = instagram.PeakHourInstagram;
            merged.PeakDayInstagramInteractions = instagram.PeakDayInstagramInteractions;
            merged.PeakHourInstagramInteractions = instagram.PeakHourInstagramInteractions;
            merged.TotalStories = instagram.TotalStories;
            merged.TotalReposts = instagram.TotalReposts;
            merged.TotalStoryLikes = instagram.TotalStoryLikes;
            merged.InstagramInterestingUsers = instagram.InstagramInterestingUsers;
            merged.InstagramRangeStartUtc = instagram.InstagramRangeStartUtc;
            merged.InstagramRangeEndUtc = instagram.InstagramRangeEndUtc;
            merged.InstagramRangeMonths = instagram.InstagramRangeMonths;
            merged.InstagramLikesRangeStartUtc = instagram.InstagramLikesRangeStartUtc;
            merged.InstagramLikesRangeEndUtc = instagram.InstagramLikesRangeEndUtc;
            merged.InstagramLikesRangeMonths = instagram.InstagramLikesRangeMonths;
        }

        if (sourceStats.TryGetValue("spotify", out var spotify))
        {
            merged.MsPlayed = spotify.MsPlayed;
            merged.TopArtist = spotify.TopArtist;
            merged.NightMsPlayed = spotify.NightMsPlayed;
        }

        if (sourceStats.TryGetValue("netflix", out var netflix))
        {
            merged.HoursWatched = netflix.HoursWatched;
            merged.TopSeries = netflix.TopSeries;
            merged.PeakHourNetflix = netflix.PeakHourNetflix;
        }

        if (sourceStats.TryGetValue("steam", out var steam))
        {
            merged.TotalSteamHours = steam.TotalSteamHours;
            merged.TopGame = steam.TopGame;
            merged.TopGameHours = steam.TopGameHours;
        }

        return merged;
    }
}