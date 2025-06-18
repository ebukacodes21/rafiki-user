import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import ReduxProvider from "@/redux/hooks/provider";
import ReduxInitializer from "@/redux/hooks/initializer"; 
import type { Firm } from "@/types"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

async function getFirm(adminId: string): Promise<Firm | null> {
  const baseUrl = process.env.RAFIKI_FIRM_API_URL;
  if (!baseUrl) throw new Error("missing RAFIKI_FIRM_API_URL");

  const res = await fetch(`${baseUrl}/firm/admin-firm?id=${adminId}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("failed to fetch firm:", res.status, body);
    return null;
  }

  return res.json();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ adminId: string }>;
}): Promise<Metadata> {
  const { adminId } = await params;
  const firm = await getFirm(adminId);

  if (!firm) {
    return {
      title: "Firm not found",
      description: "This firm could not be loaded.",
    };
  }

  return {
    title: firm.name,
    description: firm.description,
  };
}

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ adminId: string }>;
}) {
  const { adminId } = await params;
  const firm = await getFirm(adminId);

  if (!firm) {
    return (
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <main className="min-h-screen flex items-center justify-center">
            <p>Firm not found.</p>
          </main>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ReduxProvider>
          <ReduxInitializer firm={firm} />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}