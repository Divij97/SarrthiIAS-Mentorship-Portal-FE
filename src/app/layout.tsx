import type { Metadata } from "next";
import { Jost } from 'next/font/google';
import "./globals.css";
import RootLayoutClient from "@/components/RootLayoutClient";

// Initialize the Jost font with subsets and variable features
const jost = Jost({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jost',
});

export const metadata: Metadata = {
  title: "Sarrthi IAS Mentorship Program",
  description: "Join our mentorship program to enhance your UPSC preparation journey",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jost.variable}>
      <body className={jost.className}>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
