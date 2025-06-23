"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ClipLoader } from "react-spinners";

export default function Home() {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    if (!slug) return;
    setIsLoading(true);
    router.push(`/${slug}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black via-zinc-900 to-black text-white">
      <div className="w-full max-w-3xl px-6 text-center">
        <h1 className="text-5xl font-bold mb-4 tracking-tight">Rafiki</h1>
        <p className="text-lg text-gray-400 mb-2">
          Powering Law Firms in the Cloud.
        </p>
        <p className="text-md text-gray-300 mb-10">
          Instantly connect with a lawyer. Enter the slug of the law firm you&apos;ve been referred to.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-xl mx-auto">
          <Input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. a9fj-lq3z"
            className="w-full sm:w-2/3 px-4 py-3 rounded-md border border-gray-700 bg-black text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <Button
            onClick={handleSearch}
            disabled={isLoading || !slug}
            className="bg-white text-black px-6 py-3 cursor-pointer rounded font-semibold hover:bg-gray-200 transition"
          >
            {isLoading ? <ClipLoader size={16} color="black" /> : "Search Firm"}
          </Button>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          You’ll be redirected to the law firm’s client portal.
        </p>
      </div>

      {/* Footer */}
      <footer className="mt-20 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Rafiki. Helping you connect with legal help — securely.</p>
        <div className="mt-2 space-x-4">
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Terms</a>
          <a href="#" className="hover:underline">Support</a>
        </div>
      </footer>
    </div>
  );
}
