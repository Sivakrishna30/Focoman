import { notFound } from "next/navigation";
import { DashboardSidebar } from "@/components/DashboardSidebar";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV || "local";

export default async function DashboardLayout({ children, params }: { children: React.ReactNode; params: Promise<{ studioSlug: string }> }) {
  const { studioSlug } = await params;
  const response = await fetch(`${BACKEND_URL}/api/studios/${encodeURIComponent(studioSlug)}`, { cache: "no-store" });
  if (!response.ok) notFound();
  const studio = await response.json();
  return <div className="flex h-screen overflow-hidden bg-surface-app"><DashboardSidebar studioSlug={studioSlug} plan="professional" studioName={studio.studioName} ownerName={studio.ownerName} appEnv={APP_ENV} /><main className="flex-1 overflow-y-auto">{children}</main></div>;
}
