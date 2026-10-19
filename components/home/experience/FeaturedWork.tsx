import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@/components/Icons";
import { ProjectReel } from "./ProjectReel";
import s from "./featured-work.module.css";

export function FeaturedWork() {
  return (
    <section
      id="project-detail"
      className={s.detail}
      data-scene="featured"
      data-scene-hold=".9"
      aria-labelledby="detail-title"
      data-work-detail
    >
      <header className={`${s.heading} front`}>
        <div>
          <p className={s.kicker}>The Beach Park / Inside the experience</p>
          <h2 id="detail-title">
            Designed for
            <br />
            the whole stay.
          </h2>
        </div>
        <p>
          A clear path from finding the place
          <br />
          to planning a day by the water.
        </p>
      </header>
      <div className={`${s.media} front`}>
        <figure className={s.desktop} data-work-reel>
          <ProjectReel />
          <figcaption>
            <span>01 / Explore the destination</span>
            <span>Desktop experience</span>
          </figcaption>
        </figure>
        <figure className={s.mobile} data-detail-phone>
          <Image
            src="/work/the-beach-park-hadsan/mobile.webp"
            alt="The actual Beach Park mobile website, with arrival, departure and guest controls"
            width={390}
            height={844}
            loading="lazy"
          />
          <figcaption>02 / Take it with you</figcaption>
        </figure>
      </div>
      <div className={`${s.footer} front`}>
        <p>
          Design & development
          <br />
          <span>Digital experience / Search engine optimization</span>
        </p>
        <div>
          <a
            href="https://thebeachpark.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit live site <ArrowUpRight />
          </a>
          <Link href="/work/the-beach-park-hadsan/">
            Explore the case study <ArrowUpRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
