import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import ReduxProvider from "@/redux/hooks/provider";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/redux/hooks/themeProvider";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata() {
  return {
    title: "Rafiki",
    description: "Connecting you to Legal Practitioners",
  };
}

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
         className={`${inter.variable} antialiased`}
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
