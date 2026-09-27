import { Order } from "@focoman/types";
import { getOrdersByStudio } from "@focoman/db";
import { DEMO_ORDERS } from "@/lib/demoData";
import { BusinessReportsView } from "@/features/dashboard/BusinessReportsView";
import { requireDashboardStudioAccess } from "@/lib/dashboardAccess";

function isDemoSlug(slug: string): boolean {
  return slug.toLowerCase() === "demo-studio";
}

export default async function ReportsPage({
  params,
}: {
  params: Promise<{ studioSlug: string }>;
}) {
  const { studioSlug } = await params;
  const isDemo = isDemoSlug(studioSlug);

  if (!isDemo) {
    await requireDashboardStudioAccess(studioSlug, "STUDIO_OWNER");
  }

  let orders: Order[] = [];
  if (isDemo) {
    orders = DEMO_ORDERS;
  } else {
    orders = await getOrdersByStudio(studioSlug);
  }

  return (
    <BusinessReportsView
      studioSlug={studioSlug}
      initialOrders={orders}
    />
  );
}
