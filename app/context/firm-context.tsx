"use client";
import { createContext, useContext } from "react";

export const FirmContext = createContext<any>(null);

export const useFirm = () => {
  const context = useContext(FirmContext);
  if (!context) throw new Error("useFirm must be used within a FirmProvider");
  return context;
};
