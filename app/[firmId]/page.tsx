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
      <section
        className="relative w-full h-[60vh] bg-cover bg-center flex items-center justify-center text-white"
        style={{
          backgroundImage: `url(${
            firm?.CoverPhoto || "https://source.unsplash.com/legal"
          })`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center px-6 py-8 bg-white bg-opacity-70 rounded-lg shadow-lg max-w-4xl mx-auto">
          <img
            src={firm?.ProfilePhoto}
            alt={firm?.Name}
            className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-white"
          />
          <h1 className="text-4xl font-extrabold text-gray-800">
            {firm?.Name}
          </h1>
          <p className="text-lg mt-2 text-gray-600">{firm?.Category}</p>
        </div>
      </section>

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
          <Link href={process.env.NEXT_PUBLIC_HOME_URL!} target="_blank" className="font-semibold">Powered by Rafiki — Your Legal Ally</Link>
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
