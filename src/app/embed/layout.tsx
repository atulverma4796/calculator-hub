import { ReactNode } from "react";

/**
 * Minimal layout for embed routes.
 * The root layout handles <html>/<body>/fonts/globals.css.
 * For /embed/[slug] pages, the HideOnEmbed component in root layout
 * strips the header, footer, and other site chrome.
 * For /embed (docs page), the full site shell renders normally.
 */
export default function EmbedLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
