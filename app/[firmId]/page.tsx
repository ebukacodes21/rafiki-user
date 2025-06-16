"use client";
import { selectCurrentFirm } from "@/redux/features/firm";
import { useAppSelector } from "@/redux/hooks/typedHooks";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const firm = useAppSelector(selectCurrentFirm);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <div className="p-4 sm:p-6 lg:p-8 rounded-xl overflow-hidden">
        <div className="space-y-4 mt-2">
          <div
            className="opacity-96 rounded-xl relative aspect-square md:aspect-[2.4/1] overflow-hidden"
            style={{
              backgroundImage: `url(${firm?.CoverPhoto})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="h-full w-full flex flex-col justify-center items-center text-center gap-y-8">
              <div className="text-white font-bold text-3xl sm:text-5xl lg:text-6xl sm:max-w-xl max-w-xs">
                {firm?.Name}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section className="py-12 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-4">About Us</h2>
        <p className="text-gray-700">{firm?.Description}</p>
      </section>

      {/* Billboard */}
      {firm?.Billboard?.imageUrl && (
        <section className="py-8 px-6">
          <img
            src={firm?.Billboard.imageUrl}
            alt={firm?.Billboard.label || "Billboard"}
            className="rounded-lg w-full max-w-5xl mx-auto"
          />
          {firm?.Billboard.title && (
            <h3 className="text-xl font-semibold text-center mt-4">
              {firm?.Billboard.title}
            </h3>
          )}
        </section>
      )}

      {/* Contact Section */}
      <section className="py-12 px-6 bg-gray-100">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-2xl font-semibold mb-2">Contact Information</h3>
            <p>
              <strong>Email:</strong> {firm?.Email}
            </p>
            <p>
              <strong>Phone:</strong> {firm?.Phone}
            </p>
            <p>
              <strong>Website:</strong>{" "}
              <a href={firm?.Website} className="text-blue-600">
                {firm?.Website}
              </a>
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-2">Address</h3>
            <p>{firm?.Location}</p>
            <p>
              <strong>Founded:</strong>{" "}
              {firm?.Founded
                ? new Date(firm.Founded).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="py-6 text-center">
        <h4 className="text-xl font-semibold mb-2">Connect With Us</h4>
        <div className="flex justify-center space-x-6">
          {firm?.Instagram && (
            <a
              href={firm?.Instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 hover:text-pink-700"
            >
              <FaInstagram size={24} />
            </a>
          )}
          {firm?.X && (
            <a
              href={firm?.X}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700"
            >
              <FaTwitter size={24} />
            </a>
          )}
          {firm?.Facebook && (
            <a
              href={firm?.Facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:text-blue-900"
            >
              <FaFacebook size={24} />
            </a>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Link
            href={process.env.NEXT_PUBLIC_HOME_URL!}
            target="_blank"
            className="font-semibold"
          >
            Powered by Rafiki — Your Legal Ally
          </Link>
          <p className="text-lg text-gray-300">
            Simplifying legal access for firms, founders, and professionals.
          </p>
          <p className="mt-4 text-sm">
            &copy; {new Date().getFullYear()} {firm?.Name}. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
