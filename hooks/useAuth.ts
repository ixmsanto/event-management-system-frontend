// frontend/hooks/useAuth.ts
"use client";

import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";

export function useAuth() {
  const context = useContext(AuthContext);
  const router = useRouter();

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { token, isLoading } = context;

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/login");
    }
  }, [token, isLoading, router]);

  return context;
}