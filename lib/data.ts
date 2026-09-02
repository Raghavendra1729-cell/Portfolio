import { cache } from "react";
import {
  getContentDocumentById,
  getSingletonContentDocument,
  listContentDocuments,
  listFeaturedContentDocuments,
} from "@/lib/content-service";
import {
  LANDING_HOME_SECTION_IDS,
  SITE_PAGE_KEYS,
  fallbackLandingPage,
  fallbackSiteSettings,
  type LandingFeaturedSection,
  type LandingHeroSignal,
  type LandingHomeSection,
  type LandingPageRecord,
  type NavigationItem,
  type PageIntro,
  type ResumeAlternateLink,
  type SiteMetadataConfig,
  type SiteSettingsRecord,
  type SocialLink,
} from "@/lib/site-content";

export type {
  LandingFeaturedSection,
  LandingHeroSignal,
  LandingHomeSection,
  LandingPageRecord,
  NavigationItem,
  PageIntro,
  ResumeAlternateLink,
  SiteMetadataConfig,
  SiteSettingsRecord,
  SocialLink,
} from "@/lib/site-content";

export type ContentLink = {
  name: string;
  url: string;
};

type BaseRecord = {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ProjectRecord = BaseRecord & {
  title: string;
  description: string;
  techStack: string[];
  links: ContentLink[];
  images: string[];
  featured: boolean;
  order?: number;
  startDate?: string;
  endDate?: string;
  link?: string;
  repo?: string;
};

export type ExperienceRecord = BaseRecord & {
  role: string;
  company: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description: string[];
  technologies: string[];
  logo?: string;
  attachments: string[];
  links: ContentLink[];
  order?: number;
};

export type EducationRecord = BaseRecord & {
  institution: string;
  degree: string;
  program?: string;
  status?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  grade?: string;
  gradeLabel?: string;
  gradeValue?: string;
  coursework: string[];
  highlights: string[];
  attachments: string[];
  order?: number;
};

export type SkillRecord = BaseRecord & {
  category: string;
  items: string[];
  proficiency?: Record<string, number>;
  focusSignals?: Record<string, string>;
  order?: number;
};

export type AchievementRecord = BaseRecord & {
  title: string;
  organization?: string;
  date?: string;
  description: string;
  featured: boolean;
  order?: number;
  images: string[];
  links: ContentLink[];
};

export type CPBadgeRecord = {
  label: string;
  value?: string;
};

export type CPProfileRecord = BaseRecord & {
  platform: string;
  name?: string;
  picture?: string;
  url?: string;
  username?: string;
  headline?: string;
  summary?: string;
  rating?: number;
  maxRating?: number;
  rank?: string;
  solvedCount: number;
  streak?: number;
  profileUrl?: string;
  badges: CPBadgeRecord[];
  accent?: string;
  dataSource?: string;
  lastSyncedAt?: string;
  order?: number;
  isVisible?: boolean;
  images: string[];
};

export type HackathonRecord = BaseRecord & {
  title: string;
  event?: string;
  organizer?: string;
  result?: string;
  date?: string;
  location?: string;
  description?: string;
  techStack: string[];
  teamSize?: number;
  featured?: boolean;
  order?: number;
  images: string[];
  links: ContentLink[];
};

export type CollectionMap = {
  siteSettings: SiteSettingsRecord;
  landingPage: LandingPageRecord;
  project: ProjectRecord;
  experience: ExperienceRecord;
  education: EducationRecord;
  skill: SkillRecord;
  achievement: AchievementRecord;
  cpProfile: CPProfileRecord;
  hackathon: HackathonRecord;
};

export type CollectionId = keyof CollectionMap;

type FeaturedCollectionId = "project" | "achievement";

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function asBoolean(value: unknown) {
  return value === true;
}

function asNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function asLinks(value: unknown): ContentLink[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const link = item as { name?: unknown; url?: unknown };
      const name = asString(link.name).trim();
      const url = asString(link.url).trim();

      if (!url) {
        return null;
      }

      return {
        name: name || "Reference",
        url,
      };
    })
    .filter((item): item is ContentLink => Boolean(item));
}

function asBadges(value: unknown): CPBadgeRecord[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.reduce<CPBadgeRecord[]>((badges, item) => {
    if (!item || typeof item !== "object") {
      return badges;
    }

    const badge = item as { label?: unknown; value?: unknown };
    const label = asString(badge.label).trim();

    if (!label) {
      return badges;
    }

    badges.push({
      label,
      value: asString(badge.value).trim(),
    });

    return badges;
  }, []);
}

function asResumeLinks(value: unknown): ResumeAlternateLink[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.reduce<ResumeAlternateLink[]>((links, item) => {
    if (!item || typeof item !== "object") {
      return links;
    }

    const link = item as { label?: unknown; href?: unknown };
    const href = asString(link.href).trim();

    if (!href) {
      return links;
    }

    links.push({
      label: asString(link.label).trim() || "Resume",
      href,
    });

    return links;
  }, []);
}

function asSocialLinks(value: unknown): SocialLink[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.reduce<SocialLink[]>((links, item) => {
    if (!item || typeof item !== "object") {
      return links;
    }

    const link = item as { kind?: unknown; label?: unknown; value?: unknown; href?: unknown };
    const href = asString(link.href).trim();

    if (!href) {
      return links;
    }

    links.push({
      kind: (asString(link.kind).trim() || "other") as SocialLink["kind"],
      label: asString(link.label).trim() || "Link",
      value: asString(link.value).trim(),
      href,
    });

    return links;
  }, []);
}

function asNavigationItems(value: unknown): NavigationItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.reduce<NavigationItem[]>((items, item) => {
    if (!item || typeof item !== "object") {
      return items;
    }

    const navigationItem = item as {
      label?: unknown;
      href?: unknown;
      enabled?: unknown;
    };
    const href = asString(navigationItem.href).trim();

    if (!href) {
      return items;
    }

    items.push({
      label: asString(navigationItem.label).trim() || "Link",
      href,
      enabled:
        !Object.prototype.hasOwnProperty.call(navigationItem, "enabled") ||
        navigationItem.enabled === true,
    });

    return items;
  }, []);
}

function asSiteMetadata(value: unknown): SiteMetadataConfig {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {
      description: fallbackSiteSettings.siteMetadata.description,
      keywords: fallbackSiteSettings.siteMetadata.keywords,
    };
  }

  const metadata = value as Record<string, unknown>;

  return {
    description: asString(metadata.description).trim() || fallbackSiteSettings.siteMetadata.description,
    keywords: Array.isArray(metadata.keywords)
      ? asStringArray(metadata.keywords)
      : fallbackSiteSettings.siteMetadata.keywords,
  };
}

function asPageIntro(value: unknown): PageIntro {
  const record = value && typeof value === "object" ? (value as Record<string, unknown>) : {};

  return {
    eyebrow: asString(record.eyebrow),
    title: asString(record.title),
    description: asString(record.description),
    path: asString(record.path),
  };
}

function asLandingHighlights(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.reduce<LandingPageRecord["highlightCards"]>((items, item) => {
    if (!item || typeof item !== "object") {
      return items;
    }

    const card = item as { title?: unknown; description?: unknown };
    const title = asString(card.title).trim();
    const description = asString(card.description).trim();

    if (!title || !description) {
      return items;
    }

    items.push({ title, description });
    return items;
  }, []);
}

function asFeaturedSections(value: unknown): LandingFeaturedSection[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.reduce<LandingFeaturedSection[]>((items, item) => {
    if (!item || typeof item !== "object") {
      return items;
    }

    const section = item as {
      label?: unknown;
      title?: unknown;
      description?: unknown;
      href?: unknown;
    };
    const href = asString(section.href).trim();

    if (!href) {
      return items;
    }

    items.push({
      label: asString(section.label).trim() || "Section",
      title: asString(section.title).trim(),
      description: asString(section.description).trim(),
      href,
    });

    return items;
  }, []);
}

function asHeroSignals(value: unknown): LandingHeroSignal[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.reduce<LandingHeroSignal[]>((items, item) => {
    if (!item || typeof item !== "object") {
      return items;
    }

    const signal = item as { label?: unknown; value?: unknown };
    const signalValue = asString(signal.value).trim();

    if (!signalValue) {
      return items;
    }

    items.push({
      label: asString(signal.label).trim() || "Signal",
      value: signalValue,
    });

    return items;
  }, []);
}

function asHomeSections(value: unknown): LandingHomeSection[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.reduce<LandingHomeSection[]>((items, item) => {
    if (!item || typeof item !== "object") {
      return items;
    }

    const section = item as { id?: unknown; enabled?: unknown };
    const id = asString(section.id).trim();

    if (!LANDING_HOME_SECTION_IDS.includes(id as (typeof LANDING_HOME_SECTION_IDS)[number])) {
      return items;
    }

    items.push({
      id: id as LandingHomeSection["id"],
      enabled:
        !Object.prototype.hasOwnProperty.call(section, "enabled") || section.enabled === true,
    });

    return items;
  }, []);
}

function asNumberMap(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {} as Record<string, number>;
  }

  return Object.fromEntries(
    Object.entries(value)
      .filter(([, item]) => typeof item === "number" && Number.isFinite(item))
      .map(([key, item]) => [key, item])
  );
}

function asStringMap(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {} as Record<string, string>;
  }

  return Object.fromEntries(
    Object.entries(value)
      .filter(([, item]) => typeof item === "string" && item.trim())
      .map(([key, item]) => [key, item])
  );
}



export function normalizeCollectionItem<K extends CollectionId>(collection: K, item: unknown): CollectionMap[K] {
  const record = item && typeof item === "object" ? (item as Record<string, unknown>) : {};

  if (collection === "siteSettings") {
    const pageIntroRecord =
      record.pageIntro && typeof record.pageIntro === "object"
        ? (record.pageIntro as Record<string, unknown>)
        : {};
    const navigationItems = Array.isArray(record.navigationItems)
      ? asNavigationItems(record.navigationItems)
      : fallbackSiteSettings.navigationItems;

    const pageIntro = Object.fromEntries(
      SITE_PAGE_KEYS.map((key) => {
        const nextIntro = asPageIntro(pageIntroRecord[key]);

        return [
          key,
          {
            ...fallbackSiteSettings.pageIntro[key],
            ...nextIntro,
            path: nextIntro.path || fallbackSiteSettings.pageIntro[key].path,
          },
        ];
      })
    ) as SiteSettingsRecord["pageIntro"];

    return {
      _id: asString(record._id),
      singletonKey: "site-settings",
      name: asString(record.name) || fallbackSiteSettings.name,
      role: asString(record.role) || fallbackSiteSettings.role,
      location: asString(record.location) || fallbackSiteSettings.location,
      availability: asString(record.availability) || fallbackSiteSettings.availability,
      profileBadge: asString(record.profileBadge) || fallbackSiteSettings.profileBadge,
      profileImage: asString(record.profileImage),
      profileImageAlt: asString(record.profileImageAlt) || fallbackSiteSettings.profileImageAlt,
      footerBlurb: asString(record.footerBlurb) || fallbackSiteSettings.footerBlurb,
      aboutParagraphs: Array.isArray(record.aboutParagraphs)
        ? asStringArray(record.aboutParagraphs)
        : fallbackSiteSettings.aboutParagraphs,
      primaryResumeLabel:
        asString(record.primaryResumeLabel) || fallbackSiteSettings.primaryResumeLabel,
      primaryResumeViewHref: asString(record.primaryResumeViewHref),
      primaryResumeDownloadHref: asString(record.primaryResumeDownloadHref),
      alternateResumeLinks: Array.isArray(record.alternateResumeLinks)
        ? asResumeLinks(record.alternateResumeLinks)
        : fallbackSiteSettings.alternateResumeLinks,
      socialLinks: Array.isArray(record.socialLinks)
        ? asSocialLinks(record.socialLinks)
        : fallbackSiteSettings.socialLinks,
      navigationItems: navigationItems.length > 0 ? navigationItems : fallbackSiteSettings.navigationItems,
      siteMetadata: asSiteMetadata(record.siteMetadata),
      pageIntro,
    } as CollectionMap[K];
  }

  if (collection === "landingPage") {
    const homeSections = Array.isArray(record.homeSections)
      ? asHomeSections(record.homeSections)
      : fallbackLandingPage.homeSections;

    return {
      _id: asString(record._id),
      singletonKey: "landing-page",
      heroEyebrow: asString(record.heroEyebrow) || fallbackLandingPage.heroEyebrow,
      heroTitle: asString(record.heroTitle) || fallbackLandingPage.heroTitle,
      heroSubtitle: asString(record.heroSubtitle) || fallbackLandingPage.heroSubtitle,
      heroSummary: asString(record.heroSummary) || fallbackLandingPage.heroSummary,
      heroIntroLines: Array.isArray(record.heroIntroLines)
        ? asStringArray(record.heroIntroLines)
        : fallbackLandingPage.heroIntroLines,
      heroSignals: Array.isArray(record.heroSignals)
        ? asHeroSignals(record.heroSignals)
        : fallbackLandingPage.heroSignals,
      primaryCtaLabel: asString(record.primaryCtaLabel) || fallbackLandingPage.primaryCtaLabel,
      primaryCtaHref: asString(record.primaryCtaHref) || fallbackLandingPage.primaryCtaHref,
      secondaryCtaLabel:
        asString(record.secondaryCtaLabel) || fallbackLandingPage.secondaryCtaLabel,
      secondaryCtaHref: asString(record.secondaryCtaHref) || fallbackLandingPage.secondaryCtaHref,
      highlightCards: Array.isArray(record.highlightCards)
        ? asLandingHighlights(record.highlightCards)
        : fallbackLandingPage.highlightCards,
      profilesEyebrow: asString(record.profilesEyebrow) || fallbackLandingPage.profilesEyebrow,
      profilesTitle: asString(record.profilesTitle) || fallbackLandingPage.profilesTitle,
      profilesDescription: asString(record.profilesDescription) || fallbackLandingPage.profilesDescription,
      projectsEyebrow: asString(record.projectsEyebrow) || fallbackLandingPage.projectsEyebrow,
      projectsTitle: asString(record.projectsTitle) || fallbackLandingPage.projectsTitle,
      projectsDescription:
        asString(record.projectsDescription) || fallbackLandingPage.projectsDescription,
      maxFeaturedProjects: asNumber(record.maxFeaturedProjects) ?? fallbackLandingPage.maxFeaturedProjects,
      achievementsEyebrow:
        asString(record.achievementsEyebrow) || fallbackLandingPage.achievementsEyebrow,
      achievementsTitle:
        asString(record.achievementsTitle) || fallbackLandingPage.achievementsTitle,
      achievementsDescription:
        asString(record.achievementsDescription) || fallbackLandingPage.achievementsDescription,
      maxFeaturedAchievements:
        asNumber(record.maxFeaturedAchievements) ?? fallbackLandingPage.maxFeaturedAchievements,
      showAchievementsSection:
        typeof record.showAchievementsSection === "boolean"
          ? record.showAchievementsSection
          : fallbackLandingPage.showAchievementsSection,
      exploreEyebrow: asString(record.exploreEyebrow) || fallbackLandingPage.exploreEyebrow,
      exploreTitle: asString(record.exploreTitle) || fallbackLandingPage.exploreTitle,
      exploreDescription:
        asString(record.exploreDescription) || fallbackLandingPage.exploreDescription,
      featuredSections: Array.isArray(record.featuredSections)
        ? asFeaturedSections(record.featuredSections)
        : fallbackLandingPage.featuredSections,
      homeSections: homeSections.length > 0 ? homeSections : fallbackLandingPage.homeSections,
      contactEyebrow: asString(record.contactEyebrow) || fallbackLandingPage.contactEyebrow,
      contactTitle: asString(record.contactTitle) || fallbackLandingPage.contactTitle,
      contactDescription:
        asString(record.contactDescription) || fallbackLandingPage.contactDescription,
    } as CollectionMap[K];
  }

  if (collection === "project") {
    return {
      _id: asString(record._id),
      createdAt: asString(record.createdAt) || undefined,
      updatedAt: asString(record.updatedAt) || undefined,
      title: asString(record.title),
      description: asString(record.description),
      techStack: asStringArray(record.techStack),
      links: asLinks(record.links),
      images: asStringArray(record.images),
      featured: asBoolean(record.featured),
      order: asNumber(record.order),
      startDate: asString(record.startDate) || undefined,
      endDate: asString(record.endDate) || undefined,
      link: asString(record.link) || undefined,
      repo: asString(record.repo) || undefined,
    } as CollectionMap[K];
  }

  if (collection === "experience") {
    return {
      _id: asString(record._id),
      createdAt: asString(record.createdAt) || undefined,
      updatedAt: asString(record.updatedAt) || undefined,
      role: asString(record.role),
      company: asString(record.company),
      location: asString(record.location) || undefined,
      startDate: asString(record.startDate) || undefined,
      endDate: asString(record.endDate) || undefined,
      current: asBoolean(record.current),
      description: asStringArray(record.description),
      technologies: asStringArray(record.technologies),
      logo: asString(record.logo) || undefined,
      attachments: asStringArray(record.attachments),
      links: asLinks(record.links),
      order: asNumber(record.order),
    } as CollectionMap[K];
  }

  if (collection === "education") {
    return {
      _id: asString(record._id),
      createdAt: asString(record.createdAt) || undefined,
      updatedAt: asString(record.updatedAt) || undefined,
      institution: asString(record.institution),
      degree: asString(record.degree),
      program: asString(record.program) || undefined,
      status: asString(record.status) || undefined,
      location: asString(record.location) || undefined,
      startDate: asString(record.startDate) || undefined,
      endDate: asString(record.endDate) || undefined,
      grade: asString(record.grade) || undefined,
      gradeLabel: asString(record.gradeLabel) || undefined,
      gradeValue: asString(record.gradeValue) || undefined,
      coursework: asStringArray(record.coursework),
      highlights: asStringArray(record.highlights),
      attachments: asStringArray(record.attachments),
      order: asNumber(record.order),
    } as CollectionMap[K];
  }

  if (collection === "skill") {
    return {
      _id: asString(record._id),
      createdAt: asString(record.createdAt) || undefined,
      updatedAt: asString(record.updatedAt) || undefined,
      category: asString(record.category),
      items: asStringArray(record.items),
      proficiency: asNumberMap(record.proficiency),
      focusSignals: asStringMap(record.focusSignals),
      order: asNumber(record.order),
    } as CollectionMap[K];
  }

  if (collection === "achievement") {
    return {
      _id: asString(record._id),
      createdAt: asString(record.createdAt) || undefined,
      updatedAt: asString(record.updatedAt) || undefined,
      title: asString(record.title),
      organization: asString(record.organization) || undefined,
      date: asString(record.date) || undefined,
      description: asString(record.description),
      featured: asBoolean(record.featured),
      order: asNumber(record.order),
      images: asStringArray(record.images),
      links: asLinks(record.links),
    } as CollectionMap[K];
  }

  if (collection === "cpProfile") {
    return {
      _id: asString(record._id),
      createdAt: asString(record.createdAt) || undefined,
      updatedAt: asString(record.updatedAt) || undefined,
      platform: asString(record.platform),
      name: asString(record.name) || undefined,
      picture: asString(record.picture) || undefined,
      url: asString(record.url) || undefined,
      username: asString(record.username) || undefined,
      headline: asString(record.headline) || undefined,
      summary: asString(record.summary) || undefined,
      rating: asNumber(record.rating),
      maxRating: asNumber(record.maxRating),
      rank: asString(record.rank) || undefined,
      solvedCount: asNumber(record.solvedCount) || 0,
      streak: asNumber(record.streak),
      profileUrl: asString(record.profileUrl) || undefined,
      badges: asBadges(record.badges),
      accent: asString(record.accent) || undefined,
      dataSource: asString(record.dataSource) || undefined,
      lastSyncedAt: asString(record.lastSyncedAt) || undefined,
      order: asNumber(record.order),
      isVisible: typeof record.isVisible === "boolean" ? record.isVisible : undefined,
      images: asStringArray(record.images),
    } as CollectionMap[K];
  }

  return {
    _id: asString(record._id),
    createdAt: asString(record.createdAt) || undefined,
    updatedAt: asString(record.updatedAt) || undefined,
    title: asString(record.title),
    event: asString(record.event) || undefined,
    organizer: asString(record.organizer) || undefined,
    result: asString(record.result) || undefined,
    date: asString(record.date) || undefined,
    location: asString(record.location) || undefined,
    description: asString(record.description) || undefined,
    techStack: asStringArray(record.techStack),
    teamSize: asNumber(record.teamSize),
    featured: asBoolean(record.featured),
    order: asNumber(record.order),
    images: asStringArray(record.images),
    links: asLinks(record.links),
  } as CollectionMap[K];
}

export function normalizeCollectionItems<K extends CollectionId>(collection: K, items: unknown[]) {
  return items.map((item) => normalizeCollectionItem(collection, item));
}

const getCollectionDataCached = cache(async (collection: CollectionId) => {
  try {
    return normalizeCollectionItems(collection, await listContentDocuments(collection));
  } catch (error) {
    console.error(`Failed to fetch ${collection} content`, error);
    return [];
  }
});

const getFeaturedCollectionDataCached = cache(async (collection: FeaturedCollectionId, limit: number) => {
  try {
    return normalizeCollectionItems(
      collection,
      await listFeaturedContentDocuments(collection, limit)
    );
  } catch (error) {
    console.error(`Failed to fetch featured ${collection} content`, error);
    return [];
  }
});

const getCollectionItemCached = cache(async (collection: CollectionId, id: string) => {
  try {
    const item = await getContentDocumentById(collection, id);
    return item ? normalizeCollectionItem(collection, item) : null;
  } catch (error) {
    console.error(`Failed to fetch ${collection} item`, error);
    return null;
  }
});

export const defaultProjects: ProjectRecord[] = [
  {
    _id: "65aa11111111111111111111",
    title: "Diablo AI Agent — Voice & Chat Persona RAG System",
    description:
      "Built and deployed an autonomous voice-and-chat agent that answers questions across 24+ GitHub repositories and completes interview scheduling through Cal.com and Vapi.ai without manual handoff.\n\nIndexed 4.2K chunks using hybrid dense/sparse retrieval and added prompt-injection guardrails, STT email normalization, request validation, and sliding-window rate limiting.\n\nValidated the system with 43 unit tests and 50 adversarial E2E interactions; measured 2.0–4.2s warm-state latency across greeting, availability, and booking workflows.",
    techStack: ["Python", "FastAPI", "Qdrant", "Hugging Face LLMs", "Cal.com API", "Vapi.ai", "React"],
    links: [
      { name: "Live Demo", url: "https://raghav-1729-diablo-ai-agent.hf.space" },
      { name: "Repository", url: "https://github.com/Raghavendra1729-cell/Diablo" },
    ],
    images: ["/diablo.png"],
    featured: true,
    order: 0,
    startDate: "Jun 2026",
    endDate: "Present",
    link: "https://raghav-1729-diablo-ai-agent.hf.space",
    repo: "https://github.com/Raghavendra1729-cell/Diablo",
  },
  {
    _id: "65aa33333333333333333333",
    title: "Web Automation Agent — Vision-Guided Browser Controller",
    description:
      "Built a custom asynchronous agent loop that converts live Chromium screenshots into JSON tool calls and executes them through Playwright for autonomous multi-step browser tasks.\n\nDesigned a self-correcting 7-tool controller for navigation, screenshots, clicking, typing, and scrolling, using shared browser state and tool-error feedback for recovery.\n\nCompressed 1280x720 screenshots from roughly 500KB PNGs to 30KB JPEGs, reducing the image payload sent to the vision model by approximately 94% per step.",
    techStack: ["Python", "Playwright", "Qwen2.5-VL-72B", "Hugging Face Inference API", "Pillow"],
    links: [
      { name: "Repository", url: "https://github.com/Raghavendra1729-cell/WEB-AUTOMATION-AGENT" },
    ],
    images: [],
    featured: true,
    order: 1,
    startDate: "Jun 2026",
    endDate: "Jun 2026",
    repo: "https://github.com/Raghavendra1729-cell/WEB-AUTOMATION-AGENT",
  },
  {
    _id: "65aa22222222222222222222",
    title: "Multithreaded HTTP/1.1 Server — Systems Programming",
    description:
      "Implemented an HTTP/1.1 server from raw Python sockets with a configurable 10-worker thread pool, GET/POST routing, and persistent connections supporting up to 100 requests per client.\n\nAdded 8KB streaming for 10MB+ binary files, 30-second idle timeouts, Host-header validation, extension whitelisting, and path-traversal protection.\n\nBuilt a 54-test suite across 3 concurrent clients covering routing, checksum-verified transfers, malformed requests, and security cases; achieved 54/54 passing tests.",
    techStack: ["Python", "Socket Programming", "ThreadPoolExecutor", "HTTP/1.1", "gzip"],
    links: [
      { name: "Repository", url: "https://github.com/Raghavendra1729-cell/Multithreaded-Http-Server" },
    ],
    images: [],
    featured: true,
    order: 2,
    startDate: "Sep 2025",
    endDate: "Oct 2025",
    repo: "https://github.com/Raghavendra1729-cell/Multithreaded-Http-Server",
  },
  {
    _id: "65aa66666666666666666666",
    title: "Khaao — Mobile-First Canteen Ordering PWA",
    description:
      "Engineered a mobile-first canteen ordering Progressive Web App designed for campus dining halls with dual student and shopkeeper operational flows.\n\nIntegrated real-time Server-Sent Events (SSE) for live order status transitions, instant notifications, menu synchronization, and cart state persistence.\n\nImplemented high-concurrency order placement handling with PostgreSQL row-level locks to prevent overselling popular menu items.",
    techStack: ["TypeScript", "React", "Go", "PostgreSQL", "SSE", "Tailwind CSS"],
    links: [
      { name: "Repository", url: "https://github.com/Raghavendra1729-cell/Khaao" },
    ],
    images: [],
    featured: true,
    order: 3,
    startDate: "2025",
    endDate: "2026",
    repo: "https://github.com/Raghavendra1729-cell/Khaao",
  },
  {
    _id: "65aa77777777777777777777",
    title: "Typeahead Search System — Distributed Low-Latency Autocomplete",
    description:
      "Designed and built a distributed typeahead autocomplete search engine capable of serving sub-10ms prefix search suggestions under high read load.\n\nImplemented Redis sharding with in-memory Trie caching and prefix indexing, coupled with asynchronous PostgreSQL batching for background analytics.\n\nEngineered time-decayed scoring algorithms to prioritize trending queries over static frequency counts.",
    techStack: ["Python", "FastAPI", "Redis", "PostgreSQL", "Data Structures"],
    links: [
      { name: "Repository", url: "https://github.com/Raghavendra1729-cell/Typeahead-System" },
    ],
    images: [],
    featured: false,
    order: 4,
    startDate: "2025",
    endDate: "2025",
    repo: "https://github.com/Raghavendra1729-cell/Typeahead-System",
  },
  {
    _id: "65aa88888888888888888888",
    title: "SastaNotebookLm — Full-Stack Document RAG Platform",
    description:
      "Architected a full-stack document comprehension application allowing users to upload multi-page PDFs or text documents and converse with grounded AI.\n\nGenerates dense vector embeddings using Google Gemini models, stored in Qdrant for semantic search and chunked source retrieval with precise citations.\n\nProvides a clean split-view reader interface with citation jumping, markdown rendering, and exportable chat notes.",
    techStack: ["TypeScript", "Next.js", "Gemini API", "Qdrant", "Tailwind CSS"],
    links: [
      { name: "Repository", url: "https://github.com/Raghavendra1729-cell/SastaNotebookLm" },
    ],
    images: [],
    featured: false,
    order: 5,
    startDate: "2025",
    endDate: "2026",
    repo: "https://github.com/Raghavendra1729-cell/SastaNotebookLm",
  },
  {
    _id: "65aa99999999999999999999",
    title: "CSES-BOOKMARKER — Chrome Extension & AI Problem Reviewer",
    description:
      "Built a browser extension for competitive programmers solving the CSES Problem Set with bookmarks, personal notes, solve timers, and backups.\n\nIntegrated on-demand AI code reviews via Gemini API to explain optimal time complexities, suggest data structures, and debug edge cases.\n\nPublished and actively used by peers at Scaler School of Technology for structured CP preparation.",
    techStack: ["JavaScript", "Chrome Extensions", "Gemini API", "Tailwind CSS"],
    links: [
      { name: "Repository", url: "https://github.com/Raghavendra1729-cell/CSES-BOOKMARKER" },
    ],
    images: [],
    featured: false,
    order: 6,
    startDate: "2025",
    endDate: "2025",
    repo: "https://github.com/Raghavendra1729-cell/CSES-BOOKMARKER",
  },
  {
    _id: "65aa44444444444444444444",
    title: "HostelHub — Scalable Inventory Management System",
    description:
      "A scalable inventory management and asset tracking platform built for university hostels, ranking 7th out of 150+ teams in a campus hackathon.\n\nFeatures complaint ticketing, maintenance tracking, asset check-in/check-out with barcode scanning, and role-based student and warden dashboards.\n\nOptimized database indexes and query pipelines for rapid inventory audits across hundreds of campus rooms.",
    techStack: ["React", "Node.js", "Express.js", "MongoDB", "Tailwind CSS"],
    links: [],
    images: [],
    featured: false,
    order: 7,
    startDate: "2025",
    endDate: "2025",
  },
  {
    _id: "65aa55555555555555555555",
    title: "Lost-n-Found — Campus Lost & Found Platform",
    description:
      "Full-stack lost-and-found web application connecting students across campus to recover lost property with minimal friction.\n\nImplemented Google OAuth authentication restricted to institutional domains, image upload listings, and categorized filtering.\n\nIntegrated real-time WebSocket chat between claimants and item finders with automated claim verification safeguards.",
    techStack: ["JavaScript", "Node.js", "Express.js", "MongoDB", "Google OAuth", "Socket.IO"],
    links: [
      { name: "Repository", url: "https://github.com/Raghavendra1729-cell/Lost-n-Found" },
    ],
    images: [],
    featured: false,
    order: 8,
    startDate: "2024",
    endDate: "2025",
    repo: "https://github.com/Raghavendra1729-cell/Lost-n-Found",
  },
];

export const defaultExperience: ExperienceRecord[] = [
  {
    _id: "66bb11111111111111111111",
    role: "Teaching Assistant Buddy",
    company: "Scaler School of Technology",
    location: "Bengaluru, India",
    startDate: "Mar 2026",
    endDate: "Present",
    current: true,
    description: [
      "Lead 3 structured sessions each week for a 25-student cohort: 1 live DSA/OOP teaching session and 2 doubt-solving and debugging sessions.",
      "Conduct weekly one-on-one mentoring and code reviews, identifying conceptual gaps and helping students develop systematic debugging and problem-solving habits.",
      "Review DSA and OOP lab solutions for correctness, edge cases, time complexity, and code quality, then provide targeted follow-up guidance.",
    ],
    technologies: ["Data Structures", "Algorithms", "OOP", "Python", "Java", "C++", "Code Review"],
    links: [{ name: "Scaler School of Technology", url: "https://scaler.com/school-of-technology" }],
    attachments: [],
    order: 0,
  },
];

export const defaultEducation: EducationRecord[] = [
  {
    _id: "67cc11111111111111111111",
    institution: "Scaler School of Technology",
    degree: "Undergraduate Program in Computer Science",
    program: "Computer Science & Engineering",
    status: "Ongoing",
    location: "Bengaluru, India",
    startDate: "Aug 2024",
    endDate: "Aug 2028",
    grade: "9.14 / 10",
    gradeLabel: "SST CGR",
    gradeValue: "9.14 / 10",
    coursework: [
      "Data Structures & Algorithms",
      "Object-Oriented Programming",
      "DBMS",
      "Operating Systems",
      "Computer Networks",
      "Low-Level Design",
      "System Architecture",
    ],
    highlights: [
      "Dean's List 2025 for academic excellence (CGR 9.14/10)",
      "Teaching Assistant Buddy for DSA and OOP cohorts",
      "Ranked 1st in all-night Competitive Programming contest",
    ],
    attachments: [],
    order: 0,
  },
  {
    _id: "67cc22222222222222222222",
    institution: "Birla Institute of Technology and Science, Pilani (BITS Pilani)",
    degree: "B.Sc. (Hons.) in Computer Science",
    program: "Computer Science",
    status: "Ongoing",
    location: "Pilani, India",
    startDate: "Aug 2024",
    endDate: "Aug 2028",
    grade: "9.02 / 10",
    gradeLabel: "BITS CGPA",
    gradeValue: "9.02 / 10",
    coursework: [
      "Discrete Mathematics",
      "Theory of Computation",
      "Algorithms",
      "Database Systems",
      "Software Engineering",
    ],
    highlights: [
      "BITS Pilani CGPA: 9.02 / 10",
      "Rigorous foundations in algorithms, discrete mathematics, and theory of computation",
    ],
    attachments: [],
    order: 1,
  },
];

export const defaultSkills: SkillRecord[] = [
  {
    _id: "68dd11111111111111111111",
    category: "Languages",
    items: ["Python", "C++", "Java", "JavaScript", "TypeScript", "SQL"],
    proficiency: { Python: 95, "C++": 92, Java: 86, JavaScript: 90, TypeScript: 90, SQL: 88 },
    focusSignals: {
      Python: "Primary for systems & AI workflows",
      "C++": "Competitive programming & low-level algorithms",
      TypeScript: "Production full-stack builds",
    },
    order: 0,
  },
  {
    _id: "68dd22222222222222222222",
    category: "Backend & Systems",
    items: ["FastAPI", "Node.js", "Express.js", "Spring Boot", "Socket Programming", "HTTP/1.1"],
    proficiency: {
      FastAPI: 92,
      "Node.js": 88,
      "Express.js": 86,
      "Socket Programming": 90,
      "HTTP/1.1": 92,
      "Spring Boot": 75,
    },
    focusSignals: {
      FastAPI: "High-throughput async APIs",
      "Socket Programming": "Raw networking and thread pools",
    },
    order: 1,
  },
  {
    _id: "68dd33333333333333333333",
    category: "AI & Agentic Workflows",
    items: ["RAG Pipelines", "Qdrant", "LangChain", "Gemini API", "Hugging Face LLMs", "VLMs"],
    proficiency: {
      "RAG Pipelines": 94,
      Qdrant: 92,
      "Gemini API": 90,
      LangChain: 86,
      VLMs: 88,
    },
    focusSignals: {
      "RAG Pipelines": "Hybrid dense/sparse retrieval with guardrails",
      VLMs: "Vision-guided tool call agents",
    },
    order: 2,
  },
  {
    _id: "68dd44444444444444444444",
    category: "Frontend & UI",
    items: ["React", "Next.js", "Tailwind CSS", "HTML", "CSS", "Framer Motion"],
    proficiency: {
      React: 92,
      "Next.js": 90,
      "Tailwind CSS": 94,
      "Framer Motion": 85,
    },
    focusSignals: {
      React: "Interactive web interfaces",
      "Next.js": "App Router production applications",
    },
    order: 3,
  },
  {
    _id: "68dd55555555555555555555",
    category: "Databases & Storage",
    items: ["PostgreSQL", "MySQL", "MongoDB", "Redis"],
    proficiency: {
      PostgreSQL: 90,
      MongoDB: 88,
      MySQL: 85,
      Redis: 86,
    },
    focusSignals: {
      PostgreSQL: "Relational data & transactions",
      Redis: "Sharded caching & fast autocomplete",
    },
    order: 4,
  },
  {
    _id: "68dd66666666666666666666",
    category: "Core Computer Science",
    items: ["DSA", "OOP", "DBMS", "Operating Systems", "Computer Networks", "LLD", "HLD"],
    proficiency: {
      DSA: 96,
      OOP: 94,
      DBMS: 90,
      "Operating Systems": 88,
      "Computer Networks": 88,
    },
    focusSignals: {
      DSA: "900+ LeetCode problems, CP contest winner",
      OOP: "Weekly mentoring at Scaler",
    },
    order: 5,
  },
  {
    _id: "68dd77777777777777777777",
    category: "Cloud, DevOps & Tools",
    items: ["Git", "GitHub", "Docker", "Linux", "Hugging Face Spaces", "Vercel", "Render"],
    proficiency: {
      Git: 92,
      Docker: 85,
      Linux: 88,
      "Hugging Face Spaces": 88,
      Vercel: 90,
    },
    focusSignals: {
      Git: "Daily collaborative version control",
      Docker: "Containerized builds & HF Spaces",
    },
    order: 6,
  },
];

export const defaultAchievements: AchievementRecord[] = [
  {
    _id: "69ee11111111111111111111",
    title: "Dean's List 2025 — Academic Performance",
    organization: "Scaler School of Technology",
    date: "2025",
    description:
      "Awarded Dean's List honors for outstanding academic performance at Scaler School of Technology, maintaining a cumulative grade ratio of 9.14 / 10.",
    featured: true,
    order: 0,
    images: [],
    links: [{ name: "Scaler School of Technology", url: "https://scaler.com/school-of-technology" }],
  },
  {
    _id: "69ee22222222222222222222",
    title: "Ranked 1st in All-Night Competitive Programming Contest",
    organization: "Scaler School of Technology",
    date: "2025",
    description:
      "Secured 1st rank among all peer contestants in an intensive all-night competitive programming contest hosted by Scaler, solving advanced algorithmic problems under timed conditions.",
    featured: true,
    order: 1,
    images: [],
    links: [{ name: "Contest Details", url: "https://github.com/Raghavendra1729-cell" }],
  },
  {
    _id: "69ee33333333333333333333",
    title: "900+ LeetCode Problems Solved with 365-Day Streak",
    organization: "LeetCode",
    date: "2024 - Present",
    description:
      "Solved over 900 algorithmic problems across Arrays, Trees, Graphs, DP, and Bit Manipulation with a 365-day active streak and a max contest rating of 1750.",
    featured: true,
    order: 2,
    images: [],
    links: [{ name: "LeetCode Profile", url: "https://leetcode.com/u/Raghavendra-1729-cell" }],
  },
  {
    _id: "69ee44444444444444444444",
    title: "Ranked 7th out of 150+ Teams in Scaler Hackathon",
    organization: "Scaler Hackathon",
    date: "2025",
    description:
      "Built Hostel Hub, a scalable inventory management and asset tracking system for residential campuses, securing 7th place out of 150+ participating teams.",
    featured: true,
    order: 3,
    images: [],
    links: [{ name: "GitHub", url: "https://github.com/Raghavendra1729-cell" }],
  },
  {
    _id: "69ee55555555555555555555",
    title: "CodeChef 3-Star (1680) & Codeforces Pupil (1210)",
    organization: "CodeChef / Codeforces / AtCoder",
    date: "2024 - Present",
    description:
      "Demonstrated algorithmic rigor across major platforms: CodeChef 3-Star (Max 1680), Codeforces Pupil (Max 1210), and AtCoder (Max 970).",
    featured: false,
    order: 4,
    images: [],
    links: [
      { name: "CodeChef", url: "https://www.codechef.com/users/raghav1729420" },
      { name: "Codeforces", url: "https://codeforces.com/profile/Dummy_acc_1" },
    ],
  },
];

export const defaultCpProfiles: CPProfileRecord[] = [
  {
    _id: "70ff11111111111111111111",
    platform: "LeetCode",
    name: "LeetCode",
    username: "Raghavendra-1729-cell",
    headline: "900+ Problems Solved · 365-Day Active Streak",
    summary:
      "Consistent algorithmic practice across Dynamic Programming, Graph Theory, Trees, and advanced data structures.",
    rating: 1750,
    maxRating: 1750,
    rank: "Top 12%",
    solvedCount: 900,
    streak: 365,
    profileUrl: "https://leetcode.com/u/Raghavendra-1729-cell",
    badges: [
      { label: "Solved", value: "900+" },
      { label: "Max Rating", value: "1750" },
      { label: "Active Streak", value: "365 days" },
    ],
    accent: "var(--tier-master)",
    dataSource: "tracked",
    order: 0,
    isVisible: true,
    images: [],
  },
  {
    _id: "70ff22222222222222222222",
    platform: "Codeforces",
    name: "Codeforces",
    username: "Dummy_acc_1",
    headline: "Pupil · Max Rating 1210",
    summary:
      "Competitive programming contests focusing on speed, edge cases, and mathematical reasoning under time pressure.",
    rating: 1210,
    maxRating: 1210,
    rank: "Pupil",
    solvedCount: 150,
    streak: 30,
    profileUrl: "https://codeforces.com/profile/Dummy_acc_1",
    badges: [
      { label: "Rank", value: "Pupil" },
      { label: "Max Rating", value: "1210" },
    ],
    accent: "var(--tier-pupil)",
    dataSource: "tracked",
    order: 1,
    isVisible: true,
    images: [],
  },
  {
    _id: "70ff33333333333333333333",
    platform: "CodeChef",
    name: "CodeChef",
    username: "raghav1729420",
    headline: "3-Star Coder · Max Rating 1680",
    summary:
      "Rated contest participation with strong finishes in Starters challenges across combinatorics, range queries, and graphs.",
    rating: 1680,
    maxRating: 1680,
    rank: "3 Star",
    solvedCount: 200,
    streak: 45,
    profileUrl: "https://www.codechef.com/users/raghav1729420",
    badges: [
      { label: "Stars", value: "3-Star" },
      { label: "Max Rating", value: "1680" },
    ],
    accent: "var(--tier-expert)",
    dataSource: "tracked",
    order: 2,
    isVisible: true,
    images: [],
  },
  {
    _id: "70ff44444444444444444444",
    platform: "AtCoder",
    name: "AtCoder",
    username: "Raghav1729",
    headline: "Max Rating 970",
    summary:
      "Regular participation in AtCoder Beginner Contests (ABC) for clean mathematical implementation and optimization.",
    rating: 970,
    maxRating: 970,
    rank: "Green",
    solvedCount: 120,
    streak: 20,
    profileUrl: "https://atcoder.jp/users/Raghav1729",
    badges: [{ label: "Max Rating", value: "970" }],
    accent: "var(--tier-specialist)",
    dataSource: "tracked",
    order: 3,
    isVisible: true,
    images: [],
  },
  {
    _id: "70ff55555555555555555555",
    platform: "GitHub",
    name: "GitHub",
    username: "Raghavendra1729-cell",
    headline: "24+ Repositories · Systems, AI Agents & Web",
    summary:
      "Open-source projects spanning HTTP servers from raw sockets, vision-guided agents, full-stack PWAs, and CSES solutions.",
    rating: 0,
    maxRating: 0,
    rank: "Builder",
    solvedCount: 24,
    streak: 180,
    profileUrl: "https://github.com/Raghavendra1729-cell",
    badges: [
      { label: "Repositories", value: "24+" },
      { label: "Focus", value: "Systems & AI" },
    ],
    accent: "var(--paper, #e8edf4)",
    dataSource: "tracked",
    order: 4,
    isVisible: true,
    images: [],
  },
];

export const defaultHackathons: HackathonRecord[] = [
  {
    _id: "71aa11111111111111111111",
    title: "Hostel Hub — Scalable Inventory Management",
    event: "Scaler School of Technology Hackathon",
    organizer: "Scaler",
    result: "Ranked 7th / 150+ Teams",
    date: "2025",
    location: "Bengaluru, India",
    description:
      "Engineered an inventory and maintenance management system designed for large student residences, earning 7th place out of 150+ competing teams.",
    techStack: ["React", "Node.js", "Express.js", "MongoDB", "Tailwind CSS"],
    teamSize: 4,
    featured: true,
    order: 0,
    images: [],
    links: [{ name: "Scaler", url: "https://scaler.com/school-of-technology" }],
  },
];

export const DEFAULT_COLLECTIONS: {
  project: ProjectRecord[];
  experience: ExperienceRecord[];
  education: EducationRecord[];
  skill: SkillRecord[];
  achievement: AchievementRecord[];
  cpProfile: CPProfileRecord[];
  hackathon: HackathonRecord[];
} = {
  project: defaultProjects,
  experience: defaultExperience,
  education: defaultEducation,
  skill: defaultSkills,
  achievement: defaultAchievements,
  cpProfile: defaultCpProfiles,
  hackathon: defaultHackathons,
};

export async function getData<K extends CollectionId>(collection: K): Promise<CollectionMap[K][]> {
  const data = (await getCollectionDataCached(collection)) as CollectionMap[K][];
  if (data && data.length > 0) {
    return data;
  }
  if (collection in DEFAULT_COLLECTIONS) {
    return (DEFAULT_COLLECTIONS as unknown as Record<string, CollectionMap[K][]>)[collection] || [];
  }
  return [];
}

export async function getFeaturedData<K extends FeaturedCollectionId>(
  collection: K,
  limit: number
): Promise<CollectionMap[K][]> {
  if (limit <= 0) {
    return [];
  }

  const data = (await getFeaturedCollectionDataCached(collection, limit)) as CollectionMap[K][];
  if (data && data.length > 0) {
    return data;
  }
  if (collection in DEFAULT_COLLECTIONS) {
    const defaults = (DEFAULT_COLLECTIONS as unknown as Record<string, Array<CollectionMap[K] & { featured?: boolean }>>)[collection] || [];
    const featured = defaults.filter((item) => item.featured);
    return (featured.length > 0 ? featured.slice(0, limit) : defaults.slice(0, limit)) as CollectionMap[K][];
  }
  return [];
}

export async function getItem<K extends CollectionId>(collection: K, id: string): Promise<CollectionMap[K] | null> {
  const item = (await getCollectionItemCached(collection, id)) as CollectionMap[K] | null;
  if (item && ((item as unknown as { title?: string }).title || (item as unknown as { role?: string }).role || (item as unknown as { platform?: string }).platform)) {
    return item;
  }
  if (collection in DEFAULT_COLLECTIONS) {
    const defaults = (DEFAULT_COLLECTIONS as unknown as Record<string, Array<CollectionMap[K] & { _id: string; title?: string }>>)[collection] || [];
    const found = defaults.find(
      (d) =>
        d._id === id ||
        (d.title &&
          d.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "") === id)
    );
    if (found) {
      return found as CollectionMap[K];
    }
  }
  return item;
}

export const getSiteSettings = cache(async (): Promise<SiteSettingsRecord> => {
  try {
    const item = await getSingletonContentDocument("siteSettings");
    if (item && item.name && item.name !== "Portfolio") {
      return normalizeCollectionItem("siteSettings", item);
    }
    return normalizeCollectionItem("siteSettings", fallbackSiteSettings);
  } catch (error) {
    console.error("Failed to fetch site settings", error);
    return normalizeCollectionItem("siteSettings", fallbackSiteSettings);
  }
});

export const getLandingPage = cache(async (): Promise<LandingPageRecord> => {
  try {
    const item = await getSingletonContentDocument("landingPage");
    if (item && item.heroTitle && item.heroTitle !== "Portfolio") {
      return normalizeCollectionItem("landingPage", item);
    }
    return normalizeCollectionItem("landingPage", fallbackLandingPage);
  } catch (error) {
    console.error("Failed to fetch landing page settings", error);
    return normalizeCollectionItem("landingPage", fallbackLandingPage);
  }
});
