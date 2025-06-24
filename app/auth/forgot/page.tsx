"use client";
import { ForgotForm } from "@/components/auth/forgot";
import { routes } from "@/constants";
import { selectCurrentFirm } from "@/redux/features/firm";
import { useAppSelector } from "@/redux/hooks/typedHooks";
import Link from "next/link";
import React, { Suspense, useEffect, useState } from "react";

const ForgotPage = () => {
  const firm = useAppSelector(selectCurrentFirm);
  const [mounted, setIsMounted] = useState<boolean>();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!mounted) return null;

  return (
        <Suspense fallback={<div>Loading...</div>}>
        {" "}
        <ForgotForm />
      </Suspense>
  );
};

export default ForgotPage;