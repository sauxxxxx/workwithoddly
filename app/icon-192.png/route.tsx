import { appIconImage } from "@/components/seo/appIconImage";

/* /icon-192.png: the web manifest icon, small. */

export const dynamic = "force-static";

export function GET() {
  return appIconImage(192, "rounded");
}
