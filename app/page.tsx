export const dynamic = "force-dynamic";

import Hero from "@/components/home/Hero";
import DiabloConsole from "@/components/home/DiabloConsole";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import Profiles from "@/components/home/Profiles";
import RatingCurve from "@/components/home/RatingCurve";
import FeaturedAchievements from "@/components/home/FeaturedAchievements";
import FeaturedHighlights from "@/components/home/FeaturedHighlights";
import HomeExplore from "@/components/home/HomeExplore";
import HomeContact from "@/components/home/HomeContact";
import PageShell from "@/components/layout/PageShell";
import { getSiteSettings, getLandingPage, getFeaturedData, getData } from "@/lib/data";
import { getHomePageMetadata } from "@/lib/metadata";
import { buildProfiles } from "@/lib/profiles";

export async function generateMetadata() {
  return getHomePageMetadata();
}

export default async function Home() {
  const [siteSettings, landingPage, featuredProjects, featuredAchievements, cpProfiles] =
    await Promise.all([
      getSiteSettings(),
      getLandingPage(),
      getFeaturedData("project", 3),
      getFeaturedData("achievement", 4),
      getData("cpProfile"),
    ]);

  const profiles = buildProfiles(cpProfiles, siteSettings.socialLinks);

  return (
    <PageShell className="pt-8">
      <div className="mx-auto max-w-7xl space-y-24">
        <Hero siteSettings={siteSettings} landingPage={landingPage} />

        <DiabloConsole />

        <FeaturedProjects landingPage={landingPage} projects={featuredProjects} />

        <div className="space-y-8">
          <Profiles
            profiles={profiles}
            eyebrow={landingPage.profilesEyebrow}
            heading={landingPage.profilesTitle}
            description={landingPage.profilesDescription}
          />
          <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,1fr)]">
            <RatingCurve />
            <FeaturedHighlights cards={landingPage.highlightCards} />
          </div>
        </div>

        <FeaturedAchievements
          landingPage={landingPage}
          achievements={featuredAchievements}
        />

        <HomeExplore landingPage={landingPage} />

        <HomeContact landingPage={landingPage} siteSettings={siteSettings} />
      </div>
    </PageShell>
  );
}
