import { Wordmark } from "@/components/Wordmark";
import s from "./studio-studies.module.css";

/** Original ODDLY art direction studies, never attributed to a client campaign. */
export function StudioStudies() {
  return (
    <div
      className={s.studies}
      aria-label="Original ODDLY typographic studies"
      data-studies
    >
      <div className={`${s.poster} ${s.first}`} data-study="first">
        <p>ODDLY / Studio study 01</p>
        <strong className="display">
          Different
          <br />
          by design
          <span className="dot" />
        </strong>
        <Wordmark className={s.mark} />
      </div>
      <div className={`${s.poster} ${s.second}`} data-study="second">
        <p>ODDLY / Studio study 02</p>
        <strong className="display">
          Built
          <br />
          for
          <br />
          better
          <span className="dot" />
        </strong>
        <span className={s.star} aria-hidden="true">
          ✳
        </span>
      </div>
      <p className={s.caption}>ODDLY / Original studio studies</p>
    </div>
  );
}
