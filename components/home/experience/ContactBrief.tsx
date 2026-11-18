"use client";

import { useRef, useState, type FormEvent } from "react";
import { site } from "@/content/site";
import { ArrowUpRight } from "@/components/Icons";
import s from "./contact-brief.module.css";

const configured = !site.contact.email.endsWith(".example");
const subject = "A new project with ODDLY";

export function ContactBrief() {
  const dialog = useRef<HTMLDialogElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const previousOverflow = useRef("");
  const [saved, setSaved] = useState(false);
  // The finished brief, once written: then the ways to send it are shown.
  const [ready, setReady] = useState<string | null>(null);
  const [copied, setCopied] = useState<"brief" | "email" | null>(null);
  // With a form endpoint: sending, then sent (or failed, which falls back to the ways above).
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<{ name: string; email: string } | null>(null);
  const [failed, setFailed] = useState(false);
  const open = () => {
    previousOverflow.current = document.documentElement.style.overflow;
    dialog.current?.showModal();
    document.documentElement.style.overflow = "hidden";
  };
  const close = () => {
    document.documentElement.style.overflow = previousOverflow.current;
    setReady(null);
    setCopied(null);
    setSent(null);
    setFailed(false);
    button.current?.focus();
  };
  const copy = async (what: "brief" | "email", text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(what);
    } catch {
      setCopied(null);
    }
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const brief = `ODDLY — Project brief\n\nName: ${data.get("name")}\nEmail: ${data.get("email")}\nInterested in: ${data.get("discipline")}\n\n${data.get("message")}\n`;
    // Sent straight to the studio's Google Apps Script when it is set up
    // (scripts/apps-script); if that fails, the ways below still work.
    if (site.formEndpoint) {
      setSending(true);
      setFailed(false);
      try {
        const body = new URLSearchParams();
        data.forEach((value, key) => body.append(key, String(value)));
        body.append("page", window.location.pathname);
        const response = await fetch(site.formEndpoint, { method: "POST", body });
        const result = (await response.json()) as { ok?: boolean };
        if (!result.ok) throw new Error("not accepted");
        setSent({ name: String(data.get("name")), email: String(data.get("email")) });
      } catch {
        setFailed(true);
        setReady(brief);
      } finally {
        setSending(false);
      }
      return;
    }
    // Not every visitor has a mail app set up, so a mailto link alone can fail
    // silently: offer Gmail, the mail app, and a copy of the brief instead.
    if (configured) setReady(brief);
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
          {sent ? (
            <div className={s.ready} role="status">
              <p className={s.readyTitle}>Thank you, {sent.name}. Your brief is with us.</p>
              <p className={s.status}>We&rsquo;ll reply to {sent.email}.</p>
              <button type="button" className={`${s.submit} ${s.quiet}`} onClick={() => dialog.current?.close()}>
                Close
              </button>
            </div>
          ) : ready ? (
            <div className={s.ready} role="status">
              <p className={s.readyTitle}>
                {failed
                  ? "We couldn’t send it from here just now. Your brief is ready; send it the way that suits you:"
                  : "Your brief is ready. Send it the way that suits you:"}
              </p>
              <div className={s.ways}>
                <a
                  className={s.submit}
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(site.contact.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(ready)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Send with Gmail <ArrowUpRight />
                </a>
                <a
                  className={`${s.submit} ${s.quiet}`}
                  href={`mailto:${site.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(ready)}`}
                >
                  Open my email app <ArrowUpRight />
                </a>
                <button type="button" className={`${s.submit} ${s.quiet}`} onClick={() => copy("brief", ready)}>
                  {copied === "brief" ? "Brief copied" : "Copy the brief"}
                </button>
              </div>
              <p className={s.status}>
                Or paste it into any message to{" "}
                <button type="button" className={s.inline} onClick={() => copy("email", site.contact.email)}>
                  {site.contact.email}
                </button>
                {copied === "email" && " (copied)"}
                {site.contact.phone && <> · call or text {site.contact.phone}</>}
              </p>
              <button type="button" className={s.inline} onClick={() => setReady(null)}>
                ← Edit the brief
              </button>
              <p className={s.status}>
                How we handle what you send: <a href="/privacy/">privacy policy</a>.
              </p>
            </div>
          ) : (
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
            {/* Left empty by people; bots that fill every field are ignored. */}
            <input className={s.trap} name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <button className={s.submit} type="submit" disabled={sending}>
              {sending ? "Sending…" : site.formEndpoint ? "Send my brief" : configured ? "Prepare my brief" : "Save project brief"}
              <ArrowUpRight />
            </button>
            {saved && (
              <p className={s.status} role="status">
                Your brief has been saved. It’s ready to share.
              </p>
            )}
          </form>
          )}
        </div>
      </dialog>
    </>
  );
}
