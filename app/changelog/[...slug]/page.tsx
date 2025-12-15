import { generateSectionStaticParams, SectionDocPage } from "@/app/_shared/doc-page";

export const dynamicParams = false;

export async function generateStaticParams() {
  return generateSectionStaticParams("changelog");
}

export default async function Page({ params }: { params: { slug: string[] } }) {
  return SectionDocPage({ section: "changelog", slug: params.slug });
}
