import Image from "next/image";
import s from "./sculpture-still.module.css";

/** Authored geometry rendered to an alpha still for mobile and unavailable WebGL. */
export function SculptureStill({
  form,
  className = "",
  always = false,
}: {
  form: "loop" | "twist" | "knot";
  className?: string;
  always?: boolean;
}) {
  return (
    <Image
      src={`/art/forms/${form}.webp`}
      alt=""
      width="1800"
      height="1800"
      loading="lazy"
      className={`${s.form} ${always ? s.always : ""} ${className}`}
    />
  );
}
