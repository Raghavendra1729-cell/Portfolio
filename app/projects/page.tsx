import { RevealSection } from "@/components/Reveal";
import Projects from "@/components/Projects";
import PageShell from "@/components/layout/PageShell";
import { getData } from "@/lib/data";
import { getSitePageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return getSitePageMetadata("projects");
}

export default async function ProjectsPage() {
  const projects = await getData("project");

  return (
    <PageShell>
      <Projects data={projects} />
    </PageShell>
  );
}
