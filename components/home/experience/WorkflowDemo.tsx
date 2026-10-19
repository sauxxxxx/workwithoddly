"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import s from "./workflow-demo.module.css";

gsap.registerPlugin(ScrollTrigger);
const states = [
  {
    label: "Receive",
    title: "Enquiry received.",
    copy: "Capture the details once.",
  },
  {
    label: "Organise",
    title: "Record organised.",
    copy: "Give every enquiry a clear place.",
  },
  {
    label: "Follow through",
    title: "Follow-up queued.",
    copy: "Keep the next step in view.",
  },
];

export function WorkflowDemo() {
  const root = useRef<HTMLDivElement>(null);
  const manual = useRef(false);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add(
      "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
      () => {
        const trigger = ScrollTrigger.create({
          trigger: root.current?.closest("section"),
          start: "top 15%",
          end: "bottom 75%",
          onUpdate: (self) => {
            if (!manual.current)
              setActive(Math.min(2, Math.floor(self.progress * 3)));
          },
        });
        return () => trigger.kill();
      },
    );
    return () => media.revert();
  }, []);
  return (
    <div
      ref={root}
      className={s.demo}
      aria-label="Illustrative enquiry workflow"
    >
      <p className={s.label}>Workflow study / One thing leads to another</p>
      <div className={s.states}>
        {states.map((state, index) => (
          <div
            className={s.state}
            key={state.title}
            data-active={index === active}
            aria-hidden={index !== active}
          >
            <p className={s.title}>
              {state.title}
              <span aria-hidden="true">↗</span>
            </p>
            <p className={s.copy}>{state.copy}</p>
          </div>
        ))}
      </div>
      <div className={s.controls} role="group" aria-label="Workflow steps">
        {states.map((state, index) => (
          <button
            type="button"
            key={state.label}
            onClick={() => {
              manual.current = true;
              setActive(index);
            }}
            aria-pressed={active === index}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {state.label}
          </button>
        ))}
      </div>
    </div>
  );
}
