import type { CPProfileRecord, SocialLink } from "@/lib/data";

/**
 * A unified "Profiles" model. Merges coding platforms (the cpProfile collection)
 * with developer/social links into one list, so every profile — GitHub,
 * LeetCode, Codeforces, CodeChef, LinkedIn — lives in one place instead of a
 * competitive-programming-only section. Both sources stay editable in /admin.
 */
export type UnifiedProfile = {
  key: string;
  name: string;
  handle: string;
  url: string;
  blurb: string;
  stats: { label: string; value: string }[];
  tier: string; // CSS color var driving the card accent
  slug: ProfileSlug; // drives the icon in the component
};

export type ProfileSlug =
  | "github"
  | "leetcode"
  | "codeforces"
  | "codechef"
  | "linkedin"
  | "website"
  | "link";

type Style = { tier: string; slug: ProfileSlug; priority: number };

function styleFor(label: string): Style {
  const n = label.toLowerCase();
  if (n.includes("github")) return { tier: "var(--paper, #e8edf4)", slug: "github", priority: 0 };
  if (n.includes("leetcode")) return { tier: "var(--tier-master)", slug: "leetcode", priority: 1 };
  if (n.includes("codeforces")) return { tier: "var(--tier-expert)", slug: "codeforces", priority: 2 };
  if (n.includes("codechef")) return { tier: "var(--tier-candidate)", slug: "codechef", priority: 3 };
  if (n.includes("linkedin")) return { tier: "var(--tier-specialist)", slug: "linkedin", priority: 6 };
  if (n.includes("http") || n.includes("site") || n.includes("web"))
    return { tier: "var(--tier-pupil)", slug: "website", priority: 7 };
  return { tier: "var(--tier-newbie)", slug: "link", priority: 5 };
}

function cpStats(p: CPProfileRecord): { label: string; value: string }[] {
  if (p.badges?.length) {
    return p.badges.slice(0, 3).map((b) => ({ label: b.label, value: String(b.value) }));
  }
  const stats: { label: string; value: string }[] = [];
  if (p.rank) stats.push({ label: "Rank", value: p.rank });
  if (p.rating) stats.push({ label: "Rating", value: String(p.rating) });
  if (p.solvedCount) stats.push({ label: "Solved", value: `${p.solvedCount}+` });
  return stats;
}

export function buildProfiles(
  cpProfiles: CPProfileRecord[],
  socialLinks: SocialLink[],
): UnifiedProfile[] {
  const seen = new Set<string>();
  const out: Array<UnifiedProfile & { priority: number }> = [];

  for (const p of cpProfiles) {
    if (p.isVisible === false || !p.platform) continue;
    const style = styleFor(p.platform);
    seen.add(style.slug);
    out.push({
      key: p._id,
      name: p.platform,
      handle: p.username || "",
      url: p.profileUrl || "",
      blurb: p.headline || p.summary || "",
      stats: cpStats(p),
      tier: style.tier,
      slug: style.slug,
      priority: style.priority,
    });
  }

  for (const link of socialLinks) {
    if (link.kind === "email" || link.kind === "other") continue;
    const style = styleFor(`${link.label} ${link.kind} ${link.href}`);
    if (seen.has(style.slug)) continue;
    seen.add(style.slug);
    out.push({
      key: `social-${link.kind}-${link.value}`,
      name: link.label,
      handle: link.value || "",
      url: link.href || "",
      blurb: "",
      stats: [],
      tier: style.tier,
      slug: style.slug,
      priority: style.priority,
    });
  }

  return out
    .sort((a, b) => a.priority - b.priority)
    .map((item) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { priority, ...rest } = item;
      return rest;
    });
}
