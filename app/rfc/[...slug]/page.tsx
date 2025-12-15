import { generateSectionStaticParams, SectionDocPage } from "@/app/_shared/doc-page";

export const dynamicParams = false;

export async function generateStaticParams() {
  return generateSectionStaticParams("rfc");
}

export default async function Page({ params }: { params: { slug: string[] } }) {
  return SectionDocPage({ section: "rfc", slug: params.slug });
}
