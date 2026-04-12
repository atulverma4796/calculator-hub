"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

/**
 * Hides its children on /embed/[slug] routes.
 * Used to strip header, footer, and other chrome from embedded calculator pages.
 */
export default function HideOnEmbed({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // Hide on /embed/emi, /embed/sip, etc. but NOT on /embed (the docs page)
  const isEmbedCalc = /^\/embed\/[^/]+$/.test(pathname) && pathname !== "/embed";

  if (isEmbedCalc) return null;

  return <>{children}</>;
}
