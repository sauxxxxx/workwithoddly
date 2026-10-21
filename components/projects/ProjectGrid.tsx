"use client";

import { useState } from "react";
import { projectKinds, projects, type ProjectKind } from "@/content/projects";
import { ProjectCard } from "./ProjectCard";
import s from "./project-grid.module.css";

/** Every project, two to a row, with filters by kind. Changing the filter re-deals the cards. */
export function ProjectGrid() {
  const [kind, setKind] = useState<ProjectKind | "all">("all");
  const shown = kind === "all" ? projects : projects.filter((p) => p.kind === kind);
  const filters = [
    { id: "all" as const, label: "All", count: projects.length },
    ...projectKinds
      .map((k) => ({ ...k, count: projects.filter((p) => p.kind === k.id).length }))
      .filter((k) => k.count > 0),
  ];

  return (
    <>
      <div className={s.filters} role="group" aria-label="Filter projects" data-enter>
        {filters.map((f) => (
          <button key={f.id} type="button" className={s.filter} aria-pressed={kind === f.id} onClick={() => setKind(f.id)}>
            {f.label}
            <sup>{f.count}</sup>
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {shown.length} projects shown
      </p>
      <ul key={kind} className={s.grid}>
        {shown.map((p, i) => (
          <li key={p.slug} style={{ ["--i" as string]: i }}>
            <ProjectCard project={p} index={i} />
          </li>
        ))}
      </ul>
    </>
  );
}
