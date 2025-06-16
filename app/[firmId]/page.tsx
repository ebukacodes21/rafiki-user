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

  if (!isMounted || !firm) return null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-200 text-gray-900">
      {/* Hero Banner */}
      <section className="p-6 sm:p-10 lg:p-16 relative rounded-xl overflow-hidden">
        <div
          className="relative aspect-square md:aspect-[2.4/1] rounded-xl overflow-hidden shadow-lg"
          style={{
            backgroundImage: `url(${firm.CoverPhoto})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent" />
          <div className="relative h-full w-full flex flex-col justify-center items-center text-center px-4">
            <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-bold max-w-3xl drop-shadow-lg">
              {firm.Name}
            </h1>
            <p className="text-white/90 text-md sm:text-lg mt-4 max-w-xl">
              Modern legal guidance. Personalized service. Built on trust.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center bg-gradient-to-b from-white via-gray-100 to-white">
        <h2 className="text-3xl font-bold mb-4">About Our Practice</h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          {firm.Description ||
            "We’re a future-ready legal practice, dedicated to clarity, integrity, and meaningful client outcomes."}
        </p>
      </section>

      {/* Billboard */}
      {firm.Billboard?.imageUrl && (
        <section className="py-14 px-6 bg-gradient-to-r from-gray-100 to-white">
          <img
            src={firm.Billboard.imageUrl}
            alt={firm.Billboard.label || "Firm Billboard"}
            className="rounded-lg w-full max-w-5xl mx-auto shadow-md"
          />
          {firm.Billboard.title && (
            <h3 className="text-xl font-semibold text-center mt-6 text-gray-800">
              {firm.Billboard.title}
            </h3>
          )}
        </section>
      )}

      {/* Contact & Location */}
      <section className="py-20 px-6 bg-gradient-to-br from-white via-gray-50 to-gray-200">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-800 text-md">
              <li><strong>Email:</strong> {firm.Email}</li>
              <li><strong>Phone:</strong> {firm.Phone}</li>
              <li>
                <strong>Website:</strong>{" "}
                <a
                  href={firm.Website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {firm.Website}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-4">Visit Our Office</h3>
            <p className="text-gray-800">{firm.Location}</p>
            <p className="mt-2 text-gray-700">
              <strong>Founded:</strong>{" "}
              {firm.Founded
                ? new Date(firm.Founded).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-10 text-center bg-gradient-to-t from-white to-gray-100">
        <h4 className="text-xl font-semibold mb-3 text-gray-800">
          Connect With Us
        </h4>
        <div className="flex justify-center space-x-6">
          {firm.Instagram && (
            <a
              href={firm.Instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 hover:text-pink-700"
            >
              <FaInstagram size={24} />
            </a>
          )}
          {firm.X && (
            <a
              href={firm.X}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700"
            >
              <FaTwitter size={24} />
            </a>
          )}
          {firm.Facebook && (
            <a
              href={firm.Facebook}
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
      <footer className="py-12 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <Link
            href={process.env.NEXT_PUBLIC_HOME_URL || "/"}
            target="_blank"
            className="font-semibold hover:underline"
          >
            Powered by Rafiki — Your Legal Ally
          </Link>
          <p className="text-sm text-gray-400">
            Built to help legal teams scale, serve, and succeed.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            &copy; {new Date().getFullYear()} {firm.Name}. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}