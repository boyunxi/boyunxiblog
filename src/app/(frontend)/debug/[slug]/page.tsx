import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DebugPage({ params }: { params: { slug: string } }) {
  const chars = Array.from(params.slug, (c) => c.codePointAt(0)?.toString(16));
  const tag = await prisma.tag.findUnique({ where: { slug: params.slug } });

  return (
    <div style={{ padding: 40, fontFamily: "monospace", fontSize: 14 }}>
      <h1>Page Debug</h1>
      <pre>params.slug = {JSON.stringify(params.slug)}</pre>
      <pre>chars = [{chars.join(",")}]</pre>
      <pre>tagFound = {JSON.stringify(tag ? { id: tag.id, name: tag.name } : null)}</pre>
      <pre>slugLength = {params.slug.length}</pre>
    </div>
  );
}
