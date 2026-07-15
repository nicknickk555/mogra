import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const incoming = await headers();
  const host = incoming.get("x-forwarded-host") ?? incoming.get("host") ?? "localhost:5173";
  const protocol = incoming.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);
  return {
    metadataBase: base,
    title: "Yellow Target · Moisture Gradient Explorer",
    description: "Interactive Venturi Carpet Technology model for moisture gradients, cone fill and root pruning points.",
    openGraph: { title: "Yellow Target Intro · Enter the living model", description: "Cone Interface → Ruby Target → Moisture Explorer.", images: [{ url: "/og-v2.png", width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title: "Yellow Target Intro · Enter the living model", description: "A three-stage portal into the live moisture model.", images: ["/og-v2.png"] },
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
