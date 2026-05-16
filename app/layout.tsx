/**
 * Root layout.
 * Loads Open Sans via next/font, sets white background, declares metadata,
 * and renders the app inside the global Tailwind font class.
 */

import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: "SoloPilot — Tax Savings Estimator",
  description:
    "See how much you could save in self-employment tax by optimizing your business structure.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${openSans.variable} font-sans`}>
      <body className="min-h-screen bg-page antialiased text-textPrimary">
        {children}
      </body>
    </html>
  );
}
