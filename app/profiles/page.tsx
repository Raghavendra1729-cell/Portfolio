import type { Metadata } from "next";
import Profiles from "@/components/home/Profiles";
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
      <Profiles
        profiles={profiles}
        eyebrow="All profiles"
        heading="Pick a platform."
        description="GitHub for the code, LeetCode and Codeforces for the problem solving, and the rest to connect."
      />
    </PageShell>
  );
}
