import { generateSectionStaticParams, SectionDocPage } from "@/app/_shared/doc-page";

export const dynamicParams = false;

export async function generateStaticParams() {
  return generateSectionStaticParams("docs");
}

export default async function Page({ params }: { params: { slug: string[] } }) {
  return SectionDocPage({ section: "docs", slug: params.slug });
}
