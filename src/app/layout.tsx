"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { DataBaseProvider } from "@/hooks/database";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`pt-12 pb-10 !bg-[#BECDE0] ${geistSans.variable} ${geistMono.variable} antialiased`}>
        <DataBaseProvider>
          {children}
        </DataBaseProvider>
      </body>
    </html>
  );
}
