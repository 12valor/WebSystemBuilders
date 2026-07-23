import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://websystembuilders.com"),
  title: {
    default: "WebSystemBuilders — Systems for students and businesses",
    template: "%s | WebSystemBuilders",
  },
  description:
    "WebSystemBuilders helps students and business owners access ready-made software systems and request custom development through one professional platform.",
  icons: {
    icon: "/brand/favicon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={geist.variable}>
      <body>{children}</body>
    </html>
  );
}