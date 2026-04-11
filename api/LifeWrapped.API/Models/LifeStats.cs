namespace LifeWrapped.API.Models;

public class LifeStats
{
    // Google
    public int? TotalSearches { get; set; }
    public int? PeakHour { get; set; }
    public string? TopSearchTopic { get; set; }
    public int? YouTubeViews { get; set; }

    // Instagram
    public int? TotalDMs { get; set; }
    public int? TotalLikes { get; set; }
    public int? PeakDayOfWeek { get; set; }
    public int? PeakHourInstagram { get; set; }
    public int? PeakDayInstagramInteractions { get; set; }
    public int? PeakHourInstagramInteractions { get; set; }
    public int? TotalStories { get; set; }
    public int? TotalReposts { get; set; }
    public int? TotalStoryLikes { get; set; }
    public List<string>? InstagramInterestingUsers { get; set; }
    public DateTime? InstagramRangeStartUtc { get; set; }
    public DateTime? InstagramRangeEndUtc { get; set; }
    public int? InstagramRangeMonths { get; set; }
    public DateTime? InstagramLikesRangeStartUtc { get; set; }
    public DateTime? InstagramLikesRangeEndUtc { get; set; }
    public int? InstagramLikesRangeMonths { get; set; }

    // Spotify
    public long? MsPlayed { get; set; }
    public string? TopArtist { get; set; }
    public long? NightMsPlayed { get; set; }

    // Netflix
    public double? HoursWatched { get; set; }
    public string? TopSeries { get; set; }
    public int? PeakHourNetflix { get; set; }

    // Steam
    public double? TotalSteamHours { get; set; }
    public string? TopGame { get; set; }
    public double? TopGameHours { get; set; }
}