import { appIconImage } from "@/components/seo/appIconImage";

/* /icon-maskable.png: the web manifest icon Android may crop to its own shape. */

export const dynamic = "force-static";

export function GET() {
  return appIconImage(512, "maskable");
}
