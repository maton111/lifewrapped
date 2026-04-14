import { ImageResponse } from "next/og";
import { getWrapped } from "../../lib/api";
import type { LifeStats } from "../../lib/types";

export const runtime = "edge";
export const alt = "LifeWrapped 2026";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ token: string }>;
}

function getTopStats(
  sources: string[],
  stats: LifeStats
): { label: string; value: string; color: string }[] {
  const result = [];
  const COLORS: Record<string, string> = {
    spotify: "#1db954",
    netflix: "#e50914",
    steam: "#c7d5e0",
    google: "#4285f4",
    instagram: "#e1306c",
  };

  for (const source of sources.slice(0, 3)) {
    const color = COLORS[source] ?? "#cc97ff";
    switch (source) {
      case "spotify":
        if (stats.msPlayed)
          result.push({ label: "Spotify", value: `${Math.round(stats.msPlayed / 60000).toLocaleString()}m`, color });
        break;
      case "netflix":
        if (stats.hoursWatched)
          result.push({ label: "Netflix", value: `${Math.round(stats.hoursWatched)}h`, color });
        break;
      case "steam":
        if (stats.totalSteamHours)
          result.push({ label: "Steam", value: `${Math.round(stats.totalSteamHours)}h`, color });
        break;
      case "google":
        if (stats.totalSearches)
          result.push({ label: "Google", value: stats.totalSearches.toLocaleString(), color });
        break;
      case "instagram":
        if (stats.totalLikes)
          result.push({ label: "Instagram", value: stats.totalLikes.toLocaleString(), color });
        break;
    }
  }

  return result;
}

export default async function OGImage({ params }: Props) {
  const { token } = await params;

  let topStats: { label: string; value: string; color: string }[] = [];
  let phrase = "Il mio anno in dati.";

  try {
    const result = await getWrapped(token);
    topStats = getTopStats(result.sources, result.stats);
    phrase = result.phrases[0]?.text ?? phrase;
  } catch {
    // render fallback
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          backgroundColor: "#0a0a0a",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: "#ffffff",
              textTransform: "uppercase",
              letterSpacing: "-0.05em",
            }}
          >
            LifeWrapped
          </div>
          <div
            style={{
              padding: "8px 20px",
              backgroundColor: "rgba(204,151,255,0.1)",
              color: "#cc97ff",
              border: "1px solid rgba(204,151,255,0.2)",
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            2026 ARCHIVE
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 60 }}>
          {topStats.map((stat) => (
            <div key={stat.label} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div
                style={{
                  fontSize: 12,
                  color: stat.color,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  fontWeight: 700,
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontSize: 80,
                  fontWeight: 800,
                  color: "#ffffff",
                  letterSpacing: "-0.05em",
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: 24,
          }}
        >
          <div
            style={{
              fontSize: 18,
              color: "#adaaaa",
              fontStyle: "italic",
              maxWidth: 700,
              lineHeight: 1.5,
            }}
          >
            {phrase.length > 80 ? phrase.slice(0, 80) + "…" : phrase}
          </div>
          <div
            style={{
              fontSize: 14,
              color: "#adaaaa",
              letterSpacing: "0.05em",
            }}
          >
            lifewrapped.io
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}