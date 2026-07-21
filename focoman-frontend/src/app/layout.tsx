import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Focoman",
  description: "Business operating system for photography studios",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
