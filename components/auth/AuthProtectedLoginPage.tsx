"use client";

import { useAuthProtection } from "@/lib/client-auth";
import { ReactNode } from "react";

export function AuthProtectedLoginPage({ children }: { children: ReactNode }) {

  useAuthProtection();

  return <>{children}</>;
} 