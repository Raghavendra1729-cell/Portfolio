export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Profiles from "@/components/home/Profiles";
import RatingCurve from "@/components/home/RatingCurve";
import PageShell from "@/components/layout/PageShell";
import { getData, getSiteSettings, type CPProfileRecord } from "@/lib/data";
import { buildProfiles } from "@/lib/profiles";

export const metadata: Metadata = {
  title: "Profiles",
  description:
    "Every profile in one place — GitHub, LeetCode, Codeforces, CodeChef, and LinkedIn.",
};

export default async function ProfilesPage() {
  const [siteSettings, cpProfiles] = (await Promise.all([
    getSiteSettings(),
    getData("cpProfile"),
  ])) as [Awaited<ReturnType<typeof getSiteSettings>>, CPProfileRecord[]];

  const profiles = buildProfiles(cpProfiles, siteSettings.socialLinks);

  return (
    <PageShell>
      <div className="space-y-12">
        <Profiles
          profiles={profiles}
          eyebrow="All profiles"
          heading="Pick a platform."
          description="GitHub for the code, LeetCode and Codeforces for the problem solving, and the rest to connect."
        />
        <div className="mx-auto max-w-4xl">
          <RatingCurve />
        </div>
      </div>
    </PageShell>
  );
}
