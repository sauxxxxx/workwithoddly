"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "@/components/Icons";
import type { FeaturedClip } from "@/content/projects/creative";
import s from "./clip-player.module.css";

/**
 * The full edit, with sound, over the page: a native dialog (focus is held
 * inside, Escape closes), arrows (and the arrow keys) to step through the
 * clips, and a link to the clip's project. The page stops scrolling while it
 * is open and gets its focus back on close.
 */
export function ClipPlayer({
  clips,
  index,
  onClose,
  onStep,
}: {
  clips: FeaturedClip[];
  index: number | null;
  onClose: () => void;
  onStep: (to: number) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const clip = index === null ? null : clips[index];

  // Open and close with the index; hold the page still while open.
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (index !== null && !d.open) {
      d.dataset.overflow = document.documentElement.style.overflow;
      d.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (index === null && d.open) d.close();
  }, [index]);

  // A new clip starts from the top, with sound (the click allows it).
  useEffect(() => {
    const v = video.current;
    if (!v || !clip) return;
    v.currentTime = 0;
    void v.play().catch(() => {});
  }, [clip]);

  const step = (by: number) => {
    if (index === null) return;
    onStep((index + by + clips.length) % clips.length);
  };

  return (
    <dialog
      ref={dialog}
      className={s.player}
      aria-label={clip ? `${clip.project.name}: video` : "Video"}
      data-scroll-native
      onClose={() => {
        video.current?.pause();
        document.documentElement.style.overflow = dialog.current?.dataset.overflow ?? "";
        onClose();
      }}
      onClick={(e) => {
        if (e.target === dialog.current) dialog.current?.close();
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") step(1);
        if (e.key === "ArrowLeft") step(-1);
      }}
    >
      {clip && (
        <div className={s.stage}>
          <video
            ref={video}
            key={clip.media.src}
            className={s.video}
            src={clip.media.src ?? undefined}
            poster={clip.media.poster}
            controls
            playsInline
            aria-label={clip.media.alt}
            style={{ aspectRatio: clip.media.ratio.replace("/", " / ") }}
          />
          <div className={s.bar}>
            <p className={s.caption}>
              <span>{clip.project.name}</span>
              <Link href={`/projects/${clip.project.slug}/`} className={s.link} onClick={() => dialog.current?.close()}>
                View project <ArrowUpRight />
              </Link>
            </p>
            <div className={s.controls}>
              <span className={s.count}>
                {String((index ?? 0) + 1).padStart(2, "0")} / {String(clips.length).padStart(2, "0")}
              </span>
              <button type="button" className={s.round} onClick={() => step(-1)} aria-label="Previous video">
                <ArrowLeft />
              </button>
              <button type="button" className={s.round} onClick={() => step(1)} aria-label="Next video">
                <ArrowRight />
              </button>
              <button type="button" className={`${s.round} ${s.close}`} onClick={() => dialog.current?.close()} aria-label="Close video">
                ×
              </button>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
