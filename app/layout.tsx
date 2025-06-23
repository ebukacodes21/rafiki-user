import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import ReduxProvider from "@/redux/hooks/provider";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/redux/hooks/themeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ adminId: string }>;
}): Promise<Metadata> {
  return {
    title: "Rafiki",
    description: "Connecting you to Legal Practitioners",
  };
}

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster position="top-center" />
            {children}
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
