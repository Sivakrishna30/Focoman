import { redirect } from "next/navigation";

export default async function LegacyStudioProfileRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/studios/${encodeURIComponent(slug)}`);
}
