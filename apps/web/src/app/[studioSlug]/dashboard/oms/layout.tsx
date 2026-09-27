import { requireDashboardOwnerAccess } from "@/lib/dashboardAccess";

export default async function OwnerOmsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ studioSlug: string }>;
}) {
  const { studioSlug } = await params;
  await requireDashboardOwnerAccess(studioSlug);
  return children;
}
