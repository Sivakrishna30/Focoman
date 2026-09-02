import { DashboardSidebar } from "@/components/DashboardSidebar";

const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV || "local";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ studioSlug: string }>;
}) {
  const { studioSlug } = await params;

  return (
    <div className="flex h-screen overflow-hidden bg-surface-app">
      <DashboardSidebar
        studioSlug={studioSlug}
        plan="professional"
        studioName={studioSlug}
        ownerName=""
        appEnv={APP_ENV}
      />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
