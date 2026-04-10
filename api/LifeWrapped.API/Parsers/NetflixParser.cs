using CsvHelper;
using CsvHelper.Configuration;
using LifeWrapped.API.Models;
using System.Globalization;

namespace LifeWrapped.API.Parsers;

public class NetflixParser : IDataParser
{
    public Task<LifeStats> ParseAsync(Stream input)
    {
        var config = new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            HasHeaderRecord = true,
            MissingFieldFound = null,
            BadDataFound = null
        };

        using var reader = new StreamReader(input, leaveOpen: true);
        using var csv = new CsvReader(reader, config);

        double totalHours = 0;
        var seriesCounts = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
        var hourCounts = new int[24];

        csv.Read();
        csv.ReadHeader();

        while (csv.Read())
        {
            var durationStr = csv.TryGetField<string>("Duration", out var dur) ? dur : null;
            var startTimeStr = csv.TryGetField<string>("Start Time", out var st) ? st : null;
            var title = csv.TryGetField<string>("Title", out var t) ? t : null;

            if (!string.IsNullOrEmpty(durationStr) && TryParseDuration(durationStr, out var hours))
                totalHours += hours;

            if (!string.IsNullOrEmpty(startTimeStr) &&
                DateTime.TryParse(startTimeStr, out var startDt))
            {
                hourCounts[startDt.Hour]++;
            }

            if (!string.IsNullOrEmpty(title))
            {
                var seriesName = NormalizeTitle(title);
                seriesCounts[seriesName] = seriesCounts.GetValueOrDefault(seriesName) + 1;
            }
        }

        var topSeries = seriesCounts.Count > 0 ? seriesCounts.MaxBy(x => x.Value).Key : null;
        var peakHour = Array.IndexOf(hourCounts, hourCounts.Max());

        return Task.FromResult(new LifeStats
        {
            HoursWatched = Math.Round(totalHours, 1),
            TopSeries = topSeries,
            PeakHourNetflix = peakHour
        });
    }

    private static bool TryParseDuration(string duration, out double hours)
    {
        hours = 0;
        var parts = duration.Split(':');
        if (parts.Length != 3) return false;
        if (!int.TryParse(parts[0], out var h) ||
            !int.TryParse(parts[1], out var m) ||
            !int.TryParse(parts[2], out var s)) return false;
        hours = h + m / 60.0 + s / 3600.0;
        return true;
    }

    private static string NormalizeTitle(string title)
    {
        var separators = new[] { ": Season", ": Stagione", ": Episode", " - Season", " Season " };
        foreach (var sep in separators)
        {
            var idx = title.IndexOf(sep, StringComparison.OrdinalIgnoreCase);
            if (idx > 0) return title[..idx].Trim();
        }
        return title.Trim();
    }
}