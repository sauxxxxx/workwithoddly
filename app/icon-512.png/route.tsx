import { appIconImage } from "@/components/seo/appIconImage";

/* /icon-512.png: the web manifest icon, large. */

export const dynamic = "force-static";

export function GET() {
  return appIconImage(512, "rounded");
}
