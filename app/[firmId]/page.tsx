"use client";
import { selectCurrentFirm } from "@/redux/features/firm";
import { useAppSelector } from "@/redux/hooks/typedHooks";
import { useEffect, useState } from "react";

export default function Home() {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const firm = useAppSelector(selectCurrentFirm);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <section
        className="w-full h-[60vh] bg-cover bg-center flex items-center justify-center text-white"
        style={{
          backgroundImage: `url(${
            firm?.coverPhoto || "https://source.unsplash.com/legal"
          })`,
        }}
      >
        <div className="bg-black bg-opacity-60 p-8 rounded-md text-center max-w-xl">
          <img
            src={firm?.profilePhoto}
            alt={firm?.name}
            className="w-20 h-20 mx-auto mb-4 rounded-full border-4 border-white"
          />
          <h1 className="text-4xl font-bold">{firm?.name}</h1>
          <p className="text-lg mt-2">{firm?.category}</p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-4">About Us</h2>
        <p className="text-gray-700">{firm?.description}</p>
      </section>

      {/* Billboard */}
      {firm?.billboard?.imageUrl && (
        <section className="py-8 px-6">
          <img
            src={firm?.billboard.imageUrl}
            alt={firm?.billboard.label || "Billboard"}
            className="rounded-lg w-full max-w-5xl mx-auto"
          />
          {firm?.billboard.title && (
            <h3 className="text-xl font-semibold text-center mt-4">
              {firm?.billboard.title}
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
              <strong>Email:</strong> {firm?.email}
            </p>
            <p>
              <strong>Phone:</strong> {firm?.phone}
            </p>
            <p>
              <strong>Website:</strong>{" "}
              <a href={firm?.website} className="text-blue-600">
                {firm?.website}
              </a>
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-2">Address</h3>
            <p>{firm?.location}</p>
            <p>
              <strong>Founded:</strong>{" "}
              {new Date(firm?.founded!).toLocaleDateString()}
            </p>
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="py-6 text-center">
        <h4 className="text-xl font-semibold mb-2">Connect With Us</h4>
        <div className="flex justify-center space-x-4">
          {firm?.instagram && (
            <a
              href={firm?.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500"
            >
              Instagram
            </a>
          )}
          {firm?.x && (
            <a
              href={firm?.x}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              X (Twitter)
            </a>
          )}
          {firm?.facebook && (
            <a
              href={firm?.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700"
            >
              Facebook
            </a>
          )}
        </div>
      </section>
    </main>
  );
}
