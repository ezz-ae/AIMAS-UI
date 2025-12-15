import { generateSectionStaticParams, SectionDocPage } from "@/app/_shared/doc-page";

export const dynamicParams = false;

export async function generateStaticParams() {
  return generateSectionStaticParams("compliance");
}

export default async function Page({ params }: { params: { slug: string[] } }) {
  return SectionDocPage({ section: "compliance", slug: params.slug });
}
