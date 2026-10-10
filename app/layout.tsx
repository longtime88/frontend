import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import Header from '@/app/components/Header';
import Footer from "@/app/components/Footer";






const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Molinka — Digitale Produkte & Shopware",
  description: "Digitale Produkte, Shopware-Lösungen und persönlicher Support für moderne Projekte.",
  manifest: "./app/manifest.json",
  
};






export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body suppressHydrationWarning className={`${manrope.variable} ${fraunces.variable} flex min-h-screen flex-col antialiased`}>
        <Header />
        <main className="mx-auto w-full flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
