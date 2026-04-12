"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CALCULATOR_LIST } from "@/lib/calculators";

interface Props {
  currentSlug: string;
}

export default function MobileSwipeNav({ currentSlug }: Props) {
  const router = useRouter();
  const touchRef = useRef<{ startX: number; startY: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const currentCalc = CALCULATOR_LIST.find((c) => c.slug === currentSlug);
  const sameCategory = CALCULATOR_LIST.filter((c) => c.category === currentCalc?.category);
  const currentIndex = sameCategory.findIndex((c) => c.slug === currentSlug);

  const prev = currentIndex > 0 ? sameCategory[currentIndex - 1] : null;
  const next = currentIndex < sameCategory.length - 1 ? sameCategory[currentIndex + 1] : null;

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    function handleTouchStart(e: TouchEvent) {
      touchRef.current = { startX: e.touches[0].clientX, startY: e.touches[0].clientY };
    }

    function handleTouchEnd(e: TouchEvent) {
      if (!touchRef.current) return;
      const dx = e.changedTouches[0].clientX - touchRef.current.startX;
      const dy = e.changedTouches[0].clientY - touchRef.current.startY;

      // Only swipe if horizontal movement is dominant and > 80px
      if (Math.abs(dx) > 80 && Math.abs(dx) > Math.abs(dy) * 2) {
        if (dx < 0 && next) {
          router.push(`/calculator/${next.slug}`);
        } else if (dx > 0 && prev) {
          router.push(`/calculator/${prev.slug}`);
        }
      }
      touchRef.current = null;
    }

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isMobile, prev, next, router]);

  if (sameCategory.length <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 md:hidden">
      {prev ? (
        <Link href={`/calculator/${prev.slug}`} className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-indigo-600 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          {prev.shortName}
        </Link>
      ) : <div />}

      {/* Dots */}
      <div className="flex items-center gap-1.5">
        {sameCategory.map((c, i) => (
          <div
            key={c.slug}
            className={`rounded-full transition-all ${
              i === currentIndex
                ? "w-2.5 h-2.5 bg-indigo-500"
                : "w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600"
            }`}
          />
        ))}
      </div>

      {next ? (
        <Link href={`/calculator/${next.slug}`} className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-indigo-600 transition-colors">
          {next.shortName}
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </Link>
      ) : <div />}
    </div>
  );
}
