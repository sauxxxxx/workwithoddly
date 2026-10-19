import Image from "next/image";
import Link from "next/link";
import { disciplines } from "@/content/services";
import { ArrowUpRight } from "@/components/Icons";
import { ServiceList } from "./ServiceList";
import { WorkflowDemo } from "./WorkflowDemo";
import { StudioStudies } from "./StudioStudies";
import { SculptureStill } from "./SculptureStill";
import s from "./capability-chapters.module.css";

export function CapabilityChapters() {
  const [technology, automation, creative] = disciplines;
  return (
    <div id="services">
      <section
        id="technology"
        className={`${s.chapter} ${s.technology}`}
        data-scene="technology"
        data-scene-hold="0.9"
        aria-labelledby="technology-title"
      >
        <p className={`${s.kicker} front`}>01 / Technology</p>
        <SculptureStill form="knot" className={s.knot} />
        <div className={`${s.technologyHeading} front`}>
          <h2
            id="technology-title"
            className={`${s.title} display`}
            data-reveal-heading
          >
            <span>Built to</span>
            <span>
              do more
              <span className="dot" aria-hidden="true" />
            </span>
          </h2>
          <p className={s.lead}>{technology.lede}</p>
        </div>
        <div className={`${s.technologyServices} front`}>
          <ServiceList discipline={technology} />
        </div>
        <Link
          href="/work/joyno-accounting/"
          className={`${s.chapterLink} front`}
        >
          Explore technology <ArrowUpRight />
        </Link>
      </section>
      <div className={`${s.productStrip} front`} data-product-strip>
        <div>
          <p className={s.kicker}>In practice / Joyno Accounting</p>
          <p>
            Software for the work
            <br />
            behind the business.
          </p>
          <Link href="/work/joyno-accounting/">
            View project <ArrowUpRight />
          </Link>
        </div>
        <Link href="/work/joyno-accounting/" className={s.productShot}>
          <Image
            src="/work/joyno-accounting/entry.webp"
            alt="Joyno Accounting public sign-in interface"
            width="1440"
            height="1000"
            loading="lazy"
          />
          <span>Joyno Accounting / Public entry view</span>
        </Link>
      </div>

      <section
        id="automation"
        className={`${s.chapter} ${s.automation}`}
        data-scene="automation"
        data-scene-hold="0.95"
        aria-labelledby="automation-title"
      >
        <p className={`${s.kicker} front`}>02 / Automation</p>
        <SculptureStill form="twist" className={s.twist} />
        <div className={`${s.automationHeading} front`}>
          <h2
            id="automation-title"
            className={`${s.title} display`}
            data-reveal-heading
          >
            <span>Less work.</span>
            <span>
              More flow
              <span className="dot" aria-hidden="true" />
            </span>
          </h2>
        </div>
        <div className={`${s.workflow} front`}>
          <WorkflowDemo />
        </div>
        <div className={`${s.automationServices} front`}>
          <ServiceList discipline={automation} />
        </div>
        <Link href="/work/joynosync/" className={`${s.chapterLink} front`}>
          Explore automation <ArrowUpRight />
        </Link>
      </section>

      <section
        id="creative"
        className={`${s.chapter} ${s.creative}`}
        data-scene="creative"
        data-scene-hold="0.85"
        aria-labelledby="creative-title"
      >
        <p className={`${s.kicker} front`}>03 / Creative</p>
        <SculptureStill form="loop" className={s.loop} />
        <div className={`${s.artwork} front`}>
          <StudioStudies />
        </div>
        <div className={`${s.creativeHeading} front`}>
          <h2
            id="creative-title"
            className={`${s.title} display`}
            data-reveal-heading
          >
            <span>Made to</span>
            <span>
              be felt
              <span className="dot" aria-hidden="true" />
            </span>
          </h2>
        </div>
        <div className={`${s.creativeServices} front`}>
          <ServiceList discipline={creative} />
        </div>
        <Link
          href="/work/marketing-content/"
          className={`${s.chapterLink} front`}
        >
          Explore creative <ArrowUpRight />
        </Link>
      </section>
    </div>
  );
}
