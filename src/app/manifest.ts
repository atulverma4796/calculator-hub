import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CalcHub — Free Online Calculators",
    short_name: "CalcHub",
    description:
      "15+ free online calculators for EMI, SIP, compound interest, mortgage, GST, income tax, BMI, percentage, and more. Interactive charts, multi-currency support. No signup.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#6366f1",
    orientation: "portrait",
    categories: ["finance", "business", "productivity", "utilities", "education"],
    icons: [
      { src: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
