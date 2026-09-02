"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Github, Globe, Search, X } from "lucide-react";
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

  return (
    <div className="space-y-8">
      {/* Category Pills & Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`surface-cut px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] transition-all duration-200 ${
                  isActive
                    ? "border border-white/20 bg-white text-slate-950 font-semibold shadow-sm"
                    : "border border-white/8 bg-white/[0.03] text-slate-400 hover:border-white/16 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[14rem]">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter projects or tech..."
            className="w-full surface-cut rounded-lg border border-white/10 bg-white/[0.03] py-2 pl-9 pr-8 font-mono text-xs text-slate-200 placeholder:text-slate-500 focus:border-white/25 focus:bg-white/[0.06] focus:outline-none"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="surface-cut border border-white/8 bg-white/[0.02] p-12 text-center">
          <p className="text-slate-400">No projects match your filter criteria.</p>
          <button
            onClick={() => {
              setActiveCategory("all");
              setSearchQuery("");
            }}
            className="mt-4 text-xs font-mono uppercase tracking-[0.2em] text-white underline hover:text-slate-300"
          >
            Reset Filters
          </button>
        </div>
      ) : null}

      <div className="space-y-5">
        {filteredProjects.map((project, index) => {
          const projectWindow = getProjectWindow(project);
          const leadSummary = getLeadSummary(project.description);

          return (
            <motion.div
              key={project._id}
              initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
              animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ ...SECTION_TRANSITION, delay: index * 0.04 }}
            >
              <TiltCard className="h-full">
                <article className="premium-surface premium-outline surface-cut group h-full p-6 sm:p-7 lg:p-8 transition-all hover:border-white/16">
                  <div className="flex items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-slate-500">
                    <div className="flex items-center gap-3">
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <span className="h-px w-8 bg-white/10" />
                      <span>{projectWindow}</span>
                    </div>
                    {project.featured ? (
                      <span className="surface-cut border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-slate-200">
                        Featured
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-5">
                    <h3 className="font-display text-2xl sm:text-3xl font-semibold tracking-[-0.04em] text-white">
                      {project.title}
                    </h3>
                    <p className="mt-3.5 max-w-3xl text-sm sm:text-base leading-7 text-slate-300">
                      {leadSummary}
                    </p>
                  </div>

                  {project.techStack.length > 0 ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="surface-cut border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {/* Prominent Action Links */}
                  <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/8 pt-5 text-sm">
                    {project.link ? (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noreferrer"
                        className="surface-cut inline-flex items-center gap-2 border border-white/10 bg-white px-5 py-2.5 text-sm font-medium text-slate-950 transition hover:bg-slate-200"
                      >
                        <Globe className="h-4 w-4" />
                        Live Demo
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    ) : null}

                    {project.repo ? (
                      <a
                        href={project.repo}
                        target="_blank"
                        rel="noreferrer"
                        className="surface-cut inline-flex items-center gap-2 border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10 hover:border-white/20"
                      >
                        <Github className="h-4 w-4" />
                        GitHub Repo
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    ) : null}

                    {project.links?.map((extraLink) => {
                      if (extraLink.url === project.link || extraLink.url === project.repo) return null;
                      return (
                        <a
                          key={extraLink.url}
                          href={extraLink.url}
                          target="_blank"
                          rel="noreferrer"
                          className="surface-cut inline-flex items-center gap-2 border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/8 hover:text-white"
                        >
                          {extraLink.name}
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      );
                    })}

                    <Link
                      href={`/projects/${project._id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-slate-400 transition hover:text-white sm:ml-auto"
                    >
                      Case study &amp; details
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
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
