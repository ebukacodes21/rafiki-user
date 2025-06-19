"use client";
import { LoginForm } from "@/components/auth/login";
import { routes } from "@/constants";
import { selectCurrentFirm } from "@/redux/features/firm";
import { useAppSelector } from "@/redux/hooks/typedHooks";
import Link from "next/link";
import React, { Suspense, useEffect, useState } from "react";

const LoginPage = () => {
  const firm = useAppSelector(selectCurrentFirm);
  const [mounted, setIsMounted] = useState<boolean>();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-white to-gray-900 flex items-center justify-center">
      <Link
        href={`${routes.HOME}${firm?.adminId}`}
        className="absolute top-6 left-6 text-3xl font-bold text-gray-900"
      >
        {firm?.name}
      </Link>

      <Suspense fallback={<div>Loading...</div>}>
        {" "}
        <LoginForm />
      </Suspense>
    </div>
  );
};

export default LoginPage;
