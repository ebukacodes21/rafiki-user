"use client";
import { ResetForm } from "@/components/auth/reset";
import { routes } from "@/constants";
import { selectCurrentFirm } from "@/redux/features/firm";
import { useAppSelector } from "@/redux/hooks/typedHooks";
import Link from "next/link";
import React, { Suspense, useEffect, useState } from "react";

const ResetPage = () => {
  const firm = useAppSelector(selectCurrentFirm);
  const [mounted, setIsMounted] = useState<boolean>();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!mounted) return null;

  return (
     <Suspense fallback={<div>Loading...</div>}>
        {" "}
        <ResetForm />
      </Suspense>
  );
};

export default ResetPage;
