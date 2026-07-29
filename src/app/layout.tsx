import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { LenisProvider } from "@/components/layout/lenis-provider";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://websystembuilders.com"),
  title: {
    default: "WebSystemBuilders — Handcrafted Systems for Students & Businesses",
    template: "%s | WebSystemBuilders",
  },
  description:
    "Discover ready-made software systems and request custom software development through a handcrafted, high-trust marketplace.",
  icons: {
    icon: "/brand/favicon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className="font-sans antialiased text-slate-900 bg-white selection:bg-blue-600 selection:text-white">
        <a
          href="#main-content"
          className="fixed left-4 top-3 z-[200] -translate-y-24 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-transform focus:translate-y-0 shadow-lg"
        >
          Skip to main content
        </a>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}