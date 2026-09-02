import { NextResponse } from "next/server";
import { getData, type CPProfileRecord } from "@/lib/data";

export const dynamic = "force-dynamic";

type CPPlatformPayload = {
  platform: string;
  headline: string;
  subheadline: string;
  value: string;
  accent: string;
  source: "tracked";
  profileUrl: string;
  solvedCount: number;
};

function getHeadline(record: CPProfileRecord) {
  const headline = typeof record.headline === "string" ? record.headline.trim() : "";
  const rank = typeof record.rank === "string" ? record.rank.trim() : "";
  const streak = typeof record.streak === "number" ? record.streak : 0;
  const solvedCount = typeof record.solvedCount === "number" ? record.solvedCount : 0;

  if (headline) {
    return headline;
  }

  if (rank) {
    return rank;
  }

  if (streak > 0) {
    return `${streak}-day streak`;
  }

  if (solvedCount > 0) {
    return `${solvedCount} solved`;
  }

  return "Profile active";
}

function getSubheadline(record: CPProfileRecord) {
  const summary = typeof record.summary === "string" ? record.summary.trim() : "";
  const maxRating = typeof record.maxRating === "number" ? record.maxRating : 0;
  const username = typeof record.username === "string" ? record.username.trim() : "";

  if (summary) {
    return summary;
  }

  if (maxRating > 0) {
    return `Max rating ${maxRating}`;
  }

  if (username) {
    return `Handle: ${username}`;
  }

  return "Profile summary pending.";
}

function getValue(record: CPProfileRecord) {
  const rating = typeof record.rating === "number" ? record.rating : 0;
  const maxRating = typeof record.maxRating === "number" ? record.maxRating : 0;
  const solvedCount = typeof record.solvedCount === "number" ? record.solvedCount : 0;

  if (rating > 0) {
    return String(rating);
  }

  if (maxRating > 0) {
    return String(maxRating);
  }

  return String(solvedCount);
}

export async function GET() {
  try {
    const records = await getData("cpProfile");

    const platforms: CPPlatformPayload[] = records
      .filter((p) => p.isVisible !== false)
      .map((record) => ({
        platform: record.platform || "Platform",
        headline: getHeadline(record),
        subheadline: getSubheadline(record),
        value: getValue(record),
        accent:
          typeof record.accent === "string" && record.accent.trim()
            ? record.accent
            : "from-cyan-300/35 to-sky-500/10",
        source: "tracked",
        profileUrl: record.profileUrl || record.url || "",
        solvedCount: record.solvedCount || 0,
      }));

    const latestSync = records.reduce<string | null>((currentLatest, record) => {
      const candidates = [record.lastSyncedAt, record.updatedAt].filter(
        (value): value is string => Boolean(value && typeof value === "string")
      );

      if (candidates.length === 0) {
        return currentLatest;
      }

      const nextLatest = candidates.sort().at(-1) || null;

      if (!currentLatest) {
        return nextLatest;
      }

      return nextLatest && nextLatest > currentLatest ? nextLatest : currentLatest;
    }, null);

    return NextResponse.json({
      syncedAt: latestSync,
      summary: {
        totalSolved: platforms.reduce((sum, platform) => sum + platform.solvedCount, 0),
        activePlatforms: platforms.length,
      },
      platforms,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load competitive profiles.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
