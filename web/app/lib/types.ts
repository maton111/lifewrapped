export interface LifeStats {
  // Google
  totalSearches?: number | null;
  peakHour?: number | null;
  topSearchTopic?: string | null;
  youTubeViews?: number | null;

  // Instagram
  totalDMs?: number | null;
  totalLikes?: number | null;
  peakDayOfWeek?: number | null;
  peakHourInstagram?: number | null;

  // Spotify
  msPlayed?: number | null;
  topArtist?: string | null;
  nightMsPlayed?: number | null;

  // Netflix
  hoursWatched?: number | null;
  topSeries?: string | null;
  peakHourNetflix?: number | null;

  // Steam
  totalSteamHours?: number | null;
  topGame?: string | null;
  topGameHours?: number | null;

  // Keep unknown backend metrics to avoid losing data in UI mapping.
  [key: string]: string | number | null | undefined;
}

export interface SourceStatView {
  key: string;
  label: string;
  value: string;
  isMissing: boolean;
}

export interface SourceCardView {
  source: string;
  sourceLabel: string;
  sourceColor: string;
  sourceIcon: string;
  phrase: string;
  stats: SourceStatView[];
}

export interface WrappedResult {
  id: string;
  token: string;
  stats: LifeStats;
  phrases: string[];
  sources: string[];
  createdAt: string;
}

export interface UploadResponse {
  stats: LifeStats;
  phrases: string[];
  sources: string[];
}

export interface SaveWrappedResponse {
  token: string;
}

export interface GlobalStats {
  totalWrapped: number;
  totalNetflixHours: number;
  totalSpotifyMinutes: number;
}

export type SourceKey = "google" | "instagram" | "spotify" | "netflix" | "steam";

export interface Platform {
  key: SourceKey;
  label: string;
  description: string;
  color: string;
  icon: string;
  inputHint: string;
  accept?: string;
  multiple?: boolean;
  isTextInput?: boolean;
}

export const PLATFORMS: Platform[] = [
  {
    key: "google",
    label: "Google",
    description: "Search & Maps",
    color: "#4285f4",
    icon: "search",
    inputHint: "MyActivity.json",
    accept: ".json",
  },
  {
    key: "instagram",
    label: "Instagram",
    description: "Social Pulse",
    color: "#e1306c",
    icon: "photo_camera",
    inputHint: "export.zip",
    accept: ".zip",
  },
  {
    key: "spotify",
    label: "Spotify",
    description: "Audio Journey",
    color: "#1db954",
    icon: "music_note",
    inputHint: "StreamingHistory*.json",
    accept: ".json",
    multiple: true,
  },
  {
    key: "netflix",
    label: "Netflix",
    description: "Binge Stats",
    color: "#e50914",
    icon: "movie",
    inputHint: "ViewingActivity.csv",
    accept: ".csv",
  },
  {
    key: "steam",
    label: "Steam",
    description: "Gaming Life",
    color: "#c7d5e0",
    icon: "videogame_asset",
    inputHint: "Profile URL o Steam ID",
    isTextInput: true,
  },
];