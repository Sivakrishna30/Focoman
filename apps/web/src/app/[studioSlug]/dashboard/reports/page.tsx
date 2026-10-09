import { Order } from "@focoman/types";
import { getOrdersByStudio } from "@focoman/db";
import { BusinessReportsView } from "@/features/dashboard/BusinessReportsView";
import { requireDashboardStudioAccess } from "@/lib/dashboardAccess";

export default async function ReportsPage({
  params,
}: {
  params: Promise<{ studioSlug: string }>;
}) {
  const { studioSlug } = await params;
  await requireDashboardStudioAccess(studioSlug, "STUDIO_OWNER");

  const orders = (await getOrdersByStudio(studioSlug)) as Order[];

  return (
    <BusinessReportsView
      studioSlug={studioSlug}
      initialOrders={orders}
    />
  );
}
