"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

type AdUnitProps = {
  slot: string;
  format?: string;
  responsive?: boolean;
  className?: string;
};

export default function AdUnit({
  slot,
  format = "auto",
  responsive = true,
  className = "",
}: AdUnitProps) {
  const pathname = usePathname();
  const insRef = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      if (!insRef.current) return;
      if (insRef.current.getAttribute("data-adsbygoogle-status") === "done") return;
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
    }
  }, [pathname, slot]);

  return (
    <div className={`my-8 flex justify-center min-h-[100px] ${className}`}>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
        data-ad-client="ca-pub-5211865118198179"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
