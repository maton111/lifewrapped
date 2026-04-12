import type { LifeStats, SourceCardView, SourceStatView } from "./types";

interface MetricDescriptor {
  key: string;
  label: string;
  format?: (value: string | number) => string;
}

const PLATFORM_META: Record<string, { label: string; color: string; icon: string }> = {
  google: { label: "Google", color: "#4285f4", icon: "search" },
  instagram: { label: "Instagram", color: "#e1306c", icon: "photo_camera" },
  spotify: { label: "Spotify", color: "#1db954", icon: "music_note" },
  netflix: { label: "Netflix", color: "#e50914", icon: "tv" },
  steam: { label: "Steam", color: "#c7d5e0", icon: "sports_esports" },
};

const METRICS_BY_SOURCE: Record<string, MetricDescriptor[]> = {
  google: [
    { key: "totalSearches", label: "Ricerche Totali", format: formatNumber },
    { key: "peakHour", label: "Ora di Picco", format: formatHour },
    { key: "topSearchTopic", label: "Topic Top" },
    { key: "youTubeViews", label: "Visualizzazioni YouTube", format: formatNumber },
  ],
  instagram: [
    { key: "totalDMs", label: "DM Totali", format: formatNumber },
    { key: "totalLikes", label: "Like Totali", format: formatNumber },
    { key: "peakDayOfWeek", label: "Giorno di Picco", format: formatWeekday },
    { key: "peakHourInstagram", label: "Ora di Picco", format: formatHour },
  ],
  spotify: [
    { key: "msPlayed", label: "Minuti Ascoltati", format: formatMillisecondsToMinutes },
    { key: "topArtist", label: "Artista Top" },
    { key: "nightMsPlayed", label: "Minuti Notturni", format: formatMillisecondsToMinutes },
  ],
  netflix: [
    { key: "hoursWatched", label: "Ore Guardate", format: formatRoundedNumber },
    { key: "topSeries", label: "Serie Top" },
    { key: "peakHourNetflix", label: "Ora di Picco", format: formatHour },
  ],
  steam: [
    { key: "totalSteamHours", label: "Ore Totali", format: formatRoundedNumber },
    { key: "topGame", label: "Gioco Top" },
    { key: "topGameHours", label: "Ore sul Gioco Top", format: formatRoundedNumber },
  ],
};

export const PLATFORM_COLORS: Record<string, string> = Object.fromEntries(
  Object.entries(PLATFORM_META).map(([key, meta]) => [key, meta.color])
);

export const PLATFORM_ICONS: Record<string, string> = Object.fromEntries(
  Object.entries(PLATFORM_META).map(([key, meta]) => [key, meta.icon])
);

export function mapSourceCards(sources: string[], stats: LifeStats, phrases: string[]): SourceCardView[] {
  const resolvedSources = resolveDisplaySources(sources, stats);
  const globalPhrase = resolveGlobalPhrase(phrases);

  return resolvedSources.map((source) => {
    const sourceMetrics = METRICS_BY_SOURCE[source] ?? [];
    const mappedStats = sourceMetrics.map((metric) => mapMetric(metric, stats[metric.key]));

    return {
      source,
      sourceLabel: PLATFORM_META[source]?.label ?? capitalize(source),
      sourceColor: PLATFORM_META[source]?.color ?? "#cc97ff",
      sourceIcon: PLATFORM_META[source]?.icon ?? "analytics",
      phrase: globalPhrase,
      stats: mappedStats,
    };
  });
}

function mapMetric(metric: MetricDescriptor, rawValue: LifeStats[string]): SourceStatView {
  const isMissing = rawValue == null;
  if (isMissing) {
    return { key: metric.key, label: metric.label, value: "Non disponibile", isMissing: true };
  }

  const formatted = metric.format ? metric.format(rawValue) : String(rawValue);
  return { key: metric.key, label: metric.label, value: formatted, isMissing: false };
}

function dedupeSources(sources: string[]): string[] {
  return [...new Set(sources.map(normalizeSource).filter(Boolean))];
}

function resolveDisplaySources(sources: string[], stats: LifeStats): string[] {
  const explicitSources = dedupeSources(sources);
  const inferredSources = inferSourcesFromStats(stats);
  return dedupeSources([...explicitSources, ...inferredSources]);
}

function inferSourcesFromStats(stats: LifeStats): string[] {
  const inferred: string[] = [];

  for (const [source, metrics] of Object.entries(METRICS_BY_SOURCE)) {
    const hasAnyValue = metrics.some((metric) => stats[metric.key] != null);
    if (hasAnyValue) inferred.push(source);
  }

  return inferred;
}

function resolveGlobalPhrase(phrases: string[]): string {
  const firstValid = phrases.find((phrase) => phrase.trim().length > 0);
  return firstValid ?? "Il tuo anno in dati.";
}

function normalizeSource(source: string): string {
  return source.trim().toLowerCase();
}

function formatNumber(value: string | number): string {
  if (typeof value !== "number") return String(value);
  return value.toLocaleString("it-IT");
}

function formatRoundedNumber(value: string | number): string {
  if (typeof value !== "number") return String(value);
  return Math.round(value).toLocaleString("it-IT");
}

function formatMillisecondsToMinutes(value: string | number): string {
  if (typeof value !== "number") return String(value);
  return Math.round(value / 60000).toLocaleString("it-IT");
}

function formatHour(value: string | number): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return String(value);
  const hour = ((Math.floor(value) % 24) + 24) % 24;
  return `${hour.toString().padStart(2, "0")}:00`;
}

function formatWeekday(value: string | number): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return String(value);
  const days = ["Domenica", "Lunedi", "Martedi", "Mercoledi", "Giovedi", "Venerdi", "Sabato"];
  const normalized = ((Math.floor(value) % 7) + 7) % 7;
  return days[normalized] ?? String(value);
}

function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

