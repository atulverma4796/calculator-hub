"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

interface Props {
  defaults: Record<string, string | number>;
  children: React.ReactNode;
}

/**
 * Injects variant default values into URL params on first mount,
 * ONLY if the user hasn't already set their own params (e.g., via a shared link).
 * The calculator components then read these params via useInitialParams().
 */
export default function VariantDefaults({ defaults, children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const applied = useRef(false);

  useEffect(() => {
    // Only inject defaults if user hasn't provided their own params
    if (applied.current || searchParams.toString().length > 0) return;
    applied.current = true;

    const sp = new URLSearchParams();
    for (const [key, value] of Object.entries(defaults)) {
      sp.set(key, String(value));
    }
    const qs = sp.toString();
    if (qs) {
      router.replace(`${pathname}?${qs}`, { scroll: false });
    }
  }, [defaults, pathname, router, searchParams]);

  return <>{children}</>;
}
