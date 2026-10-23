import type { Metadata } from "next";
import { pageMeta } from "@/components/seo/meta";
import { ArrowDown } from "@/components/Icons";
import { NextPage } from "@/components/nav/NextPage";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { projects } from "@/content/projects";
import s from "./projects.module.css";

export const metadata: Metadata = pageMeta({
  title: "Projects",
  description: "Software, websites and apps built by ODDLY®, a creative technology studio in Cebu, Philippines.",
  path: "/projects/",
});

/** Every project: one giant word with its count, the filters, then the grid. */
export default function Projects() {
  return (
    <div data-scene="away">
      <header className={s.intro}>
        <p className={s.tag} data-enter>
          ODDLY® · Selected work
        </p>
        <h1 className={`${s.title} display`} data-enter="word">
          Projects
          <sup className={s.count}>{projects.length}</sup>
        </h1>
        <div className={s.lede} data-enter>
          <p>Software, websites and apps, built around the way people actually work.</p>
          <ArrowDown />
        </div>
      </header>

      <section className={s.work} aria-label="All projects">
        <ProjectGrid />
      </section>

      <NextPage href="/about/" label="About us" title={"One studio.\nA shared direction."} size="min(11.5vw, 19svh)" leading={0.9} />
    </div>
  );
}
