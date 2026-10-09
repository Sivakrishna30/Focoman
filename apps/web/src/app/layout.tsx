import type { Metadata } from "next";
import "./globals.css";
import "@/styles/retro-theme.css";
import { SessionSyncProvider } from "@/components/SessionSyncProvider";

export const metadata: Metadata = {
  title: "Focoman",
  description: "Business operating system for photography studios",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="retro-ui" data-ui-style="retro" suppressHydrationWarning>
      <body className="retro-ui" suppressHydrationWarning>
        <SessionSyncProvider>
          {children}
        </SessionSyncProvider>
      </body>
    </html>
  );
}
