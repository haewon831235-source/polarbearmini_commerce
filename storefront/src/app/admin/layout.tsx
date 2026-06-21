import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "../globals.css";

// Admin is a NON-localized subtree. Because the storefront has no root
// src/app/layout.tsx (only [locale]/layout.tsx emits <html>), this layout owns
// its own <html>/<body>. Korean-only: no NextIntlClientProvider, no site
// header/footer, no analytics. The auth guard lives in (protected)/layout.tsx
// so /admin/login stays reachable without a redirect loop.
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "관리자 · Polaris Atelier",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-muted/30 font-sans">{children}</body>
    </html>
  );
}
