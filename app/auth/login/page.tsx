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
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
};

export default LoginPage;
