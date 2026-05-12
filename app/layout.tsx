import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import Header from '@/app/components/Header';






const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Luna & Clean Shop",
  description: "Reinigungsprodukte im modernen Storefront-Design",
  manifest: "./app/manifest.json",
  
};






export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   
    <html lang="de"> 
      <body 
        className={`${manrope.variable} ${fraunces.variable} antialiased`}>
        <Header />
        {children}
        </body>
    </html>
  );
}
