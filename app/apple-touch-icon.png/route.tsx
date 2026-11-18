import { appIconImage } from "@/components/seo/appIconImage";

/* /apple-touch-icon.png: the iPhone and iPad home-screen icon (Safari also asks for this path by default). */

export const dynamic = "force-static";

export function GET() {
  return appIconImage(180, "square");
}
