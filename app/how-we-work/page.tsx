import type { Metadata } from "next";
import Link from "next/link";
import { ContactBrief } from "@/components/home/experience/ContactBrief";
import { NextPage } from "@/components/nav/NextPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMeta } from "@/components/seo/meta";
import { faq, steps } from "@/content/process";
import { site } from "@/content/site";
import s from "./how-we-work.module.css";

export const metadata: Metadata = pageMeta({
  title: "How we work",
  description: `How a project with ${site.legalName} runs, from your brief to launch, and answers to the questions clients ask most.`,
  path: "/how-we-work/",
});

const pad = (n: number) => String(n).padStart(2, "0");

/** The process in four steps, then the common questions (also as FAQ structured data). */
export default function HowWeWork() {
  const structured = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };

  return (
    <div className={s.page} data-scene="away">
      <JsonLd data={structured} />
      <header className={s.hero}>
        <p className={s.tag} data-enter>
          How we work
        </p>
        <h1 className={`${s.title} display`} data-enter="word">
          From brief
          <br />
          to launch<span className="dot" aria-hidden="true" />
        </h1>
        <p className={s.lede} data-enter>
          Every project starts with a conversation about how you work, and ends with something your customers and your team actually use.
        </p>
      </header>

      <section className={s.steps} aria-labelledby="steps-title">
        <h2 id="steps-title" className={s.label}>
          The steps
        </h2>
        <ol>
          {steps.map((step, i) => (
            <li key={step.title}>
              <span className={s.num}>{pad(i + 1)}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={s.faq} aria-labelledby="faq-title">
        <h2 id="faq-title" className={`${s.heading} display`}>
          Questions<span className="dot" aria-hidden="true" />
        </h2>
        <div className={s.list}>
          {faq.map((f) => (
            <details key={f.question} className={s.item}>
              <summary>
                <span>{f.question}</span>
                <span className={s.plus} aria-hidden="true" />
              </summary>
              <p>{f.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className={s.start} aria-label="Start a project">
        <p className={s.startTitle}>Ready when you are.</p>
        <div className={s.startAction}>
          <ContactBrief />
          <p>
            Or see <Link href="/projects/">what we have made</Link> and <Link href="/about/">who we are</Link>.
          </p>
        </div>
      </section>

      <NextPage href="/contact/" label="Contact" title={"Let’s make\nit Oddly."} size="min(13vw, 22svh)" leading={0.88} centered />
    </div>
  );
}
