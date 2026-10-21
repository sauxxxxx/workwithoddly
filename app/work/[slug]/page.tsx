import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Redirect } from "@/components/nav/Redirect";
import { projectBySlug, projects } from "@/content/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) return {};
  // The project's own page is the one to index.
  return { title: p.name, alternates: { canonical: `/projects/${p.slug}/` } };
}

/** Project pages moved to /projects/<slug>/; older links (the home stage among them) land here. */
export default async function MovedCase({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) notFound();
  return <Redirect to={`/projects/${p.slug}/`} label={p.name} />;
}
