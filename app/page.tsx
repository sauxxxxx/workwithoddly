import { AppIcon } from "@/components/AppIcon";
import { ScrollBadge } from "@/components/home/ScrollBadge";
import { HomeMotion } from "@/components/home/HomeMotion";
import { PerspectiveSequence } from "@/components/home/sequence/PerspectiveSequence";
import { ProjectStage } from "@/components/home/stage/ProjectStage";
import { StudioAbout } from "@/components/home/experience/StudioAbout";
import { ContactSection } from "@/components/home/experience/ContactSection";
import { NextPage } from "@/components/nav/NextPage";
import { site } from "@/content/site";
import s from "./home.module.css";

export default function Home() {
  return (
    <>
      <HomeMotion />
      <section className={s.hero} data-scene="hero" aria-labelledby="hero-title">
        <div className={s.heroStack}>
          <p className={`${s.heroTag} front`}>
            <AppIcon className={s.heroIcon} />
            <span>
              ODDLY®
              <br />
              Different by design
            </span>
          </p>

          <h1 id="hero-title" className={s.heroTitle}>
            <span className={`${s.heroLine} back`} data-hero-line="0">
              <span>Creative</span>
            </span>
            <span className={`${s.heroLine} front`} data-hero-line="1">
              <span>Technology</span>
            </span>
            <span className={`${s.heroLine} back`} data-hero-line="2">
              <span>
                Studio<span className="dot" aria-hidden="true" />
              </span>
            </span>
          </h1>

          <p className={`${s.heroFoot} front`}>
            {site.location.city}, {site.location.country}
          </p>
        </div>

        <div className={`${s.heroBadge} front`}>
          <ScrollBadge href="#studio" label="Scroll to the studio" />
        </div>
      </section>
      <PerspectiveSequence />
      <ProjectStage />
      <StudioAbout />
      <ContactSection />
      <NextPage href="/projects/" label="Projects" size="min(12.6vw, 27svh)" leading={0.86} />
    </>
  );
}
