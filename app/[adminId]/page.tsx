"use client";

import { routes } from "@/constants";
import { selectCurrentFirm } from "@/redux/features/firm";
import { useAppSelector } from "@/redux/hooks/typedHooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const firm = useAppSelector(selectCurrentFirm);
  const router = useRouter();
  console.log(firm);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !firm) return null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-200 text-gray-900">
      {/* Hero Banner */}
      <div className="flex px-2 py-3 flex-wrap justify-end gap-4">
        <button
          onClick={() =>
            router.push(`/68529197c0ae48884d78da6a/${routes.LOGIN}`)
          }
          className="bg-white text-gray-900 px-6 py-2 rounded-lg font-semibold shadow hover:bg-gray-100 transition"
        >
          Login / Signup
        </button>
        <button
          onClick={() =>
            router.push(`/68529197c0ae48884d78da6a/${routes.SIGNUP}`)
          }
          className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-red-600 transition"
        >
          Continue with Google
        </button>
      </div>
      <section className="p-6 sm:p-10 lg:p-16 relative rounded-xl overflow-hidden">
        <div
          className="relative aspect-square md:aspect-[2.4/1] rounded-xl overflow-hidden shadow-lg"
          style={{
            backgroundImage: `url(${firm.billboard?.image})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent" />
          <div className="relative h-full w-full flex flex-col justify-center items-center text-center px-4">
            <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-bold max-w-3xl drop-shadow-lg">
              {firm.name}
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
          {firm.description ||
            "We’re a future-ready legal practice, dedicated to clarity, integrity, and meaningful client outcomes."}
        </p>
      </section>

      {/* Contact & Location */}
      <section className="py-20 px-6 bg-gradient-to-br from-white via-gray-50 to-gray-200">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-800 text-md">
              <li>
                <strong>Email:</strong> {firm.email}
              </li>
              <li>
                <strong>Phone:</strong> {firm.phone}
              </li>
              <li>
                <strong>Website:</strong>{" "}
                <a
                  href={firm.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {firm.website}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-4">Visit Our Office</h3>
            <p className="text-gray-800">{firm.location}</p>
            <p className="mt-2 text-gray-700">
              <strong>Founded:</strong>{" "}
              {firm.founded
                ? new Date(firm.founded).toLocaleDateString()
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
          {firm.instagram && (
            <a
              href={firm.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 hover:text-pink-700"
            >
              <FaInstagram size={24} />
            </a>
          )}
          {firm.x && (
            <a
              href={firm.x}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700"
            >
              <FaTwitter size={24} />
            </a>
          )}
          {firm.facebook && (
            <a
              href={firm.facebook}
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
            &copy; {new Date().getFullYear()} {firm.name}. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
