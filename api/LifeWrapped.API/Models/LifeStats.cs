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