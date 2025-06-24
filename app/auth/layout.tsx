import ReduxProvider from "@/redux/hooks/reduxProvider";
import { Geist, Geist_Mono } from "next/font/google";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <Toaster position="top-center" />
          <div className="w-full md:w-1/2 mx-auto pb-10 flex items-center justify-center h-full">
            {children}
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}
