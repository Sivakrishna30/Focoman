import { Order } from "@focoman/types";
import { toMemberWorkView } from "@focoman/domain";
import { getMembersByStudio, getOrdersByStudio, getTasksByMember } from "@focoman/db";
import { DEMO_ORDERS } from "@/lib/demoData";
import { DashboardOverviewView } from "@/features/dashboard/DashboardOverviewView";
import { MemberWorkDashboardView } from "@/features/dashboard/MemberWorkDashboardView";
import { requireDashboardStudioAccess } from "@/lib/dashboardAccess";

function isDemoSlug(slug: string): boolean {
  return slug.toLowerCase() === "demo-studio";
}

export default async function DashboardPage({ params }: { params: Promise<{ studioSlug: string }> }) {
  const { studioSlug } = await params;
  const isDemo = isDemoSlug(studioSlug);

  if (isDemo) {
    return (
      <DashboardOverviewView
        studioSlug={studioSlug}
        initialOrders={DEMO_ORDERS}
      />
    );
  }

  const access = await requireDashboardStudioAccess(studioSlug);
  if (access.membership.role === "STUDIO_MEMBER") {
    const normalizedEmail = access.decoded.email?.trim().toLowerCase();
    const members = await getMembersByStudio(studioSlug);
    const member = normalizedEmail
      ? members.find((candidate) => candidate.status === "ACTIVE" && candidate.email.trim().toLowerCase() === normalizedEmail)
      : undefined;

    if (!member) {
      return <MemberWorkDashboardView studioId={studioSlug} orders={[]} initialTasks={[]} hasCrewProfile={false} />;
    }

    const [memberTasks, studioOrders] = await Promise.all([
      getTasksByMember(studioSlug, member.id),
      getOrdersByStudio(studioSlug),
    ]);
    const memberWork = toMemberWorkView(studioSlug, member.id, studioOrders, memberTasks);

    return (
      <MemberWorkDashboardView
        studioId={studioSlug}
        hasCrewProfile
        orders={memberWork.orders}
        initialTasks={memberWork.tasks}
      />
    );
  }

  const orders: Order[] = await getOrdersByStudio(studioSlug);
  return (
    <DashboardOverviewView
      studioSlug={studioSlug}
      initialOrders={orders}
    />
  );
}
