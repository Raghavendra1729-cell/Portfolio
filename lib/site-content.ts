export const DEFAULT_PROFILE_IMAGE = "/profile/raghavendra-portrait.png";

export const SITE_PAGE_KEYS = [
  "about",
  "projects",
  "experience",
  "skills",
  "achievements",
  "contact",
] as const;

export type SitePageKey = (typeof SITE_PAGE_KEYS)[number];

export const SITE_PAGE_DETAILS: Record<SitePageKey, { label: string; path: string }> = {
  about: { label: "About", path: "/about" },
  projects: { label: "Projects", path: "/projects" },
  experience: { label: "Experience", path: "/experience" },
  skills: { label: "Skills", path: "/skills" },
  achievements: { label: "Achievements", path: "/achievements" },
  contact: { label: "Contact", path: "/contact" },
};

export const LANDING_HOME_SECTION_IDS = [
  "highlights",
  "projects",
  "achievements",
  "explore",
  "contact",
] as const;

export type LandingHomeSectionId = (typeof LANDING_HOME_SECTION_IDS)[number];

export const LANDING_HOME_SECTION_LABELS: Record<LandingHomeSectionId, string> = {
  highlights: "Highlights",
  projects: "Projects",
  achievements: "Achievements",
  explore: "Explore",
  contact: "Contact",
};

export type SocialLinkKind = "email" | "github" | "linkedin" | "website" | "other";

export type NavigationItem = {
  label: string;
  href: string;
  enabled: boolean;
};

export type SiteMetadataConfig = {
  description: string;
  keywords: string[];
};

export type SocialLink = {
  kind: SocialLinkKind;
  label: string;
  value: string;
  href: string;
};

export type ResumeAlternateLink = {
  label: string;
  href: string;
};

export type PageIntro = {
  eyebrow: string;
  title: string;
  description: string;
  path: string;
};

export type SiteSettingsRecord = {
  _id: string;
  singletonKey: "site-settings";
  name: string;
  role: string;
  location: string;
  availability: string;
  profileBadge: string;
  profileImage: string;
  profileImageAlt: string;
  footerBlurb: string;
  aboutParagraphs: string[];
  primaryResumeLabel: string;
  primaryResumeViewHref: string;
  primaryResumeDownloadHref: string;
  alternateResumeLinks: ResumeAlternateLink[];
  socialLinks: SocialLink[];
  navigationItems: NavigationItem[];
  siteMetadata: SiteMetadataConfig;
  pageIntro: Record<SitePageKey, PageIntro>;
};

export type LandingHighlight = {
  title: string;
  description: string;
};

export type LandingFeaturedSection = {
  label: string;
  title: string;
  description: string;
  href: string;
};

export type LandingHeroSignal = {
  label: string;
  value: string;
};

export type LandingHomeSection = {
  id: LandingHomeSectionId;
  enabled: boolean;
};

export type LandingPageRecord = {
  _id: string;
  singletonKey: "landing-page";
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroSummary: string;
  heroIntroLines: string[];
  heroSignals: LandingHeroSignal[];
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  highlightCards: LandingHighlight[];
  profilesEyebrow: string;
  profilesTitle: string;
  profilesDescription: string;
  projectsEyebrow: string;
  projectsTitle: string;
  projectsDescription: string;
  maxFeaturedProjects: number;
  achievementsEyebrow: string;
  achievementsTitle: string;
  achievementsDescription: string;
  maxFeaturedAchievements: number;
  showAchievementsSection: boolean;
  exploreEyebrow: string;
  exploreTitle: string;
  exploreDescription: string;
  featuredSections: LandingFeaturedSection[];
  homeSections: LandingHomeSection[];
  contactEyebrow: string;
  contactTitle: string;
  contactDescription: string;
};

export const DEFAULT_NAVIGATION_ITEMS: NavigationItem[] = [
  { label: "Home", href: "/", enabled: true },
  { label: "About", href: "/about", enabled: true },
  { label: "Projects", href: "/projects", enabled: true },
  { label: "Experience", href: "/experience", enabled: true },
  { label: "Skills", href: "/skills", enabled: true },
  { label: "Achievements", href: "/achievements", enabled: true },
  { label: "Contact", href: "/contact", enabled: true },
];

export const DEFAULT_HOME_SECTIONS: LandingHomeSection[] = LANDING_HOME_SECTION_IDS.map((id) => ({
  id,
  enabled: true,
}));

export const fallbackSiteSettings: Omit<SiteSettingsRecord, "_id"> = {
  singletonKey: "site-settings",
  name: "Linga Seetha Rama Raghavendra",
  role: "Software Engineer · AI & Systems",
  location: "Bengaluru, India",
  availability: "Open to SDE Roles, AI/Backend Internships & Technical Collaborations",
  profileBadge: "Open to Work",
  profileImage: "/pic.jpeg",
  profileImageAlt: "Portrait of Linga Seetha Rama Raghavendra",
  footerBlurb:
    "Computer science undergraduate at Scaler School of Technology and BITS Pilani. Building high-performance distributed systems, autonomous AI agents, and product-grade web applications.",
  aboutParagraphs: [
    "I am a Computer Science undergraduate pursuing a dual program at Scaler School of Technology (Bengaluru) and BITS Pilani, maintaining a 9.14 SST CGR and 9.02 BITS CGPA.",
    "My technical focus spans systems programming, distributed architectures, and agentic AI. I have built multithreaded HTTP/1.1 servers from raw sockets, vision-guided autonomous browser agents with 72B VLMs, and hybrid dense/sparse RAG voice assistants with sub-second turn latency.",
    "As a Teaching Assistant Buddy at Scaler School of Technology, I mentor a 25-student cohort in Data Structures, Algorithms, and Object-Oriented Programming—conducting weekly live code reviews, teaching systematic debugging habits, and reviewing lab solutions.",
    "Beyond building, I am an active competitive programmer with over 900 problems solved on LeetCode (365-day active streak, 1750 contest rating), CodeChef 3-Star (1680 rating), and Codeforces Pupil (1210 rating). I was awarded Dean's List 2025 and ranked 1st among all peers in Scaler's all-night CP contest.",
  ],
  primaryResumeLabel: "Resume",
  primaryResumeViewHref: "/resume.pdf",
  primaryResumeDownloadHref: "/resume.pdf",
  alternateResumeLinks: [
    {
      label: "Google Drive",
      href: "https://drive.google.com/file/d/1iz-vg1MaRO4P57dnqN3uwhhvwbIMZ41i/view?usp=sharing",
    },
  ],
  socialLinks: [
    {
      kind: "github",
      label: "GitHub",
      value: "Raghavendra1729-cell",
      href: "https://github.com/Raghavendra1729-cell",
    },
    {
      kind: "linkedin",
      label: "LinkedIn",
      value: "raghavendra-linga",
      href: "https://www.linkedin.com/in/raghavendra-linga/",
    },
    {
      kind: "email",
      label: "Email",
      value: "lingaraghawendra@gmail.com",
      href: "mailto:lingaraghawendra@gmail.com",
    },
    {
      kind: "website",
      label: "DIABLO AI",
      value: "Personal AI Assistant",
      href: "https://raghav-1729-diablo-ai-agent.hf.space",
    },
  ],
  navigationItems: DEFAULT_NAVIGATION_ITEMS,
  siteMetadata: {
    description:
      "Portfolio of Linga Seetha Rama Raghavendra — Software Engineer focused on Systems Programming, Agentic AI, and Full-Stack Engineering. Student at SST and BITS Pilani.",
    keywords: [
      "Linga Seetha Rama Raghavendra",
      "Raghavendra Linga",
      "Software Engineer",
      "Scaler School of Technology",
      "BITS Pilani",
      "Diablo AI Agent",
      "Competitive Programming",
      "Next.js",
      "FastAPI",
      "Python",
      "TypeScript",
    ],
  },
  pageIntro: Object.fromEntries(
    SITE_PAGE_KEYS.map((key) => {
      const config = SITE_PAGE_DETAILS[key];

      return [
        key,
        {
          eyebrow: config.label,
          title: key === "skills" ? "Current stack and core capabilities." : config.label,
          description: "",
          path: config.path,
        },
      ];
    })
  ) as Record<SitePageKey, PageIntro>,
};

export const fallbackLandingPage: Omit<LandingPageRecord, "_id"> = {
  singletonKey: "landing-page",
  heroEyebrow: "Scaler School of Technology · BITS Pilani",
  heroTitle: "Linga Seetha Rama Raghavendra",
  heroSubtitle: "Software Engineer · Scalable Systems & Agentic AI",
  heroSummary:
    "Building high-performance distributed systems, autonomous AI agents, and product-grade applications. TA Buddy at Scaler School of Technology.",
  heroIntroLines: [
    "900+ LeetCode problems solved · 365-day active streak",
    "TA Buddy for DSA & OOP at Scaler School of Technology",
    "Dean's List 2025 · SST CGR 9.14 / BITS CGPA 9.02",
  ],
  heroSignals: [
    { label: "Systems & AI", value: "HTTP/1.1 Server · Diablo Agent · Browser Agent" },
    { label: "Academics", value: "SST CGR 9.14 · BITS CGPA 9.02" },
    { label: "Problem Solving", value: "900+ LeetCode · CodeChef 3★ · 365 Streak" },
  ],
  primaryCtaLabel: "View Projects",
  primaryCtaHref: "/projects",
  secondaryCtaLabel: "Talk to DIABLO",
  secondaryCtaHref: "https://raghav-1729-diablo-ai-agent.hf.space",
  highlightCards: [
    {
      title: "Systems & Concurrency",
      description:
        "Engineered an HTTP/1.1 server from raw Python sockets with thread-pool concurrency, gzip compression, persistent connections, and a 54-test regression suite.",
    },
    {
      title: "Autonomous AI Agents",
      description:
        "Built Diablo (hybrid RAG voice/chat agent over 24+ repos with Cal.com integration) and vision-guided browser automation agents using 72B VLMs.",
    },
    {
      title: "Algorithmic Problem Solving",
      description:
        "900+ LeetCode problems solved, CodeChef 3-Star (1680), Codeforces Pupil (1210), and ranked 1st among all peers in Scaler's all-night CP contest.",
    },
  ],
  profilesEyebrow: "Profiles",
  profilesTitle: "Competitive Programming & Coding Profiles",
  profilesDescription:
    "Tracked contest ratings, solve counts, and repositories across LeetCode, Codeforces, CodeChef, AtCoder, and GitHub.",
  projectsEyebrow: "Projects",
  projectsTitle: "Featured Projects",
  projectsDescription:
    "Selected systems, AI agents, and full-stack web platforms built with focus on scale, performance, and real-world utility.",
  maxFeaturedProjects: 3,
  achievementsEyebrow: "Achievements",
  achievementsTitle: "Featured Achievements",
  achievementsDescription:
    "Academic honors, competitive programming contest standings, and hackathon rankings.",
  maxFeaturedAchievements: 4,
  showAchievementsSection: true,
  exploreEyebrow: "Explore",
  exploreTitle: "Explore More",
  exploreDescription:
    "Deep dives into my engineering experience, technical capabilities, education, and credentials.",
  featuredSections: [
    {
      label: "Projects",
      title: "Flagship Engineering Projects",
      description:
        "From multithreaded HTTP servers and browser automation agents to mobile PWAs and distributed search.",
      href: "/projects",
    },
    {
      label: "Profiles",
      title: "Competitive Programming & Code",
      description:
        "Handles, ratings, and stats across LeetCode, Codeforces, CodeChef, AtCoder, and GitHub.",
      href: "/profiles",
    },
    {
      label: "Experience",
      title: "Teaching Assistant Buddy & Mentorship",
      description:
        "Leading live DSA and OOP teaching sessions and code reviews for a 25-student cohort at Scaler.",
      href: "/experience",
    },
    {
      label: "Achievements",
      title: "Contest Wins & Dean's List",
      description:
        "Dean's List 2025, Scaler all-night CP contest winner, and hackathon leaderboard placements.",
      href: "/achievements",
    },
  ],
  homeSections: DEFAULT_HOME_SECTIONS,
  contactEyebrow: "Contact",
  contactTitle: "Get in Touch",
  contactDescription:
    "Open to software engineering roles, AI/backend internships, and focused technical collaborations.",
};
