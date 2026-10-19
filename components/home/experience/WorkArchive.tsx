"use client";

import Image from "next/image";

import { useState } from "react";
import Link from "next/link";
import { projects, type Project } from "@/content/projects";
import { ArrowUpRight } from "@/components/Icons";
import s from "./work-archive.module.css";

function preview(project: Project) {
  if (project.slug === "the-beach-park-hadsan")
    return "/work/the-beach-park-hadsan/desktop.webp";
  return project.media.cover.kind === "video"
    ? project.media.cover.poster
    : project.media.cover.src;
}

export function WorkArchive() {
  const [active, setActive] = useState(projects[0].slug);
  const [expanded, setExpanded] = useState<string | null>(projects[0].slug);
  const project = projects.find((item) => item.slug === active) ?? projects[0];
  const image = preview(project);
  return (
    <section
      id="more-work"
      className={s.archive}
      data-scene="work"
      data-scene-hold="0.9"
      aria-labelledby="archive-title"
    >
      <header className={`${s.heading} front`}>
        <p className={s.kicker}>
          The project index / {String(projects.length).padStart(2, "0")}{" "}
          projects
        </p>
        <h2
          id="archive-title"
          className={`${s.title} display`}
          data-reveal-heading
        >
          More
          <br />
          Oddly
          <span className="dot" aria-hidden="true" />
        </h2>
      </header>
      <div className={`${s.body} front`}>
        <ol className={s.index}>
          {projects.map((item, index) => (
            <li key={item.slug} data-active={active === item.slug}>
              <div className={s.row}>
                <Link
                  href={`/work/${item.slug}/`}
                  onMouseEnter={() => setActive(item.slug)}
                  onFocus={() => setActive(item.slug)}
                >
                  <span className={s.number}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={s.name}>{item.name}</span>
                  <ArrowUpRight />
                </Link>
                {preview(item) && (
                  <button
                    className={s.previewToggle}
                    type="button"
                    aria-label={`Preview ${item.name}`}
                    aria-expanded={expanded === item.slug}
                    aria-controls={`preview-${item.slug}`}
                    onClick={() => {
                      setActive(item.slug);
                      setExpanded(expanded === item.slug ? null : item.slug);
                    }}
                  >
                    <span aria-hidden="true">
                      {expanded === item.slug ? "−" : "+"}
                    </span>
                  </button>
                )}
              </div>
              {preview(item) && (
                <div
                  id={`preview-${item.slug}`}
                  className={s.mobilePreview}
                  hidden={expanded !== item.slug}
                >
                  <Image
                    src={preview(item)!}
                    alt={`${item.name} — ${item.slug === "the-beach-park-hadsan" ? "website" : "public entry view"}`}
                    width="1440"
                    height="1000"
                    loading="lazy"
                  />
                  <p>{item.category}</p>
                </div>
              )}
            </li>
          ))}
        </ol>
        <div className={s.preview} aria-live="polite" aria-atomic="true">
          <div className={s.previewArt} key={project.slug}>
            {image ? (
              <Image
                src={image}
                alt={`${project.name} ${project.slug === "the-beach-park-hadsan" ? "website" : "public entry interface"}`}
                width="1440"
                height="1000"
                loading="lazy"
              />
            ) : (
              <div className={s.typographicPreview}>
                <span className="display">
                  {project.name}
                  <span className="dot" />
                </span>
                <p>{project.category}</p>
              </div>
            )}
          </div>
          <div className={s.previewCaption}>
            <div>
              <p>{project.name}</p>
              <span>{project.category}</span>
            </div>
            <Link
              href={`/work/${project.slug}/`}
              aria-label={`View ${project.name}`}
            >
              <ArrowUpRight />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
