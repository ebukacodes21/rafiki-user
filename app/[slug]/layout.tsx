import type { Metadata } from "next";
import { ReactNode } from "react";
import ReduxProvider from "@/redux/hooks/provider";
import ReduxInitializer from "@/redux/hooks/initializer";
import type { Firm } from "@/types";
import { Toaster } from "react-hot-toast";
import { routes } from "@/constants";

async function getFirm(slug: string): Promise<Firm | null> {
  const baseUrl = process.env.RAFIKI_FIRM_API_URL;
  if (!baseUrl) throw new Error("missing RAFIKI_FIRM_API_URL");

  const res = await fetch(`${baseUrl}/firm/public?slug=${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    await res.text();
    console.log("failed to fetch firm:", res.status);
    return null;
  }

  return res.json();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const firm = await getFirm(slug);

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

export default async function PortalLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const firm = await getFirm(slug);

  if (!firm) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black text-white px-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Firm Not Found</h1>
        <p className="text-gray-300 text-lg mb-6">
          We couldn&apos;t locate the law firm you&apos;re looking for.
        </p>
        <a
          href={routes.HOME}
          className="inline-block bg-white text-black px-2 py-3 rounded-md font-semibold shadow hover:bg-gray-200 transition"
        >
          Return to Homepage
        </a>
      </main>
    );
  }

  return (
    <ReduxProvider>
      <ReduxInitializer firm={firm} />
      <Toaster position="top-center" />
      {children}
    </ReduxProvider>
  );
}
