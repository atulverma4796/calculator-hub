"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";

interface ShortcutHandlers {
  onReset?: () => void;
  onPDF?: () => void;
}

export function useKeyboardShortcuts({ onReset, onPDF }: ShortcutHandlers) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't fire shortcuts when typing in input/textarea
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      const ctrl = e.ctrlKey || e.metaKey;

      // Escape → Reset
      if (e.key === "Escape" && onReset) {
        e.preventDefault();
        onReset();
        toast.success("Reset to defaults");
      }

      // Ctrl+S → Share (copy URL)
      if (ctrl && e.key === "s") {
        e.preventDefault();
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied!");
      }

      // Ctrl+P → Download PDF
      if (ctrl && e.key === "p" && onPDF) {
        e.preventDefault();
        onPDF();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onReset, onPDF]);
}
