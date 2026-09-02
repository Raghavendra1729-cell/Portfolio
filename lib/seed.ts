import dbConnect from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";
import LandingPage from "@/models/LandingPage";
import Project from "@/models/Project";
import Experience from "@/models/Experience";
import Education from "@/models/Education";
import Skill from "@/models/Skill";
import Achievement from "@/models/Achievement";
import CPProfile from "@/models/CPProfile";
import Hackathon from "@/models/Hackathon";
import {
  defaultProjects,
  defaultExperience,
  defaultEducation,
  defaultSkills,
  defaultAchievements,
  defaultCpProfiles,
  defaultHackathons,
} from "@/lib/data";
import { fallbackSiteSettings, fallbackLandingPage } from "@/lib/site-content";

export type SeedStep = {
  collection: string;
  label: string;
  action: "created" | "skipped";
  inserted: number;
  reason?: string;
};

export type SeedResult = {
  success: true;
  steps: SeedStep[];
  totals: {
    createdCollections: number;
    skippedCollections: number;
    insertedDocuments: number;
  };
};

export async function runPortfolioSeed(): Promise<SeedResult> {
  await dbConnect();

  const steps: SeedStep[] = [];
  let createdCollections = 0;
  let skippedCollections = 0;
  let insertedDocuments = 0;

  // 1. SiteSettings
  try {
    const existingSettings = await SiteSettings.findOne({ singletonKey: "site-settings" });
    if (!existingSettings || existingSettings.name === "Portfolio") {
      await SiteSettings.findOneAndUpdate(
        { singletonKey: "site-settings" },
        { ...fallbackSiteSettings, singletonKey: "site-settings" },
        { upsert: true, new: true }
      );
      steps.push({
        collection: "siteSettings",
        label: "Site Settings",
        action: "created",
        inserted: 1,
      });
      createdCollections++;
      insertedDocuments++;
    } else {
      steps.push({
        collection: "siteSettings",
        label: "Site Settings",
        action: "skipped",
        inserted: 0,
        reason: "Already configured with custom data",
      });
      skippedCollections++;
    }
  } catch (err) {
    console.error("Failed to seed SiteSettings", err);
  }

  // 2. LandingPage
  try {
    const existingLanding = await LandingPage.findOne({ singletonKey: "landing-page" });
    if (!existingLanding || existingLanding.heroTitle === "Portfolio") {
      await LandingPage.findOneAndUpdate(
        { singletonKey: "landing-page" },
        { ...fallbackLandingPage, singletonKey: "landing-page" },
        { upsert: true, new: true }
      );
      steps.push({
        collection: "landingPage",
        label: "Landing Page",
        action: "created",
        inserted: 1,
      });
      createdCollections++;
      insertedDocuments++;
    } else {
      steps.push({
        collection: "landingPage",
        label: "Landing Page",
        action: "skipped",
        inserted: 0,
        reason: "Already configured with custom data",
      });
      skippedCollections++;
    }
  } catch (err) {
    console.error("Failed to seed LandingPage", err);
  }

  // Helper for repeatable collections
  async function seedCollection(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    model: any,
    collectionKey: string,
    label: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: any[]
  ) {
    try {
      const count = await model.countDocuments();
      if (count === 0) {
        await model.insertMany(items);
        steps.push({
          collection: collectionKey,
          label,
          action: "created",
          inserted: items.length,
        });
        createdCollections++;
        insertedDocuments += items.length;
      } else {
        steps.push({
          collection: collectionKey,
          label,
          action: "skipped",
          inserted: 0,
          reason: `Collection already contains ${count} items`,
        });
        skippedCollections++;
      }
    } catch (err) {
      console.error(`Failed to seed ${label}`, err);
    }
  }

  await seedCollection(Project, "project", "Projects", defaultProjects);
  await seedCollection(Experience, "experience", "Experience", defaultExperience);
  await seedCollection(Education, "education", "Education", defaultEducation);
  await seedCollection(Skill, "skill", "Skills", defaultSkills);
  await seedCollection(Achievement, "achievement", "Achievements", defaultAchievements);
  await seedCollection(CPProfile, "cpProfile", "CP Profiles", defaultCpProfiles);
  await seedCollection(Hackathon, "hackathon", "Hackathons", defaultHackathons);

  return {
    success: true,
    steps,
    totals: {
      createdCollections,
      skippedCollections,
      insertedDocuments,
    },
  };
}
