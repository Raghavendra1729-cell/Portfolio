import { Fragment, type ReactNode } from "react";
import Hero from "@/components/home/Hero";
import DiabloConsole from "@/components/home/DiabloConsole";
import PageShell from "@/components/layout/PageShell";
import { getSiteSettings, getLandingPage } from "@/lib/data";
import { getHomePageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return getHomePageMetadata();
}

export default async function Home() {
  const [siteSettings, landingPage] = await Promise.all([
    getSiteSettings(),
    getLandingPage(),
  ]);

  return (
    <PageShell className="pt-8">
      <section className="mx-auto max-w-7xl space-y-18">
        <Hero siteSettings={siteSettings} landingPage={landingPage} />
        
        <DiabloConsole />
      </section>
    </PageShell>
  );
}
