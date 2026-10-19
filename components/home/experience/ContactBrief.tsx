"use client";

import { useRef, useState, type FormEvent } from "react";
import { site } from "@/content/site";
import { ArrowUpRight } from "@/components/Icons";
import s from "./contact-brief.module.css";

const configured = !site.contact.email.endsWith(".example");

export function ContactBrief() {
  const dialog = useRef<HTMLDialogElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const previousOverflow = useRef("");
  const [saved, setSaved] = useState(false);
  const open = () => {
    previousOverflow.current = document.documentElement.style.overflow;
    dialog.current?.showModal();
    document.documentElement.style.overflow = "hidden";
  };
  const close = () => {
    document.documentElement.style.overflow = previousOverflow.current;
    button.current?.focus();
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const brief = `ODDLY — Project brief\n\nName: ${data.get("name")}\nEmail: ${data.get("email")}\nInterested in: ${data.get("discipline")}\n\n${data.get("message")}\n`;
    if (configured)
      window.location.href = `mailto:${site.contact.email}?subject=${encodeURIComponent("A new project with ODDLY")}&body=${encodeURIComponent(brief)}`;
    else {
      const url = URL.createObjectURL(
        new Blob([brief], { type: "text/plain;charset=utf-8" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = "ODDLY-project-brief.txt";
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setSaved(true);
    }
  };
  return (
    <>
      <button ref={button} type="button" onClick={open} className={s.open}>
        Start a project <ArrowUpRight />
      </button>
      <dialog
        ref={dialog}
        onClose={close}
        className={s.dialog}
        aria-labelledby="brief-title"
        data-scroll-native
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current?.close();
        }}
      >
        <div className={s.panel}>
          <button
            type="button"
            className={s.close}
            onClick={() => dialog.current?.close()}
            aria-label="Close project brief"
          >
            ×
          </button>
          <p className={s.kicker}>A little context goes a long way</p>
          <h3 id="brief-title" className="display">
            What do you
            <br />
            have in mind
            <span className="dot" />?
          </h3>
          <p className={s.intro}>
            {configured
              ? "Tell us about the next thing you want to make."
              : "Create a short project brief to save and share with the studio."}
          </p>
          <form onSubmit={submit}>
            <div className={s.fields}>
              <label>
                Your name
                <input name="name" autoComplete="name" required />
              </label>
              <label>
                Email address
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
              </label>
            </div>
            <label>
              What do you need?
              <select name="discipline">
                <option>Technology, automation & creative</option>
                <option>Technology</option>
                <option>Automation</option>
                <option>Creative</option>
              </select>
            </label>
            <label>
              A little about your project
              <textarea name="message" rows={4} required />
            </label>
            <button className={s.submit} type="submit">
              {configured ? "Prepare email enquiry" : "Save project brief"}
              <ArrowUpRight />
            </button>
            {saved && (
              <p className={s.status} role="status">
                Your brief has been saved. It’s ready to share.
              </p>
            )}
          </form>
        </div>
      </dialog>
    </>
  );
}
