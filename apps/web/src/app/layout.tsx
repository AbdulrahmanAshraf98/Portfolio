import type { Metadata } from "next";
import { Cairo, Great_Vibes } from "next/font/google";
import { RegisterSW } from "@/components/RegisterSW";
import "./globals.css";

const cairo = Cairo({
  subsets: ["latin", "arabic"],
  variable: "--font-cairo",
  display: "swap",
});

const signature = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-signature",
  display: "swap",
});

export const viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio-mauve-gamma-79.vercel.app"),
  title: "Abdulrhman Ashraf | Senior Backend Software Engineer",
  description:
    "Senior Backend Software Engineer specializing in NestJS, GraphQL, PostgreSQL, and secure microservices in regulated banking environments.",
  applicationName: "AS Portfolio",
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cairo.variable} ${signature.variable}`}>
      <body className="font-sans bg-black text-white">
        <RegisterSW />
        {children}
      </body>
    </html>
  );
}
