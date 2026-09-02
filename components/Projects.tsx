"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Search, Workflow, X } from "lucide-react";
import { type ProjectRecord } from "@/lib/data";
import { SECTION_TRANSITION } from "@/lib/motion";
import TiltCard from "@/components/ui/TiltCard";

function getProjectWindow(project: ProjectRecord) {
  return project.featured ? "Featured project" : "Selected project";
}

function getLeadSummary(description: string) {
  return (
    description
      .split(/\n+/)
      .map((item) => item.trim())
      .find(Boolean) || "Project details will be added soon."
  );
}

const CATEGORIES = [
  { id: "all", label: "All Work" },
  { id: "ai", label: "AI & Agents" },
  { id: "systems", label: "Systems & Networking" },
  { id: "fullstack", label: "Full-Stack & PWAs" },
  { id: "tools", label: "Tools & Extensions" },
] as const;

function matchCategory(project: ProjectRecord, catId: string): boolean {
  if (catId === "all") return true;
  const t = (project.title + " " + project.techStack.join(" ") + " " + project.description).toLowerCase();
  if (catId === "ai")
    return t.includes("agent") || t.includes("rag") || t.includes("vlm") || t.includes("gemini") || t.includes("qdrant");
  if (catId === "systems")
    return t.includes("server") || t.includes("socket") || t.includes("http") || t.includes("thread") || t.includes("typeahead") || t.includes("redis");
  if (catId === "fullstack")
    return t.includes("pwa") || t.includes("canteen") || t.includes("hostel") || t.includes("lost") || t.includes("react") || t.includes("next.js");
  if (catId === "tools")
    return t.includes("extension") || t.includes("cses") || t.includes("bookmark") || t.includes("template");
  return true;
}

export default function Projects({ data }: { data: ProjectRecord[] }) {
  const reducedMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredProjects = useMemo(() => {
    return data.filter((project) => {
      const matchesCat = matchCategory(project, activeCategory);
      if (!matchesCat) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const titleMatch = project.title.toLowerCase().includes(q);
      const stackMatch = project.techStack.some((tech) => tech.toLowerCase().includes(q));
      const descMatch = project.description.toLowerCase().includes(q);
      return titleMatch || stackMatch || descMatch;
    });
  }, [data, activeCategory, searchQuery]);

  if (!data.length) {
    return (
      <div className="surface-cut border border-white/8 bg-white/[0.025] px-6 py-10">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.32em] text-slate-500">
          Projects
        </p>
        <p className="mt-4 text-lg text-slate-300">No projects are available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search and Category Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const count = data.filter((p) => matchCategory(p, cat.id)).length;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`surface-cut inline-flex items-center gap-2 border px-3.5 py-2 text-xs font-medium transition ${
                  isActive
                    ? "border-white/20 bg-white text-slate-950"
                    : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/16 hover:text-white"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`font-mono text-[10px] ${
                    isActive ? "text-slate-600" : "text-slate-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[14rem] sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stack, title, keywords..."
            className="w-full rounded-md border border-white/10 bg-white/[0.04] py-2 pl-9 pr-8 text-xs text-white placeholder-slate-500 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="surface-cut border border-white/8 bg-white/[0.025] p-10 text-center">
          <p className="text-base text-slate-300">No projects match the current filter.</p>
          <button
            onClick={() => {
              setActiveCategory("all");
              setSearchQuery("");
            }}
            className="mt-4 inline-flex items-center gap-2 border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-medium text-white hover:bg-white/10"
          >
            Reset Filters
          </button>
        </div>
      ) : null}

      <div className="space-y-5">
        {filteredProjects.map((project, index) => {
        const projectWindow = getProjectWindow(project);
        const leadSummary = getLeadSummary(project.description);
        const imageFirst = index % 2 === 1;

        return (
          <motion.div
            key={project._id}
            initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
            animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ ...SECTION_TRANSITION, delay: index * 0.04 }}
          >
            <TiltCard className="h-full">
              <article className="premium-surface premium-outline surface-cut group h-full overflow-hidden">
                <div className={imageFirst ? "grid gap-0 lg:grid-cols-[0.9fr_1.1fr]" : "grid gap-0 lg:grid-cols-[1.1fr_0.9fr]"}>
                  <div
                    className={
                      imageFirst
                        ? "order-1 relative min-h-[18rem] border-b border-white/8 bg-black/35 lg:border-b-0 lg:border-r"
                        : "order-2 relative min-h-[18rem] border-b border-white/8 bg-black/35 lg:order-2 lg:border-b-0 lg:border-l"
                    }
                  >
                    {project.images[0] ? (
                      <Image
                        src={project.images[0]}
                        alt={`${project.title} preview`}
                        fill
                        unoptimized
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="relative flex h-full items-center justify-center bg-[linear-gradient(180deg,rgba(9,11,16,0.8),rgba(4,5,8,0.98))]">
                        <div className="premium-grid absolute inset-0 opacity-30" />
                        <div className="surface-cut relative border border-white/10 bg-white/[0.04] p-5 text-slate-200">
                          <Workflow className="h-8 w-8" />
                        </div>
                      </div>
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,15,0.06),rgba(7,10,15,0.56)_100%)]" />
                  </div>

                  <div className={imageFirst ? "order-2 p-6 sm:p-7 lg:order-2 lg:p-8" : "order-1 p-6 sm:p-7 lg:order-1 lg:p-8"}>
                    <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-slate-500">
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <span className="h-px w-8 bg-white/10" />
                      <span>{projectWindow}</span>
                    </div>

                    <div className="mt-5 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-3xl font-semibold tracking-[-0.04em] text-white">
                          {project.title}
                        </h3>
                        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                          {leadSummary}
                        </p>
                      </div>
                      {project.featured ? (
                        <span className="surface-cut border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-slate-200">
                          Featured
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                      <div className="surface-cut border border-white/8 bg-white/[0.025] p-3.5">
                        <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-slate-500">
                          Stack
                        </p>
                        <p className="mt-2 text-sm text-slate-200">{project.techStack.length} tools</p>
                      </div>
                      <div className="surface-cut border border-white/8 bg-white/[0.025] p-3.5">
                        <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-slate-500">
                          Links
                        </p>
                        <p className="mt-2 text-sm text-slate-200">
                          {project.links.length + Number(Boolean(project.link)) + Number(Boolean(project.repo))}
                        </p>
                      </div>
                      <div className="surface-cut border border-white/8 bg-white/[0.025] p-3.5">
                        <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-slate-500">
                          Mode
                        </p>
                        <p className="mt-2 text-sm text-slate-200">
                          {project.featured ? "Flagship" : "Archive"}
                        </p>
                      </div>
                    </div>

                    {project.techStack.length > 0 ? (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {project.techStack.slice(0, 6).map((tech) => (
                          <span
                            key={tech}
                            className="surface-cut border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-6 flex flex-wrap gap-5 text-sm">
                      <Link
                        href={`/projects/${project._id}`}
                        className="surface-cut inline-flex items-center gap-2 border border-white/10 bg-white px-5 py-2.5 text-sm font-medium text-slate-950 transition hover:bg-slate-200"
                      >
                        Open case study
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>

                      {project.link ? (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noreferrer"
                          className="surface-cut inline-flex items-center gap-2 border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                        >
                          Live demo
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      ) : null}

                      {project.repo ? (
                        <a
                          href={project.repo}
                          target="_blank"
                          rel="noreferrer"
                          className="surface-cut inline-flex items-center gap-2 border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                        >
                          Repository
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </article>
            </TiltCard>
          </motion.div>
        );
      })}
      </div>
    </div>
  );
}
